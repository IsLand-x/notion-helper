var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/parser/getNotionContent.ts
var getNotionContent_exports = {};
__export(getNotionContent_exports, {
  createNotionParser: () => createNotionParser
});
module.exports = __toCommonJS(getNotionContent_exports);
function createNotionParser(adaptor) {
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
  function isPreElement(el) {
    return ["PRE"].includes(el.tagName);
  }
  function isAnchorElement(el) {
    return ["A"].includes(el.tagName);
  }
  function shouldSkip(tag) {
    return ["TEXTAREA", "STYLE", "SCRIPT"].includes(tag);
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
  return function getNotionContent() {
    const content = document.querySelector(adaptor.contentSelector);
    const flatten = (el) => {
      while (Array.from(el.children).length === 1 && Array.from(el.children[0].children).length !== 0) {
        el = el.children[0];
      }
      return Array.from(el.children);
    };
    const parse = (eleArr) => {
      const result = [];
      for (const ele of eleArr) {
        const childArr = genNotionFormat(ele);
        result.push(...childArr);
      }
      return result;
    };
    function genNotionFormat(el) {
      if (!(isTextNode(el) || isElementNode(el)) || isElementNode(el) && (adaptor.shouldSkip(el.tagName) || shouldSkip(el.tagName))) {
        return [];
      }
      if (isTextNode(el)) {
        const p = document.createElement("p");
        p.textContent = el.textContent;
        return treatAsParagraph(p);
      } else if (isHeadingElement(el)) {
        return treatAsHeading(el);
      } else if (isImgElement(el)) {
        return treatAsImg(el);
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
      } else if (isPreElement(el)) {
        return treatAsPre(el);
      } else {
        const p = document.createElement("p");
        p.appendChild(el);
        return treatAsParagraph(p);
      }
    }
    const treatAsPre = (el) => {
      const result = [];
      for (const x of Array.from(el.childNodes)) {
        if (isTextyNode(x)) {
          const p = document.querySelector("p");
          p.appendChild(x);
          result.push(...treatAsParagraph(p));
        } else {
          result.push(...genNotionFormat(x));
        }
      }
      return result;
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
        if (isElementNode(x) && x.tagName !== "BR") {
          temp.append(x);
        } else {
          const eol = document.createTextNode("\n");
          temp.append(eol);
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
    const treatAsList = (el) => {
      const children = [];
      for (const x of Array.from(el.childNodes)) {
        children.push(...genNotionFormat(x));
      }
      return children;
    };
    const treatAsListItem = (el) => {
      const [first = {}, ...rest] = processInternal(el);
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
    const treatAsImg = (el) => {
      const rawSrc = adaptor.extractImgSrc(el);
      const src = adaptor.processImgUrl(rawSrc);
      return !!src ? [{
        type: "image",
        image: {
          type: "external",
          external: {
            url: src
          }
        }
      }] : [];
    };
    const treatAsQuote = (el) => {
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
        let [first, ...rest] = genNotionFormat(p);
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
    function processInternal(el) {
      const result = [];
      let temp = document.createElement("p");
      for (const x of Array.from(el.childNodes)) {
        if (isTextyNode(x)) {
          temp.appendChild(x);
        } else {
          temp.hasChildNodes() && result.push(...genNotionFormat(temp));
          result.push(...genNotionFormat(x));
          temp = document.createElement("p");
        }
      }
      temp.hasChildNodes() && result.push(...treatAsParagraph(temp));
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
      return isTextNode(el) || isElementNode(el) && isTextLevelSemanticsElement(el.tagName) && Array.from(el.childNodes).every((el2) => isTextyNode(el2));
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
              content: child.nodeValue.trim(),
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
                eleObj.text.link = url;
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
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNotionParser
});
