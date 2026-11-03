import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, Search, Save, Trash2, ExternalLink, Plus, Copy } from 'lucide-react';
import type { DatosVendo } from '../../core/domain/vendo';
import { DEPARTAMENTOS, MODALIDADES_BUSQUEDA, OTRAS_PLATAFORMAS, PERFIL_NUEVO } from '../../core/domain/oportunidades';
import type { PerfilBusqueda, Oportunidad, Puntuada, OportunidadGuardada, EstadoSeguimiento } from '../../core/domain/oportunidades';
import { construirConsulta, normalizarRegistro, puntuar, etiquetaPuntaje, codigosDe, hoyISO } from '../../core/engines/OportunidadesEngine';
import { capacidadResidual, codigosExigidos, num } from '../../core/engines/VendoEngine';
import { diasHabilesEntre, esFechaValida } from '../../core/engines/TerminosProcesalesEngine';

const CLAVE = 'procuresim-oportunidades-v1';
interface Guardado { perfiles: PerfilBusqueda[]; activoId: string; guardadas: OportunidadGuardada[] }
const nuevoId = () => Math.random().toString(36).slice(2, 10);
const cargar = (): Guardado => {
  try {
    const t = JSON.parse(localStorage.getItem(CLAVE) || 'null') as Guardado | null;
    if (t && Array.isArray(t.perfiles) && t.perfiles.length) {
      const perfiles = t.perfiles.filter((x) => x && typeof x === 'object').map((x) => ({ ...PERFIL_NUEVO(typeof x.id === 'string' && x.id ? x.id : nuevoId()), ...x, departamentos: Array.isArray(x.departamentos) ? x.departamentos : [], modalidades: Array.isArray(x.modalidades) ? x.modalidades : [], vistas: Array.isArray(x.vistas) ? x.vistas : [], dias: Number(x.dias) > 0 ? Number(x.dias) : 30 }));
      const guardadas = (Array.isArray(t.guardadas) ? t.guardadas : []).filter((x) => x && x.op && typeof x.op === 'object' && typeof x.op.id === 'string');
      if (perfiles.length) return { perfiles, activoId: perfiles.some((x) => x.id === t.activoId) ? t.activoId : perfiles[0].id, guardadas };
    }
  } catch { /* sin almacenamiento */ }
  const p = PERFIL_NUEVO(nuevoId());
  return { perfiles: [p], activoId: p.id, guardadas: [] };
};
const ESTADOS: { id: EstadoSeguimiento; t: string }[] = [{ id: 'INTERESANTE', t: 'Interesante' }, { id: 'EVALUANDO', t: 'Evaluando' }, { id: 'POSTULADO', t: 'Postulado' }, { id: 'DESCARTADA', t: 'Descartada' }];
const cop = (n: number) => `$ ${Math.round(n).toLocaleString('es-CO')}`;
const entrada = 'w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white';

