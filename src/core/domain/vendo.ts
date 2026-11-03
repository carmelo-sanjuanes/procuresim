// Ruta «Vendo»: el flujo del licitante y contratista. Modelo de datos y títulos de los 28 pasos.

export const TOTAL_PASOS_VENDO = 28;

export const FASES_VENDO = [
  { nombre: 'Tu empresa', desde: 1, hasta: 8 },
  { nombre: 'Estudio del proceso', desde: 9, hasta: 15 },
  { nombre: 'Construcción de la oferta', desde: 16, hasta: 22 },
  { nombre: 'Evaluación y adjudicación', desde: 23, hasta: 24 },
  { nombre: 'Después de ganar', desde: 25, hasta: 28 }
] as const;

export const TITULOS_VENDO: Record<number, string> = {
  1: 'Rol de operación',
  2: '¿Quién se postula?',
  3: 'Habilitación de la empresa',
  4: 'Antecedentes e inhabilidades',
  5: 'Capacidad jurídica',
  6: 'Tu experiencia',
  7: 'Capacidad financiera y residual',
  8: 'El proceso objetivo',
  9: 'Requisitos del pliego',
  10: 'Cronograma y alarmas',
  11: 'Riesgos del contrato',
  12: 'Observaciones al pliego',
  13: 'Mipyme y limitación',
  14: 'Decisión Go / No-Go',
  15: 'Alianza: consorcio o unión temporal',
  16: 'Costos directos y APU',
  17: 'AIU, impuestos y estampillas',
  18: 'Flujo de caja y anticipo',
  19: 'Precio y escenarios',
  20: 'Personal, SST y compromisos',
  21: 'Sobre 1: habilitante y garantía de seriedad',
  22: 'Sobre 2: oferta económica y propuesta',
  23: 'Informe de evaluación y subsanación',
  24: 'Adjudicación y reclamaciones',
  25: 'Contrato, garantías y Acta de Inicio',
  26: 'Ejecución y pagos',
  27: 'Modificaciones, multas y defensa',
  28: 'Liquidación y experiencia en el RUP'
};

export function etiquetaPasoVendo(paso: number): string {
  const p = Math.min(TOTAL_PASOS_VENDO, Math.max(1, Math.round(paso) || 1));
  return `Paso ${p}: ${TITULOS_VENDO[p]}`;
}

export type Tri = 'SI' | 'NO' | 'PEND';
export type AsignacionRiesgo = 'ENTIDAD' | 'YO' | 'COMPARTIDO' | 'NOSE';

export interface ContratoExperiencia {
  id: string;
  objeto: string;
  cliente: string;
  valorCOP: number;
  anio: number;
  unspsc: string;
}

export interface MiembroPlural {
  id: string;
  razonSocial: string;
  nit: string;
  porcentaje: number;
  experienciaSMMLV: number;
  esLider: boolean;
  actividades: string;
}

export interface Partida {
  id: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  materiales: number;
  manoObra: number;
  equipo: number;
  transporte: number;
}

export interface ActaPago {
  id: string;
  fecha: string;
  bruto: number;
}

export interface DatosVendo {
  paso: number;
  /** Respuestas Sí / No / Aún no de las listas de verificación. */
  checks: Record<string, Tri>;
  /** Campos de texto y número (todos como texto; se interpretan al calcular). */
  campos: Record<string, string>;
  contratos: ContratoExperiencia[];
  riesgos: Record<string, AsignacionRiesgo>;
  observaciones: Record<string, boolean>;
  tipoAlianza: '' | 'CONSORCIO' | 'UNION_TEMPORAL';
  miembros: MiembroPlural[];
  partidas: Partida[];
  actas: ActaPago[];
}

export const DATOS_VENDO_INICIALES: DatosVendo = {
  paso: 2,
  checks: {},
  campos: {},
  contratos: [],
  riesgos: {},
  observaciones: {},
  tipoAlianza: '',
  miembros: [],
  partidas: [],
  actas: []
};
