import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { Toaster } from "./components/ui/toaster";
import { Provider } from "react-redux";
import store from "./store/store";
import config from "./config";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if(config?.nodeEnv === "production") {
  disableReactDevTools()
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </Provider>
);
