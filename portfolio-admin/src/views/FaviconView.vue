<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input, Button, Message, Alert } from '@arco-design/web-vue'
import { usePortfolioPage } from '@/composables/usePortfolioPage'

const { data, loading, error, saving, save } = usePortfolioPage()
const form = ref(data.value?.favicon)

watch(
  data,
  (v) => {
    if (v) form.value = JSON.parse(JSON.stringify(v.favicon))
  },
  { immediate: true }
)

async function handleSave() {
  if (!form.value) return
  const ok = await save({ favicon: form.value })
  if (ok) Message.success('已保存')
}
</script>

<template>
  <a-spin v-if="loading" />
  <a-alert v-else-if="error" type="error">{{ error }}</a-alert>

  <template v-else-if="form">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Favicon</h2>
      <a-button type="primary" :loading="saving" @click="handleSave">
        <template #icon><icon-save /></template>
        保存
      </a-button>
    </div>

    <a-card class="page-card" :bordered="false">
      <h3 class="form-section-title">图标地址</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div>
          <div class="mb-1 text-sm text-gray-500">主 favicon.ico / svg</div>
          <a-input v-model="form.iconUrl" placeholder="./favicon.svg 或完整 URL" />
        </div>
        <div>
          <div class="mb-1 text-sm text-gray-500">iOS（Apple Touch 180×180）</div>
          <a-input v-model="form.appleIconUrl" placeholder="./apple-touch-icon.png" />
        </div>
        <div>
          <div class="mb-1 text-sm text-gray-500">Android 192×192</div>
          <a-input v-model="form.android192Url" placeholder="./android-chrome-192x192.png" />
        </div>
        <div>
          <div class="mb-1 text-sm text-gray-500">Android 512×512</div>
          <a-input v-model="form.android512Url" placeholder="./android-chrome-512x512.png" />
        </div>
      </div>

      <div class="mt-5 flex items-center gap-4">
        <div class="rounded-lg border border-gray-200 p-3 text-center">
          <img v-if="form.iconUrl" :src="form.iconUrl" class="mx-auto h-16 w-16" />
          <div class="mt-1 text-xs text-gray-500">当前图标</div>
        </div>
      </div>
    </a-card>

    <a-alert class="mt-4" type="warning">
      当前项目采用"后台写入 → 前端 index.html 部署"的静态链路：保存后需重新构建部署才能更新 favicon 引用；若后端提供动态 SEO 接口，则可实时生效。
    </a-alert>
  </template>
</template>
