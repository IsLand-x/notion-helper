import { DoubanNoteAdaptor } from "./doubanNoteAdaptor"
import { getText } from "./util"

class DoubanReviewAdaptor extends DoubanNoteAdaptor {

  platform = '豆瓣影评/书评'

  isMatch(url: string) {
    return /douban\.com\/review/.test(url)
  }

  authorName() {
    const el = document.querySelector(".main header.main-hd a")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".article h1")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".main header.main-hd .main-meta")
    return getText(el!)
  }
}

export default new DoubanReviewAdaptor()