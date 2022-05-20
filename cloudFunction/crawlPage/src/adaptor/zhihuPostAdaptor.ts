import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class ZhihuPostAdaptor implements IArticleAdaptor {

  platform = '知乎专栏'

  isMatch(url: string) {
    return /zhuanlan\.zhihu\.com\/p/.test(url)
  }

  authorName() {
    const el = document.querySelector(".UserLink.AuthorInfo-name")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".Post-Title")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".ContentItem-time span") ||
      document.querySelector(".ContentItem-time")
    return getText(el!).split(" ").slice(1).join(" ")
  }

  async bgImgUrl() {
    const el = document.querySelector(".TitleImage")
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

  contentSelector = ".Post-RichTextContainer"

  extractImgSrc(x: HTMLImageElement) {
    return x.dataset.original || x.src
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return ["zhimg"].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/zhihu.svg?sign=647ec89894c1427c1abd4085ac2a8058&t=1652853009"
}

export default new ZhihuPostAdaptor()