import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class SegmentfaultAdaptor implements IArticleAdaptor {

  platform = '思否图文'

  isMatch(url: string) {
    return /segmentfault\.com\/a/.test(url)
  }

  authorName() {
    const el = document.querySelector("strong.align-self-center.font-size-14")
    return getText(el!)
  }

  articleName() {
    const sliceIdx = document.title.lastIndexOf(" - SegmentFault 思否")
    return document.title.slice(0, sliceIdx)
  }

  publishTime() {
    const el = document.querySelector("time") as HTMLTimeElement
    return el.dateTime
  }

  async bgImgUrl() {
    return await undefined
  }

  async processImgUrl(url?: string) {
    return isLegalNotionImgFormat(url) ? url : undefined
  }

  contentSelector = "article.article"

  extractImgSrc(x: HTMLImageElement) {
    const rawSrc = x.dataset.src!
    return rawSrc.startsWith("/") ? "https://segmentfault.com" + rawSrc : rawSrc
  }

  forbidRequest(url: string) {
    return ["google", "/img/remote", "umi.js", "umi.css"].some(x => url.includes(x))
  }

  shouldSkip(x: string) {
    return false
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/segmentfault.svg"
}

export default new SegmentfaultAdaptor()