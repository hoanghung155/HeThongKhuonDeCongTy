<template>
  <div class="history-drawer-content">
    <!-- 查詢表單 -->
    <el-form :model="historyQuery" label-position="top" size="default" class="query-form">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="模具編號">
            <el-input
              v-model="historyQuery.moldCode"
              placeholder="請輸入模具編號 (預演可直接點擊查詢)"
              clearable
              @keyup.enter="handleQueryInventory"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="開始日期">
            <el-date-picker
              v-model="historyQuery.startDate"
              type="date"
              placeholder="選擇開始日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledStartDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="結束日期">
            <el-date-picker
              v-model="historyQuery.endDate"
              type="date"
              placeholder="選擇結束日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledEndDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="query-btn-col">
          <el-button type="warning" plain round @click="handleQueryInventory" :loading="loading" style="width: 100%;">
            <el-icon><Search /></el-icon>
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 左右分欄：使用 el-row + el-col -->
    <el-row :gutter="12" class="table-container">
      <!-- 🔹 左側：總庫存列表 -->
      <el-col :span="11" class="table-panel left-panel">
        <div class="panel-title">📦 總庫存記錄</div>
        <vxe-table
          ref="InventoryTableRef"
          :loading="loading"
          border
          :auto-resize="true"
          highlight-hover-row
          highlight-current-row
          resizable
          show-overflow
          :height="tableHeight * 0.58"
          :data="inventoryList"
          :row-config="{ isCurrent: true, isHover: true, keyField: 'id' }"
          @current-change="handleInventorySelect"
          class="history-table"
        >
          <vxe-column type="seq" title="#" width="40"></vxe-column>
          <vxe-column field="partName" title="類型" min-width="65"></vxe-column>
          <vxe-column field="moldCode" title="模具編號" min-width="85"></vxe-column>
          <vxe-column field="moldName" title="鞋名" min-width="100"></vxe-column>
          <vxe-column field="moldType" title="部件" min-width="65"></vxe-column>
          <vxe-column field="size" title="Size" min-width="60" align="center"></vxe-column>
          <vxe-column field="totalQty" title="庫存" min-width="50" align="right"
            :cell-style="{ fontWeight: 'bold', color: '#8B5A2B' }">
          </vxe-column>
          <vxe-column field="warehouse" title="倉庫" min-width="70"></vxe-column>
          <vxe-column field="lastUpdateTime" title="更新" min-width="100"></vxe-column>
        </vxe-table>
        <div class="panel-footer">共 {{ inventoryTotal }} 條 · 點擊查看明細</div>
      </el-col>

      <!-- 🔹 右側：進出明細列表 -->
      <el-col :span="13" class="table-panel right-panel">
        <div class="panel-title header-with-tag">
          <span>📋 進出明細</span>
          <el-tag 
            v-if="selectedInventory"
            size="small" 
            effect="plain"
            style="border-color: #D4C4B0; color: #6B4423;"
          >
            {{ selectedInventory.moldCode }} | {{ selectedInventory.size }}
          </el-tag>
        </div>
        
        <vxe-table
          ref="DetailTableRef"
          :loading="detailLoading"
          border
          :auto-resize="true"
          highlight-hover-row
          resizable
          show-overflow
          :height="tableHeight * 0.58"
          :data="detailList"
          :row-config="{ isHover: true, keyField: 'id' }"
          class="history-table"
        >
          <vxe-column type="seq" title="#" width="35"></vxe-column>
          <vxe-column field="recordNo" title="單號" min-width="95"></vxe-column>
          <vxe-column field="type" title="類型" min-width="60" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="row.EntryExitType === 1 ? 'success' : 'warning'" 
                size="small" 
                effect="plain"
                style="border-width: 1px; font-size: 12px;"
              >
                {{ row.EntryExitType === 1 ? '入庫' : '出庫' }}
              </el-tag>
            </template>
          </vxe-column>
          <vxe-column field="qty" title="數量" min-width="50" align="right"></vxe-column>
          <vxe-column field="warehouse" title="倉庫" min-width="65"></vxe-column>
          <vxe-column field="location" title="庫位" min-width="65"></vxe-column>
          <vxe-column field="operator" title="操作人" min-width="65"></vxe-column>
          <vxe-column field="operateTime" title="時間" min-width="110"></vxe-column>
        </vxe-table>
        
        <div class="panel-footer footer-flex">
          <span>共 {{ detailTotal }} 條明細</span>
          <el-button 
            v-if="selectedInventory" 
            @click="handleQueryDetail" 
            size="small" 
            link 
            style="color: #8B5A2B; padding: 0;"
          >
            🔁 刷新
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { VxeTableInstance } from 'vxe-table'
import axios from '../../assets/js/index'
import { handleError } from '../../assets/js/httpErrorHandler'

