import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat, sleep } from "./util"

class ToutiaoAdaptor implements IArticleAdaptor {

  platform = '今日头条图文'

  isMatch(url: string) {
    return /toutiao\.com/.test(url)
  }

  authorName() {
    const el = document.querySelector(".article-meta .name a")
    return getText(el!)
  }

  articleName() {
    const el = document.querySelector(".article-content h1")
    return getText(el!)
  }

  publishTime() {
    const el = document.querySelector(".article-meta span:not([class])")
    return getText(el!)
  }

  async bgImgUrl() {
    return undefined
  }

  async processImgUrl(url?: string) {
    const prefix = url?.split("?")[0].replace("http://", "https://")
    return !url
      ? undefined
      : isLegalNotionImgFormat(prefix + '.png')
        ? prefix + '.png'
        : undefined
  }

  contentSelector = 'article'

  extractImgSrc(x: HTMLImageElement) {
    return x.src
  }

  shouldSkip(x: string) {
    return false
  }

  forbidRequest(url: string) {
    return [".map", "toutiaoimg", "captcha", "xgplayer", ".css", "snssdk", "sentry", "acrawler", "secsdk", "slardar"].some(x => url.includes(x))
  }

  cookie = [{
    name: 'ttwid',
    value: 'test',
    domain: '.toutiao.com'
  }]

  iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/jinritoutiao.svg?sign=1113c9c86cc3973d1d22d6843d837c50&t=1653492964"
}

export default new ToutiaoAdaptor()