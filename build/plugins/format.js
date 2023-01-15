import { loadConfig, checkDefaultConfig } from '../../src/utils/load.config'
import { ConfigError } from '../../src/exception/config.error'
import { loadHeader } from '../../src/utils/load.header'
import globalConfig from '../../global.config'
import fs from 'fs-extra'
import chalk from 'chalk'
import path from 'path'

function getRootPath(...addPath) {
  return path.resolve(process.cwd(), ...addPath).replaceAll('\\', '/')
}

export function setupFormat({}) {
  return {
    name: 'vite:format',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const scriptPath = getRootPath(globalConfig.outDir, globalConfig.scriptName)
      const templatePath = getRootPath('build/plugins/template.txt')

      try {
        checkDefaultConfig()

        let scriptTmp = fs.readFileSync(templatePath, 'utf-8')

        scriptTmp = scriptTmp.replace('[{{code}}]', fs.readFileSync(scriptPath, 'utf-8'))
        scriptTmp = scriptTmp.replace('[{{config}}]', loadConfig())
        scriptTmp = scriptTmp.replace('[{{header}}]', loadHeader())

        fs.writeFileSync(scriptPath, scriptTmp)

        console.log(chalk.green('create script success!'))
        console.log(chalk.green('script path:'), scriptPath)
      } catch (err) {
        fs.removeSync(scriptPath)
        if (err instanceof ConfigError) {
          console.log(chalk.red('default config cehck error'), err.message)
        } else {
          console.log(chalk.red('unknow error'), err.message)
        }
        console.log(chalk.red('create script fail!'))
      }
    },
  }
}
