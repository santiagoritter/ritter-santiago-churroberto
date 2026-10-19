import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bagel-fat-one/400.css";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/ui.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/pages.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
