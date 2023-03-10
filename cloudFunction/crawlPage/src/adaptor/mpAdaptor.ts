import { IArticleAdaptor } from "./adaptor"
import { getText } from "./util"

class MpAdaptor implements IArticleAdaptor {

  platform = '微信公众号'

  isMatch(url: string) {
    return /mp\.weixin\.qq\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector("#js_name") || document.querySelector("#profile_share2 .account_meta.js_go_profile")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector("#activity-name") || document.querySelector("#js_video_page_title")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector("#publish_time")
    return getText(el!)
  }

  async bgImgUrl() {
    const url = document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')
    return url ? this.processImgUrl(url) : undefined
  }

  processImgUrl(url?: string) {
    return url?.split("?")[0].replace("http://", "https://") + ".png"
  }

  contentSelector = "#js_content"

  extractImgSrc(x: HTMLImageElement) {
    return x.dataset.src || x.src
  }

  shouldSkip(x: string) {
    return ["MPPROFILE", "MPVIDEOSNAP"].includes(x.toUpperCase())
  }

  forbidRequest(url: string) {
    return ["res.wx.qq.com"].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/wechat.svg?sign=e7bf96a5a33a7591fc93aafd20675cf1&t=1652873000"
}

export default new MpAdaptor()