// ==================== ️ 預演模式開關 ====================
const DEMO_MODE = true // ✅ 設為 true 使用模擬數據，設為 false 切換為真實接口

const props = defineProps<{
  tableHeight: number
  loading: boolean
}>()

// ==================== 📦 響應式狀態 ====================
const InventoryTableRef = ref<VxeTableInstance | null>(null)
const DetailTableRef = ref<VxeTableInstance | null>(null)

const historyQuery = reactive({
  moldCode: null as string | null,
  startDate: null as string | null,
  endDate: null as string | null,
})

const inventoryList = ref<any[]>([])
const inventoryTotal = ref(0)
const detailList = ref<any[]>([])
const detailTotal = ref(0)
const detailLoading = ref(false)
const selectedInventory = ref<any>(null)

// ==================== 📦 預演數據生成 ====================
const MOCK_INVENTORY = [
  { id: 1, moldCode: '11-015-M-MID', moldName: 'Cloud Spike 1500m', partName: '楦頭', size: '7#', totalQty: 150, warehouse: '楦頭倉', lastUpdateTime: '2026-04-20 14:30', _raw: { moldCode: '11-015-M-MID', partCode: 'PART-001', size: '7#', warehouseId: 1, locationId: 101 } },
  { id: 2, moldCode: '11-015-M-MID2', moldName: 'Cloud Spike 1500m', partName: '楦頭', size: '8#', totalQty: 150, warehouse: '楦頭倉', lastUpdateTime: '2026-04-20 14:30', _raw: { moldCode: '11-015-M-MID', partCode: 'PART-001', size: '8#', warehouseId: 1, locationId: 101 } },
  { id: 3, moldCode: '11-015-M-MID3', moldName: 'Cloud Spike 1500m', partName: '楦頭', size: '9#', totalQty: 150, warehouse: '楦頭倉', lastUpdateTime: '2026-04-20 14:30', _raw: { moldCode: '11-015-M-MID', partCode: 'PART-001', size: '9#', warehouseId: 1, locationId: 101 } },
  { id: 4, moldCode: '11-015-M-MID4', moldName: 'Cloud Spike 1500m', partName: '楦頭', size: '10#', totalQty: 150, warehouse: '楦頭倉', lastUpdateTime: '2026-04-20 14:30', _raw: { moldCode: '11-015-M-MID', partCode: 'PART-001', size: '10#', warehouseId: 1, locationId: 101 } }
]

