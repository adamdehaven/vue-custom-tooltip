declare const _default: import("vue").DefineComponent<{
    label: StringConstructor;
    active: {
        type: BooleanConstructor;
        default: boolean;
    };
    sticky: BooleanConstructor;
    multiline: BooleanConstructor;
    underlined: BooleanConstructor;
    abbreviation: BooleanConstructor;
    position: {
        type: StringConstructor;
        default: string;
        validator(this: void, value: string): boolean;
    };
    size: {
        type: StringConstructor;
        default: string;
        validator(this: void, value: string): boolean;
    };
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    active: boolean;
    sticky: boolean;
    multiline: boolean;
    underlined: boolean;
    abbreviation: boolean;
    position: string;
    size: string;
} & {
    label?: string | undefined;
}>, {
    active: boolean;
    sticky: boolean;
    multiline: boolean;
    underlined: boolean;
    abbreviation: boolean;
    position: string;
    size: string;
}>;
export default _default;
