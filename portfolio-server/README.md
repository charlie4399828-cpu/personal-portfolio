# 作品集后端服务

Node.js + Express + SQLite3（better-sqlite3）为作品集前端和后台管理系统提供 RESTful API。

## 技术栈

- Node.js ≥ 18 + Express 4
- better-sqlite3（同步 API，Windows 上比 sqlite3 更稳）
- crypto.scryptSync（Node 内置，密码加盐哈希）
- 内存 token Map（零依赖，24 小时有效期）
- CORS、dotenv

## 快速开始

```bash
cd portfolio-server

# 安装依赖
npm install

# 开发（热重载）
npm run dev          # 默认 http://localhost:3000

# 生产构建 & 启动
npm run build
npm start
```

首次启动自动：
1. 创建 SQLite 数据库文件 `./data/portfolio.db`
2. 建表（`admin_users`、`portfolio_data`）
3. 插入默认管理员 `admin / admin123`
4. 写入默认 PortfolioData 示例数据

## 配置（.env）

```env
PORT=3000
CORS_ORIGIN=*                        # 逗号分隔多个前端地址；* 表示允许所有
DB_PATH=./data/portfolio.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
PASSWORD_SALT=portfolio-server-v1-salt
TOKEN_TTL_MS=86400000                # token 24 小时
```

Render/Railway 免费层文件系统每次冷启动会丢失，`portfolio_data` 表的示例数据会每次重建。**生产部署建议绑定持久化磁盘**，或在 Render 的 Build Command / Railway 的 init 命令里执行一次初始化。

## 接口文档

### 路由一览

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| POST | `/api/login` | ❌ | 登录返回 token |
| POST | `/api/logout` | ✅ | 注销 token |
| GET  | `/api/portfolio` | ❌ | admin 字段名完整数据（后台管理调用） |
| GET  | `/api/portfolio/web` | ❌ | 主站字段名完整数据（静态作品集站点调用） |
| POST | `/api/portfolio` | ✅ | 全量保存（admin PUT 约定也支持） |
| PUT  | `/api/portfolio` | ✅ | 同上，与 POST 同处理 |
| GET  | `/health` | ❌ | 健康检查 |

请求体：
```json
{ "username": "admin", "password": "admin123" }
```

成功响应（200）：
```json
{
  "token": "ee75405a36b1c8239733d41fb8a40ddaf...",
  "username": "admin"
}
```

失败（401）：`{ "error": "用户名或密码错误" }`

---

### GET /api/portfolio — 读取作品集数据（公开）

作品集前端静态站点调用，不需要 token。

成功响应（200）：完整 PortfolioData 对象。

---

### POST /api/portfolio — 保存作品集数据（**需鉴权**）

请求头：`Authorization: Bearer <token>`

请求体：完整 PortfolioData 对象（字段见下）。

成功响应（200）：
```json
{ "ok": true, "updatedAt": "2026-09-22T08:28:29.617Z" }
```

未带 token 或 token 失效（401）：`{ "error": "未登录或缺少 token" }` / `{ "error": "token 无效或已过期" }`

字段缺失（400）：`{ "error": "缺少字段: seo, favicon" }`

---

### POST /api/logout — 登出（**需鉴权**）

请求头：`Authorization: Bearer <token>`

成功响应（200）：`{ "ok": true }`

---

### GET /health — 健康检查（公开）

`{ "status": "ok", "ts": 1711111111111 }`

---

## PortfolioData 结构

所有接口使用的完整 JSON 结构如下（字段名与后台 admin 一致）：

```json
{
  "basicInfo": {
    "name": "string",
    "avatar": "string",
    "title": "string",
    "tags": ["string"],
    "intro": "string",
    "location": "string?",
    "yearsOfExperience": 0,
    "heading": "string?",
    "subHeading": "string?",
    "highlightMetrics": [{ "label": "string", "value": "string" }]
  },
  "advantages": [
    { "id": "string", "group": "strength|skill", "title": "string", "description": "string?", "icon": "string?", "percent": 0, "tag": "string?" }
  ],
  "projects": [
    { "id": "string", "period": "string", "role": "string", "name": "string", "description": "string", "achievements": ["string"], "tags": ["string"], "coverUrl": "string?" }
  ],
  "works": [
    { "id": "string", "title": "string", "subtitle": "string?", "description": "string", "imageUrl": "string?", "themeColor": "string?", "metrics": [{ "label": "string", "value": "string" }], "tags": ["string"], "link": "string?" }
  ],
  "contact": {
    "email": "string?",
    "phone": "string?",
    "wechat": "string?",
    "socials": [{ "label": "string", "url": "string", "icon": "string?" }],
    "openSourceUrl": "string?",
    "copyright": "string",
    "icp": "string?"
  },
  "seo": {
    "siteName": "string",
    "title": "string",
    "description": "string",
    "keywords": ["string"],
    "author": "string?",
    "ogImage": "string?"
  },
  "favicon": {
    "iconUrl": "string",
    "appleIconUrl": "string?",
    "android192Url": "string?",
    "android512Url": "string?"
  }
}
```

