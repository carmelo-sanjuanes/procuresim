// Cálculos puros de la ruta «Vendo»: indicadores, experiencia, capacidad residual, requisitos del pliego, Go/No-Go y alianza.
import { smmlvDelAnio, SMMLV_2026 } from '../domain/constants';
import { ConsortiumEngine } from './ConsortiumEngine';
import type { DatosVendo, MiembroPlural, ContratoExperiencia, Tri } from '../domain/vendo';

/** Interpreta un texto como número entero o decimal (acepta puntos de miles y coma decimal). */
export function num(t: string | undefined): number {
  if (!t) return NaN;
  const limpio = t.replace(/\s/g, '').replace(/\$/g, '');
  if (!limpio) return NaN;
  const n = limpio.includes(',') ? Number(limpio.replace(/\./g, '').replace(',', '.')) : Number(limpio.replace(/\.(?=\d{3}(\D|$))/g, ''));
  return Number.isFinite(n) ? n : NaN;
}
const tiene = (n: number) => Number.isFinite(n);

export interface Indicadores {
  liquidez: number | null;
  endeudamiento: number | null; // en %
  cobertura: number | null; // null = sin gasto de intereses o dato faltante
  coberturaSinIntereses: boolean;
  capitalTrabajoCOP: number | null;
  patrimonioCOP: number | null;
}

export function indicadores(c: Record<string, string>): Indicadores {
  const ac = num(c.f_ac), pc = num(c.f_pc), at = num(c.f_at), pt = num(c.f_pt), uo = num(c.f_uo), gi = num(c.f_gi);
  return {
    liquidez: tiene(ac) && tiene(pc) && pc > 0 ? ac / pc : null,
    endeudamiento: tiene(pt) && tiene(at) && at > 0 ? (pt / at) * 100 : null,
    cobertura: tiene(uo) && tiene(gi) && gi > 0 ? uo / gi : null,
    coberturaSinIntereses: tiene(gi) && gi === 0,
    capitalTrabajoCOP: tiene(ac) && tiene(pc) ? ac - pc : null,
    patrimonioCOP: tiene(at) && tiene(pt) ? at - pt : null
  };
}

export const smmlvDeContrato = (k: ContratoExperiencia): number => (k.valorCOP > 0 ? k.valorCOP / smmlvDelAnio(k.anio || new Date().getFullYear()) : 0);
const soloDigitos = (t: string) => t.replace(/\D/g, '');

/** Un contrato coincide con un código exigido si comparten los primeros 6 dígitos (tercer nivel UNSPSC) o el prefijo exigido. */
export function coincideUnspsc(codigoContrato: string, codigoExigido: string): boolean {
  const a = soloDigitos(codigoContrato), b = soloDigitos(codigoExigido);
  if (!a || !b) return false;
  const n = Math.min(6, a.length, b.length);
  return a.slice(0, n) === b.slice(0, n);
}

export function codigosExigidos(t: string | undefined): string[] {
  return (t || '').split(/[,;\s]+/).map(soloDigitos).filter((x) => x.length >= 2);
}

export interface ResumenExperiencia {
  totalSMMLV: number;
  contratos: number;
  aplicanSMMLV: number;
  aplicanContratos: number;
  filtrado: boolean;
}

export function experiencia(contratos: ContratoExperiencia[], exigidos: string[]): ResumenExperiencia {
  const filtrado = exigidos.length > 0;
  const aplican = filtrado ? contratos.filter((k) => exigidos.some((e) => coincideUnspsc(k.unspsc, e))) : contratos;
  const suma = (l: ContratoExperiencia[]) => l.reduce((a, k) => a + smmlvDeContrato(k), 0);
  return { totalSMMLV: suma(contratos), contratos: contratos.length, aplicanSMMLV: suma(aplican), aplicanContratos: aplican.length, filtrado };
}

export function capacidadResidual(c: Record<string, string>): { crCOP: number; crSMMLV: number } | null {
  const co = num(c.k_co);
  if (!tiene(co) || co <= 0) return null;
  const r = ConsortiumEngine.calcularCapacidadResidual([
    {
      id: 'propia', razonSocial: 'Propia', nit: '', representanteLegal: '', cedulaRepresentante: '', porcentajeParticipacion: 100,
      compromisoObligaciones: '', aportesFinancierosCOP: 0, experienciaAportadaSMMLV: 0, esLider: true,
      activoCorriente: 0, pasivoCorriente: 0, activoTotal: 0, pasivoTotal: 0, patrimonio: 0,
      ingresosOperacionalesMaxCOP: co, puntosExperiencia: num(c.k_e) || 0, puntosCapTecnica: num(c.k_ct) || 0, puntosCapFinanciera: num(c.k_cf) || 0,
      saldoContratosEjecucionCOP: num(c.k_sce) || 0
    } as never
  ]);
  return { crCOP: r.totalCOP, crSMMLV: Number((r.totalCOP / SMMLV_2026).toFixed(1)) };
}

export type EstadoReq = 'CUMPLE' | 'NO_CUMPLE' | 'FALTA';
export interface Requisito { id: string; etiqueta: string; estado: EstadoReq; detalle: string }

const fmt = (n: number, d = 2) => n.toLocaleString('es-CO', { maximumFractionDigits: d });

