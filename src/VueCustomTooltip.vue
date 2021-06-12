<script lang="ts">
import { defineComponent, h, inject, onMounted } from 'vue'
import { TooltipOptions, defaultTooltipOptions } from './types'

export default defineComponent({
  name: 'VueCustomTooltip',
  props: {
    label: String, // Tooltip text
    // If user hovers (or sticky) should the tooltip show?
    active: {
      type: Boolean,
      default: true,
    },
    sticky: Boolean, // Always showing
    multiline: Boolean, // Multiple lines
    underlined: Boolean,
    abbreviation: Boolean, // Determines span | abbr element
    // Where to position the tooltip
    position: {
      type: String,
      default: 'is-top',
      validator(this: void, value: string): boolean {
        return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1
      },
    },
    size: {
      type: String,
      default: 'is-medium',
      validator(this: void, value: string): boolean {
        return ['is-small', 'is-medium', 'is-large'].indexOf(value) > -1
      },
    },
  },
  setup(props, { slots, attrs }) {
    const tooltipOptions: TooltipOptions = inject('vue-custom-tooltip', defaultTooltipOptions)

    const setCssVars = () => {
      const htmlRoot: HTMLElement | null = document && document.documentElement ? document.documentElement : null
      if (htmlRoot) {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        htmlRoot.style.setProperty('--vue-custom-tooltip-color', tooltipOptions.color!)
        htmlRoot.style.setProperty('--vue-custom-tooltip-background', tooltipOptions.background!)
        htmlRoot.style.setProperty('--vue-custom-tooltip-border-radius', `${tooltipOptions.borderRadius!}px`)
        htmlRoot.style.setProperty('--vue-custom-tooltip-font-weight', tooltipOptions.fontWeight!.toString())
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      }
    }

    onMounted(setCssVars)

    return () => [
      h(
        props.abbreviation ? 'abbr' : 'span',
        Object.assign({}, attrs, {
          'class': [
            props.position,
            // force at least medium size if multiline is true
            props.multiline && props.size === 'is-small' ? 'is-medium' : props.size,
            {
              'vue-custom-tooltip': props.active && props.label,
              'is-sticky': props.sticky,
              'has-multiline': props.multiline,
              'is-underlined': props.underlined || props.abbreviation,
            },
          ],
          'data-label': props.label,
          'aria-label': props.label,
          'role': 'tooltip',
          'style': [{ cursor: props.abbreviation ? 'help' : 'pointer' }],
        }),
        slots,
      ),
    ]
  },
})
</script>
