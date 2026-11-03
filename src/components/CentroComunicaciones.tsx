// Centro de Comunicaciones: borradores de correos oficiales (mailto / copiar) y alarmas de términos con cuenta regresiva.
import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Copy, Clock } from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import { PLANTILLAS, generarCorreo, construirMailto, LIMITE_MAILTO, type IdPlantilla } from '../core/engines/ComunicacionesOficialesEngine';
import { TerminosProcesalesEngine, type FechasBase, type EstadoAlarma } from '../core/engines/TerminosProcesalesEngine';

// Lo escrito se conserva mientras la aplicación esté abierta
const borradores: Partial<Record<IdPlantilla, Record<string, string>>> = {};
const CLAVE_FECHAS = 'procuresim-alarmas-v1';
const leerFechas = (): FechasBase => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_FECHAS) || '{}');
  } catch {
    return {};
  }
};

const ESTILO_ESTADO: Record<EstadoAlarma, { chip: string; texto: string }> = {
  SIN_FECHA: { chip: 'bg-slate-100 text-slate-500', texto: 'Sin fecha' },
  EN_TERMINO: { chip: 'bg-emerald-100 text-emerald-800', texto: 'En término' },
  URGENTE: { chip: 'bg-amber-100 text-amber-900', texto: 'Urgente' },
  VENCIDO: { chip: 'bg-rose-100 text-rose-800', texto: 'Vencido' }
};

