<template>
    <div class="userClass">
        <el-row>
            <el-col :xs="24" :sm="12" style="height: 90vh">
                <div style="padding: 8px; background-color: #eeeeee; text-align: left;">
                    <el-input style="width: 320px; float: right; margin-right: 5px" :placeholder="language.pleaseEnter"
                        v-model="inputInquiry">
                        <template #prepend>
                            <el-select v-model="selectInquiry" style="width: 105px"
                                :placeholder="language.pleaseChoose">
                                <el-option :label="language.userName" value="name"></el-option>
                                <el-option :label="language.userID" value="id"></el-option>
                                <el-option :label="language.userAccount" value="userName"></el-option>
                            </el-select>
                        </template>
                        <template #append>
                            <el-button @click.prevent="inquiryUser(selectInquiry, inputInquiry)">
                                <el-icon>
                                    <Search />
                                </el-icon>{{ language.inquire }}
                            </el-button>
                        </template>
                    </el-input>
                    <el-button type="success" @click="addUser()">
                        <el-icon>
                            <DocumentAdd />
                        </el-icon>{{ language.new }}
                    </el-button>
                    <el-button type="danger" @click="deleteUser()">
                        <el-icon>
                            <Document />
                        </el-icon>{{ language.delete }}
                    </el-button>
                </div>

                <vxe-table ref="usersTableRef" :loading="usersList.loading" border :auto-resize="true" resizable
                    show-overflow :row-config="{ isCurrent: true, isHover: true, keyField: 'id', useKey: true }"
                    :height="tableHeight" :data="usersList.tableData" :radio-config="{ highlight: true, reserve: true }"
                    @cell-dblclick="editUserEvent" @radio-change="radioChangeEvent">
                    <vxe-column type="radio" width="50"></vxe-column>
                    <vxe-column v-for="j in usersList.columns" :key="j.field" :field="j.field" :title="j.title"
                        :width="j.width"></vxe-column>
                    <vxe-column field="userType" title="UserType" :visible="false"></vxe-column>
                    <vxe-column field="groupPath" title="GroupPath" :visible="false"></vxe-column>
                </vxe-table>

                <vxe-pager border size="medium" v-model:current-page="tablePage.currentPage"
                    v-model:page-size="tablePage.pageSize" :pager-count="tablePage.count" :total="tablePage.totalResult"
                    :layouts="['PrevPage', 'JumpNumber', 'NextPage']" @page-change="handlePageChange">
                </vxe-pager>
                <transition name="slide-fade">
                    <p v-show="flag" style="background-color: #fc6384; color: #000000; font-size: 18px; margin: 0;">
                        {{ msgs }}</p>
                </transition>
            </el-col>

            <el-col :xs="24" :sm="12"
                style="min-width: 520px; height: 92vh; background-color: #f1f0ee; padding-left: 3px ">
                <div style="padding: 8px; background-color: #ffffff; text-align: left;">
                    <el-button type="primary" @click="updataUserMenu()">
                        <el-icon>
                            <Document />
                        </el-icon>{{ language.save }}
                    </el-button>
                    <span style="padding-left: 20px">{{ language.userPerInfor }}</span>
                    <el-button type="info" plain circle style="float: right" @click="getUserMenu" :icon="Refresh"
                        :loading="usersList.loading"></el-button>
                </div>

                <vxe-table v-if="menuList.upMenuList" ref="menuTableRef" :loading="menuList.loading" border
                    :auto-resize="true" resizable show-overflow
                    :row-config="{ isCurrent: true, isHover: true, keyField: 'id' }" :height="tableHeight"
                    :tree-config="{ lazy: true, hasChild: 'hasChild', childrenField: 'children', expandAll: true, reserve: true }"
                    :checkbox-config="{ labelField: 'name', highlight: true, checkStrictly: true, checkRowKeys: menuList.ids }"
                    :data="menuList.tableData" @checkbox-change="checkboxChangeEvent">
                    <vxe-column type="checkbox" field="name" :title="language.userPerInfor" tree-node></vxe-column>
                </vxe-table>
            </el-col>
        </el-row>

        <el-dialog v-model="showEdit" min-width="360px" width="32vw"  top="3vh" :show-close="false" class="userDialogClass">
            <el-row style="background-color: #f8f8f8;height: 4vh; top:-5px">
                <el-col :span="12">
                    <span style="float: left; margin-left: 8px; font-size: 18px; height: 32px; border-radius: 5px">
                        {{ selectRow ? `${language.edit}&${language.save}` : `${language.new}&${language.save}` }}
                    </span>
                </el-col>
                <el-col :span="12">
                    <el-button type="danger" style="float: right; margin-right: 8px;" size="small" plain circle
                        @click="showEdit = false">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </el-button>
                </el-col>
            </el-row>
            <div style="background-color: #ffffff; border-radius: 5px;padding: 2%;">
            <el-row style="padding: 2px; border-radius: 2px">
                <el-col>
                    <div style="text-align: left; padding-top: 10px;font-size: 14px; height: 32px; border-radius: 2px ">
                        <i><el-icon>
                                <Postcard />
                            </el-icon>{{ language.basicInfor }} </i>
                    </div>
                    <el-form style="padding-left:10px" :model="userFormData" ref="newUserFormRef" :rules="userFormRules"
                        label-width="80px" label-position="right">
                        <el-form-item :label="language.userName" prop="name" style="margin-right:12px">
                            <el-input v-model="userFormData.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="language.userAccount" prop="userName" style="margin-right:12px">
                            <el-input v-model="userFormData.userName"></el-input>
                        </el-form-item>
                        <el-form-item :label="language.passWord" prop="passWord" style="margin-right:12px">
                            <el-input v-model="userFormData.passWord" show-password></el-input>
                        </el-form-item>
                        <el-form-item :label="language.confirmPassWord" prop="confirmPassWord"
                            style="margin-right:12px">
                            <el-input v-model="userFormData.confirmPassWord" show-password></el-input>
                        </el-form-item>
                        <el-form-item :label="language.rankName" prop="rankCode">
                            <el-select v-model="userFormData.rankCode" filterable :placeholder="language.pleaseChoose">
                                <el-option v-for="item in rankSelect" style="padding-left:12px" :key="item.value"
                                    :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="language.department" prop="groupPath">
                            <el-cascader ref="xCascaderRef" :placeholder="language.pleaseChoose"
                                v-model="userFormData.groupPath" :options="groupSelect"
                                @change="elCascaderChange"
                                :props="{ checkStrictly: true, multiple: true, emitPath: true }">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item :label="language.userType" prop="userType">
                            <el-select v-model="userFormData.userType" filterable :placeholder="language.pleaseChoose">
                                <el-option v-for="item in userTypeSelect" style="padding-left:12px" :key="item.value"
                                    :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

            <el-row>
                <el-col>
                    <i style="font-size: 14px; height: 32px; border-radius: 2px; float:left">
                        <el-icon>
                            <EditPen />
                        </el-icon>{{ language.signatureFile }}
                    </i>
                </el-col>
            </el-row>
            <el-row :gutter="2" class="userUploadBoxclass">
                <el-col :span="8">
                    <el-upload action="#" accept=".png" :show-file-list="false" :http-request="customRequest"
                        :auto-upload="true">
                        <i style="color: #fc6384; font-size: 24px">
                            <el-icon>
                                <UploadFilled />
                            </el-icon>
                            <small style="color: #fc6384; font-size: 16px">{{ language.clickToUpload }}</small>
                        </i>
                    </el-upload>
                </el-col>
                <el-col :span="16">
                    <img v-if="!userFormData.signature" src="../../assets/smp.jpg"
                        style="width: 100%; height: 40px; border: 1px solid #c6c6c6" />
                    <img v-else :src="userFormData.signature"
                        style="width: 100%; height: 40px; border: 1px solid #c6c6c6" />
                </el-col>
            </el-row>
            <el-row class="buttonUploadBoxclass">
                <el-col :span="12">
                    <el-button type="danger" plain @click="showEdit = false">
                        <el-icon>
                            <CircleCloseFilled />
                        </el-icon>{{ language.cancel }}
                    </el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="success" plain @click="submitEvent">
                        <el-icon>
                            <CircleCheckFilled />
                        </el-icon>{{ language.save }}
                    </el-button>
                </el-col>
            </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import axios from '../../assets/js/index'
