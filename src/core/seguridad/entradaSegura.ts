// Controles de entrada: consultas a Datos Abiertos, enlaces externos y archivos importados.
// Todo dato que llega del usuario, de la API pública o de un archivo se trata como no confiable.

/** Largo máximo de un término de búsqueda que se envía a la API pública. */
export const MAX_TERMINO_BUSQUEDA = 120;

/** Tamaño máximo de un archivo de escenario o expedientes que se acepta importar (5 MB). */
export const MAX_BYTES_IMPORTACION = 5 * 1024 * 1024;

/** Sitios oficiales a los que la aplicación puede enlazar desde datos recibidos. */
export const DOMINIOS_ENLACE_PERMITIDOS = [
  'secop.gov.co',
  'colombiacompra.gov.co',
  'contratos.gov.co',
  'datos.gov.co',
];

/**
 * Limpia un término de búsqueda: quita caracteres de control, colapsa espacios y recorta el largo.
 */
export function limpiarTermino(valor: unknown, max = MAX_TERMINO_BUSQUEDA): string {
  if (typeof valor !== 'string') return '';
  return valor
    // oxlint-disable-next-line no-control-regex -- se buscan justamente los caracteres de control para quitarlos
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/**
 * Convierte un valor en literal de texto SoQL (lenguaje de consulta de Socrata):
 * lo encierra en comillas simples y duplica las comillas internas, para que el
 * valor nunca pueda cerrar el literal y añadir condiciones propias.
 */
export function literalSoql(valor: unknown): string {
  return `'${limpiarTermino(valor).replace(/'/g, "''")}'`;
}

/**
 * Patrón LIKE seguro: el término queda como literal y los comodines los pone la aplicación.
 */
export function patronLikeSoql(valor: unknown): string {
  return literalSoql(`%${limpiarTermino(valor)}%`);
}

/**
 * Arma la URL de consulta a un recurso de Datos Abiertos con los parámetros codificados.
 * Los valores ya deben venir como SoQL seguro (ver literalSoql).
 */
export function urlConsultaSocrata(recurso: string, parametros: Record<string, string | number>): string {
  const partes = Object.entries(parametros).map(
    ([clave, valor]) => `${encodeURIComponent(clave)}=${encodeURIComponent(String(valor))}`
  );
  return `${recurso}?${partes.join('&')}`;
}

/**
 * Devuelve el enlace solo si es https y apunta a un sitio oficial permitido.
 * Bloquea javascript:, data:, http: y dominios parecidos (secop.gov.co.atacante.com).
 */
export function enlaceSeguro(valor: unknown, dominios: string[] = DOMINIOS_ENLACE_PERMITIDOS): string | undefined {
  if (typeof valor !== 'string' || valor.length > 2048) return undefined;
  let url: URL;
  try {
    url = new URL(valor.trim());
  } catch {
    return undefined;
  }
  if (url.protocol !== 'https:' || url.username || url.password) return undefined;
  const host = url.hostname.toLowerCase();
  const permitido = dominios.some((d) => host === d || host.endsWith(`.${d}`));
  return permitido ? url.toString() : undefined;
}

const CLAVES_PELIGROSAS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Copia profunda de un JSON importado sin las claves que permiten contaminar prototipos.
 * Limita la profundidad para que un archivo malicioso no bloquee la página.
 */
export function sanearJson<T = unknown>(valor: unknown, profundidadMax = 40): T {
  const copiar = (v: unknown, nivel: number): unknown => {
    if (nivel > profundidadMax) throw new Error('El archivo tiene demasiados niveles anidados.');
    if (Array.isArray(v)) return v.map((x) => copiar(x, nivel + 1));
    if (v !== null && typeof v === 'object') {
      const limpio: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
        if (!CLAVES_PELIGROSAS.has(k)) limpio[k] = copiar(x, nivel + 1);
      }
      return limpio;
    }
    return v;
  };
  return copiar(valor, 0) as T;
}

/**
 * Lee un JSON importado con límite de tamaño y saneado. Devuelve null si no es válido.
 */
export function leerJsonImportado<T = unknown>(texto: unknown, maxBytes = MAX_BYTES_IMPORTACION): T | null {
  if (typeof texto !== 'string' || texto.length === 0) return null;
  if (new TextEncoder().encode(texto).length > maxBytes) return null;
  try {
    return sanearJson<T>(JSON.parse(texto));
  } catch {
    return null;
  }
}

const esObjeto = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Filtra una lista importada: deja solo objetos con un id de texto razonable y recorta la cantidad.
 */
export function listaDeRegistros<T>(valor: unknown, max = 5000): T[] | null {
  if (!Array.isArray(valor)) return null;
  return valor
    .slice(0, max)
    .filter((x) => esObjeto(x) && typeof x.id === 'string' && x.id.length > 0 && x.id.length <= 200) as T[];
}
