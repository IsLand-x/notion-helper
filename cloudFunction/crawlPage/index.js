var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  main: () => main
});
module.exports = __toCommonJS(src_exports);
var import_wx_server_sdk = __toESM(require("wx-server-sdk"));

// src/adaptor/util.ts
var getText = (el) => {
  var _a;
  return ((_a = el.textContent) == null ? void 0 : _a.trim()) || "";
};
var isLegalNotionImgFormat = (url) => url ? /\.(png|jpg|jpeg|gif|tif|tiff|bmp|svg|heic)$/.test(url) : false;

// src/adaptor/mpAdaptor.ts
var MpAdaptor = class {
  constructor() {
    this.platform = "\u5FAE\u4FE1\u516C\u4F17\u53F7";
    this.contentSelector = "#js_content";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/wechat.svg?sign=e7bf96a5a33a7591fc93aafd20675cf1&t=1652873000";
  }
  isMatch(url) {
    return /mp\.weixin\.qq\.com/.test(url);
  }
  authorName() {
    const el = document.querySelector("#js_name");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector("#activity-name");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector("#publish_time");
    return getText(el);
  }
  async bgImgUrl() {
    var _a;
    const url = (_a = document.head.querySelector('meta[property="og:image"]')) == null ? void 0 : _a.getAttribute("content");
    return this.processImgUrl(url || void 0);
  }
  processImgUrl(url) {
    return (url == null ? void 0 : url.split("?")[0].replace("http://", "https://")) + ".png";
  }
  extractImgSrc(x) {
    return x.dataset.src || x.src;
  }
  shouldSkip(x) {
    return ["MPPROFILE", "MPVIDEOSNAP"].includes(x.toUpperCase());
  }
  forbidRequest(url) {
    return ["res.wx.qq.com"].some((x) => url.includes(x));
  }
};
var mpAdaptor_default = new MpAdaptor();

// src/adaptor/juejinAdaptor.ts
var JuejinAdaptor = class {
  constructor() {
    this.platform = "\u6398\u91D1\u56FE\u6587";
    this.contentSelector = ".article-content";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/juejin.svg?sign=03dadd81a7e3175e23e5bd5bc612d76b&t=1652873296";
  }
  isMatch(url) {
    return /juejin\.cn\/post/.test(url);
  }
  authorName() {
    const el = document.querySelector(".username");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector("h1.article-title");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".meta-box time.time");
    return el.dateTime;
  }
  async bgImgUrl() {
    const el = document.querySelector(".article-hero");
    const url = el == null ? void 0 : el.dataset.src;
    if (!url) {
      return;
    }
    return await this.processImgUrl(url || void 0);
  }
  async processImgUrl(url) {
    const rawPrefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    const legalizeToNotionFormat = (prefix) => {
      const hasExt = /\.[0-9a-zA-Z]+$/.test(prefix);
      prefix = hasExt ? prefix.replace(/\.[0-9a-zA-Z]+$/, "") : prefix;
      return prefix + ".png";
    };
    return isLegalNotionImgFormat(rawPrefix) ? rawPrefix : legalizeToNotionFormat(rawPrefix);
  }
  extractImgSrc(x) {
    return x.src;
  }
  forbidRequest(url) {
    return ["api.juejin.cn", "snssdk", "abtestvm", "google", "acrawler", "goofy", "byteimg"].some((x) => url.includes(x));
  }
  shouldSkip(x) {
    return false;
  }
};
var juejinAdaptor_default = new JuejinAdaptor();

// src/adaptor/sspaiAdaptor.ts
var SspaiAdaptor = class {
  constructor() {
    this.platform = "\u5C11\u6570\u6D3E\u56FE\u6587";
    this.contentSelector = ".article-body";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/sspai.svg";
  }
  isMatch(url) {
    return /sspai\.com\/post/.test(url);
  }
  authorName() {
    const el = document.querySelector(".nickname");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector("#article-title");
    return getText(el);
  }
  publishTime() {
    return new Date().toString();
  }
  async bgImgUrl() {
    const el = document.querySelector(".article-banner img");
    const url = el.src;
    return this.processImgUrl(url || void 0);
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    return !url ? void 0 : isLegalNotionImgFormat(prefix) ? prefix : void 0;
  }
  extractImgSrc(x) {
    return x.dataset.original;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return ["google", "cdn.sspai.com", "post.sspai.com", "res.wx.qq.com", "clarity", "baidu", "bdstatic", "gtimg", "youke", "beacon.cdn.qq.com"].some((x) => url.includes(x));
  }
};
var sspaiAdaptor_default = new SspaiAdaptor();