export const BuscadorOportunidades: React.FC<{ datos: DatosVendo; hayDatosProceso: boolean; onUsar: (o: Oportunidad) => void; onCerrar: () => void }> = ({ datos, hayDatosProceso, onUsar, onCerrar }) => {
  const [g, setG] = useState<Guardado>(cargar);
  const [tab, setTab] = useState<'BUSCAR' | 'MIS'>('BUSCAR');
  const [estado, setEstado] = useState<'IDLE' | 'CARGANDO' | 'ERROR'>('IDLE');
  const [resultados, setResultados] = useState<Puntuada[] | null>(null);
  const [confirmar, setConfirmar] = useState<string>('');
  const [copiado, setCopiado] = useState(false);
  const [manual, setManual] = useState({ plataforma: 'SAP Ariba', entidad: '', objeto: '', valor: '', publicada: hoyISO(), cierre: '', enlace: '', codigo: '' });
  const abortar = useRef<AbortController | null>(null);

  const perfil = g.perfiles.find((x) => x.id === g.activoId) || g.perfiles[0];
  const c = datos.campos;
  const cr = capacidadResidual(c);
  const ctx = useMemo(() => ({ capacidadCOP: cr?.crCOP }), [cr?.crCOP]);

  useEffect(() => { try { localStorage.setItem(CLAVE, JSON.stringify(g)); } catch { /* sin almacenamiento */ } }, [g]);
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, [onCerrar]);

  const cambiar = (patch: Partial<PerfilBusqueda>) => setG((p) => ({ ...p, perfiles: p.perfiles.map((x) => (x.id === perfil.id ? { ...x, ...patch } : x)) }));
  const alternar = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const tomarDeMisDatos = () => {
    const cods = Array.from(new Set([...codigosExigidos(c.r_unspsc), ...datos.contratos.map((k) => k.unspsc.replace(/\D/g, '')).filter((x) => x.length >= 4).map((x) => x.slice(0, 6))]));
    cambiar({ codigos: cods.join(', ') });
  };

  const buscar = async () => {
    abortar.current?.abort();
    const ac = new AbortController(); abortar.current = ac;
    const limite = window.setTimeout(() => ac.abort(), 25_000);
    setEstado('CARGANDO');
    try {
      const r = await fetch(construirConsulta(perfil), { signal: ac.signal });
      if (!r.ok) throw new Error(String(r.status));
      const json: unknown = await r.json();
      if (!Array.isArray(json)) throw new Error('respuesta inesperada');
      const crudo = json.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x) && typeof (x as Record<string, unknown>).id_del_proceso === 'string');
      const lista = crudo.map((x) => ({ op: normalizarRegistro(x), extra: typeof x.descripci_n_del_procedimiento === 'string' ? (x.descripci_n_del_procedimiento as string) : '' }));
      const puntuadas = lista.map(({ op, extra }) => puntuar(op, perfil, { ...ctx, textoExtra: extra })).sort((a, b) => b.puntaje - a.puntaje);
      setResultados(puntuadas); setEstado('IDLE');
      cambiar({ vistas: Array.from(new Set([...perfil.vistas, ...puntuadas.map((x) => x.id)])).slice(-2000) });
    } catch { setEstado('ERROR'); } finally { window.clearTimeout(limite); }
  };

  const guardar = (o: Oportunidad) => setG((p) => (p.guardadas.some((x) => x.op.id === o.id) ? p : { ...p, guardadas: [{ op: o, estado: 'INTERESANTE', nota: '', guardada: hoyISO() }, ...p.guardadas] }));
  const yaGuardada = (id: string) => g.guardadas.some((x) => x.op.id === id);
  const usar = (o: Oportunidad) => { if (hayDatosProceso && confirmar !== o.id) { setConfirmar(o.id); return; } onUsar(o); };

  const agregarManual = () => {
    if (!manual.objeto.trim()) return;
    const o: Oportunidad = { id: `M-${nuevoId()}`, plataforma: manual.plataforma, entidad: manual.entidad, objeto: manual.objeto, referencia: '', codigo: manual.codigo, valor: num(manual.valor) || 0, modalidad: '', departamento: '', publicada: manual.publicada, cierre: manual.cierre || undefined, fase: '', enlace: manual.enlace, origen: 'MANUAL' };
    setG((p) => ({ ...p, guardadas: [{ op: o, estado: 'INTERESANTE', nota: '', guardada: hoyISO() }, ...p.guardadas] }));
    setManual({ ...manual, entidad: '', objeto: '', valor: '', cierre: '', enlace: '', codigo: '' }); setTab('MIS');
  };

  const copiarPalabras = async () => {
    const t = [perfil.palabras, codigosDe(perfil.codigos).join(', ')].filter(Boolean).join(' | ');
    try { await navigator.clipboard.writeText(t); } catch { /* sin portapapeles */ }
    setCopiado(true); window.setTimeout(() => setCopiado(false), 1600);
  };

  const Tarjeta: React.FC<{ o: Puntuada; extra?: React.ReactNode }> = ({ o, extra }) => (
    <div data-resultado={o.id} data-puntaje={o.puntaje} className="p-4 rounded-2xl border border-slate-200 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <span className="block text-xs font-bold text-slate-900 break-words">{o.objeto || '(sin nombre)'}</span>
          <span className="block text-[11px] text-slate-600">{o.entidad}{o.departamento ? ` · ${o.departamento}` : ''}</span>
          <span className="block text-[11px] text-slate-500">{o.plataforma}{o.modalidad ? ` · ${o.modalidad}` : ''} · {o.valor > 0 ? cop(o.valor) : 'valor sin definir'} · publicada {o.publicada}</span>
        </div>
        <div className="text-right shrink-0">
          <span className="block text-lg font-bold text-slate-900">{o.puntaje}</span>
          <span className="block text-[10px] text-slate-500">Afinidad {etiquetaPuntaje(o.puntaje)}</span>
          {o.nueva && <span className="block text-[10px] font-bold text-slate-900">Nueva</span>}
        </div>
      </div>
      {esFechaValida(o.cierre) && <p data-cierre className={`text-[11px] font-bold ${o.cierre < hoyISO() ? 'text-rose-800' : 'text-slate-900'}`}>{o.cierre < hoyISO() ? `Cerró el ${o.cierre}` : `Cierra el ${o.cierre} · faltan ${diasHabilesEntre(hoyISO(), o.cierre)} día(s) hábil(es)`}</p>}
      {o.razones.length > 0 && <p className="text-[11px] text-slate-700">{o.razones.join(' · ')}</p>}
      {o.alertas.map((a) => <p key={a} className="text-[11px] text-amber-800">{a}</p>)}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {o.enlace && <a href={o.enlace} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold text-slate-700 underline underline-offset-2"><ExternalLink className="w-3.5 h-3.5" /> Abrir en {o.plataforma}</a>}
        <button data-usar={o.id} onClick={() => usar(o)} className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold cursor-pointer">{confirmar === o.id ? 'Confirmar: reemplazar datos del paso 8' : 'Usar en mi propuesta'}</button>
        {extra}
      </div>
    </div>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label="Buscador de oportunidades" data-buscador className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Buscador de oportunidades</h2>
            <p className="text-xs text-slate-500">Configura qué te interesa; el sistema trae los procesos abiertos de SECOP II y los ordena por afinidad con tu empresa.</p>
          </div>
          <button aria-label="Cerrar" onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          {([['BUSCAR', 'Buscar'], ['MIS', `Mis oportunidades (${g.guardadas.length})`]] as const).map(([k, t]) => (
            <button key={k} data-tab={k} onClick={() => setTab(k)} className={`px-3 py-2 text-xs font-bold cursor-pointer border-b-2 ${tab === k ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'}`}>{t}</button>
          ))}
        </div>

        {tab === 'BUSCAR' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <select aria-label="Perfil de búsqueda" value={perfil.id} onChange={(e) => { setG((p) => ({ ...p, activoId: e.target.value })); setResultados(null); }} className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                  {g.perfiles.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
                </select>
                <button data-perfil-nuevo onClick={() => { const n = PERFIL_NUEVO(nuevoId()); setG((p) => ({ ...p, perfiles: [...p.perfiles, n], activoId: n.id })); setResultados(null); }} className="flex items-center gap-1 text-xs font-bold text-slate-700 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Nuevo perfil</button>
                {g.perfiles.length > 1 && <button aria-label="Eliminar perfil" onClick={() => setG((p) => { const r = p.perfiles.filter((x) => x.id !== perfil.id); return { ...p, perfiles: r, activoId: r[0].id }; })} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
                <span className="text-[10px] text-slate-400 flex items-center gap-1"><Save className="w-3 h-3" /> Se guarda solo</span>
              </div>
              <label className="block space-y-1"><span className="text-[11px] font-semibold text-slate-600">Nombre del perfil</span><input data-perfil-nombre className={entrada} value={perfil.nombre} onChange={(e) => cambiar({ nombre: e.target.value })} /></label>
              <label className="block space-y-1"><span className="text-[11px] font-semibold text-slate-600">Códigos UNSPSC (separados por coma; sirve 72, 7214 o 72141000)</span>
                <input data-codigos className={entrada} value={perfil.codigos} onChange={(e) => cambiar({ codigos: e.target.value })} placeholder="Ej: 721015, 8110" />
              </label>
              <button data-tomar-datos onClick={tomarDeMisDatos} className="text-[11px] font-bold text-slate-700 underline underline-offset-2 cursor-pointer">Tomar los códigos de mi experiencia y del pliego</button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1"><span className="text-[11px] font-semibold text-slate-600">Palabras clave (alguna de ellas)</span><input data-palabras className={entrada} value={perfil.palabras} onChange={(e) => cambiar({ palabras: e.target.value })} placeholder="Ej: subestación, alumbrado, fotovoltaico" /></label>
                <label className="block space-y-1"><span className="text-[11px] font-semibold text-slate-600">Excluir si el nombre dice</span><input data-excluir className={entrada} value={perfil.excluir} onChange={(e) => cambiar({ excluir: e.target.value })} placeholder="Ej: interventoría, dotación" /></label>
                <label className="block space-y-1"><span className="text-[11px] font-semibold text-slate-600">Presupuesto mínimo (COP)</span><input data-pmin className={entrada} inputMode="numeric" value={perfil.presupuestoMin} onChange={(e) => cambiar({ presupuestoMin: e.target.value })} /></label>
                <label className="block space-y-1"><span className="text-[11px] font-semibold text-slate-600">Presupuesto máximo (COP)</span><input data-pmax className={entrada} inputMode="numeric" value={perfil.presupuestoMax} onChange={(e) => cambiar({ presupuestoMax: e.target.value })} /></label>
              </div>
              {cr && <p className="text-[10px] text-slate-500">Tu capacidad residual calculada es {cop(cr.crCOP)}: los procesos que la superen se marcan con alerta.</p>}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Modalidades</span>
                <div className="flex flex-wrap gap-2">
                  {MODALIDADES_BUSQUEDA.map((m) => (
                    <label key={m.id} className={`px-3 py-1.5 rounded-full border text-[11px] cursor-pointer ${perfil.modalidades.includes(m.id) ? 'border-slate-900 bg-slate-50 font-bold' : 'border-slate-200 text-slate-600'}`}>
                      <input type="checkbox" data-modalidad={m.id} className="sr-only" checked={perfil.modalidades.includes(m.id)} onChange={() => cambiar({ modalidades: alternar(perfil.modalidades, m.id) })} />{m.etiqueta}
                    </label>
                  ))}
                </div>
              </div>
              <details className="text-xs">
                <summary className="cursor-pointer font-bold text-slate-800">Departamentos {perfil.departamentos.length ? `(${perfil.departamentos.length})` : '(todo el país)'}</summary>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DEPARTAMENTOS.map((dep) => (
                    <label key={dep} className={`px-3 py-1 rounded-full border text-[11px] cursor-pointer ${perfil.departamentos.includes(dep) ? 'border-slate-900 bg-slate-50 font-bold' : 'border-slate-200 text-slate-600'}`}>
                      <input type="checkbox" data-dep={dep} className="sr-only" checked={perfil.departamentos.includes(dep)} onChange={() => cambiar({ departamentos: alternar(perfil.departamentos, dep) })} />{dep}
                    </label>
                  ))}
                </div>
              </details>
              <label className="block space-y-1 max-w-[220px]"><span className="text-[11px] font-semibold text-slate-600">Publicadas en los últimos</span>
                <select data-dias className={entrada} value={perfil.dias} onChange={(e) => cambiar({ dias: Number(e.target.value) })}>{[7, 15, 30, 60, 90].map((n) => <option key={n} value={n}>{n} días</option>)}</select>
              </label>
              <button data-buscar onClick={buscar} disabled={estado === 'CARGANDO'} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer disabled:opacity-50"><Search className="w-4 h-4" /> {estado === 'CARGANDO' ? 'Buscando en SECOP II…' : 'Buscar en SECOP II'}</button>
            </div>

            {estado === 'ERROR' && <p data-error className="text-xs p-3 rounded-2xl border border-rose-200 text-rose-800">No se pudo consultar los datos abiertos de SECOP II (sin conexión o el servicio no respondió). Tu perfil quedó guardado: intenta de nuevo, o busca directo en SECOP II con las mismas palabras y regístralo abajo.</p>}

            {resultados && (
              <div data-resultados className="space-y-3">
                <p className="text-xs text-slate-600">{resultados.length} proceso(s) abierto(s) con ese perfil, ordenados por afinidad{resultados.length >= 150 ? ' (se muestran los 150 más recientes: afina el perfil)' : ''}. Datos abiertos de SECOP II: pueden tardar en actualizarse; confirma siempre en el proceso.</p>
                {resultados.length === 0 && <p className="text-xs text-slate-500">Nada coincide. Amplía los días, quita palabras o usa un código más corto (por ejemplo 72 en vez de 721015).</p>}
                {resultados.map((o) => <Tarjeta key={o.id} o={o} extra={<button data-guardar={o.id} disabled={yaGuardada(o.id)} onClick={() => guardar(o)} className="text-[11px] font-bold text-slate-700 underline underline-offset-2 cursor-pointer disabled:opacity-40">{yaGuardada(o.id) ? 'Guardada' : 'Guardar'}</button>} />)}
              </div>
            )}

            <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
              <strong className="text-xs text-slate-900">Otras plataformas</strong>
              <p className="text-[11px] text-slate-600">No publican una consulta abierta que este simulador pueda leer. Entra con tus palabras clave y registra aquí lo que encuentres para compararlo con lo demás.</p>
              <button onClick={copiarPalabras} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 cursor-pointer"><Copy className="w-3.5 h-3.5" /> {copiado ? 'Copiado' : 'Copiar mis palabras y códigos'}</button>
              <ul className="space-y-2">
                {OTRAS_PLATAFORMAS.map((pl) => (
                  <li key={pl.id} className="text-[11px] text-slate-700"><a href={pl.url} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">{pl.etiqueta}</a><span className="block text-slate-500">{pl.como}</span></li>
                ))}
              </ul>
              <div className="pt-2 space-y-2">
                <strong className="text-[11px] text-slate-800">Registrar una oportunidad que encontraste</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select aria-label="Plataforma" className={entrada} value={manual.plataforma} onChange={(e) => setManual({ ...manual, plataforma: e.target.value })}>{['SAP Ariba', 'Suplos', 'Tienda Virtual del Estado', 'SECOP I', 'Portal propio', 'Otra'].map((x) => <option key={x}>{x}</option>)}</select>
                  <input aria-label="Entidad" placeholder="Entidad" className={entrada} value={manual.entidad} onChange={(e) => setManual({ ...manual, entidad: e.target.value })} />
                  <input aria-label="Objeto" data-manual-objeto placeholder="Objeto" className={entrada + ' sm:col-span-2'} value={manual.objeto} onChange={(e) => setManual({ ...manual, objeto: e.target.value })} />
                  <input aria-label="Valor" placeholder="Valor (COP)" className={entrada} value={manual.valor} onChange={(e) => setManual({ ...manual, valor: e.target.value })} />
                  <input aria-label="Código UNSPSC" placeholder="Código UNSPSC (opcional)" className={entrada} value={manual.codigo} onChange={(e) => setManual({ ...manual, codigo: e.target.value })} />
                  <label className="block space-y-1"><span className="text-[10px] text-slate-500">Publicación</span><input aria-label="Fecha" type="date" className={entrada} value={manual.publicada} onChange={(e) => setManual({ ...manual, publicada: e.target.value })} /></label>
                  <label className="block space-y-1"><span className="text-[10px] text-slate-500">Cierre de ofertas</span><input aria-label="Fecha de cierre" type="date" className={entrada} value={manual.cierre} onChange={(e) => setManual({ ...manual, cierre: e.target.value })} /></label>
                  <input aria-label="Enlace" placeholder="Enlace (opcional)" className={entrada} value={manual.enlace} onChange={(e) => setManual({ ...manual, enlace: e.target.value })} />
                </div>
                <button data-manual-agregar onClick={agregarManual} className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer">Agregar a mis oportunidades</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'MIS' && (
          <div data-mis className="space-y-3">
            {g.guardadas.length === 0 && <p className="text-xs text-slate-500">Aún no guardas oportunidades. Guarda las que te interesen desde los resultados o regístralas desde otras plataformas.</p>}
            {g.guardadas.map((s) => {
              const o = puntuar(s.op, perfil, ctx);
              return (
                <div key={s.op.id} data-guardada={s.op.id} className="space-y-2">
                  <Tarjeta o={o} extra={<button aria-label="Quitar" onClick={() => setG((p) => ({ ...p, guardadas: p.guardadas.filter((x) => x.op.id !== s.op.id) }))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>} />
                  <div className="flex flex-wrap items-center gap-2 px-1">
                    <select data-estado aria-label="Estado" value={s.estado} onChange={(e) => setG((p) => ({ ...p, guardadas: p.guardadas.map((x) => (x.op.id === s.op.id ? { ...x, estado: e.target.value as EstadoSeguimiento } : x)) }))} className="px-2 py-1 rounded-lg border border-slate-300 text-[11px] bg-white">{ESTADOS.map((e) => <option key={e.id} value={e.id}>{e.t}</option>)}</select>
                    <input aria-label="Nota" placeholder="Nota" value={s.nota} onChange={(e) => setG((p) => ({ ...p, guardadas: p.guardadas.map((x) => (x.op.id === s.op.id ? { ...x, nota: e.target.value } : x)) }))} className="flex-1 min-w-[160px] px-2 py-1 rounded-lg border border-slate-300 text-[11px] bg-white" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
