import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    fs: {
      // Nunca servir documentos privados ni secretos a la red local
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/_documentos_privados/**', '**/*.pdf', '**/*.zip'],
    },
  },
})
