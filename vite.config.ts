import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 使用相对路径，保证产物可部署在 GitHub/Gitee Pages 的任意子路径下
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1024,
    // 手动分包：控制单包体积，提升首屏加载速度
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          arco: ['@arco-design/web-vue'],
          fullpage: ['fullpage.js', 'vue-fullpage.js'],
          axios: ['axios']
        }
      }
    }
  }
})
