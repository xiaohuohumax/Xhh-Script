import { getHeader } from '../src/header/headers'
import { strListMaxLen } from './utils'

function createHeader(header) {
  let maxLen = strListMaxLen(Object.keys(header))
  maxLen += 4
  return [
    '// ==UserScript==',
    ...Object.entries(header)
      .filter(([name]) => name.length > 0)
      .map(([name, value]) => [name, Array.isArray(value) ? value : [value]])
      .map(([name, values]) => values.map(value => `// @${name.padEnd(maxLen)}${value}`))
      .flat(Infinity),
    '// ==/UserScript==',
  ].join('\n')
}

export function loadHeader() {
  return createHeader(getHeader())
}

export function loadTestHeader(scriptPath) {
  let testHeader = getHeader()
  let req = testHeader['require']
  if (req == undefined) {
    testHeader['require'] = []
  } else if (!Array.isArray(req)) {
    testHeader['require'] = [req]
  }
  testHeader['require'].push(`file://${scriptPath}`)
  return createHeader(testHeader)
}
