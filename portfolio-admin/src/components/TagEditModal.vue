<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Modal, Input, Button, Message } from '@arco-design/web-vue'

const props = defineProps<{
  /** 控制弹窗显隐（v-model:visible） */
  visible: boolean
  /** 弹窗标题 */
  title?: string
  /** 待编辑的标签数组 */
  tags: string[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'confirm', tags: string[]): void
}>()

/** 本地编辑副本，确认时才回写，避免中途取消污染父级 */
const local = ref<string[]>([])
/** 每个标签的校验错误信息，下标与 local 对应 */
const errors = ref<string[]>([])

const MAX_LEN = 20

watch(
  () => props.visible,
  (open) => {
    if (open) {
      local.value = (props.tags ?? []).map((t) => t)
      errors.value = local.value.map(() => '')
    }
  },
  { immediate: true }
)

/** 单个标签校验：返回错误信息，空串表示通过 */
function validate(idx: number) {
  const val = (local.value[idx] ?? '').trim()
  local.value[idx] = val
  if (!val) {
    errors.value[idx] = '标签名不能为空'
    return
  }
  if (val.length > MAX_LEN) {
    errors.value[idx] = `不能超过 ${MAX_LEN} 个字符`
    return
  }
  // 重复检测（大小写不敏感）
  const dup = local.value.findIndex((t, i) => i !== idx && t.toLowerCase() === val.toLowerCase())
  if (dup !== -1) {
    errors.value[idx] = '与其它标签重复'
    return
  }
  errors.value[idx] = ''
}

/** 全局校验通过才允许确认 */
const canConfirm = computed(
  () =>
    local.value.length > 0 &&
    errors.value.every((e) => e === '') &&
    local.value.every((t) => t.trim() !== '')
)

function addTag() {
  local.value.push('')
  errors.value.push('')
}

function removeTag(idx: number) {
  local.value.splice(idx, 1)
  errors.value.splice(idx, 1)
  // 删除后重新校验剩余项的重复情况
  local.value.forEach((_, i) => validate(i))
}

function handleConfirm() {
  // 最终全量校验一次
  local.value.forEach((_, i) => validate(i))
  if (!canConfirm.value) {
    Message.warning('请先修正标签中的错误')
    return
  }
  emit(
    'confirm',
    local.value.map((t) => t.trim())
  )
  emit('update:visible', false)
}

function handleClose() {
  emit('update:visible', false)
}
</script>

<template>
  <a-modal
    :visible="visible"
    :title="title || '编辑标签'"
    :width="480"
    :mask-closable="false"
    @cancel="handleClose"
  >
    <div class="space-y-2">
      <p class="text-xs text-gray-400">支持内联编辑标签名，校验通过后方可保存。</p>
      <div v-for="(_, idx) in local" :key="idx" class="flex items-center gap-2">
        <a-input
          v-model="local[idx]"
          :max-length="MAX_LEN"
          placeholder="输入标签名"
          class="flex-1"
          :status="errors[idx] ? 'error' : undefined"
          allow-clear
          @blur="validate(idx)"
          @input="errors[idx] = ''"
        />
        <a-button type="text" status="danger" size="mini" @click="removeTag(idx)">删除</a-button>
      </div>
      <div v-if="local.some((_, i) => errors[i])" class="text-xs text-red-500">
        {{ local.map((_, i) => errors[i]).find(Boolean) }}
      </div>
      <a-button type="outline" size="small" @click="addTag">
        <template #icon><icon-plus /></template>
        添加标签
      </a-button>
    </div>
    <template #footer>
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" :disabled="!canConfirm" @click="handleConfirm">保存</a-button>
    </template>
  </a-modal>
</template>