const fmtFecha = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const CentroComunicaciones: React.FC<{ pestanaInicial?: 'NOTIFICACIONES' | 'ALARMAS' }> = ({ pestanaInicial = 'NOTIFICACIONES' }) => {
  const entidadActiva = useProcurementStore((s) => s.expedientes.find((e) => e.id === s.expedienteActivoId)?.entidad ?? '');
  const [pestana, setPestana] = useState<'NOTIFICACIONES' | 'ALARMAS'>(pestanaInicial);
  const [plantilla, setPlantilla] = useState<IdPlantilla>('CITACION_ART86');
  const [datos, setDatos] = useState<Record<string, string>>(() => ({ entidad: entidadActiva, ...(borradores.CITACION_ART86 ?? {}) }));
  const [copiado, setCopiado] = useState(false);
  const [fechas, setFechas] = useState<FechasBase>(leerFechas);
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setAhora(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const elegir = (id: IdPlantilla) => {
    borradores[plantilla] = datos;
    setPlantilla(id);
    setDatos({ entidad: entidadActiva, ...(borradores[id] ?? {}) });
    setCopiado(false);
  };
  const cambiar = (clave: string, valor: string) => {
    const nuevo = { ...datos, [clave]: valor };
    setDatos(nuevo);
    borradores[plantilla] = nuevo;
  };

  const def = PLANTILLAS[plantilla];
  const correo = useMemo(() => generarCorreo(plantilla, datos), [plantilla, datos]);
  const mailto = useMemo(() => construirMailto(correo), [correo]);
  const textoOficial = `Asunto: ${correo.asunto}\n\n${correo.cuerpo}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(textoOficial);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = textoOficial;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2000);
  };

  const alarmas = useMemo(() => TerminosProcesalesEngine.calcularAlarmas(fechas, ahora), [fechas, ahora]);
  const fijarFecha = (clave: keyof FechasBase, valor: string) => {
    const nuevo = { ...fechas, [clave]: valor || undefined };
    setFechas(nuevo);
    try {
      localStorage.setItem(CLAVE_FECHAS, JSON.stringify(nuevo));
    } catch {
      /* sin almacenamiento disponible */
    }
  };
  const claveDe: Record<string, keyof FechasBase> = {
    OBSERVACIONES_PREPLIEGO: 'publicacionPrepliego',
    ADENDAS: 'cierre',
    TRASLADO_EVALUACION: 'publicacionInforme',
    SUSCRIPCION_CONTRATO: 'adjudicacion'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex items-center gap-2 text-xs">
        {(['NOTIFICACIONES', 'ALARMAS'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPestana(p)}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer border ${pestana === p ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {p === 'NOTIFICACIONES' ? 'Notificaciones por correo' : 'Alarmas de términos'}
          </button>
        ))}
      </div>

      {pestana === 'NOTIFICACIONES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(PLANTILLAS) as IdPlantilla[]).map((id) => (
              <button
                key={id}
                onClick={() => elegir(id)}
                aria-pressed={plantilla === id}
                className={`text-left p-3 rounded-2xl border cursor-pointer ${plantilla === id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}
              >
                <strong className="block text-xs text-slate-900">{PLANTILLAS[id].titulo}</strong>
                <span className="text-[10px] text-slate-500">{PLANTILLAS[id].fundamento}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            {def.campos.map((c) => (
              <label key={c.clave} className={`space-y-0.5 ${c.tipo === 'largo' ? 'sm:col-span-2' : ''}`}>
                <span className="text-slate-600">{c.etiqueta}</span>
                {c.tipo === 'largo' ? (
                  <textarea value={datos[c.clave] ?? ''} onChange={(e) => cambiar(c.clave, e.target.value)} rows={3} className="w-full px-2 py-1.5 rounded-lg border border-slate-300" />
                ) : (
                  <input
                    type={c.tipo === 'fecha' ? 'date' : c.tipo === 'hora' ? 'time' : c.tipo === 'correo' ? 'email' : 'text'}
                    value={datos[c.clave] ?? ''}
                    placeholder={c.ejemplo}
                    onChange={(e) => cambiar(c.clave, e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="text-[11px] text-slate-500">
              <strong className="text-slate-700">Para:</strong> {correo.para.join(', ') || '—'} · <strong className="text-slate-700">Asunto:</strong> {correo.asunto}
            </div>
            <pre data-testid="vista-previa-correo" className="whitespace-pre-wrap text-xs text-slate-800 font-sans leading-relaxed">{correo.cuerpo}</pre>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href={mailto} aria-label="Abrir en mi correo" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">
              <Mail className="w-3.5 h-3.5" /> Abrir en mi correo
            </a>
            <button onClick={copiar} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer">
              <Copy className="w-3.5 h-3.5" /> {copiado ? 'Copiado' : 'Copiar texto oficial'}
            </button>
            {mailto.length > LIMITE_MAILTO && (
              <span className="text-[11px] text-amber-800">Texto largo: si tu correo no lo carga completo, usa «Copiar texto oficial».</span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">Es un borrador. Revisa los datos, los términos y los artículos antes de enviar. Adjunta el informe o el acto cuando corresponda.</p>
        </div>
      )}

      {pestana === 'ALARMAS' && (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-500">
            Ingresa las fechas de tu proceso. Los términos se cuentan en días hábiles colombianos (sin sábados, domingos ni festivos) y vencen al terminar el día límite.
          </p>
          {alarmas.map((a) => {
            const clave = claveDe[a.id];
            const est = ESTILO_ESTADO[a.estado];
            return (
              <div key={a.id} data-alarma={a.id} className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <strong className="block text-xs text-slate-900">{a.titulo}</strong>
                    <span className="block text-[11px] text-slate-500">{a.regla}</span>
                    <span className="block text-[10px] text-slate-400">{a.baseLegal}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${est.chip}`}>{est.texto}</span>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label className="text-[11px] space-y-0.5">
                    <span className="text-slate-600 block">{a.etiquetaBase}</span>
                    <input type="date" aria-label={a.etiquetaBase} value={a.fechaBase} onChange={(e) => fijarFecha(clave, e.target.value)} className="px-2 py-1 rounded-lg border border-slate-300" />
                  </label>
                  {a.fechaLimite ? (
                    <div className="text-right text-xs">
                      <span className="block text-slate-500 first-letter:uppercase">{fmtFecha(a.fechaLimite)}</span>
                      <span className="flex items-center justify-end gap-1 font-black text-slate-900" data-cuenta-regresiva>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {a.estado === 'VENCIDO' ? 'Término vencido' : `Faltan ${a.diasHabilesRestantes} día(s) hábil(es) · ${a.horasRestantes} h`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">Ingresa la fecha para ver el vencimiento.</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
