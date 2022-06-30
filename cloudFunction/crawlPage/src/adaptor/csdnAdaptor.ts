import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class CsdnAdaptor implements IArticleAdaptor {

  platform = 'CSDN'

  isMatch(url: string) {
    return /blog\.csdn\.net/.test(url)
  }

  authorName() {
    const el = document.querySelector(".follow-nickName")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".title-article") || document.querySelector("title")
    return getText(el!)
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

  async getContent() {
    const content = document.querySelector("article") || document.createComment("")
    const container = document.createElement("div")
    container.append(content)
    return container
  }

  extractImgSrc(x: HTMLImageElement) {
    return x.src?.replace("http://", "https://")
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
      ".css",
      ".google.com",
      ".googlesyndication.com",
      ".js"
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/csdn.svg?sign=5b37cb2462196ef8f3ce37dd756782a0&t=1656258118"
}

export default new CsdnAdaptor()