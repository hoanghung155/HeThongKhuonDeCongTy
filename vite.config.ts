import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        lazyImport({
            resolvers: [
                VxeResolver({
                    libraryName: 'vxe-table'
                }),
                VxeResolver({
                    libraryName: 'vxe-pc-ui'
                })
            ]
        })
    ],
    resolve: {
        alias: { '@': '/src' }
    },
 base: '/HeThongKhuonDeCongTy/',
    server: {
        port: 8087
    },
    preview: {
        port: 8088
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vue': ['vue', 'vue-router', 'vuex'], 
					'echarts': ['echarts'], 
					'element-plus': ['element-plus'], 
					'vxe-table': ['vxe-table'], 
					'vxe-pc-ui': ['vxe-pc-ui'],
                    'exceljs': ['exceljs'],
                    '@vxe-ui/plugin':['@vxe-ui/plugin-export-xlsx','@vxe-ui/plugin-render-element']
                }
            }
        }
    }
})
