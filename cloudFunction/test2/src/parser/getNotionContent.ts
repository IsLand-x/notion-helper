function isTextNode(el: Node): el is Text {
  return el.nodeType === 3
}

function isElementNode(el: Node): el is Element {
  return el.nodeType === 1
}

function isHeadingElement(el: Element): el is HTMLHeadingElement {
  return ["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)
}

function isImgElement(el: Element): el is HTMLImageElement {
  return ["IMG"].includes(el.tagName)
}

function isHrElement(el: Element): el is HTMLHRElement {
  return ["HR"].includes(el.tagName)
}

function isBlockquoteElement(el: Element): el is HTMLQuoteElement {
  return ["BLOCKQUOTE"].includes(el.tagName)
}

function isBrElement(el: Element): el is HTMLBRElement {
  return ["BR"].includes(el.tagName)
}

function isUlElement(el: Element): el is HTMLUListElement {
  return ["UL"].includes(el.tagName)
}

function isOlElement(el: Element): el is HTMLOListElement {
  return ["OL"].includes(el.tagName)
}

function isLiElement(el: Element): el is HTMLLIElement {
  return ["LI"].includes(el.tagName)
}

function isCodeElement(el: Element): el is HTMLElement {
  return ["CODE"].includes(el.tagName)
}

function isAnchorElement(el: Element): el is HTMLAnchorElement {
  return ["A"].includes(el.tagName)
}

function isTableElement(el: Element): el is HTMLTableElement {
  return ["TABLE"].includes(el.tagName)
}

function isSpanElement(el: Element): el is HTMLSpanElement {
  return ["SPAN"].includes(el.tagName)
}

function shouldSkip(tag: string) {
  return ["TEXTAREA", "STYLE", "SCRIPT", "NOSCRIPT"].includes(tag)
}

function isTextLevelSemanticsElement(x: string) {
  return [
    "A", "EM", "STRONG", "CITE", "Q", "DFN",
    "ABBR", "TIME", "CODE", "VAR", "SAMP",
    "KBD", "SUB", "SUP", "I", "B", "MARK",
    "RUBY", "RP", "RT", "BDO", "SPAN", "BR",
    "WBR"
  ].includes(x)
}

function isSvgElement(el: Element): el is SVGAElement {
  return ["SVG"].includes(el.tagName)
}

export async function convertBody() {
  const adaptor = window.adaptor
  const content = document.querySelector(adaptor.contentSelector)
  const flatten = (el: Element) => {
    while (
      Array.from(el.children).length === 1 &&
      Array.from(el.children[0].children).length !== 0
    ) {
      el = el.children[0]
    }
    return Array.from(el.children)
  }
  const parse = async (eleArr: Element[]) => {
    const result = []
    for (const ele of eleArr) {
      const childArr = await genNotionFormat(ele);
      result.push(...childArr)
    }
    return result
  }
  async function genNotionFormat(el: Element | Node): Promise<any[]> {
    if (
      (!(isTextNode(el) || isElementNode(el))) ||
      (isElementNode(el) && (adaptor.shouldSkip(el.tagName) || shouldSkip(el.tagName)))
    ) {
      return []
    }
    if (isTextNode(el)) {
      const p = document.createElement("p")
      p.textContent = el.textContent
      return el.textContent.trim() !== "" ? treatAsParagraph(p) : []
    } else if (isHeadingElement(el)) {
      return treatAsHeading(el)
    } else if (isImgElement(el)) {
      return await treatAsImg(el)
    } else if (isHrElement(el)) {
      return treatAsDivider()
    } else if (isBlockquoteElement(el)) {
      return treatAsQuote(el)
    } else if (isBrElement(el)) {
      return treatAsBr()
    } else if (
      isUlElement(el) ||
      isOlElement(el)
    ) {
      return treatAsList(el)
    } else if (isLiElement(el)) {
      return treatAsListItem(el)
    } else if (isCodeElement(el)) {
      return treatAsCodeBlock(el)
    } else if (isTableElement(el)) {
      return treatAsTable(el)
    } else {
      const p = document.createElement("p")
      console.log(el.tagName)
      p.replaceChildren(...el.childNodes)
      return treatAsParagraph(p)
    }
  }
  const treatAsTable = async (el: HTMLTableElement) => {
    const hasHeader = el.querySelector("thead") !== undefined;
    const trs = el.querySelectorAll("tr")
    const children = []
    for (const x of trs) {
      children.push(...await processTr(x))
    }
    async function processTr(tr: HTMLTableRowElement) {
      const shouldBeTrOrTh = tr.firstElementChild.tagName === 'TH' ? 'th' : 'td'
      // check colSpan
      const childElements = [...tr.children];
      for (let i = 0; i < childElements.length; i++) {
        const cell = childElements[i] as HTMLTableCellElement
        const anchor = childElements[i + 1] as Element
        if (cell.colSpan >= 2) {
          for (let i = 0; i < cell.colSpan - 1; i++) {
            const temp = document.createElement(shouldBeTrOrTh)
            if (cell.rowSpan) {
              temp.rowSpan = cell.rowSpan
            }
            tr.insertBefore(temp, anchor)
          }
        }
      }
      let cells = tr.querySelectorAll(shouldBeTrOrTh)
      const children = []
      for (let i = 0; i < cells.length; i++) {
        const td = cells[i]
        const processed = await genNotionFormat(td)
        children.push(processed[0]?.paragraph?.rich_text || [{
          type: 'text',
          text: {
            content: 'Notion Table不支持该类型Block，剪藏失败',
            link: null
          }
        }])
        if (td.rowSpan >= 2) {
          let currentTr = tr;
          for (let j = 0; j < td.rowSpan - 1; j++) {
            currentTr = tr.nextElementSibling as HTMLTableRowElement || null;
            if (!currentTr) {
              break;
            }
            const tempTd = document.createElement(shouldBeTrOrTh)
            const anchor = currentTr.querySelectorAll(shouldBeTrOrTh)[i]
            currentTr.insertBefore(tempTd, anchor)
          }
        }
      }
      return [{
        type: 'table_row',
        table_row: {
          cells: children
        }
      }]
    }
    return [{
      type: "table",
      table: {
        table_width: children[0].table_row.cells.length,
        has_column_header: hasHeader,
        children: children
      }
    }]
  }
  const treatAsCodeBlock = (el: Element) => {
    const rawChildren = [...el.childNodes]
    const processedChildren: any[] = []
    let temp = document.createElement("p")
    const pushCodeLine = () => {
      const codeLine = parseTextChildren(temp)
        .map(r => r.text.content)
        .join("");
      processedChildren.push({
        type: "text",
        text: {
          content: codeLine
        }
      })
    }
    for (const x of rawChildren) {
      if (
        isTextNode(x) ||
        isElementNode(x) && x.tagName !== 'BR'
      ) {
        temp.appendChild(x)
      } else {
        temp.appendChild(document.createTextNode("\n"))
        pushCodeLine()
        temp = document.createElement("p")
      }
    }
    if (temp.hasChildNodes()) {
      pushCodeLine()
      temp = document.createElement("p")
    }
    return [{
      type: "code",
      code: {
        language: 'typescript',
        rich_text: processedChildren
      }
    }]
  }
  const treatAsList = async (el: HTMLUListElement | HTMLOListElement) => {
    const children = []
    for (const x of Array.from(el.childNodes)) {
      children.push(...await genNotionFormat(x))
    }

    return children;
  }
  const treatAsListItem = async (el: HTMLLIElement) => {
    const [first = {}, ...rest] = await processInternal(el)
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
  const treatAsBr = () => {
    return [{
      type: "paragraph",
      paragraph: {
        rich_text: [{
          type: "text",
          text: {
            content: "",
            link: null as null
          }
        }]
      }
    }]
  }
  const treatAsImg = async (el: HTMLImageElement) => {
    const rawSrc = adaptor.extractImgSrc(el)
    const src = await adaptor.processImgUrl(rawSrc)
    return !!src ? [{
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: src
        }
      }
    }] : [{
      type: "embed",
      embed: {
        url: rawSrc
      }
    }]
  }
  const treatAsQuote = async (el: HTMLQuoteElement) => {
    if (isAllTextChildren(el)) {
      return [{
        type: "quote",
        quote: {
          rich_text: parseTextChildren(el)
        }
      }]
    } else {
      const p = document.createElement("p")
      p.replaceChildren(...el.childNodes)
      let [first, ...rest] = await genNotionFormat(p)
      let firstRichText = null
      if (first.paragraph) {
        firstRichText = first.paragraph.rich_text;
      }
      return [{
        type: "quote",
        quote: {
          rich_text: firstRichText || [{
            type: 'text',
            text: {
              content: ''
            }
          }],
          children: rest.length !== 0 ? rest : undefined
        }
      }]
    }
  }
  function treatAsDivider() {
    return [{
      type: 'divider',
      divider: {}
    }]
  }
  async function processInternal(el: Element): Promise<any[]> {
    const result = []
    let temp = document.createElement("p")
    for (const x of Array.from(el.childNodes)) {
      if (isTextyNode(x)) {
        temp.appendChild(x)
      } else {
        temp.hasChildNodes() && result.push(...await genNotionFormat(temp))
        result.push(...await genNotionFormat(x))
        temp = document.createElement("p")
      }
    }
    temp.hasChildNodes() && result.push(...await treatAsParagraph(temp))
    return result
  }
  const treatAsHeading = (el: HTMLHeadingElement) => {
    const type = `heading_${+el.tagName[1] > 3 ? 3 : el.tagName[1]}`
    if (isAllTextChildren(el)) {
      return [{
        type: type,
        [type]: {
          rich_text: parseTextChildren(el)
        }
      }]
    } else {
      return processInternal(el)
    }
  }
  const treatAsParagraph = (el: HTMLParagraphElement) => {
    while (el.childElementCount === 1 && el.firstElementChild.tagName === 'P') {
      el = el.firstElementChild as HTMLParagraphElement
    }
    console.log(isAllTextChildren(el), el)
    if (isAllTextChildren(el)) {
      return [{
        type: "paragraph",
        paragraph: {
          rich_text: parseTextChildren(el)
        }
      }]
    } else {
      return processInternal(el)
    }
  }
  function isTextyNode(el: Element | Node): boolean {
    if (
      isElementNode(el) &&
      isCodeElement(el) &&
      Array.from(el.childNodes).length !== 1
    ) {
      // 多行代码应当转换成代码块
      return false
    }

    return (
      isTextNode(el) ||
      (
        isElementNode(el) &&
        isTextLevelSemanticsElement(el.tagName) &&
        Array.from(el.childNodes).every(el => isTextyNode(el))
      ) || (
        isElementNode(el) && isSvgElement(el)
      )
    )
  }
  const isAllTextChildren = (el: Element) => {
    for (const child of Array.from(el.childNodes)) {
      if (!isTextyNode(child)) {
        return false;
      }
    }
    return true;
  }
  const isUrl = (str: string) => str.startsWith("http")
  function parseTextChildren(el: Element): any[] {
    const result = []
    for (const child of Array.from(el.childNodes)) {
      if (isTextNode(child)) {
        result.push({
          type: 'text',
          text: {
            content: child.nodeValue,
            link: null
          }
        })
      } else if (
        isElementNode(child) &&
        ['a', 'strong', 'b', 'em', 'i', 'span', 'u', 'del', 'code', 'sub', 'sup'].includes(child.tagName.toLowerCase())
      ) {
        const temp = parseTextChildren(child)
        temp.forEach((eleObj: any) => {
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
          } else if (isAnchorElement(child)) {
            const url = child.href;
            if (isUrl(url)) {
              eleObj.text.link = {
                url
              }
            }
          }
        })
        result.push(...temp)
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
}