import { useMainStore } from '../../assets/js/store.ts'
import { handleError } from '../../assets/js/httpErrorHandler'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Refresh, Search, DocumentAdd, Document, Close, Postcard, EditPen, UploadFilled, CircleCloseFilled, CircleCheckFilled } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, nextTick, computed, onUnmounted } from 'vue'
import type { VxeTableInstance } from 'vxe-table'
import { getGroup, getMenu } from '../../assets/API/inputGroup'

// ============================================================================
// 🔹 Pinia Store & Language
// ============================================================================
const store = useMainStore()
const language = computed(() => store.user.languageData)

// ============================================================================
// 🔹 型別定義（嚴格對齊你的原始數據結構）
// ============================================================================
interface UserItem {
    id: number | string
    name: string
    userName: string
    passWord?: string
    rankCode?: number
    rankName?: string
    groupCode?: Array<string | number | null>
    groupPath?: Array<Array<string | number>> | null
    groupName?: string[][]
    userType?: number
    signature?: string | null
    [key: string]: any
}

interface UserDataForm {
    id: string | null
    name: string | null
    userName: string | null
    passWord: string | null
    confirmPassWord: string | null
    rankCode: number | null
    groupCode: Array<string | number | null>
    groupPath: Array<Array<string | number>> | null
    groupName?: string[][]
    userType: number | null
    signature: string | null
}