// src/adaptor/zhihuPostAdaptor.ts
var ZhihuPostAdaptor = class {
  constructor() {
    this.platform = "\u77E5\u4E4E\u4E13\u680F";
    this.contentSelector = ".Post-RichTextContainer";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/zhihu.svg?sign=647ec89894c1427c1abd4085ac2a8058&t=1652853009";
  }
  isMatch(url) {
    return /zhuanlan\.zhihu\.com\/p/.test(url);
  }
  authorName() {
    const el = document.querySelector(".UserLink.AuthorInfo-name");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".Post-Title");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".ContentItem-time span") || document.querySelector(".ContentItem-time");
    return getText(el).split(" ").slice(1).join(" ");
  }
  async bgImgUrl() {
    const el = document.querySelector(".TitleImage");
    const url = el == null ? void 0 : el.src;
    return this.processImgUrl(url || void 0);
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    return !url ? void 0 : isLegalNotionImgFormat(prefix) ? prefix : void 0;
  }
  extractImgSrc(x) {
    return x.dataset.original || x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return ["zhimg"].some((x) => url.includes(x));
  }
};
var zhihuPostAdaptor_default = new ZhihuPostAdaptor();

// src/adaptor/zhihuAnswerAdaptor.ts
var ZhihuPostAdaptor2 = class {
  constructor() {
    this.platform = "\u77E5\u4E4E\u95EE\u7B54";
    this.contentSelector = ".RichContent.RichContent--unescapable .RichText";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/zhihu.svg?sign=647ec89894c1427c1abd4085ac2a8058&t=1652853009";
  }
  isMatch(url) {
    return /www\.zhihu\.com/.test(url);
  }
  authorName() {
    const el = document.querySelector(".AnswerItem .AuthorInfo meta[itemprop='name']");
    return el.content;
  }
  articleName() {
    const el = document.querySelector(".QuestionHeader .QuestionHeader-title");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".AnswerItem .ContentItem-time span");
    return getText(el).split(" ").slice(1).join(" ");
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    return !url ? void 0 : isLegalNotionImgFormat(prefix) ? prefix : void 0;
  }
  extractImgSrc(x) {
    return x.dataset.original || x.dataset.actualsrc || x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return ["zhimg"].some((x) => url.includes(x));
  }
};
var zhihuAnswerAdaptor_default = new ZhihuPostAdaptor2();

// src/adaptor/segmentfaultAdaptor.ts
var SegmentfaultAdaptor = class {
  constructor() {
    this.platform = "\u601D\u5426\u56FE\u6587";
    this.contentSelector = "article.article";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/segmentfault.svg";
  }
  isMatch(url) {
    return /segmentfault\.com\/a/.test(url);
  }
  authorName() {
    const el = document.querySelector("strong.align-self-center.font-size-14");
    return getText(el);
  }
  articleName() {
    const sliceIdx = document.title.lastIndexOf(" - SegmentFault \u601D\u5426");
    return document.title.slice(0, sliceIdx);
  }
  publishTime() {
    const el = document.querySelector("time");
    return el.dateTime;
  }
  async bgImgUrl() {
    return await void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    const rawSrc = x.dataset.src;
    return rawSrc.startsWith("/") ? "https://segmentfault.com" + rawSrc : rawSrc;
  }
  forbidRequest(url) {
    return ["google", "/img/remote", "umi.js", "umi.css"].some((x) => url.includes(x));
  }
  shouldSkip(x) {
    return false;
  }
};
var segmentfaultAdaptor_default = new SegmentfaultAdaptor();

