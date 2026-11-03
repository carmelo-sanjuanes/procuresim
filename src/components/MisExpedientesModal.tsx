// Bandeja «Mis Procesos»: expedientes guardados del flujo paso a paso (reanudar, duplicar, eliminar, exportar e importar).
import React, { useRef, useState } from 'react';
import { X, FolderOpen, Copy, Trash2, Play, Download, Upload, Plus } from 'lucide-react';
import { saveAs } from 'file-saver';
import { useProcurementStore } from '../store/useProcurementStore';
import { soundEffects } from '../utils/soundEffects';
import { totalPasosDe, MAX_BYTES_IMPORTACION } from '../core/domain/expedientes';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

const fmtCOP = (n: number) => (n > 0 ? '$' + n.toLocaleString('es-CO') : 'Sin presupuesto');
const fmtFecha = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
};
const guardarAhora = () => window.dispatchEvent(new Event('procuresim:guardar-expediente'));

export const MisExpedientesModal: React.FC<Props> = ({ abierto, onCerrar }) => {
  const expedientes = useProcurementStore((s) => s.expedientes);
  const activoId = useProcurementStore((s) => s.expedienteActivoId);
  const [confirmarId, setConfirmarId] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const entrada = useRef<HTMLInputElement>(null);

  if (!abierto) return null;
  const st = () => useProcurementStore.getState();

  const reanudar = (id: string) => {
    soundEffects.playClick();
    guardarAhora();
    st().reanudarExpediente(id);
    onCerrar();
  };
  const duplicar = (id: string) => {
    soundEffects.playClick();
    guardarAhora();
    st().duplicarExpediente(id);
    setAviso({ tipo: 'ok', texto: 'Copia creada.' });
  };
  const eliminar = (id: string) => {
    if (confirmarId !== id) {
      setConfirmarId(id);
      return;
    }
    soundEffects.playClick();
    st().eliminarExpediente(id);
    setConfirmarId(null);
    setAviso({ tipo: 'ok', texto: 'Expediente eliminado.' });
  };
  const nuevo = () => {
    soundEffects.playClick();
    guardarAhora();
    st().nuevoLienzo();
    onCerrar();
  };
  const exportar = (ids?: string[]) => {
    guardarAhora();
    const json = st().exportarExpedientesJSON(ids);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const marca = new Date().toISOString().slice(0, 10);
    saveAs(blob, ids && ids.length === 1 ? `ProcureSim_expediente_${ids[0]}.json` : `ProcureSim_expedientes_${marca}.json`);
  };
  const importar = async (archivo: File | undefined) => {
    if (!archivo) return;
    if (archivo.size > MAX_BYTES_IMPORTACION) {
      setAviso({ tipo: 'error', texto: 'El archivo supera los 8 MB y no se importó.' });
      return;
    }
    const r = st().importarExpedientesJSON(await archivo.text());
    if (!r.ok) setAviso({ tipo: 'error', texto: 'El archivo no es un respaldo de expedientes de ProcureSim.' });
    else setAviso({ tipo: 'ok', texto: `Se importaron ${r.importados} expediente(s)${r.omitidos ? `; ${r.omitidos} se omitieron por formato inválido` : ''}.` });
    if (entrada.current) entrada.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/75 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Mis expedientes">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[88vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-slate-500" />
            <div>
              <h2 className="text-sm font-black text-slate-900">Mis expedientes</h2>
            </div>
          </div>
          <button onClick={onCerrar} aria-label="Cerrar" className="p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-3 flex flex-wrap items-center gap-2 border-b border-slate-100 text-xs">
          <button onClick={nuevo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Nuevo expediente
          </button>
          <button onClick={() => exportar()} disabled={expedientes.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 disabled:opacity-40 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Exportar todos (.json)
          </button>
          <button onClick={() => entrada.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Importar (.json)
          </button>
          <input ref={entrada} type="file" accept="application/json,.json" aria-label="Importar expedientes" className="hidden" onChange={(e) => importar(e.target.files?.[0])} />
        </div>

        {aviso && (
          <div role="status" className={`mx-6 mt-3 px-3 py-2 rounded-xl text-xs border ${aviso.tipo === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
            {aviso.texto}
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-3">
          {expedientes.length === 0 && (
            <div className="text-center text-xs text-slate-400 py-10">Sin expedientes</div>
          )}
          {expedientes.map((e) => {
            const pct = Math.round((e.paso / totalPasosDe(e.tipoOperacion)) * 100);
            return (
              <div key={e.id} data-expediente-id={e.id} className={`rounded-2xl border p-4 space-y-2 ${e.id === activoId ? 'border-sky-300 bg-sky-50/40' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <strong className="block text-xs text-slate-900 truncate" title={e.objeto}>{e.objeto}</strong>
                    <span className="block text-[11px] text-slate-600 truncate">
                      {e.entidad || 'Entidad sin definir'} · {fmtCOP(e.presupuestoCOP)}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">
                      {e.tipoOperacion === 'VENDO' ? 'Contratista' : e.tipoOperacion === 'COMPRO' ? 'Entidad compradora' : 'Rol sin definir'} · {e.modalidad || 'Modalidad por definir'}
                    </span>
                  </div>
                  {e.id === activoId && <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full shrink-0">Abierto</span>}
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-800">{e.etiquetaPaso}</span>
                    <span className="text-slate-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${e.liquidado ? 'bg-emerald-500' : 'bg-slate-800'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-400">Creado {fmtFecha(e.creadoEn)} · actualizado {fmtFecha(e.actualizadoEn)}</span>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <button onClick={() => reanudar(e.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold cursor-pointer"><Play className="w-3 h-3" /> Reanudar</button>
                    <button onClick={() => duplicar(e.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-slate-700 cursor-pointer"><Copy className="w-3 h-3" /> Duplicar</button>
                    <button onClick={() => exportar([e.id])} aria-label={`Exportar ${e.objeto}`} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-slate-700 cursor-pointer"><Download className="w-3 h-3" /> Exportar</button>
                    <button onClick={() => eliminar(e.id)} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${confirmarId === e.id ? 'bg-rose-600 border-rose-600 text-white' : 'border-rose-200 text-rose-700'}`}>
                      <Trash2 className="w-3 h-3" /> {confirmarId === e.id ? '¿Confirmar?' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
