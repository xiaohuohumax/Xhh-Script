export class ConfigCheckError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConfigCheckError'
  }
}
