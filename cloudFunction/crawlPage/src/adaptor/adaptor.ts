export interface IArticleAdaptor {
  platform: string
  isMatch: (url: string) => boolean
  articleName: () => string
  authorName: () => string
  publishTime: () => string
  bgImgUrl: () => Promise<string | undefined>
  processImgUrl: (x: string) => string | Promise<string | undefined>
  contentSelector: string
  extractImgSrc: (x: HTMLImageElement) => string | undefined
  shouldSkip?: (x: string) => boolean
  iconUrl: string;
  forbidRequest?: (x: string) => boolean
}