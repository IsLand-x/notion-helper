import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class SegmentfaultAdaptor implements IArticleAdaptor {

  platform = '思否图文'

  isMatch(url: string) {
    return /segmentfault\.com\/a/.test(url)
  }

  authorName() {
    const el = document.querySelector("strong.align-self-center.font-size-14")
    return getText(el)
  }

  articleName() {
    const el = document.querySelector("a.text-body")
    return getText(el)
  }

  publishTime() {
    const el = document.querySelector("time") as HTMLTimeElement
    return el.dateTime
  }

  bgImgUrl(): null {
    return null
  }

  processImgUrl(url?: string): string | null {
    return isLegalNotionImgFormat(url) ? url : null
  }

  contentSelector = "article.article"

  extractImgSrc(x: HTMLImageElement): string | null {
    const rawSrc = x.dataset.src
    return rawSrc.startsWith("/") ? "https://segmentfault.com" + rawSrc : rawSrc
  }

  shouldSkip(x: string) {
    return [].includes(x)
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/segmentfault.svg"
}

export default new SegmentfaultAdaptor()