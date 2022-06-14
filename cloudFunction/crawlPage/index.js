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
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const el = document.querySelector("#js_name") || document.querySelector("#profile_share2 .account_meta.js_go_profile");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector("#activity-name") || document.querySelector("#js_video_page_title");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector("#publish_time");
    return getText(el);
  }
  async bgImgUrl() {
    var _a;
    const url = (_a = document.head.querySelector('meta[property="og:image"]')) == null ? void 0 : _a.getAttribute("content");
    return url ? this.processImgUrl(url) : void 0;
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
    const bgImgUrl = document.querySelector(".article-banner img");
    const el = bgImgUrl ? document.querySelector("#article-title") : document.querySelector(".article-info .title");
    return getText(el);
  }
  publishTime() {
    return new Date().toString();
  }
  async bgImgUrl() {
    const el = document.querySelector(".article-banner img");
    const url = el == null ? void 0 : el.src;
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

// src/adaptor/toutiaoAdaptor.ts
var ToutiaoAdaptor = class {
  constructor() {
    this.platform = "\u4ECA\u65E5\u5934\u6761\u56FE\u6587";
    this.contentSelector = "article";
    this.cookie = [{
      name: "ttwid",
      value: "test",
      domain: ".toutiao.com"
    }];
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/jinritoutiao.svg?sign=1113c9c86cc3973d1d22d6843d837c50&t=1653492964";
  }
  isMatch(url) {
    return /toutiao\.com/.test(url);
  }
  authorName() {
    const el = document.querySelector(".article-meta .name a");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".article-content h1");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".article-meta span:not([class])");
    return getText(el);
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    return !url ? void 0 : isLegalNotionImgFormat(prefix + ".png") ? prefix + ".png" : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [".map", "toutiaoimg", "captcha", "xgplayer", ".css", "snssdk", "sentry", "acrawler", "secsdk", "slardar"].some((x) => url.includes(x));
  }
};
var toutiaoAdaptor_default = new ToutiaoAdaptor();

// src/adaptor/xueqiuPostAdaptor.ts
var XueqiuPostAdaptor = class {
  constructor() {
    this.platform = "\u96EA\u7403\u70ED\u5E16";
    this.contentSelector = ".article__bd__detail";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/xueqiu.svg?sign=58aebc0906f405381a2dd04013c9a333&t=1653820234";
  }
  isMatch(url) {
    return /xueqiu\.com\/[0-9]+\/[0-9]+/.test(url);
  }
  authorName() {
    const el = document.querySelector(".article__bd__from a") || document.querySelector(".avatar__name .name");
    return getText(el);
  }
  articleName() {
    return window.document.title;
  }
  publishTime() {
    return void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      "assets.imedao.com",
      "xqimg.imedao.com",
      "hm.baidu.com",
      "xqdoc.imedao.com",
      "xavatar.imedao.com"
    ].some((x) => url.includes(x));
  }
};
var xueqiuPostAdaptor_default = new XueqiuPostAdaptor();

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
    return ["check_content_clean", "check_clean_content", "google"].some((x) => url.includes(x));
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

// src/adaptor/neteaseDesktopAdaptor.ts
var NeteaseMobileAdaptor = class {
  constructor() {
    this.platform = "\u684C\u9762\u7AEF\u7F51\u6613\u65B0\u95FB";
    this.contentSelector = ".post_body";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/netease.png?sign=2a3f08b842bdf7379aa86cb595a2221f&t=1653792323";
  }
  isMatch(url) {
    return /www\.163\.com/.test(url);
  }
  authorName() {
    const el = document.querySelector(".post_info a:not([class])");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".post_title");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".post_info");
    return getText(el).trim().slice(0, 19);
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      "bcebos.com",
      "nimg.ws.126.net",
      "baidustatic.com",
      "acstatic-dun.126.net",
      "urswebzj.nosdn.127.net",
      "acstatic-dun.126.net",
      "bdstatic.com"
    ].some((x) => url.includes(x));
  }
};
var neteaseDesktopAdaptor_default = new NeteaseMobileAdaptor();

