# Prompt 01: Política de seguridad de contenido (CSP) y cero terceros

Eres el responsable de seguridad del frontend de ProcureSim (React 19 + Vite, publicado como sitio estático en GitHub Pages, repositorio público `carmelo-sanjuanes/procuresim`, rama de publicación `master`). La aplicación no tiene servidor propio. Tu objetivo es que el navegador solo ejecute el código de ProcureSim y solo se conecte a la API pública de Datos Abiertos de Colombia.

## Contexto que debes leer

- `config/politica-de-seguridad.mjs`: única fuente de la política (web y portátil).
- `vite.config.ts`: plugin `procuresim-politica-de-seguridad` que inyecta la CSP en `<meta>` **solo al compilar** (`apply: 'build'`). En desarrollo no se aplica porque Vite usa scripts en línea para la recarga en caliente.
- `scripts/generar-portatil.mjs`: arma `ProcureSim_portatil.html` y autoriza su script en línea por huella SHA-256.
- `src/main.tsx`: fuentes alojadas con `@fontsource-variable/*` (no Google Fonts).

## Qué hacer

1. Buscar en `src/`, `index.html` y `public/` cualquier recurso externo nuevo: `https://` en `<link>`, `<script>`, `<img>`, `fetch`, CSS `@import` o `url()`. Por cada uno: alojarlo localmente, o si es una API, agregar su origen exacto a `ORIGENES_CONEXION` con una justificación en el comentario.
2. Confirmar que la política web mantiene: `script-src 'self'` (sin `unsafe-inline`, `unsafe-eval` ni comodines), `object-src 'none'`, `frame-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `upgrade-insecure-requests`.
3. Confirmar que el bundle no usa `eval` ni `new Function`: `grep -o 'new Function\|\beval(' dist/assets/*.js` debe salir vacío. Si una librería nueva los usa, cambiar de librería antes que relajar la CSP.
4. Regenerar la versión portátil con `npm run portatil` y confirmar que su CSP tiene `default-src 'none'` y la huella `sha256-…`.

## Cómo probarlo (obligatorio)

1. `npm run verificar` en verde.
2. `npx vite preview`, abrir `http://localhost:4173`, y en la consola del navegador:
   - `await fetch('https://www.datos.gov.co/resource/jbjy-vk9h.json?%24limit=1').then(r => r.status)` → `200`.
   - `await fetch('https://example.com').catch(() => 'bloqueado')` → `'bloqueado'`.
   - Recorrer: un buscador en vivo, una descarga Word (.docx), imprimir un documento. La consola no debe mostrar violaciones de CSP.
3. Servir `ProcureSim_portatil.html` (copiarlo a `dist/` y abrir `http://localhost:4173/ProcureSim_portatil.html`) y repetir lo anterior. Borrar la copia al terminar.

## No hacer

- No agregar `unsafe-inline` o `unsafe-eval` a `script-src` para «hacer que funcione».
- No volver a cargar fuentes, analítica, mapas o íconos desde CDN.
- No poner la CSP en el `index.html` fuente (rompe `npm run dev`).

## Terminado cuando

La consola no muestra violaciones en los recorridos, las dos pruebas de `fetch` dan lo esperado, `npm run verificar` pasa y la matriz de controles (8.7, 8.12, 8.23) sigue con su evidencia vigente.
