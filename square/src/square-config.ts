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
export class SquareConfig extends HTMLElement {
    private _config: SquareConfigWithCallbacks | undefined;

    public static template: HTMLTemplateElement | undefined;

    private sizeInput: HTMLInputElement;
    private colorInput: HTMLInputElement;

    static register() {
        if (customElements.get('square-config')) {
            // Custom element already registered
            return;
        }
    
        customElements.define('square-config', SquareConfig);
        SquareConfig.template = document.createElement('template');
        SquareConfig.template.innerHTML = `
            <style>
                form {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    padding: 10px;
                    background-color: lightgray;
                    grid-gap: 10px;
                }
            </style>
            <form>
                <label for="size">Size:</label>
                <input type="number" id="size" name="size" required />
                <label for="color">Color:</label>
                <input type="color" id="color" name="color" required />
                <div></div>
                <button type="button">Save</button>
            </form>
        `;
    }

    constructor() {
        super();

        if (!SquareConfig.template) {
            throw new Error('SquareConfig.template is not defined');
        }

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(SquareConfig.template!.content.cloneNode(true));

        const sizeInput = shadowRoot.querySelector('#size');
        const colorInput = shadowRoot.querySelector('#color');
        const saveButton = shadowRoot.querySelector('button');

        if (!sizeInput || !colorInput || !saveButton) {
            throw new Error('Could not find inputs');
        }

        this.sizeInput = sizeInput as HTMLInputElement;
        this.colorInput = colorInput as HTMLInputElement;

        saveButton.addEventListener('click', () => {
            if (!this._config) { return; }

            const size = parseInt(this.sizeInput.value, 10);
            const color = this.colorInput.value;
            this._config.save({ size, color });
        });
    }

    set config(newVal: SquareConfigWithCallbacks) {
        this._config = newVal;
        this.sizeInput.value = newVal.size.toString();
        this.colorInput.value = newVal.color;
    }
}
