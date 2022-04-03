// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    if (!event.url.startsWith("https://mp.weixin.qq.com")) {
        return {
            errMsg:"暂时仅支持微信公众号收藏"
        }
    }
    const { data } = await axios.get(event.url)
    const $ = cheerio.load(data)
    
    const articleName = $("#activity-name").text().trim()
    const author = $('#js_name').text().trim()
    return {
        errMsg:"ok",
        data:{
            articleName,
            author,
        }
    }
}