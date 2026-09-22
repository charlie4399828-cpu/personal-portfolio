<script setup lang="ts">
import type { ProjectExperience } from '@/types/portfolio'

defineProps<{ experiences: ProjectExperience[] }>()
</script>

<template>
  <div class="section-shell">
    <div class="mx-auto w-full max-w-4xl">
      <header class="reveal text-center">
        <p class="section-eyebrow">Experience</p>
        <h2 class="section-title">项目经历</h2>
        <p class="mt-3 text-sm text-gray-400 md:text-base">
          深耕互联网电商一线，每段经历都以业务结果说话
        </p>
      </header>

      <a-card class="reveal reveal-d1 mt-8 !rounded-2xl md:mt-10">
        <a-timeline mode="left">
          <a-timeline-item
            v-for="item in experiences"
            :key="item.period + item.name"
            :label="item.period"
            dot-color="#F25516"
          >
            <h3 class="text-sm font-semibold text-gray-900 md:text-base">
              {{ item.role }}
              <span class="mx-1 text-gray-300">·</span>
              <span class="text-brand-500">{{ item.name }}</span>
            </h3>
            <p class="mt-1.5 text-xs leading-relaxed text-gray-500 md:text-sm">
              {{ item.description }}
            </p>
            <ul v-if="(item.achievements ?? []).length" class="mt-2 space-y-1">
              <li
                v-for="achievement in item.achievements ?? []"
                :key="achievement"
                class="flex items-center gap-1.5 text-xs text-gray-600"
              >
                <icon-check-circle class="shrink-0 text-brand-400" />
                {{ achievement }}
              </li>
            </ul>
            <div v-if="(item.tags ?? []).length" class="mt-2 flex flex-wrap gap-1.5">
              <a-tag v-for="tag in item.tags ?? []" :key="tag" size="small" class="brand-tag">
                {{ tag }}
              </a-tag>
            </div>
          </a-timeline-item>
        </a-timeline>
      </a-card>
    </div>
  </div>
</template>
