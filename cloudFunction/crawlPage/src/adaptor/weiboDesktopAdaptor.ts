import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat, sleep } from "./util"

class weiboDesktopAdpator implements IArticleAdaptor {

  platform = '微博PC'

  isMatch(url: string) {
    return /weibo\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector("a[class*='ALink_default'][class*='head_name']")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector("a[class*='ALink_default'][class*='head_name']")
    return getText(el!) + '的微博'
  }

  publishTime() {
    return undefined
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    url = url?.replace('/orj360/', '/mw2000/')
    return isLegalNotionImgFormat(url) ? url : undefined
  }

  contentSelector = '.wbpro-feed-content'

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
      'pos.baidu.com',
      'weibo.cn/intake'
    ].some(x => url.includes(x))
  }

  async waitUntil() {
    for (let i = 0; i < 5; i++) {
      const app = document.querySelector("a[class*='ALink_default'][class*='head_name']")
      if (app) {
        return
      }
      await sleep(1000)
    }
    throw new Error("Time out")
  }

  waitNavigation = true

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/weibo.svg?sign=c8d0e8d0d165437e0b88f92d16083059&t=1653824271"
}

export default new weiboDesktopAdpator()