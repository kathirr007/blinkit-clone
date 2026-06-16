import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,

  stylistic: {
    quotes: 'single',
    semi: false,
  },

  ignores: [
    'node_modules',
    'dist',
    '.output',
    '.nuxt',
    '.nitro',
    'apps/api/prisma/migrations',
  ],

  rules: {
    'no-console': 'warn',
    'ts/consistent-type-imports': 'off',
    'node/prefer-global/process': 'off',
    'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'ts/no-explicit-any': 'off',
    'antfu/if-newline': 'off',
  },
})
