// Genera ProcureSim_portatil.html: un solo archivo que se abre sin internet ni instalación.
// Toma la compilación de dist/, mete en línea el código, los estilos, las fuentes y las imágenes,
// y le pone una política de seguridad que solo autoriza ese script por su huella SHA-256.
//
// Uso: npm run portatil   (compila y genera)

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { politicaPortatil } from '../config/politica-de-seguridad.mjs';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(raiz, 'dist');
const salida = join(raiz, 'ProcureSim_portatil.html');

const TIPOS = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

const comoDataUri = (ruta) => {
  const tipo = TIPOS[extname(ruta).toLowerCase()];
  if (!tipo) throw new Error(`Tipo de archivo no previsto: ${ruta}`);
  return `data:${tipo};base64,${readFileSync(ruta).toString('base64')}`;
};

if (!existsSync(join(dist, 'index.html'))) {
  throw new Error('No existe dist/index.html. Ejecute primero: npm run build');
}

let html = readFileSync(join(dist, 'index.html'), 'utf8');

// 1. Estilos: el CSS con sus fuentes e imágenes convertidas en data URI.
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, rel) => {
  const rutaCss = join(dist, rel);
  const css = readFileSync(rutaCss, 'utf8').replace(/url\((['"]?)(?!data:)([^'")]+)\1\)/g, (m, _q, ref) => {
    const archivo = resolve(dirname(rutaCss), ref.split(/[?#]/)[0]);
    return existsSync(archivo) ? `url(${comoDataUri(archivo)})` : m;
  });
  return `<style>${css}</style>`;
});

// 2. Imágenes públicas referenciadas desde el código (/sanjuanes/... o ./sanjuanes/...).
const incrustarPublicas = (texto) =>
  texto.replace(/(?:\.\/|\/)(sanjuanes\/[A-Za-z0-9_.-]+\.(?:png|svg|jpg))/g, (m, rel) => {
    const archivo = join(dist, rel);
    return existsSync(archivo) ? comoDataUri(archivo) : m;
  });

// Ícono de la pestaña.
html = incrustarPublicas(html);

// 3. Código: un solo script en línea; se calcula su huella para la política.
const huellas = [];
html = html.replace(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/g, (_, rel) => {
  const codigo = incrustarPublicas(readFileSync(join(dist, rel), 'utf8')).replace(/<\/script/gi, '<\\/script');
  huellas.push(`sha256-${createHash('sha256').update(codigo, 'utf8').digest('base64')}`);
  return `<script type="module">${codigo}</script>`;
});
if (huellas.length === 0) throw new Error('No se encontró el script principal en dist/index.html');

// El script en línea debe ir al final del body: el original es de tipo módulo y se ejecuta diferido.
const bloques = [];
html = html.replace(/<script type="module">[\s\S]*?<\/script>/g, (bloque) => {
  bloques.push(bloque);
  return '';
});
// Reemplazos con función: el código contiene secuencias como $' que replace() interpretaría.
html = html.replace('</body>', () => `${bloques.join('\n')}\n</body>`);

// 4. Política de la versión portátil.
html = html.replace(
  /<meta http-equiv="Content-Security-Policy" content="[^"]*">/,
  () => `<meta http-equiv="Content-Security-Policy" content="${politicaPortatil(huellas)}">`
);
if (!html.includes(huellas[0])) throw new Error('No se pudo aplicar la política de seguridad a la versión portátil');

writeFileSync(salida, html);
console.log(`ProcureSim_portatil.html generado (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB, ${huellas.length} script autorizado por huella).`);
