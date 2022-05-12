// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return {
        errMsg: "ok",
        data:"https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/20220512.jpg?sign=a8152b74411572c37e144a62d5af0dff&t=1652319860"
    }
}