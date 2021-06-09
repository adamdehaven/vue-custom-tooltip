'use strict';

var vue = require('vue');

var defaultTooltipOptions = {
    name: 'VueCustomTooltip',
    color: '#fff',
    background: '#000',
    borderRadius: 100,
    fontWeight: 400,
};

var script = vue.defineComponent({
    name: 'VueCustomTooltip',
    props: {
        label: String,
        // If user hovers (or sticky) should the tooltip show?
        active: {
            type: Boolean,
            default: true,
        },
        sticky: Boolean,
        multiline: Boolean,
        underlined: Boolean,
        abbreviation: Boolean,
        // Where to position the tooltip
        position: {
            type: String,
            default: 'is-top',
            validator: function validator(value) {
                return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1;
            },
        },
        // Size of the tooltip - forces 'is-large' if multiline is true
        size: {
            type: String,
            default: 'is-medium',
            validator: function validator(value) {
                return ['is-small', 'is-medium', 'is-large'].indexOf(value) > -1;
            },
        },
    },
    setup: function setup(props, ref) {
        var slots = ref.slots;
        var attrs = ref.attrs;

        var tooltipOptions = vue.inject('vue-custom-tooltip', defaultTooltipOptions);
        var setCssVars = function () {
            var htmlRoot = document && document.documentElement ? document.documentElement : null;
            if (htmlRoot) {
                /* eslint-disable @typescript-eslint/no-non-null-assertion */
                htmlRoot.style.setProperty('--vue-custom-tooltip-color', tooltipOptions.color);
                htmlRoot.style.setProperty('--vue-custom-tooltip-background', tooltipOptions.background);
                htmlRoot.style.setProperty('--vue-custom-tooltip-border-radius', ((tooltipOptions.borderRadius) + "px"));
                htmlRoot.style.setProperty('--vue-custom-tooltip-font-weight', tooltipOptions.fontWeight.toString());
                /* eslint-enable @typescript-eslint/no-non-null-assertion */
            }
        };
        vue.onMounted(setCssVars);
        return function () { return [
            vue.h(props.abbreviation ? 'abbr' : 'span', Object.assign({}, attrs, {
                'class': [
                    props.position,
                    props.multiline ? 'is-large' : props.size,
                    {
                        'vue-custom-tooltip': props.active && props.label,
                        'is-sticky': props.sticky,
                        'has-multiline': props.multiline,
                        'is-underlined': props.underlined || props.abbreviation,
                    } ],
                'data-label': props.label,
                'aria-label': props.label,
                'role': 'tooltip',
                'style': [{ cursor: props.abbreviation ? 'help' : 'pointer' }],
            }), slots) ]; };
    },
});

script.__file = "src/VueCustomTooltip.vue";

