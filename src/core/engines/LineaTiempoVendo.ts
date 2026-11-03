// Línea de tiempo de la venta: se construye sola a partir de las fechas que el usuario ya digitó en la ruta «Vendo».
import { TerminosProcesalesEngine, sumarDiasHabiles, restarDiasHabiles, diasHabilesEntre, esFechaValida } from './TerminosProcesalesEngine';
import { plazosLiquidacion, sumarMeses, num } from './VendoEngine';
import type { ActaPago } from '../domain/vendo';

export type EstadoHito = 'PASADO' | 'HOY' | 'PROXIMO' | 'LEJANO';
export interface Hito {
  id: string;
  titulo: string;
  fecha: string;
  /** ENTRADA: la digitó el usuario (editable). CALCULADO: sale de otra fecha. */
  tipo: 'ENTRADA' | 'CALCULADO';
  paso: number;
  campo?: string;
  nota?: string;
  estado: EstadoHito;
  diasHabiles: number;
  proximo: boolean;
}

const hoyISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function quintoHabilDeAbril(terminacion: string): string {
  const [y, m] = terminacion.split('-').map(Number);
  const anio = m >= 4 ? y + 1 : y;
  return sumarDiasHabiles(`${anio}-03-31`, 5);
}

export function construirLineaTiempo(cEntrada: Record<string, string>, actasEntrada: ActaPago[], ahora: Date = new Date()): { hitos: Hito[]; avisos: string[] } {
  const ok = (x?: string) => (esFechaValida(x) ? x : '');
  const c: Record<string, string> = { ...cEntrada, t_publicacion: ok(cEntrada?.t_publicacion), t_prepliego: ok(cEntrada?.t_prepliego), t_cierre: ok(cEntrada?.t_cierre), t_informe: ok(cEntrada?.t_informe), t_adjud: ok(cEntrada?.t_adjud), k_inicio: ok(cEntrada?.k_inicio), l_term: ok(cEntrada?.l_term) };
  const actas = (Array.isArray(actasEntrada) ? actasEntrada : []).filter((a) => a && esFechaValida(a.fecha));
  const P = TerminosProcesalesEngine.PLAZOS;
  const hoy = hoyISO(ahora);
  const crudos: Omit<Hito, 'estado' | 'diasHabiles' | 'proximo'>[] = [];
  const add = (h: Omit<Hito, 'estado' | 'diasHabiles' | 'proximo'>) => { if (h.fecha) crudos.push(h); };
  const avisos: string[] = [];

  add({ id: 'publicacion', titulo: 'Publicación del proceso', fecha: c.t_publicacion || '', tipo: 'ENTRADA', paso: 8, campo: 't_publicacion' });
  add({ id: 'prepliego', titulo: 'Publicación del proyecto de pliego', fecha: c.t_prepliego || '', tipo: 'ENTRADA', paso: 10, campo: 't_prepliego' });
  if (c.t_prepliego) add({ id: 'obs', titulo: 'Último día para observaciones al pliego', fecha: sumarDiasHabiles(c.t_prepliego, P.OBSERVACIONES_PREPLIEGO), tipo: 'CALCULADO', paso: 12, nota: `${P.OBSERVACIONES_PREPLIEGO} días hábiles desde la publicación` });
  if (c.t_cierre) add({ id: 'adendas', titulo: 'Último día para expedir adendas', fecha: restarDiasHabiles(c.t_cierre, P.ADENDAS_ANTES_CIERRE), tipo: 'CALCULADO', paso: 10, nota: `${P.ADENDAS_ANTES_CIERRE} días hábiles antes del cierre` });
  add({ id: 'cierre', titulo: 'Cierre y presentación de ofertas', fecha: c.t_cierre || '', tipo: 'ENTRADA', paso: 10, campo: 't_cierre' });
  add({ id: 'informe', titulo: 'Publicación del informe de evaluación', fecha: c.t_informe || '', tipo: 'ENTRADA', paso: 23, campo: 't_informe' });
  if (c.t_informe) add({ id: 'traslado', titulo: 'Último día del traslado del informe', fecha: sumarDiasHabiles(c.t_informe, P.TRASLADO_EVALUACION), tipo: 'CALCULADO', paso: 23, nota: 'Aquí subsanas y observas' });
  add({ id: 'adjud', titulo: 'Adjudicación', fecha: c.t_adjud || '', tipo: 'ENTRADA', paso: 24, campo: 't_adjud' });
  if (c.t_adjud) add({ id: 'suscr', titulo: 'Último día para firmar el contrato y entregar garantías', fecha: sumarDiasHabiles(c.t_adjud, P.SUSCRIPCION_CONTRATO), tipo: 'CALCULADO', paso: 25, nota: 'Plazo adoptado por el simulador: el pliego fija el real' });
  add({ id: 'inicio', titulo: 'Acta de Inicio', fecha: c.k_inicio || '', tipo: 'ENTRADA', paso: 25, campo: 'k_inicio' });
  actas.filter((a) => a.fecha).forEach((a, i) => add({ id: `acta_${a.id}`, titulo: `Acta de pago ${i + 1}`, fecha: a.fecha, tipo: 'ENTRADA', paso: 26 }));

  const plazo = num(c.fc_plazo);
  const terminacionCalc = c.k_inicio && Number.isFinite(plazo) && plazo > 0 && plazo <= 600 ? sumarMeses(c.k_inicio, Math.round(plazo)) : '';
  const terminacion = c.l_term || terminacionCalc;
  if (terminacion) {
    add({ id: 'term', titulo: 'Terminación del contrato', fecha: terminacion, tipo: c.l_term ? 'ENTRADA' : 'CALCULADO', paso: 28, campo: c.l_term ? 'l_term' : undefined, nota: c.l_term ? undefined : `Estimada: inicio + ${plazo} mes(es)` });
    const l = plazosLiquidacion(terminacion);
    add({ id: 'liqb', titulo: 'Plazo de liquidación de común acuerdo', fecha: l.bilateralHasta, tipo: 'CALCULADO', paso: 28, nota: 'Supletivo: si tu contrato fija otro, prevalece' });
    add({ id: 'liqu', titulo: 'Plazo de liquidación unilateral', fecha: l.unilateralHasta, tipo: 'CALCULADO', paso: 28, nota: 'Supletivo: verifícalo' });
    add({ id: 'rup', titulo: 'Registrar la experiencia en el RUP (renovación)', fecha: quintoHabilDeAbril(terminacion), tipo: 'CALCULADO', paso: 28, nota: 'Quinto día hábil de abril: verifícalo' });
  }

  // Coherencia entre fechas digitadas
  if ((c.t_publicacion || c.t_prepliego) && !c.t_cierre) avisos.push('Falta la fecha de cierre de ofertas: los datos abiertos de SECOP II no la traen; confírmala en el proceso y digítala aquí o en el paso 8.');
  const antes = (a?: string, b?: string) => !!a && !!b && a > b;
  if (c.t_prepliego && c.t_cierre && c.t_cierre <= sumarDiasHabiles(c.t_prepliego, P.OBSERVACIONES_PREPLIEGO)) avisos.push('El cierre queda antes de terminar el plazo de observaciones al pliego: revisa las fechas.');
  if (antes(c.t_cierre, c.t_informe)) avisos.push('El informe de evaluación aparece antes del cierre: revisa las fechas.');
  if (antes(c.t_informe, c.t_adjud)) avisos.push('La adjudicación aparece antes del informe de evaluación: revisa las fechas.');
  if (c.t_adjud && c.k_inicio && c.k_inicio < c.t_adjud) avisos.push('El Acta de Inicio aparece antes de la adjudicación: revisa las fechas.');
  if (c.l_term && c.k_inicio && c.l_term < c.k_inicio) avisos.push('La terminación aparece antes del inicio: revisa las fechas.');

  const hitos: Hito[] = crudos
    .sort((a, b) => (a.fecha === b.fecha ? 0 : a.fecha < b.fecha ? -1 : 1))
    .map((h) => {
      const dh = diasHabilesEntre(hoy, h.fecha);
      const estado: EstadoHito = h.fecha < hoy ? 'PASADO' : h.fecha === hoy ? 'HOY' : dh <= 10 ? 'PROXIMO' : 'LEJANO';
      return { ...h, estado, diasHabiles: dh, proximo: false };
    });
  const sig = hitos.find((h) => h.estado !== 'PASADO');
  if (sig) sig.proximo = true;
  return { hitos, avisos };
}

/** Calendario .ics (eventos de día completo con recordatorio el día anterior), listo para Google, Outlook o Apple. */
export function generarICS(hitos: Hito[], titulo: string): string {
  const esc = (t: string) => t.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const compacto = (iso: string) => iso.replace(/-/g, '');
  const sello = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const ev = hitos.map((h) => [
    'BEGIN:VEVENT', `UID:${h.id}-${compacto(h.fecha)}@procuresim`, `DTSTAMP:${sello}`, `DTSTART;VALUE=DATE:${compacto(h.fecha)}`,
    `SUMMARY:${esc(`${titulo ? titulo + ' · ' : ''}${h.titulo}`)}`, ...(h.nota ? [`DESCRIPTION:${esc(h.nota)}`] : []),
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(h.titulo)}`, 'TRIGGER:-P1D', 'END:VALARM', 'END:VEVENT'
  ].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ProcureSim//Linea de tiempo//ES', 'CALSCALE:GREGORIAN', ...ev, 'END:VCALENDAR'].join('\r\n');
}
