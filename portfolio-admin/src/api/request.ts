import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_BASE_URL, REQUEST_TIMEOUT } from './config'

const TOKEN_KEY = 'portfolio_admin_token'

/** 统一业务错误 */
export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' }
})

/** 请求拦截器：自动注入 Bearer token */
instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** 响应拦截器：统一错误归一化 + 401 自动退出 */
instance.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      clearToken()
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.hash = '#/login'
      }
      return Promise.reject(new ApiError('登录已过期，请重新登录', 401))
    }
    const message = status
      ? `请求失败（HTTP ${status}）`
      : '网络异常或接口不可达'
    return Promise.reject(new ApiError(message, status))
  }
)

/** 统一 GET */
export async function request<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.get<T>(url, config)
  return res.data
}

/** 统一 PUT */
export async function put<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.put<T>(url, data, config)
  return res.data
}

/** 统一 POST */
export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.post<T>(url, data, config)
  return res.data
}
