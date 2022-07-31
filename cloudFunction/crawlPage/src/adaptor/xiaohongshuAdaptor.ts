import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class XiaohongshuAdaptor implements IArticleAdaptor {

  platform = '小红书'

  isMatch(url: string) {
    return /xiaohongshu\.com/.test(url) || /xhslink.com/.test(url)
  }

  authorName() {
    const el = document.querySelector(".right-card .name-detail")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector("h1.title")
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
    // 文本内容
    const content = document.querySelector(".content")
    content && container.appendChild(content)
    // 图片内容
    const imgCarousel = document.querySelectorAll(".slide li span") as any as HTMLSpanElement[]
    if (imgCarousel) {
      Array.from(imgCarousel).forEach((e: HTMLSpanElement) => {
        const img = document.createElement("img")
        img.src = e.style.backgroundImage.split("\"")[1]
        console.log(img)
        container.appendChild(img)
      })
    }
    // 视频内容
    const video = document.querySelector("video")
    video && container.appendChild(video)

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

  waitNavigation = true

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/xiaohongshu.svg?sign=31c1034654c6c2bbab2886f0a7cc6f05&t=1656604628"
}

export default new XiaohongshuAdaptor()