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
    this.iconUrl = "https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/WeChat_logo2.svg?sign=7c85c832ca495356bf87a586fa680acd&t=1650423985";
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
    return x.dataset.src;
  }
  shouldSkip(x) {
    return ["MPPROFILE", "MPVIDEOSNAP"].includes(x);
  }
};
var mpAdaptor_default = new MpAdaptor();

// src/adaptor/juejinAdaptor.ts
var JuejinAdaptor = class {
  constructor() {
    this.platform = "\u6398\u91D1\u56FE\u6587";
    this.contentSelector = ".article-content";
    this.iconUrl = "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/apple-touch-icon.png";
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
    console.log(url);
    if (!url) {
      return null;
    }
    console.log(url);
    return await this.processImgUrl(url || void 0);
  }
  async processImgUrl(url) {
    const rawPrefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    const legalizeToNotionFormat = (prefix) => {
      const hasExt = /\.[0-9a-zA-Z]+$/.test(prefix);
      prefix = hasExt ? prefix.replace(/\.[0-9a-zA-Z]+$/, "") : prefix;
      return fetch(prefix + ".gif").then((res) => res.json()).then(() => prefix + ".png").catch(() => prefix + ".gif");
    };
    return isLegalNotionImgFormat(rawPrefix) ? rawPrefix : legalizeToNotionFormat(rawPrefix);
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return [].includes(x);
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
  bgImgUrl() {
    const el = document.querySelector(".article-banner img");
    const url = el.src;
    return this.processImgUrl(url || void 0);
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    return !url ? null : isLegalNotionImgFormat(prefix) ? prefix : null;
  }
  extractImgSrc(x) {
    return x.dataset.original;
  }
  shouldSkip(x) {
    return [].includes(x);
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
  bgImgUrl() {
    const el = document.querySelector(".TitleImage");
    const url = el == null ? void 0 : el.src;
    return this.processImgUrl(url || void 0);
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    return !url ? null : isLegalNotionImgFormat(prefix) ? prefix : null;
  }
  extractImgSrc(x) {
    return x.dataset.original;
  }
  shouldSkip(x) {
    return [].includes(x);
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
    return /www\.zhihu\.com\/question/.test(url);
  }
  authorName() {
    const el = document.querySelector(".Card.AnswerCard .AuthorInfo-head .UserLink-link") || document.querySelector(".Card.AnswerCard .AuthorInfo-head .UserLink");
    return getText(el);
  }
  articleName() {
    const el = document.querySelector(".QuestionHeader .QuestionHeader-title");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector(".Card.AnswerCard .ContentItem-time span");
    return getText(el).split(" ").slice(1).join(" ");
  }
  bgImgUrl() {
    return null;
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://");
    return !url ? null : isLegalNotionImgFormat(prefix) ? prefix : null;
  }
  extractImgSrc(x) {
    return x.dataset.original;
  }
  shouldSkip(x) {
    return [].includes(x);
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
    return /www\.douban\.com\/note/.test(url);
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
  bgImgUrl() {
    return null;
  }
  async processImgUrl(url) {
    const prefix = url == null ? void 0 : url.split("?")[0].replace("http://", "https://").replace(".webp", ".jpeg");
    return !url ? null : isLegalNotionImgFormat(prefix) ? prefix : null;
  }
  extractImgSrc(x) {
    return x.src;
  }
  shouldSkip(x) {
    return [].includes(x);
  }
  forbidRequest(url) {
    if (url.includes("check_clean_content") || url.includes("google")) {
      return true;
    }
    return false;
  }
};
var doubanNoteAdaptor_default = new DoubanNoteAdaptor();

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
    const el = document.querySelector("a.text-body");
    return getText(el);
  }
  publishTime() {
    const el = document.querySelector("time");
    return el.dateTime;
  }
  bgImgUrl() {
    return null;
  }
  processImgUrl(url) {
    return isLegalNotionImgFormat(url) ? url : null;
  }
  extractImgSrc(x) {
    const rawSrc = x.dataset.src;
    return rawSrc.startsWith("/") ? "https://segmentfault.com" + rawSrc : rawSrc;
  }
  shouldSkip(x) {
    return [].includes(x);
  }
};
var segmentfaultAdaptor_default = new SegmentfaultAdaptor();

// src/adaptor/index.ts
var adaptorArr = [
  mpAdaptor_default,
  juejinAdaptor_default,
  sspaiAdaptor_default,
  zhihuPostAdaptor_default,
  zhihuAnswerAdaptor_default,
  doubanNoteAdaptor_default,
  segmentfaultAdaptor_default
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
function shouldSkip(tag) {
  return ["TEXTAREA", "STYLE", "SCRIPT", "NOSCRIPT"].includes(tag);
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
  return ["SVG"].includes(el.tagName);
}
async function convertBody() {
  const adaptor = window.adaptor;
  const content = document.querySelector(adaptor.contentSelector);
  const flatten = (el) => {
    while (Array.from(el.children).length === 1 && Array.from(el.children[0].children).length !== 0) {
      el = el.children[0];
    }
    return Array.from(el.children);
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
    if (!(isTextNode(el) || isElementNode(el)) || isElementNode(el) && (adaptor.shouldSkip(el.tagName) || shouldSkip(el.tagName))) {
      return [];
    }
    if (isTextNode(el)) {
      const p = document.createElement("p");
      p.textContent = el.textContent;
      return el.textContent.trim() !== "" ? treatAsParagraph(p) : [];
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
    } else {
      const p = document.createElement("p");
      console.log(el.tagName);
      p.replaceChildren(...el.childNodes);
      return treatAsParagraph(p);
    }
  }
  const treatAsTable = async (el) => {
    const hasHeader = el.querySelector("thead") !== void 0;
    const trs = el.querySelectorAll("tr");
    const children = [];
    for (const x of trs) {
      children.push(...await processTr(x));
    }
    async function processTr(tr) {
      var _a, _b;
      const shouldBeTrOrTh = tr.firstElementChild.tagName === "TH" ? "th" : "td";
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
        children2.push(((_b = (_a = processed[0]) == null ? void 0 : _a.paragraph) == null ? void 0 : _b.rich_text) || [{
          type: "text",
          text: {
            content: "Notion Table\u4E0D\u652F\u6301\u8BE5\u7C7B\u578BBlock\uFF0C\u526A\u85CF\u5931\u8D25",
            link: null
          }
        }]);
        if (td.rowSpan >= 2) {
          let currentTr = tr;
          for (let j = 0; j < td.rowSpan - 1; j++) {
            currentTr = tr.nextElementSibling || null;
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
    const children = rest.length !== 0 ? [...first.children || [], ...rest] : first.children || void 0;
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
    return !!src ? [{
      type: "image",
      image: {
        type: "external",
        external: {
          url: src
        }
      }
    }] : [{
      type: "embed",
      embed: {
        url: rawSrc
      }
    }];
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
      p.replaceChildren(...el.childNodes);
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
    while (el.childElementCount === 1 && el.firstElementChild.tagName === "P") {
      el = el.firstElementChild;
    }
    console.log(isAllTextChildren(el), el);
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
    return isTextNode(el) || isElementNode(el) && isTextLevelSemanticsElement(el.tagName) && Array.from(el.childNodes).every((el2) => isTextyNode(el2)) || isElementNode(el) && isSvgElement(el);
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
    for (const child of Array.from(el.childNodes)) {
      if (isTextNode(child)) {
        result.push({
          type: "text",
          text: {
            content: child.nodeValue,
            link: null
          }
        });
      } else if (isElementNode(child) && ["a", "strong", "b", "em", "i", "span", "u", "del", "code", "sub", "sup"].includes(child.tagName.toLowerCase())) {
        const temp = parseTextChildren(child);
        temp.forEach((eleObj) => {
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
  return parse(flatten(content));
}

// src/preload.ts
console.log("Preload js executed");
window.adaptor = getAdaptor(window.location.href);
window.convertBody = convertBody;
