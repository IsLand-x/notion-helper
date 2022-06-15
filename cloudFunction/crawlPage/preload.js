// src/adaptor/util.ts
var getText = (el) => {
  var _a;
  return ((_a = el.textContent) == null ? void 0 : _a.trim()) || "";
};
var isLegalNotionImgFormat = (url) => url ? /\.(png|jpg|jpeg|gif|tif|tiff|bmp|svg|heic)/.test(url) : false;
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

// src/adaptor/crxAdaptor.ts
var crxAdaptor = class {
  constructor() {
    this.platform = "crx";
    this.contentSelector = "#__notion__helper__container__";
    this.iconUrl = "";
  }
  isMatch(url) {
    return url === "about:blank";
  }
  authorName() {
    return getText(document.querySelector("#__notion__helper__author__"));
  }
  articleName() {
    return document.title;
  }
  publishTime() {
    return getText(document.querySelector("#__notion__helper__date__")) || void 0;
  }
  async bgImgUrl() {
    return void 0;
  }
  async processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : void 0;
  }
  extractImgSrc(x) {
    const link = getText(document.querySelector("#__notion__helper__link__"));
    const src = x.getAttribute("src") || x.getAttribute("data-src") || x.getAttribute("data-original") || "";
    let prefix = "";
    try {
      const url = new URL(link);
      prefix = url.origin;
    } catch (e) {
      prefix = "";
    }
    return isLegalNotionImgFormat(src) && src.startsWith("http") ? x.getAttribute("src") : prefix + x.getAttribute("src");
  }
  shouldSkip(x) {
    return false;
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
var crxAdaptor_default = new crxAdaptor();

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
  crxAdaptor_default,
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

// src/parser/getNotionContent.ts
function isTextNode(el) {
  return el.nodeType === 3;
}
function isElementNode(el) {
  return el.nodeType === 1;
}
function isHeadingElement(el) {
  return ["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName);
}
function isImgElement(el) {
  return ["IMG"].includes(el.tagName);
}
function isHrElement(el) {
  return ["HR"].includes(el.tagName);
}
function isBlockquoteElement(el) {
  return ["BLOCKQUOTE"].includes(el.tagName);
}
function isBrElement(el) {
  return ["BR"].includes(el.tagName);
}
function isUlElement(el) {
  return ["UL"].includes(el.tagName);
}
function isOlElement(el) {
  return ["OL"].includes(el.tagName);
}
function isLiElement(el) {
  return ["LI"].includes(el.tagName);
}
function isCodeElement(el) {
  return ["CODE"].includes(el.tagName);
}
function isAnchorElement(el) {
  return ["A"].includes(el.tagName);
}
function isTableElement(el) {
  return ["TABLE"].includes(el.tagName);
}
function isSpanElement(el) {
  return ["SPAN"].includes(el.tagName);
}
function shouldSkip(tag) {
  return ["TEXTAREA", "STYLE", "SCRIPT", "NOSCRIPT", "SOURCE"].includes(tag);
}
function isAudioElement(el) {
  return ["AUDIO"].includes(el.tagName);
}
function isTextLevelSemanticsElement(x) {
  return [
    "A",
    "EM",
    "STRONG",
    "CITE",
    "Q",
    "DFN",
    "ABBR",
    "TIME",
    "CODE",
    "VAR",
    "SAMP",
    "KBD",
    "SUB",
    "SUP",
    "I",
    "B",
    "MARK",
    "RUBY",
    "RP",
    "RT",
    "BDO",
    "SPAN",
    "BR",
    "WBR"
  ].includes(x);
}
function isSvgElement(el) {
  return ["svg"].includes(el.tagName);
}
function replaceChildren(container, childNodes) {
  for (const node of childNodes) {
    container.appendChild(node);
  }
}
function replaceAttributes(to, from) {
  for (const a of from.attributes) {
    to.setAttribute(a.name, a.value);
  }
}
async function convertBody() {
  var _a, _b;
  const adaptor = window.adaptor;
  const content = await ((_b = (_a = window.adaptor).getContent) == null ? void 0 : _b.call(_a)) || document.querySelector(adaptor.contentSelector);
  const flatten = (el) => {
    while (Array.from(el.children).length === 1 && Array.from(el.children[0].children).length !== 0) {
      el = el.children[0];
    }
    return Array.from(el.childNodes);
  };
  const parse = async (eleArr) => {
    const result = [];
    for (const ele of eleArr) {
      const childArr = await genNotionFormat(ele);
      result.push(...childArr);
    }
    return result;
  };
  async function genNotionFormat(el) {
    var _a2, _b2;
    if (!(isTextNode(el) || isElementNode(el)) || isElementNode(el) && (((_a2 = adaptor.shouldSkip) == null ? void 0 : _a2.call(adaptor, el.tagName)) || shouldSkip(el.tagName))) {
      return [];
    }
    if (isTextNode(el)) {
      const p = document.createElement("p");
      p.textContent = el.textContent;
      return ((_b2 = el.textContent) == null ? void 0 : _b2.trim()) !== "" ? treatAsParagraph(p) : [];
    } else if (isHeadingElement(el)) {
      return treatAsHeading(el);
    } else if (isImgElement(el)) {
      return await treatAsImg(el);
    } else if (isHrElement(el)) {
      return treatAsDivider();
    } else if (isBlockquoteElement(el)) {
      return treatAsQuote(el);
    } else if (isBrElement(el)) {
      return treatAsBr();
    } else if (isUlElement(el) || isOlElement(el)) {
      return treatAsList(el);
    } else if (isLiElement(el)) {
      return treatAsListItem(el);
    } else if (isCodeElement(el)) {
      return treatAsCodeBlock(el);
    } else if (isTableElement(el)) {
      return treatAsTable(el);
    } else if (isAudioElement(el)) {
      return treatAsAudio(el);
    } else {
      const p = document.createElement("p");
      replaceChildren(p, [...el.childNodes]);
      replaceAttributes(p, el);
      return treatAsParagraph(p);
    }
  }
  const treatAsAudio = async (el) => {
    return el.src ? [
      {
        type: "embed",
        embed: {
          url: el.src
        }
      }
    ] : [];
  };
  const treatAsTable = async (el) => {
    const hasHeader = el.querySelector("thead") !== void 0;
    const trs = el.querySelectorAll("tr");
    const children = [];
    for (const x of trs) {
      children.push(...await processTr(x));
    }
    async function processTr(tr) {
      var _a2;
      const shouldBeTrOrTh = ((_a2 = tr.firstElementChild) == null ? void 0 : _a2.tagName) === "TH" ? "th" : "td";
      const childElements = [...tr.children];
      for (let i = 0; i < childElements.length; i++) {
        const cell = childElements[i];
        const anchor = childElements[i + 1];
        if (cell.colSpan >= 2) {
          for (let i2 = 0; i2 < cell.colSpan - 1; i2++) {
            const temp = document.createElement(shouldBeTrOrTh);
            if (cell.rowSpan) {
              temp.rowSpan = cell.rowSpan;
            }
            tr.insertBefore(temp, anchor);
          }
        }
      }
      let cells = tr.querySelectorAll(shouldBeTrOrTh);
      const children2 = [];
      for (let i = 0; i < cells.length; i++) {
        const td = cells[i];
        const processed = await genNotionFormat(td);
        const text = processed.map((c) => {
          var _a3;
          return ((_a3 = c == null ? void 0 : c.paragraph) == null ? void 0 : _a3.rich_text) || [{
            type: "text",
            text: {
              content: "Notion Table\u4E0D\u652F\u6301\u8BE5\u7C7B\u578BBlock\uFF0C\u526A\u85CF\u5931\u8D25",
              link: null
            }
          }];
        }).flat();
        children2.push(text);
        if (td.rowSpan >= 2) {
          let currentTr = tr;
          for (let j = 0; j < td.rowSpan - 1; j++) {
            currentTr = currentTr.nextElementSibling || null;
            if (!currentTr) {
              break;
            }
            const tempTd = document.createElement(shouldBeTrOrTh);
            const anchor = currentTr.querySelectorAll(shouldBeTrOrTh)[i];
            currentTr.insertBefore(tempTd, anchor);
          }
        }
      }
      return [{
        type: "table_row",
        table_row: {
          cells: children2
        }
      }];
    }
    return [{
      type: "table",
      table: {
        table_width: children[0].table_row.cells.length,
        has_column_header: hasHeader,
        children
      }
    }];
  };
  const treatAsCodeBlock = (el) => {
    const rawChildren = [...el.childNodes];
    const processedChildren = [];
    let temp = document.createElement("p");
    const pushCodeLine = () => {
      const codeLine = parseTextChildren(temp).map((r) => r.text.content).join("");
      processedChildren.push({
        type: "text",
        text: {
          content: codeLine
        }
      });
    };
    for (const x of rawChildren) {
      if (isTextNode(x) || isElementNode(x) && x.tagName !== "BR") {
        temp.appendChild(x);
      } else {
        temp.appendChild(document.createTextNode("\n"));
        pushCodeLine();
        temp = document.createElement("p");
      }
    }
    if (temp.hasChildNodes()) {
      pushCodeLine();
      temp = document.createElement("p");
    }
    return [{
      type: "code",
      code: {
        language: "typescript",
        rich_text: processedChildren
      }
    }];
  };
  const treatAsList = async (el) => {
    const children = [];
    for (const x of Array.from(el.childNodes)) {
      children.push(...await genNotionFormat(x));
    }
    return children;
  };
  const treatAsListItem = async (el) => {
    const [first = {}, ...rest] = await processInternal(el);
    const children = rest.length !== 0 ? [...first.children || [], ...rest] : first.children || [];
    return [{
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: first.type === "paragraph" ? first.paragraph.rich_text : [],
        children
      }
    }];
  };
  const treatAsBr = () => {
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
    }];
  };
  const treatAsImg = async (el) => {
    const rawSrc = adaptor.extractImgSrc(el);
    const src = await adaptor.processImgUrl(rawSrc);
    if ((rawSrc == null ? void 0 : rawSrc.startsWith("data:")) || src && !(src == null ? void 0 : src.startsWith("https://"))) {
      return [];
    }
    const data = !!src ? [{
      type: "image",
      image: {
        type: "external",
        external: {
          url: src
        }
      }
    }] : !!rawSrc ? [{
      type: "embed",
      embed: {
        url: rawSrc
      }
    }] : [];
    return data;
  };
  const treatAsQuote = async (el) => {
    if (isAllTextChildren(el)) {
      return [{
        type: "quote",
        quote: {
          rich_text: parseTextChildren(el)
        }
      }];
    } else {
      const p = document.createElement("p");
      while (el.childNodes.length === 1 && el.firstElementChild && isElementNode(el.firstElementChild)) {
        el = el.firstElementChild;
      }
      replaceChildren(p, [...el.childNodes]);
      replaceAttributes(p, el);
      let [first, ...rest] = await genNotionFormat(p);
      let firstRichText = null;
      if (first.paragraph) {
        firstRichText = first.paragraph.rich_text;
      }
      return [{
        type: "quote",
        quote: {
          rich_text: firstRichText || [{
            type: "text",
            text: {
              content: ""
            }
          }],
          children: rest.length !== 0 ? rest : void 0
        }
      }];
    }
  };
  function treatAsDivider() {
    return [{
      type: "divider",
      divider: {}
    }];
  }
  async function processInternal(el) {
    const result = [];
    let temp = document.createElement("p");
    for (const x of Array.from(el.childNodes)) {
      if (isElementNode(x) && shouldSkip(x.tagName)) {
        continue;
      }
      if (isTextyNode(x)) {
        temp.appendChild(x);
      } else {
        temp.hasChildNodes() && result.push(...await genNotionFormat(temp));
        result.push(...await genNotionFormat(x));
        temp = document.createElement("p");
      }
    }
    temp.hasChildNodes() && result.push(...await treatAsParagraph(temp));
    return result;
  }
  const treatAsHeading = (el) => {
    const type = `heading_${+el.tagName[1] > 3 ? 3 : el.tagName[1]}`;
    if (isAllTextChildren(el)) {
      return [{
        type,
        [type]: {
          rich_text: parseTextChildren(el)
        }
      }];
    } else {
      return processInternal(el);
    }
  };
  const treatAsParagraph = (el) => {
    var _a2;
    while (el.childElementCount === 1 && ((_a2 = el.firstElementChild) == null ? void 0 : _a2.tagName) === "P") {
      el = el.firstElementChild;
    }
    if (isAllTextChildren(el)) {
      return [{
        type: "paragraph",
        paragraph: {
          rich_text: parseTextChildren(el)
        }
      }];
    } else {
      return processInternal(el);
    }
  };
  function isTextyNode(el) {
    if (isElementNode(el) && isCodeElement(el) && Array.from(el.childNodes).length !== 1) {
      return false;
    }
    const result = isTextNode(el) || isElementNode(el) && (shouldSkip(el.tagName) || isSvgElement(el) || isTextLevelSemanticsElement(el.tagName) && Array.from(el.childNodes).every((child) => isTextyNode(child)) || isImgElement(el) && el.dataset.formula !== void 0);
    return result;
  }
  const isAllTextChildren = (el) => {
    for (const child of Array.from(el.childNodes)) {
      if (!isTextyNode(child)) {
        return false;
      }
    }
    return true;
  };
  const isUrl = (str) => str.startsWith("http");
  function parseTextChildren(el) {
    const result = [];
    if (isElementNode(el) && isSpanElement(el) && el.dataset.formula) {
      result.push({
        type: "equation",
        equation: {
          expression: el.dataset.formula
        }
      });
      return result;
    }
    for (const child of Array.from(el.childNodes)) {
      if (isTextNode(child)) {
        result.push({
          type: "text",
          text: {
            content: child.nodeValue,
            link: null
          }
        });
      } else if (isElementNode(child) && (isSpanElement(child) && child.dataset.formula || isImgElement(child) && child.dataset.formula)) {
        result.push({
          type: "equation",
          equation: {
            expression: child.dataset.formula
          }
        });
      } else if (isElementNode(child) && ["a", "strong", "b", "em", "i", "span", "u", "del", "code", "sub", "sup"].includes(child.tagName.toLowerCase())) {
        const temp = parseTextChildren(child);
        temp.forEach((eleObj) => {
          if (eleObj.type === "equation") {
            return;
          }
          if (["strong", "b"].includes(child.tagName.toLowerCase())) {
            const annotations = eleObj.annotations || {};
            annotations.bold = true;
            eleObj.annotations = annotations;
          } else if (["em", "i"].includes(child.tagName.toLowerCase())) {
            const annotations = eleObj.annotations || {};
            annotations.italic = true;
            eleObj.annotations = annotations;
          } else if (["del"].includes(child.tagName.toLowerCase())) {
            const annotations = eleObj.annotations || {};
            annotations.strikethrough = true;
            eleObj.annotations = annotations;
          } else if (["u"].includes(child.tagName.toLowerCase())) {
            const annotations = eleObj.annotations || {};
            annotations.underline = true;
            eleObj.annotations = annotations;
          } else if (["code"].includes(child.tagName.toLowerCase())) {
            const annotations = eleObj.annotations || {};
            annotations.code = true;
            eleObj.annotations = annotations;
          } else if (isAnchorElement(child)) {
            const url = child.href;
            if (isUrl(url)) {
              eleObj.text.link = {
                url
              };
            }
          }
        });
        result.push(...temp);
      } else {
        result.push({
          type: "text",
          text: {
            content: child.textContent,
            link: null
          }
        });
      }
    }
    return result;
  }
  return parse(flatten(content || document.createElement("p")));
}

// src/preload.ts
console.log("Preload js executed");
window.adaptor = getAdaptor(window.location.href);
window.convertBody = convertBody;
