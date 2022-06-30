import { DoubanNoteAdaptor } from "./doubanNoteAdaptor"
import { getText } from "./util"

class DoubanReviewAdaptor extends DoubanNoteAdaptor {

  platform = '豆瓣广播'

  isMatch(url: string) {
    return /douban\.com\/people/.test(url)
  }

  authorName() {
    const el = document.querySelector(".hd .text a") ||document.querySelector(".user-info strong")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector("#content h1") || window.document.title
    return typeof el === 'string'?el:getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".pubtime") || document.querySelector(".timestamp")
    return getText(el!)
  }

  contentSelector = ''
  
  getContent() {
    const container = document.createElement("div")
    const bdsns = document.querySelector(".bd.sns")
    const content = document.querySelector(".content")
    bdsns && container.appendChild(bdsns)
    content && container.appendChild(content)
    return container
  }
}

export default new DoubanReviewAdaptor()