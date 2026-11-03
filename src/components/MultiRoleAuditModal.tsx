// Modal Interactivo de Ejecución de Auditoría Multirol (26 Interesados)
import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Download,
  RotateCcw,
  Award,
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import { MultiRoleAuditRunnerEngine } from '../core/engines/MultiRoleAuditRunnerEngine';
import type { DictamenAuditoriaMultirol, PruebaInteresadoResultado } from '../core/engines/MultiRoleAuditRunnerEngine';

interface MultiRoleAuditModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const MultiRoleAuditModal: React.FC<MultiRoleAuditModalProps> = ({ abierto, onCerrar }) => {
  const { procesos, procesoSeleccionadoId, seleccionarProceso, proveedores, proveedorActivoId, registrarAuditoria } = useProcurementStore();

  const proceso = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];
  const proponente = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];

  // Estado de la ejecución de auditoría
  const [dictamen, setDictamen] = useState<DictamenAuditoriaMultirol>(() =>
    MultiRoleAuditRunnerEngine.ejecutarAuditoria(proceso, proponente)
  );

  const [ejecutandoEscaneo, setEjecutandoEscaneo] = useState(false);
  const [progresoEscaneo, setProgresoEscaneo] = useState(100);
  const [clusterFiltro, setClusterFiltro] = useState<string>('TODOS');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState<string>('');
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState<PruebaInteresadoResultado>(dictamen.pruebas[0]);

  // Si cambia el proceso, re-ejecutar auditoría
  useEffect(() => {
    if (proceso && proponente) {
      const nuevoDictamen = MultiRoleAuditRunnerEngine.ejecutarAuditoria(proceso, proponente);
      setDictamen(nuevoDictamen);
      setPruebaSeleccionada(nuevoDictamen.pruebas[0]);
    }
  }, [procesoSeleccionadoId, proveedorActivoId]);

  if (!abierto) return null;

  const ejecutarAuditoriaEnVivo = () => {
    setEjecutandoEscaneo(true);
    setProgresoEscaneo(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      setProgresoEscaneo(step);
      if (step >= 100) {
        clearInterval(interval);
        setEjecutandoEscaneo(false);
        const res = MultiRoleAuditRunnerEngine.ejecutarAuditoria(proceso, proponente);
        setDictamen(res);
        setPruebaSeleccionada(res.pruebas[0]);
        registrarAuditoria(
          'AUDITORÍA MULTIROL',
          `Ejecución de Auditoría Integral (26 Interesados) en ${proceso.numeroProceso}`,
          `Índice de conformidad: ${res.indiceConformidadPct}%. ${res.aprobadas} Aprobadas, ${res.advertencias} Advertencias.`,
          'AUDITOR'
        );
      }
    }, 120);
  };

  const exportarDictamenJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dictamen, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Dictamen_Auditoria_Multirol_${proceso.numeroProceso.replace(/\//g, '_')}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const pruebasFiltradas = dictamen.pruebas.filter((p) => {
    const coincideCluster = clusterFiltro === 'TODOS' || p.cluster === clusterFiltro;
    const coincideEstado = estadoFiltro === 'TODOS' || p.estadoPrueba === estadoFiltro;
    const coincideTexto =
      p.rolNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.criterioEvaluado.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.normativa.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.evidenciaEncontrada.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCluster && coincideEstado && coincideTexto;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden font-sans">
        {/* Cabecera Principal */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between border-b border-indigo-900 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-100">
                  Ejecutor de Auditoría Multirol en Vivo (26 Interesados)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {dictamen.calificacionGeneral}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluación automatizada de 26 perfiles sobre el proceso activo: <strong>{proceso.numeroProceso}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Selector del Proceso a Auditar */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Proceso:</span>
              <select
                value={procesoSeleccionadoId}
                onChange={(e) => seleccionarProceso(e.target.value)}
                className="bg-slate-800 text-white font-medium border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {procesos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.numeroProceso} - {p.modalidad.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onCerrar}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel Superior: Scorecard de Resultados y Lanzador de Auditoría */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Métrica 1: Índice de Conformidad */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Índice de Conformidad
              </span>
              <div className="text-2xl font-black text-indigo-900 mt-0.5">
                {dictamen.indiceConformidadPct}%
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                {dictamen.calificacionGeneral}
              </span>
            </div>

            {/* Métrica 2: Aprobadas */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Pruebas Aprobadas
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {dictamen.aprobadas} / 26
              </div>
              <span className="text-[10px] text-slate-400">Cumplimiento total</span>
            </div>

            {/* Métrica 3: Advertencias */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Advertencias Menores
              </span>
              <div className="text-2xl font-black text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                {dictamen.advertencias}
              </div>
              <span className="text-[10px] text-slate-400">Sujeto a mitigación</span>
            </div>

            {/* Métrica 4: No Conformes */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                No Conformes / Críticas
              </span>
              <div className="text-2xl font-black text-rose-600 mt-0.5 flex items-center justify-center gap-1">
                <XCircle className="w-5 h-5 text-rose-600" />
                {dictamen.noConformes}
              </div>
              <span className="text-[10px] text-slate-400">Riesgos jurídicos</span>
            </div>

            {/* Botón Acción: Re-ejecutar Auditoría en Vivo */}
            <div className="space-y-1.5">
              <button
                onClick={ejecutarAuditoriaEnVivo}
                disabled={ejecutandoEscaneo}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
              >
                {ejecutandoEscaneo ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Escaneando {progresoEscaneo}%...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Ejecutar Auditoría en Vivo
                  </>
                )}
              </button>

              <button
                onClick={exportarDictamenJSON}
                className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar Dictamen (JSON)
              </button>
            </div>
          </div>

          {/* Barra de progreso cuando se ejecuta el escaneo */}
          {ejecutandoEscaneo && (
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-150"
                style={{ width: `${progresoEscaneo}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar interesado, evidencia, norma o módulo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filtros por Clúster */}
          <div className="flex items-center space-x-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {[
              { id: 'TODOS', label: 'Todos (26)' },
              { id: 'PUBLICO', label: 'Entidades' },
              { id: 'PROPONENTE', label: 'Licitantes' },
              { id: 'PRIVADO', label: 'B2B Privado' },
              { id: 'CONTROL', label: 'Control & Veeduría' },
              { id: 'ACADEMIA', label: 'Academia & Estado' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setClusterFiltro(c.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  clusterFiltro === c.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Filtro por Estado */}
          <div className="flex items-center space-x-1">
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="bg-slate-50 border border-slate-300 font-semibold rounded-lg px-2.5 py-1 text-slate-700 text-[11px]"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="APROBADO">Solo Aprobados</option>
              <option value="ADVERTENCIA">Solo Advertencias</option>
              <option value="NO_CONFORME">Solo No Conformes</option>
            </select>
          </div>
        </div>

        {/* Contenedor Principal: 2 Columnas (Lista y Detalle Evidencial) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Columna Izquierda: Lista de las 26 Pruebas */}
          <div className="lg:col-span-5 border-r border-slate-200 overflow-y-auto p-3 space-y-2 max-h-[58vh]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Pruebas Evaluadas ({pruebasFiltradas.length} de 26)
            </span>
            {pruebasFiltradas.map((item) => {
              const seleccionado = pruebaSeleccionada.id === item.id;
              const badgeEstado =
                item.estadoPrueba === 'APROBADO'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : item.estadoPrueba === 'ADVERTENCIA'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300';

              return (
                <div
                  key={item.id}
                  onClick={() => setPruebaSeleccionada(item)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    seleccionado
                      ? 'bg-indigo-50/90 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="truncate pr-2">
                      #{item.id}. {item.rolNombre}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${badgeEstado}`}>
                      {item.estadoPrueba}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-1 mt-1">{item.criterioEvaluado}</p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-indigo-700 font-semibold">{item.moduloAuditado}</span>
                    <span className="text-slate-400 text-[10px]">{item.clusterLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Detalle de Evidencia de la Prueba */}
          <div className="lg:col-span-7 overflow-y-auto p-6 space-y-4 max-h-[58vh] bg-slate-50/50">
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                  Prueba #{pruebaSeleccionada.id} • {pruebaSeleccionada.clusterLabel}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{pruebaSeleccionada.rolNombre}</h3>
              </div>

              <span className={`px-3 py-1 rounded-md text-xs font-bold border ${
                pruebaSeleccionada.estadoPrueba === 'APROBADO'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : pruebaSeleccionada.estadoPrueba === 'ADVERTENCIA'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                Resultado: {pruebaSeleccionada.estadoPrueba}
              </span>
            </div>

            {/* Criterio y Normativa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-slate-500 font-semibold block">Módulo Auditado:</span>
                <span className="font-bold text-indigo-900 font-mono text-xs block">
                  {pruebaSeleccionada.moduloAuditado}
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-slate-500 font-semibold block">Fundamento Normativo:</span>
                <span className="font-bold text-slate-800 text-xs block font-mono">
                  {pruebaSeleccionada.normativa}
                </span>
              </div>
            </div>

            {/* Criterio Evaluado */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm text-xs">
              <span className="font-bold text-slate-800 block">Criterio de Verificación de Auditoría:</span>
              <p className="text-slate-700 leading-relaxed">{pruebaSeleccionada.criterioEvaluado}</p>
            </div>

            {/* Evidencia Real Encontrada en el Proceso Activo */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-sm text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Evidencia Real Encontrada en el Expediente Contractual:
              </span>
              <p className="text-slate-800 leading-relaxed bg-blue-50/60 p-3 rounded-lg border border-blue-200 font-medium">
                {pruebaSeleccionada.evidenciaEncontrada}
              </p>
            </div>

            {/* Recomendación de Control */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Dictamen y Recomendación Técnica:
              </span>
              <p className="text-emerald-900 leading-relaxed">{pruebaSeleccionada.recomendacion}</p>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
          <span>
            Dictamen ejecutado sobre proceso: <strong>{proceso.numeroProceso}</strong> | Objeto: "{proceso.objeto.substring(0, 60)}..."
          </span>
          <span className="font-semibold text-indigo-700">
            Conforme a Estándares de Auditoría Fiscal, Disciplinaria y OCDS
          </span>
        </div>
      </div>
    </div>
  );
};
