import { Page } from 'puppeteer';

export async function parse(page: Page) {
  const getArticleBody = () => page.evaluate(() => window.convertBody())
  const getArticleName = () => page.evaluate(() => window.adaptor.articleName())
  const getAuthorName = () => page.evaluate(() => window.adaptor.authorName())
  const getPublishTime = () => page.evaluate(() => window.adaptor.publishTime())
  const getBgImgUrl = () => page.evaluate(() => window.adaptor.bgImgUrl())
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
