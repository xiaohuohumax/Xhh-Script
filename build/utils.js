import path from 'path'

export function getRootPath(...addPath) {
  return path.resolve(process.cwd(), ...addPath).replaceAll('\\', '/')
}

export function strRepeat(str, repeatCount) {
  return ''.padEnd(repeatCount, str)
}

export function strListMaxLen(strList) {
  return Math.max(0, ...strList.map(str => str.length))
}
