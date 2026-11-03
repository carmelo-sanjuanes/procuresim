// Mis Procesos: modelo de expediente guardado, etiquetas de paso y validación de importación/exportación.

export const FORMATO_EXPEDIENTES = 'procuresim-expedientes';
export const VERSION_FORMATO_EXPEDIENTES = 1;
export const TOTAL_PASOS = 13;
const MAX_EXPEDIENTES_IMPORTADOS = 200;
export const MAX_BYTES_IMPORTACION = 8 * 1024 * 1024;

export interface Expediente {
  id: string;
  creadoEn: string; // ISO
  actualizadoEn: string; // ISO
  objeto: string;
  entidad: string;
  presupuestoCOP: number;
  modalidad: string;
  tipoOperacion: 'COMPRO' | 'VENDO' | null;
  paso: number;
  etiquetaPaso: string;
  liquidado: boolean;
  /** Instantánea de todos los campos del flujo paso a paso (solo datos serializables). */
  estado: Record<string, unknown>;
}

export type DatosExpediente = Omit<Expediente, 'id' | 'creadoEn' | 'actualizadoEn'>;

const TITULO_PASO: Record<number, string> = {
  1: 'Rol de operación',
  2: 'Autoría y firmas',
  3: 'Identificación de la entidad',
  4: 'Régimen jurídico',
  5: 'Necesidad y objeto',
  6: 'Presupuesto y CDP',
  7: 'Mirada preventiva y ruta',
  8: 'Estudio de mercado',
  9: 'Estudios previos',
  10: 'SECOP II y adjudicación',
  11: 'Perfeccionamiento y legalización',
  12: 'Ejecución y modificaciones',
  13: 'Recibo y liquidación'
};

export function etiquetaPaso(paso: number, ctx: { cdpPendiente?: boolean; liquidado?: boolean }): string {
  const p = Math.min(TOTAL_PASOS, Math.max(1, Math.round(paso) || 1));
  let t = TITULO_PASO[p];
  if (p >= 6 && p <= 8 && ctx.cdpPendiente) t = p === 6 ? 'CDP en trámite' : `${t} (CDP en trámite)`;
  if (p === TOTAL_PASOS && ctx.liquidado) t = 'Liquidado';
  return `Paso ${p}: ${t}`;
}

export function crearIdExpediente(): string {
  const azar = Math.random().toString(36).slice(2, 8);
  return `EXP-${Date.now().toString(36).toUpperCase()}-${azar.toUpperCase()}`;
}

const esObjetoPlano = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const texto = (v: unknown, max = 600): string => (typeof v === 'string' ? v.slice(0, max) : '');
const numero = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0);
const iso = (v: unknown, def: string): string => (typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v : def);

/** Quita claves peligrosas de prototipo de forma recursiva. */
export function sanearEstado(v: unknown, prof = 0): unknown {
  if (prof > 12) return null;
  if (Array.isArray(v)) return v.slice(0, 5000).map((x) => sanearEstado(x, prof + 1));
  if (esObjetoPlano(v)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      out[k] = sanearEstado(v[k], prof + 1);
    }
    return out;
  }
  return v;
}

/** Normaliza un expediente venido de un archivo; devuelve null si no es válido. */
export function normalizarExpediente(raw: unknown): Expediente | null {
  if (!esObjetoPlano(raw) || !esObjetoPlano(raw.estado)) return null;
  const ahora = new Date().toISOString();
  const paso = Math.min(TOTAL_PASOS, Math.max(1, Math.round(numero(raw.paso)) || 1));
  const liquidado = raw.liquidado === true;
  return {
    id: texto(raw.id, 80) || crearIdExpediente(),
    creadoEn: iso(raw.creadoEn, ahora),
    actualizadoEn: iso(raw.actualizadoEn, ahora),
    objeto: texto(raw.objeto) || 'Proceso importado sin objeto',
    entidad: texto(raw.entidad, 300),
    presupuestoCOP: numero(raw.presupuestoCOP),
    modalidad: texto(raw.modalidad, 300),
    tipoOperacion: raw.tipoOperacion === 'COMPRO' || raw.tipoOperacion === 'VENDO' ? raw.tipoOperacion : null,
    paso,
    etiquetaPaso: texto(raw.etiquetaPaso, 200) || etiquetaPaso(paso, { liquidado }),
    liquidado,
    estado: sanearEstado(raw.estado) as Record<string, unknown>
  };
}

export function serializarExpedientes(lista: Expediente[]): string {
  return JSON.stringify(
    { formato: FORMATO_EXPEDIENTES, version: VERSION_FORMATO_EXPEDIENTES, exportadoEn: new Date().toISOString(), expedientes: lista },
    null,
    2
  );
}

export function leerExpedientes(json: string): { expedientes: Expediente[]; omitidos: number } | null {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return null;
  }
  if (!esObjetoPlano(data) || data.formato !== FORMATO_EXPEDIENTES || !Array.isArray(data.expedientes)) return null;
  const expedientes: Expediente[] = [];
  let omitidos = 0;
  for (const raw of data.expedientes.slice(0, MAX_EXPEDIENTES_IMPORTADOS)) {
    const e = normalizarExpediente(raw);
    if (e) expedientes.push(e);
    else omitidos++;
  }
  omitidos += Math.max(0, data.expedientes.length - MAX_EXPEDIENTES_IMPORTADOS);
  return { expedientes, omitidos };
}
