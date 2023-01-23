import { ConfigCheckError } from '../exception/config.error'
import { ConfigLoader } from '../model/config.loader'
import panApisJson from '../apis/pan.json'

export function formatPanApi(panApis) {
  return panApis
    .map(pan => Object.assign({ name: '', title: pan.name, api: '', index: 0 }, pan))
    .sort((a, b) => (a.index > b.index ? -1 : 1))
}

export default new ConfigLoader({
  key: 'pan_config',
  name: '网盘资源搜索配置',
  config: {
    icon: '🕸',
    name: '网盘资源搜索',
    isUsePan: true,
    panMatchRe: ['^.*'],
    apiReplaceFlag: '%info%',
    apis: formatPanApi(panApisJson),
  },
  description: 'pan config',
  fieldDescription: {
    icon: '模块图标',
    name: '模块名称',
    isUsePan: '是否使用[网盘资源搜索]模块',
    panMatchRe: '[网盘资源搜索]模块网址匹配正则,命中则加载此模块',
    apiReplaceFlag: 'API替换标记',
    apis: '网盘资源搜索接口',
    'apis.name': '接口名称',
    'apis.api': [
      '接口网址 [注意替换标记 apiReplaceFlag]',
      '例如: apiReplaceFlag=%info% 则 apis.api=http://***/?kw=%info%',
    ],
    'apis.title': '提示信息 [可缺省,缺省与name相同]',
    'apis.index': '排序下标越大越靠前 [可缺省,缺省为0]',
  },
  checkCallback: ({ key, name, description, fieldDescription, config, defaultConfig }) => {
    if (config == undefined) {
      throw new ConfigCheckError(`config lost[${name}]: ${key}`)
    }
    for (let defineKey of Object.keys(defaultConfig)) {
      if (!Object.keys(config).includes(defineKey)) {
        throw new ConfigCheckError(`param lost[${name}]: ${key} ${defineKey}`)
      }
    }
    return config
  },
})
