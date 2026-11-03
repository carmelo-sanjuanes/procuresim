// Motor de Generación de Documentos Precontractuales y Contractuales (Ley 80 / 1150 / Dcto 1082)
import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Building,
  Shield,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { DocumentEngine } from '../../core/engines/DocumentEngine';

export const DocumentGeneratorView: React.FC = () => {
  const { procesos, procesoSeleccionadoId, seleccionarProceso } = useProcurementStore();
  const [tipoDocumento, setTipoDocumento] = useState<'ESTUDIOS_PREVIOS' | 'MATRIZ_RIESGOS' | 'PLIEGO' | 'MINUTA'>('ESTUDIOS_PREVIOS');
  const [copiado, setCopiado] = useState(false);
  const [descargando, setDescargando] = useState(false);

  const proceso = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  const handleDescargarWord = async () => {
    try {
      setDescargando(true);
      await DocumentEngine.descargarEstudiosPreviosWord(proceso);
    } catch (err) {
      console.error('Error generando archivo Word:', err);
      alert('Error generando archivo Word');
    } finally {
      setDescargando(false);
    }
  };

  const textoEstudiosPrevios = DocumentEngine.generarTextoEstudiosPrevios(proceso);

  const handleCopiarTexto = () => {
    navigator.clipboard.writeText(textoEstudiosPrevios);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Cabecera del Motor Documental */}
      <div className="bg-[#1e1b4b] text-white px-6 py-4 shadow border-b border-indigo-900 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 text-white p-2 rounded-lg shadow">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold">Motor de Estructuración y Redacción Documental Ley 80</h1>
            <p className="text-xs text-indigo-200">
              Generador dinámico de Estudios Previos, Matrices CONPES 3714 y Pliegos Tipo descargables en Word (.docx)
            </p>
          </div>
        </div>

        {/* Selector de Proceso Base */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-indigo-200">Proceso Base:</span>
          <select
            value={procesoSeleccionadoId}
            onChange={(e) => seleccionarProceso(e.target.value)}
            className="bg-indigo-950 text-white font-medium border border-indigo-700 rounded px-2.5 py-1 focus:outline-none"
          >
            {procesos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.numeroProceso} - {p.modalidad.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 text-xs">
        {/* Panel Lateral: Selector de Tipo de Documento */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4 lg:col-span-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b">
            Documentos Precontractuales
          </h2>

          <div className="space-y-1.5">
            {[
              { id: 'ESTUDIOS_PREVIOS', label: 'Estudios y Documentos Previos', desc: 'Decreto 1082 / Art. 2.2.1.1.2.1.1' },
              { id: 'MATRIZ_RIESGOS', label: 'Matriz de Riesgos CCE', desc: 'Metodología CONPES 3714' },
              { id: 'PLIEGO', label: 'Pliego de Condiciones Definitivo', desc: 'Requisitos y ponderación de puntajes' },
              { id: 'MINUTA', label: 'Minuta del Contrato Estatal', desc: 'Cláusulas exorbitantes Ley 80' }
            ].map((doc) => (
              <button
                key={doc.id}
                onClick={() => setTipoDocumento(doc.id as any)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  tipoDocumento === doc.id
                    ? 'bg-indigo-50 border-indigo-500 font-bold text-indigo-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs">{doc.label}</span>
                <span className="text-[10px] text-slate-400 font-normal">{doc.desc}</span>
              </button>
            ))}
          </div>

          {/* Botones de Exportación Directa */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handleDescargarWord}
              disabled={descargando}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              {descargando ? 'Generando Word...' : 'Descargar en Word (.docx)'}
            </button>

            <button
              onClick={handleCopiarTexto}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiado ? '¡Copiado al Portapapeles!' : 'Copiar Texto Completo'}
            </button>
          </div>
        </div>

        {/* Panel Central: Vista Previa Formateada del Documento */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-3 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded uppercase">
                {tipoDocumento.replace(/_/g, ' ')}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">
                {proceso.numeroProceso} - {proceso.entidad.nombre}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Vigencia Fiscal: 2025 | Presupuesto: \$ {proceso.presupuestoOficial.toLocaleString('es-CO')}
            </span>
          </div>

          {/* Contenido Renderizado */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-[12px] leading-relaxed text-slate-800 whitespace-pre-wrap">
            {tipoDocumento === 'ESTUDIOS_PREVIOS' && textoEstudiosPrevios}

            {tipoDocumento === 'MATRIZ_RIESGOS' && (
              <div className="font-sans space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  MATRIZ DE RIESGOS PRECONTRACTUAL Y CONTRACTUAL (CONPES 3714 / CCE)
                </h4>
                <p className="text-slate-600 text-xs">
                  Tipificación, valoración de probabilidad e impacto, y asignación de contingencias.
                </p>

                <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2.5">Código</th>
                        <th className="p-2.5">Tipo</th>
                        <th className="p-2.5">Descripción del Riesgo</th>
                        <th className="p-2.5">Prob.</th>
                        <th className="p-2.5">Imp.</th>
                        <th className="p-2.5">Nivel</th>
                        <th className="p-2.5">Asignación</th>
                        <th className="p-2.5">Medida de Mitigación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {proceso.riesgos.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-blue-800">{r.id}</td>
                          <td className="p-2.5 font-semibold text-slate-600">{r.tipo}</td>
                          <td className="p-2.5 max-w-xs">{r.descripcion}</td>
                          <td className="p-2.5 font-bold text-center">{r.probabilidad}</td>
                          <td className="p-2.5 font-bold text-center">{r.impacto}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.categoria === 'BAJO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.categoria === 'MEDIO'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {r.categoria}
                            </span>
                          </td>
                          <td className="p-2.5 font-bold text-indigo-800">{r.asignacion}</td>
                          <td className="p-2.5 max-w-xs text-slate-600 text-[11px]">{r.tratamientoMitigacion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tipoDocumento === 'PLIEGO' && (
              <div className="font-sans space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  PLIEGO DE CONDICIONES DEFINITIVO - {proceso.numeroProceso}
                </h4>
                <p className="text-slate-700">
                  <strong>CAPÍTULO I: INFORMACIÓN GENERAL Y REGLAS DE PARTICIPACIÓN</strong><br />
                  La {proceso.entidad.nombre} invita a todas las personas naturales, jurídicas, consorcios y uniones temporales que cumplan los requisitos de habilitación a presentar oferta técnica y económica.
                </p>
                <p className="text-slate-700">
                  <strong>CAPÍTULO II: REQUISITOS HABILITANTES</strong><br />
                  • Capacidad Jurídica: RUP vigente y en firme.<br />
                  • Capacidad Financiera: Índice de Liquidez &gt;= {proceso.requisitosHabilitantes.indiceLiquidezMinimo}, Endeudamiento &lt;= {proceso.requisitosHabilitantes.nivelEndeudamientoMaximoPct}%.<br />
                  • Capacidad Técnica: {proceso.requisitosHabilitantes.numeroContratosAcreditar} contratos que sumen {proceso.requisitosHabilitantes.sumatoriaSMMLVMinima} SMMLV en códigos UNSPSC {proceso.requisitosHabilitantes.codigosUNSPSCExigidos.join(', ')}.
                </p>
                <p className="text-slate-700">
                  <strong>CAPÍTULO III: CRITERIOS DE ASIGNACIÓN DE PUNTAJE (100 PUNTOS)</strong><br />
                  • Factor Económico: {proceso.criteriosPonderacion.puntajeEconomico} Puntos<br />
                  • Calidad Técnica: {proceso.criteriosPonderacion.puntajeTecnicoCalidad} Puntos<br />
                  • Industria Nacional (Ley 816): {proceso.criteriosPonderacion.puntajeIndustriaNacional} Puntos<br />
                  • Criterio MiPyme (Ley 2069): {proceso.criteriosPonderacion.puntajeMiPyme} Puntos<br />
                  • Vinculación Personal con Discapacidad (Dcto 392): {proceso.criteriosPonderacion.puntajeDiscapacidad} Puntos
                </p>
              </div>
            )}

            {tipoDocumento === 'MINUTA' && (
              <div className="font-sans space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  MINUTA DEL CONTRATO ESTATAL DE {proceso.modalidad.replace(/_/g, ' ')}
                </h4>
                <p className="text-slate-700">
                  Entre los suscritos, por una parte <strong>{proceso.entidad.representanteLegal}</strong>, en calidad de Ordenador del Gasto de <strong>{proceso.entidad.nombre}</strong>, y por la otra parte el <strong>CONTRATISTA ADJUDICATARIO</strong>, se ha convenido celebrar el presente contrato estatal de {proceso.modalidad.replace(/_/g, ' ')}, previas las siguientes cláusulas:
                </p>
                <p className="text-slate-700">
                  <strong>CLÁUSULA PRIMERA. OBJETO:</strong> El CONTRATISTA se obliga para con la Entidad a: "{proceso.objeto}".
                </p>
                <p className="text-slate-700">
                  <strong>CLÁUSULA SEGUNDA. VALOR Y FORMA DE PAGO:</strong> El valor del presente contrato es de \$ {proceso.presupuestoOficial.toLocaleString('es-CO')} COP, amparado por el CDP No. {proceso.cdpNumero}. Los pagos se realizarán contra actas de entrega parciales previa certificación del supervisor.
                </p>
                <p className="text-slate-700">
                  <strong>CLÁUSULA TERCERA. CLÁUSULAS EXORBITANTES:</strong> Al presente contrato se entienden incorporadas las cláusulas excepcionales de interpretación, modificación y terminación unilateral y caducidad administrativa consagradas en los artículos 14 al 18 de la Ley 80 de 1993.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
