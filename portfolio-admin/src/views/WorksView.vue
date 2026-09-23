<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Message } from '@arco-design/web-vue'
import { usePortfolioPage } from '@/composables/usePortfolioPage'
import TagEditModal from '@/components/TagEditModal.vue'
import type { WorkItem } from '@/types/portfolio'

const { data, loading, error, saving, save } = usePortfolioPage()
const list = computed(() => data.value?.works ?? [])

function add() {
  data.value?.works.unshift({
    id: 'w_' + Date.now(),
    title: '新作品',
    subtitle: '',
    description: '',
    imageUrl: '',
    themeColor: '#F25516',
    metrics: [],
    tags: [],
    link: ''
  })
}
function remove(id?: string) {
  if (!data.value || !id) return
  data.value.works = data.value.works.filter((w) => w.id !== id)
}
function addMetric(item: WorkItem) {
  item.metrics?.push({ label: '', value: '' })
}

/** 标签编辑弹窗状态 */
const tagModalVisible = ref(false)
const tagModalItem = ref<WorkItem | null>(null)
function openTagModal(item: WorkItem) {
  tagModalItem.value = item
  tagModalVisible.value = true
}
function onTagConfirm(tags: string[]) {
  if (tagModalItem.value) tagModalItem.value.tags = tags
}

/** 作品模块可见性开关（默认隐藏，仅后台可配置，前台不显示该开关） */
const worksVisible = ref(false)
const settingsSaving = ref(false)
async function handleToggleVisible(v: boolean | string | number) {
  if (!data.value) return
  const next = { worksVisible: v === true }
  settingsSaving.value = true
  try {
    const ok = await save({ settings: next })
    if (ok) {
      worksVisible.value = next.worksVisible
      Message.success(next.worksVisible ? '作品模块已设为可见' : '作品模块已隐藏')
    }
  } finally {
    settingsSaving.value = false
  }
}

// 数据加载后同步开关初值
watch(
  data,
  (v) => {
    if (v) worksVisible.value = v.settings?.worksVisible === true
  },
  { immediate: true }
)

async function handleSave() {
  if (!data.value) return
  data.value.works.forEach((w) => {
    if (w.metrics) w.metrics = w.metrics.filter((m) => m.label || m.value)
    if (w.tags) w.tags = w.tags.filter((t) => t)
  })
  const ok = await save({ works: data.value.works })
  if (ok) Message.success('已保存')
}
</script>

<template>
  <a-spin v-if="loading" />
  <a-alert v-else-if="error" type="error">{{ error }}</a-alert>

  <template v-else>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">作品案例</h2>
      <div>
        <a-button class="mr-2" type="outline" @click="add">+ 新增作品</a-button>
        <a-button type="primary" :loading="saving" @click="handleSave">保存</a-button>
      </div>
    </div>

    <!-- 可见性控制：仅后台显示，前台不渲染此开关。默认隐藏，开启后前台才展示作品模块 -->
    <a-card class="mb-4 page-card" :bordered="false">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="form-section-title mb-0">前台可见性</h3>
          <p class="mt-1 text-xs text-gray-400">
            控制「作品案例」模块是否在主站展示。默认隐藏，开启后主站才会渲染该屏。
          </p>
        </div>
        <a-switch
          :model-value="worksVisible"
          :loading="settingsSaving"
          checked-text="可见"
          unchecked-text="隐藏"
          @change="handleToggleVisible"
        />
      </div>
    </a-card>

    <a-row :gutter="16">
      <a-col v-for="(item, idx) in list" :key="item.id ?? idx" :xs="24" :sm="12" :lg="8">
        <a-card class="mb-4 page-card" :bordered="false">
          <div class="flex gap-2">
            <a-input v-model="item.title" placeholder="标题" class="flex-1" />
            <a-button type="text" status="danger" size="mini" @click="remove(item.id)">删</a-button>
          </div>
          <div class="mt-2 flex gap-2">
            <a-input v-model="item.subtitle" placeholder="副标题" class="flex-1" />
            <a-input v-model="item.themeColor" placeholder="主题色" style="width: 120px" />
          </div>
          <div class="mt-2">
            <a-input v-model="item.imageUrl" placeholder="封面图 URL（可选）" />
          </div>
          <div class="mt-2">
            <a-textarea
              v-model="item.description"
              :auto-size="{ minRows: 2, maxRows: 4 }"
              placeholder="描述"
            />
          </div>
          <div class="mt-2">
            <a-input v-model="item.link" placeholder="外部链接（可选）" />
          </div>
          <div class="mt-3">
            <div class="mb-1 text-xs text-gray-500">指标</div>
            <a-space direction="vertical" fill>
              <div v-for="(_, i) in item.metrics ?? []" :key="i" class="flex gap-2">
                <a-input
                  v-model="(item.metrics as any[])[i].label"
                  placeholder="名称"
                  class="flex-1"
                />
                <a-input
                  v-model="(item.metrics as any[])[i].value"
                  placeholder="值"
                  style="width: 110px"
                />
                <a-button
                  type="text"
                  status="danger"
                  size="mini"
                  @click="(item.metrics as any[]).splice(i, 1)"
                  >×</a-button
                >
              </div>
            </a-space>
            <a-button class="mt-1" type="text" size="mini" @click="addMetric(item)"
              >+ 指标</a-button
            >
          </div>
          <div class="mt-2">
            <div class="mb-1 flex items-center justify-between">
              <span class="text-xs text-gray-500">标签</span>
              <a-button type="text" size="mini" @click="openTagModal(item)">编辑标签</a-button>
            </div>
            <div v-if="(item.tags ?? []).length" class="flex flex-wrap gap-1">
              <a-tag v-for="(t, i) in item.tags ?? []" :key="i" size="small">{{ t }}</a-tag>
            </div>
            <p v-else class="text-xs text-gray-400">暂无标签，点击"编辑标签"添加</p>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <TagEditModal
      v-model:visible="tagModalVisible"
      :tags="tagModalItem?.tags ?? []"
      :title="`标签编辑 · ${tagModalItem?.title || ''}`"
      @confirm="onTagConfirm"
    />
  </template>
</template>
