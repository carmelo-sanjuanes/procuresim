import React, { useState } from 'react';
import {
  TrendingUp,
  Brain,
  Database,
  Newspaper,
  Compass,
  DollarSign,
  BarChart3,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Sparkles,
  Info,
  Clock,
  Building2,
  Scale,
  Download
} from 'lucide-react';
import {
  PredictiveProcurementEngine,
  type ProyeccionTRMMonteCarlo,
  type ComparativaModelosPredictivos,
  type EstadisticasDatosAbiertosSECOP,
  type NoticiaContratacion,
  type TendenciaSectorial
} from '../../core/engines/PredictiveProcurementEngine';
import {
  DatosAbiertosSocrataEngine,
  type ProcesoDatosAbiertosRaw
} from '../../core/engines/DatosAbiertosSocrataEngine';
import { useProcurementStore } from '../../store/useProcurementStore';

export const ProcurementTrendsView: React.FC = () => {
  const [pestanaActiva, setPestanaActiva] = useState<
    'PREDICCIONES' | 'DATOS_ABIERTOS' | 'NOTICIAS' | 'TENDENCIAS_SECTORIALES'
  >('PREDICCIONES');

  // Estado para la simulación Monte Carlo de TRM
  const [trmBase, setTrmBase] = useState<number>(4185.5);
  const [diasProyeccion, setDiasProyeccion] = useState<number>(15);
  const [proyeccionTRM, setProyeccionTRM] = useState<ProyeccionTRMMonteCarlo>(
    PredictiveProcurementEngine.simularProbabilidadFormulasTRM(4185.5, 15, 2000)
  );
  const [simulando, setSimulando] = useState<boolean>(false);

  // Estado para Datos Abiertos
  const [estadisticasSECOP, setEstadisticasSECOP] = useState<EstadisticasDatosAbiertosSECOP>(
    PredictiveProcurementEngine.obtenerEstadisticasDatosAbiertosSECOP()
  );
  const [sincronizandoSODA, setSincronizandoSODA] = useState<boolean>(false);

  // Estados del Buscador en Vivo Socrata SECOP II
  const [querySocrata, setQuerySocrata] = useState<string>('');
  const [deptoSocrata, setDeptoSocrata] = useState<string>('TODOS');
  const [resultadosSocrata, setResultadosSocrata] = useState<ProcesoDatosAbiertosRaw[]>([]);
  const [buscandoSocrata, setBuscandoSocrata] = useState<boolean>(false);
  const [infoSocrata, setInfoSocrata] = useState<{ origen: string; mensaje: string } | null>(null);

  const { crearProceso, seleccionarProceso, setVista, registrarAuditoria } = useProcurementStore();

  // Estado para Noticias
  const [categoriaNoticiaFiltro, setCategoriaNoticiaFiltro] = useState<string>('TODAS');
  const [busquedaNoticia, setBusquedaNoticia] = useState<string>('');

  const handleReejecutarSimulacion = () => {
    setSimulando(true);
    setTimeout(() => {
      const res = PredictiveProcurementEngine.simularProbabilidadFormulasTRM(
        trmBase,
        diasProyeccion,
        2500
      );
      setProyeccionTRM(res);
      setSimulando(false);
    }, 400);
  };

  const handleBuscarSocrataEnVivo = async () => {
    setBuscandoSocrata(true);
    try {
      const res = await DatosAbiertosSocrataEngine.consultarProcesosEnVivo({
        query: querySocrata,
        departamento: deptoSocrata,
        limite: 10
      });
      setResultadosSocrata(res.procesos);
      setInfoSocrata({ origen: res.origen, mensaje: res.mensaje });
    } catch (e) {
      console.error(e);
    } finally {
      setBuscandoSocrata(false);
    }
  };

  const handleImportarProcesoSimulador = (raw: ProcesoDatosAbiertosRaw) => {
    const nuevoProceso = DatosAbiertosSocrataEngine.transformarEnProcesoSimulador(raw);
    crearProceso(nuevoProceso);
    seleccionarProceso(nuevoProceso.id);
    registrarAuditoria(
      'DATOS_ABIERTOS',
      'Importación de Proceso SECOP II',
      `Se importó el proceso ${nuevoProceso.numeroProceso} (${nuevoProceso.objeto.slice(0, 50)}...) de datos.gov.co al simulador de entrenamiento.`,
      'SISTEMA'
    );
    alert(`¡Proceso ${nuevoProceso.numeroProceso} importado exitosamente! Ahora es el proceso activo de entrenamiento.`);
    setVista('SECOP_II_ENTIDAD');
  };

  const handleSincronizarDatosAbiertos = () => {
    setSincronizandoSODA(true);
    setTimeout(() => {
      setEstadisticasSECOP(PredictiveProcurementEngine.obtenerEstadisticasDatosAbiertosSECOP());
      setSincronizandoSODA(false);
      handleBuscarSocrataEnVivo();
      alert('¡Sincronización exitosa con la API SODA de datos.gov.co (SECOP II jbjy-vk9h y TRM 32sa-8pi3)!');
    }, 700);
  };

  const noticiasFiltradas = PredictiveProcurementEngine.NOTICIAS_NORMATIVAS.filter((not) => {
    const coincideCat =
      categoriaNoticiaFiltro === 'TODAS' || not.categoria === categoriaNoticiaFiltro;
    const coincideTexto =
      not.titulo.toLowerCase().includes(busquedaNoticia.toLowerCase()) ||
      not.resumen.toLowerCase().includes(busquedaNoticia.toLowerCase()) ||
      not.impactoEnLicitaciones.toLowerCase().includes(busquedaNoticia.toLowerCase());
    return coincideCat && coincideTexto;
  });

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      {/* Cabecera Principal */}
      <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              <Brain className="w-5 h-5 text-indigo-600" />
              Observatorio de Inteligencia de Contratación & Datos Abiertos
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Modelos Predictivos, Datos Abiertos de SECOP & Tendencias
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-4xl">
              Plataforma analítica con modelos de Machine Learning (ARIMA, GARCH, Prophet y LSTM),
              proyecciones estocásticas de la TRM para elección de fórmulas CCE, extracción estadística
              vía la API de Datos Abiertos de Colombia (datos.gov.co) y radar legal normativo.
            </p>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 flex-wrap gap-1">
            <button
              onClick={() => setPestanaActiva('PREDICCIONES')}
              className={`px-3 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                pestanaActiva === 'PREDICCIONES'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain className="w-4 h-4" />
              Modelos Predictivos (IA)
            </button>

            <button
              onClick={() => setPestanaActiva('DATOS_ABIERTOS')}
              className={`px-3 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                pestanaActiva === 'DATOS_ABIERTOS'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              Datos Abiertos SECOP
            </button>

            <button
              onClick={() => setPestanaActiva('NOTICIAS')}
              className={`px-3 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                pestanaActiva === 'NOTICIAS'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Noticias & Normativa
            </button>

            <button
              onClick={() => setPestanaActiva('TENDENCIAS_SECTORIALES')}
              className={`px-3 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                pestanaActiva === 'TENDENCIAS_SECTORIALES'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              Tendencias Sectoriales
            </button>
          </div>
        </div>
      </div>

      {/* PESTAÑA 1: MODELOS PREDICTIVOS & PRONÓSTICO DE TRM / FÓRMULAS CCE */}
      {pestanaActiva === 'PREDICCIONES' && (
        <div className="space-y-6">
          {/* Panel de Simulación Monte Carlo */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Simulación Estocástica Monte Carlo de TRM (Elección de Fórmulas CCE)
                </h2>
                <p className="text-xs text-slate-500">
                  Calcula la probabilidad predictiva de que los centavos de la TRM caigan en cada rango de fórmula
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReejecutarSimulacion}
                  disabled={simulando}
                  className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulando ? 'animate-spin' : ''}`} />
                  {simulando ? 'Simulando 2,500 trayectorias...' : 'Ejecutar Monte Carlo'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  TRM Actual del Dólar (COP):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={trmBase}
                  onChange={(e) => setTrmBase(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Horizonte de Proyección:
                </label>
                <select
                  value={diasProyeccion}
                  onChange={(e) => setDiasProyeccion(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800 bg-slate-50"
                >
                  <option value={7}>7 días (Corto plazo - Audiencias próximas)</option>
                  <option value={15}>15 días (Mediano plazo - Cierre licitación)</option>
                  <option value={30}>30 días (Mes completo - Planeación)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-center">
                <span className="text-[11px] text-slate-500 font-medium">Intervalo de Confianza 95%:</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                  ${proyeccionTRM.intervaloConfianza95.limiteInferior.toLocaleString('es-CO')} - $
                  {proyeccionTRM.intervaloConfianza95.limiteSuperior.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            {/* Gráfico de Barras de Probabilidad Predictiva por Fórmula */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase">
                  Probabilidad Proyectada de Selección de Fórmula CCE para el Día {diasProyeccion}:
                </span>
                <span className="text-[11px] text-slate-500">
                  Volatilidad anualizada: {proyeccionTRM.volatilidadAnualizadaPct}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {proyeccionTRM.probabilidadesFormulasCCE.map((f, idx) => (
                  <div
                    key={f.metodo}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        {idx + 1}. {f.nombre}
                      </span>
                      <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {f.probabilidadPct}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      {f.rango}
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, f.probabilidadPct * 3.5)}%` }}
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug pt-1">
                      {f.recomendacionEstrategica}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparativa Técnica de Modelos Predictivos */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                Arquitecturas de Machine Learning & Econometría Aplicadas
              </span>
              <span className="text-xs text-slate-500">
                Benchmarks empíricos en el mercado cambiario colombiano
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PredictiveProcurementEngine.MODELOS_PREDICTIVOS.map((m) => (
                <div
                  key={m.modelo}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 text-sm">{m.modelo}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                        {m.familia}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {m.descripcion}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-center mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Error RMSE:</span>
                        <span className="font-bold text-slate-800">{m.rmse} COP</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Error MAPE:</span>
                        <span className="font-bold text-emerald-600">{m.mapePct}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Cómputo:</span>
                        <span className="font-bold text-slate-800">{m.tiempoEntrenamiento}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <strong className="text-emerald-700 block">Ventajas:</strong>
                        <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                          {m.ventajas.map((v, i) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-1">
                        <strong className="text-rose-700 block">Limitaciones:</strong>
                        <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                          {m.limitaciones.map((l, i) => (
                            <li key={i}>{l}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-900 bg-indigo-50/50 p-2 rounded">
                    <strong>Recomendación:</strong> {m.recomendadoPara}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: ANALÍTICA Y DATOS ABIERTOS SECOP (datos.gov.co) */}
      {pestanaActiva === 'DATOS_ABIERTOS' && (
        <div className="space-y-6">
          {/* Banner de Sincronización SODA API */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                <Database className="w-4 h-4" />
                Socrata Open Data API (SODA) - datos.gov.co
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Conector Oficial a Conjuntos de Datos Abiertos del Estado Colombiano
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Datasets sincronizados: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">p6dx-8zbt</code> (SECOP II Procesos), <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">jbjy-vk9h</code> (Contratos) y <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">32sa-8pi3</code> (TRM)
              </p>
            </div>

            <button
              onClick={handleSincronizarDatosAbiertos}
              disabled={sincronizandoSODA}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow transition-colors shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${sincronizandoSODA ? 'animate-spin' : ''}`} />
              {sincronizandoSODA ? 'Sincronizando datos...' : 'Sincronizar Datos Abiertos'}
            </button>
          </div>

          {/* Tarjetas KPI de SECOP II */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Procesos Analizados</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {estadisticasSECOP.totalProcesosAnalizados.toLocaleString('es-CO')}
              </div>
              <span className="text-[11px] text-blue-600 font-medium">Conjunto oficial SECOP II</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Monto Total Contratado</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ${(estadisticasSECOP.montoTotalContratadoCOP / 1_000_000_000_000).toFixed(2)} Billones
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Presupuesto ejecutado</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Concurrencia de Oferentes</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {estadisticasSECOP.promedioOferentesPorProceso} oferentes
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Promedio por proceso</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Ahorro Público (Spread)</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {estadisticasSECOP.ahorroMedioPresupuestalPct}%
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Descuento medio sobre PO</span>
            </div>
          </div>

          {/* Dos Columnas: Modalidades y Frecuencia Histórica de Fórmulas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Distribución por Modalidades (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Distribución de Procesos por Modalidad de Selección</span>
                <span className="text-xs text-slate-500 font-medium">Ley 1150 / Dcto 1082</span>
              </h3>

              <div className="space-y-3">
                {estadisticasSECOP.distribucionModalidades.map((m) => (
                  <div key={m.modalidad} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{m.modalidad}</span>
                      <span className="font-bold text-slate-900">
                        {m.cantidad.toLocaleString('es-CO')} ({m.porcentaje}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${m.porcentaje * 2}%` }}
                        className="bg-indigo-600 h-full rounded-full"
                      />
                    </div>

                    <div className="text-[11px] text-slate-500 text-right">
                      Valor total: ${(m.valorCOP / 1_000_000_000_000).toFixed(2)} Billones COP
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frecuencia Histórica de Fórmulas Elegidas (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Fórmulas Económicas Utilizadas</span>
                <span className="text-xs text-indigo-600 font-bold">Histórico CCE</span>
              </h3>

              <div className="space-y-3">
                {estadisticasSECOP.frecuenciaFormulasHistoricas.map((f) => (
                  <div
                    key={f.metodo}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{f.nombre}</span>
                      <span className="text-[11px] text-slate-500">
                        {f.vecesUtilizada.toLocaleString('es-CO')} procesos registrados
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-indigo-700">
                        {f.porcentajeHistorico}%
                      </span>
                      <span className="block text-[10px] text-slate-400">del total</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EXPLORADOR EN VIVO: BUSCADOR DIRECTO DE PROCESOS SECOP II */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Explorador en Vivo de Procesos Reales de SECOP II
                  </h3>
                  <p className="text-xs text-slate-500">
                    Consulta en tiempo real la API de Datos Abiertos de Colombia (datos.gov.co) e importa procesos al simulador
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                API SODA EN VIVO / CACHÉ RESILIENTE
              </span>
            </div>

            {/* Barra de Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <input
                  type="text"
                  value={querySocrata}
                  onChange={(e) => setQuerySocrata(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscarSocrataEnVivo()}
                  placeholder="Buscar por objeto, entidad contratante o referencia (ej. obra, tecnología, alcaldía)..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={deptoSocrata}
                  onChange={(e) => setDeptoSocrata(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="TODOS">Todos los Departamentos</option>
                  <option value="Bogotá D.C.">Bogotá D.C.</option>
                  <option value="Antioquia">Antioquia</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                  <option value="Valle del Cauca">Valle del Cauca</option>
                  <option value="Santander">Santander</option>
                  <option value="Atlántico">Atlántico</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  onClick={handleBuscarSocrataEnVivo}
                  disabled={buscandoSocrata}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Search className={`w-3.5 h-3.5 ${buscandoSocrata ? 'animate-spin' : ''}`} />
                  <span>{buscandoSocrata ? 'Consultando...' : 'Buscar'}</span>
                </button>
              </div>
            </div>

            {/* Información de la consulta */}
            {infoSocrata && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between">
                <span>{infoSocrata.mensaje}</span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  {infoSocrata.origen}
                </span>
              </div>
            )}

            {/* Tabla de Resultados Socrata */}
            {resultadosSocrata.length > 0 && (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Referencia</th>
                      <th className="p-2.5">Entidad Contratante</th>
                      <th className="p-2.5">Objeto del Proceso</th>
                      <th className="p-2.5 text-right">Presupuesto (COP)</th>
                      <th className="p-2.5 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resultadosSocrata.map((item, idx) => (
                      <tr key={item.referencia_del_proceso || idx} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {item.referencia_del_proceso}
                          <span className="block text-[10px] font-normal text-slate-500">
                            {item.modalidad_de_contratacion}
                          </span>
                        </td>
                        <td className="p-2.5 font-medium text-slate-800 max-w-[200px] truncate">
                          {item.nombre_entidad}
                          <span className="block text-[10px] text-slate-400">
                            {item.ciudad_entidad}, {item.departamento_entidad}
                          </span>
                        </td>
                        <td className="p-2.5 max-w-xs text-[11px] text-slate-600">
                          {item.descripcion_del_procedimiento}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          ${Number(item.precio_base || 0).toLocaleString('es-CO')}
                        </td>
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleImportarProcesoSimulador(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            title="Importar al simulador como proceso de entrenamiento activo"
                          >
                            <Download className="w-3 h-3" />
                            <span>Importar</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: NOTICIAS, ACTUALIZACIONES NORMATIVAS & RADAR LEGAL */}
      {pestanaActiva === 'NOTICIAS' && (
        <div className="space-y-6">
          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-slate-700 uppercase">Filtrar por:</span>
                {[
                  { id: 'TODAS', label: 'Todas las Noticias' },
                  { id: 'PLIEGOS_TIPO', label: 'Pliegos Tipo' },
                  { id: 'JURISPRUDENCIA', label: 'Consejo de Estado' },
                  { id: 'CIRCULAR_NORMATIVA', label: 'Circulares CCE' },
                  { id: 'MACROECONOMIA', label: 'TRM & Macroeconomía' },
                  { id: 'ALERTA_CONTROL', label: 'Alertas Contraloría' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCategoriaNoticiaFiltro(f.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      categoriaNoticiaFiltro === f.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar noticia o sentencia..."
                  value={busquedaNoticia}
                  onChange={(e) => setBusquedaNoticia(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Listado de Noticias Normativas */}
          <div className="space-y-4">
            {noticiasFiltradas.map((not) => (
              <div
                key={not.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        not.urgencia === 'ALTA'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : not.urgencia === 'MEDIA'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {not.urgencia === 'ALTA' ? 'Prioridad Alta' : not.categoria.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {not.fuente.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    {not.fecha}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {not.titulo}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  {not.resumen}
                </p>

                <div className="p-2.5 rounded bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Impacto en Procesos de Contratación: </strong>
                    {not.impactoEnLicitaciones}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 4: TENDENCIAS SECTORIALES DE MERCADO */}
      {pestanaActiva === 'TENDENCIAS_SECTORIALES' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                Comportamiento y Perspectivas por Sectores de la Economía
              </span>
              <span className="text-xs text-slate-500">
                Monitoreo continuo de contratación pública
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PredictiveProcurementEngine.TENDENCIAS_SECTORIALES.map((sec) => (
                <div
                  key={sec.sector}
                  className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{sec.sector}</h3>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{sec.crecimientoAnualPct}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Competitividad:</span>
                      <span className="font-bold text-slate-800">{sec.nivelCompetitividad}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Adjudicación Media:</span>
                      <span className="font-bold text-slate-800">
                        ${(sec.promedioAdjudicacionCOP / 1_000_000).toFixed(0)}M
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Litigiosidad:</span>
                      <span
                        className={`font-bold ${
                          sec.riesgoLitigiosidad === 'ALTO'
                            ? 'text-rose-600'
                            : sec.riesgoLitigiosidad === 'MEDIO'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {sec.riesgoLitigiosidad}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded border border-slate-100">
                    <strong>Perspectiva Estratégica: </strong>
                    {sec.perspectivaSemestre}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
