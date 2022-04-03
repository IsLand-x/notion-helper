// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const {
  Client
} = require('@notionhq/client');
const KEY = 'secret_4OA4PZdXhDimBF8zkhajyc4MH4ioVomAndr1mmFqiI6';
const DB = 'c5cc0d6ed73245a1bb1dcafea4a0bec8'
// 云函数入口函数
exports.main = async (event, context) => {
  const {feedback,contact='-'} = event;
  const notion = new Client({
    auth: KEY
  });
  const response = await notion.pages.create({
    parent: { database_id: DB },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: feedback
            },
          },
        ],
      },
      Date:{
        date:{
          start:new Date(+new Date()+8*3600*1000).toISOString().slice(0,-1)+'+08:00'
        }
      },
      Contact:{
        rich_text:[
          {
            type:'text',
            text:{
              content:contact
            },
          }
        ]
      }
    },
  })
  return {
    errMsg:'ok',
    data: true
  }
}
