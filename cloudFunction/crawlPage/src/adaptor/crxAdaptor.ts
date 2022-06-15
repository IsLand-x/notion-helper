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
    const link = getText(document.querySelector("#__notion__helper__link__")!)
    const src = x.getAttribute("src")! || x.getAttribute("data-src")! || x.getAttribute("data-original")! || ""
    let prefix = ""
    try {
      const url = new URL(link)
      prefix = url.origin
    } catch (e) {
      prefix = ""
    }
    return isLegalNotionImgFormat(src) && src.startsWith("http")
      ? x.getAttribute("src")!
      : (prefix + x.getAttribute("src"))
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