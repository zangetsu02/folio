import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  ignores: ['docs/**'],
  rules: {
    'node/prefer-global/process': 'off',
  },
})
