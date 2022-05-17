import { Page } from 'puppeteer';
export interface IArticleAdaptor {
  platform: string
  isMatch: (url: string) => boolean
  articleName: () => string
  authorName: () => string
  publishTime: () => string
  bgImgUrl: () => Promise<string | null>
  processImgUrl: (x: string) => string | Promise<string>
  contentSelector: string
  extractImgSrc: (x: HTMLImageElement) => string | null
  shouldSkip: (x: string) => boolean
  iconUrl: string;
  forbidRequest?: (x: string) => boolean
}