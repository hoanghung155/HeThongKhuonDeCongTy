<template>
    <div>
        <el-row style="border-radius: 5px; border: 1px solid #e8f0f8;">
            <!-- 尺碼數據顯示區 -->
            <el-col>
                <el-row
                    style="border: 1px solid #e8f0f8; box-shadow: 0 2px 8px 0 rgba(91, 141, 184, 0.04); background-color: #fafbfc; border-radius: 5px; flex-wrap: wrap-reverse;"
                    justify="center">

                    <!-- 📥 左側/下側：入庫記錄 (淺藍主題) -->
                    <el-col :xs="24" :sm="12"
                        style="padding: 5px; border: 1px solid #e8f0f8; border-radius: 5px; background-color: #FFFFFF; min-width: 520px; min-height: 92vh; border-top: 4px solid #5B8DB8;">
                        <el-scrollbar>
                            <el-card shadow="hover" style="height: 100%;">
                                <template #header>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-weight: bold; font-size: 18px; color: #5B8DB8;">
                                            📥 待入倉信息
                                        </span>
                                        <el-tag effect="plain"
                                            style="font-weight: bold; font-size: 16px; color: #4A7BA7; border-color: #C5D8EA;">
                                            當次入庫數：{{ totalNum }}
                                        </el-tag>
                                    </div>
                                </template>

                                <!-- 操作按鈕 -->
                                <div style="margin-top: 2px; border-top: 1px solid #e8f0f8; padding-top: 16px;">
                                    <el-row :gutter="8" style="margin-bottom: 8px;">
                                        <el-col :span="12">
                                            <el-button type="primary" plain round :loading="inputLoading"
                                                @click="confirmInbound" style="width: 100%;" size="large">
                                                <el-icon>
                                                    <Document />
                                                </el-icon>確認入庫
                                            </el-button>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-button type="info" plain round @click="drawer = true"
                                                style="width: 100%;" size="large">
                                                <el-icon>
                                                    <Search />
                                                </el-icon>入庫歷史
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </div>

                                <!-- 入庫記錄表格 -->
                                <div style="margin-top: 16px; border: 1px solid #e8f0f8; border-radius: 4px;">
                                    <vxe-table v-if="tableUpShow" ref="ScanRecord_Table" :loading="loading" border
                                        :auto-resize="true" highlight-hover-row highlight-current-row resizable stripe
                                        show-overflow keep-source :height="tableHeight * 0.85"
                                        :header-config="{ height: 50 }" :row-style="rowStyle" :cell-style="cellStyle"
                                        :row-config="{ isCurrent: true, isHover: true, keyField: 'id', height: 50 }"
                                        :data="scanRecords" :mouse-config="{ selected: true }"
                                        :keyboard-config="{ isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true, isChecked: true }"
                                        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true, showIcon: false }"
                                        class="custom-large-table">
                                        <vxe-column type="seq" title="#" min-width="40"></vxe-column>

                                        <!-- ✅ Tooling 真實字段 -->
                                        <vxe-column field="moldNo" title="模具編號" min-width="120"></vxe-column>
                                        <vxe-column field="shoeName" title="鞋名" min-width="150"></vxe-column>
                                        <vxe-column field="partName" title="部件名稱" min-width="80"
                                            max-width="180"></vxe-column>
                                        <vxe-column field="size" title="Size" min-width="80" max-width="180"
                                            align="center"></vxe-column>

                                        <vxe-column field="quantity" title="數量" min-width="60" align="center"
                                            :edit-render="{ name: 'input', attrs: { type: 'number', min: 1, step: 1 }, events: { blur: handleQtyEdit } }">
                                        </vxe-column>

                                        <vxe-column field="warehouse" title="倉庫" min-width="100"></vxe-column>
                                        <vxe-column field="location" title="庫位" min-width="100"></vxe-column>
                                        <vxe-column field="deliveryUnit" title="交貨單位" min-width="120"></vxe-column>
                                        <vxe-column field="scanTime" title="入庫時間" min-width="120"></vxe-column>
                                        <vxe-column field="operator" title="操作人" min-width="100"></vxe-column>
                                        <vxe-column field="revision" title="版本號" min-width="80"></vxe-column>

                                        <vxe-column title="操作" min-width="60" fixed="right">
                                            <template #default="{ row }">
                                                <el-button type="danger" size="small" plain circle
                                                    @click="removeScanRecord(row)">
                                                    <el-icon>
                                                        <Delete />
                                                    </el-icon>
                                                </el-button>
                                            </template>
                                        </vxe-column>
                                    </vxe-table>
                                </div>
                            </el-card>
                        </el-scrollbar>
                    </el-col>

                    <!-- 🔧 右側/上側：入庫操作區 -->
                    <el-col :xs="24" :sm="12"
                        style="padding: 5px; border: 1px solid #e8f0f8; border-radius: 5px; background-color: #FFFFFF; min-width: 520px; min-height: 92vh; border-top: 4px solid #5B8DB8;">
                        <el-scrollbar>
                            <el-card shadow="hover" style="height: 100%;">
                                <template #header>
                                    <div style="display: flex; align-items: center;">
                                        <span
                                            style="font-weight: bold; font-size: 18px; color: #5B8DB8; margin-right: 20px;">🔧
                                            入庫操作</span>
                                        <el-tag effect="plain"
                                            style="font-weight: bold; font-size: 18px; color: #4A7BA7; border-color: #C5D8EA;">
                                            單號:IN-20240416-{{ totalNum }}
                                        </el-tag>
                                    </div>
                                </template>

                                <el-form :model="inboundInfo" ref="InboundInfo_Form" size="large"
                                    :rules="inboundInfoRules">
                                    <el-row :gutter="12">
                                        <!-- ✅ 新增：入庫類型 -->
                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="入庫類型" prop="inType"
                                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                                <el-select v-model="inboundInfo.inType"
                                                    style="font-size: 18px; font-weight: bold; width: 100%;" filterable
                                                    remote reserve-keyword placeholder="輸入入庫類型搜索"
                                                    :remote-method="remoteInType" :loading="inputLoading"
                                                    @change="handleInTypeChange" clearable>
                                                    <el-option v-for="item in inTypeOptions" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                        <div :style="{
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                                                            padding: '4px 8px', borderRadius: '4px',
                                                            backgroundColor: item.bgColor || '#F0F4F8',
                                                            color: item.textColor || '#4A7BA7'
                                                        }">
                                                            <span style="flex: 1; font-weight: bold;">{{ item.label
                                                                }}</span>
                                                            <el-tag size="small" effect="dark"
                                                                :color="item.tagColor || '#7AAED9'"
                                                                style="margin-left: 8px;">
                                                                {{ item.value }}
                                                            </el-tag>
                                                        </div>
                                                    </el-option>
                                                    <template #prefix>
                                                        <el-icon style="color: #5B8DB8;">
                                                            <Download />
                                                        </el-icon>
                                                    </template>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="模具類型" prop="moldType"
                                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                                <el-select v-model="inboundInfo.moldType" filterable
                                                    :disabled="inputSelect" :default-first-option="true"
                                                    placeholder="請選擇模具類型" @change="handleMoldTypeChange"
                                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                                    <el-option v-for="(item, index) in moldTypeSelect" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                        <div
                                                            :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 8px', borderRadius: '4px', backgroundColor: colorConfigs[index % colorConfigs.length].bgColor, color: colorConfigs[index % colorConfigs.length].textColor }">
                                                            <span style="flex: 1; font-weight: bold;">{{ item.label
                                                            }}</span>
                                                            <el-tag size="small" effect="dark"
                                                                :color="colorConfigs[index % colorConfigs.length].tagColor"
                                                                style="margin-left: 8px;">{{ item.value }}</el-tag>
                                                        </div>
                                                    </el-option>
                                                    <template #prefix><el-icon style="color: #5B8DB8;">
                                                            <Tools />
                                                        </el-icon></template>
                                                    <template #empty>
                                                        <div style="padding: 8px; text-align: center; color: #999;">暫無數據
                                                        </div>
                                                    </template>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="模具編號" prop="moldNo"
                                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                                <el-select v-model="inboundInfo.moldNo" placeholder="輸入或選擇模具編號"
                                                    filterable remote :remote-method="remoteMoldNo"
                                                    @change="handleMoldNoChange" :loading="inputLoading"
                                                    :disabled="inputSelect" reserve-keyword
                                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                                    <el-option v-for="(item, index) in moldNoSelect" :key="item.value"
                                                        :label="item.value" :value="item.value">
                                                        <div
                                                            :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 8px', borderRadius: '4px', backgroundColor: colorConfigs[index % colorConfigs.length].bgColor, color: colorConfigs[index % colorConfigs.length].textColor }">
                                                            <span style="flex: 1; font-weight: bold;">{{ item.value
                                                            }}</span>
                                                            <el-tag size="small" effect="dark"
                                                                :color="colorConfigs[index % colorConfigs.length].tagColor"
                                                                style="margin-left: 8px;">{{ item.label }}</el-tag>
                                                        </div>
                                                    </el-option>
                                                    <template #prefix><el-icon style="color: #5B8DB8;">
                                                            <Search />
                                                        </el-icon></template>
                                                    <template #empty>
                                                        <div style="padding: 8px; text-align: center; color: #999;">
                                                            未找到匹配項，請輸入完整名稱</div>
                                                    </template>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="部件名稱" prop="partName"
                                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                                <el-select v-model="inboundInfo.partName" filterable reserve-keyword
                                                    clearable :disabled="inputSelect" :default-first-option="true"
                                                    placeholder="請選擇部件" @change="handlePartNameChange"
                                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                                    <el-option v-for="(item, index) in partNameSelect" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                        <div
                                                            :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 8px', borderRadius: '4px', backgroundColor: colorConfigs[index % colorConfigs.length].bgColor, color: colorConfigs[index % colorConfigs.length].textColor }">
                                                            <span style="flex: 1; font-weight: bold;">{{ item.label
                                                            }}</span>
                                                            <el-tag size="small" effect="dark"
                                                                :color="colorConfigs[index % colorConfigs.length].tagColor"
                                                                style="margin-left: 8px;">{{ item.value }}</el-tag>
                                                        </div>
                                                    </el-option>
                                                    <template #prefix><el-icon style="color: #5B8DB8;">
                                                            <Grid />
                                                        </el-icon></template>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="倉庫" prop="warehouse"
                                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                                <el-select v-model="inboundInfo.warehouse" :disabled="inputSelect"
                                                    style="font-size: 18px; font-weight: bold; width: 100%;" filterable
                                                    remote reserve-keyword placeholder="輸入倉庫名稱搜索"
                                                    :remote-method="remoteWarehouse" :loading="inputLoading"
                                                    @change="handleWarehouseChange" clearable>
                                                    <el-option v-for="item in warehouseOptions" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                        <div
                                                            :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 8px', borderRadius: '4px', backgroundColor: item.bgColor || '#FAFBFC', color: item.textColor || '#4A7BA7' }">
                                                            <span style="flex: 1; font-weight: bold;">{{ item.label
                                                            }}</span>
                                                            <el-tag size="small" effect="dark"
                                                                :color="item.tagColor || '#C5D8EA'"
                                                                style="margin-left: 8px;">ID:{{ item.id }}</el-tag>
                                                        </div>
                                                    </el-option>
                                                    <template #prefix><el-icon style="color: #5B8DB8;">
                                                            <OfficeBuilding />
                                                        </el-icon></template>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="庫位" prop="location"
                                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                                <el-select v-model="inboundInfo.location"
                                                    :disabled="!inboundInfo.warehouse || inputSelect"
                                                    style="font-size: 18px; font-weight: bold; width: 100%;" filterable
                                                    placeholder="選擇庫位" clearable :default-first-option="true"
                                                    @change="handleLocationChange">
                                                    <el-option v-for="item in locationOptions" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                        <div
                                                            :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 8px', borderRadius: '4px', backgroundColor: item.bgColor || '#FAFBFC', color: item.textColor || '#4A7BA7' }">
                                                            <span style="flex: 1; font-weight: bold;">{{ item.label
                                                            }}</span>
                                                            <el-tag size="small" effect="dark"
                                                                :color="item.tagColor || '#C5D8EA'"
                                                                style="margin-left: 8px;">{{ item.value }}</el-tag>
                                                        </div>
                                                    </el-option>
                                                    <template #prefix><el-icon style="color: #5B8DB8;">
                                                            <Location />
                                                        </el-icon></template>
                                                    <template #empty>
                                                        <div style="padding: 8px; text-align: center; color: #999;">{{
                                                            !inboundInfo.warehouse ? '請先選擇倉庫' : '暫無可用庫位' }}</div>
                                                    </template>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="交貨單位" prop="deliveryUnit"
                                                style="margin-left:10px; font-size: 18px; font-weight: bold;">
                                                <el-select v-model="inboundInfo.deliveryUnit" :disabled="inputSelect"
                                                    :default-first-option="true" placeholder="請選擇交貨單位"
                                                    @change="handleDeliveryUnitChange"
                                                    style="font-size: 18px; font-weight: bold; width: 100%;">
                                                    <el-option v-for="(item, index) in deliveryUnitSelect"
                                                        :key="item.value" :label="item.label" :value="item.value">
                                                        <div
                                                            :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 8px', borderRadius: '4px', backgroundColor: colorConfigs[index % colorConfigs.length].bgColor, color: colorConfigs[index % colorConfigs.length].textColor }">
                                                            <span style="flex: 1; font-weight: bold;">{{ item.label
                                                            }}</span>
                                                            <el-tag size="small" effect="dark"
                                                                :color="colorConfigs[index % colorConfigs.length].tagColor"
                                                                style="margin-left: 8px;">{{ item.value }}</el-tag>
                                                        </div>
                                                    </el-option>
                                                    <template #prefix><el-icon style="color: #5B8DB8;">
                                                            <Document />
                                                        </el-icon></template>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>

                                        <!-- ✅ 新增：出入單號 -->
                                        <el-col :sm="12" :md="12">
                                            <el-form-item label="出入單號" prop="inNumber"
                                                style="margin-left:10px;margin-right:20px; font-size: 18px; font-weight: bold;">
                                                <el-input v-model="inboundInfo.inNumber" clearable
                                                    style="font-size: 18px; font-weight: bold;" />
                                            </el-form-item>
                                        </el-col>

                                    </el-row>
                                </el-form>

                                <el-row :gutter="8">
                                    <el-col :span="12"
                                        style="margin-top: 10px; border-top: 1px solid #e8f0f8; padding-top:10px;">
                                        <div
                                            style="display: flex; justify-content: space-between; align-items: center;">
                                            <span
                                                style="font-weight: bold; font-size: 18px; margin-bottom: 10px;margin-top: 10px; color: #8C949E;">🔢
                                                輸入信息</span>
                                            <el-button @click="handleFullSetInbound" style="font-size: 16px;"
                                                type="primary" plain round>🧩
                                                全套入庫</el-button>
                                        </div>
                                        <el-form size="large">
                                            <el-row style="margin: 12px auto auto 12px;">
                                                <el-col :span="4" style="margin-bottom: 5px; margin-top: 10px;">
                                                    <span
                                                        style="height: 50px; font-size: 18px; font-weight: bold; color: #8C949E;">Size</span>
                                                </el-col>
                                                <el-col :span="20" style="margin-bottom: 5px;">
                                                    <el-form-item>
                                                        <el-input v-model="inPutsizeValue" :readonly="isListening"
                                                            :input-style="{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }"
                                                            clearable>
                                                            <template #append><el-icon style="color: #5B8DB8;">
                                                                    <Grid />
                                                                </el-icon></template>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="4" style="margin-top: 5px;">
                                                    <span
                                                        style="height: 50px; font-size: 18px; font-weight: bold; color: #8C949E;">數量</span>
                                                </el-col>
                                                <el-col :span="20">
                                                    <el-form-item>
                                                        <el-input v-model="qtyValue" :readonly="isListening"
                                                            :input-style="{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }"
                                                            style="width: 100%;">
                                                            <template #append><el-icon style="color: #5B8DB8;">
                                                                    <List />
                                                                </el-icon></template>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col style="margin-bottom: 5px; text-align:center;">
                                                    <el-button @click="handleNumKey('OK')"
                                                        style="width: 78%; height: 42px; font-size: 16px;"
                                                        type="primary" plain round>
                                                        <el-icon>
                                                            <Check />
                                                        </el-icon>確認
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-col>

                                    <el-col :span="12"
                                        style="margin-top: 10px; border-top: 1px solid #e8f0f8; padding-top: 10px;">
                                        <div style="margin-top: 20px;">
                                            <el-row justify="center" :gutter="5" style="margin: 12px auto auto 12px;">
                                                <el-col :span="8" v-for="num in [7, 8, 9, 4, 5, 6, 1, 2, 3]" :key="num"
                                                    style="margin-bottom: 5px;">
                                                    <el-button type="info" plain circle
                                                        @click="handleNumKey(num.toString())"
                                                        style="width: 100%; height: 42px; font-size: large; font-weight: bold; border-color: #e8f0f8;">{{
                                                            num }}</el-button>
                                                </el-col>
                                                <el-col :span="16" style="margin-bottom: 5px;">
                                                    <el-button type="info" plain @click="handleNumKey('0')"
                                                        style="width: 100%; height: 42px; font-size: large; font-weight: bold; border-color: #e8f0f8;">0</el-button>
                                                </el-col>
                                                <el-col :span="8" style="margin-bottom: 5px;">
                                                    <el-button type="danger" plain @click="handleNumKey('C')"
                                                        style="width: 100%; height: 42px; font-size: large; font-weight: bold; border-color: #e8f0f8;">
                                                        <el-icon>
                                                            <Back />
                                                        </el-icon>
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-col>
                                </el-row>

                                <!-- ✅ 像素級復刻：尺碼按鈕多行顯示細節 -->
                                <div
                                    style="margin-top: 10px; border-top: 1px solid #e8f0f8; padding-top: 10px; min-height: 22vh;">
                                    <el-row justify="center" :gutter="20">
                                        <el-col :span="8" v-for="(item, i) in sizeType" :key="i"
                                            style="border-radius: 5px; border: 1px solid #e8f0f8; padding: 1px; margin-bottom: 10px; text-align:center; background-color: #FFFFFF">
                                            <el-tag type="info" effect="plain" round :closable="false"
                                                class="size-native-btn" @click="handleSizeClick(item.Size)"
                                                style="margin: 5px; width: 96%; min-height: max(44px, 6vh); font-size: large; font-weight:bold">
                                                <div v-for="(line, idx) in item.Size" :key="idx">{{ line }}<br
                                                        v-if="idx < item.Size.length - 1"></div>
                                            </el-tag>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-card>
                        </el-scrollbar>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <!-- ==================== 📦 入庫歷史抽屜 ==================== -->
        <el-drawer ref="xDrawer" v-model="drawer" :with-header="true" direction="rtl" :size="drawerSize">
            <template #header>
                <h4 style="margin: 0; color: #5B8DB8;">📋 入庫歷史查詢</h4>
            </template>
            <warehousHistoryDrawer :table-height="tableHeight" :loading="loading" />
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onUnmounted, computed } from "vue";
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { Search, Document, Check, Delete, Download, Back, List, Grid, Tools, Location, OfficeBuilding } from '@element-plus/icons-vue';
import axios from '../../assets/js/index';
import date_Format from '../../assets/API/dateFormat';
import { handleError } from '../../assets/js/httpErrorHandler';
import warehousHistoryDrawer from './warehousHistoryDrawer.vue'

