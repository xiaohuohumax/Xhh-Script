export class ConfigError extends Error {
  constructor(module, key, param, message) {
    super(`[${module}] window.${param == null ? key : `${key}.${param}`}: ${message}`)
    this.name = 'ConfigError'
  }
}

export class ConfigErrorParam extends Error {
  constructor(param, message) {
    super(message)
    this.param = param
    this.name = 'ConfigErrorParam'
  }
}
