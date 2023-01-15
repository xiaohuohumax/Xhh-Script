import packageJson from '../../package.json'

export default {
  info: (...info) => console.log(`%c[${packageJson.name}]`, 'color:black;', ...info),
  error: (...info) => console.log(`%c[${packageJson.name}][error]`, 'color:red;', ...info),
  success: (...info) => console.log(`%c[${packageJson.name}]`, 'color:green;', ...info),
  warning: (...info) => console.log(`%c[${packageJson.name}][warning]`, 'color:orange;', ...info),
}
