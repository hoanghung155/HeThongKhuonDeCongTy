<template>
    <div>
        <!-- 基本資料建立區域 -->
        <el-row style="border-radius: 5px; border: 1px solid #e8f0f8;">
            <!-- ✅ 頂部邊框顏色區分：基本資料用綠色 -->
            <el-col
                style="padding-top: 10px; border: 1px solid #e8f0f8; min-width: 520px; background-color: #fafbfc; border-top: 4px solid #5B9D6F;">
                <el-form :model="basicForm" ref="BasicForm_Form" size="large" :rules="basicFormRules">
                    <el-row :gutter="12">
                        <!-- 模具類型選擇 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="模具類型" prop="moldType"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-select v-model="basicForm.moldType" filterable
                                    style="font-size: 18px; font-weight: bold; width: 100%;" @change="handleMoldTypeChange">
                                    <el-option v-for="(item, index) in moldTypeSelect" :key="item.value"
                                        :label="item.label" :value="item.value">
                                        <div :style="{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                                            padding: '4px 8px', borderRadius: '4px',
                                            backgroundColor: colorConfigs[index % colorConfigs.length].bgColor,
                                            color: colorConfigs[index % colorConfigs.length].textColor
                                        }">
                                            <span style="flex: 1; font-weight: bold;">{{ item.label }}</span>
                                            <el-tag size="small" effect="dark"
                                                :color="colorConfigs[index % colorConfigs.length].tagColor"
                                                style="margin-left: 8px;">
                                                {{ item.value }}
                                            </el-tag>
                                        </div>
                                    </el-option>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <Tools />
                                        </el-icon>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <!-- 模具編號 -->
                        <el-col :sm="12" :md="6">
                            <el-form-item label="模具編號" prop="moldNo"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="basicForm.moldNo" placeholder="輸入模具編號"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <Search />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <!-- 部件名稱 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="部件名稱" prop="partName"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-select v-model="basicForm.partName"
                                    style="font-size: 18px; font-weight: bold; width: 100%;" filterable
                                    placeholder="選擇部件">
                                    <el-option v-for="(item, index) in partNameSelect" :key="item.value"
                                        :label="item.label" :value="item.value">
                                        <div :style="{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                                            padding: '4px 8px', borderRadius: '4px',
                                            backgroundColor: colorConfigs[index % colorConfigs.length].bgColor,
                                            color: colorConfigs[index % colorConfigs.length].textColor
                                        }">
                                            <span style="flex: 1; font-weight: bold;">{{ item.label }}</span>
                                        </div>
                                    </el-option>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <Grid />
                                        </el-icon>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <!-- 尺碼 -->
                        <el-col :sm="12" :md="3">
                            <el-form-item label="尺碼" prop="size"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-select v-model="basicForm.size"
                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                    <el-option v-for="item in sizeOptions" :key="item" :label="item" :value="item">
                                    </el-option>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <Sort />
                                        </el-icon>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <!-- 鞋名 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="鞋名" prop="shoeName"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="basicForm.shoeName" placeholder="輸入鞋名"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <!-- 版本號 -->
                        <el-col :sm="12" :md="3">
                            <el-form-item label="版本號" prop="revision"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="basicForm.revision" placeholder="版本號"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <Document />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="12">
                        <!-- 材質 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="材質" prop="material"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="basicForm.material" placeholder="輸入材質"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <Box />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <!-- 供應商 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="供應商" prop="supplier"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="basicForm.supplier" placeholder="輸入供應商"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #5B9D6F;">
                                            <Shop />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <!-- 採購日期 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="採購日期" prop="purchaseDate"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-date-picker v-model="basicForm.purchaseDate" type="date" placeholder="選擇日期"
                                    style="font-size: 18px; font-weight: bold; width: 100%;"
                                    value-format="YYYY-MM-DD">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="12">
                        <!-- 備註 -->
                        <el-col :span="19">
                            <el-form-item label="備註" prop="remark"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="basicForm.remark" type="textarea" :rows="2" placeholder="輸入備註"
                                    style="font-size: 18px; font-weight: bold;">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- 操作按鈕 -->
                    <el-row style="margin-top: 10px; margin-bottom: 10px;">
                        <el-col :span="24" style="text-align: center;">
                            <el-button type="primary" size="large" @click="handleCreate"
                                style="font-size: 18px; font-weight: bold; margin-right: 10px;">
                                <el-icon style="margin-right: 5px;">
                                    <Plus />
                                </el-icon>
                                新增
                            </el-button>
                            <el-button type="warning" size="large" @click="handleUpdate"
                                :disabled="!currentId"
                                style="font-size: 18px; font-weight: bold; margin-right: 10px;">
                                <el-icon style="margin-right: 5px;">
                                    <Edit />
                                </el-icon>
                                修改
                            </el-button>
                            <el-button type="danger" size="large" @click="handleDelete"
                                :disabled="!currentId"
                                style="font-size: 18px; font-weight: bold; margin-right: 10px;">
                                <el-icon style="margin-right: 5px;">
                                    <Delete />
                                </el-icon>
                                刪除
                            </el-button>
                            <el-button size="large" @click="handleReset"
                                style="font-size: 18px; font-weight: bold;">
                                <el-icon style="margin-right: 5px;">
                                    <Refresh />
                                </el-icon>
                                重置
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>

        <!-- 基本資料列表 -->
        <el-row style="margin-top: 15px;">
            <el-col :span="24">
                <div style="background-color: #fff; border-radius: 5px; padding: 10px; border: 1px solid #e8f0f8;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="margin: 0; font-size: 20px; font-weight: bold; color: #5B9D6F;">
                            <el-icon style="vertical-align: middle; margin-right: 5px;">
                                <List />
                            </el-icon>
                            基本資料列表
                        </h3>
                        <el-tag type="info" size="large" effect="plain">
                            共 {{ basicList.length }} 條記錄
                        </el-tag>
                    </div>
                    <vxe-table :data="basicList" border stripe height="500" show-overflow-tooltip
                        :row-config="{ isHover: true }" :column-config="{ resizable: true }"
                        @cell-click="handleCellClick">
                        <vxe-column field="moldType" title="模具類型" width="120" align="center"></vxe-column>
                        <vxe-column field="moldNo" title="模具編號" width="150" align="center"></vxe-column>
                        <vxe-column field="partName" title="部件名稱" width="150" align="center"></vxe-column>
                        <vxe-column field="size" title="尺碼" width="100" align="center"></vxe-column>
                        <vxe-column field="shoeName" title="鞋名" width="150" align="center"></vxe-column>
                        <vxe-column field="revision" title="版本號" width="100" align="center"></vxe-column>
                        <vxe-column field="material" title="材質" width="120" align="center"></vxe-column>
                        <vxe-column field="supplier" title="供應商" width="150" align="center"></vxe-column>
                        <vxe-column field="purchaseDate" title="採購日期" width="120" align="center"></vxe-column>
                        <vxe-column field="status" title="狀態" width="100" align="center">
                            <template #default="{ row }">
                                <el-tag :type="row.status === '正常' ? 'success' : 'danger'" size="small">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </vxe-column>
                        <vxe-column field="remark" title="備註" width="200" align="center"></vxe-column>
                        <vxe-column field="createTime" title="創建時間" width="180" align="center">
                            <template #default="{ row }">
                                {{ formatDateTime(row.createTime) }}
                            </template>
                        </vxe-column>
                    </vxe-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
    Tools, Search, Grid, Sort, User, Document, Box, Shop,
    Plus, Edit, Delete, Refresh, List
} from '@element-plus/icons-vue';

