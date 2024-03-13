export type SquareConfigProps = {
    size: number;
    color: string;
};
export type SquareConfigWithCallbacks = SquareConfigProps & {
    save: (config: SquareConfigProps) => void;
};
export declare class SquareConfig extends HTMLElement {
    private _config;
    static template: HTMLTemplateElement | undefined;
    private sizeInput;
    private colorInput;
    static register(): void;
    constructor();
    set config(newVal: SquareConfigWithCallbacks);
}
