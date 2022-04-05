// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const { Client } = require('@notionhq/client');
const uuid = require('uuid');


// 云函数入口函数
exports.main = async (event, context) => {
  
  const puppeteer = require("puppeteer");
  const { OPENID } = cloud.getWXContext()
  const { data } = await cloud.database()
    .collection('user')
    .where({
      openid: OPENID
    })
    .field({
      openid: true,
      key: true,
      db: true
    })
    .limit(1)
    .get();
  if (data.length === 0) {
    return {
      errMsg: '请根据使用教程绑定到Notion'
    }
  }
  const {
    key,
    db
  } = data[0]
  const notion = new Client({
    auth: key
  });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(event.url);
  await page.exposeFunction('uuid', () => {
    return uuid.v4()
  })
  await page.addScriptTag({
    path: './node_modules/uuid/dist/umd/uuidv4.min.js'
  })
  const articleName = await page.$$eval("#activity-name", (e) => e[0].textContent.trim())
  const author = await page.$$eval("#js_name", e => e[0].textContent.trim());
  const time = await page.$$eval("#publish_time", e => e[0].textContent.trim())
  const bgImgUrl = await page.evaluate(() => document.head.querySelector('meta[property="og:image"]').getAttribute('content'))

  const content = await page.evaluate(async () => {
    const content = document.querySelector('#js_content')
    const flatten = element => {
      while (Array.from(element.children).length === 1) {
        element = element.children[0]
      }
      return Array.from(element.children)
    }
    const parse = (eleArr) => {
      const result = []
      for (const ele of eleArr) {
        const childArr = genNotionFormat(ele);
        result.push(...childArr)
      }
      return result
    }
    const genNotionFormat = (ele) => {
      switch (ele.tagName) {
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
          return treatAsHeading(ele);
        case "IMG":
          return treatAsImg(ele);
        case "FIGURE":
          return treatAsFigure(ele);
        case "HR":
          return treatAsDivider();
        case "BLOCKQUOTE":
          return treatAsQuote(ele);
        case "BR":
          return treatAsBr();
        case "UL":
        case "OL":
          return treatAsList(ele);
        case "LI":
          return treatAsListItem(ele);
        case "CODE":
          return treatAsCodeBlock(ele);
        case "PRE":
          return processPreBlock(ele);
        case "MPPROFILE":
        case "MPVIDEOSNAP":
          return [];
        default:
          return treatAsParagraph(ele)
      }
    }
    const processPreBlock = (ele) => {
      const result = []
      for (const x of Array.from(ele.childNodes)) {
        if (isTextyNode(x)) {
          result.push(...treatAsParagraph(x))
        } else {
          result.push(...genNotionFormat(x))
        }
      }
      return result
    }
    const treatAsCodeBlock = ele => {
      const rawChildren = Array.from(ele.childNodes)
      const processedChildren = []
      let temp = []
      const pushCodeLine = () => {
        const codeLine = parseTextChildren({ childNodes: temp }).map(r=>r.text.content).join("");
          processedChildren.push({
            type: "text",
            text: {
              content:codeLine
            }
          })
      }
      for (const x of rawChildren) {
        if (x.tagName !== 'BR') {
          temp.push(x)
        } else {
          temp.push({
            nodeName: '#text',
            nodeValue:"\n"
          })
          pushCodeLine()
          temp=[]
        }
      }
      if (temp.length) {
        pushCodeLine()
        temp=[]
      }
      return [{
        type: "code",
        code: {
          language:'typescript',
          rich_text:processedChildren
        }
      }]
    }
    const treatAsList = ele => {
      const children = []
      for (const x of Array.from(ele.childNodes)) {
        children.push(...genNotionFormat(x))
      }

      return children;
    }
    const treatAsListItem = ele => {
      const [first = {}, ...rest] = processInternal(ele)
      const children = rest.length !== 0 ? [...(first.children || []), ...rest] :
        (first.children || undefined)
      return [{
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: first.type === "paragraph" ? first.paragraph.rich_text : [],
          children: children
        }
      }]
    }
    const treatAsBr = ele => {
      return [{
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: {
              content: "",
              link: null
            }
          }]
        }
      }]
    }
    const treatAsImg = ele => {
      return ele.dataset.src!="" ? [{
        type: 'image',
        image: {
          type: 'external',
          external: {
            url: formatImgUrl(ele.dataset.src)
          }
        }
      }]:[]
    }
    const treatAsQuote = ele => {
      if (isAllTextChildren(ele)) {
        return [{
          type: "quote",
          quote: {
            rich_text: parseTextChildren(ele)
          }
        }]
      } else {
        let [first,...rest] = genNotionFormat({ tagName: "P", childNodes: ele.childNodes })
        let firstRichText = null
        if(first.paragraph){
          firstRichText = first.paragraph.rich_text;
          rest.shift()
        }
        return [{
          type: "quote",
          quote: {
            rich_text: firstRichText || [{type:'text',text:{content:''}}],
            children: rest.length!==0?rest : undefined
          }
        }]
      }
    }
    const treatAsDivider = () => {
      return [{
        type: 'divider',
        divider: {}
      }]
    }
    const formatImgUrl = url => (url || "").replace(/\?wx_fmt=.+/, '.png')
    const treatAsFigure = element => {
      const hasOnlyImgNode = element => Array.from(element.childNodes).length === 1 && element.childNodes[0].tagName.toLowerCase() === 'img'
      if (hasOnlyImgNode(element)) {
        return treatAsImg(element.childNodes[0])
      } else {
        return processInternal(element)
      }
    }
    const processInternal = element => {
      const result = []
      let temp = []
      const childNodes = Array.from(element.childNodes)
      for (const x of Array.from(element.childNodes)) {
        if (isTextyNode(x)) {
          temp.push(x)
        } else {
          temp.length && result.push(...genNotionFormat({ tagName: "P", childNodes: temp }))
          result.push(...genNotionFormat(x))
          temp = []
        }
      }
      temp.length && result.push(...treatAsParagraph({ childNodes: temp }))
      return result
    }
    const treatAsHeading = (element) => {
      const type = `heading_${element.tagName[1] > 3 ? 3 : element.tagName[1]}`
      if (isAllTextChildren(element)) {
        return [{
          type: type,
          [type]: {
            rich_text: parseTextChildren(element)
          }
        }]
      } else {
        return processInternal(element)
      }
    }
    const treatAsParagraph = (element) => {
      if (isAllTextChildren(element)) {
        return [{
          type: "paragraph",
          paragraph: {
            rich_text: parseTextChildren(element)
          }
        }]
      } else {
        return processInternal(element)
      }
    }
    const isTextyNode = ele => {
      if(ele.tagName==='CODE' && Array.from(ele.childNodes).length!==1){
        return false
      }
      return (ele.nodeName === '#text' || ['br', 'strong', 'b', 'em', 'i', 'a', 'span', 'u', 'del', 'code','sub','sup'].includes((ele.tagName || "").toLowerCase()))
    };
    const isAllTextChildren = element => {
      for (const child of Array.from(element.childNodes)) {
        if (!isTextyNode(child)) {
          return false;
        }
      }
      return true;
    }
    const parseTextChildren = element => {
      const result = []
      for (const child of Array.from(element.childNodes)) {
        if (child.nodeName === '#text') {
          result.push({
            type: 'text',
            text: {
              content: child.nodeValue,
              link: null
            }
          })
        } else if (['strong', 'b', 'em', 'i', 'span', 'u', 'del', 'code','sub','sup'].includes(child.tagName.toLowerCase())) {
          const temp = parseTextChildren(child)
          temp.forEach(eleObj => {
            if (['strong', 'b'].includes(child.tagName.toLowerCase())) {
              const annotations = eleObj.annotations || {}
              annotations.bold = true;
              eleObj.annotations = annotations
            } else if (['em', 'i'].includes(child.tagName.toLowerCase())) {
              const annotations = eleObj.annotations || {}
              annotations.italic = true;
              eleObj.annotations = annotations
            } else if (['del'].includes(child.tagName.toLowerCase())) {
              const annotations = eleObj.annotations || {}
              annotations.strikethrough = true;
              eleObj.annotations = annotations
            } else if (['u'].includes(child.tagName.toLowerCase())) {
              const annotations = eleObj.annotations || {}
              annotations.underline = true;
              eleObj.annotations = annotations
            } else if (['code'].includes(child.tagName.toLowerCase())) {
              const annotations = eleObj.annotations || {}
              annotations.code = true;
              eleObj.annotations = annotations
            }
          })
          result.push(...temp)
        } else if (['a'].includes(child.tagName.toLowerCase())) {
          result.push({
            type: 'text',
            text: {
              content: child.textContent,
              link: child.href ? {
                url: child.href
              } : null
            }
          })
        } else {
          result.push({
            type: 'text',
            text: {
              content: child.textContent,
              link: null
            }
          })
        }
      }
      return result
    }
    return parse(flatten(content))
  });

  browser.close();
  let response = await notion.pages.create({
    parent: {
      database_id: db
    },
    icon: {
      type: "external",
      external: {
        url:"https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico"
      }
    },
    cover: {
      type: 'external',
      external: {
        url: bgImgUrl
      }
    },
    properties: {
      Name: {
        title: [{
          text: {
            content: articleName
          },
        },],
      },
      Href: {
        url: event.url,
      },
      Date: {
        date: {
          start: new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
        }
      },
      'Add Date': {
        date: {
          start: new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
        }
      },
      Author: {
        rich_text: [{
          type: 'text',
          text: {
            content: author
          },
        }]
      }
    },
    children: content
  }).catch(e => e)
  if (response.code === 'validation_error') {
    response = await notion.pages.create({
        parent: {
          database_id: db
        },
        cover: {
          type: 'external',
          external: {
            url: bgImgUrl
          }
        },
        properties: {
          Name: {
            title: [{
              text: {
                content: articleName
              },
            },],
          },
          Href: {
            url: event.url,
          },
          Date: {
            date: {
              start: new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
            }
          },
          'Add Date': {
            date: {
              start: new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, -1) + '+08:00'
            }
          },
          Author: {
            rich_text: [{
              type: 'text',
              text: {
                content: author
              },
            }]
          }
        }
    }).catch(e => e)
    if (response.code === 'validation_error') {
      return {
        errMsg: '收藏失败，可能的原因有：\n① 请不要删除或更名初始的数据库列。可在用户绑定页面重新绑定以修复 \n② 文章含有无法解析的块，可以向开发者反馈'
      }
    } else {
      return {
        errMsg:'文章过长或含有不能解析的HTML标签，剪藏文章内容失败，但成功保存链接到Notion。可以尝试向开发者反馈此问题。'
      }
    }
  }
  if (response.code === 'unauthorized') {
    return {
      errMsg: 'Intergration Token错误,请重新绑定以修复。'
    }
  }
  if (response.code === 'object_not_found') {
    return {
      errMsg: 'Database ID错误或未引入integration,请重新绑定以修复。'
    }
  }
  return {
    errMsg: 'ok'
  }
}
