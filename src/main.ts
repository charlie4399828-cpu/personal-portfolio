import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import VueFullPage from 'vue-fullpage.js'
import '@arco-design/web-vue/dist/arco.css'
import 'fullpage.js/dist/fullpage.min.css'
import App from './App.vue'
import './styles/index.css'

const app = createApp(App)

// Arco Design 组件与图标全局注册
app.use(ArcoVue)
app.use(ArcoVueIcon)
// fullpage 全屏滚动
app.use(VueFullPage)

app.mount('#app')
