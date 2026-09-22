<script setup lang="ts">
import type { Profile } from '@/types/portfolio'

defineProps<{ profile: Profile }>()
</script>

<template>
  <div class="section-shell hero-bg">
    <div class="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      <a-avatar :size="112" class="reveal shadow-xl ring-4 ring-white">
        <img :src="profile.avatar" :alt="profile.name" />
      </a-avatar>

      <h1 class="reveal reveal-d1 mt-6 text-3xl font-bold tracking-wide text-gray-900 md:text-5xl">
        {{ profile.name }}
      </h1>

      <p class="reveal reveal-d2 mt-3 text-base font-semibold text-brand-500 md:text-xl">
        {{ profile.title }}
        <span v-if="profile.location" class="ml-2 text-sm font-normal text-gray-400">
          · {{ profile.location }}
        </span>
      </p>

      <div class="reveal reveal-d2 mt-4 flex flex-wrap justify-center gap-2">
        <a-tag v-for="tag in profile.tags" :key="tag" size="medium" class="brand-tag">
          {{ tag }}
        </a-tag>
      </div>

      <p class="reveal reveal-d3 mt-6 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
        {{ profile.intro }}
      </p>

      <div
        v-if="(profile.highlightMetrics ?? []).length"
        class="reveal reveal-d4 mt-10 grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
      >
        <a-card
          v-for="metric in profile.highlightMetrics ?? []"
          :key="metric.label"
          size="small"
          class="metric-card"
        >
          <div class="text-xl font-bold text-brand-500 md:text-2xl">{{ metric.value }}</div>
          <div class="mt-1 text-xs text-gray-400">{{ metric.label }}</div>
        </a-card>
      </div>

      <div class="reveal reveal-d4 mt-12 flex items-center gap-1.5 text-xs text-gray-400">
        <icon-arrow-down class="animate-bounce text-brand-400" />
        <span>滑动探索更多</span>
      </div>
    </div>
  </div>
</template>
