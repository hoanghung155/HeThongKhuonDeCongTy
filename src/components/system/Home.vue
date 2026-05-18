<!-- src/components/system/Home.vue -->
<template>
  <div class="home-container">
    <!-- 頂部導航欄 -->
    <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" background-color="#84acc7"
      text-color="#ffffff" active-text-color="#fce3b6">
      <el-menu-item index="home-title" disabled>MES 系統</el-menu-item>

      <!-- 遞歸菜單組件 -->
      <recursive-menu :menu-list="menus" :parent-id="null" :visible-ids="visibleMenuIds" @add-tab="handleAddTab" />
    </el-menu>

    <!-- 右上角登錄/登出按鈕 -->
    <div class="auth-btn-wrapper">
      <el-button :type="isLogin ? 'danger' : 'primary'" round @click="toggleAuth">
        {{ isLogin ? 'Logout' : 'Login' }}
      </el-button>
    </div>

    <!-- 標籤頁區域 -->
    <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
      <el-tab-pane v-for="tab in editableTabs" :key="tab.name" :label="tab.title" :name="tab.name">
        <div class="tab-content-wrapper">
          <transition mode="out-in">
            <!-- 動態組件渲染 -->
            <component :is="tab.component" v-if="tab.component" />
          </transition>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw, shallowRef } from 'vue'
import { useMainStore } from '../../assets/js/store.ts'
import { useRouter } from 'vue-router'
import { getCookie, delCookie } from '../../assets/js/cookie'
import RecursiveMenu from './RecursiveMenu.vue'

// ================= 類型定義 =================
interface MenuItem {
  id: number
  name: string
  dis: number
  dis2: number | null
  path: string
  component: string
}

interface TabItem {
  title: string
  name: string
  component: any
}

// ================= 常量配置 =================
const CONFIG = {
  IDLE_TIMEOUT: 60 * 60 * 1000, // 60 分鐘無操作超時
  CHECK_INTERVAL: 60 * 1000,    // 每 1 分鐘檢查一次
  DEFAULT_TAB_NAME: 'report'
}

// ================= 依賴注入 =================
const store = useMainStore()
const router = useRouter()

// ================= 響應式狀態 =================
const activeMenu = ref('')
const tabIndex = ref(1)
const isLogin = ref(false)
const lastActiveTime = ref(Date.now())
let idleTimer: number | null = null

// 組件緩存 (避免重複加載)
const componentCache = shallowRef<Record<string, any>>({})

// 🔥 關鍵修復：添加類型斷言，告訴 TS 每個模塊都有 default 屬性
// 這樣訪問 module.default 時就不會報錯 "類型 '{}' 上不存在屬性 'default'"
const componentModules = import.meta.glob('/src/components/**/*.vue', {
  eager: true
}) as Record<string, { default: any }>

// ================= 計算屬性 (Computed) =================

// 1. 獲取菜單列表 (來自 Vuex)，具有響應式
const menus = computed<MenuItem[]>(() => store.userMenulist || [])

// 2. 計算可見的菜單 ID 列表 (用於權限控制)
const visibleMenuIds = computed(() =>
  menus.value.map(item => item.dis2).filter((id): id is number => id !== null)
)

// 3. 判斷是否超時
const isTimeout = computed(() =>
  Date.now() - lastActiveTime.value > CONFIG.IDLE_TIMEOUT
)

// ================= 標籤頁數據 =================
const editableTabsValue = ref(CONFIG.DEFAULT_TAB_NAME)
const editableTabs = ref<TabItem[]>([{
  title: 'MES 系統',
  name: CONFIG.DEFAULT_TAB_NAME,
  component: 'report' // 初始佔位，實際會在首次切換時加載具體組件
}])

// ================= 核心方法 =================

/** 重置用戶狀態 (登出邏輯) */
const resetUserState = () => {
  delCookie('username')
  store.newUserMenulist([])
  store.newToken('')
  if (idleTimer) {
    clearInterval(idleTimer)
    idleTimer = null
  }
  router.push('/Login')
}

/** 處理添加標籤頁 (由子組件觸發) */
const handleAddTab = (item: MenuItem) => {
  // 懶加載組件
  if (!componentCache.value[item.component]) {
    // 構造路徑鍵值，需與 glob 模式匹配
    const pathKey = `/src/components/${item.path}.vue`
    const module = componentModules[pathKey]

    if (module && module.default) {
      // 使用 markRaw 避免將組件選項對象轉換為響應式代理，提升性能
      componentCache.value[item.component] = markRaw(module.default)
    } else {
      console.error(`組件加載失敗：找不到路徑 ${pathKey}`)
      return
    }
  }

  const newTabName = `${++tabIndex.value}`
  editableTabs.value.push({
    title: item.name,
    name: newTabName,
    component: componentCache.value[item.component]
  })

  editableTabsValue.value = newTabName
  activeMenu.value = item.id.toString()
}

/** 關閉標籤頁 */
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value

  if (activeName === targetName) {
    const currentIndex = tabs.findIndex(tab => tab.name === targetName)
    const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1]
    if (nextTab) {
      activeName = nextTab.name
    }
  }

  editableTabs.value = tabs.filter(tab => tab.name !== targetName)
  editableTabsValue.value = activeName
}

/** 更新活躍時間 */
const updateActiveTime = () => {
  lastActiveTime.value = Date.now()
}

/** 啟動空閒檢測 */
const startIdleMonitor = () => {
  idleTimer = window.setInterval(() => {
    if (isLogin.value && isTimeout.value) {
      resetUserState()
    }
  }, CONFIG.CHECK_INTERVAL)
}

/** 切換登錄狀態 */
const toggleAuth = () => {
  isLogin.value ? resetUserState() : router.push('')
}

// ================= 生命週期鉤子 =================

onMounted(() => {
  // 初始化登錄狀態
  isLogin.value = !!getCookie('username')

  if (!isLogin.value) {
    router.push('')
    return
  }

  // 綁定用戶活動事件 (使用 passive 提升滾動/觸摸性能)
  const events = ['mousemove', 'touchmove', 'click', 'keydown']
  events.forEach(event =>
    window.addEventListener(event, updateActiveTime, { passive: true })
  )

  // 啟動超時監控
  startIdleMonitor()
})

onUnmounted(() => {
  // 清理事件監聽
  const events = ['mousemove', 'touchmove', 'click', 'keydown']
  events.forEach(event =>
    window.removeEventListener(event, updateActiveTime)
  )

  // 清理定時器
  if (idleTimer) {
    clearInterval(idleTimer)
    idleTimer = null
  }
})
</script>

<style scoped>
.home-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.auth-btn-wrapper {
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 1000;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.auth-btn-wrapper:hover {
  opacity: 1;
}

.tab-content-wrapper {
  height: calc(100vh - 100px);
  position: relative;
  overflow: auto; 
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;
}

/* 深度選擇器修改 Element Plus 樣式 */
:deep(.el-menu.el-menu--horizontal) {
  max-height: 46px;
  border-bottom: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  max-height: 46px;
  line-height: 46px;
  padding: 0 16px;
  font-weight: 500;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.el-tabs__item) {
  max-height: 36px;
  font-size: 13px;
  padding: 0 20px;
}

:deep(.el-tabs__content) {
  height: 100%;
}
</style>