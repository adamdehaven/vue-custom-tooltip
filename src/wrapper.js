// Import vue component
import VueCustomTooltip from './VueCustomTooltip.vue'

const defaultOptions = {
    name: 'VueCustomTooltip',
    color: '#fff',
    background: '#1b2735',
    borderRadius: 12,
    fontWeight: 400,
}

// Declare install function executed by Vue.use()
export function install(Vue) {
    if (install.installed) return
    install.installed = true

    Vue.prototype.$vueCustomTooltip = defaultOptions

    Vue.component('VueCustomTooltip', VueCustomTooltip)
}

// Create module definition for Vue.use()
const plugin = {
    install,
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue
}
if (GlobalVue) {
    GlobalVue.use(plugin)
}

// To allow use as module (npm/webpack/etc.) export component
export default VueCustomTooltip
