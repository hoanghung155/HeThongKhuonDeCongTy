<template>
    <div class="background">
        <!-- 頂部間距 -->
        <div class="top-spacer"></div>

        <!-- 登錄 Logo (僅在登錄頁顯示) -->
        <div v-show="uiState.showLogImg" class="logo-container">
            <img alt="LoginLog" class="login-logo" src="../../assets/login.jpg" />
        </div>

        <!-- 登錄表單 -->
        <div v-show="uiState.showLogin" class="card login-card">
            <h3 class="card-title">{{ lang.login }}</h3>
            <div style="margin-left: 15px ; margin-right: 15px;">
                <el-form :model="forms.login.data" size="large" class="auth-form">
                    <el-form-item prop="username">
                        <el-input v-model="forms.login.data.username" :placeholder="lang.userAccount" clearable
                            @keyup.enter="handleLogin" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="forms.login.data.password" type="password" show-password
                            :placeholder="lang.passWord" @keyup.enter="handleLogin" />
                    </el-form-item>
                </el-form>

                <button class="action-btn" @click="handleLogin">{{ lang.login }}</button>
            </div>

            <div class="card-footer">
                <span @click="switchView('register')">{{ lang.point }}</span>
                <span @click="switchView('password')" class="sub-link">{{ lang.alterPassWord }}</span>
            </div>

            <!-- 語言選擇 -->
            <div class="lang-switcher">
                <el-dropdown trigger="click">
                    <el-button type="info" plain circle>
                        <el-icon>
                            <Setting />
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="setLanguage('EN')">English</el-dropdown-item>
                            <el-dropdown-item @click="setLanguage('CN')">Local</el-dropdown-item>
                            <el-dropdown-item @click="setLanguage('TW')">繁體中文</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <!-- 註冊表單 -->
        <div v-show="uiState.showRegister" class="card reg-card">
            <h4 v-show="!uiState.showMsg" class="card-title">{{ lang.register }}</h4>
            <h4 v-show="uiState.showMsg" class="card-title error-text">{{ msg }}</h4>

            <el-form :model="forms.register.data" ref="registerFormRef" :rules="forms.register.rules" label-width="80px"
                label-position="right" class="auth-form">
                <el-form-item :label="lang.userName" prop="name">
                    <el-input v-model="forms.register.data.name" />
                </el-form-item>
                <el-form-item :label="lang.userAccount" prop="userName">
                    <el-input v-model="forms.register.data.userName" />
                </el-form-item>
                <el-form-item :label="lang.passWord" prop="passWord">
                    <el-input v-model="forms.register.data.passWord" type="password" show-password />
                </el-form-item>
                <el-form-item :label="lang.confirmPassWord" prop="confirmPassWord">
                    <el-input v-model="forms.register.data.confirmPassWord" type="password" show-password />
                </el-form-item>
                <el-form-item :label="lang.rankName" prop="rankCode">
                    <el-select v-model="forms.register.data.rankCode" filterable :placeholder="lang.pleaseChoose">
                        <el-option v-for="item in options.ranks" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="lang.department" prop="groupPath">
                    <el-cascader v-model="forms.register.data.groupPath" :options="options.groups"
                        :props="{ expandTrigger: 'hover', checkStrictly: true, multiple: true }"
                        :placeholder="lang.pleaseChoose" @change="handleCascaderChange" />
                </el-form-item>
            </el-form>

            <!-- 簽名上傳區域 -->
            <div class="signature-section">
                <div class="signature-label">
                    <el-icon>
                        <EditPen />
                    </el-icon> {{ lang.signatureFile }}
                </div>
                <div class="signature-upload-box">
                    <el-col :span="6">
                        <el-upload action="#" accept=".png,.jpg,.jpeg" :show-file-list="false"
                            :http-request="handleFileUpload" :auto-upload="true">
                            <el-tooltip content="file_width < 180px" placement="right">
                                <div class="upload-trigger">
                                    <el-icon class="upload-icon">
                                        <UploadFilled />
                                    </el-icon>
                                    <small>{{ lang.clickToUpload }}</small>
                                </div>
                            </el-tooltip>
                        </el-upload>
                    </el-col>
                    <el-col :span="18">
                        <img class="signature-preview" :src="forms.register.data.signature || defaultSignatureImg"
                            alt="signature" />
                    </el-col>
                </div>
            </div>

            <button class="action-btn" @click="handleRegister">{{ lang.register }}</button>
            <div class="card-footer">
                <span @click="switchView('login')">{{ lang.point2 }}</span>
            </div>
        </div>

        <!-- 修改密碼表單 -->
        <div v-show="uiState.showPassword" class="card password-card">
            <h3 class="card-title">{{ lang.alterPassWord }}</h3>
            <el-form :model="forms.password.data" ref="passwordFormRef" :rules="forms.password.rules" label-width="80px"
                label-position="right" class="auth-form">
                <el-form-item :label="lang.userAccount" prop="userName">
                    <el-input v-model="forms.password.data.userName" />
                </el-form-item>
                <el-form-item :label="lang.passWord" prop="passWord">
                    <el-input v-model="forms.password.data.passWord" type="password" show-password />
                </el-form-item>
                <el-form-item :label="lang.alterPassWord" prop="newPassWord">
                    <el-input v-model="forms.password.data.newPassWord" type="password" show-password />
                </el-form-item>
                <el-form-item :label="lang.confirmPassWord" prop="confirmPassWord">
                    <el-input v-model="forms.password.data.confirmPassWord" type="password" show-password />
                </el-form-item>
            </el-form>

            <div class="btn-group">
                <el-button type="success" plain @click="handleAlterPassword">{{ lang.alterPassWord }}</el-button>
                <el-button type="info" plain @click="switchView('login')">{{ lang.login }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
    ElMessage,
    ElMessageBox,
    type FormInstance,
    type FormRules,
    type UploadRequestOptions
} from 'element-plus'
import { Setting, EditPen, UploadFilled } from '@element-plus/icons-vue'
import axios from '../../assets/js/index'  // ✅ 確保 axios baseURL 正確
import { useMainStore } from '../../assets/js/store.ts'
import { handleError } from '../../assets/js/httpErrorHandler'
import { setCookie } from '../../assets/js/cookie'
import { getGroup } from '../../assets/API/inputGroup'
import defaultSignatureImg from '../../assets/smp.jpg'

