/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { politicaWeb } from './config/politica-de-seguridad.mjs'

/**
 * Inyecta la política de seguridad de contenido solo en la compilación.
 * En desarrollo Vite inserta scripts en línea para la recarga en caliente,
 * que una CSP estricta bloquearía.
 */
function politicaDeSeguridad(): Plugin {
  return {
    name: 'procuresim-politica-de-seguridad',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: () => [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: politicaWeb() },
          injectTo: 'head-prepend',
        },
      ],
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), politicaDeSeguridad()],
  build: {
    // Sin mapas de código fuente en lo publicado.
    sourcemap: false,
  },
  server: {
    // Solo este equipo. Para probar desde otro equipo de la red: npm run dev -- --host
    host: 'localhost',
    port: 5173,
    fs: {
      // Nunca servir documentos privados ni secretos a la red local
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/_documentos_privados/**', '**/*.pdf', '**/*.zip'],
    },
  },
  preview: {
    host: 'localhost',
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
