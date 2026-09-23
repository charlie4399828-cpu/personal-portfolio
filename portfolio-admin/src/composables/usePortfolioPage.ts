import { onMounted, ref } from 'vue'
import { fetchPortfolio, savePortfolio } from '@/api/portfolio'
import type { PortfolioData } from '@/types/portfolio'

/**
 * 模块级共享状态：所有管理页面共用同一份数据。
 * 解决 keep-alive 缓存导致页面间数据不同步的问题：
 * 某页保存后 data 更新，其它被缓存的页面也能通过响应式拿到最新值，
 * 无需在每个页面 onMounted/onActivated 时各自重新拉取。
 */
const sharedData = ref<PortfolioData | null>(null)
const sharedLoading = ref(false)
const sharedError = ref<string | null>(null)
const sharedSaving = ref(false)

/**
 * 管理页面通用数据加载 + 保存 Hook
 * 每个页面加载后从完整 portfolioData 中取自己关心的字段
 */
export function usePortfolioPage() {
  const data = sharedData
  const loading = sharedLoading
  const error = sharedError
  const saving = sharedSaving

  async function load() {
    sharedLoading.value = true
    sharedError.value = null
    try {
      sharedData.value = await fetchPortfolio()
    } catch (e) {
      sharedError.value = e instanceof Error ? e.message : '数据加载失败'
    } finally {
      sharedLoading.value = false
    }
  }

  async function save(next: Partial<PortfolioData>) {
    if (!sharedData.value) return false
    sharedSaving.value = true
    try {
      const merged = { ...sharedData.value, ...next }
      await savePortfolio(merged)
      sharedData.value = merged
      return true
    } catch (e) {
      sharedError.value = e instanceof Error ? e.message : '保存失败'
      return false
    } finally {
      sharedSaving.value = false
    }
  }

  onMounted(() => {
    // 仅在数据为空时首次加载，避免 keep-alive 下重复请求
    if (sharedData.value === null) load()
  })

  return { data, loading, error, saving, load, save }
}
