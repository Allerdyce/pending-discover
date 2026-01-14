import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        variant_c: 'variant_c.html',
        variant_a: 'variant_a.html',
        variant_b: 'variant_b.html',
        wizard: 'wizard.html'
      }
    }
  }
})
