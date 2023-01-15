import headersJson from './headers.json'
import packageJson from '../../package.json'

export default Object.assign(headersJson, {
  namespace: packageJson.repository,
  version: packageJson.version,
  description: packageJson.description,
  author: packageJson.author,
  license: packageJson.license,
})
