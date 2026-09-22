import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { isAuthenticated } from '@/api/auth'

/**
 * 使用 hash 路由适配 GitHub Pages 静态部署
 * （createWebHistory 在 Pages 下刷新会 404）
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard-redirect', redirect: '/dashboard/basic' },
      {
        path: 'basic',
        name: 'basic',
        component: () => import('@/views/BasicInfoView.vue'),
        meta: { title: '基础信息' }
      },
      {
        path: 'advantages',
        name: 'advantages',
        component: () => import('@/views/AdvantagesView.vue'),
        meta: { title: '个人优势' }
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/views/ProjectsView.vue'),
        meta: { title: '项目经历' }
      },
      {
        path: 'works',
        name: 'works',
        component: () => import('@/views/WorksView.vue'),
        meta: { title: '作品案例' }
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/ContactView.vue'),
        meta: { title: '联系方式' }
      },
      {
        path: 'seo',
        name: 'seo',
        component: () => import('@/views/SeoView.vue'),
        meta: { title: 'SEO 配置' }
      },
      {
        path: 'favicon',
        name: 'favicon',
        component: () => import('@/views/FaviconView.vue'),
        meta: { title: 'Favicon' }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/** 全局路由守卫：未登录跳转登录页 */
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && isAuthenticated()) {
    return { name: 'basic' }
  }
})

export default router
