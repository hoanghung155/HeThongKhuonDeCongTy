import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import router from './assets/js/router'
import axios from './assets/js/index'

async function updateBaseURL() {
  try {
    const response = await fetch('/config.json')
    const config = await response.json()
    axios.defaults.baseURL = config.baseURL
  } catch (error) {
    console.error('Failed to update Base URL:', error)
  }
}

import { VxeUI, VxeAlert, VxeTooltip, VxeIcon, VxeIconPicker, VxePager, VxeLoading } from 'vxe-pc-ui'
import { VxeTable, VxeColumn, VxeColgroup, VxeToolbar } from 'vxe-table'
import 'vxe-table/styles/cssvar.scss'
import 'vxe-pc-ui/styles/cssvar.scss'

import zhCN from 'vxe-pc-ui/lib/language/zh-CN'

VxeUI.setI18n('zh-CN', zhCN)
VxeUI.setLanguage('zh-CN')

import VxeUIPluginRenderElement from '@vxe-ui/plugin-render-element'
import '@vxe-ui/plugin-render-element/dist/style.css'
VxeUI.use(VxeUIPluginRenderElement)

import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx'
import ExcelJS from 'exceljs'
VxeUI.use(VxeUIPluginExportXLSX, {
  ExcelJS
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyVxeUI(app: any) {
  app.use(VxeAlert),
    app.use(VxeTooltip),
    app.use(VxeIcon),
    app.use(VxeIconPicker),
    app.use(VxePager),
    app.use(VxeLoading)
}
function lazyVxeTable(app: any) {
  app.use(VxeTable),
    app.use(VxeColumn),
    app.use(VxeColgroup),
    app.use(VxeToolbar)
}

const app = createApp(App)
app.use(ElementPlus, { size: 'default', zIndex: 3000 })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(lazyVxeUI)
app.use(lazyVxeTable)

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  SingleAxisComponent,
  DataZoomComponent,
  MarkLineComponent
} from 'echarts/components'
import {
  PieChart,
  BarChart,
  HeatmapChart,
  ScatterChart,
  LineChart,
  GaugeChart
} from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  PieChart,
  BarChart,
  LineChart,
  GaugeChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
  HeatmapChart,
  SingleAxisComponent,
  DataZoomComponent,
  MarkLineComponent,
  ScatterChart
])
app.config.globalProperties.$echarts = echarts

updateBaseURL().then(() => {
  app.mount('#app');
})