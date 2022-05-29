import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat, sleep } from "./util"

class QQChannelAdpator implements IArticleAdaptor {

  platform = '微博移动端'

  isMatch(url: string) {
    return /(m|api)\.weibo\.cn/.test(url)
  }

  authorName() {
    const el = document.querySelector(".m-text-box b") || document.querySelector(".m-text-cut")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".m-text-box b") || document.querySelector(".m-text-cut")
    return getText(el!) + '的微博'
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

  contentSelector = '.weibo-og'

  extractImgSrc(x: HTMLImageElement) {
    return x.src
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
      '.jpg',
      '.png',
      '.ttf',
      '.woff',
      'cards.css',
      'base.css',
      'baiduad',
      'pos.baidu.com'
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/weibo.svg?sign=c8d0e8d0d165437e0b88f92d16083059&t=1653824271"
}

export default new QQChannelAdpator()