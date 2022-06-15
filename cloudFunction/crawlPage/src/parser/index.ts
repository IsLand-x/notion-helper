import { Page } from 'puppeteer';
import type { IParseType } from '../index'

const shouldSave = (type: string) => ["shortcut", "save","crx"].includes(type)

export async function parse(page: Page, type: IParseType) {
  let errMsg: string[] = []

  console.log("waiting")
  await page.evaluate(async () => {
    await window.adaptor.waitUntil?.()
  })
  console.log("start Crawling")
  const getArticleBody = () => shouldSave(type) ? page.evaluate(() => window.adaptor.customCrawlPageLogic?.() || window.convertBody()).catch(e => {
    errMsg.push("文章内容提取失败")
    console.log(e)
    return undefined
  }) : []
  const getArticleName = () => page.evaluate(() => window.adaptor.articleName()).catch(e => {
    errMsg.push("文章标题提取失败")
    console.log(e)
    return "文章标题提取失败"
  })
  const getAuthorName = () => page.evaluate(() => window.adaptor.authorName()).catch(e => {
    errMsg.push("作者名称提取失败")
    console.log(e)
    return "作者名称提取失败"
  })
  const getPublishTime = () => shouldSave(type) && page.evaluate(() => {
    // crx specific logic
    if (window.location.href === 'about:blank') {
      return (window as any).evt.date
    }
    return window.adaptor.publishTime()
  }).catch(e => {
    errMsg.push("发布日期提取失败")
    console.log(e)
    return new Date()
  })
  const getBgImgUrl = () => shouldSave(type)  && page.evaluate(() => window.adaptor.bgImgUrl()).catch(e => {
    errMsg.push("背景图提取失败")
    console.log(e)
    return undefined
  })
  const getUrl = () => page.evaluate(() => {
    // crx specific logic
    if (window.location.href === 'about:blank') {
      return (window as any).evt.href
    }
    return window.location.href
  })
  const [
    articleName,
    authorName,
    publishTime,
    bgImgUrl,
    articleBody,
    url
  ] = await Promise.all([
    getArticleName(),
    getAuthorName(),
    getPublishTime(),
    getBgImgUrl(),
    getArticleBody(),
    getUrl()
  ])

  return {
    articleName,
    authorName,
    publishTime,
    bgImgUrl,
    articleBody,
    url,
    errMsg: errMsg.join(',')
  }
}
