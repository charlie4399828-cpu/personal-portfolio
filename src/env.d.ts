/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 接口基础地址（mock 目录或真实后端域名） */
  readonly VITE_API_BASE_URL?: string
  /** 作品集内容接口路径 */
  readonly VITE_API_PORTFOLIO_ENDPOINT?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

// vue-fullpage.js 未随包发布类型声明，此处手动补充
declare module 'vue-fullpage.js' {
  import type { App } from 'vue'
  const VueFullPage: { install: (app: App) => void }
  export default VueFullPage
}
