import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Memuat environment variables agar bisa diakses via process.env di kode client
  // Fix: Cast process to any to avoid TS error about cwd missing
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill untuk process.env.API_KEY agar sesuai dengan aturan coding guideline
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})