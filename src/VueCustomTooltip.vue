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
      if (!tooltipOptions || !defaultTooltipOptions) {
        return
      }

      const htmlRoot: HTMLElement | null = document && document.documentElement ? document.documentElement : null
      if (htmlRoot) {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        htmlRoot.style.setProperty(
          '--vue-custom-tooltip-color',
          tooltipOptions.color !== defaultTooltipOptions.color ? tooltipOptions.color! : null,
        )
        htmlRoot.style.setProperty(
          '--vue-custom-tooltip-background',
          tooltipOptions.background !== defaultTooltipOptions.background ? tooltipOptions.background! : null,
        )
        htmlRoot.style.setProperty(
          '--vue-custom-tooltip-border-radius',
          tooltipOptions.borderRadius !== defaultTooltipOptions.borderRadius
            ? `${tooltipOptions.borderRadius!}px`
            : null,
        )
        htmlRoot.style.setProperty(
          '--vue-custom-tooltip-font-weight',
          tooltipOptions.fontWeight !== defaultTooltipOptions.fontWeight ? tooltipOptions.fontWeight!.toString() : null,
        )
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      }
    }

    onMounted(setCssVars)

    return () => [
      h(
        props.abbreviation ? 'abbr' : 'span',
        {
          'class': [
            attrs.class,
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
          'style': [{ cursor: props.abbreviation ? 'help' : 'pointer' }, attrs.style],
        },
        slots,
      ),
    ]
  },
})
</script>

<style lang="scss">
$tooltip-color: var(--vue-custom-tooltip-color, #fff); // default color
$tooltip-background: var(--vue-custom-tooltip-background, #000); // default background color
$tooltip-radius: var(--vue-custom-tooltip-border-radius, 100px); // default border radius
$weight-normal: var(--vue-custom-tooltip-font-weight, 400); // default font weight
$speed: 86ms;
$easing: ease-out;

@mixin tooltip-arrow($direction, $color) {
  @if $direction == 'is-top' {
    border-top: 5px solid #000; // default for IE
    border-top: 5px solid $color;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    bottom: calc(100% + 2px);
  } @else if $direction == 'is-bottom' {
    border-right: 5px solid transparent;
    border-bottom: 5px solid #000; // default for IE
    border-bottom: 5px solid $color;
    border-left: 5px solid transparent;
    top: calc(100% + 2px);
  } @else if $direction == 'is-right' {
    border-top: 5px solid transparent;
    border-right: 5px solid #000; // default for IE
    border-right: 5px solid $color;
    border-bottom: 5px solid transparent;
    left: calc(100% + 3px);
  } @else if $direction == 'is-left' {
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid #000; // default for IE
    border-left: 5px solid $color;
    right: calc(100% + 3px);
  }
}

@mixin tooltip($direction) {
  &.#{$direction} {
    &:before,
    &:after {
      @if ($direction == 'is-top') {
        top: auto;
        right: auto;
        bottom: calc(100% + 5px + 2px);
        left: 50%;
        transform: translateX(-50%);
      } @else if ($direction == 'is-bottom') {
        top: calc(100% + 5px + 2px);
        right: auto;
        bottom: auto;
        left: 50%;
        transform: translateX(-50%);
      } @else if ($direction == 'is-right') {
        top: 50%;
        right: auto;
        bottom: auto;
        left: calc(100% + 5px + 2px);
        transform: translateY(-50%);
      } @else if ($direction == 'is-left') {
        top: 50%;
        right: calc(100% + 5px + 2px);
        bottom: auto;
        left: auto;
        transform: translateY(-50%);
      }
    }

    &:before {
      @include tooltip-arrow($direction, $tooltip-background);
    }

    &.has-multiline {
      &.is-small:after {
        width: 140px;
      }

      &.is-medium:after {
        width: 250px;
        padding: 0.6rem 1.25rem 0.65rem;
      }

      &.is-large:after {
        width: 480px;
        padding: 0.6rem 1.25rem 0.65rem;
      }
    }
  }
}
// Base
.vue-custom-tooltip {
  @include tooltip('is-top');
  @include tooltip('is-right');
  @include tooltip('is-bottom');
  @include tooltip('is-left');
  position: relative;
  display: inline-block;
  text-decoration-line: none !important;

  &.is-underlined {
    border-bottom: 1px dotted #000; // default for IE
    border-bottom: 1px dotted $tooltip-background;
    line-height: 1.2;
  }

  &:before,
  &:after {
    position: absolute;
    content: '';
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity $speed $easing, visibility $speed $easing;
  }

  &:before {
    z-index: 889;
  }

  &:after {
    content: attr(data-label);
    color: #fff; // default for IE
    color: $tooltip-color;
    background: #000; // default for IE
    background: $tooltip-background;
    width: auto;
    max-width: 100vw;
    padding: 0.45rem 0.75rem 0.45rem;
    border-radius: 100px; // default for IE
    border-radius: $tooltip-radius;
    font-size: 0.85rem !important;
    font-weight: 400; // default for IE
    font-weight: $weight-normal;
    line-height: 1.3;
    letter-spacing: normal !important;
    text-transform: none;
    box-shadow: 0px 1px 2px 1px rgba(0, 1, 0, 0.2);
    z-index: 888;
    white-space: nowrap;
  }

  &:not([data-label='']):hover:before,
  &:not([data-label='']):hover:after {
    opacity: 1;
    visibility: visible;
  }

  // If parent is disabled
  :disabled & {
    pointer-events: none;
  }

  &:not([data-label='']).is-sticky {
    &:before,
    &:after {
      opacity: 1;
      visibility: visible;
    }
  }

  &.has-multiline {
    &:after {
      display: block;
      padding: 0.5rem 0.75rem 0.65rem;
      text-align: center;
      line-height: 1.4;
      white-space: pre-wrap;
    }
  }
}
</style>
