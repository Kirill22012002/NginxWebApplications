import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    base: isDev ? '/' : '/web2/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:5058',
      },
    },
    build: {
      outDir: '../../wwwroot',
      emptyOutDir: true,
    },
  }
})
