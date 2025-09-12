import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import {qiankunWindow} from 'vite-plugin-qiankun/dist/helper'

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd())
  const {VITE_BASE = '', VITE_PORT, VITE_API_FILE_URL} = env
  return {
    // base: '',
    // base: "",
    // base: qiankunWindow.__POWERED_BY_QIANKUN__?'/pptist/':"/",
    // base: "/",
    base: VITE_BASE,
    plugins: [
      vue(),
      qiankun('pptist', {
        useDevMode: true, // 开发模式
      }),
    ],
    server: {
      // host: '127.0.0.1',
      host: true,
      port: VITE_PORT,
      origin: `http://localhost:${VITE_PORT}`,
      proxy: {
        '/pptist/api': {
          target: 'https://server.pptist.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pptist\/api/, ''),
        },
        '/assets/2': {
          target: VITE_API_FILE_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/pptfile/, ''),
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import '@/assets/styles/variable.scss';
            @import '@/assets/styles/mixin.scss';
          `
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
