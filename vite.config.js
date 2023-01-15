import globalConfig from './global.config.js'
import { setupPlugins } from './build/index.js'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(config => {
  return {
    plugins: setupPlugins(config),
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
