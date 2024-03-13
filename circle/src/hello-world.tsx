import React from "react"
import ReactDOM from "react-dom/client"

import r2wc from "react-to-webcomponent"

export const Greeting = () => {
  return <h1>Hello, World!</h1>
}

export const WebGreeting = r2wc(Greeting, React, ReactDOM);
customElements.define("web-greeting", WebGreeting);
