import { IArticleAdaptor } from './adaptor/adaptor';

declare global {
  interface Window {
    adaptor: IArticleAdaptor
    convertBody: () => Promise<any[]>
  }
}