import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { HashRouter} from "react-router-dom";
import App from "./App";

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

// this has to be browserrouter for with-router param passing to work
root.render(
  <HashRouter>
    <App/>
  </HashRouter>
);