// ================= 類型定義 =================
interface LanguagePack {
    login: string
    register: string
    userName: string
    userAccount: string
    passWord: string
    confirmPassWord: string
    alterPassWord: string
    rankName: string
    department: string
    signatureFile: string
    clickToUpload: string
    pleaseChoose: string
    point: string
    point2: string
}

interface LoginData {
    username: string
    password: string
    language: string
}

interface RegisterData {
    id: string | null
    name: string | null
    userName: string | null
    passWord: string | null
    confirmPassWord: string | null
    rankCode: number | null
    groupCode: (number | null)[]
    groupPath: number[] | null
    signature: string | null
}

interface PasswordData {
    userName: string | null
    passWord: string | null
    newPassWord: string | null
    confirmPassWord: string | null
}

// ================= 多語言配置 =================
const LANGUAGES: Record<string, LanguagePack> = {
    CN: {
        login: '登录', register: '注册', userName: '名称', userAccount: '账号', passWord: '密码',
        confirmPassWord: '确定密码', alterPassWord: '修改密码', rankName: '职称', department: '部门',
        signatureFile: '签名文件', clickToUpload: '点击上传', pleaseChoose: '请选择',
        point: '没有账号？马上注册', point2: '已有账号？马上登录'
    },
    TW: {
        login: '登錄', register: '註冊', userName: '名稱', userAccount: '賬號', passWord: '密碼',
        confirmPassWord: '確認密碼', alterPassWord: '修改密碼', rankName: '職稱', department: '部門',
        signatureFile: '簽名文件', clickToUpload: '點擊上傳', pleaseChoose: '請選擇',
        point: '沒有賬號？馬上註冊', point2: '已有賬號，馬上登錄'
    },
    EN: {
        login: 'Login', register: 'Register', userName: 'Name', userAccount: 'Account', passWord: 'Password',
        confirmPassWord: 'Confirm Password', alterPassWord: 'Change Password', rankName: 'Job Title', department: 'Department',
        signatureFile: 'Signature File', clickToUpload: 'Click to Upload', pleaseChoose: 'Please Choose',
        point: 'No account? Register now', point2: 'Have an account? Login now'
    }
}

