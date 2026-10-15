import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  // .superpowers/ e' lo scratch degli esecutori di piano: contiene estratti
  // del piano in markdown, che non sono codice di questo repo.
  ignores: ['docs/**', '.superpowers/**'],
  rules: {
    'node/prefer-global/process': 'off',
  },
}, {
  // Gli slot MDC (#title, #job, #timeline) non sono heading markdown: senza
  // questo, ogni slot viene segnalato come ATX malformato.
  files: ['content/**/*.md'],
  rules: {
    'markdown/no-missing-atx-heading-space': 'off',
  },
})
