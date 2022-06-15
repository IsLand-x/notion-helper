import { IArticleAdaptor } from './adaptor/adaptor';
import cloud, { getWXContext } from 'wx-server-sdk'
import { getAdaptor } from './adaptor/index'
import { parse } from './parser/index'
import puppeteer from 'puppeteer'
import { Client } from '@notionhq/client'

type ParsedRes = Awaited<ReturnType<typeof parse>>

export type IParseType = IEvent["type"]

type IEvent = {
  type: "save" | "getBasicInfo";
  url: string;
} | {
  type:"shortcut";
  url:string;
  secret:string;
} | {
  type: "crx";
  secret: string;
  articleName: string
  href: string
  date: string
  addDate: string
  author: string
  content: string
}

type EventHelper<T extends IEvent["type"],U = IEvent> = U extends { type: T } ? U : never

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

const debugUrl = false && "ws://localhost:9222/devtools/browser/c946f795-f9de-4474-85f9-2fc36736233b"

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function openPage(url: string, adaptor: IArticleAdaptor, evt:IEvent) {
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
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53');
  await page.setCookie(...(adaptor.cookie || []))
  if (isFromCrx(evt)) {
    await page.addScriptTag({
      content:`window.evt = ${JSON.stringify(evt)}`
    })
    await page.evaluate(() => {
      const title = document.createElement("title")
      title.textContent = evt.articleName
      document.head.appendChild(title)

      const container = document.createElement("div")
      container.id = "__notion__helper__container__"
      container.innerHTML = evt.content
      document.body.appendChild(container)

      const author = document.createElement("div")
      author.id = "__notion__helper__author__"
      author.innerHTML = evt.author
      document.body.appendChild(author)
    })
  } else {
    await page.goto(url)
  }
  if (adaptor.waitNavigation) {
    await page.waitForNavigation()
  }
  await page.addScriptTag({ path: './preload.js' })
  await sleep(100)
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
  const { db, key } = user
  console.log("Db", db)
  console.log("Key", key)
  const notion = new Client({ auth: key })
  const requestPayload = {
    parent: {
      type: "database_id",
      database_id: db
    },
    icon: adaptor.iconUrl !== '' ? {
      type: "external",
      external: {
        url: adaptor.iconUrl
      }
    } : undefined,
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
      Date: [undefined,null].includes(publishTime) ? undefined : {
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
  }
  let response = await notion.pages.create(requestPayload as any).catch(e => {
    console.error(e)
    console.log(articleBody)
    return e
  }) as any
  if (debugUrl) {
    console.log(articleBody)
  }
  if (response.code === 'validation_error') {
    requestPayload.properties.Name = {
      title: [{
        text: {
          content: `[仅链接]` + articleName
        },
      },],
    }
    delete requestPayload.children;
    response = await notion.pages.create(requestPayload as any).catch(e => {
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
  return {
    errMsg:
      adaptor.platform === '兜底'
        ? '暂不支持该平台内容剪藏，但保存链接到Notion'
        : res.errMsg
          ? res.errMsg + ',但成功保存链接到Notion'
          : 'ok',
    data: {
      articleName,
      author:authorName
    }
  }
}

async function getUserData(secret?:string): Promise<null | IUserData> {
  const { OPENID } = cloud.getWXContext()
  const data = await cloud.database()
    .collection('user')
    .where(OPENID ? {
      openid: OPENID
    } : {
      key:secret
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
        articleSaveCnt: _.inc(1),
        lastUseDate: new Date()
      }
    })
}

let callCount = 0

function isFromMP(evt: IEvent): evt is EventHelper<"getBasicInfo" | "save"> {
  return ["getBasicInfo","save"].includes(evt.type)
}

function isFromCrx(evt: IEvent): evt is EventHelper<"crx">{
  return evt.type === 'crx'
}

function isFromShortcut(evt: IEvent): evt is EventHelper<"shortcut">{
  return evt.type === 'shortcut'
}

export async function main(evt: IEvent): Promise<CloudRes<{} | undefined>> {
  console.log(evt)
  let type = evt.type,
    url = 'about:blank', // default value for crx
    secret
  if (isFromShortcut(evt) || isFromMP(evt)) {
    url = evt.url
  }
  if (isFromCrx(evt) || isFromShortcut(evt)) {
    secret = evt.secret
  }
  console.log("CallCount", callCount++)
  console.log("Type:", type)
  console.log("Url:", url)
  const wxCtx = getWXContext()
  console.log(wxCtx)
  const userData = await getUserData(secret)
  if (!userData) {
    return {
      errMsg: '请先根据教程绑定到Notion助手'
    }
  }
  const adaptor = getAdaptor(url)
  console.log(evt)
  const { page, closeBrowser } = await openPage(url, adaptor!,evt)
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
  const res = await saveToNotion(parsedRes, userData, adaptor!)
  tryAddCount(userData.openid)
  return res
}
