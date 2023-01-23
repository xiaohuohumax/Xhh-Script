import baseConfig from './base.config'
import vipConfig from './vip.config'
import panConfig from './pan.config'

export const configLoaderMap = {
  baseConfig,
  vipConfig,
  panConfig,
}

export const baseConfigLoader = baseConfig
export const vipConfigLoader = vipConfig
export const panConfigLoader = panConfig

export { formatVipApi } from './vip.config'
export { formatPanApi } from './pan.config'

export function checkDeafultConfig() {
  Object.values(configLoaderMap).map(config => config.checkDeafultConfig())
}

export function checkConfig() {
  Object.values(configLoaderMap).map(config => config.checkConfig())
}
