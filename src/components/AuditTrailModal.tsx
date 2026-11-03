// Modal de Auditoría y Trazabilidad (Monitoreo e Interoperabilidad)
import React, { useState } from 'react';
import { X, ShieldAlert, Download, Filter, Search, Clock, UserCheck } from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';

interface AuditTrailModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ abierto, onCerrar }) => {
  const { eventosAuditoria } = useProcurementStore();
  const [filtroRol, setFiltroRol] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState<string>('');

  if (!abierto) return null;

  const eventosFiltrados = eventosAuditoria.filter((ev) => {
    const coincideRol = filtroRol === 'TODOS' || ev.rol === filtroRol;
    const coincideTexto =
      ev.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.detalles.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.modulo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideRol && coincideTexto;
  });

  const exportarAuditoriaJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(eventosAuditoria, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Auditoria_Contratacion_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Bitácora de Auditoría y Trazabilidad OCDS</h2>
              <p className="text-xs text-slate-400">
                Registro inmutable de acciones, aperturas de sobre, subsanaciones y evaluaciones
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportarAuditoriaJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              Exportar Log (JSON)
            </button>
            <button
              onClick={onCerrar}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en la bitácora (acción, módulo, detalles)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 font-medium">Filtrar por Rol:</span>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="TODOS">Todos los Roles</option>
              <option value="ENTIDAD">Entidad Estatal (Comprador)</option>
              <option value="PROVEEDOR">Proponente (Oferente)</option>
              <option value="SISTEMA">Sistema / Automatización</option>
            </select>
          </div>
        </div>

        {/* Tabla de Eventos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {eventosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No se encontraron registros con los criterios aplicados.
            </div>
          ) : (
            eventosFiltrados.map((ev) => {
              const badgeColor =
                ev.rol === 'ENTIDAD'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : ev.rol === 'PROVEEDOR'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-purple-100 text-purple-800 border-purple-200';

              return (
                <div
                  key={ev.id}
                  className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{ev.accion}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeColor}`}>
                          {ev.rol}
                        </span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                          {ev.modulo}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{ev.detalles}</p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400 whitespace-nowrap pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-1 md:pt-0">
                    <div>{ev.fechaHora}</div>
                    <div className="text-slate-500 font-medium">{ev.usuario}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Mostrando {eventosFiltrados.length} de {eventosAuditoria.length} eventos</span>
          <span>Interoperabilidad conforme a OCDS (Open Contracting Data Standard)</span>
        </div>
      </div>
    </div>
  );
};