> **字段对齐**：后端内置转换函数 `toWebPortfolioData()`，提供两套 GET 路由：
> - `GET /api/portfolio` → admin 字段名（后台管理读/写用 basicInfo/advantages/projects 等）
> - `GET /api/portfolio/web` → 主站字段名（profile/strengthSection/experiences）
> 后台保存时用 admin 字段名写入 DB；主站静态站点直接调 `/api/portfolio/web` 即可拿到它期望的结构，**前端无需做任何字段映射**。

## 数据库

SQLite 单文件，两张表：

| 表 | 结构 |
| --- | --- |
| `admin_users` | id / username / password_hash(hex) / created_at |
| `portfolio_data` | id(主键, 固定=1) / data_json(TEXT) / updated_at |

作品集数据以整行 JSON blob 存储，整体读写即可，适合「一次保存全部内容」的后台管理场景。

## 前端对接（三端架构）

```
┌────────────────────┐    GET /api/portfolio/web     ┌────────────────────┐
│  作品集主站         │ ─────────────────────────────▶ │                    │
│  d:\Code\personal  │   (公开，返回 profile 字段名)    │                    │
└────────────────────┘                                 │                    │
                                                       │   portfolio-server │
┌────────────────────┐   POST/PUT /api/portfolio      │   (本目录)          │
│  后台管理系统        │ ─────────────────────────────▶ │   Express + SQLite  │
│  portfolio-admin   │   鉴权 Bearer token             │                    │
└────────────────────┘   POST /api/login              └────────────────────┘
```

**后台管理系统**（portfolio-admin）已对齐，.env 已改：
```env
VITE_API_BASE_URL=http://localhost:3000
```
（`ENDPOINTS.login='/api/login'`、`ENDPOINTS.portfolio='/api/portfolio'` 已硬编码）

**作品集主站**（d:\Code\personal Web）接真实后端时改 .env：
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_PORTFOLIO_ENDPOINT=/api/portfolio/web
```
让 `VITE_API_BASE_URL` 到 `/api/portfolio/web` 拼起来正好是完整路径。

## 部署

### Render（推荐）

1. 新建 Web Service，Build Command：`npm install && npm run build`，Start Command：`npm start`
2. 环境变量（Environment）配置 `PORT=10000`，`CORS_ORIGIN=https://yourname.github.io,https://admin.yourname.com`
3. Render 会自动检测 package.json 并启动 Node；免费层文件系统每次冷启动丢失，portfolio_data 会重置为示例数据。如需持久化，在 Service 设置里启用 **Persistent Disk** 并把 `DB_PATH` 改为 `/data/portfolio.db`

### Railway

1. 新建 Project，部署 portfolio-server 子目录
2. 设置服务变量 `PORT`、`CORS_ORIGIN`、`ADMIN_USERNAME`、`ADMIN_PASSWORD`
3. 启动命令选 `npm start`，构建命令 `npm run build`
4. 免费层同样是临时文件系统，建议付费启用持久化卷

### 本地生产验证

```bash
cd portfolio-server
npm run build
npm start              # http://localhost:3000
```

## 目录结构

```
portfolio-server/
├── .env.example        # 参考配置
├── .gitignore
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts        # Express 入口 + 路由 + 鉴权中间件
    ├── db.ts           # SQLite 连接 + 建表 + 种子 + CRUD
    ├── seed.ts         # 默认 PortfolioData 示例数据
    └── tokens.ts       # 内存 token 管理（生成/校验/吊销）
```

## 安全注意

- 默认密码 `admin / admin123`，**上线前务必在 .env 中改**
- 密码使用 scrypt 加盐哈希，比 md5/sha256 安全，且是 Node 内置无依赖
- token 存内存 Map（24h TTL），冷启动会清空；如需持久化登录状态可改成 SQLite sessions 表
- `CORS_ORIGIN=*` 方便开发，生产建议限定具体域名
- 所有错误响应已泛化（不泄漏 SQL/内部实现），详细错误只写服务端 console

## 后端→主站字段映射表（后端需自行转换）

| 后台字段 | 主站字段 | 说明 |
| --- | --- | --- |
| `basicInfo` | `profile` + `strengthSection.heading/subHeading` | 合并了个人资料与优势标题 |
| `advantages`（group=strength） | `strengthSection.strengths` | 取 strength 类型 |
| `advantages`（group=skill） | `strengthSection.skills` | 取 skill 类型 |
| `projects` | `experiences` | 重命名 |
| `works` | `works` | 一致 |
| `contact` | `contact` | 一致 |
| `seo` / `favicon` | 无对应 | 需写入主站 index.html 或提供独立 SEO 接口 |

后端可在本服务中新增 `/api/portfolio/web` 路由，返回主站字段名版本，两套前端分别对接不同 API。
