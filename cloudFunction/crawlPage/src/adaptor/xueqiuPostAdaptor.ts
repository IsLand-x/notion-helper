import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat, sleep } from "./util"

class XueqiuPostAdaptor implements IArticleAdaptor {

  platform = '雪球热帖'

  isMatch(url: string) {
    return /xueqiu\.com\/[0-9]+\/[0-9]+/.test(url)
  }

  authorName() {
    const el = document.querySelector(".article__bd__from a") || document.querySelector(".avatar__name .name")
    return getText(el!)
  }

  articleName() {
    return window.document.title
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

  contentSelector = '.article__bd__detail'

  extractImgSrc(x: HTMLImageElement) {
    return x.src
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [
      'assets.imedao.com',
      'xqimg.imedao.com',
      'hm.baidu.com',
      'xqdoc.imedao.com',
      'xavatar.imedao.com'
    ].some(x => url.includes(x))
  }

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/xueqiu.svg?sign=58aebc0906f405381a2dd04013c9a333&t=1653820234"
}

export default new XueqiuPostAdaptor()