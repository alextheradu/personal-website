import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose to all network interfaces
    port: 5173,      // Explicit port (Vite default)
    proxy: {
      '/api': 'http://localhost:6001'
    },
    allowedHosts: ['alexradu.co', 'www.alexradu.co', 'atlas.local', '192.168.68.66']
  }
})
