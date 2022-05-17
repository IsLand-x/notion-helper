import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class DoubanNoteAdaptor implements IArticleAdaptor {

  platform = '豆瓣笔记'

  isMatch(url: string) {
    return /www\.douban\.com\/note/.test(url)
  }

  authorName() {
    const el = document.querySelector(".note-author")
    return getText(el)
  }

  articleName() {
    const el = document.querySelector(".note-header.note-header-container h1")
    return getText(el)
  }

  publishTime() {
    const el = document.querySelector(".note-header.note-header-container .pub-date")
    return getText(el)
  }

  bgImgUrl(): null {
    return null
  }

  async processImgUrl(url?: string) {
    const prefix = url?.split("?")[0].replace("http://", "https://").replace(".webp", ".jpeg")
    return !url
      ? null
      : isLegalNotionImgFormat(prefix)
        ? prefix
        : null
  }

  contentSelector = "#link-report"

  extractImgSrc(x: HTMLImageElement): string | null {
    return x.src
  }

  shouldSkip(x: string) {
    return [].includes(x)
  }

  forbidRequest(url: string) {
    if (url.includes("check_clean_content") ||
      url.includes("google")) {
      return true
    }
    return false
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/douban.png"
}

export default new DoubanNoteAdaptor()