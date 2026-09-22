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

/** 第一屏：个人基础信息 */
export interface Profile {
  name: string
  avatar: string
  title: string
  tags: string[]
  intro: string
  location?: string
  yearsOfExperience?: number
  highlightMetrics?: Metric[]
}

/** 第二屏：单项核心优势 */
export interface Strength {
  title: string
  description: string
  icon?: string
}

/** 第二屏：技能熟练度 */
export interface Skill {
  name: string
  percent: number
  tag?: string
}

/** 第二屏：优势模块聚合 */
export interface StrengthSection {
  heading: string
  subHeading?: string
  strengths: Strength[]
  skills: Skill[]
}

/** 第三屏：项目经历（时间线） */
export interface ProjectExperience {
  period: string
  role: string
  name: string
  description: string
  achievements?: string[]
  tags?: string[]
}

/** 第四屏：作品案例 */
export interface WorkItem {
  title: string
  subtitle?: string
  description: string
  coverUrl?: string
  /** 十六进制主题色，用于无封面图时的渐变占位 */
  themeColor?: string
  metrics?: Metric[]
  tags?: string[]
  link?: string
}

/** 底部屏：联系方式与版权 */
export interface ContactInfo {
  email?: string
  phone?: string
  wechat?: string
  socials: SocialLink[]
  openSourceUrl?: string
  copyright: string
  icp?: string
}

/** 站点全部内容：接口唯一返回结构（后端按此结构返回 JSON 即可） */
export interface PortfolioData {
  profile: Profile
  strengthSection: StrengthSection
  experiences: ProjectExperience[]
  works: WorkItem[]
  contact: ContactInfo
}
