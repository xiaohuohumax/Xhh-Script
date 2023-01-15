export function loadStyle() {
  return Object.values(import.meta.globEager('@/**/*.vue'))
    .map(com => com.default.styles)
    .filter(style => style != undefined)
    .flat(Infinity)
    .map(style => style.replaceAll(':root', ':host'))
    .map(style => style.replaceAll(/(\.?\d+)rem/gm, '$1em'))
}
