import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class xiaoyuzhoufmAdaptor implements IArticleAdaptor {

  platform = '小宇宙fm'

  isMatch(url: string) {
    return /www\.xiaoyuzhoufm\.com\/episode/.test(url)
  }

  authorName() {
    const el = document.querySelector(".name")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector("header .title") || document.querySelector("title")
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
    const audio = document.querySelector("audio") || document.createComment("")
    const content = document.querySelector("article") || document.createComment("")
    const container = document.createElement("div")
    container.append(audio);
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
      ".jpg",
      ".jpeg",
      ".png",
      ".css",
      "image.xyzcdn.net"
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/xiaoyuzhoufm.png?sign=dcf76227ef81f1ff9616e35a83b910ea&t=1654845878"
}

export default new xiaoyuzhoufmAdaptor()