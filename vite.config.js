import tampermonkey from './build/plugins/tampermonkey'
import globalConfig from './global.config'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(config => {
  /** @type {import('vite').UserConfig} */
  return {
    plugins: [
      vue({
        customElement: true,
      }),
      tampermonkey(config),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        input: 'src/main.js',
        output: {
          entryFileNames: globalConfig.scriptName,
        },
      },
      outDir: globalConfig.outDir,
    },
    publicDir: false,
    server: {
      host: '0.0.0.0',
    },
  }
})
