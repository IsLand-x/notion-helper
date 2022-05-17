import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class ZhihuPostAdaptor implements IArticleAdaptor {

  platform = '知乎问答'

  isMatch(url: string) {
    return /www\.zhihu\.com\/question/.test(url)
  }

  authorName() {
    const el = document.querySelector(".Card.AnswerCard .AuthorInfo-head .UserLink-link") ||
      document.querySelector(".Card.AnswerCard .AuthorInfo-head .UserLink")
    return getText(el)
  }

  articleName() {
    const el = document.querySelector(".QuestionHeader .QuestionHeader-title")
    return getText(el)
  }

  publishTime() {
    const el = document.querySelector(".Card.AnswerCard .ContentItem-time span")
    return getText(el).split(" ").slice(1).join(" ")
  }

  bgImgUrl(): null {
    return null
  }

  async processImgUrl(url?: string) {
    const prefix = url?.split("?")[0].replace("http://", "https://")
    return !url
      ? null
      : isLegalNotionImgFormat(prefix)
        ? prefix
        : null
  }

  contentSelector = ".RichContent.RichContent--unescapable .RichText"

  extractImgSrc(x: HTMLImageElement): string | null {
    return x.dataset.original
  }

  shouldSkip(x: string) {
    return [].includes(x)
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/zhihu.png?sign=0e50868ef0296cd857d99e11523c19b8&t=1652502082"
}

export default new ZhihuPostAdaptor()