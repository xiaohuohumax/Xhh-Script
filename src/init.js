import { ConfigError } from './exception/config.error'
import { checkConfig } from './utils/load.config'
import { baseConfigLoader } from './config/base.config'
import { loadStyle } from './utils/load.style'
import { defineCustomElement } from 'vue'
import packageJson from '../package.json'
import logger from './utils/logger'
import App from './App.vue'

export function initScript() {
  try {
    if (window.self != window.top) {
      logger.warning('load repeat')
      return
    }

    logger.success(packageJson.name)
    logger.success(packageJson.description)
    logger.success('author:', packageJson.author)
    logger.success('version:', packageJson.version)
    logger.success('github:', packageJson.repository)

    checkConfig()

    const baseConfig = baseConfigLoader.getConfig()

    if (customElements.get(baseConfig.elementName) != undefined) {
      logger.error(`element <${baseConfig.elementName}/> has been defined!`)
      return
    }

    logger.info('load script start')
    App.styles = loadStyle()
    logger.info('load style finish')

    customElements.define(baseConfig.elementName, defineCustomElement(App))
    logger.info(`define element <${baseConfig.elementName}/> finish`)

    const app = document.createElement(baseConfig.elementName)

    app.style.setProperty('--fixed-top', baseConfig.fixedTop)
    app.style.setProperty('--fixed-left', baseConfig.fixedLeft)

    document.body.append(app)
    logger.success('load script success')
  } catch (err) {
    if (err instanceof ConfigError) {
      logger.error('config error', err.message)
    } else {
      logger.error('script unknow error:', err.message)
    }
    logger.error('load script fail')
  }
}