/** Compara lo que dice tu empresa con lo que pide el pliego (los umbrales los escribe el usuario desde el pliego). */
export function evaluarRequisitos(d: DatosVendo, extra?: { experienciaPluralSMMLV?: number }): Requisito[] {
  const c = d.campos;
  const ind = indicadores(c);
  const out: Requisito[] = [];
  const cmp = (id: string, etiqueta: string, exigido: number, valor: number | null, mayor: boolean, unidad: string, dec = 2) => {
    if (!tiene(exigido)) return;
    if (valor === null) out.push({ id, etiqueta, estado: 'FALTA', detalle: 'Falta registrar tus datos para compararlo.' });
    else {
      const ok = mayor ? valor >= exigido : valor <= exigido;
      out.push({ id, etiqueta, estado: ok ? 'CUMPLE' : 'NO_CUMPLE', detalle: `Tienes ${fmt(valor, dec)}${unidad}; el pliego pide ${mayor ? '≥' : '≤'} ${fmt(exigido, dec)}${unidad}.` });
    }
  };
  cmp('liq', 'Índice de liquidez', num(c.r_liq), ind.liquidez, true, '');
  cmp('end', 'Nivel de endeudamiento', num(c.r_end), ind.endeudamiento, false, ' %', 1);
  const cobExig = num(c.r_cob);
  if (tiene(cobExig)) {
    if (ind.coberturaSinIntereses) out.push({ id: 'cob', etiqueta: 'Cobertura de intereses', estado: 'CUMPLE', detalle: 'Sin gastos de intereses (razón indeterminada: cumple según la mayoría de los pliegos; confírmalo).' });
    else cmp('cob', 'Cobertura de intereses', cobExig, ind.cobertura, true, '');
  }
  cmp('ct', 'Capital de trabajo (COP)', num(c.r_ctr), ind.capitalTrabajoCOP, true, '', 0);
  const exp = experiencia(d.contratos, codigosExigidos(c.r_unspsc));
  const expTotal = exp.aplicanSMMLV + (extra?.experienciaPluralSMMLV ?? 0);
  if (tiene(num(c.r_exp))) {
    if (d.contratos.length === 0 && !extra?.experienciaPluralSMMLV) out.push({ id: 'exp', etiqueta: 'Experiencia en SMMLV', estado: 'FALTA', detalle: 'Aún no registras contratos en el paso 6.' });
    else {
      const ok = expTotal >= num(c.r_exp);
      out.push({ id: 'exp', etiqueta: 'Experiencia en SMMLV', estado: ok ? 'CUMPLE' : 'NO_CUMPLE', detalle: `Acreditas ${fmt(expTotal, 1)} SMMLV${exp.filtrado ? ' en los códigos exigidos' : ''}; el pliego pide ${fmt(num(c.r_exp), 1)}.` });
    }
  }
  if (tiene(num(c.r_nexp))) {
    const ok = exp.aplicanContratos >= num(c.r_nexp);
    out.push({ id: 'nexp', etiqueta: 'Número de contratos', estado: ok ? 'CUMPLE' : 'NO_CUMPLE', detalle: `Tienes ${exp.aplicanContratos} contrato(s) aplicables; el pliego pide ${fmt(num(c.r_nexp), 0)}.` });
  }
  if (tiene(num(c.r_k))) {
    const k = capacidadResidual(c);
    if (!k) out.push({ id: 'k', etiqueta: 'Capacidad residual (SMMLV)', estado: 'FALTA', detalle: 'Falta calcular tu capacidad residual en el paso 7.' });
    else out.push({ id: 'k', etiqueta: 'Capacidad residual (SMMLV)', estado: k.crSMMLV >= num(c.r_k) ? 'CUMPLE' : 'NO_CUMPLE', detalle: `Tu capacidad residual es ${fmt(k.crSMMLV, 1)} SMMLV; el pliego pide ${fmt(num(c.r_k), 1)}.` });
  }
  return out;
}

export interface CasillaChecks { id: string; texto: string; critica?: boolean }

export function estadoLista(checks: Record<string, Tri>, ids: string[]): 'EN_REGLA' | 'SUBSANAR' | 'PENDIENTE' {
  if (ids.some((i) => checks[i] === 'NO')) return 'SUBSANAR';
  if (ids.every((i) => checks[i] === 'SI')) return 'EN_REGLA';
  return 'PENDIENTE';
}

export interface Recomendacion {
  veredicto: 'PRESENTARSE_SOLO' | 'BUSCAR_ALIANZA' | 'NO_PRESENTARSE' | 'COMPLETAR';
  titulo: string;
  razones: string[];
}