// ==================== 📦 類型定義 ====================
interface SelectOption {
    value: string | number; label: string; id?: number; status?: number;
    bgColor?: string; textColor?: string; tagColor?: string; default?: boolean;
}
interface SizeTypeItem { Size: string[]; default?: boolean; }

// ✅ Tooling 真實字段
interface ScanRecordItem {
    id: number;
    moldType: string | null;
    moldNo: string | null;
    partName: string | null;
    size: string | null;
    quantity: string | number;
    warehouse: string | null;
    location: string | null;
    shoeName: string | null;
    deliveryUnit: string | null;
    operator: string | null;
    scanTime: string | null;
    revision: string | null;
}

interface InboundInfoType {
    moldType: string | null;
    moldNo: string | null;
    partName: string | null;
    deliveryUnit: string | null;
    warehouse: string | null;
    location: string | null;
    operator: string | null;
    // ✅ 新增字段
    inType: string | null;      // 入庫類型
    inNumber: string | null;    // 出入單號
}

interface HistoryQueryItem { styleNo: string | null; startDate: string | null; endDate: string | null; }

// ==================== 📦 響應式狀態 ====================
const getWindowHeight = (): number => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const screenWidth = ref<number>(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const loading = ref<boolean>(false);
const inputLoading = ref<boolean>(false);
const tableHeight = ref<number>(800);
const drawer = ref<boolean>(false);
const xDrawer = ref<any>(null);
const tableUpShow = ref<boolean>(true);
const barcodeInput = ref<any>(null);
const InboundInfo_Form = ref<FormInstance | null>(null);
const ScanRecord_Table = ref<VxeTableInstance | null>(null);
const History_Table = ref<VxeTableInstance | null>(null);

const inPutsizeValue = ref<string>('');
const qtyValue = ref<string>('');
const isListening = ref<boolean>(false);
const inputSelect = ref<boolean>(false);

const scanRecords = reactive<ScanRecordItem[]>([]);
const historyData = reactive<any[]>([]);
const historyQuery = reactive<HistoryQueryItem>({ styleNo: null, startDate: null, endDate: null });

// ==================== 📦 下拉選項數據 ====================
const DEFAULT_MOLD_OPTIONS: SelectOption[] = [
    { value: 'Cloud_001', label: 'Cloud spkie 1500m', id: 101 },
    { value: 'Cloud_002', label: 'Cloud spkie 10000m', id: 102 },
    { value: 'Cloud_003', label: 'Cloud spark', id: 103 },
    { value: 'Cloud_004', label: 'Cloudmonster Hyper', id: 104 },
    { value: 'Cloudboom Max', label: 'Cloudboom Max', id: 105 },
    { value: '11-015-M-MID', label: 'Cloudboom Strike 2 (M)', id: 106 },
];
const moldNoSelect = ref<SelectOption[]>([...DEFAULT_MOLD_OPTIONS]);
const moldTypeSelect = ref<SelectOption[]>([
    { value: 'MOLD_001', label: '斬刀', default: true }, { value: 'MOLD_002', label: '網板' },
    { value: 'MOLD_003', label: '熱壓模' }, { value: 'MOLD_004', label: '楦頭' },
]);
const partNameSelect = ref<SelectOption[]>([
    { value: 'PART_001', label: '鞋面熱壓模', default: true }, { value: 'PART_002', label: '鞋舌熱壓模' },
]);
const deliveryUnitSelect = ref<SelectOption[]>([
    { value: 'UNIT_001', label: 'A1 線', default: true }, { value: 'UNIT_002', label: 'A2 線' },
]);

// ✅ 淺藍色系配置
const DEFAULT_WAREHOUSE_OPTIONS: SelectOption[] = [
    { value: '刀模房', label: '刀模房', id: 1, bgColor: '#FAFBFC', textColor: '#4A7BA7', tagColor: '#C5D8EA', default: true },
    { value: '楦頭倉', label: '楦頭倉', id: 2, bgColor: '#FFFFFF', textColor: '#3A6B97', tagColor: '#B5C8DA', default: false },
];
const warehouseOptions = ref<SelectOption[]>([...DEFAULT_WAREHOUSE_OPTIONS]);
const locationOptions = ref<SelectOption[]>([
    { value: 'A 區 -01 架', label: 'A 區 -01 架', id: 101, status: 1, bgColor: '#FAFBFC', textColor: '#4A7BA7', tagColor: '#C5D8EA', default: true },
]);

// ✅ 新增：入庫類型選項
const DEFAULT_IN_TYPE_OPTIONS: SelectOption[] = [
    { value: 'IN_001', label: '生產入庫', bgColor: '#F0F4F8', textColor: '#4A7BA7', tagColor: '#7AAED9', default: true },
    { value: 'IN_002', label: '採購入庫', bgColor: '#F0F8F4', textColor: '#4A9F7B', tagColor: '#7AD9A8' },
    { value: 'IN_003', label: '退貨入庫', bgColor: '#F8F0F4', textColor: '#9F4A7B', tagColor: '#D97AA8' },
    { value: 'IN_004', label: '調撥入庫', bgColor: '#F8F4F0', textColor: '#9F7B4A', tagColor: '#D9A87A' },
    { value: 'IN_005', label: '其他', bgColor: '#F5F5F5', textColor: '#6B6B6B', tagColor: '#A8A8A8' },
];
const inTypeOptions = ref<SelectOption[]>([...DEFAULT_IN_TYPE_OPTIONS]);

// 尺碼數據
const sizeType = ref<SizeTypeItem[]>([
    { Size: ['5#-6.5# W'] },
    { Size: ['7#-8# W'] },
    { Size: ['8.5#-9.5#', '7#-7.5# M'] },
    { Size: ['10#-11# W', '8#-9# M'] },
    { Size: ['9.5#-10.5# M'] },
    { Size: ['11#-12# M'] },
    { Size: ['12.5#-14# M'] }
]);

const inboundInfo = reactive<InboundInfoType>({
    moldType: null,
    moldNo: null,
    partName: null,
    deliveryUnit: null,
    warehouse: null,
    location: null,
    operator: null,
    inType: 'IN_001',      // ✅ 新增：默認值
    inNumber: null,        // ✅ 新增：默認值
});

const inboundInfoRules = reactive<FormRules>({
    moldNo: [{ required: true, message: '請選擇模具編號', trigger: 'change' }],
    moldType: [{ required: true, message: '請選擇模具類型', trigger: 'change' }],
    warehouse: [{ required: true, message: '請選擇倉庫', trigger: 'change' }],
    inType: [{ required: true, message: '請選擇入庫類型', trigger: 'change' }], // ✅ 新增驗證
});

const colorConfigs = [
    { bgColor: '#f0f4f8', textColor: '#5b8db8', tagColor: '#7aaed9' },
    { bgColor: '#f8f5f0', textColor: '#b87d4a', tagColor: '#d9a87a' },
    { bgColor: '#f0f8f5', textColor: '#4ab87d', tagColor: '#7ad9a8' },
    { bgColor: '#f8f0f5', textColor: '#b84a7d', tagColor: '#d97aa8' },
];

const drawerSize = computed<string>(() => screenWidth.value < 768 ? '100%' : '90%');
const totalNum = computed(() => scanRecords.reduce((sum, row) => sum + (parseInt(row.quantity as string) || 0), 0));
const rowStyle: VxeTablePropTypes.RowStyle<any> = () => ({ 'font-weight': 'bold' });
const cellStyle: VxeTablePropTypes.CellStyle<any> = ({ row, column }) => {
    if (column.field === 'quantity') return { backgroundColor: '#FFEBE6' };
};

// ==================== 🔄 下拉選單變更處理 ====================
const handleMoldTypeChange = (value: string | null): void => {
    if (!value) { inboundInfo.moldType = null; return; }
    const opt = moldTypeSelect.value.find(o => o.value === value);
    inboundInfo.moldType = value;
};

// ✅ 入庫類型變更
const handleInTypeChange = (value: string | null): void => {
    if (!value) { inboundInfo.inType = null; return; }
    const opt = inTypeOptions.value.find(o => o.value === value);
    if (opt) {
        inboundInfo.inType = value;
        ElMessage.success(`已選擇入庫類型: ${opt.label}`);
    }
};

const handleMoldNoChange = (value: string | null): void => {
    if (!value) { inboundInfo.moldNo = null; return; }
    const opt = moldNoSelect.value.find(o => o.value === value);
    if (opt) { 
        inboundInfo.moldNo = String(opt.value); 
        ElMessage.success(`已選擇: ${opt.label}`); 
    }
};

const handlePartNameChange = (value: string | null): void => {
    if (!value) { inboundInfo.partName = null; return; }
    const opt = partNameSelect.value.find(o => o.value === value);
    inboundInfo.partName = opt?.label || value;
};

const handleDeliveryUnitChange = (): void => { };

const handleWarehouseChange = (value: string | null): void => {
    inboundInfo.location = null; locationOptions.value = [];
    if (!value) { inboundInfo.warehouse = null; return; }
    const opt = warehouseOptions.value.find(o => o.value === value);
    if (opt) {
        inboundInfo.warehouse = opt.label;
        locationOptions.value = [{ value: 'A 區 -01 架', label: 'A 區 -01 架', id: 101, status: 1, bgColor: '#FAFBFC', textColor: '#4A7BA7', tagColor: '#C5D8EA', default: true }];
        ElMessage.success(`已選擇倉庫: ${opt.label}`);
    }
};

const handleLocationChange = (value: string | null): void => {
    if (!value) { inboundInfo.location = null; return; }
    const opt = locationOptions.value.find(o => o.value === value);
    if (opt) { inboundInfo.location = value; }
};

// ==================== 🔄 尺碼與數字鍵盤 ====================
const handleSizeClick = (sizeArr: string[]): void => { inPutsizeValue.value = sizeArr.join(','); };
const handleNumKey = (key: string): void => {
    if (key === 'C') qtyValue.value = '';
    else if (key === 'OK') handleInboundScan();
    else qtyValue.value += key;
};

const handleQtyEdit = ({ row }: { row: ScanRecordItem }) => {
    row.quantity = Number(row.quantity);
    if (row.quantity < 1) { row.quantity = 1; ElMessage.warning('數量不能小於 1'); }
};

// ==================== 🔄 核心業務：掃描入庫 ====================
const handleInboundScan = async (): Promise<void> => {
    // ✅ 新增驗證：入庫類型
    if (!inboundInfo.inType) { ElMessage.warning('請選擇入庫類型'); return; }

    if (!inboundInfo.moldType || !inboundInfo.moldNo || !inboundInfo.warehouse) { ElMessage.warning('請先完整填寫模具、倉庫信息'); return; }

    const inputQtyStr = qtyValue.value.trim();
    if (!inputQtyStr) { ElMessage.warning('請輸入數量'); return; }
    const inputQty = parseInt(inputQtyStr, 10);
    if (isNaN(inputQty) || inputQty <= 0) { ElMessage.warning('數量必須為大於 0 的整數'); return; }

    const selectedSize = inPutsizeValue.value.trim();
    if (!selectedSize) { ElMessage.warning('請選擇或輸入 Size'); return; }
    const sizeItem = sizeType.value.find(item => item.Size.join(',') === selectedSize);
    if (!sizeItem) { ElMessage.error(`未找到尺碼 ${selectedSize} 的訂單數據`); return; }
    if (!inboundInfo.warehouse) { ElMessage.warning('請先選擇倉庫'); return; }

    scanRecords.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        moldType: inboundInfo.moldType,
        moldNo: inboundInfo.moldNo,
        partName: inboundInfo.partName,
        size: selectedSize,
        quantity: inputQty,
        warehouse: inboundInfo.warehouse,
        location: inboundInfo.location,
        shoeName: null,
        deliveryUnit: inboundInfo.deliveryUnit,
        operator: null,
        scanTime: date_Format.dateFormat(new Date()),
        revision: '',
    });
    await nextTick(); ScanRecord_Table.value?.refreshColumn();
    ElNotification({ title: '✅ 添加成功', message: `${inboundInfo.partName} | ${selectedSize} × ${inputQty}`, position: 'bottom-left', showClose: false, type: 'success', duration: 2000 });
    inPutsizeValue.value = ''; qtyValue.value = '';
};

