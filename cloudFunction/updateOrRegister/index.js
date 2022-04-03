// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const {
        OPENID
    } = cloud.getWXContext()
    if (!event.db || !event.key) {
        return {
            errMsg: "请检查参数完整性"
        }
    }
    const {
        data: queryRes
    } = await cloud.database()
        .collection('user')
        .where({
            openid: OPENID
        })
        .field({
            openid: true,
            key: true,
            db: true
        })
        .limit(1)
        .get();
    const exists = queryRes.length !== 0
    if (!exists) {
        await cloud.database()
            .collection('user')
            .add({
                data: [{
                    openid: OPENID,
                    key: event.key,
                    db: event.db
                }]
            })
    } else {
        await cloud.database()
            .collection('user')
            .where({ openid: OPENID })
            .update({
                data: {
                    key: event.key,
                    db: event.db
                }
            })
    }
    return {
        errMsg: "ok"
    }
}
