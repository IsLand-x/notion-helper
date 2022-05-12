export default {
  themeLocation: "theme.json",
  pages: [
    'pages/index/index',
    'pages/saveArticle/index',
    'pages/book/index',
    'pages/user/index',
    'pages/feedback/index',
    'pages/roadmap/index',
    'pages/questions/index',
    'pages/batchSave/index'
  ],
  window: {
    backgroundColor: "@bgColor",
    navigationStyle: 'custom',
  },
  supportedMaterials: [
    {
      materialType: "text/html",
      name: "${nickname}",
      desc: "保存到我的Notion",
      path: "/pages/saveArticle/index"
    }
  ],
  darkmode: true
}
