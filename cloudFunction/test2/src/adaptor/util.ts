export const getText = (el: Element) => el.textContent?.trim() || '';

export const isLegalNotionImgFormat = (url?: string) => url
  ? /\.(png|jpg|jpeg|gif|tif|tiff|bmp|svg|heic)$/.test(url)
  : false