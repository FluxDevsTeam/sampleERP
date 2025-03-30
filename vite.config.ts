import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Use polling if file changes are not detected
    },
    hmr: {
      overlay: false, // Disable the overlay for HMR updates
    }
  },
});
