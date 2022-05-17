import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class ZhihuPostAdaptor implements IArticleAdaptor {

  platform = '知乎专栏'

  isMatch(url: string) {
    return /zhuanlan\.zhihu\.com\/p/.test(url)
  }

  authorName() {
    const el = document.querySelector(".UserLink.AuthorInfo-name")
    return getText(el)
  }

  articleName() {
    const el = document.querySelector(".Post-Title")
    return getText(el)
  }

  publishTime() {
    const el = document.querySelector(".ContentItem-time span") ||
      document.querySelector(".ContentItem-time")
    return getText(el).split(" ").slice(1).join(" ")
  }

  bgImgUrl() {
    const el = document.querySelector(".TitleImage")
    const url = (el as HTMLImageElement)?.src
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

  contentSelector = ".Post-RichTextContainer"

  extractImgSrc(x: HTMLImageElement): string | null {
    return x.dataset.original
  }

  shouldSkip(x: string) {
    return [].includes(x)
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/zhihu.png?sign=0e50868ef0296cd857d99e11523c19b8&t=1652502082"
}

export default new ZhihuPostAdaptor()