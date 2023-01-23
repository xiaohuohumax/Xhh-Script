export function loadStyle() {
  return Object.values(import.meta.glob('./**/*.vue', { eager: true }))
    .map(module => module.default.styles)
    .filter(style => style != undefined)
    .flat(Infinity)
    .map(style => style.replaceAll(':root', ':host'))
    .map(style => style.replaceAll(/(\d+)rem/gi, '$1em'))
}
