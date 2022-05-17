import cloud from 'wx-server-sdk'

cloud.init()


async function entry(event, context) {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

export default entry