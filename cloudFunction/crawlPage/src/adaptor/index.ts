import { IArticleAdaptor } from './adaptor';
import mpAdaptor from "./mpAdaptor";
import juejinAdaptor from "./juejinAdaptor";
import sspaiAdaptor from "./sspaiAdaptor";
import zhihuPostAdaptor from "./zhihuPostAdaptor"
import zhihuAnswerAdaptor from "./zhihuAnswerAdaptor";
import segmentfaultAdaptor from "./segmentfaultAdaptor";

import doubanNoteAdaptor from "./doubanNoteAdaptor"
import doubanReviewAdaptor from './doubanReviewAdaptor';
import doubanGroupAdaptor from './doubanGroupAdaptor';
import doubanPeopleAdaptor from './doubanPeopleAdaptor';
import doubanAnnotationAdaptor from './doubanAnnotationAdaptor';

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
]

export function getAdaptor(url: string): IArticleAdaptor | undefined {
  for (const adaptor of adaptorArr) {
    if (adaptor.isMatch(url)) {
      console.log(adaptor)
      return adaptor
    }
  }
}