// ==================== 🧩 全套入庫 ====================
const handleFullSetInbound = async (): Promise<void> => {
    // ✅ 新增驗證：入庫類型
    if (!inboundInfo.inType) { ElMessage.warning('請選擇入庫類型'); return; }

    if (!inboundInfo.moldNo || !inboundInfo.warehouse) { ElMessage.warning('請先完整填寫模具、倉庫信息'); return; }

    const inputQtyStr = qtyValue.value.trim();
    const inputQty = parseInt(inputQtyStr, 10);
    if (isNaN(inputQty) || inputQty <= 0) { ElMessage.warning('數量必須為大於 0 的整數'); return; }

    try { await ElMessageBox.confirm(`確定要將當前模具的 ${sizeType.value.length} 個尺碼全部加入列表？(數量均設為${inputQty})`, '🧩 全套入庫確認', { confirmButtonText: '確定加入', cancelButtonText: '取消', type: 'info' }); }
    catch { return; }

    const currentTime = date_Format.dateFormat(new Date());
    const baseId = Date.now();
    const newRecords: ScanRecordItem[] = sizeType.value.map((item, idx) => ({
        id: baseId + Math.floor(Math.random() * 1000) + idx,
        moldType: inboundInfo.moldType,
        moldNo: inboundInfo.moldNo,
        partName: inboundInfo.partName,
        size: item.Size.join(','),
        quantity: inputQty,
        warehouse: inboundInfo.warehouse,
        location: inboundInfo.location,
        shoeName: null,
        deliveryUnit: inboundInfo.deliveryUnit,
        operator: null,
        scanTime: currentTime,
        revision: '',
    }));
    scanRecords.push(...newRecords); await nextTick(); ScanRecord_Table.value?.refreshColumn();
    ElNotification({ title: '✅ 全套入庫成功', message: `已批量添加 ${newRecords.length} 條尺碼記錄`, position: 'bottom-left', type: 'success', duration: 2500 });
};

