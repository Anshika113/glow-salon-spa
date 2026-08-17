import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The React dev server proxies /api to the backend so the frontend can call
// fetch('/api/contact') on the same origin, exactly as it does in production.
//
//   PORT     dev server port                       (default 5173)
//   API_PORT where /api is proxied to              (default 5000)
//            → use 8787 when running `npx wrangler dev` in a second terminal
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${Number(process.env.API_PORT) || 5000}`,
        changeOrigin: true,
      },
    },
  },
})
