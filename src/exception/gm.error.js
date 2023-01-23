export class GMNoAuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GMNoAuthError'
  }
}
