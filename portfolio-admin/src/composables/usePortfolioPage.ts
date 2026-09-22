import { onMounted, onActivated, ref } from 'vue'
import { fetchPortfolio, savePortfolio } from '@/api/portfolio'
import type { PortfolioData } from '@/types/portfolio'

/**
 * 管理页面通用数据加载 + 保存 Hook
 *
 * 关键点：
 * 1. 页面被 <keep-alive> 缓存，切换回来时 onMounted 不会重跑，
 *    因此用 onActivated 重新拉取最新数据，避免 data.value 陈旧。
 * 2. 保存前先从服务端拉取最新全量数据，再把本页修改叠加上去，
 *    彻底避免"保存 A 模块把 B 模块覆盖回旧值"的问题。
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
      // 先取服务端最新全量数据，再叠加本页修改，防止陈旧字段覆盖
      const latest = (await fetchPortfolio()) as PortfolioData
      const merged = { ...latest, ...next }
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
  onActivated(load)
  return { data, loading, error, saving, load, save }
}
