const introduceGenSidebarConfig = require('../introduce')
const imoccDesignPatternGenSidebarConfig = require('../imocc/design_pattern')
const designPatternGenSidebarConfig = require('../imocc/design_pattern_li')
const elasticsearchCoreSC = require('../imocc/elasticsearch-core')
const elasticsearchSeniorSC = require('../imocc/elasticsearch-senior')
const cachePdpSc = require('../design/cache-pdp')
const backEndStorageSc = require('../design/back-end-storage')
const leetcodeDaiSc = require('../leetcode/daimasuixiang')

module.exports = {
  title: 'Record',
  description: '用来记录工作和学习过程中的笔记，汇总成册方便查阅，类容涵盖各类技术，如：Java、Git、ElasticSearch、MyCat、设计模式、Gradle、Vue - mrcode.cn',
  base: '/record/', // gh-page 中是增加了项目名
  dest: 'build/.vuepress/dist',  // 目录配置在外,纯粹是有代码洁癖和强迫症，并不能规避开发模式下同时构建不报错的问题
  host: 'localhost', // dev 的域名
  port: 8080,
  // locales: {
  //     // 键名是该语言所属的子路径
  //     // 作为特例，默认语言可以使用 '/' 作为其路径。
  //     // '/': {
  //     //     lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
  //     // }
  // },
  head:[
    ['link', { rel: 'icon', href: '/mlogo.svg' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
  markdown: {
    lineNumbers: true
  },
  // theme: 'vue',
  themeConfig: {
    docsDir: 'docs',
    sidebar: 'auto',
    sidebarDepth: 3, // 嵌套标题侧边栏提取深度，最大为 2，会提取到 h3
    lastUpdated: '上次更新', // string | boolean
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'https://github.com/txxs/record',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'GitHub',
    // 以下为可选的编辑链接选项
    // 假如你的文档仓库和项目本身不在一个仓库：
    // docsRepo: 'vuejs/vuepress',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',
    logo: '/mlogo.svg',
    // 主题级别的配置
    serviceWorker: {
      updatePopup: true // Boolean | Object, 默认值是 undefined.
    },
    nav: [
      { text: '博客（csdn）', link: 'https://blog.csdn.net/maoyeqiu' },
      {
        text: '算法', items: [
          { text: '代码随想', link: '/leetcode/daimasuixiang/' }
        ]
      },
      {
        text: '课程', items: [
          { text: '设计模式（慕课）', link: '/imocc/design_pattern/' },
          { text: '研磨设计模式（李兴华）', link: '/imocc/design_pattern_li/' },
          { text: 'ES核心知识篇', link: '/imocc/elasticsearch-core/' },
          { text: 'ES高级知识篇', link: '/imocc/elasticsearch-senior/' }
        ]
      },
      {
        text: '设计', items: [
          { text: '后端存储实战', link: '/design/back-end-storage/' },
          { text: '复杂缓存架构', link: '/design/cache-pdp/' }
        ]
      },
      {
        text: '更多', items: [
          { text: '本笔记介绍', link: '/introduce/' }
        ]
      }
    ],
    sidebar: {
      '/introduce/': introduceGenSidebarConfig(),
      '/leetcode/daimasuixiang/': leetcodeDaiSc(),
      '/imocc/design_pattern/': imoccDesignPatternGenSidebarConfig(),
      '/imocc/design_pattern_li/': designPatternGenSidebarConfig(),
      '/imocc/elasticsearch-senior/': elasticsearchSeniorSC(),
      '/imocc/elasticsearch-core/': elasticsearchCoreSC(),
      '/design/cache-pdp/': cachePdpSc(),
      '/design/back-end-storage/': backEndStorageSc()
    }
  },
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: {
        message: '有新内容更新啦~',
        buttonText: '立即获取新内容，确定后稍后自动刷新'
      }
    }],
    ['@vuepress/medium-zoom', {
      selector: '.theme-default-content img'
    }],
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }],
    ['vuepress-plugin-code-copy', true],
    ['@vuepress/last-updated', {
      transformer: (timestamp, lang) => {
        // 不要忘了安装 moment
        const moment = require('moment')
        // moment.locale(lang)
        // return moment(timestamp).fromNow()
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
      }
    }],
    ['vuepress-plugin-baidu-tongji-analytics', {
      key: '63b757e8938717e95e7218e8e1341393'
    }],
    ['vuepress-plugin-tags'],
    ['vuepress-plugin-baidu-autopush', true]
  ]
}
