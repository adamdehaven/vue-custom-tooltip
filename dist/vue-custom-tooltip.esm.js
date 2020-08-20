//
//
//
//
//
//

var script = {
    name: 'VueCustomTooltip',
    props: {
        label: String,
        active: {
            type: Boolean,
            default: true
        },
        sticky: Boolean, // Always showing
        multiline: Boolean, // Multiple lines
        underlined: Boolean,
        abbreviation: Boolean,
        position: {
            type: String,
            default: 'is-top',
            validator: function validator(value) {
                return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1
            }
        },
        size: {
            type: String,
            default: 'is-medium',
            validator: function validator(value) {
                return ['is-small', 'is-medium', 'is-large'].indexOf(value) > -1
            }
        },
    },
    data: function data() {
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
        dynamicStyles: function dynamicStyles() {
            return {
                '--color': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('color') ? this.$vueCustomTooltip.color : null,
                '--background': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('background') ? this.$vueCustomTooltip.background : null,
                '--border-radius': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('borderRadius') ? this.$vueCustomTooltip.borderRadius : null,
                '--font-weight': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('fontWeight') ? this.$vueCustomTooltip.fontWeight : null,
            }
        }
    },
    watch: {
        label: {
            handler: function handler(value) {
                this.labelText = value;
            },
            immediate: true
        },
        active: {
            handler: function handler(value) {
                this.isActive = value;
            },
            immediate: true
        },
        sticky: {
            handler: function handler(value) {
                this.isSticky = value;
            },
            immediate: true
        },
        multiline: {
            handler: function handler(value) {
                this.isMultiline = value;
            },
            immediate: true
        },
        underlined: {
            handler: function handler(value) {
                this.isUnderlined = value;
            },
            immediate: true
        },
        abbreviation: {
            handler: function handler(value) {
                this.isAbbreviation = value;
            },
            immediate: true
        },
        position: {
            handler: function handler(value) {
                this.hasPosition = value;
            },
            immediate: true
        },
        size: {
            handler: function handler(value) {
                this.hasSize = value;
            },
            immediate: true
        },
    },
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    _vm.isAbbreviation ? "abbr" : "span",
    {
      tag: "component",
      class: [
        _vm.hasPosition,
        _vm.hasSize,
        {
          "vue-custom-tooltip": _vm.isActive && _vm.labelText,
          "is-sticky": _vm.isSticky,
          "has-multiline": _vm.isMultiline,
          "is-underlined": _vm.isUnderlined || _vm.isAbbreviation
        }
      ],
      style: [
        _vm.dynamicStyles,
        { cursor: _vm.isAbbreviation ? "help" : "pointer" }
      ],
      attrs: {
        "data-label": _vm.labelText,
        "aria-label": _vm.labelText,
        role: "tooltip"
      }
    },
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-966d222c_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n/* Set defaults */\n.vue-custom-tooltip {\r\n    --color: #fff;\r\n    --background: #1b2735;\r\n    --border-radius: 12px;\r\n    --font-weight: 400;\n}\r\n", map: {"version":3,"sources":["D:\\adam\\Development\\vue-custom-tooltip\\src\\VueCustomTooltip.vue"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AA8GA,iBAAA;AACA;IACA,aAAA;IACA,qBAAA;IACA,qBAAA;IACA,kBAAA;AACA","file":"VueCustomTooltip.vue","sourcesContent":["<template>\r\n    <component :is=\"isAbbreviation ? 'abbr' : 'span'\" :data-label=\"labelText\" :aria-label=\"labelText\" role=\"tooltip\" :class=\"[hasPosition, hasSize, { 'vue-custom-tooltip': isActive && labelText, 'is-sticky': isSticky, 'has-multiline': isMultiline, 'is-underlined': isUnderlined || isAbbreviation }]\" :style=\"[dynamicStyles, { cursor: isAbbreviation ? 'help' : 'pointer' }]\">\r\n        <slot name=\"default\"></slot>\r\n    </component>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n    name: 'VueCustomTooltip',\r\n    props: {\r\n        label: String,\r\n        active: {\r\n            type: Boolean,\r\n            default: true\r\n        },\r\n        sticky: Boolean, // Always showing\r\n        multiline: Boolean, // Multiple lines\r\n        underlined: Boolean,\r\n        abbreviation: Boolean,\r\n        position: {\r\n            type: String,\r\n            default: 'is-top',\r\n            validator(value) {\r\n                return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1\r\n            }\r\n        },\r\n        size: {\r\n            type: String,\r\n            default: 'is-medium',\r\n            validator(value) {\r\n                return ['is-small', 'is-medium', 'is-large'].indexOf(value) > -1\r\n            }\r\n        },\r\n    },\r\n    data() {\r\n        return {\r\n            labelText: this.label || null,\r\n            isActive: this.active || true,\r\n            isSticky: this.sticky || false,\r\n            isMultiline: this.multiline || false,\r\n            isUnderlined: this.underlined || false,\r\n            isAbbreviation: this.abbreviation || false,\r\n            hasPosition: this.position || 'is-top',\r\n            hasSize: this.size || 'is-medium',\r\n        }\r\n    },\r\n    computed: {\r\n        dynamicStyles() {\r\n            return {\r\n                '--color': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('color') ? this.$vueCustomTooltip.color : null,\r\n                '--background': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('background') ? this.$vueCustomTooltip.background : null,\r\n                '--border-radius': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('borderRadius') ? this.$vueCustomTooltip.borderRadius : null,\r\n                '--font-weight': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('fontWeight') ? this.$vueCustomTooltip.fontWeight : null,\r\n            }\r\n        }\r\n    },\r\n    watch: {\r\n        label: {\r\n            handler(value) {\r\n                this.labelText = value\r\n            },\r\n            immediate: true\r\n        },\r\n        active: {\r\n            handler(value) {\r\n                this.isActive = value\r\n            },\r\n            immediate: true\r\n        },\r\n        sticky: {\r\n            handler(value) {\r\n                this.isSticky = value\r\n            },\r\n            immediate: true\r\n        },\r\n        multiline: {\r\n            handler(value) {\r\n                this.isMultiline = value\r\n            },\r\n            immediate: true\r\n        },\r\n        underlined: {\r\n            handler(value) {\r\n                this.isUnderlined = value\r\n            },\r\n            immediate: true\r\n        },\r\n        abbreviation: {\r\n            handler(value) {\r\n                this.isAbbreviation = value\r\n            },\r\n            immediate: true\r\n        },\r\n        position: {\r\n            handler(value) {\r\n                this.hasPosition = value\r\n            },\r\n            immediate: true\r\n        },\r\n        size: {\r\n            handler(value) {\r\n                this.hasSize = value\r\n            },\r\n            immediate: true\r\n        },\r\n    },\r\n}\r\n</script>\r\n\r\n<style>\r\n/* Set defaults */\r\n.vue-custom-tooltip {\r\n    --color: #fff;\r\n    --background: #1b2735;\r\n    --border-radius: 12px;\r\n    --font-weight: 400;\r\n}\r\n</style>\r\n\r\n<style lang=\"stylus\">\r\n$tooltip-color = var(--color) // default color\r\n$tooltip-background = var(--background) // default background color\r\n$tooltip-radius = var(--border-radius) // default border radius\r\n$weight-normal = var(--font-weight) // default font weight\r\n$speed = 86ms\r\n$easing = ease-out\r\n\r\ntooltip-arrow($direction, $color)\r\n    if ($direction == 'is-top')\r\n        border-top: 5px solid #1b2735 // default for IE\r\n        border-top: 5px solid $color\r\n        border-right: 5px solid transparent\r\n        border-left: 5px solid transparent\r\n        bottom: calc(100% + 2px)\r\n    else if ($direction == 'is-bottom')\r\n        border-right: 5px solid transparent\r\n        border-bottom: 5px solid #1b2735 // default for IE\r\n        border-bottom: 5px solid $color\r\n        border-left: 5px solid transparent\r\n        top: calc(100% + 2px)\r\n    else if ($direction == 'is-right')\r\n        border-top: 5px solid transparent\r\n        border-right: 5px solid #1b2735 // default for IE\r\n        border-right: 5px solid $color\r\n        border-bottom: 5px solid transparent\r\n        left: calc(100% + 2px)\r\n    else if ($direction == 'is-left')\r\n        border-top: 5px solid transparent\r\n        border-bottom: 5px solid transparent\r\n        border-left: 5px solid #1b2735 // default for IE\r\n        border-left: 5px solid $color\r\n        right: calc(100% + 2px)\r\ntooltip($direction)\r\n    &.{$direction}\r\n        &:before,\r\n        &:after\r\n            if ($direction == 'is-top')\r\n                top auto\r\n                right auto\r\n                bottom calc(100% + 5px + 2px)\r\n                left 50%\r\n                transform translateX(-50%)\r\n            else if ($direction == 'is-bottom')\r\n                top calc(100% + 5px + 2px)\r\n                right auto\r\n                bottom auto\r\n                left 50%\r\n                transform translateX(-50%)\r\n            else if ($direction == 'is-right')\r\n                top 50%\r\n                right auto\r\n                bottom auto\r\n                left calc(100% + 5px + 2px)\r\n                transform translateY(-50%)\r\n            else if ($direction == 'is-left')\r\n                top 50%\r\n                right calc(100% + 5px + 2px)\r\n                bottom auto\r\n                left auto\r\n                transform translateY(-50%)\r\n        &:before\r\n            tooltip-arrow($direction, $tooltip-background)\r\n        &.has-multiline\r\n            &.is-small:after\r\n                width 140px\r\n            &.is-medium:after\r\n                width 210px\r\n            &.is-large:after\r\n                width 280px\r\n// Base\r\n.vue-custom-tooltip\r\n    tooltip('is-top')\r\n    tooltip('is-right')\r\n    tooltip('is-bottom')\r\n    tooltip('is-left')\r\n    position relative\r\n    display inline-block\r\n    text-decoration-line none !important\r\n    &.is-underlined\r\n        border-bottom 1px dotted #1b2735 // default for IE\r\n        border-bottom 1px dotted $tooltip-background\r\n        line-height: 1.2\r\n    &:before,\r\n    &:after\r\n        position absolute\r\n        content \"\"\r\n        opacity 0\r\n        visibility hidden\r\n        pointer-events none\r\n        transition opacity $speed $easing, visibility $speed $easing\r\n    &:before\r\n        z-index 889\r\n    &:after\r\n        content attr(data-label)\r\n        color #fff // default for IE\r\n        color $tooltip-color\r\n        background #1b2735 // default for IE\r\n        background $tooltip-background\r\n        width auto\r\n        padding 0.35rem 0.75rem 0.45rem\r\n        border-radius 12px // default for IE\r\n        border-radius $tooltip-radius\r\n        font-size 0.85rem !important\r\n        font-weight 400 // default for IE\r\n        font-weight $weight-normal\r\n        line-height 1.3\r\n        letter-spacing normal !important\r\n        text-transform none\r\n        box-shadow 0px 1px 2px 1px rgba(0, 1, 0, 0.2)\r\n        z-index 888\r\n        white-space nowrap\r\n    &:not([data-label=\"\"]):hover:before,\r\n    &:not([data-label=\"\"]):hover:after\r\n        opacity 1\r\n        visibility visible\r\n    // If parent is disabled\r\n    :disabled &\r\n        pointer-events none\r\n    &:not([data-label=\"\"]).is-sticky\r\n        &:before,\r\n        &:after\r\n            opacity 1\r\n            visibility visible\r\n    &.has-multiline\r\n        &:after\r\n            display flex-block\r\n            padding 0.5rem 0.75rem 0.65rem\r\n            text-align center\r\n            line-height 1.4\r\n            white-space pre-wrap\r\n</style>"]}, media: undefined })
,inject("data-v-966d222c_1", { source: ".vue-custom-tooltip {\n  position: relative;\n  display: inline-block;\n  text-decoration-line: none !important;\n}\n.vue-custom-tooltip.is-top:before,\n.vue-custom-tooltip.is-top:after {\n  top: auto;\n  right: auto;\n  bottom: calc(100% + 5px + 2px);\n  left: 50%;\n  transform: translateX(-50%);\n}\n.vue-custom-tooltip.is-top:before {\n  border-top: 5px solid #1b2735;\n  border-top: 5px solid var(--background);\n  border-right: 5px solid transparent;\n  border-left: 5px solid transparent;\n  bottom: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-top.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-top.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-top.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-right:before,\n.vue-custom-tooltip.is-right:after {\n  top: 50%;\n  right: auto;\n  bottom: auto;\n  left: calc(100% + 5px + 2px);\n  transform: translateY(-50%);\n}\n.vue-custom-tooltip.is-right:before {\n  border-top: 5px solid transparent;\n  border-right: 5px solid #1b2735;\n  border-right: 5px solid var(--background);\n  border-bottom: 5px solid transparent;\n  left: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-right.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-right.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-right.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-bottom:before,\n.vue-custom-tooltip.is-bottom:after {\n  top: calc(100% + 5px + 2px);\n  right: auto;\n  bottom: auto;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.vue-custom-tooltip.is-bottom:before {\n  border-right: 5px solid transparent;\n  border-bottom: 5px solid #1b2735;\n  border-bottom: 5px solid var(--background);\n  border-left: 5px solid transparent;\n  top: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-bottom.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-bottom.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-bottom.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-left:before,\n.vue-custom-tooltip.is-left:after {\n  top: 50%;\n  right: calc(100% + 5px + 2px);\n  bottom: auto;\n  left: auto;\n  transform: translateY(-50%);\n}\n.vue-custom-tooltip.is-left:before {\n  border-top: 5px solid transparent;\n  border-bottom: 5px solid transparent;\n  border-left: 5px solid #1b2735;\n  border-left: 5px solid var(--background);\n  right: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-left.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-left.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-left.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-underlined {\n  border-bottom: 1px dotted #1b2735;\n  border-bottom: 1px dotted var(--background);\n  line-height: 1.2;\n}\n.vue-custom-tooltip:before,\n.vue-custom-tooltip:after {\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n  transition: opacity 86ms ease-out, visibility 86ms ease-out;\n}\n.vue-custom-tooltip:before {\n  z-index: 889;\n}\n.vue-custom-tooltip:after {\n  content: attr(data-label);\n  color: #fff;\n  color: var(--color);\n  background: #1b2735;\n  background: var(--background);\n  width: auto;\n  padding: 0.35rem 0.75rem 0.45rem;\n  border-radius: 12px;\n  border-radius: var(--border-radius);\n  font-size: 0.85rem !important;\n  font-weight: 400;\n  font-weight: var(--font-weight);\n  line-height: 1.3;\n  letter-spacing: normal !important;\n  text-transform: none;\n  box-shadow: 0px 1px 2px 1px rgba(0,1,0,0.2);\n  z-index: 888;\n  white-space: nowrap;\n}\n.vue-custom-tooltip:not([data-label=\"\"]):hover:before,\n.vue-custom-tooltip:not([data-label=\"\"]):hover:after {\n  opacity: 1;\n  visibility: visible;\n}\n:disabled .vue-custom-tooltip {\n  pointer-events: none;\n}\n.vue-custom-tooltip:not([data-label=\"\"]).is-sticky:before,\n.vue-custom-tooltip:not([data-label=\"\"]).is-sticky:after {\n  opacity: 1;\n  visibility: visible;\n}\n.vue-custom-tooltip.has-multiline:after {\n  display: flex-block;\n  padding: 0.5rem 0.75rem 0.65rem;\n  text-align: center;\n  line-height: 1.4;\n  white-space: pre-wrap;\n}\n", map: {"version":3,"sources":["D:\\adam\\Development\\vue-custom-tooltip\\src\\VueCustomTooltip.vue","VueCustomTooltip.vue"],"names":[],"mappings":"AA8LA;EAKA,kBAAA;EACA,qBAAA;EACA,qCAAA;ACjMA;ADsJA;;EAGA,SAAA;EACA,WAAA;EACA,8BAAA;EACA,SAAA;EACA,2BAAA;ACrJA;ADwKA;EAnDA,6BAAA;EACA,uCAAA;EACA,mCAAA;EACA,kCAAA;EACA,wBAAA;AClHA;ADoKA;EACA,YAAA;AClKA;ADmKA;EACA,YAAA;ACjKA;ADkKA;EACA,YAAA;AChKA;AD8HA;;EAeA,QAAA;EACA,WAAA;EACA,YAAA;EACA,4BAAA;EACA,2BAAA;ACzIA;ADgJA;EAvCA,iCAAA;EACA,+BAAA;EACA,yCAAA;EACA,oCAAA;EACA,sBAAA;ACtGA;AD4IA;EACA,YAAA;AC1IA;AD2IA;EACA,YAAA;ACzIA;AD0IA;EACA,YAAA;ACxIA;ADsGA;;EASA,2BAAA;EACA,WAAA;EACA,YAAA;EACA,SAAA;EACA,2BAAA;AC3GA;ADwHA;EA7CA,mCAAA;EACA,gCAAA;EACA,0CAAA;EACA,kCAAA;EACA,qBAAA;ACxEA;ADoHA;EACA,YAAA;AClHA;ADmHA;EACA,YAAA;ACjHA;ADkHA;EACA,YAAA;AChHA;AD8EA;;EAqBA,QAAA;EACA,6BAAA;EACA,YAAA;EACA,UAAA;EACA,2BAAA;AC/FA;ADgGA;EAjCA,iCAAA;EACA,oCAAA;EACA,8BAAA;EACA,wCAAA;EACA,uBAAA;AC5DA;AD4FA;EACA,YAAA;AC1FA;AD2FA;EACA,YAAA;ACzFA;AD0FA;EACA,YAAA;ACxFA;ADkGA;EACA,iCAAA;EACA,2CAAA;EACA,gBAAA;AChGA;ADiGA;;EAEA,kBAAA;EACA,WAAA;EACA,UAAA;EACA,kBAAA;EACA,oBAAA;EACA,2DAAA;AC/FA;ADgGA;EACA,YAAA;AC9FA;AD+FA;EACA,yBAAA;EACA,WAAA;EACA,mBAAA;EACA,mBAAA;EACA,6BAAA;EACA,WAAA;EACA,gCAAA;EACA,mBAAA;EACA,mCAAA;EACA,6BAAA;EACA,gBAAA;EACA,+BAAA;EACA,gBAAA;EACA,iCAAA;EACA,oBAAA;EACA,2CAAA;EACA,YAAA;EACA,mBAAA;AC7FA;AD8FA;;EAEA,UAAA;EACA,mBAAA;AC5FA;AD8FA;EACA,oBAAA;AC5FA;AD8FA;;EAEA,UAAA;EACA,mBAAA;AC5FA;AD8FA;EACA,mBAAA;EACA,+BAAA;EACA,kBAAA;EACA,gBAAA;EACA,qBAAA;AC5FA","file":"VueCustomTooltip.vue","sourcesContent":["<template>\r\n    <component :is=\"isAbbreviation ? 'abbr' : 'span'\" :data-label=\"labelText\" :aria-label=\"labelText\" role=\"tooltip\" :class=\"[hasPosition, hasSize, { 'vue-custom-tooltip': isActive && labelText, 'is-sticky': isSticky, 'has-multiline': isMultiline, 'is-underlined': isUnderlined || isAbbreviation }]\" :style=\"[dynamicStyles, { cursor: isAbbreviation ? 'help' : 'pointer' }]\">\r\n        <slot name=\"default\"></slot>\r\n    </component>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n    name: 'VueCustomTooltip',\r\n    props: {\r\n        label: String,\r\n        active: {\r\n            type: Boolean,\r\n            default: true\r\n        },\r\n        sticky: Boolean, // Always showing\r\n        multiline: Boolean, // Multiple lines\r\n        underlined: Boolean,\r\n        abbreviation: Boolean,\r\n        position: {\r\n            type: String,\r\n            default: 'is-top',\r\n            validator(value) {\r\n                return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1\r\n            }\r\n        },\r\n        size: {\r\n            type: String,\r\n            default: 'is-medium',\r\n            validator(value) {\r\n                return ['is-small', 'is-medium', 'is-large'].indexOf(value) > -1\r\n            }\r\n        },\r\n    },\r\n    data() {\r\n        return {\r\n            labelText: this.label || null,\r\n            isActive: this.active || true,\r\n            isSticky: this.sticky || false,\r\n            isMultiline: this.multiline || false,\r\n            isUnderlined: this.underlined || false,\r\n            isAbbreviation: this.abbreviation || false,\r\n            hasPosition: this.position || 'is-top',\r\n            hasSize: this.size || 'is-medium',\r\n        }\r\n    },\r\n    computed: {\r\n        dynamicStyles() {\r\n            return {\r\n                '--color': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('color') ? this.$vueCustomTooltip.color : null,\r\n                '--background': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('background') ? this.$vueCustomTooltip.background : null,\r\n                '--border-radius': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('borderRadius') ? this.$vueCustomTooltip.borderRadius : null,\r\n                '--font-weight': this.$vueCustomTooltip && this.$vueCustomTooltip.hasOwnProperty('fontWeight') ? this.$vueCustomTooltip.fontWeight : null,\r\n            }\r\n        }\r\n    },\r\n    watch: {\r\n        label: {\r\n            handler(value) {\r\n                this.labelText = value\r\n            },\r\n            immediate: true\r\n        },\r\n        active: {\r\n            handler(value) {\r\n                this.isActive = value\r\n            },\r\n            immediate: true\r\n        },\r\n        sticky: {\r\n            handler(value) {\r\n                this.isSticky = value\r\n            },\r\n            immediate: true\r\n        },\r\n        multiline: {\r\n            handler(value) {\r\n                this.isMultiline = value\r\n            },\r\n            immediate: true\r\n        },\r\n        underlined: {\r\n            handler(value) {\r\n                this.isUnderlined = value\r\n            },\r\n            immediate: true\r\n        },\r\n        abbreviation: {\r\n            handler(value) {\r\n                this.isAbbreviation = value\r\n            },\r\n            immediate: true\r\n        },\r\n        position: {\r\n            handler(value) {\r\n                this.hasPosition = value\r\n            },\r\n            immediate: true\r\n        },\r\n        size: {\r\n            handler(value) {\r\n                this.hasSize = value\r\n            },\r\n            immediate: true\r\n        },\r\n    },\r\n}\r\n</script>\r\n\r\n<style>\r\n/* Set defaults */\r\n.vue-custom-tooltip {\r\n    --color: #fff;\r\n    --background: #1b2735;\r\n    --border-radius: 12px;\r\n    --font-weight: 400;\r\n}\r\n</style>\r\n\r\n<style lang=\"stylus\">\r\n$tooltip-color = var(--color) // default color\r\n$tooltip-background = var(--background) // default background color\r\n$tooltip-radius = var(--border-radius) // default border radius\r\n$weight-normal = var(--font-weight) // default font weight\r\n$speed = 86ms\r\n$easing = ease-out\r\n\r\ntooltip-arrow($direction, $color)\r\n    if ($direction == 'is-top')\r\n        border-top: 5px solid #1b2735 // default for IE\r\n        border-top: 5px solid $color\r\n        border-right: 5px solid transparent\r\n        border-left: 5px solid transparent\r\n        bottom: calc(100% + 2px)\r\n    else if ($direction == 'is-bottom')\r\n        border-right: 5px solid transparent\r\n        border-bottom: 5px solid #1b2735 // default for IE\r\n        border-bottom: 5px solid $color\r\n        border-left: 5px solid transparent\r\n        top: calc(100% + 2px)\r\n    else if ($direction == 'is-right')\r\n        border-top: 5px solid transparent\r\n        border-right: 5px solid #1b2735 // default for IE\r\n        border-right: 5px solid $color\r\n        border-bottom: 5px solid transparent\r\n        left: calc(100% + 2px)\r\n    else if ($direction == 'is-left')\r\n        border-top: 5px solid transparent\r\n        border-bottom: 5px solid transparent\r\n        border-left: 5px solid #1b2735 // default for IE\r\n        border-left: 5px solid $color\r\n        right: calc(100% + 2px)\r\ntooltip($direction)\r\n    &.{$direction}\r\n        &:before,\r\n        &:after\r\n            if ($direction == 'is-top')\r\n                top auto\r\n                right auto\r\n                bottom calc(100% + 5px + 2px)\r\n                left 50%\r\n                transform translateX(-50%)\r\n            else if ($direction == 'is-bottom')\r\n                top calc(100% + 5px + 2px)\r\n                right auto\r\n                bottom auto\r\n                left 50%\r\n                transform translateX(-50%)\r\n            else if ($direction == 'is-right')\r\n                top 50%\r\n                right auto\r\n                bottom auto\r\n                left calc(100% + 5px + 2px)\r\n                transform translateY(-50%)\r\n            else if ($direction == 'is-left')\r\n                top 50%\r\n                right calc(100% + 5px + 2px)\r\n                bottom auto\r\n                left auto\r\n                transform translateY(-50%)\r\n        &:before\r\n            tooltip-arrow($direction, $tooltip-background)\r\n        &.has-multiline\r\n            &.is-small:after\r\n                width 140px\r\n            &.is-medium:after\r\n                width 210px\r\n            &.is-large:after\r\n                width 280px\r\n// Base\r\n.vue-custom-tooltip\r\n    tooltip('is-top')\r\n    tooltip('is-right')\r\n    tooltip('is-bottom')\r\n    tooltip('is-left')\r\n    position relative\r\n    display inline-block\r\n    text-decoration-line none !important\r\n    &.is-underlined\r\n        border-bottom 1px dotted #1b2735 // default for IE\r\n        border-bottom 1px dotted $tooltip-background\r\n        line-height: 1.2\r\n    &:before,\r\n    &:after\r\n        position absolute\r\n        content \"\"\r\n        opacity 0\r\n        visibility hidden\r\n        pointer-events none\r\n        transition opacity $speed $easing, visibility $speed $easing\r\n    &:before\r\n        z-index 889\r\n    &:after\r\n        content attr(data-label)\r\n        color #fff // default for IE\r\n        color $tooltip-color\r\n        background #1b2735 // default for IE\r\n        background $tooltip-background\r\n        width auto\r\n        padding 0.35rem 0.75rem 0.45rem\r\n        border-radius 12px // default for IE\r\n        border-radius $tooltip-radius\r\n        font-size 0.85rem !important\r\n        font-weight 400 // default for IE\r\n        font-weight $weight-normal\r\n        line-height 1.3\r\n        letter-spacing normal !important\r\n        text-transform none\r\n        box-shadow 0px 1px 2px 1px rgba(0, 1, 0, 0.2)\r\n        z-index 888\r\n        white-space nowrap\r\n    &:not([data-label=\"\"]):hover:before,\r\n    &:not([data-label=\"\"]):hover:after\r\n        opacity 1\r\n        visibility visible\r\n    // If parent is disabled\r\n    :disabled &\r\n        pointer-events none\r\n    &:not([data-label=\"\"]).is-sticky\r\n        &:before,\r\n        &:after\r\n            opacity 1\r\n            visibility visible\r\n    &.has-multiline\r\n        &:after\r\n            display flex-block\r\n            padding 0.5rem 0.75rem 0.65rem\r\n            text-align center\r\n            line-height 1.4\r\n            white-space pre-wrap\r\n</style>",".vue-custom-tooltip {\n  position: relative;\n  display: inline-block;\n  text-decoration-line: none !important;\n}\n.vue-custom-tooltip.is-top:before,\n.vue-custom-tooltip.is-top:after {\n  top: auto;\n  right: auto;\n  bottom: calc(100% + 5px + 2px);\n  left: 50%;\n  transform: translateX(-50%);\n}\n.vue-custom-tooltip.is-top:before {\n  border-top: 5px solid #1b2735;\n  border-top: 5px solid var(--background);\n  border-right: 5px solid transparent;\n  border-left: 5px solid transparent;\n  bottom: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-top.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-top.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-top.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-right:before,\n.vue-custom-tooltip.is-right:after {\n  top: 50%;\n  right: auto;\n  bottom: auto;\n  left: calc(100% + 5px + 2px);\n  transform: translateY(-50%);\n}\n.vue-custom-tooltip.is-right:before {\n  border-top: 5px solid transparent;\n  border-right: 5px solid #1b2735;\n  border-right: 5px solid var(--background);\n  border-bottom: 5px solid transparent;\n  left: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-right.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-right.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-right.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-bottom:before,\n.vue-custom-tooltip.is-bottom:after {\n  top: calc(100% + 5px + 2px);\n  right: auto;\n  bottom: auto;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.vue-custom-tooltip.is-bottom:before {\n  border-right: 5px solid transparent;\n  border-bottom: 5px solid #1b2735;\n  border-bottom: 5px solid var(--background);\n  border-left: 5px solid transparent;\n  top: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-bottom.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-bottom.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-bottom.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-left:before,\n.vue-custom-tooltip.is-left:after {\n  top: 50%;\n  right: calc(100% + 5px + 2px);\n  bottom: auto;\n  left: auto;\n  transform: translateY(-50%);\n}\n.vue-custom-tooltip.is-left:before {\n  border-top: 5px solid transparent;\n  border-bottom: 5px solid transparent;\n  border-left: 5px solid #1b2735;\n  border-left: 5px solid var(--background);\n  right: calc(100% + 2px);\n}\n.vue-custom-tooltip.is-left.has-multiline.is-small:after {\n  width: 140px;\n}\n.vue-custom-tooltip.is-left.has-multiline.is-medium:after {\n  width: 210px;\n}\n.vue-custom-tooltip.is-left.has-multiline.is-large:after {\n  width: 280px;\n}\n.vue-custom-tooltip.is-underlined {\n  border-bottom: 1px dotted #1b2735;\n  border-bottom: 1px dotted var(--background);\n  line-height: 1.2;\n}\n.vue-custom-tooltip:before,\n.vue-custom-tooltip:after {\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n  transition: opacity 86ms ease-out, visibility 86ms ease-out;\n}\n.vue-custom-tooltip:before {\n  z-index: 889;\n}\n.vue-custom-tooltip:after {\n  content: attr(data-label);\n  color: #fff;\n  color: var(--color);\n  background: #1b2735;\n  background: var(--background);\n  width: auto;\n  padding: 0.35rem 0.75rem 0.45rem;\n  border-radius: 12px;\n  border-radius: var(--border-radius);\n  font-size: 0.85rem !important;\n  font-weight: 400;\n  font-weight: var(--font-weight);\n  line-height: 1.3;\n  letter-spacing: normal !important;\n  text-transform: none;\n  box-shadow: 0px 1px 2px 1px rgba(0,1,0,0.2);\n  z-index: 888;\n  white-space: nowrap;\n}\n.vue-custom-tooltip:not([data-label=\"\"]):hover:before,\n.vue-custom-tooltip:not([data-label=\"\"]):hover:after {\n  opacity: 1;\n  visibility: visible;\n}\n:disabled .vue-custom-tooltip {\n  pointer-events: none;\n}\n.vue-custom-tooltip:not([data-label=\"\"]).is-sticky:before,\n.vue-custom-tooltip:not([data-label=\"\"]).is-sticky:after {\n  opacity: 1;\n  visibility: visible;\n}\n.vue-custom-tooltip.has-multiline:after {\n  display: flex-block;\n  padding: 0.5rem 0.75rem 0.65rem;\n  text-align: center;\n  line-height: 1.4;\n  white-space: pre-wrap;\n}\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

// Import vue component

var defaultOptions = {
    name: 'VueCustomTooltip',
    color: '#fff',
    background: '#1b2735',
    borderRadius: 12,
    fontWeight: 400,
};

// Declare install function executed by Vue.use()
function install(Vue) {
    if (install.installed) { return }
    install.installed = true;

    Vue.prototype.$vueCustomTooltip = defaultOptions;

    Vue.component('VueCustomTooltip', __vue_component__);
}

// Create module definition for Vue.use()
var plugin = {
    install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

export default __vue_component__;
export { install };
