// Términos procesales en días hábiles colombianos (Ley Emiliani, Ley 51 de 1983) y alarmas con cuenta regresiva.
// Los festivos se calculan para cualquier año (no solo 2026): fijos, trasladables al lunes y dependientes de la Semana Santa.

const MS_DIA = 86_400_000;
const aFechaUTC = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const aISO = (d: Date) => d.toISOString().slice(0, 10);
const sumarDias = (d: Date, n: number) => new Date(d.getTime() + n * MS_DIA);
const aLunes = (d: Date) => {
  const dow = d.getUTCDay(); // 0 domingo … 1 lunes
  return dow === 1 ? d : sumarDias(d, (8 - dow) % 7);
};

function domingoDePascua(anio: number): Date {
  // Algoritmo de Meeus/Jones/Butcher (calendario gregoriano)
  const a = anio % 19, b = Math.floor(anio / 100), c = anio % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(anio, mes - 1, dia));
}

const cacheFestivos = new Map<number, Set<string>>();
export function festivosColombia(anio: number): Set<string> {
  const previo = cacheFestivos.get(anio);
  if (previo) return previo;
  const f = (m: number, d: number) => new Date(Date.UTC(anio, m - 1, d));
  const pascua = domingoDePascua(anio);
  const lista: Date[] = [
    f(1, 1), f(5, 1), f(7, 20), f(8, 7), f(12, 8), f(12, 25), // fijos
    aLunes(f(1, 6)), aLunes(f(3, 19)), aLunes(f(6, 29)), aLunes(f(8, 15)), aLunes(f(10, 12)), aLunes(f(11, 1)), aLunes(f(11, 11)), // Ley Emiliani
    sumarDias(pascua, -3), sumarDias(pascua, -2), // jueves y viernes santo
    aLunes(sumarDias(pascua, 39)), aLunes(sumarDias(pascua, 60)), aLunes(sumarDias(pascua, 68)) // Ascensión, Corpus Christi, Sagrado Corazón
  ];
  const set = new Set(lista.map(aISO));
  cacheFestivos.set(anio, set);
  return set;
}

/** Fecha real (calendario) en formato AAAA-MM-DD, entre 1990 y 2100: lo demás se ignora para no romper los cálculos. */
export function esFechaValida(iso: string | undefined | null): iso is string {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split('-').map(Number);
  if (y < 1990 || y > 2100) return false;
  const f = new Date(Date.UTC(y, m - 1, d));
  return f.getUTCFullYear() === y && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

export function esDiaHabil(iso: string): boolean {
  const d = aFechaUTC(iso);
  const dow = d.getUTCDay();
  return dow !== 0 && dow !== 6 && !festivosColombia(d.getUTCFullYear()).has(iso);
}

/** Suma n días hábiles (n puede ser 0). El día de partida no cuenta. */
export function sumarDiasHabiles(iso: string, n: number): string {
  let d = aFechaUTC(iso);
  let hechos = 0;
  while (hechos < n) {
    d = sumarDias(d, 1);
    if (esDiaHabil(aISO(d))) hechos++;
  }
  return aISO(d);
}

/** Resta n días hábiles: el último día hábil que deja n días hábiles completos hasta la fecha. */
export function restarDiasHabiles(iso: string, n: number): string {
  let d = aFechaUTC(iso);
  let hechos = 0;
  while (hechos < n) {
    d = sumarDias(d, -1);
    if (esDiaHabil(aISO(d))) hechos++;
  }
  return aISO(d);
}

/** Días hábiles que faltan desde `desde` (exclusive) hasta `hasta` (inclusive). Negativo si `hasta` ya pasó. */
export function diasHabilesEntre(desde: string, hasta: string): number {
  if (desde === hasta) return 0;
  const adelante = hasta > desde;
  let d = aFechaUTC(adelante ? desde : hasta);
  const fin = aFechaUTC(adelante ? hasta : desde);
  let n = 0;
  while (d < fin) {
    d = sumarDias(d, 1);
    if (esDiaHabil(aISO(d))) n++;
  }
  return adelante ? n : -n;
}

export type EstadoAlarma = 'SIN_FECHA' | 'EN_TERMINO' | 'URGENTE' | 'VENCIDO';

export interface AlarmaTermino {
  id: 'OBSERVACIONES_PREPLIEGO' | 'ADENDAS' | 'TRASLADO_EVALUACION' | 'SUSCRIPCION_CONTRATO';
  titulo: string;
  regla: string;
  baseLegal: string;
  fechaBase: string;
  etiquetaBase: string;
  fechaLimite: string | null;
  diasHabilesRestantes: number | null;
  horasRestantes: number | null;
  estado: EstadoAlarma;
}

export interface FechasBase {
  publicacionPrepliego?: string;
  cierre?: string;
  publicacionInforme?: string;
  adjudicacion?: string;
}

/** El término vence al terminar el día límite (23:59:59, hora local). */
function finDelDia(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59).getTime();
}

