// src/main.jsx - Yangilangan versiya
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";

// Service Worker ni register qilish
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("❌ SW registration failed: ", registrationError);
      });
  });
}

// Offline/Online statusni kuzatish
window.addEventListener("online", () => {
  console.log("🌐 App is online");
  document.body.classList.remove("offline");
});

window.addEventListener("offline", () => {
  console.log("📴 App is offline");
  document.body.classList.add("offline");
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
