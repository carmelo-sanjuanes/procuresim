// Política de seguridad de contenido (CSP) de ProcureSim.
//
// GitHub Pages no permite enviar cabeceras HTTP propias, así que la política se
// entrega como <meta http-equiv="Content-Security-Policy"> en el HTML compilado.
// Limitación conocida: por <meta> no aplican frame-ancestors, report-uri ni
// sandbox; para eso hace falta un servidor o un proxy (Cloudflare) delante.
//
// Única conexión externa permitida: la API pública de Datos Abiertos de
// Colombia (SECOP II), usada por los buscadores en vivo.

/** Orígenes externos a los que la aplicación puede conectarse. */
export const ORIGENES_CONEXION = ['https://www.datos.gov.co'];

/**
 * Política para la versión publicada en la web (archivos separados en /assets).
 * @returns {string}
 */
export function politicaWeb() {
  return [
    "default-src 'self'",
    "script-src 'self'",
    // React y algunas librerías escriben estilos en línea; no ejecutan código.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${ORIGENES_CONEXION.join(' ')}`,
    "media-src 'self' data: blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

/**
 * Política para la versión portátil (un solo HTML que se abre sin internet).
 * El script va en línea, así que se autoriza solo por su huella SHA-256.
 * @param {string[]} huellasScript valores 'sha256-...' de los scripts en línea
 * @returns {string}
 */
export function politicaPortatil(huellasScript) {
  return [
    "default-src 'none'",
    `script-src ${huellasScript.map((h) => `'${h}'`).join(' ')}`,
    "style-src 'unsafe-inline'",
    'img-src data: blob:',
    'font-src data:',
    `connect-src ${ORIGENES_CONEXION.join(' ')}`,
    'media-src data: blob:',
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ');
}
