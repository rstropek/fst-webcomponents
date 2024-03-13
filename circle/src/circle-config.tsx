import { useState } from "react";
import { createRoot } from "react-dom/client";

export type CircleConfigProps = {
  radius: number;
  color: string;
};

export const CircleConfig = ({ config, save }: { config: CircleConfigProps; save: (p: CircleConfigProps) => void }) => {
  const [radius, setRadius] = useState<number>(config.radius);
  const [color, setColor] = useState<string>(config.color);
  const [error, setError] = useState("");

  return (
    <div>
      <style>
        {`
        label {
          font-family: 'Times New Roman', Times, serif;
        }

        form {
          display: grid;
          grid-template-columns: auto 1fr;
          padding: 10px;
          background-color: lightgray;
          grid-gap: 10px;
        }

        .error {
          font-size: small;
          color: red;
        }
        `}
      </style>
      <form>
        <label htmlFor="size">Size:</label>
        <div>
          <input type="number" id="size" name="size" required value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} />
          {error && <p className="error">{error}</p>}
        </div>
        <label htmlFor="color">Color:</label>
        <input type="color" id="color" name="color" required value={color} onChange={(e) => setColor(e.target.value)} />
        <div></div>
        <button
          type="button"
          onClick={() => {
            if (radius > 200) {
              setError("Radius must be less than 200");
              return;
            }
            save({ radius, color });
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export type CircleConfigWithCallbacks = CircleConfigProps & {
  save: (config: CircleConfigProps) => void;
};

export class CircleConfigWC extends HTMLElement {
  private _config: CircleConfigWithCallbacks | undefined;
  mountPoint: HTMLDivElement;
  root: any;

  constructor() {
    super();
    this.mountPoint = document.createElement("div");
    this.root = createRoot(this.mountPoint);
    this.attachShadow({ mode: "open" }).appendChild(this.mountPoint);
  }

  static register() {
    if (customElements.get("circle-config")) {
      // Custom element already registered
      return;
    }

    customElements.define("circle-config", CircleConfigWC);
  }

  connectedCallback() {}

  disconnectedCallback() {
    this.root.unmount();
  }

  set config(newVal: CircleConfigWithCallbacks) {
    this._config = newVal;
    this.root.render(<CircleConfig config={this._config as CircleConfigProps} save={(c) => this._config?.save(c)} />);
  }
}
