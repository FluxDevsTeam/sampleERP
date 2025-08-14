import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      devOptions: {
        enabled: true, // Enables PWA features during development
      },
      manifest: {
        name: 'Kids Design Company ERP', // Full name of your app
        short_name: 'FactoryERP', // Short name for the app
        description: 'An ERP for Kids Design Company factory',
        theme_color: '#000000', // Theme color for the app (changed to black for contrast)
        background_color: '#ffffff', // Background color for the splash screen (kept white)
        display: 'fullscreen', 
        scope: '/', // Scope of the PWA
        start_url: '/', // URL to open when the app is launched
        icons: [
          {
            src: '/favicon_io/logo_design.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon_io/logo_design.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/favicon_io/logo_design.png',
            sizes: '1080x1080',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Cache these file types
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // Set to 3 MB (3 * 1024 * 1024 bytes)
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});