// src/adaptor/neteaseMobileAdaptor.ts
var NeteaseMobileAdaptor2 = class {
  constructor() {
    this.platform = "\u79FB\u52A8\u7AEF\u7F51\u6613\u65B0\u95FB";
    this.contentSelector = "article";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/netease.png?sign=2a3f08b842bdf7379aa86cb595a2221f&t=1653792323";
  }
  isMatch(url) {
    return /m\.163\.com/.test(url);
  }
  authorName() {
    const el = document.querySelector(".header-subtitle-middle .s-source");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".header-title");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".s-ptime");
    return getText(el).trim().slice(0, 19);
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    var _a;
    return (_a = x.parentElement) == null ? void 0 : _a.dataset.echo;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      "bcebos.com",
      "ws.126.net",
      "baidustatic.com",
      "acstatic-dun.126.net",
      "urswebzj.nosdn.127.net",
      "acstatic-dun.126.net",
      "bdstatic.com",
      "toutiao.com",
      "pstatp.com"
    ].some((x) => url.includes(x));
  }
};
var neteaseMobileAdaptor_default = new NeteaseMobileAdaptor2();

// src/adaptor/qqChannelAdaptor.ts
var QQChannelAdpator = class {
  constructor() {
    this.platform = "qq\u9891\u9053";
    this.contentSelector = "#vue-editor-js";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/qq.svg?sign=bdc4fd30f0329f51a79da91efdb27fc2&t=1653817336";
  }
  isMatch(url) {
    return /qun\.qq\.com/.test(url);
  }
  authorName() {
    const el = document.querySelector(".main-area__poster-info__detail__nicktext");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".main-area__title span");
    return getText(el);
  }
  publishTime() {
    return new Date().toString();
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      "qpic.cn",
      "beacon.qq.com",
      "framework.cdn-go.cn",
      "myqcloud.com",
      "idqqimg.com",
      "gtimg.cn",
      "trace.qq.com",
      "qqweb.qq.com",
      "file.myqcloud.com",
      "data:",
      "recommend.qq.com"
    ].some((x) => url.includes(x));
  }
  async waitUntil() {
    for (let i = 0; i < 5; i++) {
      const app = document.querySelector("#app");
      if (app == null ? void 0 : app.hasAttribute("v-data-app")) {
        return;
      }
      await sleep(100);
    }
  }
};
var qqChannelAdaptor_default = new QQChannelAdpator();

// src/adaptor/weiboMobileAdaptor.ts
var weiboMobileAdpator = class {
  constructor() {
    this.platform = "\u5FAE\u535A\u79FB\u52A8\u7AEF";
    this.contentSelector = ".weibo-og";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/weibo.svg?sign=c8d0e8d0d165437e0b88f92d16083059&t=1653824271";
  }
  isMatch(url) {
    return /(m|api)\.weibo\.cn/.test(url);
  }
  authorName() {
    const el = document.querySelector(".m-text-box b") || document.querySelector(".m-text-cut");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".m-text-box b") || document.querySelector(".m-text-cut");
    return getText(el) + "\u7684\u5FAE\u535A";
  }
  publishTime() {
    return void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    url = url == null ? void 0 : url.replace("/orj360/", "/mw2000/");
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      ".jpg",
      ".png",
      ".ttf",
      ".woff",
      "cards.css",
      "base.css",
      "baiduad",
      "pos.baidu.com"
    ].some((x) => url.includes(x));
  }
};
var weiboMobileAdaptor_default = new weiboMobileAdpator();

// src/adaptor/weiboDesktopAdaptor.ts
var weiboDesktopAdpator = class {
  constructor() {
    this.platform = "\u5FAE\u535APC";
    this.contentSelector = ".wbpro-feed-content";
    this.waitNavigation = true;
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/weibo.svg?sign=c8d0e8d0d165437e0b88f92d16083059&t=1653824271";
  }
  isMatch(url) {
    return /weibo\.com/.test(url);
  }
  authorName() {
    const el = document.querySelector("a[class*='ALink_default'][class*='head_name']");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector("a[class*='ALink_default'][class*='head_name']");
    return getText(el) + "\u7684\u5FAE\u535A";
  }
  publishTime() {
    return void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    url = url == null ? void 0 : url.replace("/orj360/", "/mw2000/");
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      ".jpg",
      ".png",
      ".ttf",
      ".woff",
      "cards.css",
      "base.css",
      "baiduad",
      "pos.baidu.com",
      "weibo.cn/intake"
    ].some((x) => url.includes(x));
  }
  async waitUntil() {
    for (let i = 0; i < 5; i++) {
      const app = document.querySelector("a[class*='ALink_default'][class*='head_name']");
      if (app) {
        return;
      }
      await sleep(1e3);
    }
    throw new Error("Time out");
  }
};
var weiboDesktopAdaptor_default = new weiboDesktopAdpator();

