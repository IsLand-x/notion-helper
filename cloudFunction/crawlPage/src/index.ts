import { IArticleAdaptor } from './adaptor/adaptor';
import cloud, { getWXContext } from 'wx-server-sdk'
import { getAdaptor } from './adaptor/index'
import { parse } from './parser/index'
import puppeteer from 'puppeteer'
import { Client } from '@notionhq/client'

type ParsedRes = Awaited<ReturnType<typeof parse>>

export type IParseType = "save" | "getBasicInfo"

type IEvent = {
  url: string;
  type: IParseType
}

type CloudRes<T> = {
  errMsg: string;
  data?: T
}

type IUserData = {
  articleSaveCnt?: number;
  db: string;
  key: string;
  openid: string;
  url: string;
}

cloud.init()
const _ = cloud.database().command

const debugUrl = false && "ws://localhost:9222/devtools/browser/50c34651-398b-4104-9c6d-0e6537c122a1"

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function openPage(url: string, adaptor: IArticleAdaptor) {
  const browser = !debugUrl ? await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }) : await puppeteer.connect({
    browserWSEndpoint: debugUrl
  });
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on("request", (interceptedRequest => {
    if (adaptor.forbidRequest?.(interceptedRequest.url())) {
      interceptedRequest.abort()
    } else {
      interceptedRequest.continue()
    }
  }))
  await page.setBypassCSP(true)
  await page.goto(url)
  await sleep(300)
  await page.addScriptTag({ path: './preload.js' })
  const closeBrowser = () => !debugUrl && browser.close()
  return { page, closeBrowser }
}

async function saveToNotion(res: ParsedRes, user: IUserData, adaptor: IArticleAdaptor) {
  const { url, articleName, authorName, publishTime, articleBody, bgImgUrl } = res
  console.log("URL", url);
  console.log("ArticleName", articleName)
  console.log("AuthorName", authorName)
  console.log("PublishTime", publishTime)
  console.log("BgImgUrl", bgImgUrl)
  console.log(publishTime)
  const { db, key } = user
  console.log("Db", db)
  console.log("Key", key)
  const notion = new Client({ auth: key })
  console.log(bgImgUrl ? {
    type: 'external',
    external: {
      url: bgImgUrl
    }
  } : null)
  let response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: db
    },
    icon: {
      type: "external",
      external: {
        url: adaptor.iconUrl
      }
    },
    cover: bgImgUrl ? {
      type: 'external',
      external: {
        url: bgImgUrl
      }
    } : null,
    properties: {
      Name: {
        title: [{
          text: {
            content: articleName
          },
        },],
      },
      Href: {
        url,
      },
      Date: {
        date: {
          // @ts-ignore
          start: new Date(+new Date(publishTime) + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
        }
      },
      'Add Date': {
        date: {
          start: new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
        }
      },
      Author: {
        rich_text: [{
          type: 'text',
          text: {
            content: authorName
          },
        }]
      }
    },
    // @ts-ignore
    children: articleBody
  }).catch(e => {
    console.error(e)
    console.log(articleBody)
    return e
  }) as any
  if (response.code === 'validation_error') {
    response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: db
      },
      icon: {
        type: "external",
        external: {
          url: adaptor.iconUrl
        }
      },
      cover: bgImgUrl ? {
        type: 'external',
        external: {
          url: bgImgUrl
        }
      } : null,
      properties: {
        Name: {
          title: [{
            text: {
              content: `[仅链接]` + articleName
            },
          },],
        },
        Href: {
          url,
        },
        Date: {
          date: {
            // @ts-ignore
            start: new Date(+new Date(publishTime) + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
          }
        },
        'Add Date': {
          date: {
            start: new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
          }
        },
        Author: {
          rich_text: [{
            type: 'text',
            text: {
              content: authorName
            },
          }]
        }
      },
    }).catch(e => {
      console.error(e)
      return e
    })
    if (response.code === 'validation_error') {
      return {
        errMsg: '收藏失败，可能的原因有：\n① 请不要删除或更名初始的数据库列。可在用户绑定页面重新绑定以修复 \n② 文章含有无法解析的块，可以向开发者反馈\n ③无效的Token或DatabaseID'
      }
    } else {
      return {
        errMsg: '文章过长，剪藏文章内容失败，但成功保存链接到Notion。'
      }
    }
  }
  if (response.code === 'unauthorized') {
    return {
      errMsg: 'Intergration Token错误,请重新绑定以修复。'
    }
  }
  if (response.code === 'object_not_found') {
    return {
      errMsg: 'Database ID错误或未引入integration,请重新绑定以修复。'
    }
  }
  return { errMsg: 'ok' }
}

async function getUserData(): Promise<null | IUserData> {
  const { OPENID } = cloud.getWXContext()
  const data = await cloud.database()
    .collection('user')
    .where({
      openid: OPENID
    })
    .limit(1)
    .get();
  return (data as any).data[0]
}

const tryAddCount = (openid: string) => {
  cloud.database()
    .collection('user')
    .where({ openid })
    .update({
      data: {
        articleSaveCnt: _.inc(1)
      }
    })
}

let callCount = 0

export async function main(evt: IEvent): Promise<CloudRes<{} | undefined>> {
  const { type = "save", url } = evt
  console.log("CallCount", callCount++)
  console.log("Type:", type)
  console.log("Url:", url)
  const wxCtx = getWXContext()
  console.log(wxCtx)
  const adaptor = getAdaptor(url)
  if (!adaptor) {
    return {
      errMsg: '文章链接错误或暂不支持该平台'
    }
  }
  const userData = await getUserData()
  if (!userData) {
    return {
      errMsg: '请先根据教程绑定到Notion助手'
    }
  }
  const { page, closeBrowser } = await openPage(url, adaptor)
  const parsedRes = await parse(page, type).finally(closeBrowser)
  if (type === "getBasicInfo") {
    return {
      errMsg: "ok",
      data: {
        articleName: parsedRes.articleName,
        author: parsedRes.authorName
      }
    }
  }
  const res = await saveToNotion(parsedRes, userData, adaptor)
  tryAddCount(userData.openid)
  return res
}
