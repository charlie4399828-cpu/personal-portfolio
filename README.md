# 互联网+电商 · 个人作品集

基于 **Vite + Vue3 + TypeScript + Arco Design Vue + Tailwind CSS + vue-fullpage.js** 的全屏滚动单页作品集官网。

- 纯静态站点，构建产物可直接部署到 GitHub Pages / Gitee Pages，无需服务器
- **接口驱动渲染**：页面所有内容（个人信息 / 优势 / 经历 / 作品 / 联系方式）均通过 Axios 请求 JSON 渲染，不硬编码在组件内
- 更新内容只需修改接口返回的数据，无需改动组件代码、无需重新打包
- PC + 移动端响应式，Arco 组件 + Tailwind 微调，主题色为自定义电商橙

## 快速开始

```bash
# 安装依赖（Node 18+）
npm install

# 本地开发（默认读取 public/mock/portfolio.json）
npm run dev

# 代码检查 / 格式化
npm run lint
npm run format

# 生产构建（含 TS 类型检查，输出到 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

## 内容更新与接口切换

页面渲染的数据结构由 `src/types/portfolio.ts` 中的 `PortfolioData` 定义，接口地址由项目根目录 `.env` 配置：

| 场景 | 做法 | 是否需要重新打包 |
| --- | --- | --- |
| 本地开发预览 | 修改 `public/mock/portfolio.json` | 否（开发热更新） |
| 已部署站点更新内容 | 修改仓库中 `public/mock/portfolio.json` 并推送（自动部署），或直接替换站点上的该 JSON 文件 | 否（内容为运行时请求） |
| 对接真实后端 / CMS | `.env` 中改为 `VITE_API_BASE_URL=https://api.your-domain.com`、`VITE_API_PORTFOLIO_ENDPOINT=/portfolio`，后端按 `PortfolioData` 结构返回 JSON | 需要一次构建 |
| 内容托管到 OSS / CDN | 把 `portfolio.json` 上传到对象存储，`VITE_API_BASE_URL` 指向该地址，后续只更新 JSON | 否 |

> 若后端返回 `{ code, data }` 包装结构，在 `src/api/request.ts` 的响应拦截器中统一解包即可（已预留注释位置）。

## 部署

### GitHub Pages（推荐）
1. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
2. 推送代码到 `main` 分支，内置工作流 `.github/workflows/deploy.yml` 会自动构建并发布

### Gitee Pages
```bash
npm run build
npx gh-pages -d dist -r https://gitee.com/<用户名>/<仓库>.git -b gh-pages
```
然后在 Gitee 仓库「服务 → Gitee Pages」中开启，选择 `gh-pages` 分支。

### 自定义域名
在 Pages 设置中绑定域名并配置 DNS 解析即可；本项目使用相对路径构建（`base: './'`），绑定域名无需改动任何配置。

## Favicon 与 SEO

`index.html` 已内置完整 head 信息，构建时 Vite 会把 `%VITE_SITE_URL%` 替换为 `.env` 中配置的站点地址：

- **图标集**（均位于 `public/`，相对路径引用，子路径部署无 404）：
  - `favicon.svg`（现代浏览器矢量图标）、`favicon.ico`（16/32/48 多尺寸，兼容旧浏览器/默认探测）
  - `apple-touch-icon.png`（180×180，iOS 主屏）、`android-chrome-192/512`（配合 `site.webmanifest` 支持 PWA 添加到主屏）
  - `og-image.jpg`（1200×630，微信/X/飞书等社交分享卡片）
- **SEO 信息**：title / description / keywords / canonical / robots / theme-color、Open Graph、Twitter Card、JSON-LD（WebSite + Person 结构化数据）
- `public/robots.txt`、`public/sitemap.xml` 为搜索引擎抓取入口

**上线前必做**：把 `.env` 的 `VITE_SITE_URL`、`robots.txt` 与 `sitemap.xml` 中的占位地址 `https://yourname.github.io/portfolio` 改为真实地址。JSON-LD 中的姓名/职位是静态 SEO 信息，如更换个人资料请同步修改 `index.html`。

> 多尺寸 `favicon.ico` 可由 PNG 重新合成：`node scripts/build-favicon.mjs`（零第三方依赖）。

## 目录结构

```
├── public/
│   ├── mock/portfolio.json       # 内置 mock 数据（运行时请求，不打包进 JS）
│   ├── avatar.svg                # 默认头像
│   ├── favicon.svg / favicon.ico # 矢量图标 + 多尺寸兼容图标
│   ├── favicon-16/32/48.png      # favicon.ico 的源 PNG
│   ├── apple-touch-icon.png      # iOS 主屏图标 180×180
│   ├── android-chrome-192/512.png# Android/PWA 图标
│   ├── og-image.jpg              # 社交分享卡片 1200×630
│   ├── site.webmanifest          # PWA 清单
│   ├── robots.txt / sitemap.xml  # 搜索引擎抓取入口
├── scripts/
│   └── build-favicon.mjs         # 由 PNG 合成多尺寸 favicon.ico
├── src/
│   ├── api/                      # Axios 封装与接口定义（切换后端的唯一入口）
│   ├── components/               # 五个全屏 Section 组件
│   ├── composables/              # usePortfolioData 数据加载 Hook
│   ├── styles/                   # Tailwind 入口 + Arco 主题色定制
│   ├── types/                    # 全站内容 TS 类型定义
│   ├── App.vue                   # fullpage 全屏滚动容器
│   └── main.ts
└── vite.config.ts
```

## License 说明

本项目业务代码可自由开源使用；依赖的 [fullpage.js](https://alvarotrigo.com/fullPage/) v4 为 GPLv3 许可，开源项目场景可免费使用（`licenseKey: 'gplv3-license'`）。
