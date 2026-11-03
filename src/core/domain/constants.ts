/**
 * Constantes legales de referencia (fuente única de verdad).
 * Todo cálculo en SMMLV del simulador debe leer de aquí.
 */

/** Salario Mínimo Mensual Legal Vigente 2026 — Decreto 1469 de 2025 (COP). */
export const SMMLV_2026 = 1750905;

/** Unidad de Valor Tributario 2026 — Resolución DIAN 000238 de 2025 (COP). */
export const UVT_2026 = 52374;

/**
 * SMMLV histórico (COP) para convertir valores a SMMLV de la fecha de suscripción
 * (Art. 40 Ley 80 de 1993, parágrafo: la adición no puede superar el 50 % del valor
 * inicial expresado en SMMLV).
 */
export const SMMLV_HISTORICO: Record<number, number> = {
  2020: 877803,
  2021: 908526,
  2022: 1000000,
  2023: 1160000,
  2024: 1300000,
  2025: 1423500,
  2026: SMMLV_2026
};

/** SMMLV del año indicado; si no está tabulado, usa el vigente (2026). */
export const smmlvDelAnio = (anio: number): number => SMMLV_HISTORICO[anio] ?? SMMLV_2026;
