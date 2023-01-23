import { VueElement, defineComponent, createApp, getCurrentInstance, h } from 'vue'

export function defineCustomElement({ component, plugins = [] }, hydrate) {
  const Comp = defineComponent({
    setup() {
      const app = createApp()
      plugins.map(plugin => app.use(plugin))
      const inst = getCurrentInstance()
      Object.assign(inst.appContext, app._context)
      Object.assign(inst.provides, app._context.provides)
    },
    render: () => h(component),
    styles: component.styles,
  })
  class CustomElement extends VueElement {
    constructor(initialProps) {
      super(Comp, initialProps, hydrate)
      this._styleElements = []
    }
    clearStyle() {
      this._styleElements.map(ele => ele.remove())
    }
    _applyStyles(styles) {
      if (styles) {
        styles.reverse().forEach(css => {
          const s = document.createElement('style')
          s.textContent = css
          this.shadowRoot.prepend(s)
          this._styleElements.push(s)
        })
      }
    }
    loadStyle(styles) {
      this.clearStyle()
      this._applyStyles(styles)
    }
  }
  CustomElement.def = Comp
  return CustomElement
}
