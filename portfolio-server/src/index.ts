import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { getAdminByUsername, verifyAdminPassword, getPortfolio, savePortfolio } from './db'
import { generateToken, verifyToken, revokeToken } from './tokens'

const PORT = Number(process.env.PORT) || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

const app = express()

app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(','), credentials: true }))
app.use(express.json({ limit: '2mb' }))

/**
 * 鉴权中间件
 * 白名单：POST /api/login、GET /health、GET /api/portfolio、GET /api/portfolio/web
 * 注意：中间件无前缀挂载，req.url 就是原始 URL
 */
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const method = req.method
  const path = req.url.split('?')[0]

  // CORS 预检直接放行（由 cors 中间件负责）
  if (method === 'OPTIONS') return next()

  // 白名单
  const isPublic =
    (method === 'GET' && path === '/health') ||
    (method === 'POST' && path === '/api/login') ||
    (method === 'GET' && (path === '/api/portfolio' || path === '/api/portfolio/web'))
  if (isPublic) return next()

  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录或缺少 token' })
  }
  const token = auth.slice(7)
  const record = verifyToken(token)
  if (!record) {
    return res.status(401).json({ error: 'token 无效或已过期，请重新登录' })
  }
  ;(req as any).user = { username: record.username }
  next()
}

app.use(authMiddleware)

/**
 * 字段名转换：admin PortfolioData → 主站期望结构
 * admin: basicInfo / advantages(group=strength|skill) / projects / works / contact / seo / favicon
 * web:  profile / strengthSection / experiences / works / contact
 */
function toWebPortfolioData(admin: any): any {
  const b = admin.basicInfo || {}
  // 过滤掉标记为 hidden 的项，前端不展示
  const visible = (arr: any[]) => (arr || []).filter((x: any) => !x.hidden)
  const strengths = visible((admin.advantages || []).filter((a: any) => a.group === 'strength'))
  const skills = visible((admin.advantages || []).filter((a: any) => a.group === 'skill'))

  return {
    profile: {
      name: b.name || '',
      avatar: b.avatar || '',
      title: b.title || '',
      tags: b.tags || [],
      intro: b.intro || '',
      location: b.location,
      yearsOfExperience: b.yearsOfExperience,
      highlightMetrics: b.highlightMetrics || []
    },
    strengthSection: {
      heading: b.heading || '核心优势',
      subHeading: b.subHeading || '',
      strengths: strengths.map((s: any) => ({
        title: s.title,
        description: s.description || '',
        icon: s.icon
      })),
      skills: skills.map((s: any) => ({
        name: s.title,
        percent: s.percent ?? 0,
        tags: s.tags || []
      }))
    },
    experiences: visible(admin.projects || []).map((p: any) => ({
      period: p.period,
      role: p.role,
      name: p.name,
      description: p.description,
      achievements: p.achievements || [],
      tags: p.tags || []
    })),
    works: visible(admin.works || []).map((w: any) => ({
      title: w.title,
      subtitle: w.subtitle,
      description: w.description,
      coverUrl: w.imageUrl || '',
      themeColor: w.themeColor,
      metrics: w.metrics || [],
      tags: w.tags || [],
      link: w.link
    })),
    contact: admin.contact || {}
  }
}

/** ---- 路由 ---- */

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() })
})

/**
 * POST /api/login
 * Body: { username, password }
 * 响应: { token, username }
 */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }
  const admin = getAdminByUsername(username)
  if (!admin || !verifyAdminPassword(password, admin.password_hash)) {
    // 统一返回"用户名或密码错误"，不区分哪种，防止枚举
    return res.status(401).json({ error: '用户名或密码错误' })
  }
  const token = generateToken(admin.username)
  res.json({ token, username: admin.username })
})

/**
 * POST /api/logout
 * Header: Authorization: Bearer <token>
 */
app.post('/api/logout', (req, res) => {
  const auth = req.headers.authorization
  if (auth) {
    revokeToken(auth.slice(7))
  }
  res.json({ ok: true })
})

/**
 * GET /api/portfolio
 * 公开接口（后台读取全量数据 / 本地调试），返回 admin 字段名
 */
app.get('/api/portfolio', (_req, res) => {
  const data = getPortfolio()
  if (!data) {
    return res.status(500).json({ error: '作品集数据未初始化' })
  }
  res.json(data)
})

/**
 * GET /api/portfolio/web
 * 公开接口（主站静态站点调用），返回主站期望的字段名结构
 * profile / strengthSection / experiences / works / contact
 */
app.get('/api/portfolio/web', (_req, res) => {
  const data = getPortfolio()
  if (!data) {
    return res.status(500).json({ error: '作品集数据未初始化' })
  }
  res.json(toWebPortfolioData(data))
})

function handleSave(req: Request, res: Response) {
  const body = req.body
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: '请求体必须是 JSON 对象' })
  }
  const required = ['basicInfo', 'advantages', 'projects', 'works', 'contact', 'seo', 'favicon']
  const missing = required.filter((k) => !(k in body))
  if (missing.length) {
    return res.status(400).json({ error: '缺少字段: ' + missing.join(', ') })
  }
  savePortfolio(body)
  res.json({ ok: true, updatedAt: new Date().toISOString() })
}

/**
 * POST /api/portfolio  &  PUT /api/portfolio
 * Header: Authorization: Bearer <token>
 * 后台保存全量数据（两种方法都支持，admin 用 PUT 是 Axios 封装的约定）
 */
app.post('/api/portfolio', handleSave)
app.put('/api/portfolio', handleSave)

/** 全局错误处理（兜底，不把内部细节暴露给客户端） */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[err]', err)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log('[server] listening on http://localhost:' + PORT)
  console.log('[server] cors.origin = ' + CORS_ORIGIN)
  console.log('[server] public:  POST /api/login')
  console.log('[server]        GET  /api/portfolio         (admin 字段名，后台读取)')
  console.log('[server]        GET  /api/portfolio/web     (主站字段名，静态站点读取)')
  console.log('[server] protect: POST /api/portfolio  PUT /api/portfolio  POST /api/logout')
})
