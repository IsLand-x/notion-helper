import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat, sleep } from "./util"

class NeteaseMobileAdaptor implements IArticleAdaptor {

  platform = '移动端网易新闻'

  isMatch(url: string) {
    return /m\.163\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector(".header-subtitle-middle .s-source")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".header-title")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".s-ptime")
    return getText(el!).trim().slice(0, 19)
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    return isLegalNotionImgFormat(url) ? url : undefined
  }

  contentSelector = 'article'

  extractImgSrc(x: HTMLImageElement) {
    return x.parentElement?.dataset.echo
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
      'bcebos.com',
      'ws.126.net',
      'baidustatic.com',
      'acstatic-dun.126.net',
      'urswebzj.nosdn.127.net',
      'acstatic-dun.126.net',
      'bdstatic.com',
      'toutiao.com',
      'pstatp.com'
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/netease.png?sign=2a3f08b842bdf7379aa86cb595a2221f&t=1653792323"
}

export default new NeteaseMobileAdaptor()