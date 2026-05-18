<template>
    <div>
        <!-- 報廢管理區域 -->
        <el-row style="border-radius: 5px; border: 1px solid #e8f0f8;">
            <!-- ✅ 頂部邊框顏色區分：報廢用紅色 -->
            <el-col
                style="padding-top: 10px; border: 1px solid #e8f0f8; min-width: 520px; background-color: #fafbfc; border-top: 4px solid #C0392B;">
                <el-form :model="scrapForm" ref="ScrapForm_Form" size="large" :rules="scrapFormRules">
                    <el-row :gutter="12">
                        <!-- 模具類型選擇 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="模具類型" prop="moldType"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-select v-model="scrapForm.moldType" filterable
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
                                        <el-icon style="color: #C0392B;">
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
                                <el-input v-model="scrapForm.moldNo" placeholder="輸入模具編號"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #C0392B;">
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
                                <el-select v-model="scrapForm.partName"
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
                                        <el-icon style="color: #C0392B;">
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
                                <el-select v-model="scrapForm.size"
                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                    <el-option v-for="item in sizeOptions" :key="item" :label="item" :value="item">
                                    </el-option>
                                    <template #prefix>
                                        <el-icon style="color: #C0392B;">
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
                                <el-input v-model="scrapForm.shoeName" placeholder="輸入鞋名"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #C0392B;">
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <!-- 報廢數量 -->
                        <el-col :sm="12" :md="4">
                            <el-form-item label="報廢數量" prop="quantity"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input-number v-model="scrapForm.quantity" :min="1" :step="1"
                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                </el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="12">
                        <!-- 倉庫 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="倉庫" prop="warehouse"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-select v-model="scrapForm.warehouse"
                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                    <el-option v-for="(item, index) in warehouseSelect" :key="item.value"
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
                                        <el-icon style="color: #C0392B;">
                                            <OfficeBuilding />
                                        </el-icon>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <!-- 庫位 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="庫位" prop="location"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="scrapForm.location" placeholder="輸入庫位"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #C0392B;">
                                            <Location />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <!-- 申請人 -->
                        <el-col :sm="12" :md="5">
                            <el-form-item label="申請人" prop="applicant"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="scrapForm.applicant" placeholder="申請人"
                                    style="font-size: 18px; font-weight: bold;" clearable>
                                    <template #prefix>
                                        <el-icon style="color: #C0392B;">
                                            <UserFilled />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="12">
                        <!-- 報廢原因 -->
                        <el-col :span="14">
                            <el-form-item label="報廢原因" prop="reason"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="scrapForm.reason" type="textarea" :rows="2" placeholder="請填寫報廢原因"
                                    style="font-size: 18px; font-weight: bold;">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="12">
                        <!-- 備註 -->
                        <el-col :span="19">
                            <el-form-item label="備註" prop="remark"
                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                <el-input v-model="scrapForm.remark" type="textarea" :rows="2" placeholder="輸入備註"
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
                                提交報廢申請
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

        <!-- 報廢記錄列表 -->
        <el-row style="margin-top: 15px;">
            <el-col :span="24">
                <div style="background-color: #fff; border-radius: 5px; padding: 10px; border: 1px solid #e8f0f8;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="margin: 0; font-size: 20px; font-weight: bold; color: #C0392B;">
                            <el-icon style="vertical-align: middle; margin-right: 5px;">
                                <Delete />
                            </el-icon>
                            報廢記錄列表
                        </h3>
                        <el-tag type="info" size="large" effect="plain">
                            共 {{ scrapList.length }} 條記錄
                        </el-tag>
                    </div>
                    <vxe-table :data="scrapList" border stripe height="500" show-overflow-tooltip
                        :row-config="{ isHover: true }" :column-config="{ resizable: true }"
                        @cell-click="handleCellClick">
                        <vxe-column field="moldType" title="模具類型" width="120" align="center"></vxe-column>
                        <vxe-column field="moldNo" title="模具編號" width="150" align="center"></vxe-column>
                        <vxe-column field="partName" title="部件名稱" width="150" align="center"></vxe-column>
                        <vxe-column field="size" title="尺碼" width="100" align="center"></vxe-column>
                        <vxe-column field="quantity" title="報廢數量" width="120" align="center">
                            <template #default="{ row }">
                                <el-tag type="danger" size="large" effect="dark">-{{ row.quantity }}</el-tag>
                            </template>
                        </vxe-column>
                        <vxe-column field="shoeName" title="鞋名" width="150" align="center"></vxe-column>
                        <vxe-column field="warehouse" title="倉庫" width="120" align="center"></vxe-column>
                        <vxe-column field="location" title="庫位" width="120" align="center"></vxe-column>
                        <vxe-column field="reason" title="報廢原因" width="200" align="center"></vxe-column>
                        <vxe-column field="applicant" title="申請人" width="100" align="center"></vxe-column>
                        <vxe-column field="status" title="狀態" width="100" align="center">
                            <template #default="{ row }">
                                <el-tag :type="getStatusType(row.status)" size="small">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </vxe-column>
                        <vxe-column field="approveBy" title="審批人" width="100" align="center"></vxe-column>
                        <vxe-column field="approveRemark" title="審批備註" width="150" align="center"></vxe-column>
                        <vxe-column field="applyDate" title="申請日期" width="180" align="center">
                            <template #default="{ row }">
                                {{ formatDateTime(row.applyDate) }}
                            </template>
                        </vxe-column>
                    </vxe-table>
                </div>
            </el-col>
        </el-row>

        <!-- 審批對話框 -->
        <el-dialog v-model="approveDialogVisible" title="審批報廢申請" width="600px">
            <el-form :model="approveForm" label-width="100px">
                <el-form-item label="審批狀態">
                    <el-radio-group v-model="approveForm.status">
                        <el-radio label="通過">通過</el-radio>
                        <el-radio label="拒絕">拒絕</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="審批人">
                    <el-input v-model="approveForm.approveBy" placeholder="審批人" />
                </el-form-item>
                <el-form-item label="審批備註">
                    <el-input v-model="approveForm.approveRemark" type="textarea" :rows="3" placeholder="審批備註" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="approveDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleApprove">確認審批</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import {
    Tools, Search, Grid, Sort, User, UserFilled, OfficeBuilding, Location,
    Plus, Refresh, Delete
} from '@element-plus/icons-vue';