// ============================================================================
// 🔹 響應式狀態
// ============================================================================
const getWindowHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
const tableHeight = ref(getWindowHeight() * 0.82)
const inputInquiry = ref('')
const selectInquiry = ref('userName')
const selectRow = ref(false)
const selectRow2 = ref<UserItem | null>(null)
const flag = ref(false)
const showEdit = ref(false)
const msgs = ref('')

// ✅ 法則 4：使用明確業務型別陣列
const usersList = reactive({
    loading: false,
    columns: [
        { field: "id", title: "ID", width: 50 },
        { field: "name", title: "用户名", width: 100 },
        { field: "userName", title: "账  号", width: 100 },
        { field: "passWord", title: "密  码", width: 80 },
        { field: "rankName", title: "职  称" },
        { field: "groupName", title: "部门单位" }
    ],
    data: [] as UserItem[],
    tableData: [] as UserItem[],
    deleData: [] as UserItem[],
})

const usersTableRef = ref<VxeTableInstance>()
const menuTableRef = ref<VxeTableInstance>()

const menuList = reactive({
    loading: false,
    upMenuList: true,
    ids: [] as any,
    menulist: [] as any,
    tableData: [] as any[],  // 樹形結構複雜，使用 any[] 最穩
    deleData: [] as any[],
})

const tablePage = reactive({ currentPage: 1, pageSize: 10, count: 5, totalResult: 0 })
const newUserFormRef = ref<FormInstance>()
const xCascaderRef = ref<any>()

const userFormData = reactive<UserDataForm>({
    id: null, name: null, userName: null, passWord: null, confirmPassWord: null,
    rankCode: null, groupCode: [], groupPath: null, userType: null, signature: null
})

// ============================================================================
// 🔹 法則 3：驗證規則返回 new Error()
// ============================================================================
const userFormRules: FormRules = {
    name: [{ required: true, min: 3, max: 18, message: 'Name must 3-18 Words', trigger: 'blur', validator: (_, v, cb) => v ? cb() : cb(new Error('Name is required')) }],
    userName: [{ required: true, min: 2, max: 12, message: 'Account must 2-12 Words', trigger: 'blur', validator: (_, v, cb) => v ? cb() : cb(new Error('Account is required')) }],
    passWord: [{ required: true, message: 'Password is required', trigger: 'blur', validator: (_, v, cb) => v ? cb() : cb(new Error('Password is required')) }],
    confirmPassWord: [{ required: true, message: 'Please confirm password', trigger: 'blur', validator: (_, v, cb) => v ? (v === userFormData.passWord ? cb() : cb(new Error('Passwords do not match'))) : cb(new Error('Please confirm password')) }],
    rankCode: [{ required: true, message: 'Job Title is required', trigger: 'change', validator: (_, v, cb) => v != null ? cb() : cb(new Error('Job Title is required')) }],
    groupPath: [{ required: true, message: 'Departmental Unit is required', trigger: 'change', validator: (_, v, cb) => Array.isArray(v) && v.length > 0 ? cb() : cb(new Error('Departmental Unit is required')) }]
}

