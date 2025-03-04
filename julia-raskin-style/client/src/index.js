import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ✅ Ensure root element exists before rendering
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Root element not found! Make sure your HTML file has a <div id='root'></div>");
} else {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // ✅ Log potential performance issues
  reportWebVitals(console.log);
}
