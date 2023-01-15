import { ConfigError, ConfigErrorParam } from '../exception/config.error'
import { isDev } from '../utils/meta.env'

export class ConfigLoader {
  constructor({
    key = '',
    name = '',
    data = {},
    description = '',
    fieldAnnotations = {},
    checkCallback = (_data, _defaultData) => {},
  }) {
    this._key = key
    this._name = name
    this._data = data
    this._description = description
    this._fieldAnnotations = fieldAnnotations
    this._formatSpaceSize = 20
    this._formatDividingLineSize = 100
    this._checkCallback = checkCallback
  }

  _checkConfig(config) {
    try {
      this._data = this._checkCallback(config, this._data)
    } catch (err) {
      throw new ConfigError(
        this._name,
        this._key,
        err instanceof ConfigErrorParam ? err.param : null,
        err.message,
      )
    }
  }

  checkConfig() {
    this._checkConfig(this.getConfig())
  }

  checkDefaultConfig() {
    this._checkConfig(this._data)
  }

  getConfig() {
    return isDev ? this._data : window[this._key]
  }

  getConfigStr() {
    let fieldAnnotations = Object.entries(this._fieldAnnotations)
      .map(([key, value]) => [key, Array.isArray(value) ? value : [value]])
      .map(([key, value]) => [
        key.padEnd(this._formatSpaceSize) + value.shift(),
        ...value.map(item => ''.padEnd(this._formatSpaceSize) + item),
      ])
      .flat(Infinity)

    let comments = [
      this._name,
      this._description,
      ''.padEnd(this._formatDividingLineSize, '='),
      ...fieldAnnotations,
    ]
      .map(item => '// ' + item)
      .join('\n')

    const data = JSON.stringify(this._data, null, 2)

    return `${comments}\nwindow.${this._key} = ${data};\n`
  }
}
