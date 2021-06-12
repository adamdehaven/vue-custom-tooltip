'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      default: true,
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
      },
    },
    size: {
      type: String,
      default: 'is-medium',
      validator: function validator(value) {
        return ['is-small', 'is-medium', 'is-large'].indexOf(value) > -1
      },
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
      handler: function handler(value) {
        this.labelText = value;
      },
      immediate: true,
    },
    active: {
      handler: function handler(value) {
        this.isActive = value;
      },
      immediate: true,
    },
    sticky: {
      handler: function handler(value) {
        this.isSticky = value;
      },
      immediate: true,
    },
    multiline: {
      handler: function handler(value) {
        this.isMultiline = value;
      },
      immediate: true,
    },
    underlined: {
      handler: function handler(value) {
        this.isUnderlined = value;
      },
      immediate: true,
    },
    abbreviation: {
      handler: function handler(value) {
        this.isAbbreviation = value;
      },
      immediate: true,
    },
    position: {
      handler: function handler(value) {
        this.hasPosition = value;
      },
      immediate: true,
    },
    size: {
      handler: function handler(value) {
        this.hasSize = value;
      },
      immediate: true,
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

function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        { return function () { }; }
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: function () { return context._renderStyles(context._styles); }
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return function (id, style) { return addStyle(id, style, context); };
}
function addStyle(id, css, context) {
    var group = process.env.NODE_ENV === 'production' ? css.media || 'default' : id;
    var style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        var code = css.source;
        if (process.env.NODE_ENV !== 'production' && css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    Buffer.from(unescape(encodeURIComponent(JSON.stringify(css.map)))).toString('base64') +
                    ' */';
        }
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    var css = '';
    for (var key in styles) {
        var style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.isAbbreviation ? 'abbr' : 'span',{tag:"component",class:[
    _vm.hasPosition,
    _vm.hasSize,
    {
      'vue-custom-tooltip': _vm.isActive && _vm.labelText,
      'is-sticky': _vm.isSticky,
      'has-multiline': _vm.isMultiline,
      'is-underlined': _vm.isUnderlined || _vm.isAbbreviation,
    } ],style:([_vm.dynamicStyles, { cursor: _vm.isAbbreviation ? 'help' : 'pointer' }]),attrs:{"data-label":_vm.labelText,"aria-label":_vm.labelText,"role":"tooltip"}},[_vm._t("default")],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-60bf38c6_0", { source: ".vue-custom-tooltip{--vue-custom-tooltip-color:#fff;--vue-custom-tooltip-background:#000;--vue-custom-tooltip-border-radius:100px;--vue-custom-tooltip-font-weight:400}", map: undefined, media: undefined })
,inject("data-v-60bf38c6_1", { source: ".vue-custom-tooltip{position:relative;display:inline-block;text-decoration-line:none!important}.vue-custom-tooltip.is-top:after,.vue-custom-tooltip.is-top:before{top:auto;right:auto;bottom:calc(100% + 5px + 2px);left:50%;transform:translateX(-50%)}.vue-custom-tooltip.is-top:before{border-top:5px solid #000;border-top:5px solid var(--vue-custom-tooltip-background);border-right:5px solid transparent;border-left:5px solid transparent;bottom:calc(100% + 2px)}.vue-custom-tooltip.is-top.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-top.has-multiline.is-medium:after{width:250px;padding:.6rem 1.25rem .65rem}.vue-custom-tooltip.is-top.has-multiline.is-large:after{width:480px;padding:0.6rem 1rem 0.65rem}.vue-custom-tooltip.is-right:after,.vue-custom-tooltip.is-right:before{top:50%;right:auto;bottom:auto;left:calc(100% + 5px + 2px);transform:translateY(-50%)}.vue-custom-tooltip.is-right:before{border-top:5px solid transparent;border-right:5px solid #000;border-right:5px solid var(--vue-custom-tooltip-background);border-bottom:5px solid transparent;left:calc(100% + 2px)}.vue-custom-tooltip.is-right.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-right.has-multiline.is-medium:after{width:250px;padding:.6rem 1.25rem .65rem}.vue-custom-tooltip.is-right.has-multiline.is-large:after{width:480px;padding:0.6rem 1rem 0.65rem}.vue-custom-tooltip.is-bottom:after,.vue-custom-tooltip.is-bottom:before{top:calc(100% + 5px + 2px);right:auto;bottom:auto;left:50%;transform:translateX(-50%)}.vue-custom-tooltip.is-bottom:before{border-right:5px solid transparent;border-bottom:5px solid #000;border-bottom:5px solid var(--vue-custom-tooltip-background);border-left:5px solid transparent;top:calc(100% + 2px)}.vue-custom-tooltip.is-bottom.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-bottom.has-multiline.is-medium:after{width:250px;padding:.6rem 1.25rem .65rem}.vue-custom-tooltip.is-bottom.has-multiline.is-large:after{width:480px;padding:0.6rem 1rem 0.65rem}.vue-custom-tooltip.is-left:after,.vue-custom-tooltip.is-left:before{top:50%;right:calc(100% + 5px + 2px);bottom:auto;left:auto;transform:translateY(-50%)}.vue-custom-tooltip.is-left:before{border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #000;border-left:5px solid var(--vue-custom-tooltip-background);right:calc(100% + 2px)}.vue-custom-tooltip.is-left.has-multiline.is-small:after{width:140px}.vue-custom-tooltip.is-left.has-multiline.is-medium:after{width:250px;padding:.6rem 1.25rem .65rem}.vue-custom-tooltip.is-left.has-multiline.is-large:after{width:480px;padding:0.6rem 1rem 0.65rem}.vue-custom-tooltip.is-underlined{border-bottom:1px dotted #000;border-bottom:1px dotted var(--vue-custom-tooltip-background);line-height:1.2}.vue-custom-tooltip:after,.vue-custom-tooltip:before{position:absolute;content:'';opacity:0;visibility:hidden;pointer-events:none;transition:opacity 86ms ease-out,visibility 86ms ease-out}.vue-custom-tooltip:before{z-index:889}.vue-custom-tooltip:after{content:attr(data-label);color:#fff;color:var(--vue-custom-tooltip-color);background:#000;background:var(--vue-custom-tooltip-background);width:auto;max-width:100vw;padding:.35rem .75rem .45rem;border-radius:100px;border-radius:var(--vue-custom-tooltip-border-radius);font-size:.85rem!important;font-weight:400;font-weight:var(--vue-custom-tooltip-font-weight);line-height:1.3;letter-spacing:normal!important;text-transform:none;box-shadow:0 1px 2px 1px rgba(0,1,0,.2);z-index:888;white-space:nowrap}.vue-custom-tooltip:not([data-label='']):hover:after,.vue-custom-tooltip:not([data-label='']):hover:before{opacity:1;visibility:visible}:disabled .vue-custom-tooltip{pointer-events:none}.vue-custom-tooltip:not([data-label='']).is-sticky:after,.vue-custom-tooltip:not([data-label='']).is-sticky:before{opacity:1;visibility:visible}.vue-custom-tooltip.has-multiline:after{display:block;padding:.5rem .75rem .65rem;text-align:center;line-height:1.4;white-space:pre-wrap}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = "data-v-60bf38c6";
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject shadow dom */



  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    createInjectorSSR,
    undefined
  );

// Import vue component

var defaultOptions = {
  name: 'VueCustomTooltip',
  color: '#fff',
  background: '#000',
  borderRadius: 12,
  fontWeight: 400,
};

// Declare install function executed by Vue.use()
var install = function installMyComponent(Vue, opt) {
  // Don't install if already installed, or SSR
  if (install.installed || Vue.prototype.$isServer) { return }
  install.installed = true;

  // Grab user options
  var userOptions = Object.assign({}, opt);

  // HEX regex: Hash, plus 3 or 6 valid characters
  var hexRegex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  // Test color for valid HEX
  if (userOptions.hasOwnProperty('color') && !hexRegex.test(userOptions.color)) {
    delete userOptions.color;
  }
  // Test background for valid HEX
  if (userOptions.hasOwnProperty('background') && !hexRegex.test(userOptions.background)) {
    delete userOptions.background;
  }

  // borderRadius regex: number between 1-9, then any other numbers
  var borderRadiusRegex = /^[0-9]+$/;
  // Test borderRadius for integer
  if (userOptions.hasOwnProperty('borderRadius') && !borderRadiusRegex.test(userOptions.borderRadius)) {
    delete userOptions.borderRadius;
  }

  // fontWeight regex: number between 1-9 followed by two zeros
  var fontWeightRegex = /^[1-9]{1}00$/;
  // Test fontWeight for integer
  if (userOptions.hasOwnProperty('fontWeight') && !fontWeightRegex.test(userOptions.fontWeight)) {
    delete userOptions.fontWeight;
  }

  // Merge options
  var options = Object.assign({}, defaultOptions, userOptions);

  // Mutate borderRadius
  options.borderRadius = options.borderRadius + 'px';

  // Add global property (mainly for passing styles)
  Vue.prototype.$vueCustomTooltip = options;

  // Register component, using options.name.
  // e.g. <VueCustomTooltip>
  Vue.component(options.name, __vue_component__);
};

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
  GlobalVue.use(plugin, defaultOptions);
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
__vue_component__.install = install;

exports.default = __vue_component__;
