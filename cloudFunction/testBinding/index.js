// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const {
  Client
} = require('@notionhq/client');

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.db, event.key)
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
      Date: {
        date: {}
      },
      'Add Date': {
        date: {}
      },
      Author: {
        rich_text: {}
      }
    }
  }).catch(e => {
    console.error(e)
    return e
  })
  console.log(response);
  const errMsg = {
    unauthorized: 'Token错误,请检查',
    validation_error: '表头错误。若Token和Id正确，可尝试新建数据库(不要更改表头)解决该问题。',
    object_not_found: 'Database ID错误或未引入integration,请检查',
  }
  if (errMsg[response.code]) {
    if (response.code === 'validation_error') {
      if (response.message.includes("path failed validation: path.database_id should be a valid uuid")) {
        return {
          errMsg: 'Database ID错误，请查看使用教程或加反馈群。'
        }
      } else if (response.message.includes("Cannot create")) {
        return {
          errMsg: '表头错误。请查看首页常见问题或加反馈群。'
        }
      }
    }
    return {
      errMsg: errMsg[response.code]
    }
  }
  if (Reflect.ownKeys(response).includes("stack")) {
    return {
      errMsg: "Token或者Database Id不合法"
    }
  }
  return {
    errMsg: 'ok',
    data: true
  };
}
