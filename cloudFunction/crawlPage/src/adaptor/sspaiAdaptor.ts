import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class SspaiAdaptor implements IArticleAdaptor {

  platform = '少数派图文'

  isMatch(url: string) {
    return /sspai\.com\/post/.test(url)
  }

  authorName() {
    const el = document.querySelector(".nickname")
    return getText(el!)
  }

  articleName() {
    // 少数派有两种posts，对应不同的banner，articleName也不同
    const bgImgUrl =  document.querySelector(".article-banner img");
    const el = bgImgUrl ? document.querySelector("#article-title") : document.querySelector(".article-info .title")
    return getText(el!)
  }

  publishTime() {
    return new Date().toString()
  }

  async bgImgUrl() {
    const el = document.querySelector(".article-banner img")
    const url = (el as HTMLImageElement)?.src
    return this.processImgUrl(url || undefined)
  }

  async processImgUrl(url?: string) {
    const prefix = url?.split("?")[0].replace("http://", "https://")
    return !url
      ? undefined
      : isLegalNotionImgFormat(prefix)
        ? prefix
        : undefined
  }

  contentSelector = ".article-body"

  extractImgSrc(x: HTMLImageElement) {
    return x.dataset.original
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return ["google", "cdn.sspai.com", "post.sspai.com", "res.wx.qq.com", "clarity", "baidu", "bdstatic", "gtimg", "youke", "beacon.cdn.qq.com"].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/sspai.svg"
}

export default new SspaiAdaptor()