// src/adaptor/weiboDesktopToutiaoAdaptor.ts
var weiboDesktopAdpator2 = class {
  constructor() {
    this.platform = "\u5FAE\u535APC\u5934\u6761";
    this.contentSelector = ".f-art";
    this.waitNavigation = false;
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/weibo.svg?sign=c8d0e8d0d165437e0b88f92d16083059&t=1653824271";
  }
  isMatch(url) {
    return /weibo\.com\/ttarticle/.test(url);
  }
  authorName() {
    const el = document.querySelector(".name.m-text-cut");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".f-art-tit");
    return getText(el);
  }
  publishTime() {
    return void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    url = url == null ? void 0 : url.replace("/orj360/", "/mw2000/");
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      ".jpg",
      ".png",
      ".ttf",
      ".woff",
      "cards.css",
      "base.css",
      "baiduad",
      "pos.baidu.com",
      "weibo.cn/intake",
      "/ttarticle/x/m/aj/recommend"
    ].some((x) => url.includes(x));
  }
  async waitUntil() {
    for (let i = 0; i < 5; i++) {
      const app = document.querySelector(".name.m-text-cut");
      if (app) {
        return;
      }
      console.log("waiting");
      await sleep(1e3);
    }
    throw new Error("Time out");
  }
};
var weiboDesktopToutiaoAdaptor_default = new weiboDesktopAdpator2();

// src/adaptor/bilibiliVideoAdaptor.ts
var bilibiliVideoAdaptor = class {
  constructor() {
    this.platform = "B\u7AD9\u89C6\u9891";
    this.contentSelector = "";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/bilibili.svg?sign=5ec53ed6636eb21bbcebb7fabcec97c5&t=1654839452";
  }
  isMatch(url) {
    return /(b23\.tv)|(bilibili\.com)/.test(url);
  }
  authorName() {
    const el = document.querySelector(".username");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".video-title.tit");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".pudate.item");
    return getText(el);
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      ".css",
      ".woff",
      ".svg",
      "bilivideo.com",
      "data.bilibili.com"
    ].some((x) => url.includes(x));
  }
  async customCrawlPageLogic() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("p") || 1;
    return [{
      type: "embed",
      embed: {
        url: `https://player.bilibili.com/player.html?bvid=${window.bvid}&page=${page}`
      }
    }];
  }
};
var bilibiliVideoAdaptor_default = new bilibiliVideoAdaptor();

// src/adaptor/coolapkFeedAdaptor.ts
var coolapkFeedAdaptor = class {
  constructor() {
    this.platform = "\u9177\u5B89feed";
    this.contentSelector = "";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/coolapk.svg?sign=afd08253f4e55d727e33548f066b3643&t=1654841991";
  }
  isMatch(url) {
    return /www\.coolapk\.com\/feed/.test(url);
  }
  authorName() {
    const el = document.querySelector(".username-item p");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".message-title") || document.querySelector("title");
    return getText(el);
  }
  publishTime() {
    return void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  async getContent() {
    const feedMessage = document.querySelector(".feed-message") || document.createComment("");
    const messageImageGroup = document.querySelector(".message-image-group") || document.createComment("");
    const container = document.createElement("div");
    container.append(feedMessage);
    container.append(messageImageGroup);
    return container;
  }
  extractImgSrc(x) {
    var _a;
    return (_a = x.src) == null ? void 0 : _a.replace("http://", "https://");
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      ".jpg",
      ".jpeg",
      ".png",
      ".js",
      ".css",
      "data:image"
    ].some((x) => url.includes(x));
  }
};
var coolapkFeedAdaptor_default = new coolapkFeedAdaptor();