const rankSelect = ref<Array<{ value: number, label: string }>>([{ value: 0, label: ' rank' }])
const userTypeSelect = ref<Array<{ value: number, label: string }>>([])
const groupList = ref<Array<any>>([])
const groupSelect = ref<Array<any>>([])

// ============================================================================
// 🔹 核心業務邏輯（完全保留你的原始迴圈結構，僅補運行時防禦）
// ============================================================================
// 🔹 輔助函數：安全解析,成功就返回，失敗直接給 []
const parseSafeArray = (raw: any): any[] => {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw.trim() !== '') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return []// 解析失敗，直接返回空數組
    }
  }
  return []
}

// 🔹 主函數：完全保留你的原始二維迴圈邏輯
const fillUserData = (user: UserItem) => {
    // 1. Rank 名稱對應
    const rank = rankSelect.value.find(r => r.value === user.rankCode)
    if (rank) user.rankName = rank.label

    user.groupCode = parseSafeArray(user.groupCode)

    // 2. GroupName 對應（嚴格還原你的原始二維陣列邏輯） 
    let groupNameList: string[][] = []

    // 🔑 關鍵：先解析 groupPath 為標準二維陣列
    user.groupPath = parseSafeArray(user.groupPath)

    // 🔒 原始邏輯完全不變，只是輸入保證是 number[][]
    for (let a = 0; a < user.groupPath.length; a++) {
        let groupName: string[] = []
        const pathItem = user.groupPath[a]

        for (let n = 0; n < pathItem.length; n++) {
            groupList.value.forEach(function (x: { code: number, name: string }) {
                if (pathItem[n] == x.code) {
                    groupName[n] = x.name
                }
            })
        }
        groupNameList[a] = groupName
    }
    user.groupName = groupNameList
}

const elCascaderChange = (value: (string | number)[][]) => {
  userFormData.groupPath = value  
  
  if (Array.isArray(value) && value.length > 0) {
    userFormData.groupCode = value.map(path => {
      const last = path[path.length - 1]
      return last != null && last !== '' ? last : null
    }).filter((code): code is string | number => code != null)
  } else {
    userFormData.groupCode = []
  }
}


const handlePageChange = () => {
    tablePage.totalResult = usersList.data.length
    const start = (tablePage.currentPage - 1) * tablePage.pageSize
    usersList.tableData = usersList.data.slice(start, start + tablePage.pageSize)
}

// 樹形勾選輔助函數（保持原始邏輯）
const dele_list = ($table: any, listData: any) => {
    for (let n = 0; n < listData.length; n++) {
        $table.setCheckboxRow([listData[n]], false)
        if (listData[n].children?.length > 0) dele_list($table, listData[n].children)
    }
}
const sele_list = ($table: any, childrendata: any, row: any) => {
    for (let n = 0; n < childrendata.length; n++) {
        if (childrendata[n].dis2 == row.dis) {
            $table.setCheckboxRow([childrendata[n]], true)
            sele_head_list($table, menuList.tableData, childrendata[n])
        }
        if (childrendata[n].id == row.id) sele_children_list($table, childrendata[n].children)
        sele_list($table, childrendata[n].children, row)
    }
}
const sele_head_list = ($table: any, tableData: any, listData: any) => {
    for (let i = 0; i < tableData.length; i++) {
        if (tableData[i]?.dis2 == listData.dis) {
            $table.setCheckboxRow([tableData[i]], true)
            sele_head_list($table, menuList.tableData, tableData[i])
        }
        sele_head_list($table, tableData[i]?.children, listData)
    }
}
const sele_children_list = ($table: any, listData: any) => {
    if (listData?.length > 0) {
        for (let m = 0; m < listData.length; m++) {
            $table.setCheckboxRow([listData[m]], true)
            sele_children_list($table, listData[m]?.children)
        }
    }
}

// ============================================================================
// 🔹 法則 2：事件參數使用 any，內部安全訪問
// ============================================================================
const radioChangeEvent = async ({ row }: any) => {
    selectRow2.value = row as UserItem
    menuList.loading = true
    try {
        const res = await axios.get(`/v1/iam/user/menu/${row.id}`)
        const rawData = res.data.data
        let menuIds: number[] = []
        if (typeof rawData === 'string') {
            try {
                menuIds = JSON.parse(rawData)
            } catch {
                menuIds = []
            }
        } else if (Array.isArray(rawData)) {
            menuIds = rawData
        }

        menuList.ids = menuIds
        setTimeout(() => {
            menuList.upMenuList = false
            nextTick(() => { menuList.upMenuList = true; menuList.loading = false })
        }, 500)
    } catch (error) { handleError(error) }
}

