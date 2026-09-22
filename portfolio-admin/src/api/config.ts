/** API 基础配置与各模块接口路径 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/mock/api'

/** 请求超时 ms */
export const REQUEST_TIMEOUT = 15000

/** 后端 REST API 路径（相对 API_BASE_URL） */
export const ENDPOINTS = {
  login: '/api/login',
  portfolio: '/api/portfolio' // GET 读取（admin 字段名） / PUT 全量保存
}

/** mock 登录常量（仅在 VITE_API_BASE_URL=/mock/api 时使用） */
export const MOCK_CREDENTIALS = {
  username: import.meta.env.VITE_MOCK_USERNAME ?? 'admin',
  password: import.meta.env.VITE_MOCK_PASSWORD ?? 'admin123'
}
