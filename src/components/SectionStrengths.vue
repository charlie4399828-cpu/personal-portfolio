<script setup lang="ts">
import type { StrengthSection } from '@/types/portfolio'

defineProps<{ section: StrengthSection }>()
</script>

<template>
  <div class="section-shell">
    <div class="mx-auto w-full max-w-6xl">
      <header class="reveal text-center">
        <p class="section-eyebrow">Strengths</p>
        <h2 class="section-title">{{ section.heading }}</h2>
        <p v-if="section.subHeading" class="mt-3 text-sm text-gray-400 md:text-base">
          {{ section.subHeading }}
        </p>
      </header>

      <div class="mt-8 grid gap-4 md:mt-12 lg:grid-cols-5 lg:gap-6">
        <div class="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          <a-card
            v-for="item in section.strengths"
            :key="item.title"
            size="small"
            class="reveal strength-card"
          >
            <div class="flex items-start gap-3">
              <div class="icon-box">
                <component :is="item.icon || 'icon-star'" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900">{{ item.title }}</h3>
                <p class="mt-1 text-xs leading-relaxed text-gray-500 md:text-sm">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </a-card>
        </div>

        <a-card title="核心技能熟练度" size="small" class="reveal reveal-d2 lg:col-span-2">
          <div class="space-y-5">
            <div v-for="skill in section.skills" :key="skill.name">
              <div class="mb-1.5 flex items-center justify-between">
                <span class="flex items-center gap-2 text-sm text-gray-700">
                  {{ skill.name }}
                  <a-tag
                    v-for="t in skill.tags ?? []"
                    :key="t"
                    size="small"
                    class="brand-tag"
                  >{{ t }}</a-tag>
                </span>
                <span class="text-xs font-semibold text-brand-500">{{ skill.percent }}%</span>
              </div>
              <a-progress :percent="skill.percent / 100" :show-text="false" color="#F25516" />
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>
