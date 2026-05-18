<template>
    <div class="departmentClass">
        <div style="padding: 8px; background-color: #e9e9e9; text-align: left;">
            <el-button type="success" @click="insertEvent()"><el-icon>
                    <DocumentAdd />
                </el-icon>新增厂别</el-button>
            <el-button type="primary" @click="saveEvent(0,)"><el-icon>
                    <Document />
                </el-icon>保存</el-button>
            <span style="padding-left: 20px; color: #820183; font-weight: bold; font-size: 16px ">部门组织</span>
        </div>
        <vxe-table ref="xTable" :loading="departmentList.loading" border show-overflow keep-source highlight-hover-row
            highlight-current-row resizable :row-config="{ isCurrent: true, isHover: true, keyField: 'id' }"
            :height="tableHeight * 0.91" :mouse-config="{ selected: true }"
            :keyboard-config="{ isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true, isChecked: true }"
            :tree-config="{ lazy: true, hasChild: 'hasChild', transform: true, rowField: 'dis', parentField: 'dis2', reserve: true, expandAll: true }"
            :edit-config="{ trigger: 'dblclick', mode: 'row', showStatus: true }" @edit-closed="saveEvent(1)"
            :edit-rules="departmentList.validRules" :data="departmentList.tableData">
            <vxe-column type="seq" title="序号" min-width="122" tree-node></vxe-column>
            <vxe-column field="id" title="ID" :visible="false"></vxe-column>
            <vxe-column field="code" title="部门代码" min-width="80" :edit-render="{ name: 'input' }"></vxe-column>
            <vxe-column field="name" title="部门名称" min-width="160" :edit-render="{ name: 'input' }"></vxe-column>
            <vxe-column field="localName" title="部门本地语" min-width="160" :edit-render="{ name: 'input' }"></vxe-column>
            <vxe-column title="操作" min-width="100">
                <template #default="{ row }">
                    <el-button type="success" size="small" plain circle @click="insertRow(row)"><el-icon>
                            <Plus />
                        </el-icon></el-button>
                    <el-button type="danger" size="small" plain circle @click="removeRow(row)"><el-icon>
                            <Delete />
                        </el-icon></el-button>
                </template>
            </vxe-column>
        </vxe-table>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { VxeTableInstance } from 'vxe-table'
import axios from '../../assets/js/index'
import { useMainStore } from '../../assets/js/store'
import { ElMessage, ElMessageBox } from 'element-plus'

// 类型定义
interface DepartmentItem {
  id: string | number
  code: number | null
  name: string | null
  localName: string | null
  dis: string
  dis2: string
  children?: DepartmentItem[]
  hasChild?: boolean
  groupPath?: number[]
  revision?: string
}

// Store
const store = useMainStore()

// 响应式状态
const tableHeight = ref(520)
const xTable = ref<VxeTableInstance>()

const departmentList = reactive({
  loading: false,
  tableData: [] as DepartmentItem[],
  deleData: [] as (string | number)[],
  validRules: {
    code: [{ required: true, type: 'number' as const, message: 'Code must number', trigger: 'blur' as const }],
    localName: [{ max: 20, message: 'LocalName must <20 Words', trigger: 'blur' as const }],
    name: [{ required: true, max: 20, message: 'Name must 1-20 Words', trigger: 'blur' as const }]
  }
})

// 方法定义
const getWindowHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

const getDepartmentList = async () => {
  departmentList.loading = true
  try {
    const res = await axios.post('/v1/system/departments/query', { 
      'language': store.user.language 
    })
    if (res.data.infos === 1) {
      departmentList.tableData = res.data.departmentList
    } else {
      ElMessageBox.alert(res.data.msg, { type: 'error' })
    }
  } catch (error: any) {
    ElMessageBox.alert(error.message, { type: 'error' })
    console.error(error)
  } finally {
    departmentList.loading = false
  }
}

const insertRow = async (currRow: DepartmentItem) => {
  let n = 1
  if (currRow.children && currRow.children.length > 0) {
    const f_dis: number[] = []
    currRow.children.forEach((e: DepartmentItem) => {
      if (e.dis2 == currRow.dis) {
        const d = parseInt(e.dis.slice(e.dis.lastIndexOf('-') + 1))
        f_dis.push(d)
      }
    })
    n = Math.max(...f_dis) + 1
  }
  
  const $table = xTable.value
  if ($table) {
    const record: DepartmentItem = { 
      id: '', 
      code: null, 
      name: null, 
      localName: null, 
      dis: currRow.dis + '-' + n, 
      dis2: currRow.dis 
    }
    const { row: newRow } = await $table.insertAt(record, -1)
    await $table.setTreeExpand(currRow, true)
    await $table.setEditRow(newRow)
  }
}