function armar(
  base: Omit<AlarmaTermino, 'fechaLimite' | 'diasHabilesRestantes' | 'horasRestantes' | 'estado'>,
  limite: string | null,
  ahora: Date
): AlarmaTermino {
  if (!base.fechaBase || !limite) {
    return { ...base, fechaLimite: null, diasHabilesRestantes: null, horasRestantes: null, estado: 'SIN_FECHA' };
  }
  const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
  const ms = finDelDia(limite) - ahora.getTime();
  const dias = diasHabilesEntre(hoy, limite);
  const estado: EstadoAlarma = ms < 0 ? 'VENCIDO' : dias <= 1 ? 'URGENTE' : 'EN_TERMINO';
  return { ...base, fechaLimite: limite, diasHabilesRestantes: dias, horasRestantes: Math.max(0, Math.floor(ms / 3_600_000)), estado };
}

export const TerminosProcesalesEngine = {
  /** Plazos adoptados por el simulador: modificables por el pliego aplicable; el usuario siempre debe verificarlos. */
  PLAZOS: { OBSERVACIONES_PREPLIEGO: 10, ADENDAS_ANTES_CIERRE: 3, TRASLADO_EVALUACION: 5, SUSCRIPCION_CONTRATO: 5 },

  calcularAlarmas(fEntrada: FechasBase, ahora: Date = new Date()): AlarmaTermino[] {
    const P = TerminosProcesalesEngine.PLAZOS;
    const ok = (x?: string) => (esFechaValida(x) ? x : undefined);
    const f: FechasBase = { publicacionPrepliego: ok(fEntrada.publicacionPrepliego), cierre: ok(fEntrada.cierre), publicacionInforme: ok(fEntrada.publicacionInforme), adjudicacion: ok(fEntrada.adjudicacion) };
    return [
      armar(
        {
          id: 'OBSERVACIONES_PREPLIEGO',
          titulo: 'Observaciones al proyecto de pliego',
          regla: `Mínimo ${P.OBSERVACIONES_PREPLIEGO} días hábiles desde la publicación del proyecto (licitación pública). El término vence en el día calculado.`,
          baseLegal: 'Art. 2.2.1.1.2.1.4 Decreto 1082 de 2015',
          fechaBase: f.publicacionPrepliego ?? '',
          etiquetaBase: 'Publicación del proyecto de pliego'
        },
        f.publicacionPrepliego ? sumarDiasHabiles(f.publicacionPrepliego, P.OBSERVACIONES_PREPLIEGO) : null,
        ahora
      ),
      armar(
        {
          id: 'ADENDAS',
          titulo: 'Último día para expedir adendas',
          regla: `Hasta ${P.ADENDAS_ANTES_CIERRE} días hábiles antes del cierre del proceso. Después de ese día no se pueden expedir adendas.`,
          baseLegal: 'Ley 1882 de 2018 (el artículo exacto no pudo confirmarse en esta ronda; verifícalo)',
          fechaBase: f.cierre ?? '',
          etiquetaBase: 'Fecha de cierre'
        },
        f.cierre ? restarDiasHabiles(f.cierre, P.ADENDAS_ANTES_CIERRE) : null,
        ahora
      ),
      armar(
        {
          id: 'TRASLADO_EVALUACION',
          titulo: 'Traslado del informe de evaluación',
          regla: `${P.TRASLADO_EVALUACION} días hábiles de traslado para observaciones (valor adoptado por el simulador; confirma el plazo en el pliego y en la modalidad aplicable).`,
          baseLegal: 'Ley 1150 de 2007 y Decreto 1082 de 2015 (según modalidad)',
          fechaBase: f.publicacionInforme ?? '',
          etiquetaBase: 'Publicación del informe de evaluación'
        },
        f.publicacionInforme ? sumarDiasHabiles(f.publicacionInforme, P.TRASLADO_EVALUACION) : null,
        ahora
      ),
      armar(
        {
          id: 'SUSCRIPCION_CONTRATO',
          titulo: 'Suscripción del contrato y aprobación de garantías',
          regla: `Normalmente ${P.SUSCRIPCION_CONTRATO} días hábiles desde la adjudicación; el plazo real lo fija el pliego.`,
          baseLegal: 'Pliego de condiciones aplicable',
          fechaBase: f.adjudicacion ?? '',
          etiquetaBase: 'Fecha de adjudicación'
        },
        f.adjudicacion ? sumarDiasHabiles(f.adjudicacion, P.SUSCRIPCION_CONTRATO) : null,
        ahora
      )
    ];
  }
};