// 表單數據
const basicForm = reactive({
    moldType: '',
    moldNo: '',
    partName: '',
    size: '',
    shoeName: '',
    revision: '',
    material: '',
    supplier: '',
    purchaseDate: '',
    remark: ''
});

// 表單驗證規則
const basicFormRules = {
    moldType: [{ required: true, message: '請選擇模具類型', trigger: 'change' }],
    moldNo: [{ required: true, message: '請輸入模具編號', trigger: 'blur' }]
};

// 當前選中的記錄ID
const currentId = ref<number | null>(null);

// 下拉選項
const moldTypeSelect = ref<any[]>([]);
const partNameSelect = ref<any[]>([]);
const sizeOptions = ref<string[]>([]);

// 基本資料列表
const basicList = ref<any[]>([]);

// 顏色配置
const colorConfigs = [
    { bgColor: '#f0f8f5', textColor: '#5b9d6f', tagColor: '#7ab89a' },
    { bgColor: '#f5f0f8', textColor: '#8b6f9d', tagColor: '#b09ac0' },
    { bgColor: '#f8f5f0', textColor: '#b87d4a', tagColor: '#d9a87a' },
    { bgColor: '#f0f5f8', textColor: '#4a7db8', tagColor: '#7aa8d9' },
];

// 獲取基礎數據
const getChartsBasic = async (): Promise<void> => {
    try {
        const res = await axios.post('/v1/tooling/get-charts-basic', {});
        if (res.data && res.data.infos) {
            if (res.data.infos.moldTypeList) {
                moldTypeSelect.value = res.data.infos.moldTypeList.map((item: any) => ({
                    label: item,
                    value: item
                }));
            }
            if (res.data.infos.partNameList) {
                partNameSelect.value = res.data.infos.partNameList.map((item: any) => ({
                    label: item,
                    value: item
                }));
            }
            if (res.data.infos.sizeList) {
                sizeOptions.value = res.data.infos.sizeList;
            }
        }
    } catch (error) {
        console.error('獲取基礎數據失敗:', error);
    }
};