// ================= 響應式狀態 =================
const router = useRouter()
const store = useMainStore()

const uiState = reactive({
    showLogImg: true,
    showLogin: true,
    showRegister: false,
    showPassword: false,
    showMsg: false,
    showMsg2: true
})

const msg = ref('')
const currentLang = ref<keyof typeof LANGUAGES>('TW')
const lang = computed(() => LANGUAGES[currentLang.value])

const registerFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const options = reactive({
    ranks: [] as { value: number; label: string }[],
    groups: [] as any[]
})

const forms = reactive({
    login: {
        data: reactive<LoginData>({
            username: '',
            password: '',
            language: 'TW'
        })
    },
    register: {
        data: reactive<RegisterData>({
            id: null,
            name: null,
            userName: null,
            passWord: null,
            confirmPassWord: null,
            rankCode: null,
            groupCode: [],
            groupPath: null,
            signature: null
        }),
        rules: {
            name: [
                { required: true, min: 3, max: 18, message: 'Name must be 3-18 chars', trigger: 'blur' }
            ],
            userName: [
                { required: true, min: 2, max: 12, message: 'Account must be 2-12 chars', trigger: 'blur' }
            ],
            passWord: [
                { required: true, message: 'Password required', trigger: 'blur' }
            ],
            confirmPassWord: [
                { required: true, message: 'Please confirm password', trigger: 'blur' }
            ],
            rankCode: [
                { required: true, message: 'Job Title required', trigger: 'change' }
            ],
            groupPath: [
                { required: true, message: 'Department required', trigger: 'change' }
            ]
        } as FormRules<RegisterData>
    },
    password: {
        data: reactive<PasswordData>({
            userName: null,
            passWord: null,
            newPassWord: null,
            confirmPassWord: null
        }),
        rules: {
            userName: [
                { required: true, message: 'Account required', trigger: 'blur' }
            ],
            passWord: [
                { required: true, message: 'Old password required', trigger: 'blur' }
            ],
            newPassWord: [
                { required: true, message: 'New password required', trigger: 'blur' }
            ],
            confirmPassWord: [
                { required: true, message: 'Please confirm new password', trigger: 'blur' }
            ]
        } as FormRules<PasswordData>
    }
})

// ================= 核心方法 =================

const fetchGroupClass = async (): Promise<void> => {
    try {
        const res = await axios.get(
            '/v1/iam/user/groups',
            { params: { language: forms.login.data.language } }  // ✅ 用 params 傳遞查詢參數
        )
        const data = res.data

        options.ranks = data.rankClasslist.map((item: any) => ({
            value: item.code,
            label: item.name
        }))

        options.groups = getGroup(data.groupClasslist)
    } catch (error) {
        handleError(error)
    }
}

const switchView = (view: 'login' | 'register' | 'password'): void => {
    uiState.showLogImg = view === 'login'
    uiState.showLogin = view === 'login'
    uiState.showRegister = view === 'register'
    uiState.showPassword = view === 'password'

    if (view === 'register') {
        uiState.showMsg = false
        uiState.showMsg2 = true
        msg.value = ''
    }
}

const setLanguage = (langKey: keyof typeof LANGUAGES): void => {
    currentLang.value = langKey
    forms.login.data.language = langKey
    fetchGroupClass()
}

const imgToBase64 = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = src

        img.onload = () => {
            if (img.width > 180) {
                ElMessageBox.alert('file_width > 180px, Upload failed', {
                    type: 'error',
                    confirmButtonText: 'OK'
                })
                reject(new Error('Image width exceeded 180px'))
                return
            }

            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')

            if (ctx) {
                ctx.drawImage(img, 0, 0)
                resolve(canvas.toDataURL('image/png'))
            } else {
                reject(new Error('Failed to get canvas context'))
            }
        }

        img.onerror = (err) => {
            console.error('Image load error:', err)
            reject(err)
        }
    })
}

const handleFileUpload = async (param: UploadRequestOptions): Promise<void> => {
    const file = param.file as File

    if (file.size / 1024 > 30) {
        ElMessageBox.alert('file > 30K, Upload failed', {
            type: 'error',
            confirmButtonText: 'OK'
        })
        return
    }

    const windowURL = window.URL || window.webkitURL
    const previewPath = windowURL.createObjectURL(file)

    try {
        const base64 = await imgToBase64(previewPath)
        forms.register.data.signature = base64
    } catch (error) {
        console.error('Upload error:', error)
    } finally {
        windowURL.revokeObjectURL(previewPath)
    }
}

