import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat, sleep } from "./util"

class weiboDesktopAdpator implements IArticleAdaptor {

  platform = '微博PC头条'

  isMatch(url: string) {
    return /weibo\.com\/ttarticle/.test(url)
  }

  authorName() {
    const el = document.querySelector(".name.m-text-cut")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".f-art-tit")
    return getText(el!)
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

  contentSelector = '.f-art'

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
      'weibo.cn/intake',
      '/ttarticle/x/m/aj/recommend'
    ].some(x => url.includes(x))
  }

  async waitUntil() {
    for (let i = 0; i < 5; i++) {
      const app = document.querySelector(".name.m-text-cut")
      if (app) {
        return
      }
      console.log("waiting")
      await sleep(1000)
    }
    throw new Error("Time out")
  }

  waitNavigation = false

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/weibo.svg?sign=c8d0e8d0d165437e0b88f92d16083059&t=1653824271"
}

export default new weiboDesktopAdpator()