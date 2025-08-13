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
        display: 'standalone', 
        scope: '/', // Scope of the PWA
        start_url: '/', // URL to open when the app is launched
        icons: [
          {
            src: '/src/assets/images/favicon_io/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/src/assets/images/favicon_io/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/src/assets/images/favicon_io/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/src/assets/images/favicon_io/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/src/assets/images/favicon_io/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/src/assets/images/favicon_io/favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
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