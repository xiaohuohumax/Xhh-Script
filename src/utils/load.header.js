import headers from '../header/headers'

export function loadHeader() {
  const headerContext = Object.entries(headers)
    .map(([name, data]) => [name, Array.isArray(data) ? data : [data]])
    .map(([name, datas]) => datas.map(value => `// @${name.padEnd(20)}${value}\n`).join(''))
    .join('')
  return `// ==UserScript==\n${headerContext}// ==/UserScript==`
}