function styleInject(css, ref) {
  if ( ref === void 0 ) { ref = {}; }
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".vue-custom-tooltip{position:relative;display:inline-block;text-decoration-line:none!important}.vue-custom-tooltip.is-top:after,.vue-custom-tooltip.is-top:before{top:auto;right:auto;bottom:calc(100% + 7px);left:50%;transform:translateX(-50%)}.vue-custom-tooltip.is-top:before{border-top:5px solid #000;border-top:5px solid var(--vue-custom-tooltip-background,#000);border-right:5px solid transparent;border-left:5px solid transparent;bottom:calc(100% + 2px)}.vue-custom-tooltip.is-top.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-top.has-multiline.is-medium:after{width:210px}.vue-custom-tooltip.is-top.has-multiline.is-large:after{width:340px;padding:.5rem 1rem .65rem}.vue-custom-tooltip.is-right:after,.vue-custom-tooltip.is-right:before{top:50%;right:auto;bottom:auto;left:calc(100% + 7px);transform:translateY(-50%)}.vue-custom-tooltip.is-right:before{border-top:5px solid transparent;border-right:5px solid #000;border-right:5px solid var(--vue-custom-tooltip-background,#000);border-bottom:5px solid transparent;left:calc(100% + 3px)}.vue-custom-tooltip.is-right.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-right.has-multiline.is-medium:after{width:210px}.vue-custom-tooltip.is-right.has-multiline.is-large:after{width:340px;padding:.5rem 1rem .65rem}.vue-custom-tooltip.is-bottom:after,.vue-custom-tooltip.is-bottom:before{top:calc(100% + 7px);right:auto;bottom:auto;left:50%;transform:translateX(-50%)}.vue-custom-tooltip.is-bottom:before{border-right:5px solid transparent;border-bottom:5px solid #000;border-bottom:5px solid var(--vue-custom-tooltip-background,#000);border-left:5px solid transparent;top:calc(100% + 2px)}.vue-custom-tooltip.is-bottom.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-bottom.has-multiline.is-medium:after{width:210px}.vue-custom-tooltip.is-bottom.has-multiline.is-large:after{width:340px;padding:.5rem 1rem .65rem}.vue-custom-tooltip.is-left:after,.vue-custom-tooltip.is-left:before{top:50%;right:calc(100% + 7px);bottom:auto;left:auto;transform:translateY(-50%)}.vue-custom-tooltip.is-left:before{border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000;border-left:5px solid var(--vue-custom-tooltip-background,#000);right:calc(100% + 3px)}.vue-custom-tooltip.is-left.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-left.has-multiline.is-medium:after{width:210px}.vue-custom-tooltip.is-left.has-multiline.is-large:after{width:340px;padding:.5rem 1rem .65rem}.vue-custom-tooltip.is-underlined{border-bottom:1px dotted #000;border-bottom:1px dotted var(--vue-custom-tooltip-background,#000);line-height:1.2}.vue-custom-tooltip:after,.vue-custom-tooltip:before{position:absolute;content:\"\";opacity:0;visibility:hidden;pointer-events:none;transition:opacity 86ms ease-out,visibility 86ms ease-out}.vue-custom-tooltip:before{z-index:889}.vue-custom-tooltip:after{content:attr(data-label);color:#fff;color:var(--vue-custom-tooltip-color,#fff);background:#000;background:var(--vue-custom-tooltip-background,#000);width:auto;padding:.45rem .75rem;border-radius:12px;border-radius:var(--vue-custom-tooltip-border-radius,100px);font-size:.85rem!important;font-weight:400;font-weight:var(--vue-custom-tooltip-font-weight,400);line-height:1.3;letter-spacing:normal!important;text-transform:none;box-shadow:0 1px 2px 1px rgba(0,1,0,.2);z-index:888;white-space:nowrap}.vue-custom-tooltip:not([data-label=\"\"]):hover:after,.vue-custom-tooltip:not([data-label=\"\"]):hover:before{opacity:1;visibility:visible}:disabled .vue-custom-tooltip{pointer-events:none}.vue-custom-tooltip:not([data-label=\"\"]).is-sticky:after,.vue-custom-tooltip:not([data-label=\"\"]).is-sticky:before{opacity:1;visibility:visible}.vue-custom-tooltip.has-multiline:after{display:flex-block;padding:.5rem .75rem .65rem;text-align:center;line-height:1.4;white-space:pre-wrap}";
styleInject(css_248z);

var index = {
    install: function (app, options) {
        var userOptions = Object.assign({}, options);
        /**
         * Validate HEX values
         * Hash, plus 3 or 6 valid characters
         */
        var hexRegex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
        // Test color for valid HEX
        if (userOptions && userOptions.color && !hexRegex.test(userOptions.color)) {
            delete userOptions.color;
        }
        // Test background for valid HEX
        if (userOptions && userOptions.background && !hexRegex.test(userOptions.background)) {
            delete userOptions.background;
        }
        /**
         * Validate borderRadius
         * Number between 1-9, then any other numbers
         */
        var borderRadiusRegex = /^[0-9]+$/;
        // Test borderRadius for integer
        if (userOptions && userOptions.borderRadius && !borderRadiusRegex.test(userOptions.borderRadius.toString())) {
            delete userOptions.borderRadius;
        }
        /**
         * Validate fontWeight
         * Number between 1-9 followed by two zeros
         */
        var fontWeightRegex = /^[1-9]{1}00$/;
        // Test fontWeight for integer
        if (userOptions && userOptions.fontWeight && !fontWeightRegex.test(userOptions.fontWeight.toString())) {
            delete userOptions.fontWeight;
        }
        // Merge defaults with user options
        var pluginOptions = Object.assign({}, defaultTooltipOptions, userOptions);
        app.provide('vue-custom-tooltip', pluginOptions);
        // Register component, using options.name
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        app.component(pluginOptions.name, script);
    },
};

module.exports = index;
