import VueCustomTooltip from './VueCustomTooltip.vue'

const defaultOptions = {
    name: 'VueCustomTooltip',
    color: '#fff',
    background: '#1b2735',
    borderRadius: 12,
    fontWeight: 400,
}

const VueCustomTooltipPlugin = {
    install(Vue, opt = {}) {
        // Grab user options
        let userOptions = { ...opt }

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
        let options = { ...defaultOptions, ...userOptions }

        // Mutate borderRadius
        options.borderRadius = options.borderRadius + 'px'

        // Add global property (mainly for passing styles)
        Vue.prototype.$vueCustomTooltip = options

        // Register component, using options.name.
        // e.g. <VueCustomTooltip>
        Vue.component(options.name, VueCustomTooltip)
    }
}

export default VueCustomTooltipPlugin