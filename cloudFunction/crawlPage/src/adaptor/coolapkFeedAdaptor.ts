import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class coolapkFeedAdaptor implements IArticleAdaptor {

  platform = '酷安feed'

  isMatch(url: string) {
    return /www\.coolapk\.com\/feed/.test(url)
  }

  authorName() {
    const el = document.querySelector(".username-item p")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".message-title") || document.querySelector("title")
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
    const feedMessage = document.querySelector(".feed-message") || document.createComment('')
    const messageImageGroup = document.querySelector(".message-image-group") || document.createComment("")
    const container = document.createElement("div")
    container.append(feedMessage);
    container.append(messageImageGroup)
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
      ".js",
      ".css",
      "data:image"
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/coolapk.svg?sign=afd08253f4e55d727e33548f066b3643&t=1654841991"
}

export default new coolapkFeedAdaptor()