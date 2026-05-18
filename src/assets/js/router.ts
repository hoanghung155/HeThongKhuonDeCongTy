import { createRouter, createWebHistory } from 'vue-router';

import Home from '../../components/system//Home.vue';
// 模制具管理模塊路由
import ToolingBasic from '../../components/tooling/ToolingBasic.vue';
import ToolingInput from '../../components/tooling/ToolingInput.vue';
import ToolingOutput from '../../components/tooling/ToolingOutput.vue';
import ToolingHistory from '../../components/tooling/ToolingHistory.vue';
import ToolingApply from '../../components/tooling/ToolingApply.vue';
import ToolingScrap from '../../components/tooling/ToolingScrap.vue';

const routerOptions = [
    { path: '/', component: Home },
    // 模制具管理模塊路由
    { path: '/ToolingBasic', component: ToolingBasic },      // 基本資料建立
    { path: '/ToolingInput', component: ToolingInput },      // 入庫操作
    { path: '/ToolingOutput', component: ToolingOutput },    // 出庫操作
    { path: '/ToolingHistory', component: ToolingHistory },  // 庫存歷史查詢
    { path: '/ToolingApply', component: ToolingApply },      // 申請增加
    { path: '/ToolingScrap', component: ToolingScrap },      // 報廢管理
]

const routes = routerOptions.map(route => {
    return {
        ...route,
        // component: () => import(`${route.filePath}`)
    }
})

export default createRouter({
    history: createWebHistory(),
    routes: routes,
})