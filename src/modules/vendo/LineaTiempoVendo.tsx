import React, { useEffect } from 'react';
import { X, CalendarPlus } from 'lucide-react';
import type { Hito } from '../../core/engines/LineaTiempoVendo';
import { generarICS } from '../../core/engines/LineaTiempoVendo';

const fmt = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};
const cuando = (h: Hito) => (h.estado === 'PASADO' ? 'Ya pasó' : h.estado === 'HOY' ? 'Hoy' : `En ${h.diasHabiles} día(s) hábil(es)`);

export const LineaTiempoVendo: React.FC<{
  hitos: Hito[]; avisos: string[]; titulo: string;
  onCampo: (campo: string, v: string) => void; onIrAlPaso: (paso: number) => void; onCerrar: () => void;
}> = ({ hitos, avisos, titulo, onCampo, onIrAlPaso, onCerrar }) => {
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f);
  }, [onCerrar]);

  const bajar = () => {
    const blob = new Blob([generarICS(hitos, titulo)], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'linea_de_tiempo_venta.ics'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Línea de tiempo de la venta" data-linea className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Línea de tiempo de la venta</h2>
            <p className="text-xs text-slate-500">Se arma sola con las fechas que vas digitando. Las que dicen «editar» se cambian aquí mismo.</p>
          </div>
          <button aria-label="Cerrar" onClick={onCerrar} className="p-2 rounded-xl hover:bg-slate-100 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {avisos.map((a) => <p key={a} data-aviso className="text-xs p-3 rounded-2xl border border-rose-200 text-rose-800">{a}</p>)}

        {hitos.length === 0 ? (
          <div data-linea-vacia className="p-5 rounded-2xl border border-slate-200 text-sm text-slate-600 space-y-3">
            <p>Aún no hay fechas. Empieza con la publicación del proyecto de pliego y el cierre (paso 10): el resto se calcula solo.</p>
            <button onClick={() => onIrAlPaso(10)} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer">Ir al paso 10</button>
          </div>
        ) : (
          <ol className="relative border-l-2 border-slate-200 ml-2 space-y-4">
            {hitos.map((h) => (
              <li key={h.id} data-hito={h.id} data-estado={h.estado} data-proximo={h.proximo ? 'si' : 'no'} className="pl-5 relative">
                <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 ${h.estado === 'PASADO' ? 'bg-slate-300 border-slate-300' : h.proximo ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-500'}`} />
                <div className={`p-3 rounded-2xl border ${h.proximo ? 'border-slate-900' : 'border-slate-200'} ${h.estado === 'PASADO' ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-900">{h.titulo}</span>
                      <span data-fecha className="block text-xs text-slate-700">{fmt(h.fecha)}</span>
                      {h.nota && <span className="block text-[10px] text-slate-500">{h.nota}</span>}
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`block text-[11px] font-bold ${h.estado === 'PROXIMO' || h.estado === 'HOY' ? 'text-slate-900' : 'text-slate-500'}`}>{cuando(h)}</span>
                      {h.proximo && <span className="block text-[10px] font-bold text-slate-900">Siguiente</span>}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    {h.campo && <input aria-label={`Editar: ${h.titulo}`} type="date" value={h.fecha} onChange={(e) => onCampo(h.campo!, e.target.value)} className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white" />}
                    <button onClick={() => onIrAlPaso(h.paso)} className="text-[11px] text-slate-500 hover:text-slate-900 underline underline-offset-2 cursor-pointer">Ver paso {h.paso}</button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}

        {hitos.length > 0 && (
          <div className="pt-2 space-y-2">
            <button data-ics onClick={bajar} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer"><CalendarPlus className="w-4 h-4" /> Agregar todo a mi calendario (.ics)</button>
            <p className="text-[10px] text-slate-400">Cada fecha lleva un recordatorio el día anterior. Los plazos de días hábiles son los del simulador: confírmalos con el pliego.</p>
          </div>
        )}
      </div>
    </div>
  );
};
