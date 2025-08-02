// vite.config.js - Telegram WebApp uchun optimallashtirilgan
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Telegram WebApp da kichikroq chunk'lar yaxshiroq ishlaydi
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "react-hot-toast"],
          api: ["@tanstack/react-query"],
        },
      },
    },
  },

  server: {
    host: true,
    port: 5173,
    // HTTPS Telegram WebApp uchun kerak (development da)
    https: false, // Local development uchun HTTP
    cors: true,
  },

  preview: {
    host: true,
    port: 4173,
    // Production preview uchun
    https: false,
  },

  // Environment variables
  envPrefix: "VITE_",
});
