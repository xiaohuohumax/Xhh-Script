import packageJson from '../../package.json'

export default {
  success: (...info) => console.info(`[${packageJson.name}]`, ...info),
  error: (...info) => console.error(`[${packageJson.name}]`, ...info),
  warning: (...info) => console.warn(`[${packageJson.name}]`, ...info),
  info: (...info) => console.log(`[${packageJson.name}]`, ...info),
}
