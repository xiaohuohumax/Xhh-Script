import { ConfigCheckError } from '../exception/config.error'
import { ConfigLoader } from '../model/config.loader'

export default new ConfigLoader({
  key: 'base_config',
  name: '基础配置',
  config: {
    elementName: 'xhh-script',
    fixedTop: '10px',
    fixedLeft: '10px',
    showType: 'hover',
  },
  description: 'base config',
  fieldDescription: {
    elementName: 'Shadow DOM 标签名称',
    fixedTop: '模块距离浏览器顶部距离',
    fixedLeft: '模块距离浏览器左侧距离',
    showType: [
      '模块触发显示类型 hover/click',
      '注意: 鼠标移出模块自动关闭显示',
      'hover: 鼠标悬停模块图标自动显示',
      'click: 鼠标点击模块图标显示',
    ],
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