const MOCK_DETAILS: Record<string, any[]> = {
  '11-015-002': [
    { id: 1, recordNo: 'IN-20240420-001', EntryExitType: 1, qty: 50, warehouse: '刀模房', location: 'A-01-01', operator: '054524', operateTime: '2026-04-20 14:30' },
    { id: 2, recordNo: 'OUT-20240419-003', EntryExitType: 2, qty: 20, warehouse: '刀模房', location: 'A-01-01', operator: '854214', operateTime: '2026-04-19 16:20' },
    { id: 3, recordNo: 'IN-20240418-002', EntryExitType: 1, qty: 100, warehouse: '刀模房', location: 'A-01-02', operator: '074323', operateTime: '2026-04-18 09:45' }
  ],
  '11-015-M-MID': [
    { id: 4, recordNo: 'IN-20240419-001', EntryExitType: 1, qty: 30, warehouse: '楦頭倉', location: 'B-02-01', operator: '864524', operateTime: '2026-03-10 10:00' },
    { id: 5, recordNo: 'OUT-20240418-001', EntryExitType: 2, qty: -30, warehouse: '楦頭倉', location: 'B-02-01', operator: '754254', operateTime: '2026-03-13 15:30' },
    { id: 4, recordNo: 'IN-20240419-001', EntryExitType: 1, qty: 15, warehouse: '楦頭倉', location: 'B-02-01', operator: '864524', operateTime: '2026-04-15 10:00' },
    { id: 5, recordNo: 'OUT-20240418-001', EntryExitType: 2, qty: -15, warehouse: '楦頭倉', location: 'B-02-01', operator: '754254', operateTime: '2026-04-18 15:30' }
  ],
  '11-015-003': [
    { id: 6, recordNo: 'IN-20240417-001', EntryExitType: 1, qty: 120, warehouse: '刀模房', location: 'A-03-01', operator: '715624', operateTime: '2026-04-17 08:20' },
    { id: 7, recordNo: 'OUT-20240416-002', EntryExitType: 2, qty: 45, warehouse: '刀模房', location: 'A-03-01', operator: '824254', operateTime: '2026-04-16 17:10' }
  ]
}

// ==================== 🔄 日期限制 ====================
const disabledStartDate = (date: Date) => {
  if (historyQuery.endDate) return date.getTime() > new Date(historyQuery.endDate).getTime()
  return false
}
const disabledEndDate = (date: Date) => {
  if (historyQuery.startDate) return date.getTime() < new Date(historyQuery.startDate).getTime()
  return false
}

// ==================== 🔄 查詢總庫存 ====================
const handleQueryInventory = async () => {
  if (!historyQuery.moldCode && !historyQuery.startDate && !historyQuery.endDate) {
    ElMessage.warning('請至少填寫一項查詢條件')
    return
  }
  
  try {
    if (DEMO_MODE) {
      // ✅ 預演模式：模擬網絡延遲與數據過濾
      await new Promise(resolve => setTimeout(resolve, 600))
      let list = [...MOCK_INVENTORY]
      if (historyQuery.moldCode) {
        list = list.filter(item => item.moldCode.toLowerCase().includes(historyQuery.moldCode!.toLowerCase()))
      }
      inventoryList.value = list
      inventoryTotal.value = list.length
      if (list.length > 0) handleInventorySelect({ row: list[0] })
      else { detailList.value = []; detailTotal.value = 0; selectedInventory.value = null }
      ElMessage.success(`查詢到 ${list.length} 條庫存記錄`)
      return
    }

    // 🌐 真實接口模式
    const res = await axios.post('/v1/warehouse/inventory/list', {
      moldCode: historyQuery.moldCode,
      startDate: historyQuery.startDate,
      endDate: historyQuery.endDate,
      pageNum: 1,
      pageSize: 100
    })
    if (res.data.infos === 0) {
      inventoryList.value = []; inventoryTotal.value = 0; selectedInventory.value = null; detailList.value = []; return
    }
    const list = res.data.data?.list || res.data.data || []
    inventoryList.value = list.map((item: any, idx: number) => ({
      id: item.id || Date.now() + idx,
      moldCode: item.moldCode || item.moldNo || '-',
      moldName: item.moldName || '-',
      partName: item.partName || '-',
      size: item.size || '-',
      totalQty: item.totalQty || item.qty || 0,
      warehouse: item.warehouse || '-',
      lastUpdateTime: item.updateTime || item.inboundTime || '-',
      _raw: { moldCode: item.moldCode, partCode: item.partCode, size: item.size, warehouseId: item.warehouseId, locationId: item.locationId }
    }))
    inventoryTotal.value = res.data.total || list.length
    if (inventoryList.value.length > 0) handleInventorySelect({ row: inventoryList.value[0] })
  } catch (error) {
    handleError(error, '庫存查詢失敗')
  }
}

