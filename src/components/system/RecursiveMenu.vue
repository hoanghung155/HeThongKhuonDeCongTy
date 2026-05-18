<!-- src/components/system/RecursiveMenu.vue -->
<template>
  <template v-for="item in visibleItems" :key="item.id">
    <!-- 判斷：如果有子節點，渲染子菜單 -->
    <el-sub-menu v-if="hasChildren(item)" :index="item.id.toString()">
      <template #title>
        {{ item.name }}
      </template>
      
      <!-- 🔥 關鍵：遞歸調用自己，將當前項目的 dis2 作為下一層的 parentId -->
      <recursive-menu 
        :menu-list="menuList" 
        :parent-id="item.dis2" 
        :visible-ids="visibleIds"
        @add-tab="$emit('add-tab', $event)"
      />
    </el-sub-menu>

    <!-- 如果沒有子節點，渲染普通菜單項 -->
    <el-menu-item v-else :index="item.id.toString()" @click="handleClick(item)">
      {{ item.name }}
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 定義接口
interface MenuItem {
  id: number
  name: string
  dis: number
  dis2: number | null
  path: string
  component: string
}

// 定義 Props
const props = defineProps<{
  menuList: MenuItem[]
  parentId: number | null // null 代表根節點
  visibleIds: number[]   // 控制哪些菜單可見
}>()

// 定義 Emits
const emit = defineEmits<{
  (e: 'add-tab', item: MenuItem): void
}>()

// 🔥 核心邏輯：使用 computed 動態過濾當前層級的可見菜單
// 當 menuList 或 visibleIds 變化時，visibleItems 會自動重新計算
const visibleItems = computed(() => {
  return props.menuList.filter(item => {
    // 1. 如果是根層級 (parentId === null)，找 dis === 0 的項
    if (props.parentId === null) {
      return item.dis === 0 && props.visibleIds.includes(item.dis2!)
    }
    // 2. 如果是子層級，找 dis === parentId 的項，且其子節點在可見列表中
    return item.dis === props.parentId && props.visibleIds.includes(item.dis2!)
  })
})

// 輔助函數：判斷是否有子菜單
const hasChildren = (item: MenuItem) => {
  return props.menuList.some(
    child => child.dis === item.dis2 && props.visibleIds.includes(child.dis2!)
  )
}

// 處理點擊
const handleClick = (item: MenuItem) => {
  emit('add-tab', item)
}
</script>