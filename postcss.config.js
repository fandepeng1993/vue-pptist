// postcss.config.js  (ESM)
import prefixer from 'postcss-prefix-selector'

export default {
  plugins: [
    prefixer({
      prefix: '.app-pptist',
       // 函数返回 true 就跳过
      exclude: [/^.first-screen-loading/],
      transform(prefix, selector) {
        if (selector === 'html') return `html`
        if (selector === 'body') return `body`
        // if (selector === 'body') return `body${prefix}`
        return `${prefix} ${selector}`
      }
    })
  ]
}