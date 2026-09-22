import { onMounted, ref } from 'vue'
import { fetchPortfolioData } from '@/api/portfolio'
import type { PortfolioData } from '@/types/portfolio'

/** 站点内容加载：统一暴露 数据 / 加载中 / 错误 / 重试 */
export function usePortfolioData() {
  const data = ref<PortfolioData | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchPortfolioData()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '内容加载失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { data, loading, error, reload: load }
}
