import { configLoaderMap } from '../src/config/index'
import { ConfigLoader } from '../src/model/config.loader'
import { strListMaxLen, strRepeat } from './utils'

/** @param {import('../src/model/config.loader').ConfigLoader} config */
function loadItem(config) {
  let fieldNameMaxLen = strListMaxLen(Object.keys(config.getFieldDescription()))
  fieldNameMaxLen += 4

  const fieldDesLines = Object.entries(config.getFieldDescription())
    .map(([field, des]) => [field, Array.isArray(des) ? des : [des]])
    .map(([field, desList]) => [
      `${field.padEnd(fieldNameMaxLen)}${desList.shift()}`,
      ...desList.map(des => `${''.padEnd(fieldNameMaxLen)}${des}`),
    ])
    .flat(Infinity)

  const comments = [
    config.getName(),
    config.getDescription(),
    strRepeat('=', 100),
    ...fieldDesLines,
  ]
    .map(line => `// ${line}`)
    .join('\n')

  const configContext = JSON.stringify(config.getDefaultConfig(), null, 2)

  return `${comments}\nwindow.${config.getKey()} = ${configContext};\n`
}

export function loadConfig() {
  return Object.values(configLoaderMap)
    .filter(config => config instanceof ConfigLoader)
    .map(config => loadItem(config))
    .join('\n')
}
