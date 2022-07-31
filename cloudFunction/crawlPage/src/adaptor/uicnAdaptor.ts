import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class UicnAdaptor implements IArticleAdaptor {

  platform = 'UICN作品集'

  isMatch(url: string) {
    return /uisdc\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector(".meta-item.meta-author")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".post-title") || document.querySelector("title")
    return getText(el!)
  }

  publishTime() {
    return undefined
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    return isLegalNotionImgFormat(url) ? url : undefined
  }

  contentSelector = ''

  async getContent() {
    const container = document.createElement("div")
    const article = document.querySelector(".article")
    container.appendChild(article!)
    const imgZooms = document.querySelectorAll(".img-zoom img")
    imgZooms.forEach((e) => {
      e.parentNode?.parentNode?.appendChild(e)
    })
    return container
  }

  extractImgSrc(x: HTMLImageElement) {
    return x.currentSrc
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/uicn.svg?sign=dcb27d227f52d81e321c7fe7a81da951&t=1656601620"
}

export default new UicnAdaptor()