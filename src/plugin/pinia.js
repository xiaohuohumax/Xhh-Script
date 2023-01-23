import { addValueChangeListener, getValue, setValue } from '@/utils/gm'
import { runtimeId } from '@/utils'
import { createPinia } from 'pinia'
import { toRaw } from 'vue'
import logger from '@/utils/logger'

function saveLocalPlugin() {
  /** @param {import('pinia').PiniaPluginContext} context */
  return ({ options, store }) => {
    const enable = options?.saveLocal?.enable || false

    if (enable && import.meta.env.PROD) {
      const { key, version = 1, update = ({ version, data }) => data } = options.saveLocal
      // load local data
      const saveData = getValue(key)

      if (!!saveData) {
        // update local data
        const updateData = update(saveData)

        store.$patch(updateData)
        setValue(key, {
          version,
          data: updateData,
          runtimeId,
        })
      }
      // watch pinia store and save local store
      store.$subscribe((mutation, state) => {
        if (mutation.type == 'direct') {
          setValue(key, {
            version,
            data: toRaw(state),
            runtimeId,
          })
        }
      })
      // watch local store and refresh pinia store
      addValueChangeListener(key, (_key, _oldValue, newValue) => {
        const { data, runtimeId: nRuntimeId } = newValue
        if (runtimeId != nRuntimeId) {
          logger.info('store update from:', nRuntimeId)
          store.$patch(data)
        }
      })
    }
  }
}

const pinia = createPinia()

pinia.use(saveLocalPlugin())

export default pinia
