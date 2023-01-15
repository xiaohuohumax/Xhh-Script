import { ConfigErrorParam } from '../exception/config.error'
import { ConfigLoader } from '../model/config.loader'
import vipApisJson from '../apis/vip.json'

export function formatVipApi(vipApis) {
  return vipApis
    .map(vip => Object.assign({ name: '', title: vip.name, api: '', index: 0 }, vip))
    .sort((a, b) => (a.index > b.index ? -1 : 1))
}

export const vipConfigLoader = new ConfigLoader({
  key: 'vip_config',
  name: 'VIP视频解析配置',
  data: {
    icon: '🎥',
    name: 'VIP视频解析',
    isUseVip: true,
    vipMatchRe: [
      '^\\w+://\\w+.iqiyi.com', // 爱奇艺
      '^\\w+://\\w+.youku.com', // 优酷
      '^\\w+://\\w+.le.com', // 乐视
      '^\\w+://\\w+.letv.com', // 乐视
      '^\\w+://v.qq.com', // 腾讯
      '^\\w+://\\w+.tudou.com', // 土豆
      '^\\w+://\\w+.mgtv.com', // 芒果
      '^\\w+://film.sohu.com', // 搜狐
      '^\\w+://tv.sohu.com', // 搜狐
      '^\\w+://\\w+.acfun.cn/v', // acfun
      '^\\w+://\\w+.bilibili.com', // bilibili
      '^\\w+://vip.1905.com/play', // 1905电影网
      '^\\w+://\\w+.pptv.com', // pp视频
      '^\\w+://\\w+.wasu.cn/Play/show', // 华数
      '^\\w+://\\w+.56.com', // 我乐视频
    ],
    apiReplaceFlag: '%url%',
    apis: formatVipApi(vipApisJson),
  },
  description: 'vip config',
  fieldAnnotations: {
    icon: '模块图标',
    name: '模块名称',
    isUseVip: '是否使用[VIP视频解析]模块',
    vipMatchRe: '[VIP视频解析]模块网址匹配正则,命中则加载此模块',
    apiReplaceFlag: 'API替换标记',
    apis: 'VIP视频解析接口',
    'apis.name': '接口名称',
    'apis.api': [
      '接口网址 [注意替换标记 apiReplaceFlag]',
      '例如: apiReplaceFlag=%url% 则 apis.api=http://***/?url=%url%',
    ],
    'apis.title': '提示信息 [可缺省,缺省与name相同]',
    'apis.index': '排序下标越大越靠前 [可缺省,缺省为0]',
  },
  checkCallback: (data, defaultData) => {
    if (data == undefined) {
      throw new Error('config lost')
    }
    for (let defineKey of Object.keys(defaultData)) {
      if (!Object.keys(data).includes(defineKey)) {
        throw new ConfigErrorParam(defineKey, 'param lost')
      }
    }
    // ...
    return data
  },
})