// ==================== 🔄 選中庫存，加載明細 ====================
const handleInventorySelect = async ({ row }: { row: any }) => {
  selectedInventory.value = row
  await handleQueryDetail()
}

// ==================== 🔄 查詢進出明細 ====================
const handleQueryDetail = async () => {
  if (!selectedInventory.value) return
  detailLoading.value = true
  try {
    if (DEMO_MODE) {
      // ✅ 預演模式：模擬延遲與關聯數據
      await new Promise(resolve => setTimeout(resolve, 400))
      const details = MOCK_DETAILS[selectedInventory.value.moldCode] || []
      detailList.value = details
      detailTotal.value = details.length
      return
    }

    // 🌐 真實接口模式
    const { _raw } = selectedInventory.value
    const res = await axios.post('/v1/warehouse/history/detail/query', {
      moldCode: _raw.moldCode, partCode: _raw.partCode, size: _raw.size,
      warehouseId: _raw.warehouseId, locationId: _raw.locationId,
      startDate: historyQuery.startDate, endDate: historyQuery.endDate,
      pageNum: 1, pageSize: 100
    })
    if (res.data.infos === 0) { detailList.value = []; detailTotal.value = 0; return }
    const list = res.data.data?.list || res.data.data || []
    detailList.value = list.map((item: any, idx: number) => ({
      id: item.id || Date.now() + idx,
      recordNo: item.outboundNo || item.inboundNo || item.recordNo || '-',
      EntryExitType: item.EntryExitType || (item.type === 'OUT' ? 2 : 1),
      qty: item.qty || item.changeQty || 0,
      warehouse: item.warehouse || '-',
      location: item.location || '-',
      operator: item.operator || '-',
      operateTime: item.outboundTime || item.inboundTime || item.createTime || '-'
    }))
    detailTotal.value = res.data.total || list.length
  } catch (error) {
    handleError(error, '明細查詢失敗')
  } finally {
    detailLoading.value = false
  }
}

// ==================== 🔄 生命週期 ====================
onMounted(() => {
  if (DEMO_MODE) {
    // 預演模式自動加載初始數據
    historyQuery.moldCode = '11-015'
    handleQueryInventory()
  }
})
</script>

<style scoped>
.history-drawer-content { padding: 0 16px 16px; height: 100%; display: flex; flex-direction: column; }
.query-form { padding-bottom: 12px; border-bottom: 1px solid #E5DDD4; margin-bottom: 8px; }
.query-btn-col { display: flex; align-items: flex-end; padding-bottom: 4px; }
.table-container { flex: 1; overflow: hidden; }
.table-panel { display: flex; flex-direction: column; height: 100%; }
.left-panel { padding-right: 6px; }
.right-panel { padding-left: 6px; border-left: 1px solid #E5DDD4; }
.panel-title { font-weight: bold; color: #6B4423; padding: 8px 4px; font-size: 14px; border-bottom: 1px solid #E5DDD4; margin-bottom: 8px; }
.header-with-tag { display: flex; justify-content: space-between; align-items: center; }
.history-table :deep(.vxe-table) { --vxe-table-header-background-color: #FEFCF9; --vxe-table-header-font-color: #6B4423; --vxe-table-border-color: #E5DDD4; }
.history-table :deep(.vxe-table--body) { font-size: 13px; }
.history-table :deep(.vxe-table--row--hover), .history-table :deep(.vxe-table--row--current) { background-color: #FBF8F4 !important; }
.panel-footer { padding: 8px 4px 0; font-size: 12px; color: #8B7355; text-align: center; }
.footer-flex { display: flex; justify-content: space-between; align-items: center; }
</style>
