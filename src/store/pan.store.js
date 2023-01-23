import { defineStore, storeToRefs } from 'pinia'

export const usePanStore = defineStore('pan', {
  state: () => ({
    // 上次选择接口
    historyApi: '',
  }),
  saveLocal: {
    enable: true,
    version: 1,
    key: 'pan_store',
    update: ({ version, data }) => {
      return data
    },
  },
})

export function usePanStoreRefs() {
  return storeToRefs(usePanStore())
}
