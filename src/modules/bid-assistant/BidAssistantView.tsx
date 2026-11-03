// Asistente Inteligente de Presentación y Estructuración de Propuestas (Lado Licitante)
import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Award,
  FileText,
  DollarSign,
  Copy,
  Check,
  Send,
  Users,
  Building,
  Briefcase
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { ProposalAssistantEngine } from '../../core/engines/ProposalAssistantEngine';

export const BidAssistantView: React.FC = () => {
  const {
    procesos,
    procesoSeleccionadoId,
    seleccionarProceso,
    proveedores,
    proveedorActivoId,
    setProveedorActivo,
    radicarOferta,
    setVista
  } = useProcurementStore();

  const proceso = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];
  const proponente = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];

  const [valorOfertadoInput, setValorOfertadoInput] = useState(
    Math.round(proceso?.presupuestoOficial * 0.94) || 200000000
  );
  const [anexoActivo, setAnexoActivo] = useState<'CARTA' | 'CONSORCIO' | 'PARAFISCALES'>('CARTA');
  const [copiado, setCopiado] = useState(false);

  // Ejecutar auditoría en vivo a través del motor
  const diagnostico = ProposalAssistantEngine.auditarPropuesta(
    proponente,
    proceso,
    valorOfertadoInput
  );

  const textoCarta = ProposalAssistantEngine.generarCartaPresentacion(proponente, proceso, valorOfertadoInput);
  const textoConsorcio = ProposalAssistantEngine.generarAcuerdoConsorcial(proponente, proceso);
  const textoParafiscales = ProposalAssistantEngine.generarCertificacionParafiscales(proponente);

  const handleCopiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleRadicarOfertaAuditada = () => {
    radicarOferta(proceso.id, {
      id: `OFR-AUD-${Date.now()}`,
      procesoId: proceso.id,
      proponente,
      fechaRadicacion: new Date().toISOString().replace('T', ' ').substring(0, 16),
      valorEconomicoTotal: valorOfertadoInput,
      desglosePrecios: proceso.items.map((i) => ({
        itemId: i.id,
        precioUnitarioOfertado: Math.round(valorOfertadoInput / (proceso.items.length * i.cantidad)),
        subtotal: Math.round(valorOfertadoInput / proceso.items.length)
      })),
      documentosCargados: [
        { tipo: 'CARTA_PRESENTACION', nombreArchivo: 'Carta_Presentacion_CCE.pdf', estadoValidacion: 'CUMPLE' },
        { tipo: 'RUP', nombreArchivo: 'Certificado_RUP_En_Firme.pdf', estadoValidacion: 'CUMPLE' },
        { tipo: 'PARAFISCALES', nombreArchivo: 'Certificado_Parafiscales_Art50.pdf', estadoValidacion: 'CUMPLE' },
        { tipo: 'PROPUESTA_ECONOMICA', nombreArchivo: 'Desglose_Precios_AIU.xlsx', estadoValidacion: 'CUMPLE' }
      ],
      evaluacionJuridica: 'CUMPLE',
      evaluacionFinanciera: 'CUMPLE',
      evaluacionTecnica: 'CUMPLE',
      puntajeObtenido: diagnostico.puntajeEstimado,
      esGanador: false
    });

    alert('¡Propuesta auditada y radicada exitosamente en SECOP II!');
    setVista('SECOP_II_PROVEEDOR');
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Cabecera del Asistente */}
      <div className="bg-[#2e1065] text-white px-6 py-4 shadow flex flex-wrap items-center justify-between border-b border-purple-900">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 text-white p-2 rounded-lg shadow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold">
              Asistente Inteligente de Presentación de Propuestas (Lado Licitante)
            </h1>
            <p className="text-xs text-purple-200">
              Diagnóstico de habilitación previa, validador de precios y generador automático de anexos tipo
            </p>
          </div>
        </div>

        {/* Selectores Rápidos */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-purple-200">Proponente:</span>
            <select
              value={proveedorActivoId}
              onChange={(e) => setProveedorActivo(e.target.value)}
              className="bg-purple-950 text-white font-medium border border-purple-700 rounded px-2.5 py-1 focus:outline-none"
            >
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.razonSocial}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-purple-200">Licitación:</span>
            <select
              value={procesoSeleccionadoId}
              onChange={(e) => {
                seleccionarProceso(e.target.value);
                const p = procesos.find((pr) => pr.id === e.target.value);
                if (p) setValorOfertadoInput(Math.round(p.presupuestoOficial * 0.94));
              }}
              className="bg-purple-950 text-white font-medium border border-purple-700 rounded px-2.5 py-1 focus:outline-none"
            >
              {procesos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.numeroProceso} ({p.modalidad.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl w-full mx-auto flex-1 space-y-6 text-xs">
        {/* Banner de Diagnóstico Previo */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded uppercase">
                Auditoría Previa a Radicación
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Evaluación de Compatibilidad: {proponente.razonSocial} vs {proceso.numeroProceso}
              </h2>
              <p className="text-slate-500 text-xs">
                Entidad: {proceso.entidad.nombre} | Presupuesto Techo: \$ {proceso.presupuestoOficial.toLocaleString('es-CO')}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold">Dictamen General:</div>
              {diagnostico.puedeRadicar ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  HABILITADO PARA RADICAR
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 font-bold rounded-lg text-sm">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  ALERTAS DETECTADAS (REVISAR)
                </span>
              )}
            </div>
          </div>

          {/* Semaforización de Habilitación en 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* 1. Jurídica */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Capacidad Jurídica</span>
                {diagnostico.habilitacionJuridica.cumple ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {diagnostico.habilitacionJuridica.aspectos.map((asp, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{asp.nombre}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Financiera RUP */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Capacidad Financiera RUP</span>
                {diagnostico.habilitacionFinanciera.resultadoGeneral === 'HABILITADO' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Liquidez:</span>
                  <strong className={diagnostico.habilitacionFinanciera.indiceLiquidez.cumple ? 'text-emerald-700' : 'text-rose-700'}>
                    {diagnostico.habilitacionFinanciera.indiceLiquidez.valor} (Req &gt;= {diagnostico.habilitacionFinanciera.indiceLiquidez.exigido})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Endeudamiento:</span>
                  <strong className={diagnostico.habilitacionFinanciera.nivelEndeudamiento.cumple ? 'text-emerald-700' : 'text-rose-700'}>
                    {diagnostico.habilitacionFinanciera.nivelEndeudamiento.valorPct}% (Req &lt;= {diagnostico.habilitacionFinanciera.nivelEndeudamiento.exigidoPct}%)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Cobertura Intereses:</span>
                  <strong className={diagnostico.habilitacionFinanciera.coberturaIntereses.cumple ? 'text-emerald-700' : 'text-rose-700'}>
                    {diagnostico.habilitacionFinanciera.coberturaIntereses.valor} (Req &gt;= {diagnostico.habilitacionFinanciera.coberturaIntereses.exigido})
                  </strong>
                </div>
              </div>
            </div>

            {/* 3. Técnica y Experiencia */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">Experiencia Acreditada RUP</span>
                {diagnostico.habilitacionTecnica.cumple ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>SMMLV Acreditados:</span>
                  <strong>{diagnostico.habilitacionTecnica.smmlvAcreditados} SMMLV (Req {diagnostico.habilitacionTecnica.smmlvExigidos})</strong>
                </div>
                <div className="flex justify-between">
                  <span>Contratos Válidos:</span>
                  <strong>{diagnostico.habilitacionTecnica.contratosAcreditados} contratos (Req {diagnostico.habilitacionTecnica.contratosExigidos})</strong>
                </div>
                <div>
                  <span>Códigos UNSPSC Coincidentes:</span>
                  <div className="font-mono text-purple-700 font-bold mt-0.5">
                    {diagnostico.habilitacionTecnica.codigosCoincidentes.join(', ') || 'Sin coincidencia'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas Críticas si existen */}
          {diagnostico.alertasCriticas.length > 0 && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
              <span className="font-bold text-rose-900 flex items-center gap-1 text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                Causales de Inadmisibilidad o Rechazo Detectadas:
              </span>
              <ul className="list-disc pl-5 text-[11px] text-rose-800">
                {diagnostico.alertasCriticas.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Simulador Económico y Puntuación Estimada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ajuste de Precio */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Estructurador y Validador de Oferta Económica
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tu Valor de Oferta Total (COP):
              </label>
              <input
                type="number"
                value={valorOfertadoInput}
                onChange={(e) => setValorOfertadoInput(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded font-bold text-base text-blue-900 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {diagnostico.evaluacionEconomica.diagnostico}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Presupuesto Oficial Entidad:</span>
                <span className="font-bold text-slate-900">\$ {proceso.presupuestoOficial.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Porcentaje del Techo:</span>
                <span className="font-bold text-blue-700">{diagnostico.evaluacionEconomica.porcentajeDelPresupuesto}%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Ahorro Propuesto para el Estado:</span>
                <span className="font-bold text-emerald-600">
                  \$ {(proceso.presupuestoOficial - valorOfertadoInput).toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          </div>

          {/* Simulación de Ponderación de Puntajes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Simulación de Puntaje Ponderado
              </span>
              <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
                Total Estimado: {diagnostico.puntajeEstimado.total} / 100 pts
              </span>
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                <span className="text-slate-700">Factor Económico (Precio):</span>
                <span className="font-bold text-slate-900">{diagnostico.puntajeEstimado.economico} pts</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                <span className="text-slate-700">Calidad y Ficha Técnica:</span>
                <span className="font-bold text-slate-900">{diagnostico.puntajeEstimado.calidadTecnica} pts</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                <span className="text-slate-700">Estímulo a la Industria Nacional (Ley 816):</span>
                <span className="font-bold text-emerald-700">{diagnostico.puntajeEstimado.industriaNacional} pts</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                <span className="text-slate-700">Vinculación de Personal con Discapacidad:</span>
                <span className="font-bold text-purple-700">{diagnostico.puntajeEstimado.discapacidad} pts</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                <span className="text-slate-700">Criterio MiPyme (Ley 2069):</span>
                <span className="font-bold text-purple-700">{diagnostico.puntajeEstimado.miPyme} pts</span>
              </div>
            </div>

            <button
              onClick={handleRadicarOfertaAuditada}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shadow transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Send className="w-4 h-4" />
              Radicar Oferta Auditada Directamente en SECOP II
            </button>
          </div>
        </div>

        {/* Generador de Anexos Tipo Listos para Firma */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Generador de Anexos y Formularios Oficiales de la Propuesta
              </h3>
              <p className="text-slate-500 text-[11px]">
                Minutas y cartas redactadas automáticamente según los Documentos Tipo de Colombia Compra Eficiente
              </p>
            </div>

            {/* Selector de Anexo */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setAnexoActivo('CARTA')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  anexoActivo === 'CARTA' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Carta de Presentación
              </button>
              <button
                onClick={() => setAnexoActivo('CONSORCIO')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  anexoActivo === 'CONSORCIO' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Acuerdo Consorcial
              </button>
              <button
                onClick={() => setAnexoActivo('PARAFISCALES')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  anexoActivo === 'PARAFISCALES' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Certificado Parafiscales
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() =>
                handleCopiar(
                  anexoActivo === 'CARTA'
                    ? textoCarta
                    : anexoActivo === 'CONSORCIO'
                    ? textoConsorcio
                    : textoParafiscales
                )
              }
              className="absolute top-3 right-3 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded shadow-sm font-semibold text-slate-700 flex items-center gap-1 z-10"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiado ? 'Copiado' : 'Copiar Texto'}
            </button>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {anexoActivo === 'CARTA' && textoCarta}
              {anexoActivo === 'CONSORCIO' && textoConsorcio}
              {anexoActivo === 'PARAFISCALES' && textoParafiscales}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
