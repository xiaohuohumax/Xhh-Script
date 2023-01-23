import { checkConfig, baseConfigLoader } from './config/index'
import { ConfigCheckError } from './exception/config.error'
import { defineCustomElement } from './define.element'
import { loadStyle } from './load.style'
import { runtimeId } from './utils'
import packageJson from '../package.json'
import logger from './utils/logger'
import pinia from './plugin/pinia'
import App from './App.vue'

async function start() {
  if (window.self != window.top) {
    logger.info('load script repeat')
    return
  }

  logger.info(packageJson.name)
  logger.info('author:', packageJson.author)
  logger.info('description:', packageJson.description)
  logger.info('version:', packageJson.version)
  logger.info('runtime id:', runtimeId)

  checkConfig()
  const baseConfig = baseConfigLoader.getConfig()

  if (customElements.get(baseConfig.elementName)) {
    return logger.error(`custom element <${baseConfig.elementName}/> is defined`)
  }

  App.styles = loadStyle()
  customElements.define(
    baseConfig.elementName,
    defineCustomElement({ component: App, plugins: [pinia] }),
  )
  const app = document.createElement(baseConfig.elementName)

  if (import.meta.hot) {
    import.meta.hot.on('vite:afterUpdate', _event => app.loadStyle(loadStyle()))
  }
  app.style.setProperty('--fixed-top', baseConfig.fixedTop)
  app.style.setProperty('--fixed-left', baseConfig.fixedLeft)

  document.body.append(app)
}

start()
  .then(() => {
    logger.success('script load success')
  })
  .catch(err => {
    if (err instanceof ConfigCheckError) {
      logger.error('config check error:', err.message)
    } else {
      logger.error('unknown error:', err.message)
    }
    logger.error('script load fail')
  })
