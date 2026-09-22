<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { WorkItem } from '@/types/portfolio'

defineProps<{ works: WorkItem[] }>()

// 无封面图时使用主题色渐变占位，保证视觉统一且零外链依赖
function coverStyle(work: WorkItem): CSSProperties {
  if (work.coverUrl) return {}
  const color = work.themeColor || '#F25516'
  return {
    background: `linear-gradient(135deg, ${color}E6 0%, ${color} 55%, ${color}B3 100%)`
  }
}
</script>

<template>
  <div class="section-shell">
    <div class="mx-auto w-full max-w-6xl">
      <header class="reveal text-center">
        <p class="section-eyebrow">Portfolio</p>
        <h2 class="section-title">作品案例</h2>
        <p class="mt-3 text-sm text-gray-400 md:text-base">以转化与体验为核心的电商项目成果</p>
      </header>

      <div class="mt-8 columns-1 gap-4 sm:columns-2 md:mt-10 lg:columns-3">
        <a-card
          v-for="work in works"
          :key="work.title"
          :body-style="{ padding: 0 }"
          class="work-card mb-4 break-inside-avoid overflow-hidden"
        >
          <div class="relative flex h-32 items-end p-4" :style="coverStyle(work)">
            <img
              v-if="work.coverUrl"
              :src="work.coverUrl"
              :alt="work.title"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div class="relative">
              <p class="text-lg font-bold text-white drop-shadow">{{ work.title }}</p>
              <p v-if="work.subtitle" class="text-xs text-white/80">{{ work.subtitle }}</p>
            </div>
          </div>

          <div class="p-4">
            <p class="text-xs leading-relaxed text-gray-500 md:text-sm">{{ work.description }}</p>

            <div v-if="(work.metrics ?? []).length" class="mt-3 grid grid-cols-2 gap-2">
              <div
                v-for="metric in work.metrics ?? []"
                :key="metric.label"
                class="rounded-lg bg-brand-50/70 px-2 py-2 text-center"
              >
                <div class="text-sm font-bold text-brand-500">{{ metric.value }}</div>
                <div class="mt-0.5 text-[11px] text-gray-400">{{ metric.label }}</div>
              </div>
            </div>

            <div class="mt-3 flex items-center justify-between">
              <div class="flex flex-wrap gap-1.5">
                <a-tag v-for="tag in work.tags ?? []" :key="tag" size="small" class="brand-tag">
                  {{ tag }}
                </a-tag>
              </div>
              <a-link v-if="work.link" :href="work.link" target="_blank">详情</a-link>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>
