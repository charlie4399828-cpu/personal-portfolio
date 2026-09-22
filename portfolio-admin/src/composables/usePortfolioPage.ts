import { onMounted, ref } from 'vue'
import { fetchPortfolio, savePortfolio } from '@/api/portfolio'
import type { PortfolioData } from '@/types/portfolio'

/**
 * 管理页面通用数据加载 + 保存 Hook
 * 每个页面加载后从完整 portfolioData 中取自己关心的字段
 */
export function usePortfolioPage() {
  const data = ref<PortfolioData | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const saving = ref(false)

  async function load() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchPortfolio()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '数据加载失败'
    } finally {
      loading.value = false
    }
  }

  async function save(next: Partial<PortfolioData>) {
    saving.value = true
    try {
      const merged = { ...(data.value as PortfolioData), ...next }
      await savePortfolio(merged)
      data.value = merged
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : '保存失败'
      return false
    } finally {
      saving.value = false
    }
  }

  onMounted(load)
  return { data, loading, error, saving, load, save }
}
