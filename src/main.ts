import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/font.scss'

import Icon from '@/plugins/icon'
import Directive from '@/plugins/directive'

import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun/dist/helper'
import QianKunStore from './qiankun'
import './public-path'

/* const app = createApp(App)
app.use(Icon)
app.use(Directive)
app.use(createPinia())
app.mount('#app-pptist') */

function isNotEmptyObject(obj:object) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0
}

let app:any = null
function render(props = {} as any) {
  const {container } = props
  app = createApp(App)
  app.use(Icon)
  app.use(Directive)
  app.use(createPinia())
  if (isNotEmptyObject(props)) {
    app.config.globalProperties.$qiankun = new QianKunStore(props)
  }
  /* 关键：ShadowDOM 模式下必须在 container 里找挂载点 */
  const mountPoint = container
    ? container.querySelector('#app-pptist') // ShadowRoot 内部
    : document.getElementById('app-pptist') // 独立运行兜底

  if (!mountPoint) {
    console.error('[pptist] 找不到 #app-pptist 挂载点')
    return
  }
  // app.mount('#app-pptist')
  app.mount(mountPoint)

}


// 独立运行时直接渲染
if (!qiankunWindow.__POWERED_BY_QIANKUN__) { // window.proxy
  render()
}
else {
  renderWithQiankun({ // window.moudleQiankunAppLifeCycles
    mount(props) {
      console.log('qiankun pptist mounted')
      render(props)
    },
    bootstrap() {
      console.log('qiankun pptist bootstrap')
    },
    update(props) {},
    unmount() {
      app?.unmount()
      app = null
    },
  })
}