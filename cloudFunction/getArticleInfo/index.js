// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init()

const mpArticleAdaptor = {
    name:$=> $("#activity-name").text().trim(),
    author:$=> $('#js_name').text().trim()
}

const mpVideoAdaptor = {
    name:$=>$('#js_video_page_title').text().trim(),
    author:$=>$('#profile_share2 strong').text().trim()
}

const adaptors = [mpArticleAdaptor,mpVideoAdaptor]

const extractInfo = ($)=>{
    for(const adaptor of adaptors){
        const name = adaptor.name($);
        const author = adaptor.author($);
        if(name && author){
            console.log("Name:",name)
            console.log("Author:",author)
            return {
                name,
                author
            }
        }
    }
    console.log('暂不支持该类型')
    return {
        name:'暂不支持该类型',
        author:'暂不支持该类型'
    }
}

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = await cloud.getWXContext()
    console.log("URL:",event.url);
    console.log("OPENID:",OPENID);
    if (!event.url.includes("mp.weixin.qq.com")) {
        return {
            errMsg:"暂时仅支持微信公众号收藏"
        }
    }
    if(event.url.includes("mp.weixin.qq.com/mp/appmsgalbum?")){
        return {
          errMsg:"暂不支持收藏文章列表。"
        }
    }
    const { data } = await axios.get(event.url)
    const $ = cheerio.load(data)
    const {name,author} = extractInfo($)
    return {
        errMsg:"ok",
        data:{
            articleName:name,
            author,
        }
    }
}