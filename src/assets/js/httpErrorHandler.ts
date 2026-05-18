import { ElMessageBox } from 'element-plus'
// ✅ 從 'axios' 包導入 isAxiosError，而不是從自定義實例
import { isAxiosError } from 'axios'

/**
 * 通用 HTTP 錯誤處理函數
 * @param error - 捕獲的異常對象 (unknown 類型)
 * @param customMessage - 可選的自定義默認提示
 */
export const handleError = (error: unknown, customMessage?: string): void => {
  let errorMsg = customMessage || 'Network Error'

  // 1. 檢查是否為 Axios 錯誤
  if (isAxiosError(error) && error.response) {
    const responseData = error.response.data
    
    // ✅ 優先匹配後端 ServiceException 格式 (detail 字段)
    if (responseData?.detail) {
      errorMsg = responseData.detail
    } 
    else {
      const status = error.response.status
      if (status === 401) errorMsg = 'Unauthorized: Please login again'
      else if (status === 403) errorMsg = 'Forbidden: Access denied'
      else if (status === 404) errorMsg = 'Resource not found'
      else if (status >= 500) errorMsg = `Server Error (${status})`
    }
  } 
  // 2. 網絡請求失敗（無響應）
  else if (error && typeof error === 'object' && 'request' in error) {
    errorMsg = 'No response from server. Please check your network.'
  } 
  // 3. 普通 JavaScript 錯誤
  else if (error instanceof Error) {
    errorMsg = error.message
  }

  // 彈出錯誤提示框
  ElMessageBox.alert(errorMsg, {
    title: 'Error',
    type: 'error',
    confirmButtonText: 'OK',
    dangerouslyUseHTMLString: false // 防止 XSS
  })
  
  // 控制台輸出完整錯誤，方便調試
  console.error('API Error Details:', error)
}