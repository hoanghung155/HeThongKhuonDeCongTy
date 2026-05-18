<template>
  <div class="unit-line-container">
    <el-row>
      <el-col :span="24" class="header-section">
        <span class="title-text">单位线别</span>
        <el-button 
          type="info" 
          plain 
          circle 
          class="refresh-btn"
          @click="getUnitLineData()" 
          :icon="Refresh"
          :loading="loading"
        />
      </el-col>
      
      <el-col :span="24" class="form-section">
        <el-form 
          :model="unitLineForm.data" 
          ref="unitLineFormRef" 
          :rules="unitLineForm.rules" 
          label-position="top"
        >
          <div class="form-content">
            <el-row :gutter="10" class="form-row">
              <el-col :xs="8" :sm="2">
                <el-form-item label="代碼" prop="code" style="margin-left: 10px;">
                  <el-input v-model="unitLineForm.data.code" :disabled="!showButton" />
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="3">
                <el-form-item label="单位名稱" prop="name">
                  <el-input v-model="unitLineForm.data.name" />
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="3">
                <el-form-item label="所属制程" prop="processCode">
                  <el-select 
                    v-model="unitLineForm.data.processCode" 
                    multiple 
                    collapse-tags
                  >
                    <el-option 
                      v-for="item in processSelect" 
                      :key="item.value" 
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="3">
                <el-form-item label="所属部门" prop="department">
                  <el-cascader 
                    v-model="unitLineForm.data.department" 
                    :options="groupSelect"
                    :props="{ checkStrictly: true }" 
                    filterable
                    :show-all-levels="false"
                  />
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="3">
                <el-form-item label="英文名" prop="EN">
                  <el-input v-model="unitLineForm.data.EN" />
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="3">
                <el-form-item label="本地語名" prop="CN">
                  <el-input v-model="unitLineForm.data.CN" />
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="3">
                <el-form-item label="繁體名" prop="TW">
                  <el-input v-model="unitLineForm.data.TW" />
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="2">
                <el-form-item label="禁用" prop="status">
                  <el-select v-model="unitLineForm.data.status" filterable>
                    <el-option 
                      v-for="item in statusSelect" 
                      :key="item.value" 
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :xs="8" :sm="2">
                <el-button 
                  v-if="showButton" 
                  class="action-btn"
                  type="success"
                  plain 
                  round 
                  :loading="inputLoading"
                  @click="addUnitLineData(unitLineFormRef)"
                >
                  <el-icon><Plus /></el-icon>新增
                </el-button>
                <el-button 
                  v-else 
                  class="action-btn"
                  type="warning" 
                  plain 
                  round
                  :loading="inputLoading" 
                  @click="editUnitLineData(unitLineFormRef)"
                >
                  <el-icon><Edit /></el-icon>修改
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-col>
      
      <el-col :span="24" class="table-section">
        <vxe-table 
          ref="unitLineTableRef" 
          :loading="loading" 
          border 
          :auto-resize="true" 
          resizable 
          show-overflow
          keep-source 
          :height="tableHeight" 
          stripe
          :row-config="{ isCurrent: true, isHover: true, keyField: 'code' }" 
          :data="unitLineTableData"
          :mouse-config="{ selected: true }" 
          @cell-click="editClickEvent"
        >
          <vxe-column field="code" title="单位代碼" min-width="60" />
          <vxe-column field="name" title="单位名稱" min-width="60" />
          <vxe-column 
            field="processCode" 
            title="制程" 
            min-width="60" 
            disabled="true"
            :edit-render="{ name: 'ElSelect', options: processSelect, props: { multiple: true } }"
          />
          <vxe-column 
            field="status" 
            title="禁用" 
            min-width="20" 
            disabled="true"
            :edit-render="{ name: 'ElSelect', options: statusSelect }"
          />
          <vxe-column field="departmentCode" title="departmentCode" :visible="false" />
          <vxe-column 
            field="department" 
            title="所属部门" 
            min-width="220"
            :edit-render="{ name: 'ElCascader', props: { options: groupSelect } }"
          />
          <vxe-column field="EN" title="英文名" min-width="80" />
          <vxe-column field="CN" title="本地語名" min-width="80" />
          <vxe-column field="TW" title="繁體名" min-width="60" />
          <vxe-column field="revision" title="修改人" min-width="60" />
          <vxe-column field="modifyTime" title="修改時間" min-width="120" />
        </vxe-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Plus, Edit } from '@element-plus/icons-vue'
import type { VxeTableInstance } from 'vxe-table'
import axios from '../../assets/js/index'
import { useMainStore } from '../../assets/js/store.ts'
import { getGroup } from '../../assets/API/inputGroup'
import date_Format from '../../assets/API/dateFormat'

// 类型定义
interface UnitLineData {
  code: string | null
  name: string | null
  processCode: string[]
  status: number
  EN: string | null
  CN: string | null
  TW: string | null
  departmentCode: number | null
  department: any[]
  revision: string | null
  modifyTime: string | null
}

interface ProcessOption {
  value: string
  label: string
}

interface StatusOption {
  value: number
  label: string
}

// Store
const store = useMainStore()

// 响应式状态
const loading = ref(false)
const inputLoading = ref(false)
const tableHeight = ref(520)
const showButton = ref(true)

const statusSelect = ref<StatusOption[]>([
  { value: 0, label: '是' }, 
  { value: 1, label: '否' }
])

const processSelect = ref<ProcessOption[]>([])
const groupSelect = ref<any[]>([])

