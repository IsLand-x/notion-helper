import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class crxAdaptor implements IArticleAdaptor {

  platform = 'crx'

  isMatch(url: string) {
    return url==='about:blank'
  }

  authorName() {
    return getText(document.querySelector("#__notion__helper__author__")!)
  }

  articleName() {
    return document.title
  }

  publishTime() {
    return getText(document.querySelector("#__notion__helper__date__")!) || undefined
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    return isLegalNotionImgFormat(url) ? url : undefined
  }

  contentSelector = '#__notion__helper__container__'

  extractImgSrc(x: HTMLImageElement) {
    return x.src
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
      ".css",
      ".woff",
      ".svg",
      ".js",
      "data:",
      ".png",
      ".svg",
      ".jpeg",
      ".jpg",
      ".gif",
      ".webp"
    ].some(x => url.includes(x))
  }

  iconUrl = ""
}

export default new crxAdaptor()