// src/adaptor/xiaoyuzhoufmAdaptor.ts
var xiaoyuzhoufmAdaptor = class {
  constructor() {
    this.platform = "\u5C0F\u5B87\u5B99fm";
    this.contentSelector = "";
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/platform-logo/xiaoyuzhoufm.png?sign=dcf76227ef81f1ff9616e35a83b910ea&t=1654845878";
  }
  isMatch(url) {
    return /www\.xiaoyuzhoufm\.com\/episode/.test(url);
  }
  authorName() {
    const el = document.querySelector(".name");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector("header .title") || document.querySelector("title");
    return getText(el);
  }
  publishTime() {
    return void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  async getContent() {
    const audio = document.querySelector("audio") || document.createComment("");
    const content = document.querySelector("article") || document.createComment("");
    const container = document.createElement("div");
    container.append(audio);
    container.append(content);
    return container;
  }
  extractImgSrc(x) {
    var _a;
    return (_a = x.src) == null ? void 0 : _a.replace("http://", "https://");
  }
  shouldSkip(x) {
    return false;
  }
  forbidRequest(url) {
    return [
      ".jpg",
      ".jpeg",
      ".png",
      ".css",
      "image.xyzcdn.net"
    ].some((x) => url.includes(x));
  }
};
var xiaoyuzhoufmAdaptor_default = new xiaoyuzhoufmAdaptor();

// src/adaptor/defaultAdaptor.ts
var defaultAdaptor = class {
  constructor() {
    this.platform = "\u515C\u5E95";
    this.contentSelector = "";
    this.iconUrl = "";
  }
  isMatch(url) {
    return true;
  }
  authorName() {
    return "";
  }
  articleName() {
    return document.title;
  }
  publishTime() {
    return void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return false;
  }
  async getContent() {
    const container = document.createElement("div");
    return container;
  }
  forbidRequest(url) {
    return [
      ".css",
      ".woff",
      ".svg",
      ".js",
      "data:",
      ".png",
      ".svg",
      ".jpeg",
      ".jpg",
      ".gif",
      ".webp"
    ].some((x) => url.includes(x));
  }
};
var defaultAdaptor_default = new defaultAdaptor();

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
  doubanAnnotationAdaptor_default,
  toutiaoAdaptor_default,
  neteaseDesktopAdaptor_default,
  neteaseMobileAdaptor_default,
  qqChannelAdaptor_default,
  xueqiuPostAdaptor_default,
  weiboMobileAdaptor_default,
  weiboDesktopToutiaoAdaptor_default,
  weiboDesktopAdaptor_default,
  bilibiliVideoAdaptor_default,
  coolapkFeedAdaptor_default,
  xiaoyuzhoufmAdaptor_default,
  defaultAdaptor_default
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
var shouldSave = (type) => ["shortcut", "save"].includes(type);
async function parse(page, type) {
  let errMsg = [];
  console.log("waiting");
  await page.evaluate(async () => {
    var _a, _b;
    await ((_b = (_a = window.adaptor).waitUntil) == null ? void 0 : _b.call(_a));
  });
  console.log("start Crawling");
  const getArticleBody = () => shouldSave(type) ? page.evaluate(() => {
    var _a, _b;
    return ((_b = (_a = window.adaptor).customCrawlPageLogic) == null ? void 0 : _b.call(_a)) || window.convertBody();
  }).catch((e) => {
    errMsg.push("\u6587\u7AE0\u5185\u5BB9\u63D0\u53D6\u5931\u8D25");
    console.log(e);
    return void 0;
  }) : [];
  const getArticleName = () => page.evaluate(() => window.adaptor.articleName()).catch((e) => {
    errMsg.push("\u6587\u7AE0\u6807\u9898\u63D0\u53D6\u5931\u8D25");
    console.log(e);
    return "\u6587\u7AE0\u6807\u9898\u63D0\u53D6\u5931\u8D25";
  });
  const getAuthorName = () => page.evaluate(() => window.adaptor.authorName()).catch((e) => {
    errMsg.push("\u4F5C\u8005\u540D\u79F0\u63D0\u53D6\u5931\u8D25");
    console.log(e);
    return "\u4F5C\u8005\u540D\u79F0\u63D0\u53D6\u5931\u8D25";
  });
  const getPublishTime = () => shouldSave(type) && page.evaluate(() => window.adaptor.publishTime()).catch((e) => {
    errMsg.push("\u53D1\u5E03\u65E5\u671F\u63D0\u53D6\u5931\u8D25");
    console.log(e);
    return new Date();
  });
  const getBgImgUrl = () => shouldSave(type) && page.evaluate(() => window.adaptor.bgImgUrl()).catch((e) => {
    errMsg.push("\u80CC\u666F\u56FE\u63D0\u53D6\u5931\u8D25");
    console.log(e);
    return void 0;
  });
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
    url,
    errMsg: errMsg.join(",")
  };
}

