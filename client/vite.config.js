import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',                       // <-- required
    port: parseInt(process.env.PORT) || 5173,  // <-- required for Render
  },
  build: {
    outDir: 'dist',
  },
})