export function decisionGoNoGo(d: DatosVendo, listas: { habil: string[]; antec: string[]; jur: string[] }): Recomendacion {
  const reqs = evaluarRequisitos(d);
  const razones: string[] = [];
  const antec = estadoLista(d.checks, listas.antec);
  if (antec === 'SUBSANAR') {
    return { veredicto: 'NO_PRESENTARSE', titulo: 'No presentarse por ahora', razones: ['Hay antecedentes o inhabilidades sin resolver (paso 4). Una inhabilidad no se subsana presentando una alianza.'] };
  }
  const margen = num(d.campos.g_margen);
  if (tiene(margen) && margen <= 0) {
    return { veredicto: 'NO_PRESENTARSE', titulo: 'No presentarse', razones: ['El margen esperado es cero o negativo: ganar no te conviene.'] };
  }
  const habil = estadoLista(d.checks, listas.habil);
  const jur = estadoLista(d.checks, listas.jur);
  const faltan = reqs.filter((r) => r.estado === 'FALTA').length;
  const noCumplen = reqs.filter((r) => r.estado === 'NO_CUMPLE');
  if (reqs.length === 0 || faltan > 0 || habil === 'PENDIENTE' || jur === 'PENDIENTE') {
    if (reqs.length === 0) razones.push('Aún no registraste los requisitos del pliego (paso 9).');
    if (faltan > 0) razones.push(`${faltan} requisito(s) sin datos para compararlos.`);
    if (habil === 'PENDIENTE') razones.push('La habilitación de la empresa (paso 3) está pendiente.');
    if (jur === 'PENDIENTE') razones.push('La capacidad jurídica (paso 5) está pendiente.');
    return { veredicto: 'COMPLETAR', titulo: 'Falta información para decidir', razones };
  }
  if (habil === 'SUBSANAR') razones.push('La habilitación de la empresa requiere subsanación (paso 3): hazlo antes del cierre.');
  if (jur === 'SUBSANAR') razones.push('La capacidad jurídica requiere subsanación (paso 5).');
  if (noCumplen.length > 0) {
    noCumplen.forEach((r) => razones.push(`${r.etiqueta}: ${r.detalle}`));
    razones.push('Una alianza solo se justifica para completar lo que te falta, no para reducir la competencia.');
    return { veredicto: 'BUSCAR_ALIANZA', titulo: 'Buscar alianza (consorcio o unión temporal)', razones };
  }
  razones.push('Cumples todos los requisitos que registraste.');
  if (tiene(margen)) razones.push(`Margen esperado: ${fmt(margen, 1)} %.`);
  return { veredicto: 'PRESENTARSE_SOLO', titulo: 'Presentarte solo', razones };
}

export function validarAlianza(miembros: MiembroPlural[], tipo: string): string[] {
  const avisos: string[] = [];
  if (!tipo) return ['Elige si es consorcio o unión temporal.'];
  if (miembros.length < 2) avisos.push('Una estructura plural necesita al menos dos integrantes.');
  const suma = miembros.reduce((a, m) => a + (m.porcentaje || 0), 0);
  if (miembros.length > 0 && Math.abs(suma - 100) > 0.01) avisos.push(`Las participaciones suman ${fmt(suma, 1)} %: deben sumar 100 %.`);
  if (miembros.length > 0 && miembros.filter((m) => m.esLider).length !== 1) avisos.push('Define exactamente un integrante líder o representante.');
  if (tipo === 'UNION_TEMPORAL' && miembros.some((m) => !m.actividades.trim())) avisos.push('En la unión temporal cada integrante debe señalar los términos y la extensión de su participación en la ejecución (Art. 7 Ley 80 de 1993).');
  return avisos;
}

export const experienciaPlural = (miembros: MiembroPlural[]): number => miembros.reduce((a, m) => a + (m.experienciaSMMLV || 0), 0);

export const RIESGOS_TIPICOS: { id: string; texto: string; alto: boolean }[] = [
  { id: 'precios', texto: 'Variación de precios de insumos y materiales', alto: true },
  { id: 'cambio', texto: 'Variación de la tasa de cambio', alto: false },
  { id: 'clima', texto: 'Condiciones climáticas adversas', alto: false },
  { id: 'predios', texto: 'Disponibilidad de predios, permisos y licencias', alto: true },
  { id: 'redes', texto: 'Redes de servicios públicos no identificadas', alto: true },
  { id: 'pagos', texto: 'Demora de la entidad en los pagos', alto: true },
  { id: 'normativo', texto: 'Cambios normativos o tributarios', alto: false },
  { id: 'social', texto: 'Orden público y conflictos con la comunidad', alto: false }
];

export interface CatalogoObs { id: string; etiqueta: string; texto: string }
export const CATALOGO_OBSERVACIONES: CatalogoObs[] = [
  { id: 'exp', etiqueta: 'Experiencia desproporcionada frente al valor del proceso', texto: 'El requisito de experiencia resulta desproporcionado frente a la cuantía, naturaleza y complejidad del objeto. Solicitamos ajustarlo de manera que permita la participación plural de oferentes idóneos.' },
  { id: 'indic', etiqueta: 'Indicadores financieros fuera de lo razonable para el sector', texto: 'Solicitamos que se explique con el análisis del sector el origen de los indicadores de liquidez, endeudamiento y cobertura exigidos, o que se ajusten a los niveles que resultan de aplicar la guía de requisitos habilitantes de Colombia Compra Eficiente.' },
  { id: 'marca', etiqueta: 'Especificaciones que apuntan a una marca o fabricante', texto: 'Las especificaciones técnicas hacen referencia a características propias de una marca o fabricante. Solicitamos eliminar esas referencias o admitir expresamente productos equivalentes que cumplan el desempeño requerido.' },
  { id: 'plazo', etiqueta: 'Plazo de ejecución insuficiente', texto: 'El plazo de ejecución previsto no guarda relación con las cantidades y actividades del objeto. Solicitamos revisarlo o presentar el soporte técnico que lo justifica.' },
  { id: 'anticipo', etiqueta: 'Forma de pago o anticipo que afecta el flujo de caja', texto: 'La forma de pago prevista, incluido el porcentaje de anticipo, no permite una financiación razonable de la ejecución. Solicitamos revisar el esquema de pagos y los plazos de pago a contratista.' },
  { id: 'puntaje', etiqueta: 'Factor de puntaje que favorece a un solo oferente', texto: 'Uno de los factores ponderables solo puede ser acreditado por un oferente determinado. Solicitamos reformularlo con criterios objetivos y verificables que permitan la competencia.' },
  { id: 'riesgo', etiqueta: 'Asignación de riesgos desequilibrada', texto: 'La matriz de riesgos asigna al contratista riesgos que no puede controlar ni estimar. Solicitamos revisar la asignación y justificar los riesgos que se trasladan al contratista.' },
  { id: 'cert', etiqueta: 'Certificaciones que solo emiten ciertos proveedores', texto: 'Se exigen certificaciones o requisitos que solo pueden ser expedidos por un número limitado de proveedores. Solicitamos admitir otros medios idóneos de acreditación.' },
  { id: 'ambig', etiqueta: 'Requisito ambiguo o contradictorio', texto: 'Existen apartes del pliego y de sus anexos que se contradicen o admiten más de una interpretación. Solicitamos aclararlos para garantizar una selección objetiva.' },
  { id: 'crono', etiqueta: 'Cronograma que no permite preparar la oferta', texto: 'El tiempo previsto entre la publicación de los documentos definitivos y el cierre no permite preparar una oferta completa. Solicitamos ampliar el plazo.' }
];

