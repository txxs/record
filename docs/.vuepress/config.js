const cachePdpSc = require('../design/cache-pdp')
const backEndStorageSc = require('../design/back-end-storage')
const designBigSc = require('../design/big-backEnd')
const designdddSc = require('../design/ddd')
const designdistrubutedSc = require('../design/distrubuted')
const designsystemSc = require('../design/system')

const experienceSc = require('../experience')

const imoccDesignPatternGenSidebarConfig = require('../imocc/design_pattern')
const designPatternGenSidebarConfig = require('../imocc/design_pattern_li')
const elasticsearchCoreSC = require('../imocc/elasticsearch-core')
const elasticsearchSeniorSC = require('../imocc/elasticsearch-senior')
const comdesignSC = require('../imocc/comdesign')

const introduceGenSidebarConfig = require('../introduce')

const collectionSc = require('../java/collection')
const threadSc = require('../java/thread')
const springSc = require('../java/spring')
const sourceSc = require('../java/source')
const javajdkconSC = require('../java/jdk/con')
const javajdkjacocoSC = require('../java/jdk/jacoco')
const javajdkJava8SC = require('../java/jdk/Java8')
const javajdkJVMSC = require('../java/jdk/jvm')
const javajvmSC = require('../java/jvm')
const javasourceSC = require('../java/source')
const javaspringSC = require('../java/spring')
const javathreadSC = require('../java/thread')

const leetcodeDaiSc = require('../leetcode/daimasuixiang')
const leetcodealgorithmsSc = require('../leetcode/algorithms')
const leetcodealgorithmsmoreSc = require('../leetcode/algorithmsmore')
const leetcodeleetcodetopSc = require('../leetcode/leetcodetop')

const middlewarecacheSc = require('../middleware/cache')
const middlewaredubboSc = require('../middleware/dubbo')
const middlewareesSc = require('../middleware/es')
const middlewarekafkaSc = require('../middleware/kafka')
const middlewareMyBatisSc = require('../middleware/MyBatis')
const middlewaremysqlSc = require('../middleware/mysql')
const middlewaremysqldatabaseSc = require('../middleware/mysql/database')
const middlewaremysqlMySQLSc = require('../middleware/mysql/MySQL')
const middlewareredisSc = require('../middleware/redis')
const middlewarerediscacheSc = require('../middleware/redis/cache')
const middlewareredisRedisSc = require('../middleware/redis/Redis')
const middlewazkSc = require('../middleware/zk')

const networkSc = require('../network')

const otherSc = require('../other')

const qainterviewSc = require('../q&a/interview')
const qaselfSc = require('../q&a/self')
const qatujiSc = require('../q&a/tuji')




