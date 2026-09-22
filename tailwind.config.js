/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      // 品牌色：电商橙，与 Arco 主题变量保持一致（见 src/styles/index.css）
      colors: {
        brand: {
          50: '#FFF7E8',
          100: '#FFE9D2',
          200: '#FFD3AC',
          300: '#FFB578',
          400: '#FF9049',
          500: '#F25516',
          600: '#C73E0E',
          700: '#9C300E'
        }
      }
    }
  },
  plugins: []
}
