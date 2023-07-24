import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// styles
import "./styles/index.css";
import "./styles/responsive.css";
import "./styles/layout.css";
import "./styles/addproduct.css";
import "./styles/modal.css";
import "./styles/productmanagement.css";
import { BrowserRouter } from "react-router-dom";
import ScrollTop from "./components/ScrollTop";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ScrollTop />
    <App />
  </BrowserRouter>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
