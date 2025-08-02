// vite.config.js - yangilangan
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
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
    host: "0.0.0.0", // Barcha IP manzillarga ruxsat
    port: 5173,
    https: false, // Development da HTTP
    cors: true,
  },

  preview: {
    host: "0.0.0.0",
    port: 4173,
    https: false,
  },

  envPrefix: "VITE_",

  define: {
    // Build vaqtida environment o'zgaruvchilar
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    __PROD__: JSON.stringify(process.env.NODE_ENV === "production"),
  },
});

// package.json scripts qo'shimchasi
// "scripts": {
//   "dev": "vite --host 0.0.0.0",
//   "dev:network": "vite --host 0.0.0.0 --port 5173",
//   "build": "vite build",
//   "build:production": "NODE_ENV=production vite build",
//   "preview": "vite preview --host 0.0.0.0",
//   "lint": "eslint .",
//   "telegram:dev": "ngrok http 5173" // Development da Telegram test uchun
// }
