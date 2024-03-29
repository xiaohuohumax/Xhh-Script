import packageJson from '../../package.json'

export function getHeader() {
  return {
    name: '小火狐自用脚本 /Shadow DOM/',
    namespace: 'http://tampermonkey.net/',
    author: packageJson.author,
    version: packageJson.version,
    description: packageJson.description,
    license: packageJson.license,
    match: '*://**/*',
    grant: ['GM_getValue', 'GM_setValue', 'GM_addValueChangeListener'],
    icon: 'https://avatars.githubusercontent.com/u/59244940',
    icon64: 'https://avatars.githubusercontent.com/u/59244940?s=64',
    'run-at': 'document-idle',
    homepage: 'https://github.com/xiaohuohumax/Xhh-Script',
    updateURL: 'https://fastly.jsdelivr.net/gh/xiaohuohumax/Xhh-Script@master/dist/xhh-script.js',
    downloadURL: 'https://fastly.jsdelivr.net/gh/xiaohuohumax/Xhh-Script@master/dist/xhh-script.js',
  }
}
