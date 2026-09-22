/**
 * 接口地址配置（mock / 真实后端切换入口）
 *
 * mock 模式（默认）：读取站点内的 ./mock/portfolio.json，无需后端
 * 真实后端模式：在项目根目录 .env 中配置
 *   VITE_API_BASE_URL=https://api.your-domain.com
 *   VITE_API_PORTFOLIO_ENDPOINT=/portfolio
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? './mock'

/** 作品集内容接口路径（拼接在 baseURL 之后） */
export const PORTFOLIO_ENDPOINT: string =
  import.meta.env.VITE_API_PORTFOLIO_ENDPOINT ?? '/portfolio.json'

/** 请求超时时间（ms） */
export const REQUEST_TIMEOUT = 10000
