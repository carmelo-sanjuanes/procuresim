// Matriz Visual de Riesgos Contractuales (Documento Conpes 3714 & Guía CCE G-MTR-01)
// Mapa de Calor 5x5, Tipificación, Estimación y Asignación de Riesgos
import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  Trash2,
  RotateCcw,
  Layers,
  Scale,
  Building2,
  Users,
  Info,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { RiskMatrixEngine } from '../../core/engines/RiskMatrixEngine';
import type { RiesgoContratacion } from '../../core/domain/types';
import { useProcurementStore } from '../../store/useProcurementStore';

export const RiskMatrixView: React.FC = () => {
  const { procesos, procesoSeleccionadoId } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  const [riesgos, setRiesgos] = useState<RiesgoContratacion[]>(() =>
    RiskMatrixEngine.generarMatrizPredeterminada('SUMINISTRO')
  );

  const [tipoObjetoFiltro, setTipoObjetoFiltro] = useState<
    'SUMINISTRO' | 'OBRA' | 'TECNOLOGIA' | 'CONSULTORIA' | 'SERVICIOS_GENERALES'
  >('SUMINISTRO');

  // Formulario de nuevo riesgo
  const [nuevoRiesgo, setNuevoRiesgo] = useState<Partial<RiesgoContratacion>>({
    tipo: 'OPERACIONAL',
    etapa: 'EJECUCION',
    descripcion: '',
    consecuencia: '',
    probabilidad: 2,
    impacto: 3,
    asignacion: 'CONTRATISTA',
    tratamientoMitigacion: '',
    responsableMonitoreo: 'Supervisor del Contrato'
  });

  const handleCargarMatrizPredefinida = (
    tipo: 'SUMINISTRO' | 'OBRA' | 'TECNOLOGIA' | 'CONSULTORIA' | 'SERVICIOS_GENERALES'
  ) => {
    setTipoObjetoFiltro(tipo);
    setRiesgos(RiskMatrixEngine.generarMatrizPredeterminada(tipo));
  };

  const handleAgregarRiesgo = () => {
    if (!nuevoRiesgo.descripcion?.trim()) return;

    const prob = (nuevoRiesgo.probabilidad || 2) as 1 | 2 | 3 | 4 | 5;
    const imp = (nuevoRiesgo.impacto || 3) as 1 | 2 | 3 | 4 | 5;
    const { calificacion, categoria } = RiskMatrixEngine.calcularNivelRiesgo(prob, imp);

    const r: RiesgoContratacion = {
      id: `RSK-${Date.now().toString().slice(-4)}`,
      tipo: nuevoRiesgo.tipo || 'OPERACIONAL',
      etapa: nuevoRiesgo.etapa || 'EJECUCION',
      descripcion: nuevoRiesgo.descripcion,
      consecuencia: nuevoRiesgo.consecuencia || 'Afectación a la correcta ejecución del objeto contractual.',
      probabilidad: prob,
      impacto: imp,
      calificacion,
      categoria,
      asignacion: nuevoRiesgo.asignacion || 'CONTRATISTA',
      tratamientoMitigacion: nuevoRiesgo.tratamientoMitigacion || 'Póliza de cumplimiento y supervisión técnica.',
      responsableMonitoreo: nuevoRiesgo.responsableMonitoreo || 'Supervisor'
    };

    setRiesgos([...riesgos, r]);
    setNuevoRiesgo({
      tipo: 'OPERACIONAL',
      etapa: 'EJECUCION',
      descripcion: '',
      consecuencia: '',
      probabilidad: 2,
      impacto: 3,
      asignacion: 'CONTRATISTA',
      tratamientoMitigacion: '',
      responsableMonitoreo: 'Supervisor del Contrato'
    });
  };

  const handleEliminarRiesgo = (id: string) => {
    setRiesgos(riesgos.filter((r) => r.id !== id));
  };

  // Conteo para el Mapa de Calor 5x5
  const matrizCalor: Record<string, RiesgoContratacion[]> = {};
  for (let p = 1; p <= 5; p++) {
    for (let i = 1; i <= 5; i++) {
      matrizCalor[`${p}-${i}`] = [];
    }
  }
  riesgos.forEach((r) => {
    const key = `${r.probabilidad}-${r.impacto}`;
    if (matrizCalor[key]) {
      matrizCalor[key].push(r);
    }
  });

  const getEstiloCelda = (p: number, i: number) => {
    const sum = p + i;
    if (sum <= 4) return 'bg-emerald-100/70 border-emerald-300 text-emerald-900';
    if (sum <= 6) return 'bg-amber-100/70 border-amber-300 text-amber-900';
    if (sum <= 8) return 'bg-orange-100/70 border-orange-300 text-orange-900';
    return 'bg-rose-200/80 border-rose-400 text-rose-950 font-bold';
  };

  // Estadísticas
  const totalBajo = riesgos.filter((r) => r.categoria === 'BAJO').length;
  const totalMedio = riesgos.filter((r) => r.categoria === 'MEDIO').length;
  const totalAlto = riesgos.filter((r) => r.categoria === 'ALTO').length;
  const totalExtremo = riesgos.filter((r) => r.categoria === 'EXTREMO').length;

  const asignadosContratista = riesgos.filter((r) => r.asignacion === 'CONTRATISTA').length;
  const asignadosEntidad = riesgos.filter((r) => r.asignacion === 'ENTIDAD').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header de la Matriz de Riesgos */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                MATRIZ VISUAL DE RIESGOS CONTRACTUALES
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                CONPES 3714 / GUÍA CCE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Tipificación, Estimación Probabilística y Asignación de Riesgos Previsibles
            </p>
          </div>
        </div>

        {/* Selector de plantilla de objeto */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Plantilla Tipo:</span>
          <select
            value={tipoObjetoFiltro}
            onChange={(e) => handleCargarMatrizPredefinida(e.target.value as any)}
            className="bg-slate-800 text-white font-bold text-xs p-2 rounded-xl border border-slate-700 focus:outline-none"
          >
            <option value="SUMINISTRO">Suministro de Bienes</option>
            <option value="OBRA">Obra Pública e Infraestructura</option>
            <option value="TECNOLOGIA">Tecnología & Software</option>
            <option value="CONSULTORIA">Consultoría & Estudios</option>
            <option value="SERVICIOS_GENERALES">Servicios Generales</option>
          </select>
        </div>
      </div>

      {/* 2. Resumen Estadístico y Asignación de Riesgos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Riesgo Bajo</span>
          <div className="text-xl font-black">{totalBajo}</div>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <span className="text-[10px] uppercase font-bold text-amber-700">Riesgo Medio</span>
          <div className="text-xl font-black">{totalMedio}</div>
        </div>
        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900">
          <span className="text-[10px] uppercase font-bold text-orange-700">Riesgo Alto</span>
          <div className="text-xl font-black">{totalAlto}</div>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
          <span className="text-[10px] uppercase font-bold text-rose-700">Riesgo Extremo</span>
          <div className="text-xl font-black">{totalExtremo}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Asumidos Contratista</span>
          <div className="text-xl font-black text-lime-400">{asignadosContratista}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Asumidos Entidad</span>
          <div className="text-xl font-black text-cyan-400">{asignadosEntidad}</div>
        </div>
      </div>

      {/* 3. Mapa de Calor 5x5 (Probabilidad vs Impacto) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              Mapa de Calor 5x5: Nivel de Severidad (Impacto vs. Probabilidad)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Metodología Matriz G-MTR-01 Colombia Compra Eficiente
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] flex">
            {/* Eje Y: Probabilidad */}
            <div className="w-24 shrink-0 flex flex-col justify-between py-2 text-right pr-3 text-[11px] font-bold text-slate-500">
              <span className="h-14 flex items-center justify-end">5 (Muy Alta)</span>
              <span className="h-14 flex items-center justify-end">4 (Alta)</span>
              <span className="h-14 flex items-center justify-end">3 (Media)</span>
              <span className="h-14 flex items-center justify-end">2 (Baja)</span>
              <span className="h-14 flex items-center justify-end">1 (Rara)</span>
            </div>

            {/* Matriz 5x5 */}
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((p) => (
                <div key={p} className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const riesgosCelda = matrizCalor[`${p}-${i}`] || [];
                    return (
                      <div
                        key={i}
                        className={`h-14 p-1.5 rounded-lg border flex flex-col justify-between transition-all ${getEstiloCelda(
                          p,
                          i
                        )}`}
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span>P{p}-I{i}</span>
                          <span className="font-mono font-bold">
                            {riesgosCelda.length > 0 ? `${riesgosCelda.length} r.` : '-'}
                          </span>
                        </div>
                        {riesgosCelda.length > 0 && (
                          <div className="flex gap-1 overflow-hidden">
                            {riesgosCelda.map((r) => (
                              <span
                                key={r.id}
                                title={`${r.id}: ${r.descripcion}`}
                                className="text-[9px] px-1 rounded bg-black/20 font-mono truncate"
                              >
                                {r.id}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Eje X: Impacto */}
              <div className="grid grid-cols-5 gap-1.5 pt-2 text-center text-[11px] font-bold text-slate-500">
                <span>1 (Insignificante)</span>
                <span>2 (Menor)</span>
                <span>3 (Moderado)</span>
                <span>4 (Mayor)</span>
                <span>5 (Catastrófico)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabla Detallada de Riesgos & Planes de Mitigación */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              Inventario de Riesgos Asignados del Proceso
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {riesgos.length} Riesgos Identificados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-2.5">ID / Tipo</th>
                <th className="p-2.5">Etapa</th>
                <th className="p-2.5">Descripción del Riesgo</th>
                <th className="p-2.5 text-center">P x I</th>
                <th className="p-2.5 text-center">Severidad</th>
                <th className="p-2.5 text-center">Asignado A</th>
                <th className="p-2.5">Tratamiento & Mitigación</th>
                <th className="p-2.5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riesgos.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-2.5 font-mono font-bold text-slate-900">
                    <div>{r.id}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{r.tipo}</span>
                  </td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {r.etapa}
                    </span>
                  </td>
                  <td className="p-2.5 max-w-xs">
                    <div className="font-semibold text-slate-800">{r.descripcion}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{r.consecuencia}</div>
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold">
                    {r.probabilidad} x {r.impacto} ({r.calificacion})
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                        r.categoria === 'BAJO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.categoria === 'MEDIO'
                          ? 'bg-amber-100 text-amber-800'
                          : r.categoria === 'ALTO'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.categoria}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        r.asignacion === 'CONTRATISTA'
                          ? 'bg-slate-900 text-lime-400'
                          : r.asignacion === 'ENTIDAD'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {r.asignacion}
                    </span>
                  </td>
                  <td className="p-2.5 max-w-xs text-[11px] text-slate-600">
                    {r.tratamientoMitigacion}
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => handleEliminarRiesgo(r.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Eliminar Riesgo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