// src/adaptor/doubanNoteAdaptor.ts
var DoubanNoteAdaptor = class {
  constructor() {
    this.platform = "\u8C46\u74E3\u7B14\u8BB0";
    this.contentSelector = "#link-report";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/douban.svg?sign=67b067b35836681cdd121444c0f57a13&t=1652853130";
  }
  isMatch(url) {
    return /douban\.com\/note/.test(url);
  }
  authorName() {
    const el = document.querySelector(".note-author");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".note-header.note-header-container h1");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".note-header.note-header-container .pub-date");
    return getText(el);
  }
  async bgImgUrl() {
    return await void 0;
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://").replace(".webp", ".jpeg");
    return !url ? void 0 : isLegalNotionImgFormat(prefix) ? prefix : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return ["check_clean_content", "google"].some((x) => url.includes(x));
  }
};
var doubanNoteAdaptor_default = new DoubanNoteAdaptor();

// src/adaptor/doubanReviewAdaptor.ts
var DoubanReviewAdaptor = class extends DoubanNoteAdaptor {
  constructor() {
    super(...arguments);
    this.platform = "\u8C46\u74E3\u5F71\u8BC4/\u4E66\u8BC4";
  }
  isMatch(url) {
    return /douban\.com\/review/.test(url);
  }
  authorName() {
    const el = document.querySelector(".main header.main-hd a");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".article h1");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".main header.main-hd .main-meta");
    return getText(el);
  }
};
var doubanReviewAdaptor_default = new DoubanReviewAdaptor();

// src/adaptor/doubanGroupAdaptor.ts
var DoubanGroupAdaptor = class extends DoubanNoteAdaptor {
  constructor() {
    super(...arguments);
    this.platform = "\u8C46\u74E3\u5C0F\u7EC4";
  }
  isMatch(url) {
    return /douban\.com\/group/.test(url);
  }
  authorName() {
    const el = document.querySelector(".topic-doc .from a");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".article h1");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".create-time.color-green");
    return getText(el);
  }
};
var doubanGroupAdaptor_default = new DoubanGroupAdaptor();

// src/adaptor/doubanPeopleAdaptor.ts
var DoubanReviewAdaptor2 = class extends DoubanNoteAdaptor {
  constructor() {
    super(...arguments);
    this.platform = "\u8C46\u74E3\u5E7F\u64AD";
    this.contentSelector = ".bd.sns";
  }
  isMatch(url) {
    return /douban\.com\/people/.test(url);
  }
  authorName() {
    const el = document.querySelector(".hd .text a");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector("#content h1");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".pubtime");
    return getText(el);
  }
};
var doubanPeopleAdaptor_default = new DoubanReviewAdaptor2();

// src/adaptor/doubanAnnotationAdaptor.ts
var DoubanAnnotationAdaptor = class extends DoubanNoteAdaptor {
  constructor() {
    super(...arguments);
    this.platform = "\u8C46\u74E3\u8BFB\u4E66\u7B14\u8BB0";
  }
  isMatch(url) {
    return /douban\.com.+annotation/.test(url);
  }
  authorName() {
    const el = document.querySelector(".info h6 a");
    return getText(el);
  }
  articleName() {
    const bookName = document.querySelector(".name");
    const page = document.querySelector("#content h1");
    return getText(bookName) + getText(page);
  }
  publishTime() {
    const el = document.querySelector(".pubtime");
    return getText(el);
  }
};
var doubanAnnotationAdaptor_default = new DoubanAnnotationAdaptor();

// src/adaptor/index.ts
var adaptorArr = [
  mpAdaptor_default,
  juejinAdaptor_default,
  sspaiAdaptor_default,
  segmentfaultAdaptor_default,
  zhihuPostAdaptor_default,
  zhihuAnswerAdaptor_default,
  doubanNoteAdaptor_default,
  doubanReviewAdaptor_default,
  doubanGroupAdaptor_default,
  doubanPeopleAdaptor_default,
  doubanAnnotationAdaptor_default
];
function getAdaptor(url) {
  for (const adaptor of adaptorArr) {
    if (adaptor.isMatch(url)) {
      console.log(adaptor);
      return adaptor;
    }
  }
}

