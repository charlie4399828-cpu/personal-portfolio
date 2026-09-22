/**
 * 类型说明：
 * - 后台用本文件字段名（basicInfo / advantages / projects / works / contact / seo / favicon）
 * - 作品集前端当前字段名为 profile / strengthSection / experiences / works / contact
 *   后端 API 需在两套字段名之间做映射，映射关系见 README「字段对齐」章节
 */

/** 通用指标数据卡片 */
export interface Metric {
  label: string
  value: string
}

/** 社交/外链 */
export interface SocialLink {
  label: string
  url: string
  icon?: string
}

/** 基础信息（对应前端 profile + strengthSection.heading/subHeading） */
export interface BasicInfo {
  name: string
  avatar: string
  title: string
  tags: string[]
  intro: string
  location?: string
  yearsOfExperience?: number
  highlightMetrics?: Metric[]
  heading?: string
  subHeading?: string
}

/** 个人优势（对应前端 Strength + Skill，strength 和 skill 分别管理） */
export interface AdvantageItem {
  id?: string
  title: string
  description: string
  icon?: string
  /** 所属分组：strength 优势 / skill 技能 */
  group: 'strength' | 'skill'
  /** group=skill 时必填 */
  percent?: number
  tag?: string
}

/** 项目经历（对应前端 ProjectExperience，后台字段名统一） */
export interface ProjectItem {
  id?: string
  period: string
  role: string
  name: string
  description: string
  achievements?: string[]
  tags?: string[]
  coverUrl?: string
}

/** 作品案例 */
export interface WorkItem {
  id?: string
  title: string
  subtitle?: string
  description: string
  imageUrl?: string
  themeColor?: string
  metrics?: Metric[]
  tags?: string[]
  link?: string
}

/** 联系方式 */
export interface ContactInfo {
  email?: string
  phone?: string
  wechat?: string
  socials: SocialLink[]
  openSourceUrl?: string
  copyright: string
  icp?: string
}

/** SEO 配置（后端需同步到前端 index.html / og 等） */
export interface SeoConfig {
  siteName: string
  title: string
  description: string
  keywords: string[]
  author?: string
  ogImage?: string
}

/** favicon 配置 */
export interface FaviconConfig {
  iconUrl: string
  appleIconUrl?: string
  android192Url?: string
  android512Url?: string
}

/** 后台完整站点数据（后端 API 返回结构） */
export interface PortfolioData {
  basicInfo: BasicInfo
  advantages: AdvantageItem[]
  projects: ProjectItem[]
  works: WorkItem[]
  contact: ContactInfo
  seo: SeoConfig
  favicon: FaviconConfig
}
