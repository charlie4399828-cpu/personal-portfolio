<script setup lang="ts">
import type { ContactInfo } from '@/types/portfolio'

defineProps<{ contact: ContactInfo }>()
</script>

<template>
  <div class="section-shell">
    <div class="mx-auto flex w-full max-w-3xl flex-col items-center text-center text-white">
      <p class="reveal section-eyebrow !text-brand-300">Contact</p>
      <h2 class="reveal text-2xl font-bold md:text-4xl">保持联系</h2>
      <p class="reveal reveal-d1 mt-4 max-w-xl text-sm leading-relaxed text-white/60">
        无论是电商项目合作、技术交流还是开源共建，欢迎随时与我联系。
      </p>

      <div class="reveal reveal-d2 mt-8 flex flex-wrap items-center justify-center gap-3">
        <a v-if="contact.email" :href="`mailto:${contact.email}`" class="contact-chip">
          <icon-email /> {{ contact.email }}
        </a>
        <span v-if="contact.wechat" class="contact-chip">
          <icon-message /> 微信：{{ contact.wechat }}
        </span>
        <span v-if="contact.phone" class="contact-chip"> <icon-phone /> {{ contact.phone }} </span>
      </div>

      <div class="reveal reveal-d3 mt-6 flex flex-wrap justify-center gap-3">
        <a-button
          v-for="social in contact.socials"
          :key="social.label"
          :href="social.url"
          target="_blank"
          size="small"
          class="social-btn"
        >
          <template #icon>
            <component :is="social.icon || 'icon-link'" />
          </template>
          {{ social.label }}
        </a-button>
      </div>

      <a
        v-if="contact.openSourceUrl"
        :href="contact.openSourceUrl"
        target="_blank"
        class="reveal reveal-d3 mt-8 inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-brand-300"
      >
        <icon-github /> 本站已开源 · 数据接口驱动渲染
      </a>

      <div
        class="reveal reveal-d4 mt-10 w-full border-t border-white/10 pt-5 text-xs text-white/40"
      >
        <p>{{ contact.copyright }}</p>
        <p v-if="contact.icp" class="mt-1">{{ contact.icp }}</p>
      </div>
    </div>
  </div>
</template>
