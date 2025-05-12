import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { MaterialUIControllerProvider } from "./context";
import { KeycloakProvider } from "./keycloak-provider";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <KeycloakProvider>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </KeycloakProvider>
);