const editUserEvent = ({ row }: any) => {
    const user = row as UserItem
    Object.assign(userFormData, {
        id: user.id, name: user.name, userName: user.userName, passWord: user.passWord,
        confirmPassWord: user.passWord, rankCode: user.rankCode, groupCode: user.groupCode || null,
        groupPath: user.groupPath || null, userType: user.userType,
        signature: user.signature === 'one' ? null : user.signature
    })
    selectRow.value = true
    showEdit.value = true
}

const checkboxChangeEvent = async ({ $table, row }: any) => {
    try {
        await new Promise<void>((resolve) => {
            const records = $table?.getCheckboxRecords() || []
            const p01 = records.map((item: any) => item.id)
            if (!p01.includes(row.id)) {
                if (row.children?.length > 0) dele_list($table, row.children)
            } else {
                sele_list($table, menuList.tableData, row)
            }
            resolve()
        })
        menuList.menulist = $table?.getCheckboxRecords()?.map((item: any) => item.id) || []
    } catch (error) { handleError(error) }
}

// ============================================================================
// 🔹 API 請求（簡潔格式 + 法則 1 數據同步）
// ============================================================================
const getUserMenu = async () => {
    usersList.loading = true
    try {
        const res = await axios.get('/v1/iam/user/refresh', { params: { language: store.user?.language || 'CN' } })
        const data = res.data

        if (data.infos === 0) { ElMessageBox.alert(data.msg, { type: 'error' }); return }
        if (data.infos === 1) {
            rankSelect.value = data.rankClasslist.map((i: any) => ({ value: i.code, label: i.name }))
            userTypeSelect.value = data.userTypeClasslist.map((i: any) => ({ value: i.code, label: i.name }))
            groupList.value = data.groupClasslist
            groupSelect.value = getGroup(data.groupClasslist)
            menuList.tableData = getMenu(data.menu_list)

            usersList.data = data.users as UserItem[]
            usersList.data.forEach(fillUserData)

            usersList.loading = false
            handlePageChange()
        }
    } catch (error) { handleError(error); usersList.loading = false }
}

const updataUserMenu = async () => {
    if (!selectRow2.value) { ElMessageBox.alert('Please select a user', { type: 'warning' }); return }
    //const menu_list = JSON.stringify(menuList.menulist )
    try {
        const res = await axios.post('/v1/iam/user/menu/save', JSON.stringify({ userID: selectRow2.value.id, menulist: menuList.menulist }))
        const data = res.data
        flag.value = true; msgs.value = data.msg
        ElMessage({ type: 'warning', message: ` ${msgs.value}` })
        setTimeout(() => { flag.value = false }, 6000)
    } catch (error) { handleError(error) }
}

const submitEvent = async () => {
    if (!newUserFormRef.value) return
    try {
        await newUserFormRef.value.validate()
        if (userFormData.passWord !== userFormData.confirmPassWord) {
            ElMessageBox.alert('The entered passwords are not the same', { type: 'error' }); return
        }
        // 🔑 關鍵：將陣列轉為字串，匹配後端 Pydantic 驗證
        const payload = {
            ...userFormData,
            groupCode: userFormData.groupCode,
            groupPath: userFormData.groupPath
        }

        const url = selectRow.value ? '/v1/iam/user/edit' : '/v1/iam/user/register'
        const res = await axios.post(url,  payload)
        const data = res.data

        flag.value = true; msgs.value = data.msg
        setTimeout(() => { flag.value = false }, 6000)

        if (data.infos === 1) {
            ElMessage({ message: msgs.value, type: 'success' })
            showEdit.value = false; selectRow.value = false
            await getUserMenu()
        } else {
            ElMessageBox.alert(msgs.value, { type: 'error' })
            showEdit.value = false
        }

        menuList.ids = []
        setTimeout(() => { menuList.upMenuList = false; nextTick(() => { menuList.upMenuList = true }) }, 500)
    } catch (error: any) {
        if (!error?.errors) handleError(error)
    }
}

