import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MainGlobalContext } from "./context/MainGlobalContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <MainGlobalContext>
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </MainGlobalContext>
);
