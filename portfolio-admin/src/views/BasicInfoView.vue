<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, Form, Input, Tag, Button, Message } from '@arco-design/web-vue'
import { usePortfolioPage } from '@/composables/usePortfolioPage'

const { data, loading, error, saving, save } = usePortfolioPage()
const form = ref(data.value?.basicInfo)

watch(
  data,
  (v) => {
    if (v) form.value = JSON.parse(JSON.stringify(v.basicInfo))
  },
  { immediate: true }
)

const skillHeading = ref(data.value?.basicInfo.heading ?? '')
const skillSub = ref(data.value?.basicInfo.subHeading ?? '')

async function handleSave() {
  if (!form.value) return
  const ok = await save({ basicInfo: form.value })
  if (ok) Message.success('已保存')
}

async function addMetric() {
  if (!form.value) return
  form.value.highlightMetrics?.push({ label: '', value: '' })
}
async function removeMetric(i: number) {
  form.value?.highlightMetrics?.splice(i, 1)
}
</script>

<template>
  <a-card v-if="loading" :bordered="false"><a-spin /></a-card>
  <a-alert v-else-if="error" type="error" class="mb-4">{{ error }}</a-alert>

  <template v-else-if="form">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">基础信息</h2>
      <a-button type="primary" :loading="saving" @click="handleSave">
        <template #icon><icon-save /></template>
        保存
      </a-button>
    </div>

    <a-card class="mb-4 page-card" :bordered="false">
      <h3 class="form-section-title">个人资料</h3>
      <a-form :model="form" layout="inline" :label-col-style="{ width: 110 }">
        <a-form-item field="name" label="姓名">
          <a-input v-model="form.name" style="width: 200px" />
        </a-form-item>
        <a-form-item field="title" label="职业标签">
          <a-input v-model="form.title" style="width: 320px" />
        </a-form-item>
        <a-form-item field="avatar" label="头像 URL">
          <a-input v-model="form.avatar" style="width: 320px" placeholder="如 avatar.svg" />
        </a-form-item>
        <a-form-item field="location" label="所在地">
          <a-input v-model="form.location" style="width: 160px" />
        </a-form-item>
        <a-form-item field="yearsOfExperience" label="从业年限">
          <a-input-number v-model="form.yearsOfExperience" :min="0" style="width: 160px" />
        </a-form-item>
      </a-form>

      <div class="mt-4">
        <div class="mb-1 text-sm text-gray-500">标签</div>
        <a-input-tag v-model="form.tags" placeholder="回车添加标签" />
      </div>

      <div class="mt-4">
        <div class="mb-1 text-sm text-gray-500">个人简介</div>
        <a-textarea v-model="form.intro" :auto-size="{ minRows: 4, maxRows: 8 }" />
      </div>
    </a-card>

    <a-card class="mb-4 page-card" :bordered="false">
      <h3 class="form-section-title">数据亮点</h3>
      <a-space direction="vertical" fill>
        <div v-for="(m, i) in form.highlightMetrics" :key="i" class="flex gap-2">
          <a-input v-model="m.label" placeholder="指标名称" style="width: 200px" />
          <a-input v-model="m.value" placeholder="数值" style="width: 160px" />
          <a-button type="text" status="danger" @click="removeMetric(i)">删除</a-button>
        </div>
      </a-space>
      <a-button class="mt-3" type="outline" size="small" @click="addMetric">
        <template #icon><icon-plus /></template>
        添加指标
      </a-button>
    </a-card>
  </template>
</template>
