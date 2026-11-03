// Ruta «Vendo»: el flujo paso a paso del licitante y contratista. Misma filosofía que «Compro»: una pregunta a la vez,
// cálculos de fondo, autoguardado en «Mis expedientes».
import { LineaTiempoVendo } from './LineaTiempoVendo';
import { BuscadorOportunidades } from './BuscadorOportunidades';
import type { Oportunidad } from '../../core/domain/oportunidades';
import { construirLineaTiempo } from '../../core/engines/LineaTiempoVendo';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Copy, Plus, Trash2, CalendarDays, Search } from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import type { Expediente } from '../../core/domain/expedientes';
import {
  DATOS_VENDO_INICIALES, FASES_VENDO, TITULOS_VENDO, TOTAL_PASOS_VENDO, etiquetaPasoVendo,
  type DatosVendo, type Tri, type AsignacionRiesgo
} from '../../core/domain/vendo';
import {
  num, indicadores, experiencia, codigosExigidos, smmlvDeContrato, capacidadResidual, evaluarRequisitos, estadoLista,
  decisionGoNoGo, validarAlianza, experienciaPlural, RIESGOS_TIPICOS, CATALOGO_OBSERVACIONES, redactarObservaciones,
  costoUnitario, costoPartida, costoDirectoTotal, calcularOferta, flujoCaja, METODOS_ECONOMICOS, simularEscenarios,
  LISTA_PERSONAL, LISTA_SOBRE1, LISTA_GARANTIA, LISTA_CIERRE,
  perfilAliado, CATALOGO_SUBSANACION, redactarSubsanacion, garantiaUnica, calcularActa, evaluarAdicion, calcularMulta,
  ARGUMENTOS_DEFENSA, redactarDescargos, plazosLiquidacion, LISTA_CONTRATO, LISTA_LIQUIDACION
} from '../../core/engines/VendoEngine';
import { descargarPropuesta } from '../../core/engines/PropuestaVendoDocx';
import type { MetodoCalificacionEconomica } from '../../core/engines/ScoringFormulasEngine';
import { TerminosProcesalesEngine, esFechaValida } from '../../core/engines/TerminosProcesalesEngine';
import { sugerirPlataforma } from '../../core/engines/PlatformRouterEngine';
import { PLATAFORMAS } from '../../core/domain/plataformas';
import { abrirHerramienta, abrirPlataforma } from '../../core/domain/herramientas';
import { ConsortiumEngine } from '../../core/engines/ConsortiumEngine';
import type { AsociacionPlural, MiembroAsociacion } from '../../core/domain/types';

const LISTA_HABIL = [
  { id: 'h_rut', t: 'RUT actualizado, con la actividad económica del objeto' },
  { id: 'h_camara', t: 'Certificado de existencia y representación legal vigente (con la antigüedad que pida el pliego)' },
  { id: 'h_rup', t: 'RUP vigente y en firme (se renueva a más tardar el quinto día hábil de abril; algunos procesos, como la mínima cuantía, no lo exigen)' },
  { id: 'h_cod', t: 'Inscrito en los códigos UNSPSC del objeto' },
  { id: 'h_plat', t: 'Usuario registrado y habilitado en la plataforma del proceso' },
  { id: 'h_firma', t: 'Credenciales y firma electrónica del representante legal operativas' }
];
const LISTA_ANTEC = [
  { id: 'a_proc', t: 'Sin sanciones disciplinarias vigentes que inhabiliten (Procuraduría)' },
  { id: 'a_contr', t: 'No figuras en el Boletín de Responsables Fiscales (Contraloría)' },
  { id: 'a_pol', t: 'Sin antecedentes judiciales del representante legal' },
  { id: 'a_rnmc', t: 'Sin medidas correctivas pendientes (Registro Nacional de Medidas Correctivas)' },
  { id: 'a_inh', t: 'No incurres en inhabilidades ni incompatibilidades (Art. 8 Ley 80 de 1993 y normas concordantes)' },
  { id: 'a_mul', t: 'Sin inhabilidad por incumplimiento reiterado de contratos (Art. 90 Ley 1474 de 2011)' },
  { id: 'a_conf', t: 'Sin conflicto de interés con funcionarios de la entidad contratante' }
];
const LISTA_JUR = [
  { id: 'j_fac', t: 'El representante legal está facultado para ofertar y contratar por el valor del proceso' },
  { id: 'j_jun', t: 'Tienes la autorización del órgano social si el monto la exige' },
  { id: 'j_dur', t: 'La duración de la sociedad cubre el plazo del contrato y un año más (lo piden muchos pliegos)' },
  { id: 'j_obj', t: 'El objeto social permite ejecutar el objeto del contrato' },
  { id: 'j_par', t: 'Estás al día en seguridad social y parafiscales (Art. 50 Ley 789 de 2002; certifica el revisor fiscal o, si no está obligado, el representante legal — Art. 23 Ley 1150 de 2007)' }
];
const IDS = (l: { id: string }[]) => l.map((x) => x.id);

const fmtCOP = (n: number) => `$ ${Math.round(n).toLocaleString('es-CO')}`;
const fmtN = (n: number, d = 2) => n.toLocaleString('es-CO', { maximumFractionDigits: d });
const nuevoId = () => Math.random().toString(36).slice(2, 9);

// ---- piezas de interfaz ----
const Campo: React.FC<{ et: string; v: string; on: (v: string) => void; ph?: string; cop?: boolean; tipo?: string; ancho?: boolean }> = ({ et, v, on, ph, cop, tipo, ancho }) => (
  <label className={`block space-y-1 ${ancho ? 'sm:col-span-2' : ''}`}>
    <span className="text-[11px] font-semibold text-slate-600">{et}</span>
    <input
      type={tipo || 'text'}
      inputMode={cop ? 'numeric' : undefined}
      value={cop && v ? Number(v.replace(/\D/g, '') || 0).toLocaleString('es-CO') : v}
      placeholder={ph}
      onChange={(e) => on(cop ? e.target.value.replace(/\D/g, '') : e.target.value)}
      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-slate-900"
    />
  </label>
);