// 查詢基本資料列表
const queryBasicList = async (): Promise<void> => {
    try {
        const res = await axios.post('/v1/tooling/basic/query', {});
        if (res.data && res.data.data) {
            basicList.value = res.data.data;
        }
    } catch (error) {
        console.error('查詢基本資料失敗:', error);
        ElMessage.error('查詢基本資料失敗');
    }
};

// 模具類型變化
const handleMoldTypeChange = (): void => {
    // 可以在這裡添加聯動邏輯
};

// 單元格點擊事件
const handleCellClick = ({ row }: any): void => {
    currentId.value = row.id;
    basicForm.moldType = row.moldType;
    basicForm.moldNo = row.moldNo;
    basicForm.partName = row.partName;
    basicForm.size = row.size;
    basicForm.shoeName = row.shoeName;
    basicForm.revision = row.revision;
    basicForm.material = row.material;
    basicForm.supplier = row.supplier;
    basicForm.purchaseDate = row.purchaseDate;
    basicForm.remark = row.remark;
};

// 新增
const handleCreate = async (): Promise<void> => {
    if (!basicForm.moldType || !basicForm.moldNo) {
        ElMessage.warning('請填寫必填字段');
        return;
    }

    try {
        const res = await axios.post('/v1/tooling/basic/create', basicForm);
        if (res.data.infos > 0) {
            ElMessage.success('新增成功');
            handleReset();
            queryBasicList();
        }
    } catch (error: any) {
        console.error('新增失敗:', error);
        ElMessage.error(error.response?.data?.detail || '新增失敗');
    }
};

// 修改
const handleUpdate = async (): Promise<void> => {
    if (!currentId.value) {
        ElMessage.warning('請先選擇一條記錄');
        return;
    }

    try {
        const res = await axios.post('/v1/tooling/basic/update', {
            id: currentId.value,
            ...basicForm
        });
        if (res.data.infos > 0) {
            ElMessage.success('修改成功');
            handleReset();
            queryBasicList();
        }
    } catch (error: any) {
        console.error('修改失敗:', error);
        ElMessage.error(error.response?.data?.detail || '修改失敗');
    }
};

// 刪除
const handleDelete = async (): Promise<void> => {
    if (!currentId.value) {
        ElMessage.warning('請先選擇一條記錄');
        return;
    }

    try {
        await ElMessageBox.confirm('確定要刪除此記錄嗎？', '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
        });

        const res = await axios.post('/v1/tooling/basic/delete', null, {
            params: { id: currentId.value }
        });
        if (res.data.infos > 0) {
            ElMessage.success('刪除成功');
            handleReset();
            queryBasicList();
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('刪除失敗:', error);
            ElMessage.error(error.response?.data?.detail || '刪除失敗');
        }
    }
};

// 重置
const handleReset = (): void => {
    currentId.value = null;
    basicForm.moldType = '';
    basicForm.moldNo = '';
    basicForm.partName = '';
    basicForm.size = '';
    basicForm.shoeName = '';
    basicForm.revision = '';
    basicForm.material = '';
    basicForm.supplier = '';
    basicForm.purchaseDate = '';
    basicForm.remark = '';
};

// 格式化日期時間
const formatDateTime = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 組件掛載
onMounted(() => {
    getChartsBasic();
    queryBasicList();
});
</script>

<style scoped>
:deep(.vxe-table) {
    font-size: 14px;
}

:deep(.vxe-table .vxe-body--row.row--hover) {
    background-color: #f5f7fa;
}
</style>
