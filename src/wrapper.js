// Import vue component
import VueCustomTooltip from './VueCustomTooltip.vue'

const defaultOptions = {
    name: 'VueCustomTooltip',
    color: '#fff',
    background: '#000',
    borderRadius: 12,
    fontWeight: 400,
}

// Declare install function executed by Vue.use()
const install = function installMyComponent(Vue, opt) {
    if (install.installed) return
    install.installed = true

    // Grab user options
    let userOptions = Object.assign({}, opt)

    // HEX regex: Hash, plus 3 or 6 valid characters
    const hexRegex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    // Test color for valid HEX
    if (userOptions.hasOwnProperty('color') && !hexRegex.test(userOptions.color)) {
        delete userOptions.color
    }
    // Test background for valid HEX
    if (userOptions.hasOwnProperty('background') && !hexRegex.test(userOptions.background)) {
        delete userOptions.background
    }

    // borderRadius regex: number between 1-9, then any other numbers
    const borderRadiusRegex = /^[0-9]+$/
    // Test borderRadius for integer
    if (userOptions.hasOwnProperty('borderRadius') && !borderRadiusRegex.test(userOptions.borderRadius)) {
        delete userOptions.borderRadius
    }

    // fontWeight regex: number between 1-9 followed by two zeros
    const fontWeightRegex = /^[1-9]{1}00$/
    // Test fontWeight for integer
    if (userOptions.hasOwnProperty('fontWeight') && !fontWeightRegex.test(userOptions.fontWeight)) {
        delete userOptions.fontWeight
    }

    // Merge options
    let options = Object.assign({}, defaultOptions, userOptions)

    // Mutate borderRadius
    options.borderRadius = options.borderRadius + 'px'

    // Add global property (mainly for passing styles)
    Vue.prototype.$vueCustomTooltip = options

    // Register component, using options.name.
    // e.g. <VueCustomTooltip>
    Vue.component(options.name, VueCustomTooltip)
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
    GlobalVue.use(plugin, defaultOptions)
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
VueCustomTooltip.install = install;

// To allow use as module (npm/webpack/etc.) export component
export default VueCustomTooltip
