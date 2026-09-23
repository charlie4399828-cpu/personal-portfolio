<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { logout } from '@/api/auth'
import { API_BASE_URL } from '@/api/config'
const isMock = API_BASE_URL === '/mock/api'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.name as string)

function onMenuSelect(key: string) {
  router.push({ name: key })
}

function handleLogout() {
  Modal.confirm({
    title: '确认退出',
    content: '退出后需要重新登录，确定继续？',
    onOk: () => {
      logout()
      Message.success('已退出登录')
      router.replace({ name: 'login' })
    }
  })
}
</script>

<template>
  <a-layout style="height: 100vh; min-height: 100vh">
    <!-- 侧边菜单 -->
    <a-layout-sider
      :width="220"
      collapsible
      :breakpoint="'lg'"
      style="background: #1d2129"
      :collapsed-style="{ background: '#1d2129' }"
    >
      <div class="flex h-14 items-center justify-center border-b border-white/10 text-white">
        <div class="icon-box mr-2">
          <icon-code />
        </div>
        <span class="text-base font-semibold tracking-wide">作品集管理</span>
      </div>
      <a-menu
        :selected-keys="[activeMenu]"
        :style="{ background: '#1d2129' }"
        theme="dark"
        @menu-item-click="onMenuSelect"
      >
        <a-menu-item key="basic">
          <icon-user />
          <span>基础信息</span>
        </a-menu-item>
        <a-menu-item key="advantages">
          <icon-star />
          <span>个人优势</span>
        </a-menu-item>
        <a-menu-item key="projects">
          <icon-list />
          <span>项目经历</span>
        </a-menu-item>
        <a-menu-item key="works">
          <icon-image />
          <span>作品案例</span>
        </a-menu-item>
        <a-menu-item key="contact">
          <icon-message />
          <span>联系方式</span>
        </a-menu-item>
        <a-menu-item key="seo">
          <icon-search />
          <span>SEO 配置</span>
        </a-menu-item>
        <a-menu-item key="favicon">
          <icon-safe />
          <span>Favicon</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 顶栏 -->
      <a-layout-header class="flex items-center justify-between bg-white px-6 shadow-sm">
        <div>
          <span class="text-lg font-semibold text-gray-800">作品管理后台</span>
          <a-tag v-if="isMock" size="small" class="ml-3" status="warning">mock 模式</a-tag>
          <a-tag v-else size="small" class="ml-3" status="success"
            >真实后端 · {{ API_BASE_URL }}</a-tag
          >
        </div>
        <a-dropdown>
          <a class="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <a-avatar :size="32" class="bg-brand-500">A</a-avatar>
            <span>admin</span>
            <icon-caret-down />
          </a>
          <template #content>
            <a-doption @select="handleLogout">
              <icon-export class="mr-2" />
              退出登录
            </a-doption>
          </template>
        </a-dropdown>
      </a-layout-header>

      <!-- 主内容 -->
      <a-layout-content class="overflow-auto p-6">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.icon-box {
  display: flex;
  height: 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f25516;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
