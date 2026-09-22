/**
 * 默认示例数据（首次启动写入 portfolio_data）
 * 字段名与后台 admin 保持一致：basicInfo / advantages / projects / works / contact / seo / favicon
 */
export const DEFAULT_PORTFOLIO_DATA = {
  basicInfo: {
    name: '陈以默',
    avatar: 'avatar.svg',
    title: '高级前端开发工程师 · 电商方向',
    tags: ['互联网', '电商', 'Vue3', 'TypeScript', '数据驱动'],
    intro:
      '深耕互联网电商领域 6 年，专注高并发大促会场、营销玩法与电商中台前端架构。相信好的工程能力与业务理解，能把每一次页面体验转化为真实的业务增长。',
    location: '杭州',
    yearsOfExperience: 6,
    heading: '核心优势',
    subHeading: '工程能力 × 电商业务理解，双轮驱动',
    highlightMetrics: [
      { label: '从业年限', value: '6 年' },
      { label: '主导电商项目', value: '20+' },
      { label: '累计服务大促 GMV', value: '3.2 亿' },
      { label: '核心页面性能提升', value: '58%' }
    ]
  },
  advantages: [
    { id: 'a1', group: 'strength', title: '电商大促实战', description: '主导多轮双 11 / 618 大促会场页研发，页面稳定支撑亿级 PV。', icon: 'icon-thunderbolt' },
    { id: 'a2', group: 'strength', title: '性能与体验优化', description: '首屏秒开、资源按需加载与动效降级策略，核心页面 LCP 降至 1.5s 以内。', icon: 'icon-fire' },
    { id: 'a3', group: 'strength', title: '数据驱动增长', description: '搭建埋点体系与 A/B 实验闭环，用数据量化每一次改版的转化收益。', icon: 'icon-bar-chart' },
    { id: 'a4', group: 'strength', title: '组件化与工程化', description: '沉淀电商营销组件库与 CI/CD 流水线，团队研发效率提升 40%。', icon: 'icon-code' },
    { id: 's1', group: 'skill', title: 'Vue3 / TypeScript', description: '', percent: 95, tag: '主力栈' },
    { id: 's2', group: 'skill', title: '电商营销页面架构', description: '', percent: 92 },
    { id: 's3', group: 'skill', title: '前端工程化 / 性能优化', description: '', percent: 88 },
    { id: 's4', group: 'skill', title: '数据可视化', description: '', percent: 85 },
    { id: 's5', group: 'skill', title: 'Node.js / 接口设计', description: '', percent: 80 }
  ],
  projects: [
    {
      id: 'p1',
      period: '2022.03 - 至今',
      role: '高级前端开发工程师',
      name: '某头部电商平台',
      description: '隶属大促营销技术团队，负责大促会场、互动玩法与营销组件体系的前端架构与落地。',
      achievements: ['主导双 11 主会场重构，首屏性能提升 58%', '沉淀营销组件库 30+ 组件', '推动前端监控体系建设'],
      tags: ['Vue3', '大促会场', '组件库', '性能优化'],
      coverUrl: ''
    },
    {
      id: 'p2',
      period: '2020.06 - 2022.02',
      role: '前端开发工程师',
      name: '某新零售电商平台',
      description: '负责 H5 商城与小程序核心链路开发。',
      achievements: ['重构下单链路，下单转化率提升 12%'],
      tags: ['小程序', 'H5 商城', '交易链路'],
      coverUrl: ''
    },
    {
      id: 'p3',
      period: '2018.07 - 2020.05',
      role: '前端开发工程师',
      name: '某互联网创业公司',
      description: '从 0 到 1 搭建电商运营后台与数据看板。',
      achievements: ['独立完成运营后台 20+ 模块开发', '搭建实时数据看板'],
      tags: ['从 0 到 1', '运营后台', '数据看板'],
      coverUrl: ''
    }
  ],
  works: [
    { id: 'w1', title: '双 11 主会场', subtitle: '亿级 PV 互动营销页面', description: '面向大促主会场的模块化页面方案。', imageUrl: '', themeColor: '#F25516', metrics: [{ label: '页面 PV', value: '1.2 亿' }, { label: '转化率提升', value: '+23%' }], tags: ['营销页面', '高并发'], link: '' },
    { id: 'w2', title: '实时交易数据大屏', subtitle: '电商经营决策可视化', description: '大促作战室秒级数据刷新。', imageUrl: '', themeColor: '#2F54EB', metrics: [{ label: '图表组件', value: '20+' }, { label: '数据刷新', value: '秒级' }], tags: ['数据可视化', '大屏'], link: '' },
    { id: 'w3', title: '会员营销中台', subtitle: '千人千面的权益触达', description: '会员分层运营前端方案。', imageUrl: '', themeColor: '#722ED1', metrics: [{ label: '覆盖会员', value: '3000 万' }, { label: '活动配置效率', value: '+70%' }], tags: ['中台', '会员运营'], link: '' },
    { id: 'w4', title: '跨境商城小程序', subtitle: '轻量流畅的购物体验', description: '弱网与低端机深度优化。', imageUrl: '', themeColor: '#0FA98E', metrics: [{ label: '日活用户', value: '50 万' }, { label: '启动耗时', value: '-38%' }], tags: ['小程序', '跨境电商'], link: '' }
  ],
  contact: {
    email: 'hello@example.com',
    phone: '',
    wechat: 'yimo_dev',
    socials: [
      { label: 'GitHub', url: 'https://github.com/yourname', icon: 'icon-github' },
      { label: '掘金', url: 'https://juejin.cn', icon: 'icon-link' },
      { label: '个人博客', url: 'https://example.com', icon: 'icon-home' }
    ],
    openSourceUrl: 'https://github.com/yourname/portfolio',
    copyright: '© 2026 陈以默 · 本站为开源静态站点，全部内容由接口驱动渲染',
    icp: ''
  },
  seo: {
    siteName: '陈以默 · 个人作品集',
    title: '陈以默 · 互联网+电商前端开发工程师 | 个人作品集',
    description: '陈以默的个人作品集：6 年互联网电商前端经验，专注大促营销会场、性能优化、数据驱动增长与电商中台。',
    keywords: ['个人作品集', '前端开发工程师', '互联网', '电商前端', 'Vue3', 'TypeScript'],
    author: '陈以默',
    ogImage: './og-image.jpg'
  },
  favicon: {
    iconUrl: './favicon.svg',
    appleIconUrl: './apple-touch-icon.png',
    android192Url: './android-chrome-192x192.png',
    android512Url: './android-chrome-512x512.png'
  }
}
