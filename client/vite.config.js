import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // Allow external connections
    port: process.env.PORT || 5173,  // Use PORT from Render
  },
})

