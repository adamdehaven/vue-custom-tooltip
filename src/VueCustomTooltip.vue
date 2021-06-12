<template>
  <component
    :is="isAbbreviation ? 'abbr' : 'span'"
    :data-label="labelText"
    :aria-label="labelText"
    role="tooltip"
    :class="[
      hasPosition,
      hasSize,
      {
        'vue-custom-tooltip': isActive && labelText,
        'is-sticky': isSticky,
        'has-multiline': isMultiline,
        'is-underlined': isUnderlined || isAbbreviation,
      },
    ]"
    :style="[dynamicStyles, { cursor: isAbbreviation ? 'help' : 'pointer' }]"
  >
    <slot name="default"></slot>
  </component>
</template>

<script>
export default {
  name: 'VueCustomTooltip',
  props: {
    label: String,
    active: {
      type: Boolean,
      default: true,
    },
    sticky: Boolean, // Always showing
    multiline: Boolean, // Multiple lines
    underlined: Boolean,
    abbreviation: Boolean,
    position: {
      type: String,
      default: 'is-top',
      validator(value) {
        return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1
      },
    },
    size: {
      type: String,
      default: 'is-medium',
      validator(value) {
        return ['is-small', 'is-medium', 'is-large'].indexOf(value) > -1
      },
    },
  },
  data() {
    return {
      labelText: this.label || null,
      isActive: this.active || true,
      isSticky: this.sticky || false,
      isMultiline: this.multiline || false,
      isUnderlined: this.underlined || false,
      isAbbreviation: this.abbreviation || false,
      hasPosition: this.position || 'is-top',
      hasSize: this.size || 'is-medium',
    }
  },
  computed: {
    dynamicStyles() {
      return {
        '--vue-custom-tooltip-color':
          this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('color')
            ? this.$vueCustomTooltip.color
            : null,
        '--vue-custom-tooltip-background':
          this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('background')
            ? this.$vueCustomTooltip.background
            : null,
        '--vue-custom-tooltip-border-radius':
          this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('borderRadius')
            ? this.$vueCustomTooltip.borderRadius
            : null,
        '--vue-custom-tooltip-font-weight':
          this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('fontWeight')
            ? this.$vueCustomTooltip.fontWeight
            : null,
      }
    },
  },
  watch: {
    label: {
      handler(value) {
        this.labelText = value
      },
      immediate: true,
    },
    active: {
      handler(value) {
        this.isActive = value
      },
      immediate: true,
    },
    sticky: {
      handler(value) {
        this.isSticky = value
      },
      immediate: true,
    },
    multiline: {
      handler(value) {
        this.isMultiline = value
      },
      immediate: true,
    },
    underlined: {
      handler(value) {
        this.isUnderlined = value
      },
      immediate: true,
    },
    abbreviation: {
      handler(value) {
        this.isAbbreviation = value
      },
      immediate: true,
    },
    position: {
      handler(value) {
        this.hasPosition = value
      },
      immediate: true,
    },
    size: {
      handler(value) {
        this.hasSize = value
      },
      immediate: true,
    },
  },
}
</script>

<style>
/* Set defaults */
.vue-custom-tooltip {
  --vue-custom-tooltip-color: #fff;
  --vue-custom-tooltip-background: #000;
  --vue-custom-tooltip-border-radius: 100px;
  --vue-custom-tooltip-font-weight: 400;
}
</style>

<style lang="stylus">
$tooltip-color = var(--vue-custom-tooltip-color, #fff) // default color
$tooltip-background = var(--vue-custom-tooltip-background, #000) // default background color
$tooltip-radius = var(--vue-custom-tooltip-border-radius, 100px) // default border radius
$weight-normal = var(--vue-custom-tooltip-font-weight, 400) // default font weight
$speed = 86ms
$easing = ease-out

tooltip-arrow($direction, $color)
    if ($direction == 'is-top')
        border-top 5px solid #000 // default for IE
        border-top 5px solid $color
        border-right 5px solid transparent
        border-left 5px solid transparent
        bottom calc(100% + 2px)
    else if ($direction == 'is-bottom')
        border-right 5px solid transparent
        border-bottom 5px solid #000 // default for IE
        border-bottom 5px solid $color
        border-left 5px solid transparent
        top calc(100% + 2px)
    else if ($direction == 'is-right')
        border-top 5px solid transparent
        border-right 5px solid #000 // default for IE
        border-right 5px solid $color
        border-bottom 5px solid transparent
        left calc(100% + 2px)
    else if ($direction == 'is-left')
        border-top 5px solid transparent
        border-bottom 5px solid transparent
        border-left 5px solid #000 // default for IE
        border-left 5px solid $color
        right calc(100% + 2px)

tooltip($direction)
    &.{$direction}
        &:before, &:after
            if ($direction == 'is-top')
                top auto
                right auto
                bottom calc(100% + 5px + 2px)
                left 50%
                transform translateX(-50%)
            else if ($direction == 'is-bottom')
                top calc(100% + 5px + 2px)
                right auto
                bottom auto
                left 50%
                transform translateX(-50%)
            else if ($direction == 'is-right')
                top 50%
                right auto
                bottom auto
                left calc(100% + 5px + 2px)
                transform translateY(-50%)
            else if ($direction == 'is-left')
                top 50%
                right calc(100% + 5px + 2px)
                bottom auto
                left auto
                transform translateY(-50%)

        &:before
            tooltip-arrow($direction, $tooltip-background)

        &.has-multiline
            &.is-small:after
                width 140px

            &.is-medium:after
                width 250px
                padding 0.6rem 1.25rem 0.65rem

            &.is-large:after
                width 480px
                padding 0.6rem 1rem 0.65rem

// Base
.vue-custom-tooltip
    tooltip('is-top')
    tooltip('is-right')
    tooltip('is-bottom')
    tooltip('is-left')
    position relative
    display inline-block
    text-decoration-line none !important

    &.is-underlined
        border-bottom 1px dotted #000 // default for IE
        border-bottom 1px dotted $tooltip-background
        line-height 1.2

    &:before, &:after
        position absolute
        content ''
        opacity 0
        visibility hidden
        pointer-events none
        transition opacity $speed $easing, visibility $speed $easing

    &:before
        z-index 889

    &:after
        content attr(data-label)
        color #fff // default for IE
        color $tooltip-color
        background #000 // default for IE
        background $tooltip-background
        width auto
        max-width 100vw
        padding 0.35rem 0.75rem 0.45rem
        border-radius 100px // default for IE
        border-radius $tooltip-radius
        font-size 0.85rem !important
        font-weight 400 // default for IE
        font-weight $weight-normal
        line-height 1.3
        letter-spacing normal !important
        text-transform none
        box-shadow 0px 1px 2px 1px rgba(0, 1, 0, 0.2)
        z-index 888
        white-space nowrap

    &:not([data-label='']):hover:before, &:not([data-label='']):hover:after
        opacity 1
        visibility visible

    // If parent is disabled
    :disabled &
        pointer-events none

    &:not([data-label='']).is-sticky
        &:before, &:after
            opacity 1
            visibility visible

    &.has-multiline
        &:after
            display block
            padding 0.5rem 0.75rem 0.65rem
            text-align center
            line-height 1.4
            white-space pre-wrap
</style>