// ==================== 🔄 遠程搜索 - 入庫類型 ✅ 新增 ====================
const remoteInType = (query: string): void => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const q = query?.trim();

    // 空查詢時恢復默認選項
    if (!q) {
        inTypeOptions.value = [...DEFAULT_IN_TYPE_OPTIONS];
        return;
    }

    inputLoading.value = true;
    searchTimeout = setTimeout(() => {
        // 過濾標簽和值，不區分大小寫
        inTypeOptions.value = DEFAULT_IN_TYPE_OPTIONS.filter(o =>
            o.label.toLowerCase().includes(q.toLowerCase()) ||
            String(o.value).toLowerCase().includes(q.toLowerCase())
        );
        inputLoading.value = false;
    }, 400);
};

// ==================== 🔄 遠程搜索 - 模具編號 ====================
const remoteMoldNo = (query: string): void => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const q = query?.trim(); if (!q) { moldNoSelect.value = [...DEFAULT_MOLD_OPTIONS]; return; }
    inputLoading.value = true;
    searchTimeout = setTimeout(() => {
        moldNoSelect.value = DEFAULT_MOLD_OPTIONS.filter(o => o.label.toLowerCase().includes(q.toLowerCase()) || String(o.value).toLowerCase().includes(q.toLowerCase()));
        inputLoading.value = false;
    }, 400);
};

