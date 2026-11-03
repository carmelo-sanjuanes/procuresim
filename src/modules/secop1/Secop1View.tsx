// Simulador SECOP I - Portal Informativo y de Publicidad Contractual
import React, { useState } from 'react';
import { Search, Download, FileText, Calendar, Building, Info, ExternalLink } from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';

export const Secop1View: React.FC = () => {
  const { procesos, seleccionarProceso, setVista } = useProcurementStore();
  const [departamentoFiltro, setDepartamentoFiltro] = useState('TODOS');
  const [modalidadFiltro, setModalidadFiltro] = useState('TODOS');
  const [busquedaTexto, setBusquedaTexto] = useState('');

  const procesosFiltrados = procesos.filter((p) => {
    const coincideDepto = departamentoFiltro === 'TODOS' || p.entidad.departamento.toLowerCase().includes(departamentoFiltro.toLowerCase());
    const coincideMod = modalidadFiltro === 'TODOS' || p.modalidad === modalidadFiltro;
    const coincideTexto =
      p.numeroProceso.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      p.objeto.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      p.entidad.nombre.toLowerCase().includes(busquedaTexto.toLowerCase());
    return coincideDepto && coincideMod && coincideTexto;
  });

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Cabecera Estilo SECOP I Tradicional */}
      <div className="bg-[#1b4471] text-white px-6 py-4 shadow border-b-4 border-[#e2a828]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#e2a828] text-slate-900 font-black text-xs px-2 py-0.5 rounded">
                SECOP I
              </span>
              <h1 className="text-lg font-bold">
                Sistema Electrónico para la Contratación Pública (Publicidad y Régimen Tradicional)
              </h1>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              Portal informativo de convocatorias públicas, pliegos de condiciones y contratos estatales
            </p>
          </div>

          <div className="bg-[#123052] p-2.5 rounded-lg border border-blue-400/20 text-xs text-blue-100 max-w-sm">
            <span className="font-bold flex items-center gap-1 text-[#e2a828] mb-0.5">
              <Info className="w-3.5 h-3.5" />
              Principio de Publicidad (Ley 80 / Ley 1150):
            </span>
            En SECOP I las ofertas se radican en urna física o ventanilla de la entidad. La plataforma opera como repositorio público de actos y documentos.
          </div>
        </div>
      </div>

      {/* Contenedor y Formulario de Búsqueda Avanzada */}
      <div className="max-w-7xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Filtros de Consulta */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b pb-2">
            <Search className="w-4 h-4 text-blue-700" />
            Criterios de Búsqueda en el Portal Histórico de SECOP I
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Palabra Clave o Número:</label>
              <input
                type="text"
                placeholder="Ej. Computadores, LP-001, Tunja..."
                value={busquedaTexto}
                onChange={(e) => setBusquedaTexto(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Departamento:</label>
              <select
                value={departamentoFiltro}
                onChange={(e) => setDepartamentoFiltro(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded font-medium"
              >
                <option value="TODOS">Todos los Departamentos</option>
                <option value="Valle">Valle del Cauca</option>
                <option value="Boyacá">Boyacá</option>
                <option value="Cundinamarca">Cundinamarca / Bogotá</option>
                <option value="Antioquia">Antioquia</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Modalidad de Selección:</label>
              <select
                value={modalidadFiltro}
                onChange={(e) => setModalidadFiltro(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded font-medium"
              >
                <option value="TODOS">Todas las Modalidades</option>
                <option value="LICITACION_PUBLICA">Licitación Pública</option>
                <option value="SELECCION_ABREVIADA_MENOR_CUANTIA">Selección Abreviada</option>
                <option value="CONCURSO_MERITOS">Concurso de Méritos</option>
                <option value="MINIMA_CUANTIA">Mínima Cuantía</option>
                <option value="CONTRATACION_DIRECTA">Contratación Directa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados de la Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">
              Registros Encontrados: {procesosFiltrados.length}
            </span>
            <span className="text-slate-500">
              Orden cronológico descendente por fecha de apertura
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {procesosFiltrados.map((proceso) => (
              <div key={proceso.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 inline-block">
                      {proceso.numeroProceso}
                    </span>
                    <span className="ml-2 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {proceso.modalidad.replace(/_/g, ' ')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{proceso.objeto}</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Entidad: <strong>{proceso.entidad.nombre}</strong> ({proceso.entidad.municipio}, {proceso.entidad.departamento})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Cuantía Estimada:</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      \$ {proceso.presupuestoOficial.toLocaleString('es-CO')} COP
                    </span>
                    <span className="text-[10px] block font-semibold text-emerald-700 mt-0.5">
                      Estado: {proceso.estado.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Tabla de Documentos Asociados en SECOP I */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-2">
                    Documentos Precontractuales Publicados:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-rose-500" />
                        <span>Estudios_Previos.pdf</span>
                      </div>
                      <span className="text-[10px] text-slate-400">PDF</span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>Pliego_Condiciones.pdf</span>
                      </div>
                      <span className="text-[10px] text-slate-400">PDF</span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span>Matriz_Riesgos_CCE.xlsx</span>
                      </div>
                      <span className="text-[10px] text-slate-400">XLSX</span>
                    </div>
                  </div>
                </div>

                {/* Botón de Interacción */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      seleccionarProceso(proceso.id);
                      setVista('GENERADOR_DOCUMENTOS');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Generar Documentos Oficiales en Word (.docx)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
