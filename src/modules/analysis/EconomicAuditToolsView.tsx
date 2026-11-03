// Suite de Herramientas Analíticas, Desempates Ley 2069, Precios Bajos, AIU & Exportación OCDS
import React, { useState } from 'react';
import {
  Scale,
  TrendingDown,
  Calculator,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Percent,
  Coins,
  Layers,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { TieBreakEngine, type OferenteEmpatado } from '../../core/engines/TieBreakEngine';
import { AbnormallyLowPriceEngine } from '../../core/engines/AbnormallyLowPriceEngine';
import { AiuCalculatorEngine } from '../../core/engines/AiuCalculatorEngine';
import { OcdsExportEngine } from '../../core/engines/OcdsExportEngine';
import { useProcurementStore } from '../../store/useProcurementStore';

export const EconomicAuditToolsView: React.FC<{ pestanaInicial?: 'DESEMPATES' | 'PRECIOS_BAJOS' | 'AIU_IVA' | 'EXPORTADOR_OCDS' }> = ({ pestanaInicial }) => {
  const { procesos, procesoSeleccionadoId, proveedores, parametrosRegulatorios } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  const [pestana, setPestana] = useState<'DESEMPATES' | 'PRECIOS_BAJOS' | 'AIU_IVA' | 'EXPORTADOR_OCDS'>(pestanaInicial ?? 'DESEMPATES');

  // 1. Estado para Desempates Ley 2069
  const [oferentesEmpatados, setOferentesEmpatados] = useState<OferenteEmpatado[]>([
    {
      id: 'OFR-EMP-01',
      nombre: 'SANJUANÉS SOLUCIONES S.A.S.',
      nit: '901.458.789-1',
      puntajeTotal: 100.0,
      esMipymeNacional: true,
      esSociedadBIC: false,
      domicilioEnMunicipioEjecucion: true,
      vinculaMujeresVictimasViolencia: true,
      mujeresLiderazgoOAccionistasPct: 60,
      empleadosConDiscapacidadPct: 12,
      empleaPoblacionReincorporada: false,
      primerVezContratandoEstado: false,
      antiguedadRUPMeses: 48,
      numeroAleatorioBalota: 85
    },
    {
      id: 'OFR-EMP-02',
      nombre: 'CONSORCIO INFRAESTRUCTURA ANDINA',
      nit: '900.888.111-2',
      puntajeTotal: 100.0,
      esMipymeNacional: true,
      esSociedadBIC: false,
      domicilioEnMunicipioEjecucion: false,
      vinculaMujeresVictimasViolencia: false,
      mujeresLiderazgoOAccionistasPct: 30,
      empleadosConDiscapacidadPct: 10,
      empleaPoblacionReincorporada: false,
      primerVezContratandoEstado: false,
      antiguedadRUPMeses: 36,
      numeroAleatorioBalota: 62
    },
    {
      id: 'OFR-EMP-03',
      nombre: 'INGELECGROUP S.A.S. BIC',
      nit: '901.624.819-5',
      puntajeTotal: 100.0,
      esMipymeNacional: true,
      esSociedadBIC: true,
      domicilioEnMunicipioEjecucion: true,
      vinculaMujeresVictimasViolencia: false,
      mujeresLiderazgoOAccionistasPct: 52,
      empleadosConDiscapacidadPct: 11,
      empleaPoblacionReincorporada: true,
      primerVezContratandoEstado: false,
      antiguedadRUPMeses: 38,
      numeroAleatorioBalota: 91
    }
  ]);

  const resDesempate = TieBreakEngine.resolverEmpate(oferentesEmpatados, {
    preferenciaSociedadesBicActiva: parametrosRegulatorios?.preferenciaSociedadesBicActiva
  });

  // 2. Estado para Precios Artificialmente Bajos
  const [ofertasPrecios, setOfertasPrecios] = useState([
    { id: 'OF-01', nombre: 'SANJUANÉS SOLUCIONES S.A.S.', valor: Math.round(procesoActivo.presupuestoOficial * 0.92) },
    { id: 'OF-02', nombre: 'INGELECGROUP S.A.S. BIC', valor: Math.round(procesoActivo.presupuestoOficial * 0.93) },
    { id: 'OF-03', nombre: 'INGENIERÍA & CONSTRUCCIONES DEL CARIBE', valor: Math.round(procesoActivo.presupuestoOficial * 0.95) },
    { id: 'OF-04', nombre: 'PROPONENTE TEMERARIO S.A.S.', valor: Math.round(procesoActivo.presupuestoOficial * 0.62) } // Muy bajo
  ]);

  const diagnosticoPrecios = AbnormallyLowPriceEngine.analizarPrecios(
    procesoActivo.presupuestoOficial,
    ofertasPrecios
  );

  // 3. Estado para Calculadora AIU e IVA
  const [costosDirectos, setCostosDirectos] = useState({
    materialesCOP: 280000000,
    manoDeObraDirectaCOP: 120000000,
    factorPrestacionalPct: 52,
    equiposMaquinariaCOP: 65000000,
    transporteLogisticaCOP: 18000000
  });

  const [aiuPct, setAiuPct] = useState({
    administracionPct: 15,
    imprevistosPct: 3,
    utilidadPct: 5,
    tarifaIvaPct: 19
  });

  const resAIU = AiuCalculatorEngine.calcular(costosDirectos, aiuPct);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header de la Suite */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                HERRAMIENTAS ECONÓMICAS & ANALÍTICAS AVANZADAS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                LEY 2069 / CCE / OCDS
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Desempates multicriterio, detección de ofertas temerarias, cálculo formal de AIU y exportación OCDS
            </p>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setPestana('DESEMPATES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              pestana === 'DESEMPATES'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Auditor secuencial de factores de desempate según la Ley 2069 de 2020 y Decreto 1860 de 2021"
          >
            Desempates (Ley 2069)
          </button>
          <button
            onClick={() => setPestana('PRECIOS_BAJOS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              pestana === 'PRECIOS_BAJOS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Detector estadístico de ofertas con precios artificialmente bajos o temerarios según Decreto 1082"
          >
            Precios Bajos
          </button>
          <button
            onClick={() => setPestana('AIU_IVA')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              pestana === 'AIU_IVA'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Calculadora analítica de Administración, Imprevistos, Utilidad e IVA sobre la Utilidad (Art. 462-1)"
          >
            Calculadora AIU & IVA
          </button>
          <button
            onClick={() => setPestana('EXPORTADOR_OCDS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              pestana === 'EXPORTADOR_OCDS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Generador y descargador oficial del Open Contracting Data Standard Release Package en JSON y CSV"
          >
            Exportador OCDS
          </button>
        </div>
      </div>

      {/* 2. PESTAÑA: DESEMPATES LEY 2069 */}
      {pestana === 'DESEMPATES' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Cascada Secuencial de Factores de Desempate (Ley 2069 de 2020 & Dcto. 1860 de 2021)
                </h2>
                <p className="text-xs text-slate-500">
                  La norma prohíbe el sorteo directo. Se audita criterio por criterio hasta determinar el legítimo adjudicatario.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                Ganador: {resDesempate.ganadorDefinitivo.nombre}
              </span>
            </div>

            {/* Indicador de Sincronización con el Radar Normativo */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold">Vigilancia Normativa Activa:</span>
                <span>
                  Preferencia Sociedades BIC (Dcto. 1860):{' '}
                  <strong className={parametrosRegulatorios?.preferenciaSociedadesBicActiva ? 'text-emerald-700' : 'text-slate-500'}>
                    {parametrosRegulatorios?.preferenciaSociedadesBicActiva ? 'VIGENTE / ACTIVA' : 'INACTIVA (Simulando escenario previo a Ley 2069)'}
                  </strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-500 italic">
                (Modificable en vivo desde el «Radar Normativo» en la barra superior)
              </span>
            </div>

            {/* Cuadro de Trazabilidad Criterio a Criterio */}
            <div className="space-y-2.5">
              {resDesempate.trazabilidadCascada.map((crit) => (
                <div
                  key={crit.orden}
                  className={`p-3.5 rounded-xl border transition-all ${
                    crit.aplicaDesempate
                      ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                  title={`Criterio legal #${crit.orden}: ${crit.nombreCriterio} (${crit.fundamentoLegal})`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                          crit.aplicaDesempate
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {crit.orden}
                      </span>
                      <span className="font-extrabold text-xs text-slate-900">
                        {crit.nombreCriterio}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {crit.fundamentoLegal}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        crit.aplicaDesempate
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {crit.aplicaDesempate ? 'DESEMPATE RESUELTO AQUÍ' : 'EMPATE PERSISTE'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 pl-8 leading-relaxed">
                    {crit.detalleEvaluacion}
                  </p>
                </div>
              ))}
            </div>

            {/* Dictamen Jurídico Oficial */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-lime-400 block">
                Dictamen Vinculante del Comité Asesor y Evaluador:
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">
                {resDesempate.dictamenJuridico}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. PESTAÑA: DETECTOR DE PRECIOS ARTIFICIALMENTE BAJOS */}
      {pestana === 'PRECIOS_BAJOS' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Control Estadístico de Precios Artificialmente Bajos (Decreto 1082 / CCE)
                </h2>
                <p className="text-xs text-slate-500">
                  Detección econométrica mediante Z-Score y umbral de piso de mercado
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300">
                {diagnosticoPrecios.ofertasSospechosas} Oferta(s) en Alerta Temeraria
              </span>
            </div>

            {/* KPIs Estadísticos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Media de Ofertas</span>
                <span className="font-mono font-black text-sm text-slate-900">
                  ${diagnosticoPrecios.mediaOfertas.toLocaleString('es-CO')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Mediana Muestral</span>
                <span className="font-mono font-black text-sm text-slate-900">
                  ${diagnosticoPrecios.medianaOfertas.toLocaleString('es-CO')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Desviación Estándar (σ)</span>
                <span className="font-mono font-black text-sm text-slate-900">
                  ${diagnosticoPrecios.desviacionEstandar.toLocaleString('es-CO')}
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                <span className="text-rose-600 text-[10px] font-bold uppercase block">Umbral Alerta Temeraria</span>
                <span className="font-mono font-black text-sm text-rose-700">
                  ${diagnosticoPrecios.umbralSospechaInferiorCOP.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Tabla de Ofertas y Z-Scores */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-2.5">Proponente</th>
                    <th className="p-2.5 text-right">Valor Propuesta</th>
                    <th className="p-2.5 text-center">Z-Score (σ)</th>
                    <th className="p-2.5 text-center">Desviación %</th>
                    <th className="p-2.5 text-center">Diagnóstico CCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {diagnosticoPrecios.ofertasAnalizadas.map((of) => (
                    <tr
                      key={of.id}
                      className={of.esSospechosa ? 'bg-rose-50/60 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2.5 text-slate-900">{of.nombreProponente}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        ${of.valorOfertado.toLocaleString('es-CO')}
                      </td>
                      <td className="p-2.5 text-center font-mono">{of.zScore}</td>
                      <td className="p-2.5 text-center font-mono">
                        {of.desviacionFrenteAMediaPct}%
                      </td>
                      <td className="p-2.5 text-center">
                        {of.esSospechosa ? (
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[9px] bg-rose-600 text-white">
                            ALERTA: ARTIFICIALMENTE BAJO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[9px] bg-emerald-100 text-emerald-800">
                            PRECIO NORMAL DE MERCADO
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Requerimiento Formal de Justificación de Precios */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700 block">
                Plantilla Oficial de Requerimiento de Justificación (Decreto 1082 / Art. 2.2.1.1.2.2.4):
              </span>
              <textarea
                value={diagnosticoPrecios.requerimientoPlantillaOficial}
                readOnly
                className="w-full h-36 p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl border border-slate-700 resize-none leading-relaxed"
                title="Texto formal del requerimiento que la entidad debe remitir obligatoriamente al licitante antes de rechazar su oferta"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. PESTAÑA: CALCULADORA ANALÍTICA AIU & IVA */}
      {pestana === 'AIU_IVA' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Columna Izquierda: Parámetros de Costos Directos y Factores AIU (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-900 text-sm">Estructuración de Costos y AIU</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Costo Materiales e Insumos (COP):
                  </label>
                  <input
                    type="number"
                    value={costosDirectos.materialesCOP}
                    onChange={(e) =>
                      setCostosDirectos({ ...costosDirectos, materialesCOP: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                    title="Valor neto presupuestado para materiales directos de la obra o suministro"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mano de Obra Básica:
                    </label>
                    <input
                      type="number"
                      value={costosDirectos.manoDeObraDirectaCOP}
                      onChange={(e) =>
                        setCostosDirectos({ ...costosDirectos, manoDeObraDirectaCOP: Number(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                      title="Salarios directos del personal técnico y operativo"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Factor Prestacional (%):
                    </label>
                    <input
                      type="number"
                      value={costosDirectos.factorPrestacionalPct}
                      onChange={(e) =>
                        setCostosDirectos({ ...costosDirectos, factorPrestacionalPct: Number(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-indigo-700"
                      title="Porcentaje legal de prestaciones sociales, seguridad social y parafiscales (típico en Colombia: 52%)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Admin (%):</label>
                    <input
                      type="number"
                      value={aiuPct.administracionPct}
                      onChange={(e) => setAiuPct({ ...aiuPct, administracionPct: Number(e.target.value) })}
                      className="w-full p-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                      title="Porcentaje de Administración (A): honorarios, campamentos, pólizas, ensayos"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Imprev. (%):</label>
                    <input
                      type="number"
                      value={aiuPct.imprevistosPct}
                      onChange={(e) => setAiuPct({ ...aiuPct, imprevistosPct: Number(e.target.value) })}
                      className="w-full p-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                      title="Porcentaje de Imprevistos (I): contingencias climáticas y operativas"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Utilidad (%):</label>
                    <input
                      type="number"
                      value={aiuPct.utilidadPct}
                      onChange={(e) => setAiuPct({ ...aiuPct, utilidadPct: Number(e.target.value) })}
                      className="w-full p-1.5 border border-slate-300 rounded-lg font-mono font-bold text-emerald-700"
                      title="Porcentaje de Utilidad (U): margen neto de ganancia del contratista"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Liquidación Tributaria y Ahorro Legal de IVA (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm">
                  Liquidación Económica & Tributaria (E.T. Art. 462-1)
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  AIU Total: {resAIU.aiuTotalPct}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px]">Costo Directo Total:</span>
                  <div className="font-mono font-black text-slate-900 text-base">
                    ${resAIU.costoDirectoTotalCOP.toLocaleString('es-CO')} COP
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px]">Valor Total AIU:</span>
                  <div className="font-mono font-black text-indigo-700 text-base">
                    ${resAIU.valorTotalAIUCOP.toLocaleString('es-CO')} COP
                  </div>
                </div>
              </div>

              {/* Comparativa Tributaria: IVA sobre Utilidad vs IVA sobre Total */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    IVA Legal (19% causados ÚNICAMENTE sobre la Utilidad 'U'):
                  </span>
                  <span className="font-mono font-black text-sm text-emerald-700">
                    ${resAIU.ivaSobreUtilidadLegalCOP.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-emerald-200">
                  <span>Si se aplicara erróneamente sobre el contrato total:</span>
                  <span className="line-through font-mono">
                    ${resAIU.ivaTotalErroneoSiFueraSobreTotalCOP.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="text-[11px] font-bold text-emerald-800 pt-1">
                  ✓ Ahorro tributario legalmente estructurado: ${resAIU.ahorroTributarioLegalCOP.toLocaleString('es-CO')} COP
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <span className="font-bold text-xs">PRECIO TOTAL PROPUESTA ECONÓMICA:</span>
                <span className="font-mono font-black text-base text-lime-400">
                  ${resAIU.precioTotalPropuestaEconomicaCOP.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PESTAÑA: EXPORTADOR OCDS */}
      {pestana === 'EXPORTADOR_OCDS' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Exportador en Estándar Internacional OCDS (Open Contracting Data Standard)
                </h2>
                <p className="text-xs text-slate-500">
                  Interoperabilidad con Python, PowerBI, Tableau y auditoría ciudadana
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => OcdsExportEngine.descargarCSVTabular(procesoActivo)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Descargar conjunto de datos en formato CSV tabular delimitado por comas para Excel o PowerBI"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar CSV</span>
                </button>
                <button
                  onClick={() => OcdsExportEngine.descargarArchivoJSON(procesoActivo)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Descargar el OCDS Release Package estructurado completo en formato JSON 1.1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar OCDS Release (.json)</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div><strong>Proceso Exportado:</strong> {procesoActivo.numeroProceso}</div>
              <div><strong>Entidad Contratante:</strong> {procesoActivo.entidad?.nombre}</div>
              <div><strong>Identificador Global OCID:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono">ocds-b5fd17-{procesoActivo.numeroProceso}</code></div>
              <div><strong>Etapas Incluidas:</strong> Planning, Tender, Awards, Contracts, Implementation</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold text-lime-400 block font-mono">
                Previsualización Estructura OCDS Release Package (JSON):
              </span>
              <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64 custom-scrollbar">
                {JSON.stringify(OcdsExportEngine.generarReleasePackageOCDS(procesoActivo), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
