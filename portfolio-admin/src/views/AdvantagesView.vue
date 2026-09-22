<script setup lang="ts">
import { computed } from 'vue'
import { Button, Message, Checkbox } from '@arco-design/web-vue'
import { usePortfolioPage } from '@/composables/usePortfolioPage'
import type { AdvantageItem } from '@/types/portfolio'

const { data, loading, error, saving, save } = usePortfolioPage()

const strengths = computed(() => (data.value?.advantages ?? []).filter((a) => a.group === 'strength'))
const skills = computed(() => (data.value?.advantages ?? []).filter((a) => a.group === 'skill'))

function add(group: 'strength' | 'skill') {
  const newItem: AdvantageItem = {
    id: 'a_' + Date.now(),
    group,
    title: group === 'strength' ? '新优势' : '新技能',
    description: '',
    icon: 'icon-star',
    percent: group === 'skill' ? 80 : undefined,
    tags: []
  }
  data.value?.advantages.push(newItem)
}

function remove(id?: string) {
  if (!data.value || !id) return
  data.value.advantages = data.value.advantages.filter((a) => a.id !== id)
}

function addSkillTag(item: AdvantageItem) {
  item.tags = item.tags ?? []
  item.tags.push('')
}

async function handleSave() {
  if (!data.value) return
  data.value.advantages.forEach((a) => {
    if (a.tags) a.tags = a.tags.filter((t) => t)
  })
  const ok = await save({ advantages: data.value.advantages })
  if (ok) Message.success('已保存')
}
</script>

<template>
  <a-spin v-if="loading" />
  <a-alert v-else-if="error" type="error">{{ error }}</a-alert>

  <template v-else>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">个人优势</h2>
      <a-button type="primary" :loading="saving" @click="handleSave">
        <template #icon><icon-save /></template>
        保存
      </a-button>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <!-- 优势卡片管理 -->
      <a-card :bordered="false">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="form-section-title mb-0">优势卡片</h3>
          <a-button type="outline" size="small" @click="add('strength')">+ 添加</a-button>
        </div>
        <a-space direction="vertical" fill>
          <template v-for="item in strengths" :key="item.id">
            <div class="rounded-lg border border-gray-200 p-3">
              <div class="mb-2 flex gap-2">
                <a-input v-model="item.title" placeholder="标题" class="flex-1" />
                <a-input v-model="item.icon" placeholder="图标名" style="width: 140px" />
              </div>
              <a-textarea v-model="item.description" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="描述" />
              <div class="mt-2 flex items-center justify-between">
                <a-checkbox v-model="item.hidden" :un-checked-value="false">前端隐藏</a-checkbox>
                <a-button type="text" status="danger" size="mini" @click="remove(item.id)">删除</a-button>
              </div>
            </div>
          </template>
        </a-space>
      </a-card>

      <!-- 技能熟练度 -->
      <a-card :bordered="false">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="form-section-title mb-0">技能熟练度</h3>
          <a-button type="outline" size="small" @click="add('skill')">+ 添加</a-button>
        </div>
        <a-space direction="vertical" fill>
          <template v-for="item in skills" :key="item.id">
            <div class="rounded-lg border border-gray-200 p-3">
              <div class="mb-2 flex gap-2">
                <a-input v-model="item.title" placeholder="技能名称" class="flex-1" />
                <a-input-number v-model="item.percent" :min="0" :max="100" style="width: 100px" />
              </div>
              <div>
                <div class="mb-1 text-xs text-gray-500">标签</div>
                <a-space direction="vertical" fill>
                  <div v-for="(_, ti) in item.tags ?? []" :key="ti" class="flex gap-2">
                    <a-input v-model="(item.tags as string[])[ti]" placeholder="标签名称" class="flex-1" />
                    <a-button type="text" status="danger" size="mini" @click="(item.tags as string[]).splice(ti, 1)">×</a-button>
                  </div>
                </a-space>
                <a-button class="mt-1" type="text" size="mini" @click="addSkillTag(item)">+ 标签</a-button>
              </div>
              <a-progress :percent="item.percent || 0" :show-text="false" color="#F25516" />
              <div class="mt-2 flex items-center justify-between">
                <a-checkbox v-model="item.hidden" :un-checked-value="false">前端隐藏</a-checkbox>
                <a-button type="text" status="danger" size="mini" @click="remove(item.id)">删除</a-button>
              </div>
            </div>
          </template>
        </a-space>
      </a-card>
    </div>
  </template>
</template>
