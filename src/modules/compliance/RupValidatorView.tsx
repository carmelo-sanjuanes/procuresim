// Validador y Auditor Oficial de Registro Único de Proponentes (RUP) & K Residual
// Conforme a la Ley 1150 de 2007, Decreto 1082 de 2015 y Manuales de CCE
import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  Building,
  RotateCcw,
  Sparkles,
  Calculator,
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';
import { FinancialEngine, type EvaluacionFinancieraDetalle } from '../../core/engines/FinancialEngine';
import { useProcurementStore } from '../../store/useProcurementStore';
import { PrintableDocumentModal } from '../../components/PrintableDocumentModal';

export const RupValidatorView: React.FC = () => {
  const { proveedores, proveedorActivoId, procesos, procesoSeleccionadoId } = useProcurementStore();
  const proponenteActivo = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  // Estado del formulario contable RUP
  const [datosContables, setDatosContables] = useState({
    activoCorriente: proponenteActivo.activoCorriente,
    pasivoCorriente: proponenteActivo.pasivoCorriente,
    activoTotal: proponenteActivo.activoTotal,
    pasivoTotal: proponenteActivo.pasivoTotal,
    patrimonio: proponenteActivo.patrimonio,
    utilidadOperacional: proponenteActivo.utilidadOperacional,
    gastosIntereses: proponenteActivo.gastosIntereses,
    utilidadNeta: proponenteActivo.utilidadNeta
  });

  // Estado de parámetros K Residual
  const [parametrosKR, setParametrosKR] = useState({
    experienciaAcreditadaSMMLV: 3500,
    capacidadFinancieraLiquidez: 1.8,
    personalTecnicoIngenieros: 12,
    ingresosOperacionalesSMMLV: 4200,
    saldosContratosEnEjecucionSMMLV: 850,
    kResidualExigidoProcesoSMMLV: 2500
  });

  const [modalImpresion, setModalImpresion] = useState(false);

  // Ejecución de evaluaciones con FinancialEngine
  const proponenteSimulado = {
    ...proponenteActivo,
    ...datosContables
  };

  const evalFinanciera: EvaluacionFinancieraDetalle = FinancialEngine.evaluarCapacidadFinanciera(
    proponenteSimulado,
    procesoActivo.requisitosHabilitantes
  );

  const resKR = FinancialEngine.calcularCapacidadResidual({
    experienciaAcreditadaSMMLV: Number(parametrosKR.experienciaAcreditadaSMMLV),
    capacidadFinancieraLiquidez: Number(evalFinanciera.indiceLiquidez.valor),
    personalTecnicoIngenieros: Number(parametrosKR.personalTecnicoIngenieros),
    ingresosOperacionalesSMMLV: Number(parametrosKR.ingresosOperacionalesSMMLV),
    saldosContratosEnEjecucionSMMLV: Number(parametrosKR.saldosContratosEnEjecucionSMMLV),
    kResidualExigidoProcesoSMMLV: Number(parametrosKR.kResidualExigidoProcesoSMMLV)
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header del Validador */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                AUDITOR & VALIDADOR OFICIAL DE CERTIFICADO RUP
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                CÁMARA DE COMERCIO / CCE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Evaluación estricta de Capacidad Financiera, Organizacional y K Residual de Contratación
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalImpresion(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Generar Dictamen Imprimible</span>
        </button>
      </div>

      {/* 2. Banner del Proponente Evaluado */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-lime-400 font-bold text-sm">
            RUP
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-sm">
              {proponenteActivo.razonSocial}
            </div>
            <div className="text-slate-500 text-[11px]">
              NIT: {proponenteActivo.nit} | Inscripción RUP Activa y en Firme
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Dictamen General:</span>
          <span
            className={`px-2.5 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
              evalFinanciera.resultadoGeneral === 'HABILITADO' && resKR.cumpleKResidual
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {evalFinanciera.resultadoGeneral === 'HABILITADO' && resKR.cumpleKResidual ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>HABILITADO PARA CONTRATAR</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>NO HABILITADO / RECHAZO</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 3. Panel de Indicadores Financieros & Organizacionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Liquidez */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Índice de Liquidez</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                evalFinanciera.indiceLiquidez.cumple
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {evalFinanciera.indiceLiquidez.cumple ? 'CUMPLE' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {evalFinanciera.indiceLiquidez.valor}
          </div>
          <p className="text-[10px] text-slate-400">
            Fórmula: Activo Corriente / Pasivo Corriente (Exigido: ≥ {evalFinanciera.indiceLiquidez.exigido})
          </p>
        </div>

        {/* Endeudamiento */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Nivel de Endeudamiento</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                evalFinanciera.nivelEndeudamiento.cumple
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {evalFinanciera.nivelEndeudamiento.cumple ? 'CUMPLE' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {evalFinanciera.nivelEndeudamiento.valorPct}%
          </div>
          <p className="text-[10px] text-slate-400">
            Fórmula: (Pasivo Total / Activo Total) * 100 (Exigido: ≤ {evalFinanciera.nivelEndeudamiento.exigidoPct}%)
          </p>
        </div>

        {/* Cobertura de Intereses */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Cobertura de Intereses</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                evalFinanciera.coberturaIntereses.cumple
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {evalFinanciera.coberturaIntereses.cumple ? 'CUMPLE' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {evalFinanciera.coberturaIntereses.valor}
          </div>
          <p className="text-[10px] text-slate-400">
            Fórmula: Utilidad Operacional / Gastos Intereses (Exigido: ≥ {evalFinanciera.coberturaIntereses.exigido})
          </p>
        </div>

        {/* Capital de Trabajo */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Capital de Trabajo</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                evalFinanciera.capitalTrabajo.cumple
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {evalFinanciera.capitalTrabajo.cumple ? 'CUMPLE' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 font-mono">
            ${evalFinanciera.capitalTrabajo.valor.toLocaleString('es-CO')}
          </div>
          <p className="text-[10px] text-slate-400">
            Fórmula: Activo Corriente - Pasivo Corriente (Exigido: ≥ ${evalFinanciera.capitalTrabajo.exigido.toLocaleString('es-CO')})
          </p>
        </div>

        {/* ROE */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Rentabilidad Patrimonio (ROE)</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                evalFinanciera.rentabilidadPatrimonio.cumple
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {evalFinanciera.rentabilidadPatrimonio.cumple ? 'CUMPLE' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {evalFinanciera.rentabilidadPatrimonio.valorPct}%
          </div>
          <p className="text-[10px] text-slate-400">
            Fórmula: (Utilidad Neta / Patrimonio) * 100 (Exigido: ≥ {evalFinanciera.rentabilidadPatrimonio.exigidoPct}%)
          </p>
        </div>

        {/* ROA */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Rentabilidad Activo (ROA)</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                evalFinanciera.rentabilidadActivo.cumple
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {evalFinanciera.rentabilidadActivo.cumple ? 'CUMPLE' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {evalFinanciera.rentabilidadActivo.valorPct}%
          </div>
          <p className="text-[10px] text-slate-400">
            Fórmula: (Utilidad Neta / Activo Total) * 100 (Exigido: ≥ {evalFinanciera.rentabilidadActivo.exigidoPct}%)
          </p>
        </div>
      </div>

      {/* 4. Calculadora Oficial de Capacidad Residual (K Residual) - Obra Pública */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-sm">
                Cálculo de Capacidad Residual de Contratación (K Residual)
              </h2>
              <span className="text-[11px] text-slate-500">
                Guía Metodológica Colombia Compra Eficiente & Decreto 1082 de 2015
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            SMMLV Base: ${resKR.smmlvVigenteCOP.toLocaleString('es-CO')} COP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Experiencia Acreditada (SMMLV):
            </label>
            <input
              type="number"
              value={parametrosKR.experienciaAcreditadaSMMLV}
              onChange={(e) =>
                setParametrosKR({ ...parametrosKR, experienciaAcreditadaSMMLV: Number(e.target.value) })
              }
              className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400">Puntaje (x0.40): {resKR.puntajeExperiencia}</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Capacidad Técnica (N.° Ingenieros/Arquitectos):
            </label>
            <input
              type="number"
              value={parametrosKR.personalTecnicoIngenieros}
              onChange={(e) =>
                setParametrosKR({ ...parametrosKR, personalTecnicoIngenieros: Number(e.target.value) })
              }
              className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400">Puntaje (x0.20): {resKR.puntajeTecnico}</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Capacidad Organización (Ingresos Operacionales SMMLV):
            </label>
            <input
              type="number"
              value={parametrosKR.ingresosOperacionalesSMMLV}
              onChange={(e) =>
                setParametrosKR({ ...parametrosKR, ingresosOperacionalesSMMLV: Number(e.target.value) })
              }
              className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400">Puntaje (x0.10): {resKR.puntajeOrganizacion}</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Saldos Contratos en Ejecución (SCE en SMMLV):
            </label>
            <input
              type="number"
              value={parametrosKR.saldosContratosEnEjecucionSMMLV}
              onChange={(e) =>
                setParametrosKR({ ...parametrosKR, saldosContratosEnEjecucionSMMLV: Number(e.target.value) })
              }
              className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-rose-600"
            />
            <span className="text-[10px] text-rose-500">Resta directamente a la capacidad</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              K Residual Exigido por el Pliego (SMMLV):
            </label>
            <input
              type="number"
              value={parametrosKR.kResidualExigidoProcesoSMMLV}
              onChange={(e) =>
                setParametrosKR({ ...parametrosKR, kResidualExigidoProcesoSMMLV: Number(e.target.value) })
              }
              className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400">Umbral mínimo para calificar</span>
          </div>

          {/* Resultado K Residual */}
          <div className="p-3 bg-slate-900 text-white rounded-xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              K Residual Resultante ({resKR.cumpleKResidual ? 'CUMPLE' : 'NO CUMPLE'}):
            </span>
            <div className="text-xl font-black text-lime-400 font-mono">
              {resKR.kResidualResultanteSMMLV.toLocaleString('es-CO')} SMMLV
            </div>
            <div className="text-[10px] text-slate-300 font-mono">
              ≈ ${resKR.kResidualResultanteCOP.toLocaleString('es-CO')} COP
            </div>
          </div>
        </div>

        {/* Dictamen explicativo */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <strong className="text-slate-800 block mb-1">Dictamen del Comité Evaluador:</strong>
          <p className="text-slate-600 leading-relaxed">{resKR.dictamen}</p>
        </div>
      </div>

      {/* Modal Imprimible */}
      <PrintableDocumentModal
        abierto={modalImpresion}
        onCerrar={() => setModalImpresion(false)}
        tipoDocumento="INFORME_EVALUACION_HABILITANTES"
      />
    </div>
  );
};
