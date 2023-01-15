import { setupFormat } from './plugins/format'
import vue from '@vitejs/plugin-vue'

export function setupPlugins(config) {
  return [
    vue({
      customElement: true,
    }),
    setupFormat(config),
  ]
}
