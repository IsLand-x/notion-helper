import mpAdaptor from "./mpAdaptor";
import juejinAdaptor from "./juejinAdaptor";
import sspaiAdaptor from "./sspaiAdaptor";
import zhihuPostAdaptor from "./zhihuPostAdaptor"
import zhihuAnswerAdaptor from "./zhihuAnswerAdaptor";
import doubanNoteAdaptor from "./doubanNoteAdaptor"

const adaptorArr = [
  mpAdaptor,
  juejinAdaptor,
  sspaiAdaptor,
  zhihuPostAdaptor,
  zhihuAnswerAdaptor,
  doubanNoteAdaptor
]

export function getAdaptor(url: string) {
  for (const adaptor of adaptorArr) {
    if (adaptor.isMatch(url)) {
      console.log(adaptor)
      return adaptor
    }
  }
}