import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/GuinchoLink-Front/',
  build: {
    outDir: 'dist'
  }
})
