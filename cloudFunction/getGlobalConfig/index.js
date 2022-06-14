const cloud = require('wx-server-sdk')

cloud.init()

const addGroupImageUrl = "cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/20220612.jpg"
const wxGzhImageUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/output-onlinepngtools-min.png?sign=8c0c06d8e95bf94909cf5951f447007e&t=1652858230"
const questions = require("./questions.js")
const roadmaps = require("./roadmaps.js")
const shareTimelineImageUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/basicprofile.png?sign=fe61a2c6304e5e48acc4766e15144f46&t=1648961942"
const shareAppMessageImageUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/default.png?sign=4a721519b94eb7f923fdb7d3dcb92789&t=1648963127"
const supportPlatforms = require("./supportPlatforms.js")
const homepageUrl = "https://island-x.notion.site/Notion-ee3600a5c08e45ae8572e3e70bc27cec"
exports.main = async () => {
  const wxContext = cloud.getWXContext()

  return {
    errMsg: "ok",
    data: {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      addGroupImageUrl,
      wxGzhImageUrl,
      shareTimelineImageUrl,
      shareAppMessageImageUrl,
      questions,
      roadmaps,
      supportPlatforms,
      homepageUrl
    }
  }
}
