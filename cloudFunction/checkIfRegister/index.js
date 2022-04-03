// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    const {data} = await cloud.database()
        .collection('user')
        .where({ openid: OPENID })
        .field({ openid: true, key: true, db: true })
        .limit(1)
        .get();
    return {
        errMsg:"ok",
        data:data[0]
    }
}