export function redactarObservaciones(d: DatosVendo): string {
  const c = d.campos;
  const sel = CATALOGO_OBSERVACIONES.filter((o) => d.observaciones[o.id]);
  if (sel.length === 0) return '';
  const cuerpo = sel.map((o, i) => `${i + 1}. ${o.texto}`).join('\n\n');
  return `Señores\n${c.p_entidad || '[ENTIDAD]'}\n\nRef.: Proceso ${c.p_numero || '[N.º DEL PROCESO]'} — Observaciones al proyecto de pliego de condiciones\n\nDe manera respetuosa, ${c.q_razon || '[RAZÓN SOCIAL]'} (NIT ${c.q_nit || '[NIT]'}) presenta, dentro del término establecido, las siguientes observaciones:\n\n${cuerpo}\n\nLo anterior en aplicación de los principios de selección objetiva, transparencia y pluralidad de oferentes (Art. 5 de la Ley 1150 de 2007).\n\nCordialmente,\n\n${c.q_rep || '[REPRESENTANTE LEGAL]'}\n${c.q_razon || '[RAZÓN SOCIAL]'}`;
}

// ================= Construcción de la oferta (pasos 16 a 22) =================
import type { Partida } from '../domain/vendo';
import { ScoringFormulasEngine, type MetodoCalificacionEconomica, type ResultadoSimulacionEconomica } from './ScoringFormulasEngine';

export const costoUnitario = (x: Partida, factorPrestacional: number): number =>
  (x.materiales || 0) + (x.manoObra || 0) * (factorPrestacional > 0 ? factorPrestacional : 1) + (x.equipo || 0) + (x.transporte || 0);
export const costoPartida = (x: Partida, factor: number): number => costoUnitario(x, factor) * (x.cantidad || 0);
export const costoDirectoTotal = (ps: Partida[], factor: number): number => ps.reduce((a, x) => a + costoPartida(x, factor), 0);

export interface Oferta {
  costoDirecto: number;
  aiuPct: { a: number; i: number; u: number };
  valorAntesIVA: number;
  iva: number;
  total: number;
  ivaSoloUtilidad: boolean;
  estampillas: number;
  contribucion: number;
  polizas: number;
  adicionales: number; // estampillas + contribución + pólizas (sin financiamiento)
  restoAIU: number; // lo que queda de A + I + U tras los costos adicionales
}

/** Oferta económica. En obra con AIU el IVA se calcula solo sobre la utilidad; en los demás casos, sobre el valor total. */
export function calcularOferta(d: DatosVendo): Oferta | null {
  const c = d.campos;
  const f = num(c.o_factor) || 1;
  const cd = costoDirectoTotal(d.partidas, f);
  if (cd <= 0) return null;
  const a = num(c.o_a) || 0, i = num(c.o_i) || 0, u = num(c.o_u) || 0;
  const ivaPct = tiene(num(c.o_iva)) ? num(c.o_iva) : 19;
  const ivaSoloUtilidad = c.p_tipo === 'OBRA';
  const valorAntesIVA = cd * (1 + (a + i + u) / 100);
  const iva = ivaSoloUtilidad ? (cd * u / 100) * (ivaPct / 100) : valorAntesIVA * (ivaPct / 100);
  const estampillas = valorAntesIVA * ((num(c.o_est) || 0) / 100);
  const contribucion = valorAntesIVA * ((num(c.o_contr) || 0) / 100);
  const polizas = valorAntesIVA * ((num(c.o_pol) || 0) / 100);
  const adicionales = estampillas + contribucion + polizas;
  return { costoDirecto: cd, aiuPct: { a, i, u }, valorAntesIVA, iva, total: valorAntesIVA + iva, ivaSoloUtilidad, estampillas, contribucion, polizas, adicionales, restoAIU: valorAntesIVA - cd - adicionales };
}

export interface FlujoCaja {
  acumulado: number[]; // mes 0 .. n+rezago
  picoCOP: number; // máxima necesidad de financiación
  mesPico: number;
  costoFinancieroCOP: number;
  anticipoCOP: number;
}

