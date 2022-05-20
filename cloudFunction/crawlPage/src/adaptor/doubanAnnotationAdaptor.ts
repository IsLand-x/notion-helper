import { DoubanNoteAdaptor } from "./doubanNoteAdaptor"
import { getText } from "./util"

class DoubanAnnotationAdaptor extends DoubanNoteAdaptor {

  platform = '豆瓣读书笔记'

  isMatch(url: string) {
    return /douban\.com.+annotation/.test(url)
  }

  authorName() {
    const el = document.querySelector(".info h6 a")
    return getText(el!)
  }

  articleName() {
    const bookName = document.querySelector(".name")
    const page = document.querySelector("#content h1")
    return getText(bookName!) + getText(page!)
  }

  publishTime() {
    const el = document.querySelector(".pubtime")
    return getText(el!)
  }
}

export default new DoubanAnnotationAdaptor()