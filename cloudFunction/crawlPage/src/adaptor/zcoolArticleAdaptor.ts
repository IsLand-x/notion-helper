import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class ZcoolArticleAdaptor implements IArticleAdaptor {

  platform = '站酷文章'

  isMatch(url: string) {
    return /zcool\.com\.cn\/article/.test(url)
  }

  authorName() {
    const el = document.querySelector("span[size='16'][color='black3']")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".contentTitle") || document.querySelector("title")
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

  contentSelector = '.imgCon'

  extractImgSrc(x: HTMLImageElement) {
    return x.src?.replace("http://", "https://")
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
      ".css",
      ".js",
      "img.zcool.cn"
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/zcool.svg?sign=c17afd54800fb2bb129e35341ee3063e&t=1656605137"
}

export default new ZcoolArticleAdaptor()