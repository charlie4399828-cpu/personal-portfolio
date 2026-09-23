<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input, Button, InputTag, Message } from '@arco-design/web-vue'
import { usePortfolioPage } from '@/composables/usePortfolioPage'

const { data, loading, error, saving, save } = usePortfolioPage()
const form = ref(data.value?.seo)

watch(
  data,
  (v) => {
    if (v) form.value = JSON.parse(JSON.stringify(v.seo))
  },
  { immediate: true }
)

async function handleSave() {
  if (!form.value) return
  const ok = await save({ seo: form.value })
  if (ok) Message.success('已保存')
}
</script>

<template>
  <a-spin v-if="loading" />
  <a-alert v-else-if="error" type="error">{{ error }}</a-alert>

  <template v-else-if="form">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">SEO 配置</h2>
      <a-button type="primary" :loading="saving" @click="handleSave">
        <template #icon><icon-save /></template>
        保存
      </a-button>
    </div>

    <a-card class="page-card" :bordered="false">
      <h3 class="form-section-title">站点元信息</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div>
          <div class="mb-1 text-sm text-gray-500">Site Name</div>
          <a-input v-model="form.siteName" />
        </div>
        <div>
          <div class="mb-1 text-sm text-gray-500">Author</div>
          <a-input v-model="form.author" />
        </div>
      </div>

      <div class="mt-3">
        <div class="mb-1 text-sm text-gray-500">Title（50–60 字符为宜）</div>
        <a-input v-model="form.title" />
        <div class="mt-1 text-right text-xs text-gray-400">
          {{ (form.title || '').length }} chars
        </div>
      </div>

      <div class="mt-3">
        <div class="mb-1 text-sm text-gray-500">Description（140–160 字符为宜）</div>
        <a-textarea v-model="form.description" :auto-size="{ minRows: 2, maxRows: 4 }" />
        <div class="mt-1 text-right text-xs text-gray-400">
          {{ (form.description || '').length }} chars
        </div>
      </div>

      <div class="mt-3">
        <div class="mb-1 text-sm text-gray-500">Keywords</div>
        <a-input-tag v-model="form.keywords" placeholder="回车添加关键词" />
      </div>

      <div class="mt-3">
        <div class="mb-1 text-sm text-gray-500">OG 分享图 URL</div>
        <a-input v-model="form.ogImage" placeholder="./og-image.jpg 或完整地址" />
      </div>
    </a-card>

    <a-alert class="mt-4" type="warning">
      SEO 配置保存在后台，前端 index.html 为静态模板。后端需在部署时把这些字段写入
      index.html，或提供独立 SEO 接口。
    </a-alert>
  </template>
</template>