export function flujoCaja(d: DatosVendo): FlujoCaja | null {
  const o = calcularOferta(d);
  const c = d.campos;
  const n = Math.round(num(c.fc_plazo));
  if (!o || !tiene(n) || n < 1 || n > 120) return null;
  const ant = Math.min(Math.max(num(c.fc_anticipo) || 0, 0), 100) / 100;
  const rezago = Math.max(0, Math.ceil((num(c.fc_dias) || 0) / 30));
  const tasa = (num(c.fc_tasa) || 0) / 100;
  const egresoMes = (o.costoDirecto + o.adicionales) / n;
  const actaMes = (o.total * (1 - ant)) / n;
  const anticipoCOP = o.total * ant;
  const largo = n + rezago;
  const acumulado: number[] = [];
  let cum = anticipoCOP;
  acumulado.push(cum);
  let costoFin = 0;
  for (let t = 1; t <= largo; t++) {
    if (cum < 0) costoFin += -cum * tasa;
    if (t <= n) cum -= egresoMes;
    if (t - rezago >= 1 && t - rezago <= n) cum += actaMes;
    acumulado.push(cum);
  }
  const minimo = Math.min(...acumulado);
  return { acumulado, picoCOP: minimo < 0 ? -minimo : 0, mesPico: minimo < 0 ? acumulado.indexOf(minimo) : 0, costoFinancieroCOP: costoFin, anticipoCOP };
}

export const METODOS_ECONOMICOS: { id: MetodoCalificacionEconomica; etiqueta: string }[] = [
  { id: 'MEDIA_ARITMETICA_SIMPLE', etiqueta: 'Media aritmética' },
  { id: 'MEDIA_ARITMETICA_ALTA_TRM', etiqueta: 'Media aritmética alta' },
  { id: 'MEDIA_GEOMETRICA', etiqueta: 'Media geométrica con presupuesto oficial' },
  { id: 'MENOR_PRECIO', etiqueta: 'Menor valor' }
];

export function listaPrecios(t: string | undefined): number[] {
  return (t || '').split(/[\n;]+|\s{2,}/).map((x) => num(x.replace(/[^\d.,]/g, ''))).filter((x) => tiene(x) && x > 0);
}

export interface EscenarioPrecio { factor: number; precio: number; puntaje: number; posicion: number; bajo: boolean }

/** Simula tu puntaje económico frente a precios supuestos de competidores. La fórmula real la define el pliego. */
export function simularEscenarios(d: DatosVendo, metodo: MetodoCalificacionEconomica, precioPropio: number): { base: ResultadoSimulacionEconomica; escenarios: EscenarioPrecio[] } | null {
  const po = num(d.campos.p_presupuesto);
  const comp = listaPrecios(d.campos.e_comp);
  if (!tiene(po) || po <= 0 || comp.length === 0 || !(precioPropio > 0)) return null;
  const mk = (precio: number) => [
    { id: 'yo', nombreProponente: 'Tu oferta', valorOfertado: precio },
    ...comp.map((v, i) => ({ id: `c${i}`, nombreProponente: `Competidor ${i + 1}`, valorOfertado: v }))
  ].map((o) => ({ ...o, esMiPyme: false, esEmpresaMujeres: false, empleadosDiscapacidad: false, industriaNacional: false, puntajeCalidadTecnica: 0, habilitado: true }));
  const correr = (precio: number) => ScoringFormulasEngine.simularCalificacionEconomica(mk(precio), po, metodo);
  const base = correr(precioPropio);
  const escenarios = [0.9, 0.95, 1, 1.05].map((factor) => {
    const precio = precioPropio * factor;
    const r = correr(precio).ofertasCalificadas.find((x) => x.ofertaId === 'yo');
    return { factor, precio, puntaje: r?.puntajeEconomico ?? 0, posicion: r?.posicion ?? 0, bajo: r?.esPrecioArtificialmenteBajo ?? false };
  });
  return { base, escenarios };
}

export interface CasillaSobre { id: string; t: string }
export const LISTA_PERSONAL: CasillaSobre[] = [
  { id: 'e_dir', t: 'Director o gerente del proyecto con la experiencia que pide el pliego' },
  { id: 'e_res', t: 'Residente o coordinador técnico con hoja de vida, tarjeta profesional y certificaciones' },
  { id: 'e_siso', t: 'Profesional SST/SISO con licencia vigente' },
  { id: 'e_comp', t: 'Cartas de compromiso y dedicación firmadas por cada profesional' },
  { id: 'e_sst', t: 'Sistema de Gestión de Seguridad y Salud en el Trabajo con la evaluación de estándares mínimos al día (Resolución 0312 de 2019)' },
  { id: 'e_cal', t: 'Plan de calidad y plan de manejo ambiental, si el pliego los pide' },
  { id: 'e_equ', t: 'Equipo mínimo: propio o con carta de disponibilidad' }
];
export const LISTA_SOBRE1: CasillaSobre[] = [
  { id: 's_car', t: 'Carta de presentación firmada por el representante legal' },
  { id: 's_cam', t: 'Certificado de existencia y representación legal' },
  { id: 's_rup', t: 'RUP vigente y en firme' },
  { id: 's_par', t: 'Certificación de pago de seguridad social y parafiscales' },
  { id: 's_ant', t: 'Certificados de antecedentes (Procuraduría, Contraloría, Policía, medidas correctivas)' },
  { id: 's_exp', t: 'Certificaciones de experiencia con los datos que exige el pliego' },
  { id: 's_fin', t: 'Estados financieros y certificaciones de contador y revisor fiscal' },
  { id: 's_plu', t: 'Documento de constitución del consorcio o unión temporal (si aplica)' },
  { id: 's_gar', t: 'Garantía de seriedad de la oferta con su recibo de pago' }
];
export const LISTA_GARANTIA: CasillaSobre[] = [
  { id: 'g_tom', t: 'El tomador es exactamente quien presenta la oferta (en consorcio o unión temporal, todos los integrantes)' },
  { id: 'g_ase', t: 'El asegurado es la entidad contratante, con su NIT' },
  { id: 'g_obj', t: 'Identifica el proceso y su objeto' },
  { id: 'g_val', t: 'El valor asegurado y la vigencia cumplen lo que pide el pliego' },
  { id: 'g_fir', t: 'Está firmada por el tomador y trae el soporte de pago de la prima' }
];
export const LISTA_CIERRE: CasillaSobre[] = [
  { id: 'z_fir', t: 'Todos los documentos están firmados donde corresponde' },
  { id: 'z_tam', t: 'Los archivos cumplen formato y tamaño de la plataforma' },
  { id: 'z_hor', t: 'Cargarás la oferta con margen antes de la hora oficial de cierre' },
  { id: 'z_sob', t: 'La oferta económica va en el sobre o formulario económico, separada de los documentos habilitantes' }
];

