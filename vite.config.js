import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // '/api': 'http://localhost:3000/api'
      '/api': 'https://kcn-backend.vercel.app'
    }
  }
})

