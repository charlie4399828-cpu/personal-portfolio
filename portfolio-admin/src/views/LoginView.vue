<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form, Message } from '@arco-design/web-vue'
import { login } from '@/api/auth'
import { MOCK_CREDENTIALS, API_BASE_URL } from '@/api/config'

const isMock = API_BASE_URL === '/mock/api'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const loading = ref(false)
const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })

async function submit() {
  errors.username = !form.username ? '请输入用户名' : ''
  errors.password = !form.password ? '请输入密码' : ''
  if (errors.username || errors.password) return
  loading.value = true
  try {
    await login(form)
    Message.success('登录成功')
    const redirect = (route.query.redirect as string) || '/dashboard/basic'
    router.replace(redirect)
  } catch (e) {
    Message.error(e instanceof Error ? e.message : '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex h-screen w-full items-center justify-center"
    style="background: linear-gradient(135deg, #fff7e8 0%, #ffffff 40%, #f255160d 100%)"
  >
    <a-card class="w-[420px] rounded-2xl shadow-xl" :bordered="false">
      <div class="mb-6 text-center">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white"
          style="background: linear-gradient(135deg, #ff9049, #f25516)"
        >
          A
        </div>
        <h1 class="mt-3 text-xl font-semibold text-gray-900">作品集管理后台</h1>
        <p class="mt-1 text-xs text-gray-400">Portfolio Admin Console</p>
      </div>

      <a-form ref="formRef" layout="vertical" :model="form" @submit="submit">
        <a-form-item field="username" :error="errors.username">
          <a-input v-model="form.username" placeholder="用户名" allow-clear>
            <template #prefix><icon-user /></template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" :error="errors.password">
          <a-input-password v-model="form.password" placeholder="密码">
            <template #prefix><icon-lock /></template>
          </a-input-password>
        </a-form-item>
        <a-button type="primary" long :loading="loading" html-type="submit"> 登 录 </a-button>
      </a-form>

      <div v-if="isMock" class="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
        <span class="font-semibold text-brand-500">Mock 模式</span>：账号
        {{ MOCK_CREDENTIALS.username }} / {{ MOCK_CREDENTIALS.password }}（可在 .env 修改）
      </div>
      <div v-else class="mt-4 rounded-lg bg-green-50 px-3 py-2 text-[11px] text-green-600">
        真实后端模式：{{ API_BASE_URL }}
      </div>
    </a-card>
  </div>
</template>