const unitLineFormRef = ref<FormInstance>()

const unitLineForm = reactive({
  data: reactive<UnitLineData>({
    code: null,
    name: null,
    processCode: [],
    status: 1,
    EN: null,
    CN: null,
    TW: null,
    departmentCode: null,
    department: [],
    revision: null,
    modifyTime: null
  }),
  rules: reactive<FormRules>({
    code: [{ required: true, message: 'must', trigger: 'change' }],
    name: [{ required: true, message: 'must', trigger: 'change' }]
  })
})

const unitLineTableRef = ref<VxeTableInstance>()
const unitLineTableData = ref<any[]>([])

// 方法定义
const getWindowHeight = (): number => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

const getUnitLineData = async (): Promise<void> => {
  loading.value = true
  try {
    const res = await axios.post('/v1/system/system/get-all', { 'language': store.user.language })
    
    const msgs = res.data
    if (msgs.infos === 0) {
      ElMessageBox.alert(msgs.msg, { type: 'error' })
      console.error(msgs.msg)
      return
    }
    
    unitLineTableData.value = msgs.unitLineList
    unitLineTableData.value.forEach((item: any) => {
      item.modifyTime = date_Format.dateFormat(item.modifyTime)
    })
    
    processSelect.value = msgs.processFlowList.map((item: any) => ({
      value: item.code,
      label: item.name
    }))
    
    groupSelect.value = getGroup(msgs.departmentList)
    
    ElMessage({
      message: msgs.msg,
      type: 'success',
    })
  } catch (error: any) {
    console.error(error)
    ElMessageBox.alert(error.message, { type: 'error' })
  } finally {
    loading.value = false
    showButton.value = true
  }
}

const addUnitLineData = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      inputLoading.value = true
      try {
        unitLineForm.data.revision = store.user.userName
        
        if (unitLineForm.data.department && unitLineForm.data.department.length > 0) {
          unitLineForm.data.departmentCode = unitLineForm.data.department[unitLineForm.data.department.length - 1]
        }
        
        const res = await axios.post('/v1/system/units/create', {
          ...unitLineForm.data,
          revision: store.user.userName
        })
        
        const msgs = res.data
        if (msgs.infos === 0) {
          ElMessageBox.alert(msgs.msg, { type: 'error' })
          console.error(msgs.msg)
          return
        }
        
        unitLineTableData.value = msgs.unitLineList
        unitLineTableData.value.forEach((item: any) => {
          item.modifyTime = date_Format.dateFormat(item.modifyTime)
        })
        
        ElMessage({
          message: msgs.msg,
          type: 'success',
        })
      } catch (error: any) {
        console.error(error)
        ElMessageBox.alert(error.message, { type: 'error' })
      } finally {
        inputLoading.value = false
      }
    } else {
      ElMessageBox.alert('input error', { type: 'error' })
      inputLoading.value = false
    }
  })
}

const editUnitLineData = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      inputLoading.value = true
      try {
        unitLineForm.data.revision = store.user.userName
        
        if (unitLineForm.data.department && unitLineForm.data.department.length > 0) {
          unitLineForm.data.departmentCode = unitLineForm.data.department[unitLineForm.data.department.length - 1]
        }
        
        const res = await axios.post('/v1/system/units/update', {
          ...unitLineForm.data,
          revision: store.user.userName
        })
        
        const msgs = res.data
        if (msgs.infos === 0) {
          ElMessageBox.alert(msgs.msg, { type: 'error' })
          console.error(msgs.msg)
          return
        }
        
        unitLineTableData.value = msgs.unitLineList
        unitLineTableData.value.forEach((item: any) => {
          item.modifyTime = date_Format.dateFormat(item.modifyTime)
        })
        
        // 重置表单数据
        Object.assign(unitLineForm.data, {
          code: null,
          name: null,
          processCode: [],
          status: 1,
          EN: null,
          CN: null,
          TW: null,
          departmentCode: null,
          department: [],
          revision: null,
          modifyTime: null
        })
        
        ElMessage({
          message: msgs.msg,
          type: 'success',
        })
        showButton.value = true
      } catch (error: any) {
        console.error(error)
        ElMessageBox.alert(error.message, { type: 'error' })
      } finally {
        inputLoading.value = false
      }
    } else {
      ElMessageBox.alert('input error', { type: 'error' })
      inputLoading.value = false
    }
  })
}

const editClickEvent = ({ row }: any): void => {
  showButton.value = false
  Object.assign(unitLineForm.data, row)
}

// 生命周期钩子
onMounted(() => {
  tableHeight.value = getWindowHeight() * 0.75
  getUnitLineData()
})
</script>

<style scoped>
.unit-line-container {
  width: 100%;
}

.header-section {
  padding: 8px;
  background-color: #f1f0ee;
}

.title-text {
  margin-left: 12px;
  font-size: 18px;
  font-weight: bold;
  height: 32px;
  color: #7827ff;
  border-radius: 0px;
  float: left;
}

.refresh-btn {
  float: right;
}

.form-section {
  border: 1px solid #c6c6c6;
  background-color: #fcf0f0;
  border-radius: 5px;
}

.form-content {
  background-color: #fcf0f0;
  border-radius: 5px;
}

.form-row {
  margin: 12px auto auto 12px;
}

.action-btn {
  margin-left: 2px;
  margin-top: 16px;
}

.table-section {
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #c6c6c6;
}
</style>