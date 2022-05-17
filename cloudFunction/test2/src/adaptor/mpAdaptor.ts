import { IArticleAdaptor } from "./adaptor"
import { getText } from "./util"

class MpAdaptor implements IArticleAdaptor {

  platform = '微信公众号'

  isMatch(url: string) {
    return /mp\.weixin\.qq\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector("#js_name")
    return getText(el)
  }

  articleName() {
    const el = document.querySelector("#activity-name")
    return getText(el)
  }

  publishTime() {
    const el = document.querySelector("#publish_time")
    return getText(el)
  }

  async bgImgUrl() {
    const url = document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')
    return this.processImgUrl(url || undefined)
  }

  processImgUrl(url?: string) {
    return url?.split("?")[0].replace("http://", "https://") + ".png"
  }

  contentSelector = "#js_content"

  extractImgSrc(x: HTMLImageElement): string | null {
    return x.dataset.src
  }

  shouldSkip(x: string) {
    return ["MPPROFILE", "MPVIDEOSNAP"].includes(x)
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/WeChat_logo2.svg?sign=7c85c832ca495356bf87a586fa680acd&t=1650423985"
}

export default new MpAdaptor()