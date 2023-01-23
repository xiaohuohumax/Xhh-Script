import { ConfigCheckError } from '../../src/exception/config.error'
import { checkDeafultConfig } from '../../src/config'
import { loadHeader, loadTestHeader } from '../load.header'
import { loadConfig } from '../load.config'
import { getRootPath } from '../utils'
import globalConfig from '../../global.config'
import fs from 'fs-extra'
import chalk from 'chalk'

/** @return {import('vite').Plugin} */
export default function tampermonkeyPlugin(_config) {
  return {
    name: 'vite:tampermonkey',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      console.log('')
      const templateTamPath = getRootPath('build/template/tampermonkey.txt')
      const templateTestPath = getRootPath('build/template/test.txt')
      const scriptPath = getRootPath(globalConfig.outDir, globalConfig.scriptName)
      const testPath = getRootPath(globalConfig.outDir, globalConfig.testScriptName)

      try {
        checkDeafultConfig()

        let templateTam = fs.readFileSync(templateTamPath, 'utf-8')

        templateTam = templateTam.replace('[{{code}}]', () => fs.readFileSync(scriptPath, 'utf-8'))
        templateTam = templateTam.replace('[{{config}}]', () => loadConfig())
        templateTam = templateTam.replace('[{{header}}]', () => loadHeader())

        fs.writeFileSync(scriptPath, templateTam)

        let templateTest = fs.readFileSync(templateTestPath, 'utf-8')

        templateTest = templateTest.replace('[{{header}}]', () => loadTestHeader(scriptPath))

        fs.writeFileSync(testPath, templateTest)

        console.log(chalk.green('build success:', scriptPath))
      } catch (err) {
        if (err instanceof ConfigCheckError) {
          console.log(chalk.red('config check error:', err.message))
        } else {
          console.log(chalk.red('unknown error:', err.message))
        }
        console.log(chalk.red('script build fail'))
      }
    },
  }
}
