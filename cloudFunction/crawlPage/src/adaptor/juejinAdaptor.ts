import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class JuejinAdaptor implements IArticleAdaptor {

  platform = '掘金图文'

  isMatch(url: string) {
    return /juejin\.cn\/post/.test(url)
  }

  authorName() {
    const el = document.querySelector(".username")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector("h1.article-title")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".meta-box time.time") as HTMLTimeElement
    return (el as HTMLTimeElement).dateTime
  }

  async bgImgUrl() {
    const el = document.querySelector(".article-hero")
    const url = (el as HTMLElement)?.dataset.src
    if (!url) {
      return
    }
    return await this.processImgUrl(url || undefined)
  }

  async processImgUrl(url?: string) {
    const rawPrefix = url?.split("?")[0].replace("http://", "https://")!
    const legalizeToNotionFormat = (prefix: string) => {
      const hasExt = /\.[0-9a-zA-Z]+$/.test(prefix)
      prefix = hasExt ? prefix.replace(/\.[0-9a-zA-Z]+$/, '') : prefix
      return prefix + ".png"
    }
    return isLegalNotionImgFormat(rawPrefix) ? rawPrefix : legalizeToNotionFormat(rawPrefix)
  }

  contentSelector = ".article-content"

  extractImgSrc(x: HTMLImageElement): string | undefined {
    return x.src
  }

  forbidRequest(url: string) {
    return ["api.juejin.cn", "snssdk", "abtestvm", "google", "acrawler", "goofy", "byteimg"].some(x => url.includes(x))
  }

  shouldSkip(x: string) {
    return false
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/juejin.svg?sign=03dadd81a7e3175e23e5bd5bc612d76b&t=1652873296"
}

export default new JuejinAdaptor()