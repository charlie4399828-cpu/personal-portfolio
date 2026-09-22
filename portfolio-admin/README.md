# 作品集后台管理系统

独立的前端管理后台，用于管理【互联网+电商个人作品集官网】全部内容。与作品集前端分离部署，共享统一的后端 API。

## 技术栈

- Vite 5 + Vue 3 + TypeScript
- Arco Design Vue 2.55 + Arco Icons
- Tailwind CSS 3
- Axios（封装 token 鉴权 + 401 自动退出）
- Vue Router 4（hash 模式，适配 GitHub Pages 静态部署）
- ESLint + Prettier

## 快速开始

```bash
cd portfolio-admin
npm install

# 开发（默认 5174 端口，mock 模式）
npm run dev

# 构建产物到 dist/（可直接部署 GitHub Pages）
npm run build

# 本地预览构建产物
npm run preview
```

Mock 登录账号：`admin` / `admin123`（可在 `.env` 修改）

## 目录结构

```
portfolio-admin/
├── public/favicon.svg
├── scripts/                      # 未来可扩展的工具脚本
├── src/
│   ├── api/
│   │   ├── config.ts             # API 地址常量 + mock 凭证
│   │   ├── request.ts            # Axios 封装（token 拦截器、401 退出）
│   │   ├── auth.ts               # 登录/登出
│   │   └── portfolio.ts          # 全量数据读取/保存（含 mock fallback）
│   ├── types/portfolio.ts        # 完整 TS 类型定义（basicInfo/advantages/projects/works/contact/seo/favicon）
│   ├── composables/usePortfolioPage.ts  # 页面通用加载 + 保存逻辑
│   ├── router/index.ts           # hash 路由 + 鉴权守卫
│   ├── layouts/MainLayout.vue    # 侧边菜单 + 顶栏 + 下拉退出
│   ├── views/
│   │   ├── LoginView.vue         # 登录页
│   │   ├── BasicInfoView.vue     # 基础信息（姓名、职业、头像、标签、简介、数据亮点）
│   │   ├── AdvantagesView.vue    # 优势卡片 + 技能熟练度
│   │   ├── ProjectsView.vue      # 项目经历（时间线结构）
│   │   ├── WorksView.vue         # 作品案例
│   │   ├── ContactView.vue       # 联系方式 + 社交链接
│   │   ├── SeoView.vue           # SEO 配置（title/description/keywords/OG）
│   │   └── FaviconView.vue       # favicon / PWA 图标地址
│   ├── styles/index.css          # Tailwind + Arco 主题色定制
│   ├── App.vue
│   └── main.ts
├── .env                          # VITE_API_BASE_URL（mock / 真实后端切换入口）
└── vite.config.ts
```

## 字段对齐（重要）

后台 TS 类型字段名与作品集前端当前字段名**不完全相同**，后端 API 需在两套字段之间做映射：

| 后台字段 | 前端对应字段 | 说明 |
| --- | --- | --- |
| `basicInfo` | `profile` + `strengthSection.heading/subHeading` | 合并了个人资料和优势标题 |
| `advantages`（group=strength / group=skill） | `strengthSection.strengths` + `strengthSection.skills` | 统一进一个数组，用 group 区分 |
| `projects` | `experiences` | 重命名 |
| `works` | `works` | 一致 |
| `contact` | `contact` | 一致 |
| `seo` | _(无)_ | 新增：保存到前端 index.html |
| `favicon` | _(无)_ | 新增：保存前端 favicon 引用 |

后端 API 约定：**读取**返回 `PortfolioData`（后台字段名），**保存**接收同样结构。后端需要自行将 `basicInfo` 拆解为 `profile` + `strengthSection`，将 `advantages` 按 group 拆分为 `strengths` / `skills`。

## Mock / 真实后端切换

`.env` 中的 `VITE_API_BASE_URL` 是切换入口：

| 模式 | 值 | 说明 |
| --- | --- | --- |
| mock（默认） | `/mock/api` | 读取 `src/api/portfolio.ts` 里的内置 JSON，登录用 `MOCK_CREDENTIALS` |
| 真实后端 | `https://your-backend.com/api` | Axios 真实请求；后端需实现以下接口 |

后端需要实现的 REST API：

```
POST   /api/auth/login          { username, password } → { token, username }
GET    /api/portfolio            PortfolioData
PUT    /api/portfolio            全量保存 PortfolioData
```

**401 自动退出**：Axios 响应拦截器检测到 HTTP 401 时会清 token 并跳转登录页。

## 静态部署（GitHub Pages）

`vite.config.ts` 已配置 `base: './'`，`npm run build` 产物可直接部署到任意子路径的 GitHub Pages / Gitee Pages。

建议两种部署方式：

1. **同一仓库独立 Pages**：admin 放在子路径 `/portfolio-admin/`，主站点放在 `/portfolio/`
2. **单独仓库**：admin 作为独立仓库 `portfolio-admin` 部署

若用 GitHub Actions，在仓库根新增 `.github/workflows/deploy.yml`，参考主站点配置即可。

## 与主站点的联动

- **同一后端**：后端 API 根据 URL 返回后台字段名（PortfolioData），主站点 API 返回前端字段名（含 profile/strengthSection）；或者后端统一返回后台字段名，主站点自行做字段映射
- **SEO / favicon 联动**：后台保存的 seo / favicon 字段需要后端同步到主站点 index.html（推荐部署时由后端生成，或 CMS 方案下由前端读取 JSON 动态渲染）

## 后续可扩展

- [ ] 本地图片上传（当前仅支持 URL）
- [ ] 内容历史版本 / 回收站
- [ ] 多人协作 + 权限分级
- [ ] 主站点 SEO / favicon 由后端生成到 index.html（推荐）
