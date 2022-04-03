// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const {
  Client
} = require('@notionhq/client');

// 云函数入口函数
exports.main = async (event, context) => {
  const notion = new Client({
    auth: event.key
  });
  const response = await notion.databases.update({
    database_id: event.db,
    properties: {
      Name: {
        title: {}
      },
      Href: {
        url: {}
      },
      Date:{
        date:{}
      }
    }
  }).catch(e=>e)
  const errMsg = {
      unauthorized:'Token错误,请检查',
      validation_error:'ID错误,请检查',
      object_not_found:'ID错误或未引入integration,请检查',
  }
  if(errMsg[response.code]){
      return {
          errMsg:errMsg[response.code]
      }
  }
  return {errMsg:'ok',data:true};
}
