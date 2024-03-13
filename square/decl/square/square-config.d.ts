/**
 * Configuration data for a square
 */
export type SquareConfigProps = {
    size: number;
    color: string;
};
/**
 * Configuration data for a square with save callback
 */
export type SquareConfigWithCallbacks = SquareConfigProps & {
    save: (config: SquareConfigProps) => void;
};
/**
 * Custom element for configuring a square
 */
export declare class SquareConfig extends HTMLElement {
    private _config;
    static template: HTMLTemplateElement | undefined;
    private sizeInput;
    private colorInput;
    static register(): void;
    constructor();
    set config(newVal: SquareConfigWithCallbacks);
}
