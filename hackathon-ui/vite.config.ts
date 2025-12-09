import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      'optional-luke-seattle-ellis.trycloudflare.com'
    ],
    proxy: {
      '/api': {
        target: 'https://optional-luke-seattle-ellis.trycloudflare.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});