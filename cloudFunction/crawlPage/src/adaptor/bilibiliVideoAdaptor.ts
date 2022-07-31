import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class bilibiliVideoAdaptor implements IArticleAdaptor {

  platform = 'B站视频'

  isMatch(url: string) {
    return /(b23\.tv)|(bilibili\.com)/.test(url)
  }

  authorName() {
    const el = document.querySelector(".username")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".video-title.tit")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".pudate-text")
    return getText(el!)
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

  forbidRequest(url: string) {
    return [
      ".css",
      ".woff",
      ".svg",
      "bilivideo.com",
      "data.bilibili.com",
    ].some(x => url.includes(x))
  }

  async customCrawlPageLogic() {
    const urlParams = new URLSearchParams(window.location.search)
    const page = urlParams.get("p") || 1
    return [{
      type: 'embed',
      embed: {
        url: `https://player.bilibili.com/player.html?bvid=${location.pathname.split('/').slice(-1)[0]}&page=${page}`
      }
    }]
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/bilibili.svg?sign=5ec53ed6636eb21bbcebb7fabcec97c5&t=1654839452"
}

export default new bilibiliVideoAdaptor()