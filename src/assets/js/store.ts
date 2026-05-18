import { defineStore } from 'pinia'

export interface RootState {
  languageData: Record<string, any>
  userMenulist: Array<{
    id: number
    name: string
    dis: number
    dis2: number | null
    path: string
    component: string
    EN: string | null
    CN: string | null
    TW: string | null
  }> | []
  user: Record<string, any>
  token: string
  outPutUnit: {
    factoryArea: string | null
    crafts: string | null
    unit: string | null
  }
  qcCheckBasic: {
    unit: string | null,
    unitName: string | null,
    orderDispatchNoList: string[],
    orderDispatchNo: string | null,
    orderNo: string | null,
    crafts: string | null,
    processName: string | null,
    category: string | null,
    qcItemName: string | null,
    brand: string | null,
    styleNo: string | null,
    language: string
  }
}

export const useMainStore = defineStore('main', {
  state: (): RootState => ({
    languageData: {},
    userMenulist: [],
    user: {},
    token: '',
    outPutUnit: {
      factoryArea: null,
      crafts: null,
      unit: null,
    },
    qcCheckBasic: {
      unit: null,
      unitName: null,
      orderDispatchNoList: [],
      orderDispatchNo: null,
      orderNo: null,
      crafts: null,
      processName: null,
      category: null,
      qcItemName: null,
      brand: null,
      styleNo: null,
      language: 'CN'
    }
  }),

  actions: {
    newLanguageData(msg: RootState['languageData']) {
      this.languageData = msg
    },
    newUserMenulist(msg: RootState['userMenulist']) {
      this.userMenulist = msg
    },
    newUser(msg: RootState['user']) {
      this.user = msg
    },
    newToken(msg: RootState['token']) {
      this.token = msg
    },
    newOutPutUnit(msg: RootState['outPutUnit']) {
      this.outPutUnit = msg
    },
    newQcCheckBasic(msg: RootState['qcCheckBasic']) {
      this.qcCheckBasic = msg
    },
  },

  // ✅ persist 配置
  persist: {
    key: 'vueoatest',
    storage: localStorage,
    paths: [
      'languageData',
      'userMenulist',
      'user',
      'token',
      'outPutUnit',
      'qcCheckBasic'
    ]
  } as any
})