// 表單數據
const scrapForm = reactive({
    moldType: '',
    moldNo: '',
    partName: '',
    size: '',
    shoeName: '',
    quantity: 1,
    warehouse: '',
    location: '',
    reason: '',
    applicant: '',
    remark: ''
});

// 表單驗證規則
const scrapFormRules = {
    moldType: [{ required: true, message: '請選擇模具類型', trigger: 'change' }],
    moldNo: [{ required: true, message: '請輸入模具編號', trigger: 'blur' }],
    reason: [{ required: true, message: '請填寫報廢原因', trigger: 'blur' }],
    warehouse: [{ required: true, message: '請選擇倉庫', trigger: 'change' }]
};

// 當前選中的記錄ID
const currentId = ref<number | null>(null);

// 下拉選項
const moldTypeSelect = ref<any[]>([]);
const partNameSelect = ref<any[]>([]);
const sizeOptions = ref<string[]>([]);
const warehouseSelect = ref<any[]>([]);

// 報廢記錄列表
const scrapList = ref<any[]>([]);

// 審批對話框
const approveDialogVisible = ref(false);
const approveForm = reactive({
    id: 0,
    status: '通過',
    approveBy: '',
    approveRemark: ''
});

// 顏色配置
const colorConfigs = [
    { bgColor: '#fff5f5', textColor: '#c0392b', tagColor: '#e57373' },
    { bgColor: '#f5f0f8', textColor: '#8b6f9d', tagColor: '#b09ac0' },
    { bgColor: '#f0f5f8', textColor: '#4a7db8', tagColor: '#7aa8d9' },
    { bgColor: '#f8f0f5', textColor: '#9f5a7a', tagColor: '#d98fab' },
];

// 獲取狀態類型
const getStatusType = (status: string): string => {
    switch (status) {
        case '待審批': return 'warning';
        case '通過': return 'success';
        case '拒絕': return 'danger';
        default: return 'info';
    }
};

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
            if (res.data.infos.warehouseList) {
                warehouseSelect.value = res.data.infos.warehouseList.map((item: any) => ({
                    label: item,
                    value: item
                }));
            }
        }
    } catch (error) {
        console.error('獲取基礎數據失敗:', error);
    }
};

// 查詢報廢記錄列表
const queryScrapList = async (): Promise<void> => {
    try {
        const res = await axios.post('/v1/tooling/scrap/query', {});
        if (res.data && res.data.data) {
            scrapList.value = res.data.data;
        }
    } catch (error) {
        console.error('查詢報廢記錄失敗:', error);
        ElMessage.error('查詢報廢記錄失敗');
    }
};

// 模具類型變化
const handleMoldTypeChange = (): void => {
    // 可以在這裡添加聯動邏輯
};

// 單元格點擊事件
const handleCellClick = ({ row }: any): void => {
    currentId.value = row.id;
    if (row.status === '待審批') {
        approveForm.id = row.id;
        approveForm.approveBy = '';
        approveForm.approveRemark = '';
        approveForm.status = '通過';
        approveDialogVisible.value = true;
    }
};

// 提交報廢申請
const handleCreate = async (): Promise<void> => {
    if (!scrapForm.moldType || !scrapForm.moldNo || !scrapForm.reason || !scrapForm.warehouse) {
        ElMessage.warning('請填寫必填字段');
        return;
    }

    try {
        const res = await axios.post('/v1/tooling/scrap/create', scrapForm);
        if (res.data.infos > 0) {
            ElMessage.success('報廢申請提交成功');
            handleReset();
            queryScrapList();
        }
    } catch (error: any) {
        console.error('報廢申請提交失敗:', error);
        ElMessage.error(error.response?.data?.detail || '報廢申請提交失敗');
    }
};

// 審批
const handleApprove = async (): Promise<void> => {
    try {
        const res = await axios.post('/v1/tooling/scrap/approve', approveForm);
        if (res.data.infos > 0) {
            ElMessage.success('審批成功');
            approveDialogVisible.value = false;
            queryScrapList();
        }
    } catch (error: any) {
        console.error('審批失敗:', error);
        ElMessage.error(error.response?.data?.detail || '審批失敗');
    }
};

// 重置
const handleReset = (): void => {
    currentId.value = null;
    scrapForm.moldType = '';
    scrapForm.moldNo = '';
    scrapForm.partName = '';
    scrapForm.size = '';
    scrapForm.shoeName = '';
    scrapForm.quantity = 1;
    scrapForm.warehouse = '';
    scrapForm.location = '';
    scrapForm.reason = '';
    scrapForm.applicant = '';
    scrapForm.remark = '';
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
    queryScrapList();
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
