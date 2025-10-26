import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src", // Source directory for the service worker
      filename: "sw.js", // Service worker file name
      devOptions: {
        enabled: true, // Enable PWA debugging in development mode
        type: "module",
      },
      injectManifest: {
        rollupFormat: "iife",
        globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg,woff2}"], // File types to cache
      },
    }),
    react(),
  ],
});
