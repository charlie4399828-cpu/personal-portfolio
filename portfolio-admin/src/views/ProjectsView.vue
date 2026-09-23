<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Message } from '@arco-design/web-vue'
import { usePortfolioPage } from '@/composables/usePortfolioPage'
import TagEditModal from '@/components/TagEditModal.vue'
import type { ProjectItem } from '@/types/portfolio'

const { data, loading, error, saving, save } = usePortfolioPage()
const list = computed(() => data.value?.projects ?? [])

function add() {
  data.value?.projects.unshift({
    id: 'p_' + Date.now(),
    period: '',
    role: '',
    name: '',
    description: '',
    achievements: [],
    tags: [],
    coverUrl: ''
  })
}

function remove(id?: string) {
  if (!data.value || !id) return
  data.value.projects = data.value.projects.filter((p) => p.id !== id)
}

function addAchievement(item: ProjectItem) {
  item.achievements?.push('')
}

/** 标签编辑弹窗状态 */
const tagModalVisible = ref(false)
const tagModalItem = ref<ProjectItem | null>(null)
function openTagModal(item: ProjectItem) {
  tagModalItem.value = item
  tagModalVisible.value = true
}
function onTagConfirm(tags: string[]) {
  if (tagModalItem.value) tagModalItem.value.tags = tags
}

async function handleSave() {
  if (!data.value) return
  // 清理空字符串项
  data.value.projects.forEach((p) => {
    if (p.achievements) p.achievements = p.achievements.filter((a) => a)
    if (p.tags) p.tags = p.tags.filter((t) => t)
  })
  const ok = await save({ projects: data.value.projects })
  if (ok) Message.success('已保存')
}
</script>

<template>
  <a-spin v-if="loading" />
  <a-alert v-else-if="error" type="error">{{ error }}</a-alert>

  <template v-else>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">项目经历</h2>
      <div>
        <a-button class="mr-2" type="outline" @click="add">+ 新增项目</a-button>
        <a-button type="primary" :loading="saving" @click="handleSave">保存</a-button>
      </div>
    </div>

    <a-space direction="vertical" fill>
      <a-card v-for="(item, idx) in list" :key="item.id ?? idx" :bordered="false">
        <div class="flex gap-2">
          <a-input
            v-model="item.period"
            placeholder="时间段（如 2022.03 - 至今）"
            style="width: 240px"
          />
          <a-input v-model="item.role" placeholder="职位" style="width: 220px" />
          <a-input v-model="item.name" placeholder="公司 / 项目名" class="flex-1" />
          <a-button type="text" status="danger" @click="remove(item.id)">删除</a-button>
        </div>
        <div class="mt-3 flex gap-2">
          <a-input v-model="item.coverUrl" placeholder="封面图 URL（可选）" class="flex-1" />
        </div>
        <div class="mt-3">
          <a-textarea
            v-model="item.description"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="项目描述"
          />
        </div>
        <div class="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <div class="mb-1 text-xs text-gray-500">主要成果</div>
            <a-space direction="vertical" fill>
              <div v-for="(_, ai) in item.achievements ?? []" :key="ai" class="flex gap-2">
                <a-input
                  v-model="(item.achievements as string[])[ai]"
                  placeholder="成果项"
                  class="flex-1"
                />
                <a-button
                  type="text"
                  status="danger"
                  size="mini"
                  @click="(item.achievements as string[]).splice(ai, 1)"
                  >×</a-button
                >
              </div>
            </a-space>
            <a-button class="mt-1" type="text" size="mini" @click="addAchievement(item)"
              >+ 添加成果</a-button
            >
          </div>
          <div>
            <div class="mb-1 flex items-center justify-between">
              <span class="text-xs text-gray-500">标签</span>
              <a-button type="text" size="mini" @click="openTagModal(item)">编辑标签</a-button>
            </div>
            <div v-if="(item.tags ?? []).length" class="flex flex-wrap gap-1">
              <a-tag v-for="(t, ti) in item.tags ?? []" :key="ti" size="small">{{ t }}</a-tag>
            </div>
            <p v-else class="text-xs text-gray-400">暂无标签，点击"编辑标签"添加</p>
          </div>
        </div>
      </a-card>
    </a-space>

    <TagEditModal
      v-model:visible="tagModalVisible"
      :tags="tagModalItem?.tags ?? []"
      :title="`标签编辑 · ${tagModalItem?.name || ''}`"
      @confirm="onTagConfirm"
    />
  </template>
</template>