// ================= Evaluación, adjudicación y ejecución (pasos 23 a 28) =================
import type { ActaPago } from '../domain/vendo';

export interface ItemSubsanacion { id: string; etiqueta: string; subsanable: boolean }
export const CATALOGO_SUBSANACION: ItemSubsanacion[] = [
  { id: 'sub_doc', etiqueta: 'Documento habilitante faltante o ilegible', subsanable: true },
  { id: 'sub_cert', etiqueta: 'Certificación de experiencia incompleta (datos que ya existían al cierre)', subsanable: true },
  { id: 'sub_pol', etiqueta: 'Error de forma en la garantía de seriedad (tomador, asegurado, vigencia)', subsanable: true },
  { id: 'sub_fin', etiqueta: 'Estados financieros o certificaciones sin firma', subsanable: true },
  { id: 'sub_rup', etiqueta: 'RUP o certificado de existencia con fecha anterior a la exigida', subsanable: true },
  { id: 'sub_prec', etiqueta: 'Corregir o mejorar el precio de la oferta', subsanable: false },
  { id: 'sub_punt', etiqueta: 'Aportar un factor ponderable que no presentaste a tiempo', subsanable: false },
  { id: 'sub_post', etiqueta: 'Acreditar una condición que solo existe después del cierre', subsanable: false }
];

export function redactarSubsanacion(d: DatosVendo): string {
  const c = d.campos;
  const sel = CATALOGO_SUBSANACION.filter((x) => d.observaciones[x.id] && x.subsanable);
  const otras = (c.s_otras || '').trim();
  if (sel.length === 0 && !otras) return '';
  const partes: string[] = [];
  if (sel.length) partes.push(`Dentro del término de traslado, allegamos los documentos con los que se subsanan los siguientes requisitos habilitantes:\n${sel.map((x, i) => `${i + 1}. ${x.etiqueta}.`).join('\n')}\n\nLos documentos aportados acreditan circunstancias existentes antes del cierre del proceso y no modifican ni mejoran la oferta.`);
  if (otras) partes.push(`Adicionalmente, formulamos las siguientes observaciones al informe de evaluación:\n${otras}`);
  return `Señores\n${c.p_entidad || '[ENTIDAD]'}\n\nRef.: Proceso ${c.p_numero || '[N.º DEL PROCESO]'} — Respuesta al informe de evaluación\n\n${c.q_razon || '[RAZÓN SOCIAL]'} (NIT ${c.q_nit || '[NIT]'}), proponente dentro del proceso de la referencia, se pronuncia sobre el informe de evaluación así:\n\n${partes.join('\n\n')}\n\nSolicitamos, en consecuencia, tener por subsanados los requisitos señalados y mantener nuestra oferta como habilitada.\n\nCordialmente,\n\n${c.q_rep || '[REPRESENTANTE LEGAL]'}\n${c.q_razon || '[RAZÓN SOCIAL]'}`;
}

export interface Amparo { id: string; etiqueta: string }
export const AMPAROS: Amparo[] = [
  { id: 'cumpl', etiqueta: 'Cumplimiento' },
  { id: 'antic', etiqueta: 'Buen manejo y correcta inversión del anticipo' },
  { id: 'sal', etiqueta: 'Pago de salarios, prestaciones sociales e indemnizaciones' },
  { id: 'estab', etiqueta: 'Estabilidad y calidad de la obra / calidad del servicio o bien' },
  { id: 'rce', etiqueta: 'Responsabilidad civil extracontractual' }
];

export interface FilaGarantia { id: string; etiqueta: string; porcentaje: number | null; valorCOP: number | null; vigencia: string }
/** Los porcentajes y vigencias los fija el pliego: aquí solo se convierten en valores asegurados. */
export function garantiaUnica(c: Record<string, string>, valorContrato: number): FilaGarantia[] {
  return AMPAROS.map((a) => {
    const pct = num(c[`gu_${a.id}_pct`]);
    return { id: a.id, etiqueta: a.etiqueta, porcentaje: tiene(pct) ? pct : null, valorCOP: tiene(pct) && valorContrato > 0 ? Math.round(valorContrato * pct / 100) : null, vigencia: c[`gu_${a.id}_vig`] || '' };
  });
}

