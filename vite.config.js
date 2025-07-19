import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SwiftProsys/',
  build: {
    chunkSizeWarningLimit: 1500, // optional
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('react')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
