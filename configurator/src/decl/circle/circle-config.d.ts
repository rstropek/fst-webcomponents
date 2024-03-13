export type CircleConfigProps = {
    radius: number;
    color: string;
};
export declare const CircleConfig: ({ config, save }: {
    config: CircleConfigProps;
    save: (p: CircleConfigProps) => void;
}) => import("react/jsx-runtime").JSX.Element;
export type CircleConfigWithCallbacks = CircleConfigProps & {
    save: (config: CircleConfigProps) => void;
};
export declare class CircleConfigWC extends HTMLElement {
    private _config;
    mountPoint: HTMLDivElement;
    root: any;
    constructor();
    static register(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    set config(newVal: CircleConfigWithCallbacks);
}