export interface ResultadoActa { bruto: number; amortizacion: number; estampillas: number; contribucion: number; neto: number }
export function calcularActa(a: ActaPago, c: Record<string, string>): ResultadoActa {
  const ant = Math.min(Math.max(num(c.fc_anticipo) || 0, 0), 100) / 100;
  const amortizacion = a.bruto * ant;
  const estampillas = a.bruto * ((num(c.o_est) || 0) / 100);
  const contribucion = a.bruto * ((num(c.o_contr) || 0) / 100);
  return { bruto: a.bruto, amortizacion, estampillas, contribucion, neto: a.bruto - amortizacion - estampillas - contribucion };
}

export function evaluarAdicion(valorInicial: number, anio: number, adicion: number): { smmlvInicial: number; smmlvAdicion: number; pct: number; ok: boolean; maximoCOP: number } | null {
  if (!(valorInicial > 0) || !(adicion >= 0)) return null;
  const smmlv = smmlvDelAnio(anio || new Date().getFullYear());
  const pct = (adicion / valorInicial) * 100;
  return { smmlvInicial: valorInicial / smmlv, smmlvAdicion: adicion / smmlv, pct, ok: pct <= 50, maximoCOP: valorInicial * 0.5 };
}

export function calcularMulta(valor: number, pctDiario: number, dias: number, topePct: number): { multa: number; tope: number; aplicaTope: boolean } | null {
  if (!(valor > 0) || !tiene(pctDiario) || !tiene(dias)) return null;
  const bruta = valor * (pctDiario / 100) * dias;
  const tope = tiene(topePct) && topePct > 0 ? valor * (topePct / 100) : Infinity;
  return { multa: Math.min(bruta, tope), tope: tope === Infinity ? 0 : tope, aplicaTope: bruta > tope };
}

export const ARGUMENTOS_DEFENSA: { id: string; etiqueta: string; texto: string }[] = [
  { id: 'def_fm', etiqueta: 'Fuerza mayor o caso fortuito', texto: 'El retraso obedeció a hechos imprevisibles e irresistibles ajenos a la voluntad del contratista, debidamente informados a la supervisión.' },
  { id: 'def_ent', etiqueta: 'Incumplimiento o demora de la entidad', texto: 'La demora se originó en la falta de entrega oportuna de predios, permisos, diseños o pagos a cargo de la entidad.' },
  { id: 'def_ter', etiqueta: 'Hecho de un tercero', texto: 'La ejecución se afectó por la actuación de un tercero que el contratista no podía controlar.' },
  { id: 'def_par', etiqueta: 'Cumplimiento ya subsanado', texto: 'La obligación señalada ya fue cumplida y se allegan los soportes correspondientes.' },
  { id: 'def_des', etiqueta: 'Desproporción de la sanción', texto: 'La sanción pretendida no guarda proporción con el perjuicio real ni con el grado de incumplimiento.' }
];

export function redactarDescargos(d: DatosVendo): string {
  const c = d.campos;
  const sel = ARGUMENTOS_DEFENSA.filter((x) => d.observaciones[x.id]);
  if (sel.length === 0 && !(c.x_hechos || '').trim()) return '';
  return `Señores\n${c.p_entidad || '[ENTIDAD]'}\n\nRef.: Contrato ${c.x_contrato || '[N.º DEL CONTRATO]'} — Descargos en el procedimiento del artículo 86 de la Ley 1474 de 2011\n\n${c.q_razon || '[RAZÓN SOCIAL]'}, contratista, rinde sus descargos frente a la citación a audiencia y solicita se tengan en cuenta los siguientes argumentos.\n\nHechos:\n${(c.x_hechos || '').trim() || '[DESCRIBE LOS HECHOS CON FECHAS Y SOPORTES]'}\n\nArgumentos:\n${sel.length ? sel.map((x, i) => `${i + 1}. ${x.texto}`).join('\n') : '[SELECCIONA LOS ARGUMENTOS QUE APLIQUEN]'}\n\nPruebas: solicitamos tener como tales los documentos que se anexan y practicar las demás que se consideren pertinentes.\n\nSolicitud: abstenerse de imponer la sanción o, en subsidio, graduarla conforme a los principios de proporcionalidad y debido proceso.\n\nCordialmente,\n\n${c.q_rep || '[REPRESENTANTE LEGAL]'}\n${c.q_razon || '[RAZÓN SOCIAL]'}`;
}

export function sumarMeses(iso: string, meses: number): string {
  const [y, m, dd] = iso.split('-').map(Number);
  if (!y || !m || !dd) return '';
  const f = new Date(y, m - 1 + meses, 1);
  const ultimo = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate();
  f.setDate(Math.min(dd, ultimo));
  return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
}

/** Plazo supletivo de liquidación: 4 meses para la bilateral tras la terminación y 2 meses más para la unilateral (Art. 11 Ley 1150 de 2007; confirma lo que diga tu contrato). */
export const plazosLiquidacion = (terminacion: string) => ({ bilateralHasta: sumarMeses(terminacion, 4), unilateralHasta: sumarMeses(terminacion, 6) });

