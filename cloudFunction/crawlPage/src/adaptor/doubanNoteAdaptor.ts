import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

export class DoubanNoteAdaptor implements IArticleAdaptor {

  platform = '豆瓣笔记'

  isMatch(url: string) {
    return /www\.douban\.com\/note/.test(url)
  }

  authorName() {
    const el = document.querySelector(".note-author")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".note-header.note-header-container h1")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".note-header.note-header-container .pub-date")
    return getText(el!)
  }

  async bgImgUrl() {
    return await undefined;
  }

  async processImgUrl(url?: string) {
    const prefix = url?.split("?")[0].replace("http://", "https://").replace(".webp", ".jpeg")
    return !url
      ? undefined
      : isLegalNotionImgFormat(prefix)
        ? prefix
        : undefined
  }

  contentSelector = "#link-report"

  extractImgSrc(x: HTMLImageElement): string | undefined {
    return x.src
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return ["check_clean_content", "google"].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/douban.svg?sign=67b067b35836681cdd121444c0f57a13&t=1652853130"
}

export default new DoubanNoteAdaptor()