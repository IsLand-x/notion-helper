// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const {
  Client
} = require('@notionhq/client');

// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.db || !event.key) {
    return {
      errMsg: "请检查信息完整性"
    }
  }
  console.log(event.db,event.key)
  if (event.db.length !== 32) {
    return {
      errMsg:"Database ID长度应当为32位，请检查"
    }
  }
  if (event.key.length !== 50) {
    return {
      errMsg:"Token长度应当为50位，请检查"
    }
  }
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
      validation_error:'表头错误。若Token和Id正确，可尝试新建数据库(不要更改表头)解决该问题。',
      object_not_found:'ID错误或未引入integration,请检查',
  }
  if(errMsg[response.code]){
      return {
          errMsg:errMsg[response.code]
      }
  }
  return {errMsg:'ok',data:true};
}