const inquiryUser = async (field: string, value: any) => {
    if (field === 'id' && (value === '' || isNaN(Number(value)))) {
        ElMessageBox.alert('ID can only be an integer', { type: 'warning' }); return
    }
    usersList.loading = true
    try {
        const res = await axios.post('/v1/iam/user/search', { selectInquiry: field, inputInquiry: value })
        const data = res.data as UserItem[]
        usersList.data = data
        usersList.data.forEach(fillUserData)
        usersList.loading = false
        handlePageChange()
    } catch (error) { handleError(error); usersList.loading = false }
}

const deleteUser = async () => {
    // ✅ 法則 1：優先從表格實例獲取最新狀態
    const $table = usersTableRef.value
    const target = selectRow2.value || $table?.getRadioRecord()

    if (!target) { ElMessageBox.alert('Please select a user to delete', { type: 'warning' }); return }

    try {
        await ElMessageBox.confirm(`Delete the Data? ${target.name}`, { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' })
        const res = await axios.post('/v1/iam/user/delete', JSON.stringify({ user_id: target.id }))
        const data = res.data

        flag.value = true
        setTimeout(() => { flag.value = false }, 6000)

        if (data.infos === 1) {
            ElMessage({ message: data.msg, type: 'success' })
            if ($table) $table.remove(target)
            const idx = usersList.data.findIndex(u => u.id === target.id)
            if (idx > -1) usersList.data.splice(idx, 1)

            selectRow.value = false; selectRow2.value = null; menuList.ids = []
            setTimeout(() => { menuList.upMenuList = false; nextTick(() => { menuList.upMenuList = true }) }, 500)
        } else {
            ElMessageBox.alert(data.msg, { type: 'error' })
        }
    } catch (error) { if (error !== 'cancel') handleError(error) }
}

const customRequest = async (params: any) => {
    if (params.file.size / 1024 > 30) { ElMessageBox.alert('file > 30K,Upload failed', { type: 'error' }); return }
    const URL = window.URL || (window as any).webkitURL
    const previewPath = URL.createObjectURL(params.file)
    try {
        const canvas = await new Promise<HTMLCanvasElement>((resolve) => {
            const img = new Image(); img.src = previewPath
            img.onload = () => {
                if (img.width > 180) { ElMessageBox.alert('file_width > 180px,Upload failed', { type: 'error' }); return }
                const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
                c.getContext('2d')?.drawImage(img, 0, 0)
                setTimeout(() => resolve(c), 500)
            }
        })
        userFormData.signature = canvas.toDataURL('image/png')
    } catch (error) { handleError(error) }
}

const addUser = () => {
    Object.assign(userFormData, { id: null, name: null, userName: null, passWord: null, confirmPassWord: null, rankCode: null, groupCode: [], groupPath: null, userType: null, signature: null })
    selectRow.value = false; showEdit.value = true
}

onMounted(() => {
  getUserMenu()
  // ✅ 視窗變化時，表格高度維持 82% 視口比例
  const syncTableHeight = () => { tableHeight.value = window.innerHeight * 0.82 }
  window.addEventListener('resize', syncTableHeight)
  // 組件卸載時清除監聽，避免記憶體洩漏
  onUnmounted(() => window.removeEventListener('resize', syncTableHeight))
})
</script>

<style>
.userClass {
    min-height: 660px;
}

.userUploadBoxclass {
    border: 1px solid #c6c6c6;
    padding-top: 5px;
    padding-right: 5px;
    border-radius: 6px;
}

.buttonUploadBoxclass {
    margin: 18px;
    text-align: center;
    padding-bottom: 10px;
}

.userDialogClass {
    min-width: 360px;
    background-color: #f8f8f8;
    border: 2px solid #e1e1e1;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}

.userDialogClass .el-dialog {
    min-width: 360px;
    border: 3px solid #e1e1e1;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}

.userDialogClass .el-dialog__header {
    background-color: #f8f8f8;
    padding: 0;
    margin: 0;
    height: 0px;
}

.userDialogClass .el-dialog__body {
    margin: 8px;
    padding: 0;
    background-color:#f8f8f8;
    color: #606266;
    font-size: 14px;
}

.userDialogClass.el-dialog__footer {
    padding: 0px;
    text-align: right;
}
</style>