// src/parser/index.ts
async function parse(page, type) {
  const getArticleBody = () => type === "save" && page.evaluate(() => window.convertBody());
  const getArticleName = () => page.evaluate(() => window.adaptor.articleName());
  const getAuthorName = () => page.evaluate(() => window.adaptor.authorName());
  const getPublishTime = () => type === "save" && page.evaluate(() => window.adaptor.publishTime());
  const getBgImgUrl = () => type === "save" && page.evaluate(() => window.adaptor.bgImgUrl());
  const getUrl = () => page.url();
  const [
    articleName,
    authorName,
    publishTime,
    bgImgUrl,
    articleBody,
    url
  ] = await Promise.all([
    getArticleName(),
    getAuthorName(),
    getPublishTime(),
    getBgImgUrl(),
    getArticleBody(),
    getUrl()
  ]);
  return {
    articleName,
    authorName,
    publishTime,
    bgImgUrl,
    articleBody,
    url
  };
}

// src/index.ts
var import_puppeteer = __toESM(require("puppeteer"));
var import_client = require("@notionhq/client");
import_wx_server_sdk.default.init();
var _ = import_wx_server_sdk.default.database().command;
var debugUrl = "ws://localhost:9222/devtools/browser/5768af6e-ee8d-40db-9b17-837d4f8397ea";
var sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
async function openPage(url, adaptor) {
  const browser = !debugUrl ? await import_puppeteer.default.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }) : await import_puppeteer.default.connect({
    browserWSEndpoint: debugUrl
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (interceptedRequest) => {
    var _a;
    if ((_a = adaptor.forbidRequest) == null ? void 0 : _a.call(adaptor, interceptedRequest.url())) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });
  await page.setBypassCSP(true);
  await page.goto(url);
  await sleep(300);
  await page.addScriptTag({ path: "./preload.js" });
  const closeBrowser = () => !debugUrl && browser.close();
  return { page, closeBrowser };
}
async function saveToNotion(res, user, adaptor) {
  const { url, articleName, authorName, publishTime, articleBody, bgImgUrl } = res;
  console.log("URL", url);
  console.log("ArticleName", articleName);
  console.log("AuthorName", authorName);
  console.log("PublishTime", publishTime);
  console.log("BgImgUrl", bgImgUrl);
  console.log(publishTime);
  const { db, key } = user;
  console.log("Db", db);
  console.log("Key", key);
  const notion = new import_client.Client({ auth: key });
  console.log(bgImgUrl ? {
    type: "external",
    external: {
      url: bgImgUrl
    }
  } : null);
  let response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: db
    },
    icon: {
      type: "external",
      external: {
        url: adaptor.iconUrl
      }
    },
    cover: bgImgUrl ? {
      type: "external",
      external: {
        url: bgImgUrl
      }
    } : null,
    properties: {
      Name: {
        title: [{
          text: {
            content: articleName
          }
        }]
      },
      Href: {
        url
      },
      Date: {
        date: {
          start: new Date(+new Date(publishTime) + 8 * 3600 * 1e3).toISOString().slice(0, -1) + "+08:00"
        }
      },
      "Add Date": {
        date: {
          start: new Date(+new Date() + 8 * 3600 * 1e3).toISOString().slice(0, -1) + "+08:00"
        }
      },
      Author: {
        rich_text: [{
          type: "text",
          text: {
            content: authorName
          }
        }]
      }
    },
    children: articleBody
  }).catch((e) => {
    console.error(e);
    console.log(articleBody);
    return e;
  });
  if (response.code === "validation_error") {
    response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: db
      },
      icon: {
        type: "external",
        external: {
          url: adaptor.iconUrl
        }
      },
      cover: bgImgUrl ? {
        type: "external",
        external: {
          url: bgImgUrl
        }
      } : null,
      properties: {
        Name: {
          title: [{
            text: {
              content: `[\u4EC5\u94FE\u63A5]` + articleName
            }
          }]
        },
        Href: {
          url
        },
        Date: {
          date: {
            start: new Date(+new Date(publishTime) + 8 * 3600 * 1e3).toISOString().slice(0, -1) + "+08:00"
          }
        },
        "Add Date": {
          date: {
            start: new Date(+new Date() + 8 * 3600 * 1e3).toISOString().slice(0, -1) + "+08:00"
          }
        },
        Author: {
          rich_text: [{
            type: "text",
            text: {
              content: authorName
            }
          }]
        }
      }
    }).catch((e) => {
      console.error(e);
      return e;
    });
    if (response.code === "validation_error") {
      return {
        errMsg: "\u6536\u85CF\u5931\u8D25\uFF0C\u53EF\u80FD\u7684\u539F\u56E0\u6709\uFF1A\n\u2460 \u8BF7\u4E0D\u8981\u5220\u9664\u6216\u66F4\u540D\u521D\u59CB\u7684\u6570\u636E\u5E93\u5217\u3002\u53EF\u5728\u7528\u6237\u7ED1\u5B9A\u9875\u9762\u91CD\u65B0\u7ED1\u5B9A\u4EE5\u4FEE\u590D \n\u2461 \u6587\u7AE0\u542B\u6709\u65E0\u6CD5\u89E3\u6790\u7684\u5757\uFF0C\u53EF\u4EE5\u5411\u5F00\u53D1\u8005\u53CD\u9988\n \u2462\u65E0\u6548\u7684Token\u6216DatabaseID"
      };
    } else {
      return {
        errMsg: "\u6587\u7AE0\u8FC7\u957F\uFF0C\u526A\u85CF\u6587\u7AE0\u5185\u5BB9\u5931\u8D25\uFF0C\u4F46\u6210\u529F\u4FDD\u5B58\u94FE\u63A5\u5230Notion\u3002"
      };
    }
  }
  if (response.code === "unauthorized") {
    return {
      errMsg: "Intergration Token\u9519\u8BEF,\u8BF7\u91CD\u65B0\u7ED1\u5B9A\u4EE5\u4FEE\u590D\u3002"
    };
  }
  if (response.code === "object_not_found") {
    return {
      errMsg: "Database ID\u9519\u8BEF\u6216\u672A\u5F15\u5165integration,\u8BF7\u91CD\u65B0\u7ED1\u5B9A\u4EE5\u4FEE\u590D\u3002"
    };
  }
  return { errMsg: "ok" };
}
async function getUserData() {
  const { OPENID } = import_wx_server_sdk.default.getWXContext();
  const data = await import_wx_server_sdk.default.database().collection("user").where({
    openid: OPENID
  }).limit(1).get();
  return data.data[0];
}
var tryAddCount = (openid) => {
  import_wx_server_sdk.default.database().collection("user").where({ openid }).update({
    data: {
      articleSaveCnt: _.inc(1)
    }
  });
};
var callCount = 0;
async function main(evt) {
  const { type = "save", url } = evt;
  console.log("CallCount", callCount++);
  console.log("Type:", type);
  console.log("Url:", url);
  const wxCtx = (0, import_wx_server_sdk.getWXContext)();
  console.log(wxCtx);
  const adaptor = getAdaptor(url);
  if (!adaptor) {
    return {
      errMsg: "\u6587\u7AE0\u94FE\u63A5\u9519\u8BEF\u6216\u6682\u4E0D\u652F\u6301\u8BE5\u5E73\u53F0"
    };
  }
  const userData = await getUserData();
  if (!userData) {
    return {
      errMsg: "\u8BF7\u5148\u6839\u636E\u6559\u7A0B\u7ED1\u5B9A\u5230Notion\u52A9\u624B"
    };
  }
  const { page, closeBrowser } = await openPage(url, adaptor);
  const parsedRes = await parse(page, type).finally(closeBrowser);
  console.log(parsedRes.articleBody);
  if (type === "getBasicInfo") {
    return {
      errMsg: "ok",
      data: {
        articleName: parsedRes.articleName,
        author: parsedRes.authorName
      }
    };
  }
  const res = await saveToNotion(parsedRes, userData, adaptor);
  tryAddCount(userData.openid);
  return res;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
