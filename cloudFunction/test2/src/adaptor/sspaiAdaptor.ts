import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"



class SspaiAdaptor implements IArticleAdaptor {

  platform = '少数派图文'

  isMatch(url: string) {
    return /sspai\.com\/post/.test(url)
  }

  authorName() {
    const el = document.querySelector(".nickname")
    return getText(el)
  }

  articleName() {
    const el = document.querySelector("#article-title")
    return getText(el)
  }

  publishTime() {
    return new Date().toString()
  }

  bgImgUrl() {
    const el = document.querySelector(".article-banner img")
    const url = (el as HTMLImageElement).src
    return this.processImgUrl(url || undefined)
  }

  async processImgUrl(url?: string) {
    const prefix = url?.split("?")[0].replace("http://", "https://")
    return !url
      ? null
      : isLegalNotionImgFormat(prefix)
        ? prefix
        : null
  }

  contentSelector = ".article-body"

  extractImgSrc(x: HTMLImageElement): string | null {
    return x.dataset.original
  }

  shouldSkip(x: string) {
    return [].includes(x)
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/sspai.svg"
}

export default new SspaiAdaptor()