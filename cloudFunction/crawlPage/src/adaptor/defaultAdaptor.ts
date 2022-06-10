import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class defaultAdaptor implements IArticleAdaptor {

  platform = '兜底'

  isMatch(url: string) {
    return true
  }

  authorName() {
    return ''
  }

  articleName() {
    return document.title
  }

  publishTime() {
    return undefined
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    return isLegalNotionImgFormat(url) ? url : undefined
  }

  contentSelector = ''

  extractImgSrc(x: HTMLImageElement) {
    return x.src
  }

  shouldSkip(x: string) {
    return false
  }

  async getContent() {
    const container = document.createElement("div")
    return container
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

export default new defaultAdaptor()