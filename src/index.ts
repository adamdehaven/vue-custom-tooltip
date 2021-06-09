import { App } from 'vue'
import VueCustomTooltip from './VueCustomTooltip.vue'
import { TooltipOptions, defaultTooltipOptions } from './types'
import './tooltip.scss'

export default {
  install: (app: App, options?: TooltipOptions): void => {
    const userOptions = Object.assign({}, options)

    /**
     * Validate HEX values
     * Hash, plus 3 or 6 valid characters
     */
    const hexRegex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    // Test color for valid HEX
    if (userOptions && userOptions.color && !hexRegex.test(userOptions.color)) {
      delete userOptions.color
    }
    // Test background for valid HEX
    if (userOptions && userOptions.background && !hexRegex.test(userOptions.background)) {
      delete userOptions.background
    }

    /**
     * Validate borderRadius
     * Number between 1-9, then any other numbers
     */
    const borderRadiusRegex = /^[0-9]+$/
    // Test borderRadius for integer
    if (userOptions && userOptions.borderRadius && !borderRadiusRegex.test(userOptions.borderRadius.toString())) {
      delete userOptions.borderRadius
    }

    /**
     * Validate fontWeight
     * Number between 1-9 followed by two zeros
     */
    const fontWeightRegex = /^[1-9]{1}00$/
    // Test fontWeight for integer
    if (userOptions && userOptions.fontWeight && !fontWeightRegex.test(userOptions.fontWeight.toString())) {
      delete userOptions.fontWeight
    }

    // Merge defaults with user options
    const pluginOptions: TooltipOptions = Object.assign({}, defaultTooltipOptions, userOptions)
    app.provide('vue-custom-tooltip', pluginOptions)

    // Register component, using options.name
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    app.component(pluginOptions.name!, VueCustomTooltip)
  },
}
