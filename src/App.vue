<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="数据初始化中，请稍等 ..." v-else  loading :mask="false" />
</template>



<script lang="ts" setup>
import { onMounted, getCurrentInstance, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore, useUserStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from '@/utils/common'
import api from '@/services'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import { urlToFileWithMeta } from './utils/url2file'
import useImport from './hooks/useImport'
import useSlideHandler from './hooks/useSlideHandler'



const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const userStore = useUserStore()
const { databaseId } = storeToRefs(mainStore)
const { slides } = storeToRefs(slidesStore)
const { screening } = storeToRefs(useScreenStore())
const { resetSlides } = useSlideHandler()
const { token } = storeToRefs(userStore)
const instance = getCurrentInstance() as any



const {importPPTXFile} = useImport()

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}
onBeforeUnmount(() => {
  resetSlides()
})

onMounted(async () => {
  // const slides = await api.getMockData('slides')
  // slidesStore.setSlides(slides)
  // console.log(instance.appContext.config.globalProperties.$qiankun.getGlobalState())
  const {urlFileList = []} = instance.appContext.config.globalProperties.$qiankun.getGlobalState()
  // console.log(instance.appContext.config.globalProperties.$qiankun.props.globalState.getState())

  const [fileUrl] = urlFileList as any[]
  if (!fileUrl) return
  // const releaseUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_API_FILE_URL
  const file:any = await urlToFileWithMeta(fileUrl.url)
  importPPTXFile([file] as any)



  await deleteDiscardedDB()
  snapshotStore.initSnapshotDatabase()
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('beforeunload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

<style lang="scss">
#app-pptist {
  height: 100%;
}
</style>