import { IArticleAdaptor } from './adaptor';
import mpAdaptor from "./mpAdaptor";
import juejinAdaptor from "./juejinAdaptor";
import sspaiAdaptor from "./sspaiAdaptor";
import segmentfaultAdaptor from "./segmentfaultAdaptor";
import toutiaoAdaptor from './toutiaoAdaptor';

import xueqiuPostAdaptor from './xueqiuPostAdaptor';

import zhihuPostAdaptor from "./zhihuPostAdaptor"
import zhihuAnswerAdaptor from "./zhihuAnswerAdaptor";

import doubanNoteAdaptor from "./doubanNoteAdaptor"
import doubanReviewAdaptor from './doubanReviewAdaptor';
import doubanGroupAdaptor from './doubanGroupAdaptor';
import doubanPeopleAdaptor from './doubanPeopleAdaptor';
import doubanAnnotationAdaptor from './doubanAnnotationAdaptor';

import neteaseDesktopAdaptor from './neteaseDesktopAdaptor';
import neteaseMobileAdaptor from './neteaseMobileAdaptor';

import qqChannelAdaptor from './qqChannelAdaptor';

import weiboMobileAdaptor from './weiboMobileAdaptor';
import weiboDesktopAdaptor from './weiboDesktopAdaptor';
import weiboToutiaoAdaptor from './weiboDesktopToutiaoAdaptor'
import bilibiliVideoAdaptor from './bilibiliVideoAdaptor';
import coolapkFeedAdaptor from './coolapkFeedAdaptor';
import xiaoyuzhoufmAdaptor from './xiaoyuzhoufmAdaptor';

import crxAdaptor from './crxAdaptor';

import defaultAdaptor from './defaultAdaptor';

const adaptorArr = [
  mpAdaptor,
  juejinAdaptor,
  sspaiAdaptor,
  segmentfaultAdaptor,

  zhihuPostAdaptor,
  zhihuAnswerAdaptor,

  doubanNoteAdaptor,
  doubanReviewAdaptor,
  doubanGroupAdaptor,
  doubanPeopleAdaptor,
  doubanAnnotationAdaptor,

  toutiaoAdaptor,

  neteaseDesktopAdaptor,
  neteaseMobileAdaptor,

  qqChannelAdaptor,

  xueqiuPostAdaptor,

  weiboMobileAdaptor,
  weiboToutiaoAdaptor,
  weiboDesktopAdaptor,

  bilibiliVideoAdaptor,

  coolapkFeedAdaptor,

  xiaoyuzhoufmAdaptor,

  crxAdaptor,

  defaultAdaptor,
]

export function getAdaptor(url: string): IArticleAdaptor | undefined {
  for (const adaptor of adaptorArr) {
    if (adaptor.isMatch(url)) {
      console.log(adaptor)
      return adaptor
    }
  }
}