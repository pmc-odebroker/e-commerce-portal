import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Your backend URL
        changeOrigin: true, // Handles cross-origin requests
        secure: false, // Disable SSL verification for development
      },
    },
  },
})
