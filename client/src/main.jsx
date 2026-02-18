import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";

const apiBaseUrl = (
  import.meta.env.PROD ? "" : import.meta.env.VITE_API_BASE_URL || ""
)
  .trim()
  .replace(/\/+$/, "");

if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

axios.defaults.withCredentials = true;

const originalFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
  const isApiCall = typeof input === "string" && input.startsWith("/api");
  const requestUrl = isApiCall && apiBaseUrl ? `${apiBaseUrl}${input}` : input;

  return originalFetch(requestUrl, {
    ...init,
    credentials: isApiCall ? init.credentials || "include" : init.credentials,
  });
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
