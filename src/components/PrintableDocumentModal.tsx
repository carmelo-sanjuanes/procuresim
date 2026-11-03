// Modal y Visor Imprimible de Documentos Contractuales Formales (PDF / Impresión)
// Estilizado para Actas de Audiencia Pública, Informes de Evaluación y Resoluciones Ley 80
import React, { useRef } from 'react';
import { Printer, Download, X, FileText, CheckCircle2, ShieldCheck, Scale, Award } from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';

export type TipoDocumentoImprimible =
  | 'ACTA_AUDIENCIA_FORMULAS'
  | 'INFORME_EVALUACION_HABILITANTES'
  | 'RESOLUCION_ADJUDICACION';

interface PrintableDocumentModalProps {
  abierto: boolean;
  onCerrar: () => void;
  tipoDocumento: TipoDocumentoImprimible;
  datosExtra?: any;
}

export const PrintableDocumentModal: React.FC<PrintableDocumentModalProps> = ({
  abierto,
  onCerrar,
  tipoDocumento,
  datosExtra
}) => {
  const { procesos, procesoSeleccionadoId, entidades, proveedores } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];
  const entidad = procesoActivo.entidad || entidades[0];

  const printableRef = useRef<HTMLDivElement>(null);

  if (!abierto) return null;

  const handleImprimir = () => {
    window.print();
  };

  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Barra superior de herramientas (No se imprime) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Previsualización e Impresión de Documento Oficial
              </h2>
              <p className="text-xs text-slate-400">
                Formato institucional apto para guardar en PDF o imprimir directamente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleImprimir}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onCerrar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hoja de Documento Imprimible (A4 / Carta) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 text-slate-900 flex justify-center custom-scrollbar">
          <div
            ref={printableRef}
            className="bg-white text-slate-900 shadow-xl rounded-lg p-8 sm:p-12 max-w-[800px] w-full text-xs font-serif leading-relaxed border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-0 print:w-full"
          >
            {/* Encabezado Oficial */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-sans font-bold text-slate-500 tracking-wider">
                  REPÚBLICA DE COLOMBIA
                </span>
                <span className="text-[10px] font-sans font-mono font-bold text-blue-800">
                  SECOP II / OCDS COMPLIANT
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold font-sans uppercase tracking-tight text-slate-900">
                {entidad.nombre}
              </h1>
              <p className="text-[11px] font-sans text-slate-600">
                NIT: {entidad.nit} | {entidad.orden} | {entidad.municipio}, {entidad.departamento}
              </p>
              <div className="mt-2 text-[11px] font-sans font-semibold text-slate-700 bg-slate-100 py-1 px-2 rounded inline-block">
                PROCESO DE CONTRATACIÓN N.°: <span className="font-mono">{procesoActivo.numeroProceso}</span>
              </div>
            </div>

            {/* Contenido según tipo de documento */}
            {tipoDocumento === 'ACTA_AUDIENCIA_FORMULAS' && (
              <div className="space-y-4">
                <div className="text-center font-bold text-sm uppercase underline mb-4">
                  ACTA DE AUDIENCIA PÚBLICA DE DETERMINACIÓN DE FÓRMULA MATEMÁTICA Y EVALUACIÓN ECONÓMICA DE OFERTAS
                </div>

                <p>
                  En la ciudad de <strong>{entidad.municipio}</strong>, a los {fechaHoy}, siendo la hora legal fijada en el cronograma del proceso, se reunieron los miembros del Comité Evaluador de la entidad <strong>{entidad.nombre}</strong> y los proponentes debidamente habilitados, con el fin de llevar a cabo la audiencia pública de apertura del sobre económico y determinación del método de ponderación económica de conformidad con los Documentos Tipo adoptados por la <strong>Agencia Nacional de Contratación Pública - Colombia Compra Eficiente (CCE)</strong>.
                </p>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded font-sans space-y-1 my-3 text-[11px]">
                  <div><strong>Objeto Contractual:</strong> {procesoActivo.objeto}</div>
                  <div><strong>Presupuesto Oficial Estimado:</strong> ${procesoActivo.presupuestoOficial.toLocaleString('es-CO')} COP</div>
                  <div><strong>Método Seleccionado:</strong> Media Geométrica (Pliegos Tipo CCE)</div>
                  <div><strong>Mecanismo de Selección de Fórmula:</strong> Determinación por decimales de la TRM / Sorteo de balotas reglamentario</div>
                </div>

                <h3 className="font-bold text-xs font-sans uppercase border-b border-slate-300 pb-1 mt-4">
                  1. Cuadro Resumen de Calificación y Asignación de Puntajes
                </h3>

                <table className="w-full border-collapse border border-slate-400 font-sans text-[10px] my-3">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-400 p-1.5 text-left">Proponente / Oferente</th>
                      <th className="border border-slate-400 p-1.5 text-right">Valor Oferta (COP)</th>
                      <th className="border border-slate-400 p-1.5 text-center">Puntaje Económico</th>
                      <th className="border border-slate-400 p-1.5 text-center">Puntaje Total</th>
                      <th className="border border-slate-400 p-1.5 text-center">Orden Elegibilidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procesoActivo.ofertasPresentadas.length > 0 ? (
                      procesoActivo.ofertasPresentadas.map((oferta, idx) => (
                        <tr key={oferta.id} className={idx === 0 ? 'bg-emerald-50/60 font-semibold' : ''}>
                          <td className="border border-slate-400 p-1.5">
                            {oferta.proponente?.razonSocial || 'Proponente'}
                          </td>
                          <td className="border border-slate-400 p-1.5 text-right font-mono">
                            ${oferta.valorEconomicoTotal.toLocaleString('es-CO')}
                          </td>
                          <td className="border border-slate-400 p-1.5 text-center font-mono">
                            {oferta.puntajeObtenido?.economico?.toFixed(2) || '60.00'} pts
                          </td>
                          <td className="border border-slate-400 p-1.5 text-center font-mono">
                            {oferta.puntajeObtenido?.total?.toFixed(2) || '95.50'} pts
                          </td>
                          <td className="border border-slate-400 p-1.5 text-center font-bold">
                            {idx + 1}° Lugar
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="border border-slate-400 p-3 text-center text-slate-500">
                          Se registran 4 ofertas económicas en audiencia según el expediente digital.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <p>
                  Habiéndose agotado el procedimiento fijado en el pliego de condiciones y verificado el estricto cumplimiento de los factores de desempate previstos en la <strong>Ley 2069 de 2020</strong>, se procede a dar traslado del informe para las observaciones de ley.
                </p>
              </div>
            )}

            {tipoDocumento === 'INFORME_EVALUACION_HABILITANTES' && (
              <div className="space-y-4">
                <div className="text-center font-bold text-sm uppercase underline mb-4">
                  INFORME CONSOLIDADO DE EVALUACIÓN JURÍDICA, FINANCIERA, ORGANIZACIONAL Y TÉCNICA
                </div>

                <p>
                  El Comité Asesor y Evaluador designado por la entidad <strong>{entidad.nombre}</strong> procede a emitir el dictamen definitivo respecto de los requisitos de participación y habilitación contenidos en el pliego de condiciones, tras analizar los certificados del <strong>Registro Único de Proponentes (RUP)</strong> y soportes allegados.
                </p>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded font-sans space-y-1 my-3 text-[11px]">
                  <div><strong>Indicadores Exigidos:</strong> Liquidez ≥ 1.30 | Endeudamiento ≤ 70.0% | Cobertura Intereses ≥ 2.0</div>
                  <div><strong>Capacidad Residual de Contratación:</strong> Verificada según Guía CCE y Decreto 1082 de 2015</div>
                </div>

                <p>
                  Se certifica que los oferentes que cumplieron integralmente con los requisitos habilitantes continúan en el proceso de calificación económica, sin que sea procedente rechazar propuestas por requisitos subsanables no esenciales conforme al artículo 5 de la Ley 1150 de 2007.
                </p>
              </div>
            )}

            {tipoDocumento === 'RESOLUCION_ADJUDICACION' && (
              <div className="space-y-4">
                <div className="text-center font-bold text-sm uppercase underline mb-4">
                  RESOLUCIÓN DE ADJUDICACIÓN N.° 0{Math.floor(Math.random() * 800) + 100} DE 2026
                </div>

                <p className="text-center italic text-[11px]">
                  "Por medio de la cual se adjudica el proceso de contratación pública N.° {procesoActivo.numeroProceso}"
                </p>

                <p>
                  El <strong>{entidad.ordenadorGasto}</strong>, en uso de sus facultades constitucionales y legales, especialmente las conferidas por la Ley 80 de 1993, la Ley 1150 de 2007, el Decreto 1082 de 2015 y demás normas concordantes, y:
                </p>

                <div className="space-y-2 text-justify">
                  <p><strong>CONSIDERANDO:</strong></p>
                  <p>
                    1. Que la entidad adelantó el proceso de selección objetiva cumpliendo los principios de transparencia, economía y responsabilidad.
                  </p>
                  <p>
                    2. Que efectuada la ponderación de las ofertas, el proponente <strong>SANJUANÉS SOLUCIONES S.A.S.</strong> obtuvo el primer lugar en el orden de elegibilidad con un puntaje total consolidado favorable para los fines del Estado.
                  </p>
                  <p><strong>RESUELVE:</strong></p>
                  <p>
                    <strong>ARTÍCULO PRIMERO. ADJUDICAR</strong> el contrato derivado del proceso N.° {procesoActivo.numeroProceso} al proponente <strong>SANJUANÉS SOLUCIONES S.A.S.</strong>, identificado con NIT. 901.458.789-1, por valor de ${procesoActivo.presupuestoOficial.toLocaleString('es-CO')} COP.
                  </p>
                </div>
              </div>
            )}

            {/* Firmas de Autoridad */}
            <div className="pt-12 mt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center font-sans text-[10px]">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <div className="font-bold text-slate-800">{entidad.ordenadorGasto}</div>
                <div className="text-slate-500">Ordenador del Gasto / Representante Legal</div>
              </div>
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <div className="font-bold text-slate-800">Comité Asesor y Evaluador CCE</div>
                <div className="text-slate-500">Evaluador Jurídico, Financiero & Técnico</div>
              </div>
            </div>

            {/* Pie de Página Institucional */}
            <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[9px] font-sans text-slate-400 flex items-center justify-between">
              <span>Plataforma Universal ProcureSim v2.0</span>
              <span className="font-bold text-slate-600">Empowered by Sanjuanés Soluciones</span>
              <span>Constancia de Trámite Ley 80 / SECOP II</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
