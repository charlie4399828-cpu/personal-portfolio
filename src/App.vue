<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioData } from '@/composables/usePortfolioData'
import SectionHero from '@/components/SectionHero.vue'
import SectionStrengths from '@/components/SectionStrengths.vue'
import SectionProjects from '@/components/SectionProjects.vue'
import SectionWorks from '@/components/SectionWorks.vue'
import SectionFooter from '@/components/SectionFooter.vue'

const { data, loading, error, reload } = usePortfolioData()

// 作品案例模块可见性：后台 settings.worksVisible 控制，默认隐藏
const worksVisible = computed(() => data.value?.settings?.worksVisible === true)

// fullpage.js 配置：右侧圆点导航 + 平滑滚动 + 屏内溢出滚动（移动端内容超出一屏时可滑动）
// 根据作品模块可见性动态调整导航锚点，保持前后一致
const fpOptions = computed(() => {
  const tooltips = worksVisible.value
    ? ['首页', '优势', '经历', '作品', '联系']
    : ['首页', '优势', '经历', '联系']
  return {
    licenseKey: 'gplv3-license',
    autoScrolling: true,
    scrollingSpeed: 750,
    easingcss3: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: tooltips,
    scrollOverflow: true,
    credits: { enabled: false }
  }
})
</script>

<template>
  <!-- 接口请求中：Arco Loading 兜底 -->
  <div v-if="loading" class="flex h-screen w-full flex-col items-center justify-center gap-4">
    <a-spin :size="36" />
    <p class="text-sm text-gray-400">正在加载作品集内容...</p>
  </div>

  <!-- 接口异常：错误兜底 + 重试 -->
  <div v-else-if="!data" class="flex h-screen w-full items-center justify-center px-6">
    <a-result status="error" title="内容加载失败" :subtitle="error || '未获取到站点数据'">
      <template #extra>
        <a-button type="primary" @click="reload">
          <template #icon><icon-refresh /></template>
          重新加载
        </a-button>
      </template>
    </a-result>
  </div>

  <!-- 全屏滚动主体：一屏一个模块 -->
  <full-page v-else :options="fpOptions">
    <div class="section">
      <SectionHero :profile="data.profile" />
    </div>
    <div class="section section-alt">
      <SectionStrengths :section="data.strengthSection" />
    </div>
    <div class="section">
      <SectionProjects :experiences="data.experiences" />
    </div>
    <div v-if="worksVisible" class="section section-alt">
      <SectionWorks :works="data.works" />
    </div>
    <div class="section section-dark">
      <SectionFooter :contact="data.contact" />
    </div>
  </full-page>
</template>
