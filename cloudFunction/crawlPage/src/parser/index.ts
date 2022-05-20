import { Page } from 'puppeteer';
import type { IParseType } from '../index'

export async function parse(page: Page, type: IParseType) {
  const getArticleBody = () => type === "save" && page.evaluate(() => window.convertBody())
  const getArticleName = () => page.evaluate(() => window.adaptor.articleName())
  const getAuthorName = () => page.evaluate(() => window.adaptor.authorName())
  const getPublishTime = () => type === "save" && page.evaluate(() => window.adaptor.publishTime())
  const getBgImgUrl = () => type === "save" && page.evaluate(() => window.adaptor.bgImgUrl())
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
    url
  }
}
