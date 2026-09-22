import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_BASE_URL, REQUEST_TIMEOUT } from './config'

/** 统一业务错误 */
export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器：预留统一注入鉴权参数（对接真实后端时启用）
instance.interceptors.request.use((config) => {
  // config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器：统一错误归一化；若后端返回 { code, data } 包装结构，可在此统一解包
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const message = status
      ? `请求失败（HTTP ${status}），请检查接口地址或稍后重试`
      : '网络异常或接口不可达，请检查接口配置'
    return Promise.reject(new ApiError(message, status))
  }
)

/** 统一 GET 请求封装 */
export async function request<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await instance.get<T>(url, config)
  return response.data
}