// ==================== 🔄 遠程搜索 - 倉庫 ====================
const remoteWarehouse = (query: string): void => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const q = query?.trim(); if (!q) { warehouseOptions.value = [...DEFAULT_WAREHOUSE_OPTIONS]; return; }
    inputLoading.value = true;
    searchTimeout = setTimeout(async () => {
        try {
            const res = await axios.post('/v1/warehouse/warehouse/list', { warehouseName: q, status: 1 });
            if (res.data.infos === 0) { warehouseOptions.value = [...DEFAULT_WAREHOUSE_OPTIONS]; ElMessage.warning('未找到匹配的倉庫，顯示默認選項'); return; }
            warehouseOptions.value = res.data.data.map((e: any, i: number) => ({
                value: e.warehouseName, label: e.warehouseName, id: e.id,
                bgColor: colorConfigs[i % colorConfigs.length].bgColor, textColor: colorConfigs[i % colorConfigs.length].textColor, tagColor: colorConfigs[i % colorConfigs.length].tagColor
            }));
        } catch (error) { handleError(error, '倉庫查詢失敗'); warehouseOptions.value = [...DEFAULT_WAREHOUSE_OPTIONS]; }
        finally { inputLoading.value = false; }
    }, 400);
};

// ==================== 🔄 表格與歷史操作 ====================
const refreshScanTable = async (): Promise<void> => { tableUpShow.value = false; await nextTick(); tableUpShow.value = true; };
const removeScanRecord = async (row: ScanRecordItem): Promise<void> => {
    try {
        await ElMessageBox.confirm('確定刪除？', '提示', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' });
        const idx = scanRecords.findIndex(r => r.id === row.id);
        if (idx > -1) scanRecords.splice(idx, 1); ElMessage.success('刪除成功');
    } catch { }
};

const confirmInbound = async (): Promise<void> => {
    // ✅ 新增驗證：入庫類型
    if (!inboundInfo.inType) { ElMessage.warning('請選擇入庫類型'); return; }

    if (scanRecords.length === 0) { ElMessage.warning('沒有掃描記錄，無法入庫'); return; }
    try {
        await ElMessageBox.confirm(`確定入庫 ${scanRecords.length} 條記錄？`, { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' });
        loading.value = true; inputLoading.value = true;

        // ✅ 使用 Tooling 真實字段提交
        const InboundData = scanRecords.map(e => ({
            moldType: e.moldType,
            moldNo: e.moldNo,
            partName: e.partName,
            size: e.size,
            quantity: parseInt(e.quantity as string) || 0,
            warehouse: e.warehouse,
            location: e.location,
            shoeName: e.shoeName,
            deliveryUnit: e.deliveryUnit,
            operator: e.operator,
            scanTime: e.scanTime,
            revision: e.revision,
            inType: inboundInfo.inType,      // ✅ 新增：提交入庫類型
            inNumber: inboundInfo.inNumber   // ✅ 新增：提交出入單號
        }));

        const res = await axios.post('/v1/tooling/input/batch/create', { records: InboundData });
        if (res.data.infos === 0) { ElMessageBox.alert(res.data.msg, { type: 'error' }); return; }
        ElMessage.success(`入庫成功！共 ${res.data.infos} 條記錄`);
        scanRecords.splice(0, scanRecords.length); await refreshScanTable();
    } catch (error) { handleError(error, '確認入庫失敗'); }
    finally { loading.value = false; inputLoading.value = false; }
};

const queryInboundHistoryData = async (): Promise<void> => {
    loading.value = true;
    try {
        const res = await axios.post('/v1/tooling/input/query', { styleNo: historyQuery.styleNo, startDate: historyQuery.startDate, endDate: historyQuery.endDate });
        if (res.data.infos === 0)
         { ElMessage.warning('未查詢到入庫記錄');
          historyData.splice(0, historyData.length); 
          return;
         }
        historyData.splice(0, historyData.length, ...res.data.data);
         ElMessage.success(`查詢到 ${res.data.data.length} 條記錄`);
    } catch (error) { handleError(error, '查詢入庫歷史失敗'); }
    finally { loading.value = false; }
};

// ==================== 🔄 生命週期 ====================
const handleResize = () => { tableHeight.value = getWindowHeight(); };
onMounted(() => { handleResize(); window.addEventListener('resize', handleResize); setTimeout(() => { barcodeInput.value?.focus(); }, 500); });
onUnmounted(() => { window.removeEventListener('resize', handleResize); if (searchTimeout) clearTimeout(searchTimeout); });
</script>

<style scoped>
.size-native-btn {
    background-color: #FAFBFC !important;
    border: 1px solid #C5D8EA !important;
    color: #4A7BA7 !important;
    padding: 8px 12px !important;
    cursor: pointer !important;
    transition: all 0.2s ease-in-out !important;
    display: inline-flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    white-space: normal !important;
    line-height: 1.3 !important;
}

.size-native-btn:hover:not(:disabled) {
    background-color: #F0F4F8 !important;
    border-color: #5B8DB8 !important;
    color: #5B8DB8 !important;
}

.size-native-btn:active:not(:disabled) {
    background-color: #E5EEF7 !important;
    border-color: #4A7BA7 !important;
    color: #4A7BA7 !important;
    transform: scale(0.98);
}

.size-native-btn>div {
    width: 100%;
    text-align: center;
}
</style>
