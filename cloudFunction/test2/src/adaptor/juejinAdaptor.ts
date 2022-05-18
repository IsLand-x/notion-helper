import { IArticleAdaptor } from "./adaptor"
import { getText, isLegalNotionImgFormat } from "./util"

class JuejinAdaptor implements IArticleAdaptor {

  platform = '掘金图文'

  isMatch(url: string) {
    return /juejin\.cn\/post/.test(url)
  }

  authorName() {
    const el = document.querySelector(".username")
    return getText(el)
  }

  articleName() {
    const el = document.querySelector("h1.article-title")
    return getText(el)
  }

  publishTime() {
    const el = document.querySelector(".meta-box time.time") as HTMLTimeElement
    return (el as HTMLTimeElement).dateTime
  }

  async bgImgUrl() {
    const el = document.querySelector(".article-hero")
    const url = (el as HTMLElement)?.dataset.src
    console.log(url)
    if (!url) {
      return null
    }
    console.log(url)
    return await this.processImgUrl(url || undefined)
  }

  async processImgUrl(url?: string) {
    const rawPrefix = url?.split("?")[0].replace("http://", "https://")
    const legalizeToNotionFormat = (prefix: string) => {
      const hasExt = /\.[0-9a-zA-Z]+$/.test(prefix)
      prefix = hasExt ? prefix.replace(/\.[0-9a-zA-Z]+$/, '') : prefix
      return fetch(prefix + ".gif")
        .then(res => res.json())
        .then(() => prefix + ".png")
        .catch(() => prefix + ".gif")
    }
    return isLegalNotionImgFormat(rawPrefix) ? rawPrefix : legalizeToNotionFormat(rawPrefix)
  }

  contentSelector = ".article-content"

  extractImgSrc(x: HTMLImageElement): string | null {
    return x.src
  }

  shouldSkip(x: string) {
    return [].includes(x)
  }

  iconUrl = "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/apple-touch-icon.png"
}

export default new JuejinAdaptor()