const handleCascaderChange = (value: number[][]): void => {
    const checkedNodes: (number | null)[] = []

    value.forEach((path: number[]) => {
        if (path.length > 0) {
            checkedNodes.push(path[path.length - 1])
        }
    })

    forms.register.data.groupCode = checkedNodes
}

const handleLogin = async (): Promise<void> => {
    const { username, password } = forms.login.data

    if (!username?.trim() || !password?.trim()) {
        ElMessageBox.alert('Please enter account and password', {
            type: 'info',
            confirmButtonText: 'OK'
        })
        return
    }

    try {
        const res = await axios.post(
            '/v1/iam/user',
            {
                username: forms.login.data.username,
                password: forms.login.data.password,
                language: forms.login.data.language
            }
        )
        const data = res.data

        if (data.infos === 1) {  // ✅ 注意：後端返回 infos=1 表示成功
            store.newLanguageData(data.loginUser.language)
            store.newUserMenulist(data.userMenuList)
            store.newUser(data.loginUser)
            store.newToken(data.token)
            setCookie('username', data.loginUser.name, 10000)
            router.push('/Home')
        } else {
            ElMessageBox.alert(data.msg || data.detail, { type: 'error', confirmButtonText: 'OK' })
        }
    } catch (error: any) {
        // ✅ 處理 HTTPException 返回的錯誤
        if (error.response?.data?.detail) {
            ElMessageBox.alert(error.response.data.detail, { type: 'error', confirmButtonText: 'OK' })
        } else {
            handleError(error)
        }
    }
}

const handleRegister = async (): Promise<void> => {
    if (!registerFormRef.value) return

    try {
        await registerFormRef.value.validate()

        if (forms.register.data.passWord !== forms.register.data.confirmPassWord) {
            ElMessageBox.alert('The entered passwords are not the same', {
                type: 'error',
                confirmButtonText: 'OK'
            })
            return
        }

        // ✅ 修改：路由改為 /v1/iam/userRegister，直接傳對象
        const res = await axios.post(
            '/v1/iam/user/register',
            {
                userName: forms.register.data.userName,
                name: forms.register.data.name,
                passWord: forms.register.data.passWord,
                rankCode: forms.register.data.rankCode,
                groupCode: forms.register.data.groupCode,
                groupPath: forms.register.data.groupPath,
                signature: forms.register.data.signature
            }
        )
        const data = res.data

        if (data.infos === 1) {
            msg.value = data.msg
            uiState.showMsg2 = false
            uiState.showMsg = true
            ElMessage({ type: 'warning', message: data.msg, duration: 3000 })
        } else {
            ElMessageBox.alert(data.msg || data.detail, { type: 'error', confirmButtonText: 'OK' })
        }
    } catch (error: any) {
        if (error.response?.data?.detail) {
            ElMessageBox.alert(error.response.data.detail, { type: 'error', confirmButtonText: 'OK' })
        } else {
            handleError(error)
        }
    }
}

const handleAlterPassword = async (): Promise<void> => {
    if (!passwordFormRef.value) return

    try {
        await passwordFormRef.value.validate()

        if (forms.password.data.newPassWord !== forms.password.data.confirmPassWord) {
            ElMessageBox.alert('The entered passwords are not the same', {
                type: 'error',
                confirmButtonText: 'OK'
            })
            return
        }

        // ✅ 修改：路由改為 /v1/iam/userAlterPassword，直接傳對象
        const res = await axios.post(
            '/v1/iam/user/password',
            {
                userName: forms.password.data.userName,
                passWord: forms.password.data.passWord,
                newPassWord: forms.password.data.newPassWord
            }
        )
        const data = res.data
        if (data.infos === 1) {
            ElMessage({ type: 'success', message: data.msg, duration: 2000 })
        } else {
            ElMessageBox.alert(data.msg || data.detail, { type: 'error', confirmButtonText: 'OK' })
        }
    } catch (error: any) {
        if (error.response?.data?.detail) {
            ElMessageBox.alert(error.response.data.detail, { type: 'error', confirmButtonText: 'OK' })
        } else {
            handleError(error)
        }
    }
}

