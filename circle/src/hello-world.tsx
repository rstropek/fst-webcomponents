import r2wc from "@r2wc/react-to-web-component";

// This is just to demonstrate react-to-web-component

export const Greeting = () => {
  return (
    <div>
      <style>{`
        h1 {
          font-family: 'Times New Roman', Times, serif;
        }
        `}
      </style>
      <h1>Hello, World!</h1>
    </div>
  );
};

export const WebGreeting = r2wc(Greeting, { shadow: 'open'});
customElements.define("web-greeting", WebGreeting);