// src/index.ts
var import_puppeteer = __toESM(require("puppeteer"));
var import_client = require("@notionhq/client");
import_wx_server_sdk.default.init();
var _ = import_wx_server_sdk.default.database().command;
var debugUrl = "ws://localhost:9222/devtools/browser/c946f795-f9de-4474-85f9-2fc36736233b";
var sleep7 = (ms) => {
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
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53");
  await page.setCookie(...adaptor.cookie || []);
  await page.goto(url);
  if (adaptor.waitNavigation) {
    await page.waitForNavigation();
  }
  await page.addScriptTag({ path: "./preload.js" });
  await sleep7(100);
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
  const { db, key } = user;
  console.log("Db", db);
  console.log("Key", key);
  const notion = new import_client.Client({ auth: key });
  const requestPayload = {
    parent: {
      type: "database_id",
      database_id: db
    },
    icon: adaptor.iconUrl !== "" ? {
      type: "external",
      external: {
        url: adaptor.iconUrl
      }
    } : void 0,
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
      Date: publishTime === void 0 ? void 0 : {
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
  };
  let response = await notion.pages.create(requestPayload).catch((e) => {
    console.error(e);
    console.log(articleBody);
    return e;
  });
  if (debugUrl) {
    console.log(articleBody);
  }
  if (response.code === "validation_error") {
    requestPayload.properties.Name = {
      title: [{
        text: {
          content: `[\u4EC5\u94FE\u63A5]` + articleName
        }
      }]
    };
    delete requestPayload.children;
    response = await notion.pages.create(requestPayload).catch((e) => {
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
  return {
    errMsg: adaptor.platform === "\u515C\u5E95" ? "\u6682\u4E0D\u652F\u6301\u8BE5\u5E73\u53F0\u5185\u5BB9\u526A\u85CF\uFF0C\u4F46\u4FDD\u5B58\u94FE\u63A5\u5230Notion" : res.errMsg ? res.errMsg + ",\u4F46\u6210\u529F\u4FDD\u5B58\u94FE\u63A5\u5230Notion" : "ok",
    data: {
      articleName,
      author: authorName
    }
  };
}
async function getUserData(secret) {
  const { OPENID } = import_wx_server_sdk.default.getWXContext();
  const data = await import_wx_server_sdk.default.database().collection("user").where(OPENID ? {
    openid: OPENID
  } : {
    key: secret
  }).limit(1).get();
  return data.data[0];
}
var tryAddCount = (openid) => {
  import_wx_server_sdk.default.database().collection("user").where({ openid }).update({
    data: {
      articleSaveCnt: _.inc(1),
      lastUseDate: new Date()
    }
  });
};
var callCount = 0;
async function main(evt) {
  console.log(evt);
  const { type = "save", url } = evt;
  let secret;
  if (["shortcut", "crx"].includes(evt.type)) {
    secret = evt.secret;
  }
  console.log("CallCount", callCount++);
  console.log("Type:", type);
  console.log("Url:", url);
  const wxCtx = (0, import_wx_server_sdk.getWXContext)();
  console.log(wxCtx);
  const userData = await getUserData(secret);
  if (!userData) {
    return {
      errMsg: "\u8BF7\u5148\u6839\u636E\u6559\u7A0B\u7ED1\u5B9A\u5230Notion\u52A9\u624B"
    };
  }
  const adaptor = getAdaptor(url);
  const { page, closeBrowser } = await openPage(url, adaptor);
  const parsedRes = await parse(page, type).finally(closeBrowser);
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
