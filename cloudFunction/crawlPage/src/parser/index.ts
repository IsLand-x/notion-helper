import { Page } from 'puppeteer';
import type { IParseType } from '../index'

export async function parse(page: Page, type: IParseType) {
  let errMsg: string[] = []

  console.log("waiting")
  await page.evaluate(async () => {
    await window.adaptor.waitUntil?.()
  })
  console.log("start Crawling")
  const getArticleBody = () => type === "save" ? page.evaluate(() => window.adaptor.customCrawlPageLogic?.() || window.convertBody()).catch(e => {
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
  const getPublishTime = () => type === "save" && page.evaluate(() => window.adaptor.publishTime()).catch(e => {
    errMsg.push("发布日期提取失败")
    console.log(e)
    return new Date()
  })
  const getBgImgUrl = () => type === "save" && page.evaluate(() => window.adaptor.bgImgUrl()).catch(e => {
    errMsg.push("背景图提取失败")
    console.log(e)
    return undefined
  })
  const getUrl = () => page.url()
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
