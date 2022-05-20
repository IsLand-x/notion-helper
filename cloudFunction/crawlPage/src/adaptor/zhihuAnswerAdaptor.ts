import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class ZhihuPostAdaptor implements IArticleAdaptor {

  platform = '知乎问答'

  isMatch(url: string) {
    return /www\.zhihu\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector(".AnswerItem .AuthorInfo meta[itemprop='name']") as HTMLMetaElement
    return el.content
  }

  articleName() {
    const el = document.querySelector(".QuestionHeader .QuestionHeader-title")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".AnswerItem .ContentItem-time span")
    return getText(el!).split(" ").slice(1).join(" ")
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    const prefix = url?.split("?")[0].replace("http://", "https://")
    return !url
      ? undefined
      : isLegalNotionImgFormat(prefix)
        ? prefix
        : undefined
  }

  contentSelector = ".RichContent.RichContent--unescapable .RichText"

  extractImgSrc(x: HTMLImageElement) {
    return x.dataset.original || x.dataset.actualsrc || x.src
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