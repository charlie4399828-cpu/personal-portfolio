module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  ignorePatterns: ['dist', 'node_modules', '*.cjs', '*.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off'
  }
}
