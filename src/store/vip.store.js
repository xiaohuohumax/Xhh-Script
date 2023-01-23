import { defineStore, storeToRefs } from 'pinia'

export const useVipStore = defineStore('vip', {
  state: () => ({
    // 上次选择接口
    historyApi: '',
  }),
  saveLocal: {
    enable: true,
    version: 1,
    key: 'vip_store',
    update: ({ version, data }) => {
      return data
    },
  },
})

export function useVipStoreRefs() {
  return storeToRefs(useVipStore())
}