onMounted(() => {
    fetchGroupClass()
})
</script>

<style scoped>
/* ================= 基礎佈局 ================= */
.background {
    width: 100%;
    height: 100vh;
    background-image: url(../../assets/bg.jpg);
    background-repeat: repeat;
    /* 讓圖片重複平鋪 */
    background-size: auto;
    /* 保持圖片原始大小，不要拉伸 */

    /* 可選：如果圖片太小想稍微放大點，可以用具體像素，例如：
     background-size: 200px 200px; 
  */

    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.top-spacer {
    height: 10vh;
    width: 100%;
    flex-shrink: 0;
}

/* ================= Logo 樣式 ================= */
.logo-container {
    margin-bottom: 20px;
    animation: fadeIn 0.5s ease-in;
}

.login-logo {
    display: block;
    height: 160px;
    border: 1px solid #4d67ff;
    padding: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16), 0 2px 10px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    background: #fff;
    object-fit: contain;
}

/* ================= 卡片通用樣式 ================= */
.card {
    width: 320px;
    margin: 0 auto 20px;
    border: 1px solid #4d67ff;
    padding: 20px 25px 25px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16), 0 2px 10px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    background-color: #ffffff;
    transition: all 0.3s ease;
}

.login-card {
    min-height: 320px;
}

.reg-card {
    min-height: 560px;
}

.password-card {
    min-height: 300px;
}

.card-title {
    margin: 0 0 20px;
    color: #333;
    font-size: 18px;
    font-weight: 600;
}

.error-text {
    color: #f56c6c;
    font-weight: 500;
}

/* ================= 表單樣式 ================= */
.auth-form {
    text-align: left;
    margin: 10px;
}

:deep(.el-form-item__label) {
    font-size: 13px;
    color: #606266;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-cascader .el-input__wrapper) {
    border-radius: 6px;
}

/* ================= 按鈕樣式 ================= */
.action-btn {
    display: block;
    width: 100%;
    height: 40px;
    margin: 15px auto 10px;
    border: none;
    background: linear-gradient(135deg, #7382ff, #4762ff);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(71, 98, 255, 0.3);
}

.action-btn:hover {
    background: linear-gradient(135deg, #4762ff, #3550ff);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(71, 98, 255, 0.4);
}

.action-btn:active {
    transform: translateY(0);
}

.btn-group {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    gap: 12px;
}

:deep(.el-button) {
    border-radius: 18px;
    font-size: 14px;
}

/* ================= 頁腳鏈接 ================= */
.card-footer {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
}

.card-footer span {
    cursor: pointer;
    color: #606266;
    transition: color 0.3s;
    user-select: none;
}

.card-footer span:hover {
    color: #ff6d59;
}

.sub-link {
    font-size: 13px;
    text-decoration: underline;
    text-underline-offset: 2px;
}

/* ================= 語言切換 ================= */
.lang-switcher {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}

:deep(.el-dropdown-menu) {
    padding: 5px 0;
}

:deep(.el-dropdown-menu__item) {
    font-size: 14px;
    padding: 8px 16px;
}

/* ================= 簽名上傳區域 ================= */
.signature-section {
    margin: 15px 0;
    text-align: left;
}

.signature-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.signature-upload-box {
    display: flex;
    align-items: center;
    border: 1px solid #c6c6c6;
    padding: 8px;
    border-radius: 6px;
    background-color: #fff;
}

.upload-trigger {
    color: #fc6384;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40px;
    gap: 4px;
    transition: opacity 0.3s;
}

.upload-trigger:hover {
    opacity: 0.8;
}

.upload-icon {
    font-size: 22px;
}

.signature-preview {
    width: 100%;
    height: 40px;
    border: 1px solid #eee;
    background: #fff;
    border-radius: 3px;
}

/* ================= 響應式適配 ================= */
@media (max-width: 480px) {
    .card {
        width: 90%;
        max-width: 320px;
        padding: 18px 16px 22px;
    }

    .login-logo {
        height: 140px;
    }

    .signature-upload-box {
        flex-direction: column;
        gap: 12px;
    }
}
</style>