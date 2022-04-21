// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return {
        errMsg: "ok",
        data:"https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/2022-4-21.jpg?sign=4518f522ef70743581bb58d72d64f735&t=1650525317"
    }
}