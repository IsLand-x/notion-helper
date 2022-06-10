import { Protocol } from 'puppeteer'
export interface IArticleAdaptor {
  platform: string
  isMatch: (url: string) => boolean
  articleName: () => string
  authorName: () => string
  publishTime: () => string | undefined
  bgImgUrl: () => Promise<string | undefined>
  processImgUrl: (x: string) => string | Promise<string | undefined>
  contentSelector: string
  getContent?: () => Promise<Element>
  extractImgSrc: (x: HTMLImageElement) => string | undefined
  shouldSkip?: (x: string) => boolean
  iconUrl: string;
  forbidRequest?: (x: string) => boolean;
  cookie?: Protocol.Network.CookieParam[];
  waitNavigation?: boolean;
  waitUntil?: () => Promise<void>;
  customCrawlPageLogic?: () => Promise<any>;
}