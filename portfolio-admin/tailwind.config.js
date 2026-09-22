/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
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
