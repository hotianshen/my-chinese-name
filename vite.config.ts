import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is '/' for local dev and custom-domain deploys, and '/<repo>/' for
// GitHub Pages project sites (set VITE_BASE in the deploy workflow).
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
  },
})
