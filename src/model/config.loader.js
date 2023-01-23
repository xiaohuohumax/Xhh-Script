export class ConfigLoader {
  constructor({
    key,
    config = {},
    name = '',
    description = '',
    fieldDescription = {},
    checkCallback = ({
      key,
      name,
      description,
      fieldDescription,
      config = {},
      defaultConfig = {},
    }) => config,
  }) {
    this._key = key
    this._defaultConfig = config
    this._name = name
    this._description = description
    this._fieldDescription = fieldDescription
    this._checkCallback = checkCallback
  }

  getKey() {
    return this._key
  }

  getName() {
    return this._name
  }

  getDescription() {
    return this._description
  }

  getFieldDescription() {
    return this._fieldDescription
  }

  getDefaultConfig() {
    return this._defaultConfig
  }

  getConfig() {
    const isDev = import.meta.env.DEV
    return isDev ? this._defaultConfig : window[this._key]
  }

  _check(config) {
    const checkRes = this._checkCallback({
      key: this._key,
      name: this._name,
      description: this._description,
      fieldDescription: this._fieldDescription,
      config,
      defaultConfig: this._defaultConfig,
    })
    this._defaultConfig = checkRes == undefined ? this._defaultConfig : checkRes
  }

  checkConfig() {
    this._check(this.getConfig())
  }

  checkDeafultConfig() {
    this._check(this._defaultConfig)
  }
}
