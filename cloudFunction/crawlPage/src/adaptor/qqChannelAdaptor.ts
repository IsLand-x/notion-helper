import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat, sleep } from "./util"

class QQChannelAdpator implements IArticleAdaptor {

  platform = 'qq频道'

  isMatch(url: string) {
    return /qun\.qq\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector(".main-area__poster-info__detail__nicktext")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".main-area__title span")
    return getText(el!)
  }

  publishTime() {
    return new Date().toString()
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    return isLegalNotionImgFormat(url) ? url : undefined
  }

  contentSelector = '#vue-editor-js'

  extractImgSrc(x: HTMLImageElement) {
    return x.src
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
      'qpic.cn',
      'beacon.qq.com',
      'framework.cdn-go.cn',
      'myqcloud.com',
      'idqqimg.com',
      'gtimg.cn',
      'trace.qq.com',
      'qqweb.qq.com',
      'file.myqcloud.com',
      'data:',
      'recommend.qq.com',
    ].some(x => url.includes(x))
  }

  async waitUntil() {
    for (let i = 0; i < 5; i++) {
      const app = document.querySelector("#app")
      if (app?.hasAttribute('v-data-app')) {
        return
      }
      await sleep(100)
    }
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/qq.svg?sign=bdc4fd30f0329f51a79da91efdb27fc2&t=1653817336"
}

export default new QQChannelAdpator()