const Tri3: React.FC<{ v?: Tri; on: (v: Tri) => void; id: string }> = ({ v, on, id }) => (
  <div className="flex gap-1 shrink-0" role="group" aria-label={id}>
    {([['SI', 'Sí'], ['NO', 'No'], ['PEND', 'Aún no']] as const).map(([k, t]) => (
      <button
        key={k}
        type="button"
        data-check={`${id}:${k}`}
        aria-pressed={v === k}
        onClick={() => on(k)}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${v === k ? (k === 'SI' ? 'bg-emerald-600 border-emerald-600 text-white' : k === 'NO' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-slate-700 border-slate-700 text-white') : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
      >
        {t}
      </button>
    ))}
  </div>
);

const Chip: React.FC<{ estado: 'EN_REGLA' | 'SUBSANAR' | 'PENDIENTE' | 'CUMPLE' | 'NO_CUMPLE' | 'FALTA' }> = ({ estado }) => {
  const m = {
    EN_REGLA: ['En regla', 'bg-emerald-100 text-emerald-800'], CUMPLE: ['Cumple', 'bg-emerald-100 text-emerald-800'],
    SUBSANAR: ['Requiere subsanación', 'bg-rose-100 text-rose-800'], NO_CUMPLE: ['No cumple', 'bg-rose-100 text-rose-800'],
    PENDIENTE: ['Pendiente', 'bg-slate-100 text-slate-600'], FALTA: ['Falta dato', 'bg-slate-100 text-slate-600']
  }[estado];
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${m[1]}`}>{m[0]}</span>;
};

const Titulo: React.FC<{ t: string; s?: string }> = ({ t, s }) => (
  <div className="space-y-1">
    <h2 className="text-2xl font-black text-slate-900 font-display">{t}</h2>
    {s && <p className="text-xs text-slate-500 leading-snug">{s}</p>}
  </div>
);

export const VendoFlowView: React.FC<{ expedienteInicial: Expediente | null; onCambiarRol: () => void }> = ({ expedienteInicial, onCambiarRol }) => {
  const [d, setD] = useState<DatosVendo>(() => {
    const v = expedienteInicial?.estado?.vendo as Partial<DatosVendo> | undefined;
    if (!v || typeof v !== 'object') return DATOS_VENDO_INICIALES;
    return {
      ...DATOS_VENDO_INICIALES, ...v,
      paso: Math.min(TOTAL_PASOS_VENDO, Math.max(2, Number(v.paso) || 2)),
      checks: { ...(v.checks || {}) }, campos: { ...(v.campos || {}) }, riesgos: { ...(v.riesgos || {}) }, observaciones: { ...(v.observaciones || {}) },
      partidas: Array.isArray(v.partidas) ? v.partidas : [], actas: Array.isArray(v.actas) ? v.actas : [], contratos: Array.isArray(v.contratos) ? v.contratos : [], miembros: Array.isArray(v.miembros) ? v.miembros : []
    };
  });
  const c = d.campos;
  const setCampo = (k: string, v: string) => setD((p) => ({ ...p, campos: { ...p.campos, [k]: v } }));
  const setCheck = (k: string, v: Tri) => setD((p) => ({ ...p, checks: { ...p.checks, [k]: v } }));
  const ir = (paso: number) => { setD((p) => ({ ...p, paso })); window.scrollTo?.({ top: 0 }); };
  const paso = d.paso;
  const fase = FASES_VENDO.find((f) => paso >= f.desde && paso <= f.hasta) ?? FASES_VENDO[0];

  // ---- persistencia en «Mis expedientes» (misma mecánica que «Compro») ----
  const dRef = useRef(d); dRef.current = d;
  const idRef = useRef<string | null>(expedienteInicial?.id ?? null);
  const ultimaRef = useRef<string>(expedienteInicial ? JSON.stringify(expedienteInicial.estado) : '');
  const sucioRef = useRef(false);
  const persistirAhora = (permitirCrear: boolean) => {
    const cur = dRef.current;
    const k = cur.campos;
    const tieneDatos = !!(k.q_razon?.trim() || k.p_objeto?.trim() || k.p_entidad?.trim() || cur.contratos.length);
    if (!tieneDatos) return;
    const estado = { tipoOperacion: 'VENDO', paso: cur.paso, vendo: cur };
    const ser = JSON.stringify(estado);
    if (ser === ultimaRef.current) { sucioRef.current = false; return; }
    if (!idRef.current && !permitirCrear) return;
    const r = useProcurementStore.getState().guardarExpediente({
      objeto: k.p_objeto?.trim() || (k.q_razon?.trim() ? `Propuesta de ${k.q_razon.trim()}` : 'Propuesta sin proceso definido'),
      entidad: k.p_entidad ?? '', presupuestoCOP: num(k.p_presupuesto) || 0, modalidad: k.p_modalidad ?? '',
      tipoOperacion: 'VENDO', paso: cur.paso, etiquetaPaso: etiquetaPasoVendo(cur.paso), liquidado: false, estado
    }, idRef.current);
    if (r) { idRef.current = r; ultimaRef.current = ser; }
    sucioRef.current = false;
  };
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) { primera.current = false; if (expedienteInicial) return; }
    sucioRef.current = true;
    const t = window.setTimeout(() => persistirAhora(true), 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);
  useEffect(() => {
    const alCerrar = () => { if (sucioRef.current) persistirAhora(true); };
    const alSolicitar = () => persistirAhora(true);
    window.addEventListener('pagehide', alCerrar);
    window.addEventListener('procuresim:guardar-expediente', alSolicitar);
    return () => {
      window.removeEventListener('pagehide', alCerrar);
      window.removeEventListener('procuresim:guardar-expediente', alSolicitar);
      if (sucioRef.current) persistirAhora(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- cálculos de fondo ----
  const ind = useMemo(() => indicadores(c), [c]);
  const exigidos = codigosExigidos(c.r_unspsc);
  const exp = useMemo(() => experiencia(d.contratos, exigidos), [d.contratos, c.r_unspsc]); // eslint-disable-line react-hooks/exhaustive-deps
  const cr = useMemo(() => capacidadResidual(c), [c]);
  const reqs = useMemo(() => evaluarRequisitos(d), [d]);
  const listas = { habil: IDS(LISTA_HABIL), antec: IDS(LISTA_ANTEC), jur: IDS(LISTA_JUR) };
  const reco = useMemo(() => decisionGoNoGo(d, listas), [d]); // eslint-disable-line react-hooks/exhaustive-deps
  const [copiado, setCopiado] = useState(false);
  const factor = num(c.o_factor) || 1;
  const oferta = useMemo(() => calcularOferta(d), [d]);
  const flujo = useMemo(() => flujoCaja(d), [d]);
  const metodo = (c.e_metodo as MetodoCalificacionEconomica) || 'MEDIA_ARITMETICA_SIMPLE';
  const precioPropio = num(c.e_precio) > 0 ? num(c.e_precio) : oferta?.total ?? 0;
  const esc = useMemo(() => simularEscenarios(d, metodo, precioPropio), [d, metodo, precioPropio]);
  const setPartida = (id: string, k: string, v: string | number) => setD((p) => ({ ...p, partidas: p.partidas.map((x) => (x.id === id ? { ...x, [k]: v } : x)) }));
  const conteo = (items: { id: string }[]) => items.filter((x) => d.checks[x.id] === 'SI').length;
  const [bajando, setBajando] = useState(false);
  const [verLinea, setVerLinea] = useState(false);
  const [verBuscador, setVerBuscador] = useState(false);
  const usarOportunidad = (o: Oportunidad) => {
    const modalidad = /licitaci/i.test(o.modalidad) ? 'Licitación pública' : /subasta/i.test(o.modalidad) ? 'Selección abreviada por subasta inversa' : /abreviada/i.test(o.modalidad) ? 'Selección abreviada de menor cuantía' : /concurso/i.test(o.modalidad) ? 'Concurso de méritos' : /m[ií]nima/i.test(o.modalidad) ? 'Mínima cuantía' : '';
    setD((p) => ({ ...p, campos: { ...p.campos, p_numero: o.referencia || o.id, p_entidad: o.entidad, p_objeto: o.objeto, ...(o.valor > 0 ? { p_presupuesto: String(Math.round(o.valor)) } : {}), ...(modalidad ? { p_modalidad: modalidad } : {}), ...(o.codigo && !p.campos.r_unspsc ? { r_unspsc: o.codigo.replace(/\D/g, '') } : {}), p_enlace: o.enlace, t_publicacion: o.publicada || '', t_cierre: o.cierre || '' } }));
    setVerBuscador(false); ir(8);
  };
  const perfil = perfilAliado(d);
  const idAsoc = c.asoc_id || '';
  const firmaMiembros = (tipo: string, ms: { id: string; razonSocial: string; nit: string; porcentaje: number; experienciaSMMLV: number; esLider: boolean; actividades: string }[]) => JSON.stringify([tipo, ms.map((m) => [m.id, m.razonSocial, m.nit, m.porcentaje, m.experienciaSMMLV, m.esLider, m.actividades])]);
  const ultimaFirmaAsoc = useRef('');
  const abrirGestor = () => {
    const id = idAsoc || `VENDO-${nuevoId()}`;
    if (!idAsoc) setCampo('asoc_id', id);
    const st = useProcurementStore.getState();
    const previa = st.asociaciones.find((a) => a.id === id);
    const tipo = d.tipoAlianza === 'UNION_TEMPORAL' ? 'UNION_TEMPORAL' : 'CONSORCIO';
    const miembros: MiembroAsociacion[] = d.miembros.map((m) => {
      const ex = previa?.miembros.find((x) => x.id === m.id);
      return {
        id: m.id, razonSocial: m.razonSocial, nit: m.nit, representanteLegal: ex?.representanteLegal ?? (m.esLider ? c.q_rep || '' : ''), cedulaRepresentante: ex?.cedulaRepresentante ?? '',
        porcentajeParticipacion: m.porcentaje, compromisoObligaciones: m.actividades, aportesFinancierosCOP: ex?.aportesFinancierosCOP ?? 0, experienciaAportadaSMMLV: m.experienciaSMMLV, esLider: m.esLider,
        activoCorriente: ex?.activoCorriente ?? 0, pasivoCorriente: ex?.pasivoCorriente ?? 0, activoTotal: ex?.activoTotal ?? 0, pasivoTotal: ex?.pasivoTotal ?? 0, patrimonio: ex?.patrimonio ?? 0
      } as MiembroAsociacion;
    });
    const cons = ConsortiumEngine.calcularConsolidacion(miembros);
    const lider = d.miembros.find((m) => m.esLider);
    const a: AsociacionPlural = {
      id, tipo, nombreAsociacion: previa?.nombreAsociacion || `${tipo === 'UNION_TEMPORAL' ? 'Unión Temporal' : 'Consorcio'} ${c.p_numero || ''}`.trim(),
      objetoLicitacion: c.p_objeto || previa?.objetoLicitacion || '', representanteDesignado: previa?.representanteDesignado || (lider && lider.razonSocial === c.q_razon ? c.q_rep || '' : ''),
      cedulaRepresentante: previa?.cedulaRepresentante || '', direccionSede: previa?.direccionSede || '', ciudad: previa?.ciudad || 'Neiva', emailNotificacion: previa?.emailNotificacion || '', telefono: previa?.telefono || '',
      miembros, porcentajeTotal: cons.porcentajeTotal, esValido100Pct: cons.esValido100Pct, indicadoresPonderados: cons.indicadoresPonderados, documentosGenerados: previa?.documentosGenerados || []
    };
    ultimaFirmaAsoc.current = firmaMiembros(a.tipo, d.miembros);
    useProcurementStore.setState({ asociaciones: [a, ...st.asociaciones.filter((x) => x.id !== id)] });
    abrirHerramienta('CONSORCIOS');
  };
  const asociaciones = useProcurementStore((st) => st.asociaciones);
  useEffect(() => {
    if (!idAsoc) return;
    const a = asociaciones.find((x) => x.id === idAsoc);
    if (!a) return;
    const nuevos = a.miembros.map((m) => ({ id: m.id, razonSocial: m.razonSocial, nit: m.nit, porcentaje: m.porcentajeParticipacion, experienciaSMMLV: m.experienciaAportadaSMMLV, esLider: m.esLider, actividades: m.compromisoObligaciones }));
    const tipoV = a.tipo === 'UNION_TEMPORAL' ? 'UNION_TEMPORAL' : 'CONSORCIO';
    const firma = firmaMiembros(tipoV, nuevos);
    if (firma === ultimaFirmaAsoc.current) return;
    ultimaFirmaAsoc.current = firma;
    setD((p) => ({ ...p, tipoAlianza: tipoV, miembros: nuevos }));
  }, [asociaciones, idAsoc]);
  const linea = construirLineaTiempo(c, d.actas);
  const siguiente = linea.hitos.find((h) => h.proximo);
  const alarmasT = TerminosProcesalesEngine.calcularAlarmas({ publicacionPrepliego: c.t_prepliego, cierre: c.t_cierre, publicacionInforme: c.t_informe, adjudicacion: c.t_adjud });
  const subsanacionTxt = redactarSubsanacion(d);
  const valorContrato = num(c.k_valor) > 0 ? num(c.k_valor) : oferta?.total ?? 0;
  const garantias = garantiaUnica(c, valorContrato);
  const setActa = (id: string, k: string, v: string | number) => setD((p) => ({ ...p, actas: p.actas.map((x) => (x.id === id ? { ...x, [k]: v } : x)) }));
  const adicion = evaluarAdicion(num(c.x_valor) > 0 ? num(c.x_valor) : valorContrato, num(c.x_anio), num(c.x_adicion) || 0);
  const multa = calcularMulta(valorContrato, num(c.x_mpct), num(c.x_dias), num(c.x_tope));
  const descargosTxt = redactarDescargos(d);
  const liq = esFechaValida(c.l_term) ? plazosLiquidacion(c.l_term) : null;
  const copia = (t: string) => (
    <div className="space-y-2">
      <pre data-borrador className="whitespace-pre-wrap text-xs text-slate-800 font-sans leading-relaxed p-4 rounded-2xl border border-slate-200 bg-slate-50">{t}</pre>
      <button onClick={() => copiar(t)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer"><Copy className="w-3.5 h-3.5" /> {copiado ? 'Copiado' : 'Copiar texto'}</button>
      <p className="text-[10px] text-slate-400">Es un borrador: ajústalo al caso real y radícalo por la plataforma o el canal oficial dentro del plazo.</p>
    </div>
  );

  const Nav: React.FC<{ sig?: boolean }> = ({ sig = true }) => (
    <div className="pt-4 flex items-center justify-between gap-3">
      <button onClick={() => (paso <= 2 ? onCambiarRol() : ir(paso - 1))} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> {paso <= 2 ? 'Cambiar de rol' : 'Atrás'}
      </button>
      {sig && paso < 28 && (
        <button onClick={() => ir(paso + 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black cursor-pointer hover:bg-slate-800">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const lista = (items: { id: string; t: string }[]) => (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.id} className="flex items-start justify-between gap-3 p-3 rounded-2xl border border-slate-200">
          <span className="text-xs text-slate-700 leading-snug">{it.t}</span>
          <Tri3 id={it.id} v={d.checks[it.id]} on={(v) => setCheck(it.id, v)} />
        </div>
      ))}
    </div>
  );
  const resultadoLista = (ids: string[]) => {
    const e = estadoLista(d.checks, ids);
    return (
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Chip estado={e} />
        {e === 'SUBSANAR' && <span>Lo que respondiste «No» debe subsanarse antes del cierre.</span>}
        {e === 'PENDIENTE' && <span>Responde cada punto para saber si estás en regla.</span>}
        {e === 'EN_REGLA' && <span>Todo en orden.</span>}
      </div>
    );
  };

  const alarmas = TerminosProcesalesEngine.calcularAlarmas({ publicacionPrepliego: c.t_prepliego, cierre: c.t_cierre, publicacionInforme: c.t_informe });
  const sug = sugerirPlataforma({ nombreEntidad: c.p_entidad, regimen: 'LEY_80', modalidad: c.p_modalidad });
  const observacionesTxt = redactarObservaciones(d);
  const copiar = async (t: string) => {
    try { await navigator.clipboard.writeText(t); } catch { /* sin portapapeles */ }
    setCopiado(true); window.setTimeout(() => setCopiado(false), 1800);
  };
  const setContrato = (id: string, k: string, v: string | number) => setD((p) => ({ ...p, contratos: p.contratos.map((x) => (x.id === id ? { ...x, [k]: v } : x)) }));
  const setMiembro = (id: string, k: string, v: string | number | boolean) => setD((p) => ({ ...p, miembros: p.miembros.map((x) => (x.id === id ? { ...x, [k]: v } : x)) }));
  const expPlural = experienciaPlural(d.miembros);
  const reqsConAlianza = evaluarRequisitos(d, { experienciaPluralSMMLV: expPlural });
  const avisosAlianza = validarAlianza(d.miembros, d.tipoAlianza);

  const cuerpo = (() => {
    switch (paso) {
      case 2:
        return (
          <div className="space-y-5">
            <Titulo t="¿Quién se postula?" s="Identifica a quien presenta la propuesta." />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([['NATURAL', 'Persona natural'], ['JURIDICA', 'Persona jurídica'], ['PLURAL', 'Consorcio o unión temporal']] as const).map(([k, t]) => (
                <button key={k} data-quien={k} aria-pressed={c.q_tipo === k} onClick={() => setCampo('q_tipo', k)} className={`p-3 rounded-2xl border text-xs font-bold text-left cursor-pointer ${c.q_tipo === k ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}>{t}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Campo et="Razón social o nombre" v={c.q_razon || ''} on={(v) => setCampo('q_razon', v)} ph="Ej: Constructora Ejemplo S.A.S." ancho />
              <Campo et="NIT o documento" v={c.q_nit || ''} on={(v) => setCampo('q_nit', v)} />
              <Campo et="Representante legal" v={c.q_rep || ''} on={(v) => setCampo('q_rep', v)} />
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Tamaño empresarial</span>
                <select value={c.q_tam || ''} onChange={(e) => setCampo('q_tam', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                  <option value="">Elige…</option><option value="MIPYME">Micro, pequeña o mediana (Mipyme)</option><option value="GRANDE">Gran empresa</option>
                </select>
              </label>
              <Campo et="Año de constitución" v={c.q_anio || ''} on={(v) => setCampo('q_anio', v.replace(/\D/g, '').slice(0, 4))} />
            </div>
            <Nav />
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <Titulo t="Habilitación de la empresa" s="Lo que debe estar listo antes de mirar cualquier proceso." />
            {lista(LISTA_HABIL)}
            {resultadoLista(listas.habil)}
            <Nav />
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <Titulo t="Antecedentes e inhabilidades" s="Una inhabilidad no se corrige con una alianza: verifícalas primero." />
            {lista(LISTA_ANTEC)}
            {resultadoLista(listas.antec)}
            <Nav />
          </div>
        );
      case 5:
        return (
          <div className="space-y-5">
            <Titulo t="Capacidad jurídica" />
            {lista(LISTA_JUR)}
            {resultadoLista(listas.jur)}
            <Nav />
          </div>
        );
      case 6:
        return (
          <div className="space-y-5">
            <Titulo t="Tu experiencia" s="Registra los contratos que puedes acreditar. Usa el año que indique tu pliego para convertir a SMMLV (suele ser el de terminación)." />
            <div className="space-y-3">
              {d.contratos.map((k) => (
                <div key={k.id} data-contrato={k.id} className="p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Campo et="Objeto del contrato" v={k.objeto} on={(v) => setContrato(k.id, 'objeto', v)} ancho />
                    <Campo et="Contratante" v={k.cliente} on={(v) => setContrato(k.id, 'cliente', v)} />
                    <Campo et="Valor (COP)" cop v={k.valorCOP ? String(k.valorCOP) : ''} on={(v) => setContrato(k.id, 'valorCOP', Number(v) || 0)} />
                    <Campo et="Año de conversión" v={k.anio ? String(k.anio) : ''} on={(v) => setContrato(k.id, 'anio', Number(v.replace(/\D/g, '').slice(0, 4)) || 0)} />
                    <Campo et="Código UNSPSC (6 dígitos)" v={k.unspsc} on={(v) => setContrato(k.id, 'unspsc', v)} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{k.valorCOP > 0 ? `${fmtN(smmlvDeContrato(k), 1)} SMMLV` : 'Registra el valor'}</span>
                    <button aria-label="Quitar contrato" onClick={() => setD((p) => ({ ...p, contratos: p.contratos.filter((x) => x.id !== k.id) }))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <button onClick={() => setD((p) => ({ ...p, contratos: [...p.contratos, { id: nuevoId(), objeto: '', cliente: '', valorCOP: 0, anio: new Date().getFullYear() - 1, unspsc: '' }] }))} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"><Plus className="w-4 h-4" /> Agregar contrato</button>
            </div>
            {d.contratos.length > 0 && <p data-total-exp className="text-xs font-bold text-slate-900">Total: {fmtN(exp.totalSMMLV, 1)} SMMLV en {d.contratos.length} contrato(s)</p>}
            <Nav />
          </div>
        );
      case 7:
        return (
          <div className="space-y-5">
            <Titulo t="Capacidad financiera y residual" s="Con tus estados financieros calculamos los indicadores; los umbrales los pone el pliego (paso 9)." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Campo et="Activo corriente" cop v={c.f_ac || ''} on={(v) => setCampo('f_ac', v)} />
              <Campo et="Pasivo corriente" cop v={c.f_pc || ''} on={(v) => setCampo('f_pc', v)} />
              <Campo et="Activo total" cop v={c.f_at || ''} on={(v) => setCampo('f_at', v)} />
              <Campo et="Pasivo total" cop v={c.f_pt || ''} on={(v) => setCampo('f_pt', v)} />
              <Campo et="Utilidad operacional" cop v={c.f_uo || ''} on={(v) => setCampo('f_uo', v)} />
              <Campo et="Gastos de intereses" cop v={c.f_gi || ''} on={(v) => setCampo('f_gi', v)} />
            </div>
            <div data-indicadores className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[['Liquidez', ind.liquidez === null ? '—' : fmtN(ind.liquidez)], ['Endeudamiento', ind.endeudamiento === null ? '—' : `${fmtN(ind.endeudamiento, 1)} %`], ['Cobertura de intereses', ind.coberturaSinIntereses ? 'Sin intereses' : ind.cobertura === null ? '—' : fmtN(ind.cobertura)], ['Capital de trabajo', ind.capitalTrabajoCOP === null ? '—' : fmtCOP(ind.capitalTrabajoCOP)]].map(([t, v]) => (
                <div key={t} className="p-3 rounded-2xl bg-slate-50 border border-slate-200"><span className="block text-[10px] text-slate-500">{t}</span><strong className="text-slate-900">{v}</strong></div>
              ))}
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <strong className="text-xs text-slate-900">Capacidad residual (solo obra pública)</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo et="Mayor ingreso operacional de los últimos 5 años (COP)" cop v={c.k_co || ''} on={(v) => setCampo('k_co', v)} />
                <Campo et="Saldo por ejecutar de contratos en curso (COP)" cop v={c.k_sce || ''} on={(v) => setCampo('k_sce', v)} />
                <Campo et="Puntos de experiencia (máx. 120)" v={c.k_e || ''} on={(v) => setCampo('k_e', v)} />
                <Campo et="Puntos de capacidad técnica (máx. 40)" v={c.k_ct || ''} on={(v) => setCampo('k_ct', v)} />
                <Campo et="Puntos de capacidad financiera (máx. 40)" v={c.k_cf || ''} on={(v) => setCampo('k_cf', v)} />
              </div>
              {cr && <p data-residual className="text-xs font-bold text-slate-900">Capacidad residual: {fmtCOP(cr.crCOP)} ({fmtN(cr.crSMMLV, 1)} SMMLV)</p>}
            </div>
            <Nav />
          </div>
        );
      case 8:
        return (
          <div className="space-y-5">
            <Titulo t="El proceso objetivo" s="¿A qué proceso vas a ofertar?" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Campo et="Número del proceso" v={c.p_numero || ''} on={(v) => setCampo('p_numero', v)} />
              <Campo et="Entidad compradora" v={c.p_entidad || ''} on={(v) => setCampo('p_entidad', v)} />
              <Campo et="Objeto" v={c.p_objeto || ''} on={(v) => setCampo('p_objeto', v)} ancho />
              <Campo et="Presupuesto oficial (COP)" cop v={c.p_presupuesto || ''} on={(v) => setCampo('p_presupuesto', v)} />
              <Campo et="Publicación del proceso" tipo="date" v={c.t_publicacion || ''} on={(v) => setCampo('t_publicacion', v)} />
              <Campo et="Cierre de ofertas" tipo="date" v={c.t_cierre || ''} on={(v) => setCampo('t_cierre', v)} />
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Modalidad</span>
                <select value={c.p_modalidad || ''} onChange={(e) => setCampo('p_modalidad', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                  <option value="">Elige…</option><option>Licitación pública</option><option>Selección abreviada de menor cuantía</option><option>Selección abreviada por subasta inversa</option><option>Acuerdo marco de precios</option><option>Concurso de méritos</option><option>Mínima cuantía</option><option>Contratación directa</option><option>Proceso de manual propio</option>
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Tipo de objeto</span>
                <select value={c.p_tipo || ''} onChange={(e) => setCampo('p_tipo', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                  <option value="">Elige…</option><option value="OBRA">Obra</option><option value="SUMINISTRO">Suministro</option><option value="SERVICIOS">Servicios</option><option value="CONSULTORIA">Consultoría</option>
                </select>
              </label>
            </div>
            {(c.p_entidad || c.p_modalidad) && (
              <div data-plataforma className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p>Plataforma probable: <strong>{PLATAFORMAS[sug.id].etiqueta}</strong>. La fija la entidad: confírmala en el aviso del proceso.</p>
                {PLATAFORMAS[sug.id].vista && <button onClick={() => abrirPlataforma(PLATAFORMAS[sug.id].vista!)} className="font-bold underline underline-offset-2 cursor-pointer">Ver cómo se ve en {PLATAFORMAS[sug.id].etiqueta.replace(/ \(.*\)/, '')}</button>}
              </div>
            )}
            <Nav />
          </div>
        );
      case 9:
        return (
          <div className="space-y-5">
            <Titulo t="Requisitos del pliego" s="Escribe lo que pide el pliego; lo comparamos con tu empresa. Deja en blanco lo que no se exija." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Campo et="Liquidez mínima" v={c.r_liq || ''} on={(v) => setCampo('r_liq', v)} />
              <Campo et="Endeudamiento máximo (%)" v={c.r_end || ''} on={(v) => setCampo('r_end', v)} />
              <Campo et="Cobertura de intereses mínima" v={c.r_cob || ''} on={(v) => setCampo('r_cob', v)} />
              <Campo et="Capital de trabajo mínimo (COP)" cop v={c.r_ctr || ''} on={(v) => setCampo('r_ctr', v)} />
              <Campo et="Experiencia mínima (SMMLV)" v={c.r_exp || ''} on={(v) => setCampo('r_exp', v)} />
              <Campo et="Número de contratos exigidos" v={c.r_nexp || ''} on={(v) => setCampo('r_nexp', v)} />
              <Campo et="Códigos UNSPSC exigidos (separados por coma)" v={c.r_unspsc || ''} on={(v) => setCampo('r_unspsc', v)} ancho />
              <Campo et="Capacidad residual mínima (SMMLV, obra)" v={c.r_k || ''} on={(v) => setCampo('r_k', v)} />
            </div>
            <div data-requisitos className="space-y-2">
              {reqs.length === 0 && <p className="text-xs text-slate-400">Cuando escribas un requisito aparecerá aquí su comparación.</p>}
              {reqs.map((r) => (
                <div key={r.id} data-req={r.id} data-estado={r.estado} className="flex items-start justify-between gap-3 p-3 rounded-2xl border border-slate-200">
                  <div><strong className="block text-xs text-slate-900">{r.etiqueta}</strong><span className="text-[11px] text-slate-500">{r.detalle}</span></div>
                  <Chip estado={r.estado} />
                </div>
              ))}
            </div>
            <Nav />
          </div>
        );
      case 10:
        return (
          <div className="space-y-5">
            <Titulo t="Cronograma y alarmas" s="Escribe las fechas del aviso; calculamos los términos en días hábiles de Colombia (con festivos)." />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Campo et="Publicación del proyecto de pliego" tipo="date" v={c.t_prepliego || ''} on={(v) => setCampo('t_prepliego', v)} />
              <Campo et="Cierre del proceso" tipo="date" v={c.t_cierre || ''} on={(v) => setCampo('t_cierre', v)} />
              <Campo et="Publicación del informe de evaluación" tipo="date" v={c.t_informe || ''} on={(v) => setCampo('t_informe', v)} />
            </div>
            <div data-alarmas className="space-y-2">
              {alarmas.filter((a) => a.fechaLimite && a.id !== 'SUSCRIPCION_CONTRATO').map((a) => (
                <div key={a.id} data-alarma={a.id} className="p-3 rounded-2xl border border-slate-200 text-xs space-y-0.5">
                  <strong className="block text-slate-900">{a.titulo}</strong>
                  <span className="block text-slate-500">{a.fechaLimite}</span>
                  <span className="block font-bold text-slate-900">{a.estado === 'VENCIDO' ? 'Término vencido' : `Faltan ${a.diasHabilesRestantes} día(s) hábil(es)`}</span>
                </div>
              ))}
            </div>
            <button onClick={() => abrirHerramienta('COMUNICACIONES')} className="text-xs font-bold text-slate-700 underline underline-offset-2 cursor-pointer">Abrir el centro de comunicaciones y alarmas</button>
            <Nav />
          </div>
        );
      case 11: {
        const yo = RIESGOS_TIPICOS.filter((r) => d.riesgos[r.id] === 'YO');
        const nose = RIESGOS_TIPICOS.filter((r) => !d.riesgos[r.id] || d.riesgos[r.id] === 'NOSE');
        return (
          <div className="space-y-5">
            <Titulo t="Riesgos del contrato" s="Según la matriz de riesgos del pliego, ¿quién asume cada uno?" />
            <div className="space-y-2">
              {RIESGOS_TIPICOS.map((r) => (
                <div key={r.id} className="p-3 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs text-slate-800">{r.texto}</span>
                  <div className="flex flex-wrap gap-1">
                    {([['ENTIDAD', 'La entidad'], ['YO', 'Yo'], ['COMPARTIDO', 'Compartido'], ['NOSE', 'No sé']] as [AsignacionRiesgo, string][]).map(([k, t]) => (
                      <button key={k} data-riesgo={`${r.id}:${k}`} aria-pressed={d.riesgos[r.id] === k} onClick={() => setD((p) => ({ ...p, riesgos: { ...p.riesgos, [r.id]: k } }))} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${d.riesgos[r.id] === k ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div data-riesgos-resumen className="text-xs text-slate-700 space-y-1">
              <p>Asumes <strong>{yo.length}</strong> de {RIESGOS_TIPICOS.length} riesgos.{yo.some((r) => r.alto) && ' Algunos son de alto impacto: calcula su costo en tu precio o pide revisarlos en las observaciones.'}</p>
              {nose.length > 0 && <p>Sin definir: {nose.map((r) => r.texto.toLowerCase()).join('; ')}. Pide aclaración en el plazo de observaciones.</p>}
            </div>
            <Nav />
          </div>
        );
      }
      case 12:
        return (
          <div className="space-y-5">
            <Titulo t="Observaciones al pliego" s="Marca lo que encuentres en el proyecto de pliego. Redactamos las observaciones para radicarlas en el plazo." />
            <div className="space-y-2">
              {CATALOGO_OBSERVACIONES.map((o) => (
                <label key={o.id} className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" data-obs={o.id} checked={!!d.observaciones[o.id]} onChange={(e) => setD((p) => ({ ...p, observaciones: { ...p.observaciones, [o.id]: e.target.checked } }))} className="mt-0.5" />
                  <span className="text-xs text-slate-800">{o.etiqueta}</span>
                </label>
              ))}
            </div>
            {observacionesTxt && (
              <div className="space-y-2">
                <pre data-observaciones className="whitespace-pre-wrap text-xs text-slate-800 font-sans leading-relaxed p-4 rounded-2xl border border-slate-200 bg-slate-50">{observacionesTxt}</pre>
                <button onClick={() => copiar(observacionesTxt)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer"><Copy className="w-3.5 h-3.5" /> {copiado ? 'Copiado' : 'Copiar observaciones'}</button>
                <p className="text-[10px] text-slate-400">Es un borrador: ajústalo al pliego real y radícalo por la plataforma del proceso dentro del plazo.</p>
              </div>
            )}
            <Nav />
          </div>
        );
      case 13: {
        const esMipyme = c.q_tam === 'MIPYME';
        return (
          <div className="space-y-5">
            <Titulo t="Mipyme y limitación" s="Si el valor del proceso está por debajo del umbral que fija la norma y tres o más Mipymes lo piden a tiempo, la entidad debe limitar la convocatoria a Mipymes (Decreto 1082 de 2015; el umbral y el plazo cámbialos por los vigentes: verifícalos en el aviso)." />
            {!esMipyme && <p className="text-xs text-slate-500">En el paso 2 indicaste que no eres Mipyme: este paso no te aplica, salvo que busques aliarte con una.</p>}
            {lista([
              { id: 'm_cert', t: 'Puedes acreditar que eres Mipyme (certificación del contador o revisor fiscal) y tienes al menos un año de existencia' },
              { id: 'm_umbral', t: 'Verificaste que el valor del proceso está por debajo del umbral de limitación' },
              { id: 'm_manif', t: 'Presentarás la manifestación de interés dentro del plazo del pliego' }
            ])}
            <Nav />
          </div>
        );
      }
      case 14:
        return (
          <div className="space-y-5">
            <Titulo t="Decisión Go / No-Go" s="Con lo que registraste, esta es la recomendación." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Campo et="Margen esperado (%)" v={c.g_margen || ''} on={(v) => setCampo('g_margen', v)} />
              <Campo et="Competidores esperados" v={c.g_comp || ''} on={(v) => setCampo('g_comp', v)} />
            </div>
            <div data-reco={reco.veredicto} className={`p-4 rounded-2xl border space-y-2 ${reco.veredicto === 'PRESENTARSE_SOLO' ? 'border-emerald-300 bg-emerald-50/50' : reco.veredicto === 'BUSCAR_ALIANZA' ? 'border-amber-300 bg-amber-50/50' : reco.veredicto === 'NO_PRESENTARSE' ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50'}`}>
              <strong className="block text-sm text-slate-900">{reco.titulo}</strong>
              <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">{reco.razones.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
            <Nav />
          </div>
        );
      case 16:
        return (
          <div className="space-y-5">
            <Titulo t="Costos directos y APU" s="Cada partida con su costo unitario (materiales, mano de obra, equipo y transporte). El costo directo es la base de tu precio." />
            <Campo et="Factor prestacional de la mano de obra (ej. 1,6; en blanco = 1)" v={c.o_factor || ''} on={(v) => setCampo('o_factor', v)} />
            <div className="space-y-3">
              {d.partidas.map((x) => (
                <div key={x.id} data-partida={x.id} className="p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Campo et="Descripción" v={x.descripcion} on={(v) => setPartida(x.id, 'descripcion', v)} ancho />
                    <Campo et="Unidad" v={x.unidad} on={(v) => setPartida(x.id, 'unidad', v)} />
                    <Campo et="Cantidad" v={x.cantidad ? String(x.cantidad) : ''} on={(v) => setPartida(x.id, 'cantidad', num(v) || 0)} />
                    <Campo et="Materiales (unit.)" cop v={x.materiales ? String(x.materiales) : ''} on={(v) => setPartida(x.id, 'materiales', Number(v) || 0)} />
                    <Campo et="Mano de obra (unit.)" cop v={x.manoObra ? String(x.manoObra) : ''} on={(v) => setPartida(x.id, 'manoObra', Number(v) || 0)} />
                    <Campo et="Equipo (unit.)" cop v={x.equipo ? String(x.equipo) : ''} on={(v) => setPartida(x.id, 'equipo', Number(v) || 0)} />
                    <Campo et="Transporte (unit.)" cop v={x.transporte ? String(x.transporte) : ''} on={(v) => setPartida(x.id, 'transporte', Number(v) || 0)} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Unitario {fmtCOP(costoUnitario(x, factor))} · Subtotal <strong className="text-slate-900">{fmtCOP(costoPartida(x, factor))}</strong></span>
                    <button aria-label="Quitar partida" onClick={() => setD((p) => ({ ...p, partidas: p.partidas.filter((y) => y.id !== x.id) }))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <button onClick={() => setD((p) => ({ ...p, partidas: [...p.partidas, { id: nuevoId(), descripcion: '', unidad: 'und', cantidad: 0, materiales: 0, manoObra: 0, equipo: 0, transporte: 0 }] }))} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"><Plus className="w-4 h-4" /> Agregar partida</button>
            </div>
            {d.partidas.length > 0 && <p data-costo-directo className="text-sm font-black text-slate-900">Costo directo: {fmtCOP(costoDirectoTotal(d.partidas, factor))}</p>}
            <Nav />
          </div>
        );
      case 17:
        return (
          <div className="space-y-5">
            <Titulo t="AIU, impuestos y estampillas" s={c.p_tipo === 'OBRA' ? 'En obra con AIU, el IVA se calcula solo sobre la utilidad.' : 'En este objeto el IVA se calcula sobre el valor total.'} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Campo et="Administración (%)" v={c.o_a || ''} on={(v) => setCampo('o_a', v)} />
              <Campo et="Imprevistos (%)" v={c.o_i || ''} on={(v) => setCampo('o_i', v)} />
              <Campo et="Utilidad (%)" v={c.o_u || ''} on={(v) => setCampo('o_u', v)} />
              <Campo et="IVA (%)" v={c.o_iva || ''} on={(v) => setCampo('o_iva', v)} ph="19" />
              <Campo et="Estampillas (% del contrato)" v={c.o_est || ''} on={(v) => setCampo('o_est', v)} />
              <Campo et="Contribución especial obra pública (%)" v={c.o_contr || ''} on={(v) => setCampo('o_contr', v)} />
              <Campo et="Pólizas y garantías (%)" v={c.o_pol || ''} on={(v) => setCampo('o_pol', v)} />
            </div>
            <p className="text-[10px] text-slate-400">Las estampillas y la contribución dependen de la entidad y del tipo de contrato: confirma los porcentajes en el pliego y las ordenanzas o acuerdos que apliquen.</p>
            {oferta ? (
              <div data-oferta className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1 text-xs text-slate-700">
                <div className="flex justify-between"><span>Costo directo</span><strong>{fmtCOP(oferta.costoDirecto)}</strong></div>
                <div className="flex justify-between"><span>Valor antes de IVA</span><strong>{fmtCOP(oferta.valorAntesIVA)}</strong></div>
                <div className="flex justify-between"><span>{oferta.ivaSoloUtilidad ? 'IVA sobre la utilidad' : 'IVA'}</span><strong>{fmtCOP(oferta.iva)}</strong></div>
                <div className="flex justify-between text-sm text-slate-900"><span>Valor total de la oferta</span><strong data-total-oferta>{fmtCOP(oferta.total)}</strong></div>
                <div className="flex justify-between pt-1 border-t border-slate-200"><span>Estampillas, contribución y pólizas</span><strong>{fmtCOP(oferta.adicionales)}</strong></div>
                <div className="flex justify-between"><span>Te queda para administración, imprevistos y utilidad</span><strong>{fmtCOP(oferta.restoAIU)}</strong></div>
              </div>
            ) : <p className="text-xs text-slate-400">Registra las partidas en el paso 16 para ver el valor de la oferta.</p>}
            <Nav />
          </div>
        );
      case 18:
        return (
          <div className="space-y-5">
            <Titulo t="Flujo de caja y anticipo" s="¿Cuánto dinero tendrás que financiar antes de cobrar?" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Campo et="Plazo (meses)" v={c.fc_plazo || ''} on={(v) => setCampo('fc_plazo', v)} />
              <Campo et="Anticipo (%)" v={c.fc_anticipo || ''} on={(v) => setCampo('fc_anticipo', v)} />
              <Campo et="Días de pago de la entidad" v={c.fc_dias || ''} on={(v) => setCampo('fc_dias', v)} ph="30" />
              <Campo et="Tasa de financiación (% mensual)" v={c.fc_tasa || ''} on={(v) => setCampo('fc_tasa', v)} />
            </div>
            {num(c.fc_anticipo) > 50 && <p className="text-xs text-amber-800">El anticipo suele estar limitado al 50 % del contrato y se maneja en un patrimonio autónomo o fiducia (Art. 91 Ley 1474 de 2011): verifícalo en el pliego.</p>}
            {flujo ? (
              <div data-flujo className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1 text-xs text-slate-700">
                <div className="flex justify-between"><span>Anticipo recibido</span><strong>{fmtCOP(flujo.anticipoCOP)}</strong></div>
                <div className="flex justify-between"><span>Máxima necesidad de financiación</span><strong data-pico>{fmtCOP(flujo.picoCOP)}</strong></div>
                {flujo.picoCOP > 0 && <div className="flex justify-between"><span>Se presenta en el mes</span><strong>{flujo.mesPico}</strong></div>}
                <div className="flex justify-between"><span>Costo financiero estimado</span><strong>{fmtCOP(flujo.costoFinancieroCOP)}</strong></div>
                <p className="text-[10px] text-slate-400 pt-1">Supone gastos uniformes y actas mensuales con el anticipo amortizado en cada una.</p>
              </div>
            ) : <p className="text-xs text-slate-400">Registra el plazo y las partidas para calcular el flujo.</p>}
            <Nav />
          </div>
        );
      case 19: {
        const ofertaTotal = oferta?.total ?? 0;
        return (
          <div className="space-y-5">
            <Titulo t="Precio y escenarios" s="Prueba tu precio contra competidores supuestos con la fórmula económica del pliego. Es una simulación de tu puntaje, no una forma de coordinar ofertas." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Fórmula del pliego</span>
                <select value={metodo} onChange={(e) => setCampo('e_metodo', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                  {METODOS_ECONOMICOS.map((m) => <option key={m.id} value={m.id}>{m.etiqueta}</option>)}
                </select>
              </label>
              <Campo et={`Tu precio (COP)${ofertaTotal ? ` — por defecto ${fmtCOP(ofertaTotal)}` : ''}`} cop v={c.e_precio || ''} on={(v) => setCampo('e_precio', v)} />
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-[11px] font-semibold text-slate-600">Precios supuestos de competidores (uno por línea)</span>
                <textarea value={c.e_comp || ''} onChange={(e) => setCampo('e_comp', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white" />
              </label>
            </div>
            {esc ? (
              <div data-escenarios className="space-y-3">
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  {esc.base.ofertasCalificadas.map((r) => (
                    <div key={r.ofertaId} data-fila={r.ofertaId} className={`flex items-center justify-between px-3 py-2 text-xs border-b border-slate-100 ${r.ofertaId === 'yo' ? 'bg-slate-50 font-bold' : ''}`}>
                      <span>{r.posicion}. {r.nombreProponente}</span><span>{fmtCOP(r.valorOfertado)}</span><span>{fmtN(r.puntajeEconomico, 1)} pts</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {esc.escenarios.map((e) => (
                    <div key={e.factor} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                      <span className="block text-slate-500">{e.factor === 1 ? 'Tu precio' : `${e.factor < 1 ? '' : '+'}${Math.round((e.factor - 1) * 100)} %`}</span>
                      <strong className="block text-slate-900">{fmtN(e.puntaje, 1)} pts · puesto {e.posicion}</strong>
                      {e.bajo && <span className="text-rose-700 font-bold">Posible precio bajo</span>}
                    </div>
                  ))}
                </div>
                {esc.base.ofertasCalificadas.find((r) => r.ofertaId === 'yo')?.esPrecioArtificialmenteBajo && (
                  <p className="text-xs text-rose-800">Tu precio podría tratarse como artificialmente bajo: prepara la justificación de tus costos (la entidad te pedirá explicaciones).</p>
                )}
                {num(c.p_presupuesto) > 0 && precioPropio < num(c.p_presupuesto) * 0.8 && (
                  <p data-alerta-bajo className="text-xs text-amber-800">Tu precio está por debajo del 80 % del presupuesto oficial ({fmtCOP(num(c.p_presupuesto) * 0.8)}): referencia habitual para que la entidad pida explicaciones. Prepara el sustento de tus costos.</p>
                )}
                <p className="text-[10px] text-slate-400">Fórmula aproximada del simulador: usa la que defina tu pliego. Solo se califican ofertas iguales o menores al presupuesto oficial.</p>
              </div>
            ) : <p className="text-xs text-slate-400">Para simular necesitas el presupuesto oficial (paso 8), tu precio y al menos un precio de competidor.</p>}
            <Nav />
          </div>
        );
      }
      case 20:
        return (
          <div className="space-y-5">
            <Titulo t="Personal, SST y compromisos" s="El pliego suele exigir equipo humano y sistemas de gestión acreditados." />
            {lista(LISTA_PERSONAL.map((x) => ({ id: x.id, t: x.t })))}
            <p data-conteo className="text-xs text-slate-600">{conteo(LISTA_PERSONAL)} de {LISTA_PERSONAL.length} listos.</p>
            <Nav />
          </div>
        );
      case 21: {
        const sugerido = num(c.p_presupuesto) > 0 ? Math.round(num(c.p_presupuesto) * 0.1) : 0;
        return (
          <div className="space-y-5">
            <Titulo t="Sobre 1: habilitante y garantía de seriedad" s="Reúne los documentos que te habilitan para competir." />
            {lista(LISTA_SOBRE1.map((x) => ({ id: x.id, t: x.t })))}
            <p data-conteo className="text-xs text-slate-600">{conteo(LISTA_SOBRE1)} de {LISTA_SOBRE1.length} listos.</p>
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <strong className="text-xs text-slate-900">Garantía de seriedad</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo et="Aseguradora" v={c.gs_aseguradora || ''} on={(v) => setCampo('gs_aseguradora', v)} />
                <Campo et="N.º de póliza" v={c.gs_numero || ''} on={(v) => setCampo('gs_numero', v)} />
                <Campo et="Tomador" v={c.gs_tomador ?? c.q_razon ?? ''} on={(v) => setCampo('gs_tomador', v)} />
                <Campo et="Asegurado (entidad)" v={c.gs_asegurado ?? c.p_entidad ?? ''} on={(v) => setCampo('gs_asegurado', v)} />
                <Campo et="Valor asegurado (COP)" cop v={c.gs_valor || ''} on={(v) => setCampo('gs_valor', v)} />
                <Campo et="Vigente hasta" tipo="date" v={c.gs_vigencia || ''} on={(v) => setCampo('gs_vigencia', v)} />
              </div>
              {sugerido > 0 && <p className="text-[11px] text-slate-500">Referencia: el 10 % del presupuesto oficial es {fmtCOP(sugerido)} (valor habitual en licitación; confirma el porcentaje y la vigencia en el pliego).</p>}
              {lista(LISTA_GARANTIA.map((x) => ({ id: x.id, t: x.t })))}
            </div>
            <Nav />
          </div>
        );
      }
      case 22:
        return (
          <div className="space-y-5">
            <Titulo t="Sobre 2: oferta económica y propuesta" s="Revisa tu oferta, haz el control previo al cierre y descarga la propuesta." />
            {oferta ? (
              <div data-oferta-final className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between"><span>Valor antes de IVA</span><strong>{fmtCOP(oferta.valorAntesIVA)}</strong></div>
                <div className="flex justify-between"><span>IVA</span><strong>{fmtCOP(oferta.iva)}</strong></div>
                <div className="flex justify-between text-sm text-slate-900"><span>Valor total de la oferta</span><strong>{fmtCOP(oferta.total)}</strong></div>
              </div>
            ) : <p className="text-xs text-slate-400">Aún no registras partidas (paso 16): la oferta económica saldrá como [PENDIENTE] en el documento.</p>}
            <div className="space-y-2">
              <strong className="text-xs text-slate-900">Control previo al cierre</strong>
              {lista(LISTA_CIERRE.map((x) => ({ id: x.id, t: x.t })))}
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs text-slate-700">Sobre 1 listo: <strong>{conteo(LISTA_SOBRE1)} de {LISTA_SOBRE1.length}</strong> · Personal: <strong>{conteo(LISTA_PERSONAL)} de {LISTA_PERSONAL.length}</strong></p>
              <button data-descargar onClick={async () => { setBajando(true); try { await descargarPropuesta(d); } finally { setBajando(false); } }} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black cursor-pointer hover:bg-slate-800">
                {bajando ? 'Generando…' : 'Descargar propuesta (.docx)'}
              </button>
              <p className="text-[10px] text-slate-400">Es un borrador con tus datos. Lo que falte queda marcado como [PENDIENTE]; anexa los documentos originales y radícalo por la plataforma del proceso antes del cierre.</p>
            </div>
            <Nav />
          </div>
        );
      case 15:
        return (
          <div className="space-y-5">
            <Titulo t="Alianza: consorcio o unión temporal" s="Úsala para completar lo que te falta (experiencia, capacidad), no para reducir la competencia ni coordinar ofertas con competidores." />
            <div data-perfil-aliado className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <strong className="text-xs text-slate-900">Qué necesitas de un aliado</strong>
              {perfil.necesidades.length === 0 ? (
                <p data-sin-necesidad className="text-xs text-slate-600">Con los datos que registraste cumples los requisitos del pliego sin aliado. Una alianza solo se justifica si te falta algo.</p>
              ) : (
                <ul className="space-y-1.5">
                  {perfil.necesidades.map((n) => (
                    <li key={n.id} data-necesidad={n.id} className="text-xs text-slate-800"><strong>{n.etiqueta}.</strong> {n.detalle}<span className="block text-slate-600">Busca: {n.criterio}</span></li>
                  ))}
                </ul>
              )}
              <details className="text-xs text-slate-700">
                <summary className="cursor-pointer font-bold text-slate-800">Dónde buscar aliados y qué verificar antes de firmar</summary>
                <div className="mt-2 space-y-2">
                  <ul className="list-disc pl-4 space-y-1">{perfil.dondeBuscar.map((t) => <li key={t}>{t}</li>)}</ul>
                  <ul className="list-disc pl-4 space-y-1">{perfil.verificar.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </details>
              {perfil.ficha && (
                <button data-copiar-ficha onClick={() => copiar(perfil.ficha)} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"><Copy className="w-3.5 h-3.5" /> {copiado ? 'Copiado' : 'Copiar ficha de búsqueda de aliado'}</button>
              )}
              <p data-blindaje className="text-[11px] text-slate-600 p-3 rounded-xl bg-slate-50">Blindaje de libre competencia: la alianza debe sumar capacidades que individualmente no tienes. Consorciarse entre competidores con capacidad plena para ofertar solos, para repartirse el mercado o eludir la puja, puede constituir un acuerdo restrictivo de la competencia (Art. 410A del Código Penal; Ley 155 de 1959 y Decreto 2153 de 1992). Verifícalo con tu abogado.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([['CONSORCIO', 'Consorcio'], ['UNION_TEMPORAL', 'Unión temporal']] as const).map(([k, t]) => (
                <button key={k} data-alianza={k} aria-pressed={d.tipoAlianza === k} onClick={() => setD((p) => ({ ...p, tipoAlianza: k }))} className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer ${d.tipoAlianza === k ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}>{t}</button>
              ))}
            </div>
            <div className="space-y-3">
              {d.miembros.map((m) => (
                <div key={m.id} data-miembro={m.id} className="p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Campo et="Razón social" v={m.razonSocial} on={(v) => setMiembro(m.id, 'razonSocial', v)} />
                    <Campo et="NIT" v={m.nit} on={(v) => setMiembro(m.id, 'nit', v)} />
                    <Campo et="Participación (%)" v={m.porcentaje ? String(m.porcentaje) : ''} on={(v) => setMiembro(m.id, 'porcentaje', num(v) || 0)} />
                    <Campo et="Experiencia que aporta (SMMLV)" v={m.experienciaSMMLV ? String(m.experienciaSMMLV) : ''} on={(v) => setMiembro(m.id, 'experienciaSMMLV', num(v) || 0)} />
                    {d.tipoAlianza === 'UNION_TEMPORAL' && <Campo et="Actividades y extensión de su participación" v={m.actividades} on={(v) => setMiembro(m.id, 'actividades', v)} ancho />}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={m.esLider} onChange={(e) => setD((p) => ({ ...p, miembros: p.miembros.map((x) => ({ ...x, esLider: x.id === m.id ? e.target.checked : false })) }))} /> Líder o representante</label>
                    <button aria-label="Quitar integrante" onClick={() => setD((p) => ({ ...p, miembros: p.miembros.filter((x) => x.id !== m.id) }))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <button onClick={() => setD((p) => ({ ...p, miembros: [...p.miembros, { id: nuevoId(), razonSocial: '', nit: '', porcentaje: 0, experienciaSMMLV: 0, esLider: p.miembros.length === 0, actividades: '' }] }))} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"><Plus className="w-4 h-4" /> Agregar integrante</button>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs text-slate-800">¿Vas a formalizar el acuerdo de consorcio o unión temporal?</p>
              <button data-abrir-gestor onClick={abrirGestor} disabled={d.miembros.length === 0} className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer disabled:opacity-40">Abrir el gestor de consorcios y minutas</button>
              <p className="text-[10px] text-slate-400">Pasa tus integrantes al gestor: minuta de constitución, poder especial, confidencialidad y memorando. Lo que cambies allá vuelve aquí.</p>
            </div>
            {d.miembros.length > 0 && (
              <div data-alianza-resumen className="text-xs text-slate-700 space-y-1">
                {avisosAlianza.map((a, i) => <p key={i} className="text-amber-800">{a}</p>)}
                {reqsConAlianza.filter((r) => r.id === 'exp').map((r) => <p key={r.id}>Experiencia con la alianza: {r.detalle} <Chip estado={r.estado} /></p>)}
                <p className="text-[10px] text-slate-400">Tu propia experiencia ya se cuenta desde el paso 6: en «Experiencia que aporta» escribe solo la de tus aliados, para no sumarla dos veces. La forma de sumar la define el pliego: verifícala.</p>
              </div>
            )}
            <div data-resumen className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <strong className="text-xs text-slate-900">Tu expediente de oferta</strong>
              {[['Habilitación', estadoLista(d.checks, listas.habil)], ['Antecedentes', estadoLista(d.checks, listas.antec)], ['Capacidad jurídica', estadoLista(d.checks, listas.jur)]].map(([t, e]) => (
                <div key={t as string} className="flex items-center justify-between text-xs text-slate-700"><span>{t}</span><Chip estado={e as 'EN_REGLA'} /></div>
              ))}
              {reqs.map((r) => <div key={r.id} className="flex items-center justify-between text-xs text-slate-700"><span>{r.etiqueta}</span><Chip estado={r.estado} /></div>)}
            </div>
            <Nav />
          </div>
        );
      case 23:
        return (
          <div className="space-y-5">
            <Titulo t="Informe de evaluación y subsanación" s="La entidad publica el informe y abre un término de traslado. Ahí puedes subsanar requisitos habilitantes y observar el informe." />
            <div className="grid grid-cols-3 gap-2">
              {([['HABILITADO', 'Habilitado'], ['POR_SUBSANAR', 'Por subsanar'], ['NO_HABILITADO', 'Rechazado']] as const).map(([k, t]) => (
                <button key={k} data-informe={k} aria-pressed={c.i_res === k} onClick={() => setCampo('i_res', k)} className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer ${c.i_res === k ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}>{t}</button>
              ))}
            </div>
            <Campo et="Publicación del informe de evaluación" tipo="date" v={c.t_informe || ''} on={(v) => setCampo('t_informe', v)} />
            {alarmasT.filter((a) => a.id === 'TRASLADO_EVALUACION' && a.fechaLimite).map((a) => (
              <div key={a.id} data-alarma={a.id} className="p-3 rounded-2xl border border-slate-200 text-xs space-y-0.5">
                <strong className="block text-slate-900">Último día del traslado: {a.fechaLimite}</strong>
                <span className="block font-bold text-slate-900">{a.estado === 'VENCIDO' ? 'Término vencido' : `Faltan ${a.diasHabilesRestantes} día(s) hábil(es)`}</span>
                <span className="block text-slate-500">El plazo real depende de la modalidad y del pliego: confírmalo en el cronograma.</span>
              </div>
            ))}
            {c.i_res === 'NO_HABILITADO' && <p className="text-xs text-rose-800">Si te rechazaron por algo subsanable y el término sigue abierto, responde ya. Si no, queda revisar las acciones del paso 24.</p>}
            {(c.i_res === 'POR_SUBSANAR' || c.i_res === 'NO_HABILITADO') && (
              <div className="space-y-2">
                <strong className="text-xs text-slate-900">¿Qué te señalan?</strong>
                {CATALOGO_SUBSANACION.map((x) => (
                  <label key={x.id} className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 cursor-pointer">
                    <input type="checkbox" data-sub={x.id} checked={!!d.observaciones[x.id]} onChange={(e) => setD((p) => ({ ...p, observaciones: { ...p.observaciones, [x.id]: e.target.checked } }))} className="mt-0.5" />
                    <span className="text-xs text-slate-800">{x.etiqueta}{d.observaciones[x.id] && !x.subsanable && <strong className="block text-rose-700 mt-0.5">No es subsanable: la subsanación no sirve para mejorar la oferta ni para acreditar lo que no existía al cierre.</strong>}</span>
                  </label>
                ))}
              </div>
            )}
            <label className="block space-y-1">
              <span className="text-[11px] font-semibold text-slate-600">Observaciones al informe o a las ofertas de otros (opcional)</span>
              <textarea value={c.s_otras || ''} onChange={(e) => setCampo('s_otras', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white" />
            </label>
            {subsanacionTxt && copia(subsanacionTxt)}
            <Nav />
          </div>
        );
      case 24:
        return (
          <div className="space-y-5">
            <Titulo t="Adjudicación y reclamaciones" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([['GANE', 'Me adjudicaron'], ['OTRO', 'Adjudicaron a otro'], ['DESIERTO', 'Declarado desierto'], ['AUN_NO', 'Aún no']] as const).map(([k, t]) => (
                <button key={k} data-adj={k} aria-pressed={c.a_res === k} onClick={() => setCampo('a_res', k)} className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer ${c.a_res === k ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}>{t}</button>
              ))}
            </div>
            <Campo et="Fecha de adjudicación" tipo="date" v={c.t_adjud || ''} on={(v) => setCampo('t_adjud', v)} />
            {c.a_res === 'GANE' && (
              <div data-guia="GANE" className="space-y-2 text-xs text-slate-700">
                {alarmasT.filter((a) => a.id === 'SUSCRIPCION_CONTRATO' && a.fechaLimite).map((a) => (
                  <div key={a.id} data-alarma={a.id} className="p-3 rounded-2xl border border-slate-200 space-y-0.5">
                    <strong className="block text-slate-900">Último día para firmar y constituir garantías: {a.fechaLimite}</strong>
                    <span className="block font-bold">{a.estado === 'VENCIDO' ? 'Término vencido' : `Faltan ${a.diasHabilesRestantes} día(s) hábil(es)`}</span>
                    <span className="block text-slate-500">Plazo adoptado por el simulador; el pliego fija el real.</span>
                  </div>
                ))}
                <p>La adjudicación obliga a suscribir el contrato. Prepara ya la garantía única (paso 25).</p>
              </div>
            )}
            {c.a_res === 'OTRO' && (
              <ul data-guia="OTRO" className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li>Revisa el informe final y las ofertas en la plataforma: compara puntajes y habilitación.</li>
                <li>Las observaciones al informe se presentan durante el traslado; si ya pasó, quedan las acciones judiciales.</li>
                <li>Contra el acto de adjudicación en licitación pública no proceden recursos; en otras modalidades revisa el pliego y el acto.</li>
                <li>La acción de nulidad y restablecimiento del derecho caduca a los 4 meses de la comunicación del acto (CPACA, Art. 164).</li>
                <li className="text-slate-500">Verifica los plazos y la vía procedente con tu abogado antes de actuar.</li>
              </ul>
            )}
            {c.a_res === 'DESIERTO' && <p data-guia="DESIERTO" className="text-xs text-slate-700">Si te habilitaron y cumplías, revisa los motivos del acto: solo procede la declaratoria de desierta por motivos que impidan la escogencia objetiva. Guarda tu oferta: puede reabrirse un nuevo proceso.</p>}
            <button onClick={() => abrirHerramienta('EMPATE')} className="text-xs font-bold text-slate-700 underline underline-offset-2 cursor-pointer">¿Hubo empate? Abrir la cascada de desempate</button>
            <Nav />
          </div>
        );
      case 25:
        return (
          <div className="space-y-5">
            <Titulo t="Contrato, garantías y Acta de Inicio" s="Los porcentajes y vigencias de la garantía única los fija el pliego: escríbelos y calculamos el valor asegurado." />
            <div className="grid grid-cols-2 gap-3">
              <Campo et="Valor del contrato (COP)" cop v={c.k_valor || (oferta ? String(Math.round(oferta.total)) : '')} on={(v) => setCampo('k_valor', v)} />
              <Campo et="N.º del contrato" v={c.x_contrato || ''} on={(v) => setCampo('x_contrato', v)} />
            </div>
            <div className="space-y-2">
              {garantias.map((g) => (
                <div key={g.id} data-amparo={g.id} className="p-3 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-800">{g.etiqueta}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Campo et="% del valor" v={c[`gu_${g.id}_pct`] || ''} on={(v) => setCampo(`gu_${g.id}_pct`, v)} />
                    <Campo et="Vigencia exigida" v={c[`gu_${g.id}_vig`] || ''} on={(v) => setCampo(`gu_${g.id}_vig`, v)} ph="Ej: plazo + 4 meses" />
                  </div>
                  {g.valorCOP !== null && <span className="text-xs text-slate-600">Valor asegurado: <strong data-valor-amparo className="text-slate-900">{fmtCOP(g.valorCOP)}</strong></span>}
                </div>
              ))}
            </div>
            <Campo et="Fecha del Acta de Inicio" tipo="date" v={c.k_inicio || ''} on={(v) => setCampo('k_inicio', v)} />
            {lista(LISTA_CONTRATO)}
            <p data-conteo className="text-xs text-slate-600">{conteo(LISTA_CONTRATO)} de {LISTA_CONTRATO.length} listos.</p>
            <Nav />
          </div>
        );
      case 26: {
        const filas = d.actas.map((a) => ({ a, r: calcularActa(a, c) }));
        const totalBruto = filas.reduce((x, f) => x + f.r.bruto, 0);
        return (
          <div className="space-y-5">
            <Titulo t="Ejecución y pagos" s="Cada acta parcial: lo que cobras, el anticipo que se amortiza, los descuentos y lo que recibes. El pago exige seguridad social al día y factura." />
            <div className="space-y-3">
              {filas.map(({ a, r }, i) => (
                <div key={a.id} data-acta={a.id} className="p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Campo et={`Acta ${i + 1}: fecha`} tipo="date" v={a.fecha} on={(v) => setActa(a.id, 'fecha', v)} />
                    <Campo et="Valor bruto cobrado (COP)" cop v={a.bruto ? String(a.bruto) : ''} on={(v) => setActa(a.id, 'bruto', Number(v) || 0)} />
                  </div>
                  {a.bruto > 0 && (
                    <div className="text-xs text-slate-700 grid grid-cols-2 gap-x-4">
                      <span>Amortización del anticipo</span><strong className="text-right">{fmtCOP(r.amortizacion)}</strong>
                      <span>Estampillas y contribución</span><strong className="text-right">{fmtCOP(r.estampillas + r.contribucion)}</strong>
                      <span className="text-slate-900">Pago neto estimado</span><strong data-neto className="text-right text-slate-900">{fmtCOP(r.neto)}</strong>
                    </div>
                  )}
                  {(['ss', 'fac', 'sup'] as const).map((k) => (
                    <div key={k} className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-600">{k === 'ss' ? 'Certificación de seguridad social al día' : k === 'fac' ? 'Factura electrónica emitida' : 'Informe del supervisor aprobado'}</span>
                      <Tri3 id={`acta_${a.id}_${k}`} v={d.checks[`acta_${a.id}_${k}`]} on={(v) => setCheck(`acta_${a.id}_${k}`, v)} />
                    </div>
                  ))}
                  <button aria-label="Quitar acta" onClick={() => setD((p) => ({ ...p, actas: p.actas.filter((x) => x.id !== a.id) }))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => setD((p) => ({ ...p, actas: [...p.actas, { id: nuevoId(), fecha: '', bruto: 0 }] }))} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"><Plus className="w-4 h-4" /> Agregar acta de pago</button>
            </div>
            {valorContrato > 0 && d.actas.length > 0 && <p data-avance className="text-xs font-bold text-slate-900">Cobrado: {fmtCOP(totalBruto)} de {fmtCOP(valorContrato)} ({fmtN((totalBruto / valorContrato) * 100, 1)} %)</p>}
            <p className="text-[10px] text-slate-400">El pago neto es una estimación: no incluye retención en la fuente ni otros descuentos de ley.</p>
            <Nav />
          </div>
        );
      }
      case 27:
        return (
          <div className="space-y-6">
            <Titulo t="Modificaciones, multas y defensa" />
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <strong className="text-xs text-slate-900">Adición al contrato</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Campo et="Valor inicial (COP)" cop v={c.x_valor || (valorContrato ? String(Math.round(valorContrato)) : '')} on={(v) => setCampo('x_valor', v)} />
                <Campo et="Año de suscripción" v={c.x_anio || ''} on={(v) => setCampo('x_anio', v.replace(/\D/g, '').slice(0, 4))} />
                <Campo et="Adición solicitada (COP)" cop v={c.x_adicion || ''} on={(v) => setCampo('x_adicion', v)} />
              </div>
              {adicion && num(c.x_adicion) > 0 && (
                <p data-adicion className={`text-xs ${adicion.ok ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {fmtN(adicion.pct, 1)} % del valor inicial ({fmtN(adicion.smmlvAdicion, 1)} de {fmtN(adicion.smmlvInicial, 1)} SMMLV). {adicion.ok ? 'Está dentro del tope del 50 %.' : `Supera el tope del 50 % (Art. 40 Ley 80 de 1993): el máximo es ${fmtCOP(adicion.maximoCOP)}.`}
                </p>
              )}
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <strong className="text-xs text-slate-900">Exposición a multas</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Campo et="Multa diaria (% del valor)" v={c.x_mpct || ''} on={(v) => setCampo('x_mpct', v)} />
                <Campo et="Días de retraso" v={c.x_dias || ''} on={(v) => setCampo('x_dias', v)} />
                <Campo et="Tope de multas (% del valor)" v={c.x_tope || ''} on={(v) => setCampo('x_tope', v)} />
              </div>
              {multa && <p data-multa className="text-xs text-slate-800">Multa estimada: <strong>{fmtCOP(multa.multa)}</strong>{multa.aplicaTope && ` (llegó al tope de ${fmtCOP(multa.tope)})`}. Los porcentajes y el tope los fija el contrato.</p>}
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <strong className="text-xs text-slate-900">Defensa en el procedimiento sancionatorio (Art. 86 Ley 1474)</strong>
              <label className="block space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Hechos, con fechas y soportes</span>
                <textarea value={c.x_hechos || ''} onChange={(e) => setCampo('x_hechos', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white" />
              </label>
              {ARGUMENTOS_DEFENSA.map((x) => (
                <label key={x.id} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" data-def={x.id} checked={!!d.observaciones[x.id]} onChange={(e) => setD((p) => ({ ...p, observaciones: { ...p.observaciones, [x.id]: e.target.checked } }))} className="mt-0.5" />
                  <span className="text-xs text-slate-800">{x.etiqueta}</span>
                </label>
              ))}
              {descargosTxt && copia(descargosTxt)}
            </div>
            <Nav />
          </div>
        );
      case 28:
        return (
          <div className="space-y-5">
            <Titulo t="Liquidación y experiencia en el RUP" s="Cierra el contrato y convierte lo ejecutado en experiencia para tus próximos procesos." />
            <Campo et="Fecha de terminación del contrato" tipo="date" v={c.l_term || ''} on={(v) => setCampo('l_term', v)} />
            {liq && (
              <div data-liquidacion className="p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <p>Liquidación de común acuerdo, hasta: <strong>{liq.bilateralHasta}</strong></p>
                <p>Si no hay acuerdo, la entidad puede liquidar unilateralmente hasta: <strong>{liq.unilateralHasta}</strong></p>
                <p className="text-[10px] text-slate-400">Plazos supletivos (Art. 11 Ley 1150 de 2007): si tu contrato fija otros, prevalecen. Verifícalos.</p>
              </div>
            )}
            {lista(LISTA_LIQUIDACION)}
            <p data-conteo className="text-xs text-slate-600">{conteo(LISTA_LIQUIDACION)} de {LISTA_LIQUIDACION.length} listos.</p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <strong className="text-xs text-slate-900">Experiencia para tu RUP</strong>
              <p className="text-xs text-slate-600">El contrato terminado se registra en el RUP cuando renuevas (a más tardar el quinto día hábil de abril). Guárdalo ya en tu banco de experiencia.</p>
              {d.observaciones.l_exp ? (
                <p data-exp-agregada className="text-xs font-bold text-emerald-800">Agregado a tu experiencia (paso 6).</p>
              ) : (
                <button data-agregar-exp disabled={!(valorContrato > 0)} onClick={() => setD((p) => ({ ...p, observaciones: { ...p.observaciones, l_exp: true }, contratos: [...p.contratos, { id: nuevoId(), objeto: c.p_objeto || '', cliente: c.p_entidad || '', valorCOP: Math.round(valorContrato), anio: Number((c.l_term || '').slice(0, 4)) || new Date().getFullYear(), unspsc: codigosExigidos(c.r_unspsc)[0] || '' }] }))} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer disabled:opacity-40">Agregar este contrato a mi experiencia</button>
              )}
            </div>
            <div data-ciclo className="text-xs text-slate-600">Recorriste todo el ciclo: de la preparación de tu empresa a la liquidación del contrato.</div>
            <Nav sig={false} />
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div data-vendo className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span data-fase>Vendo · {fase.nombre}</span>
          <span data-paso>Paso {paso} de {TOTAL_PASOS_VENDO} · {TITULOS_VENDO[paso]}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button data-abrir-buscador onClick={() => setVerBuscador(true)} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"><Search className="w-4 h-4" /> Oportunidades</button>
            <button data-abrir-linea onClick={() => setVerLinea(true)} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"><CalendarDays className="w-4 h-4" /> Línea de tiempo</button>
          </div>
          {siguiente && <span data-siguiente className="text-[11px] text-slate-500 text-right truncate">Siguiente: <strong className="text-slate-800">{siguiente.titulo}</strong> · {siguiente.estado === 'HOY' ? 'hoy' : `${siguiente.diasHabiles} d. háb.`}</span>}
        </div>
        <div className="h-1 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-slate-900" style={{ width: `${(paso / TOTAL_PASOS_VENDO) * 100}%` }} /></div>
      </div>
      {cuerpo}
      {verBuscador && <BuscadorOportunidades datos={d} hayDatosProceso={!!(c.p_numero || c.p_entidad || c.p_objeto)} onUsar={usarOportunidad} onCerrar={() => setVerBuscador(false)} />}
      {verLinea && <LineaTiempoVendo hitos={linea.hitos} avisos={linea.avisos} titulo={c.p_numero || c.p_entidad || ''} onCampo={(k, v) => setCampo(k, v)} onIrAlPaso={(n) => { setVerLinea(false); ir(n); }} onCerrar={() => setVerLinea(false)} />}
      <div className="pt-2 text-center">
        <button onClick={() => { persistirAhora(true); useProcurementStore.getState().nuevoLienzo(); }} className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer">Empezar otra propuesta</button>
      </div>
    </div>
  );
};
