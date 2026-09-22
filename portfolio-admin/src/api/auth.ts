import { ENDPOINTS, MOCK_CREDENTIALS, API_BASE_URL } from './config'
import { getToken, setToken, clearToken, request, post } from './request'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  username: string
}

/**
 * 登录：mock 模式下验证 .env 中的 MOCK 凭证；真实模式调后端 /auth/login
 */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  if (API_BASE_URL === '/mock/api') {
    // mock 登录
    if (payload.username === MOCK_CREDENTIALS.username && payload.password === MOCK_CREDENTIALS.password) {
      const token = 'mock-token-' + Date.now()
      setToken(token)
      return { token, username: payload.username }
    }
    throw new Error('用户名或密码错误（mock 账号：' + MOCK_CREDENTIALS.username + ' / ' + MOCK_CREDENTIALS.password + '）')
  }
  const res = await post<{ token: string; username: string }>(ENDPOINTS.login, payload)
  setToken(res.token)
  return res
}

export function logout() {
  clearToken()
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