const group_path = (List: DepartmentItem[], Data: DepartmentItem, groupPath: number[]): number[] => {
  for (let i = 0; i < List.length; i++) {
    if (List[i].dis == Data.dis2) {
      groupPath.unshift(List[i].code as number)
      Data = List[i]
      if (List[i].dis2 == '0') {
        return groupPath
      }
      group_path(List, Data, groupPath)
    }
  }
  return groupPath
}

const removeRow = async (row: DepartmentItem) => {
  try {
    await ElMessageBox.confirm(
      'Delete the Data? ' + row.name,
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    const $table = xTable.value
    if ($table) {
      $table.remove(row)
      ElMessage({
        type: 'success',
        message: 'Delete Success',
      })
    }
  } catch {
    ElMessage({
      type: 'info',
      message: 'Delete Canceled',
    })
  }
}

const insertEvent = async () => {
  const $table = xTable.value
  if ($table) {
    let n = 1
    const tableData = $table.getTableData().tableData as DepartmentItem[]
    if (tableData.length > 0) {
      const f_dis: number[] = []
      tableData.forEach(e => {
        if (e.dis2 == '0') {
          f_dis.push(parseInt(e.dis))
        }
      })
      n = Math.max(...f_dis) + 1
    }
    const record: DepartmentItem = { 
      id: '', 
      code: null, 
      name: null, 
      localName: null, 
      dis: n + '', 
      dis2: '0' 
    }
    const { row: newRow } = await $table.insertAt(record, -1)
    await $table.setEditRow(newRow)
  }
}

const remove_list = (rowData: DepartmentItem[]) => {
  for (let n = 0; n < rowData.length; n++) {
    departmentList.deleData.push(rowData[n].id)
    if (rowData[n].children && rowData[n].children!.length > 0) {
      remove_list(rowData[n].children!)
    }
  }
}

const saveEvent = async (mode: number) => {
  const $table = xTable.value
  if (!$table) return
  
  const errMap = await $table.fullValidate()
  if (errMap) {
    const msgList: string[] = []
    Object.values(errMap).forEach((errList: any) => {
      errList.forEach((params: any) => {
        const { rowIndex, column, rules } = params
        rules.forEach((rule: any) => {
          msgList.push(` ${rowIndex + 1} Row ${column.title} error：${rule.message}`)
        })
      })
    })
    ElMessage({
      type: 'error',
      message: ` ${msgList}`,
    })
    return false
  }
  
  departmentList.loading = true
  try {
    const insertRecords = $table.getInsertRecords() as DepartmentItem[]
    const removeRecords = $table.getRemoveRecords() as DepartmentItem[]
    const updateRecords = $table.getUpdateRecords() as DepartmentItem[]
    let upData: DepartmentItem[] = [...insertRecords, ...updateRecords]
    
    const tableData = $table.getTableData().tableData as DepartmentItem[]
    for (let x = 0; x < upData.length; x++) {
      const gPath = group_path(tableData, upData[x], [upData[x].code as number])
      upData[x].groupPath = gPath
      upData[x].revision = store.user.userName
    }
    
    if (mode == 0) {
      remove_list(removeRecords)
    }
    
    const res = await axios.post('/v1/system/departments/batch', {
      'upList': upData,
      'deleList': departmentList.deleData,
      'language': store.user.language
    })
    
    if (res.data.infos == 0) {
      ElMessageBox.alert(res.data.msg, { type: 'error' })
    } else if (res.data.infos == 1) {
      departmentList.deleData = []
      departmentList.tableData = res.data.departmentList
      ElMessage({
        showClose: true,
        message: res.data.msg,
        type: 'success',
      })
    }
  } catch (error: any) {
    ElMessageBox.alert(error.message, { type: 'error' })
    console.error(error)
  } finally {
    departmentList.loading = false
  }
}

// 生命周期钩子
onMounted(() => {
  tableHeight.value = getWindowHeight()
  getDepartmentList()
})
</script>

<style scoped>
.departmentClass {
    min-height: 660px;
}
</style>