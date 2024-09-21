// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Importa ReactDOM da 'react-dom/client'
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";

// Crea un root utilizzando createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));

// Usa il metodo render su root
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
