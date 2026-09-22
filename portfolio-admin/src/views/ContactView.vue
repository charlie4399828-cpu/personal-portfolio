<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input, Button, InputTag, Message } from '@arco-design/web-vue'
import { usePortfolioPage } from '@/composables/usePortfolioPage'

const { data, loading, error, saving, save } = usePortfolioPage()
const form = ref(data.value?.contact)

watch(
  data,
  (v) => {
    if (v) form.value = JSON.parse(JSON.stringify(v.contact))
  },
  { immediate: true }
)

function addSocial() {
  form.value?.socials.push({ label: '', url: '', icon: '' })
}
function removeSocial(i: number) {
  form.value?.socials.splice(i, 1)
}

async function handleSave() {
  if (!form.value) return
  form.value.socials = form.value.socials.filter((s) => s.label || s.url)
  const ok = await save({ contact: form.value })
  if (ok) Message.success('已保存')
}
</script>

<template>
  <a-spin v-if="loading" />
  <a-alert v-else-if="error" type="error">{{ error }}</a-alert>

  <template v-else-if="form">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">联系方式</h2>
      <a-button type="primary" :loading="saving" @click="handleSave">
        <template #icon><icon-save /></template>
        保存
      </a-button>
    </div>

    <a-card class="page-card" :bordered="false">
      <h3 class="form-section-title">基础联系</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div>
          <div class="mb-1 text-sm text-gray-500">邮箱</div>
          <a-input v-model="form.email" placeholder="hello@example.com" />
        </div>
        <div>
          <div class="mb-1 text-sm text-gray-500">电话</div>
          <a-input v-model="form.phone" placeholder="可选" />
        </div>
        <div>
          <div class="mb-1 text-sm text-gray-500">微信</div>
          <a-input v-model="form.wechat" />
        </div>
        <div>
          <div class="mb-1 text-sm text-gray-500">开源地址</div>
          <a-input v-model="form.openSourceUrl" placeholder="https://github.com/..." />
        </div>
      </div>

      <div class="mt-4">
        <div class="mb-1 text-sm text-gray-500">版权声明</div>
        <a-textarea v-model="form.copyright" :auto-size="{ minRows: 2, maxRows: 4 }" />
      </div>

      <div class="mt-4">
        <div class="mb-1 text-sm text-gray-500">ICP 备案号</div>
        <a-input v-model="form.icp" placeholder="可选" />
      </div>
    </a-card>

    <a-card class="mt-4 page-card" :bordered="false">
      <div class="mb-3 flex items-center justify-between">
          <h3 class="form-section-title mb-0">社交链接</h3>
          <a-button type="outline" size="small" @click="addSocial">+ 添加一行</a-button>
        </div>
        <a-space direction="vertical" fill>
          <div v-for="(_, i) in form.socials" :key="i" class="flex gap-2">
            <a-input v-model="(form.socials as any[])[i].label" placeholder="名称" style="width: 130px" />
            <a-input v-model="(form.socials as any[])[i].url" placeholder="URL" class="flex-1" />
            <a-input v-model="(form.socials as any[])[i].icon" placeholder="图标名" style="width: 140px" />
            <a-button type="text" status="danger" @click="removeSocial(i)">删除</a-button>
          </div>
        </a-space>
    </a-card>
  </template>
</template>
