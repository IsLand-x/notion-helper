import { DoubanNoteAdaptor } from "./doubanNoteAdaptor"
import { getText } from "./util"

class DoubanGroupAdaptor extends DoubanNoteAdaptor {

  platform = '豆瓣小组'

  isMatch(url: string) {
    return /douban\.com\/group/.test(url)
  }

  authorName() {
    const el = document.querySelector(".topic-doc .from a")
    return getText(el!)
  }

  articleName(): string {
    const el = document.querySelector(".article h1")
    return getText(el!)
  }
  publishTime() {
    const el = document.querySelector(".create-time.color-green")
    return getText(el!)
  }
}

export default new DoubanGroupAdaptor()