export const LISTA_CONTRATO: CasillaSobre[] = [
  { id: 'k_fir', t: 'Firmaste el contrato electrónico dentro del plazo' },
  { id: 'k_gar', t: 'La garantía única fue entregada y aprobada por la entidad' },
  { id: 'k_arl', t: 'Afiliaste al personal a ARL, salud y pensión' },
  { id: 'k_rp', t: 'La entidad expidió el registro presupuestal' },
  { id: 'k_plan', t: 'Entregaste el plan de trabajo y el cronograma' },
  { id: 'k_acta', t: 'Se suscribió el Acta de Inicio' }
];
export const LISTA_LIQUIDACION: CasillaSobre[] = [
  { id: 'l_rec', t: 'Acta de recibo final a satisfacción firmada por el supervisor' },
  { id: 'l_ss', t: 'Aportes a seguridad social y parafiscales al día hasta el final' },
  { id: 'l_bal', t: 'Balance financiero (pagos, anticipo amortizado y saldos) conciliado' },
  { id: 'l_gar', t: 'Garantías de estabilidad y calidad vigentes y entregadas' },
  { id: 'l_sal', t: 'Salvedades que quieres dejar registradas, sustentadas por escrito' }
];

// ================= Perfil del aliado que necesitas (sin sugerir empresas: el operador las busca) =================
export interface NecesidadAliado { id: string; etiqueta: string; detalle: string; criterio: string }
export interface PerfilAliado { necesidades: NecesidadAliado[]; dondeBuscar: string[]; verificar: string[]; ficha: string }

export function perfilAliado(d: DatosVendo): PerfilAliado {
  const c = d.campos;
  const reqs = evaluarRequisitos(d);
  const necesidades: NecesidadAliado[] = [];
  const unspsc = codigosExigidos(c.r_unspsc).join(', ');
  for (const r of reqs.filter((x) => x.estado === 'NO_CUMPLE')) {
    let criterio = '';
    if (r.id === 'exp') {
      const propia = experiencia(d.contratos, codigosExigidos(c.r_unspsc)).aplicanSMMLV;
      const falta = Math.max(0, num(c.r_exp) - propia);
      criterio = `Experiencia de al menos ${falta.toLocaleString('es-CO', { maximumFractionDigits: 1 })} SMMLV${unspsc ? ` en los códigos UNSPSC ${unspsc}` : ''}, inscrita en el RUP.`;
    } else if (r.id === 'nexp') criterio = `Contratos terminados que completen el número que pide el pliego (${fmt(num(c.r_nexp), 0)}).`;
    else if (r.id === 'liq') criterio = `Índice de liquidez de ${fmt(num(c.r_liq))} o más (el consolidado se pondera por participación: confirma cómo lo mide el pliego).`;
    else if (r.id === 'end') criterio = `Nivel de endeudamiento de ${fmt(num(c.r_end), 1)} % o menos.`;
    else if (r.id === 'cob') criterio = `Cobertura de intereses de ${fmt(num(c.r_cob))} o más.`;
    else if (r.id === 'ct') criterio = `Capital de trabajo suficiente para completar los $ ${Math.round(num(c.r_ctr)).toLocaleString('es-CO')} exigidos.`;
    else if (r.id === 'k') {
      const k = capacidadResidual(c);
      const falta = k ? Math.max(0, num(c.r_k) - k.crSMMLV) : num(c.r_k);
      criterio = `Capacidad residual de al menos ${falta.toLocaleString('es-CO', { maximumFractionDigits: 1 })} SMMLV libres para este contrato.`;
    }
    necesidades.push({ id: r.id, etiqueta: r.etiqueta, detalle: r.detalle, criterio });
  }
  const dondeBuscar = [
    'Tu propia red: proveedores, subcontratistas y socios de contratos anteriores.',
    'Consulta pública del RUP y del certificado de existencia en el RUES o la Cámara de Comercio.',
    'SECOP II: contratos terminados con los mismos códigos UNSPSC y entidades parecidas, para ver quién ya ejecutó algo similar.',
    'Gremios del sector y Cámaras de Comercio de la región, que organizan encuentros de aliados.',
    'La lista de interesados o la audiencia de aclaraciones del propio proceso.'
  ];
  const verificar = [
    'Que no sea competidor directo con capacidad plena para ofertar solo (alianza procompetitiva).',
    'RUP vigente y renovado; experiencia verificable en el RUP o con certificaciones.',
    'Antecedentes fiscales, disciplinarios y judiciales del aliado y su representante.',
    'Que no tenga inhabilidades ni conflictos de interés frente a la entidad contratante.',
    'Que no esté sancionado ni tenga multas vigentes.',
    'Que aporte lo que dice: evita aliados cuya experiencia no se pueda acreditar.'
  ];
  const ficha = necesidades.length === 0 ? '' : `FICHA DE BÚSQUEDA DE ALIADO\nProceso: ${c.p_numero || '[N.º]'} · ${c.p_entidad || '[Entidad]'}\nObjeto: ${c.p_objeto || '[Objeto]'}\nProponente: ${c.q_razon || '[Razón social]'}\n\nLo que necesito de un aliado:\n${necesidades.map((n, i) => `${i + 1}. ${n.criterio}`).join('\n')}\n\nCondiciones: alianza procompetitiva; RUP vigente; sin inhabilidades; documentación verificable.`;
  return { necesidades, dondeBuscar, verificar, ficha };
}
