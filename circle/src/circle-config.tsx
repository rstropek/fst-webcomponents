import r2wc from "@r2wc/react-to-web-component";
import { useState } from "react";
import { createRoot } from 'react-dom/client';

export type CircleConfigProps = {
  radius: number;
  color: string;
};

export const CircleConfig = ({config, save}: {config: CircleConfigProps, save: (p: CircleConfigProps) => void}) => {
  const [radius, setRadius] = useState<number>(config.radius);
  const [color, setColor] = useState<string>(config.color);

  return (
    <div>
      <style>{`
        h1 {
          font-family: 'Times New Roman', Times, serif;
        }
        `}
      </style>
      <form>
        <label htmlFor="size">Size:</label>
        <input type="number" id="size" name="size" required value={radius} onChange={e => setRadius(parseInt(e.target.value))} />
        <label htmlFor="color">Color:</label>
        <input type="color" id="color" name="color" required value={color} onChange={e => setColor(e.target.value)} />
        <button type="button" onClick={() => save({radius, color})}>Save</button>
      </form>
    </div>
  );
};

export type CircleConfigWithCallbacks = CircleConfigProps & {
  save: (config: CircleConfigProps) => void;
};

export class CircleConfigWC2 extends HTMLElement {
  private _config: CircleConfigWithCallbacks | undefined;
  mountPoint: HTMLDivElement;
  root: any;

  constructor() {
    super();
    this.mountPoint = document.createElement('div');
    this.root = createRoot(this.mountPoint);
    this.attachShadow({mode: 'open'}).appendChild(this.mountPoint);
  }

  connectedCallback() {
    //this.root.render(<CircleConfig config={this._config as CircleConfigProps} save={c => this._config?.save(c)}/>);
  }

  disconnectedCallback() {
    this.root.unmount();
  }

  set config(newVal: CircleConfigWithCallbacks) {
    this._config = newVal;
    this.root.render(<CircleConfig config={this._config as CircleConfigProps} save={c => this._config?.save(c)}/>);
  }
}

customElements.define("circle-config2", CircleConfigWC2);

export const CircleConfigWC = r2wc(CircleConfig, {
  shadow: 'open',
  props: {
    config: 'json',
    save: 'function'
  }
});
customElements.define("circle-config", CircleConfigWC);
