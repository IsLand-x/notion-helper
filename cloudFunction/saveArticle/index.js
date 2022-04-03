// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const {
  Client
} = require('@notionhq/client');

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {data} = await cloud.database()
  .collection('user')
  .where({ openid: OPENID })
  .field({ openid: true, key: true, db: true })
  .limit(1)
  .get();
  if(data.length===0){
    return {
      errMsg:'请根据使用教程绑定到Notion'
    }
  }
  const {key,db} = data[0]
  const notion = new Client({
    auth: key
  });
  const {result:{data:{articleName,author}}} = await cloud
  .callFunction({name:'getArticleInfo',data:{url:event.url}});
  const response = await notion.pages.create({
    parent: { database_id: db },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: articleName
            },
          },
        ],
      },
      Href:{
        url:event.url,
      },
      Date:{
        date:{
          start:new Date(+new Date()+8*3600*1000).toISOString().slice(0,-1)+'+08:00'
        }
      },
      Author:{
        rich_text:[
          {
            type:'text',
            text:{
              content:author
            },
          }
        ]
      }
    },
  }).catch(e=>e)
  if(response.code==='validation_error'){
    return {
      errMsg:'收藏失败，请不要删除或更名初始的数据库列。可在用户绑定页面重新绑定以修复。'
    }
  }
  if(response.code==='unauthorized'){
    return {
      errMsg:'Intergration Token错误,请重新绑定以修复。'
    }
  }
  if(response.code==='object_not_found'){
    return{
      errMsg:'Database ID错误或未引入integration,请重新绑定以修复。'
    }
  }
  return {
    errMsg:'ok'
  }
}
