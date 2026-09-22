/**
 * 数据库模块：better-sqlite3 同步 API
 * - portfolio_data 表：单行 JSON blob 存 PortfolioData（整体读写即可）
 * - admin_users 表：管理员账号密码（scrypt 加盐哈希）
 *
 * Render/Railway 免费层文件系统会丢失，
 * 每次启动都会自动重建表 + 插入默认账号 + 写入初始数据（若 portfolio_data 为空）
 */
import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { DEFAULT_PORTFOLIO_DATA } from './seed'

const DB_PATH = process.env.DB_PATH || './data/portfolio.db'
const PASSWORD_SALT = process.env.PASSWORD_SALT || 'portfolio-server-v1-salt'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// 确保数据库目录存在
const dbDir = path.dirname(path.resolve(DB_PATH))
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

export const db = new Database(path.resolve(DB_PATH))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

/** 加密密码：scrypt（Node 内置）+ 盐 + hex */
export function hashPassword(plain: string): string {
  const derived = crypto.scryptSync(plain + ':' + PASSWORD_SALT, 'portfolio', 64)
  return derived.toString('hex')
}

/** 表初始化（幂等） */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS portfolio_data (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data_json TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

/** 插入默认管理员（username 唯一，重复插入会被忽略） */
function seedAdmin() {
  const exists = db.prepare('SELECT 1 FROM admin_users WHERE username = ?').get(ADMIN_USERNAME)
  if (!exists) {
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(
      ADMIN_USERNAME,
      hashPassword(ADMIN_PASSWORD)
    )
    console.log(`[db] seeded admin: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`)
  } else {
    console.log(`[db] admin '${ADMIN_USERNAME}' already exists, skip seeding`)
  }
}

/** 首次启动写入示例 PortfolioData（单行存储，整体读写） */
function seedPortfolio() {
  const row = db.prepare('SELECT 1 FROM portfolio_data WHERE id = 1').get()
  if (!row) {
    db.prepare('INSERT INTO portfolio_data (id, data_json) VALUES (1, ?)').run(
      JSON.stringify(DEFAULT_PORTFOLIO_DATA)
    )
    console.log('[db] seeded initial portfolio data')
  }
}

initSchema()
seedAdmin()
seedPortfolio()
console.log('[db] initialized')

/**
 * 数据归一化：兼容历史字段
 * - 旧版技能用 tag: string，新版统一为 tags: string[]
 * 读取和保存时都执行，保证 admin 端拿到的始终是 tags 数组
 */
function normalizePortfolio(data: any): any {
  if (!data || typeof data !== 'object') return data
  const advantages = Array.isArray(data.advantages) ? data.advantages : []
  advantages.forEach((a: any) => {
    if (a && typeof a === 'object') {
      if (!Array.isArray(a.tags)) {
        const legacy = typeof a.tag === 'string' ? a.tag.trim() : ''
        a.tags = legacy ? [legacy] : []
      }
      delete a.tag
    }
  })
  return data
}

/** ---- 导出便捷函数 ---- */

export function getAdminByUsername(username: string): { id: number; username: string; password_hash: string } | undefined {
  return db.prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?').get(username) as any
}

export function verifyAdminPassword(plain: string, hash: string): boolean {
  const expected = Buffer.from(hashPassword(plain), 'hex')
  const actual = Buffer.from(hash, 'hex')
  // timingSafeEqual 常量时间比较，防止时序攻击
  if (expected.length !== actual.length) return false
  return crypto.timingSafeEqual(expected, actual)
}

export function getPortfolio(): any | null {
  const row = db.prepare('SELECT data_json FROM portfolio_data WHERE id = 1').get() as any
  if (!row) return null
  try {
    return normalizePortfolio(JSON.parse(row.data_json))
  } catch {
    return null
  }
}

export function savePortfolio(data: unknown) {
  const normalized = normalizePortfolio(data)
  db.prepare(
    'INSERT INTO portfolio_data (id, data_json, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP) ' +
      'ON CONFLICT(id) DO UPDATE SET data_json = excluded.data_json, updated_at = CURRENT_TIMESTAMP'
  ).run(JSON.stringify(normalized))
}
