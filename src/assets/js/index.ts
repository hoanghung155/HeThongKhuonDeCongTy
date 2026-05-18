// httpApi.ts
import axios from 'axios'
import { getCookie } from './cookie' // 你的 cookie 工具

const httpApi = axios.create({
  baseURL: '/api/', // 使用相对路径配合 Vite 代理
  timeout: 30000,
  headers: {
    'x-content-type-options': 'nosniff',
    'Content-Type': 'application/json'
    // ✅ 不在這裡設置 Authorization
  }
})

// 🔥 請求攔截器：每次發送請求前自動執行
httpApi.interceptors.request.use(
  config => {
    // 1. 從 cookie / localStorage / Vuex 讀取最新 Token
    const token = getCookie('token') // 或 useStore().state.token
    
    // 2. 如果有 Token，添加到 headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 3. 返回修改後的 config
    return config
  },
  error => {
    // 請求發送失敗的處理
    return Promise.reject(error)
  }
)

export default httpApi