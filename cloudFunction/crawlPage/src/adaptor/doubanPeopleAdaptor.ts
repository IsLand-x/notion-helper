import { DoubanNoteAdaptor } from "./doubanNoteAdaptor"
import { getText } from "./util"

class DoubanReviewAdaptor extends DoubanNoteAdaptor {

  platform = '豆瓣广播'

  isMatch(url: string) {
    return /douban\.com\/people/.test(url)
  }

  authorName() {
    const el = document.querySelector(".hd .text a")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector("#content h1")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".pubtime")
    return getText(el!)
  }

  contentSelector = ".bd.sns"
}

export default new DoubanReviewAdaptor()