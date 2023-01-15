import { baseConfigLoader } from '../config/base.config'
import { vipConfigLoader } from '../config/vip.config'
import { panConfigLoader } from '../config/pan.config'

const configMap = {
  baseConfigLoader,
  vipConfigLoader,
  panConfigLoader,
}

export function loadConfig() {
  return Object.values(configMap)
    .map(configItem => configItem.getConfigStr())
    .join('\n')
}

export function checkDefaultConfig() {
  Object.values(configMap).map(configItem => configItem.checkDefaultConfig())
}

export function checkConfig() {
  Object.values(configMap).map(configItem => configItem.checkConfig())
}
