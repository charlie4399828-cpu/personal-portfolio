/**
 * 内存 token 管理（零依赖，不需要 JWT）
 * - 登录时生成随机 token
 * - token 存 Map<token, { username, expiresAt }>
 * - 鉴权中间件校验 Authorization 头里的 token
 *
 * Render/Railway 免费层每次冷启动会清空内存，属于可接受代价；
 * 如需持久化 token 可改成存 SQLite 的 sessions 表。
 */
import crypto from 'node:crypto'

const TOKEN_TTL_MS = Number(process.env.TOKEN_TTL_MS) || 86400000 // 24h

interface TokenRecord {
  username: string
  expiresAt: number
}

const tokens = new Map<string, TokenRecord>()

export function generateToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  tokens.set(token, { username, expiresAt: Date.now() + TOKEN_TTL_MS })
  return token
}

export function verifyToken(token: string): TokenRecord | null {
  const record = tokens.get(token)
  if (!record) return null
  if (record.expiresAt < Date.now()) {
    tokens.delete(token)
    return null
  }
  return record
}

export function revokeToken(token: string) {
  tokens.delete(token)
}
