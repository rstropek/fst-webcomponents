import r2wc from "@r2wc/react-to-web-component";
import { useState } from "react";

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

export const CircleConfigWC = r2wc(CircleConfig, {
  shadow: 'open',
  props: {
    config: 'json',
    save: 'function'
  }
});
customElements.define("circle-config", CircleConfigWC);
