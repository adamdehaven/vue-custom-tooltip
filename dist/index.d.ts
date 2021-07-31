import { Plugin } from 'vue';
import VueCustomTooltip from './VueCustomTooltip.vue';
import { TooltipOptions } from './types';
declare type InstallableComponent = typeof VueCustomTooltip & {
    install: Exclude<Plugin['install'], undefined>;
};
declare const _default: InstallableComponent;
export default _default;
export { VueCustomTooltip, TooltipOptions };
