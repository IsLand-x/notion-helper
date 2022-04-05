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
      },
      'Add Date': {
        date: {}
      },
      Author: {
        rich_text:{}
      }
    }
  }).catch(e => e)
  console.log(response);
  const errMsg = {
      unauthorized:'Token错误,请检查',
      validation_error:'表头错误。可尝试新建数据库(不要更改表头)解决该问题。',
      object_not_found:'ID错误或未引入integration,请检查',
  }
  if(errMsg[response.code]){
      return {
          errMsg:errMsg[response.code]
      }
  }
  return {errMsg:'ok',data:true};
}