module.exports = {
  title: 'Record',
  description: '本博客主要是用来记录系统化的知识，内容部分来自github上的其他开源仓库，如有问题联系sdlyjhm01@sina.com',
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
          { text: '代码随想', link: '/leetcode/daimasuixiang/' },
          { text: '剑指offer', link: '/leetcode/algorithms/' },
          { text: '常见算法', link: '/leetcode/algorithmsmore/' },
          { text: '针对算法', link: '/leetcode/leetcodetop/' },
        ]
      },
      {
        text: 'java', items: [
          { text: '集合', link: '/java/collection/' },
          { text: '并发编程', link: '/java/jdk/con' },
          { text: 'jacoco', link: '/java/jdk/jacoco' },
          { text: 'Java8', link: '/java/jdk/Java8' },
          { text: 'JVM一', link: '/java/jdk/jvm' },
          { text: 'JVM二', link: '/java/jvm/' },
          { text: '源码', link: '/java/source/' },
          { text: 'spring', link: '/java/spring/' },
          { text: '线程', link: '/java/thread/' }
        ]
      },
      {
        text: '中间件', items: [
          { text: '缓存', link: '/middleware/cache/' },
          { text: 'dubbo', link: '/middleware/dubbo/' },
          { text: 'es', link: '/middleware/es/' },
          { text: 'kafka', link: '/middleware/kafka/' },
          { text: 'MyBatis', link: '/middleware/MyBatis/' },
          { text: 'mysql1', link: '/middleware/mysql/' },
          { text: 'mysql2', link: '/middleware/mysql/database/' },
          { text: 'mysql3', link: '/middleware/mysql/MySQL/' },
          { text: 'redis1', link: '/middleware/redis/' },
          { text: 'redis2', link: '/middleware/redis/cache/' },
          { text: 'redis3', link: '/middleware/redis/Redis/' },
          { text: 'zk', link: '/middleware/zk/' }
        ]
      },
      {
        text: 'q&a', items: [
          { text: '问答', link: '/q&a/interview/' },
          { text: '详细', link: '/q&a/self/' },
          { text: '突击', link: '/q&a/tuji/' }
        ]
      },
      {
        text: '课程', items: [
          { text: '设计模式（慕课）', link: '/imocc/design_pattern/' },
          { text: '研磨设计模式（李兴华）', link: '/imocc/design_pattern_li/' },
          { text: 'ES核心知识篇', link: '/imocc/elasticsearch-core/' },
          { text: '设计模式', link: '/imocc/comdesign/' },
          { text: 'ES高级知识篇', link: '/imocc/elasticsearch-senior/' }
        ]
      },
      {
        text: '设计', items: [
          { text: '后端存储实战', link: '/design/back-end-storage/' },
          { text: '复杂缓存架构', link: '/design/cache-pdp/' },
          { text: '大数据后端', link: '/design/big-backEnd/' },
          { text: 'ddd', link: '/design/ddd/' },
          { text: '分布式1', link: '/design/distrubuted/' },
          { text: '分布式2', link: '/design/system/' },
        ]
      },
      {
        text: '更多', items: [
          { text: '其他', link: '/other/' },
          { text: '网络', link: '/network/' },
          { text: '本笔记介绍', link: '/introduce/' }
        ]
      }
    ],
    sidebar: {
      '/design/cache-pdp/': cachePdpSc(),
      '/design/back-end-storage/': backEndStorageSc(),
      '/design/big-backEnd/': designBigSc(),
      '/design/ddd/': designdddSc(),
      '/design/distrubuted/': designdistrubutedSc(),
      '/design/system/': designsystemSc(),

      '/experience/': experienceSc(),

      '/imocc/design_pattern/': imoccDesignPatternGenSidebarConfig(),
      '/imocc/design_pattern_li/': designPatternGenSidebarConfig(),
      '/imocc/elasticsearch-core/': elasticsearchCoreSC(),
      '/imocc/elasticsearch-senior/': elasticsearchSeniorSC(),
      '/imocc/comdesign/': comdesignSC(),

      '/introduce/': introduceGenSidebarConfig(),

      '/java/collection/': collectionSc(),
      '/java/thread/': threadSc(),
      '/java/spring/': springSc(),
      '/java/source/': sourceSc(),
      '/java/jdk/con/': javajdkconSC(),
      '/java/jdk/jacoco/': javajdkjacocoSC(),
      '/java/jdk/Java8/': javajdkJava8SC(),
      '/java/jdk/jvm/': javajdkJVMSC(),
      '/java/jvm/': javajvmSC(),
      '/java/source/': javasourceSC(),
      '/java/spring/': javaspringSC(),
      '/java/thread/': javathreadSC(),

      '/leetcode/daimasuixiang/': leetcodeDaiSc(),
      '/leetcode/algorithms/': leetcodealgorithmsSc(),
      '/leetcode/algorithmsmore/': leetcodealgorithmsmoreSc(),
      '/leetcode/leetcodetop/': leetcodeleetcodetopSc(),

      '/middleware/cache/': middlewarecacheSc(),
      '/middleware/dubbo/': middlewaredubboSc(),
      '/middleware/es/': middlewareesSc(),
      '/middleware/kafka/': middlewarekafkaSc(),
      '/middleware/MyBatis/': middlewareMyBatisSc(),
      '/middleware/mysql/': middlewaremysqlSc(),
      '/middleware/mysql/database/': middlewaremysqldatabaseSc(),
      '/middleware/mysql/MySQL/': middlewaremysqlMySQLSc(),
      '/middleware/redis/': middlewareredisSc(),
      '/middleware/redis/cache/': middlewarerediscacheSc(),
      '/middleware/redis/Redis/': middlewareredisRedisSc(),
      '/middleware/zk/': middlewazkSc(),

      '/network/': networkSc(),

      '/other/': otherSc(),

      '/q&a/interview/': qainterviewSc(),
      '/q&a/self/': qaselfSc(),
      '/q&a/tuji/': qatujiSc()
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
