import { request } from './request'
import { PORTFOLIO_ENDPOINT } from './config'
import type { PortfolioData } from '@/types/portfolio'

/** 拉取全站展示内容：更新内容只需修改接口返回的 JSON，无需改动前端代码 */
export function fetchPortfolioData(): Promise<PortfolioData> {
  return request<PortfolioData>(PORTFOLIO_ENDPOINT)
}
