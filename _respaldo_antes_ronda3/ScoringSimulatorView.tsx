import { SMMLV_2026 } from '../../core/domain/constants';
import React, { useState } from 'react';
import {
  Calculator,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle,
  PlusCircle,
  Trash2,
  RotateCcw,
  Sparkles,
  DollarSign,
  Users,
  ShieldCheck,
  Building,
  Scale,
  FileSpreadsheet,
  ChevronRight,
  Info,
  Coins,
  Dices,
  Copy,
  Download,
  FileCheck,
  Send,
  Printer
} from 'lucide-react';
import {
  ScoringFormulasEngine,
  type MetodoCalificacionEconomica,
  type OfertaSimulada,
  type IndicadorTipicoCatalogo
} from '../../core/engines/ScoringFormulasEngine';
import { useProcurementStore } from '../../store/useProcurementStore';
import { PrintableDocumentModal } from '../../components/PrintableDocumentModal';

export const ScoringSimulatorView: React.FC = () => {
  const {
    procesos,
    procesoSeleccionadoId,
    aplicarPuntajesEconomicosProceso,
    adjudicarProceso
  } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  const [pestanaActiva, setPestanaActiva] = useState<
    'CATALOGO' | 'SIMULADOR_FORMULAS' | 'K_RESIDUAL' | 'ACTA_ADJUDICACION'
  >('SIMULADOR_FORMULAS');
  const [modalImpresionActa, setModalImpresionActa] = useState(false);

  // Filtro de categorías para el catálogo
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODOS');
  const [busquedaIndicador, setBusquedaIndicador] = useState<string>('');

  // Estado del Simulador de Fórmulas
  const [presupuestoOficial, setPresupuestoOficial] = useState<number>(
    procesoActivo?.presupuestoOficial || 500000000
  );
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoCalificacionEconomica>(
    'MEDIA_GEOMETRICA'
  );
  const [factorTRM, setFactorTRM] = useState<number>(0.025); // 2.5% de ajuste
  const [puntajeMaxEcon, setPuntajeMaxEcon] = useState<number>(60);

  // Variables Exógenas e Indicadores Públicos para Selección de Fórmulas CCE
  const [trmInput, setTrmInput] = useState<number>(4185.50);
  const [loteriaInput, setLoteriaInput] = useState<string>('8432');
  const [loteriaNombre, setLoteriaNombre] = useState<string>('Lotería de Bogotá');
  const [balotaSorteada, setBalotaSorteada] = useState<number>(3);
  const [codigoBalota, setCodigoBalota] = useState<string>('BAL-941205-SHA256');
  const [modoSeleccionExogena, setModoSeleccionExogena] = useState<'MANUAL' | 'TRM' | 'LOTERIA' | 'BALOTA'>('TRM');

  const digitosTRM = ScoringFormulasEngine.extraerDigitosTRM(trmInput);
  const infoFormulaTRM = ScoringFormulasEngine.obtenerMetodoSegunDigitos(digitosTRM);

  const digitosLoteria = parseInt(loteriaInput.slice(-2) || '0', 10);
  const infoFormulaLoteria = ScoringFormulasEngine.obtenerMetodoSegunDigitos(digitosLoteria);

  const handleSeleccionarPorTRM = (val: number) => {
    setTrmInput(val);
    const dig = ScoringFormulasEngine.extraerDigitosTRM(val);
    const res = ScoringFormulasEngine.obtenerMetodoSegunDigitos(dig);
    setMetodoSeleccionado(res.metodo);
    setModoSeleccionExogena('TRM');
  };

  const handleSeleccionarPorLoteria = (num: string) => {
    setLoteriaInput(num);
    const ultimos = parseInt(num.slice(-2) || '0', 10);
    const res = ScoringFormulasEngine.obtenerMetodoSegunDigitos(ultimos);
    setMetodoSeleccionado(res.metodo);
    setModoSeleccionExogena('LOTERIA');
  };

  const handleGirarBalotera = () => {
    const res = ScoringFormulasEngine.sortearBalotaEnAudiencia();
    setBalotaSorteada(res.balota);
    setMetodoSeleccionado(res.metodo);
    setCodigoBalota(res.codigoVerificacion);
    setModoSeleccionExogena('BALOTA');
  };

  // Ofertas de prueba simuladas
  const [ofertasSimuladas, setOfertasSimuladas] = useState<OfertaSimulada[]>([
    {
      id: 'OF-01',
      nombreProponente: 'SANJUANES SOLUCIONES S.A.S.',
      valorOfertado: Math.round(presupuestoOficial * 0.94),
      esMiPyme: true,
      esEmpresaMujeres: false,
      empleadosDiscapacidad: true,
      industriaNacional: true,
      puntajeCalidadTecnica: 20,
      habilitado: true
    },
    {
      id: 'OF-02',
      nombreProponente: 'Ingeniería & Pavimentos del Caribe S.A.S.',
      valorOfertado: Math.round(presupuestoOficial * 0.91),
      esMiPyme: false,
      esEmpresaMujeres: true,
      empleadosDiscapacidad: false,
      industriaNacional: true,
      puntajeCalidadTecnica: 20,
      habilitado: true
    },
    {
      id: 'OF-03',
      nombreProponente: 'Constructora Occidental Ltda.',
      valorOfertado: Math.round(presupuestoOficial * 0.88),
      esMiPyme: true,
      esEmpresaMujeres: true,
      empleadosDiscapacidad: false,
      industriaNacional: true,
      puntajeCalidadTecnica: 18,
      habilitado: true
    },
    {
      id: 'OF-04',
      nombreProponente: 'Soluciones Civiles Globales S.A.',
      valorOfertado: Math.round(presupuestoOficial * 0.74), // Oferta agresiva / sospechosa de bajo precio
      esMiPyme: false,
      esEmpresaMujeres: false,
      empleadosDiscapacidad: false,
      industriaNacional: true,
      puntajeCalidadTecnica: 16,
      habilitado: true
    },
    {
      id: 'OF-05',
      nombreProponente: 'Infraestructura Nacional S.A.S.',
      valorOfertado: Math.round(presupuestoOficial * 0.98),
      esMiPyme: false,
      esEmpresaMujeres: false,
      empleadosDiscapacidad: true,
      industriaNacional: true,
      puntajeCalidadTecnica: 20,
      habilitado: true
    }
  ]);

  // Estado de la Calculadora de K-Residual
  const [kDatos, setKDatos] = useState({
    experienciaSMMLV: 4200,
    capacidadFinancieraLiquidez: 1.85,
    profesionalesTecnicos: 6,
    ingresosOperacionalesSMMLV: 6500,
    saldosContratosEnEjecucionCOP: 450000000,
    smmlvValorCOP: SMMLV_2026
  });

  // Ejecución de la simulación de calificación
  const resultadoSimulacion = ScoringFormulasEngine.simularCalificacionEconomica(
    ofertasSimuladas,
    presupuestoOficial,
    metodoSeleccionado,
    puntajeMaxEcon,
    factorTRM
  );

  // Ejecución del cálculo de K-Residual
  const resultadoKResidual = ScoringFormulasEngine.calcularKResidual(kDatos);

  // Filtrado de indicadores para el catálogo
  const indicadoresFiltrados = ScoringFormulasEngine.INDICADORES_CATALOGO.filter((ind) => {
    const coincideCategoria =
      categoriaFiltro === 'TODOS' || ind.categoria === categoriaFiltro;
    const coincideTexto =
      ind.nombre.toLowerCase().includes(busquedaIndicador.toLowerCase()) ||
      ind.formula.toLowerCase().includes(busquedaIndicador.toLowerCase()) ||
      ind.fundamentoLegal.toLowerCase().includes(busquedaIndicador.toLowerCase());
    return coincideCategoria && coincideTexto;
  });

  const handleAgregarOferta = () => {
    const nuevoId = `OF-0${ofertasSimuladas.length + 1}`;
    const nueva: OfertaSimulada = {
      id: nuevoId,
      nombreProponente: `Nuevo Proponente ${nuevoId} S.A.S.`,
      valorOfertado: Math.round(presupuestoOficial * (0.85 + Math.random() * 0.12)),
      esMiPyme: true,
      esEmpresaMujeres: false,
      empleadosDiscapacidad: false,
      industriaNacional: true,
      puntajeCalidadTecnica: 20,
      habilitado: true
    };
    setOfertasSimuladas([...ofertasSimuladas, nueva]);
  };

  const handleEliminarOferta = (id: string) => {
    if (ofertasSimuladas.length <= 2) {
      alert('Se requieren al menos dos (2) ofertas para simular las fórmulas de promedios.');
      return;
    }
    setOfertasSimuladas(ofertasSimuladas.filter((o) => o.id !== id));
  };

  const handleActualizarOferta = (id: string, campo: keyof OfertaSimulada, valor: any) => {
    setOfertasSimuladas(
      ofertasSimuladas.map((o) => (o.id === id ? { ...o, [campo]: valor } : o))
    );
  };

  const handleRegenerarOfertasAleatorias = () => {
    const nuevas = ofertasSimuladas.map((o) => ({
      ...o,
      valorOfertado: Math.round(
        presupuestoOficial * (0.82 + Math.random() * 0.17)
      )
    }));
    setOfertasSimuladas(nuevas);
  };

  const [copiadoActa, setCopiadoActa] = useState(false);

  // Generación en tiempo real del Acta de Adjudicación e Informe Económico
  const textoActa = ScoringFormulasEngine.redactarActaAdjudicacionOficial(
    {
      numeroProceso: procesoActivo?.numeroProceso || 'LP-001-2025',
      objeto: procesoActivo?.objeto || 'Contrato de Suministro Integral',
      entidadNombre: procesoActivo?.entidad.nombre || 'Entidad Contratante Estatal',
      presupuestoOficial: presupuestoOficial
    },
    resultadoSimulacion,
    modoSeleccionExogena === 'TRM'
      ? `TRM Superfinanciera ($${trmInput.toFixed(2)})`
      : modoSeleccionExogena === 'LOTERIA'
      ? `${loteriaNombre} (Premio Mayor ${loteriaInput})`
      : `Balotera en Audiencia Pública (Balota #${balotaSorteada})`,
    modoSeleccionExogena === 'TRM'
      ? digitosTRM.toString().padStart(2, '0')
      : modoSeleccionExogena === 'LOTERIA'
      ? digitosLoteria.toString().padStart(2, '0')
      : `Balota ${balotaSorteada} (${codigoBalota})`
  );

  const handleCopiarActa = () => {
    navigator.clipboard.writeText(textoActa);
    setCopiadoActa(true);
    setTimeout(() => setCopiadoActa(false), 2000);
  };

  const handleDescargarActa = (extension: 'txt' | 'md') => {
    const blob = new Blob([textoActa], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Acta_Adjudicacion_Economica_${procesoActivo?.numeroProceso || 'Proceso'}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportarOfertasDeSECOP2 = () => {
    if (!procesoActivo || procesoActivo.ofertasPresentadas.length === 0) {
      alert('El proceso activo de SECOP II no tiene ofertas radicadas.');
      return;
    }
    const importadas: OfertaSimulada[] = procesoActivo.ofertasPresentadas.map((o) => ({
      id: o.id,
      nombreProponente: o.proponente.razonSocial,
      valorOfertado: o.valorEconomicoTotal,
      esMiPyme: o.proponente.esMiPyme,
      esEmpresaMujeres: false,
      empleadosDiscapacidad: o.proponente.empleadosConDiscapacidad,
      industriaNacional: true,
      puntajeCalidadTecnica: o.puntajeObtenido.calidad || 20,
      habilitado: o.evaluacionJuridica === 'CUMPLE' && o.evaluacionFinanciera === 'CUMPLE' && o.evaluacionTecnica === 'CUMPLE',
      motivoInhabilitacion: o.evaluacionJuridica !== 'CUMPLE' ? 'No cumple requisitos habilitantes' : undefined
    }));
    setPresupuestoOficial(procesoActivo.presupuestoOficial);
    setOfertasSimuladas(importadas);
    alert(`Se importaron ${importadas.length} ofertas del proceso ${procesoActivo.numeroProceso} para calificar.`);
  };

  const handleAplicarPuntajesASECOP2 = () => {
    if (!procesoActivo) return;
    const mapa = resultadoSimulacion.ofertasCalificadas.map((o) => ({
      ofertaId: o.ofertaId,
      puntajeEconomico: o.puntajeEconomico,
      puntajeTotal: o.puntajeTotal,
      esGanador: o.posicion === 1
    }));
    aplicarPuntajesEconomicosProceso(procesoActivo.id, mapa);
    const ganadora = resultadoSimulacion.ofertasCalificadas.find((o) => o.posicion === 1);
    if (ganadora) {
      adjudicarProceso(procesoActivo.id, ganadora.ofertaId);
    }
    alert(`¡Puntajes oficiales aplicados al proceso ${procesoActivo.numeroProceso}! Adjudicatario formalizado: ${ganadora?.nombreProponente || 'N/A'}`);
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      {/* Cabecera del Módulo */}
      <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              <Calculator className="w-5 h-5" />
              Ingeniería de Evaluación Contractual & Pliegos Tipo CCE
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Indicadores Típicos y Simulador de Fórmulas de Calificación
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-4xl">
              Visualización integral de todos los indicadores habilitantes (financieros, organizacionales,
              K-Residual y experiencia) y simulador interactivo de las 6 fórmulas matemáticas oficiales de
              calificación económica de Colombia Compra Eficiente (CCE) con resolución de desempates (Ley 2069/2020).
            </p>
          </div>

          {/* Navegación por Pestañas */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto flex-wrap gap-1">
            <button
              onClick={() => setPestanaActiva('SIMULADOR_FORMULAS')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pestanaActiva === 'SIMULADOR_FORMULAS'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Simular las 5 fórmulas matemáticas oficiales de CCE (Media geométrica, aritmética alta, ponderada, mediana)"
            >
              <Sliders className="w-4 h-4" />
              Simulador Fórmulas CCE
            </button>
            <button
              onClick={() => setPestanaActiva('CATALOGO')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pestanaActiva === 'CATALOGO'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Consultar catálogo de fórmulas, rangos de asignación y parámetros de calificación CCE"
            >
              <Layers className="w-4 h-4" />
              Matriz Indicadores (360°)
            </button>
            <button
              onClick={() => setPestanaActiva('K_RESIDUAL')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pestanaActiva === 'K_RESIDUAL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cálculo de Capacidad Residual K para contratación de obra pública según Ley 1682 de 2013"
            >
              <Building className="w-4 h-4" />
              K-Residual
            </button>
            <button
              onClick={() => setPestanaActiva('ACTA_ADJUDICACION')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pestanaActiva === 'ACTA_ADJUDICACION'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Generar y redactar acta oficial de audiencia económica de adjudicación e informe de evaluación"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Acta Oficial Adjudicación
            </button>
          </div>
        </div>
      </div>

      {/* PESTAÑA 1: SIMULADOR DE FÓRMULAS DE CALIFICACIÓN ECONÓMICA */}
      {pestanaActiva === 'SIMULADOR_FORMULAS' && (
        <div className="space-y-6">
          {/* Panel Interactivo: Selección de Fórmula mediante Variables Exógenas (Regla Pliegos Tipo CCE) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                  <Coins className="w-4 h-4" />
                  Mecanismos Oficiales de Selección de Fórmula (Pliegos Tipo CCE)
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Variables Exógenas Públicas & Indicadores Macroeconómicos
                </h2>
                <p className="text-xs text-slate-500">
                  En los pliegos tipo, la fórmula económica se determina por la TRM del día, lotería oficial o sorteo de balotas en audiencia pública.
                </p>
              </div>

              {/* Selector de Modo */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => handleSeleccionarPorTRM(trmInput)}
                  className={`px-3 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                    modoSeleccionExogena === 'TRM'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Calcular fórmula según los dos últimos decimales de la Tasa Representativa del Mercado (TRM)"
                >
                  Dólar TRM
                </button>
                <button
                  onClick={handleGirarBalotera}
                  className={`px-3 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                    modoSeleccionExogena === 'BALOTA'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Simular sorteo aleatorio de balota con hash criptográfico SHA-256 en audiencia pública"
                >
                  Balotera
                </button>
                <button
                  onClick={() => handleSeleccionarPorLoteria(loteriaInput)}
                  className={`px-3 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                    modoSeleccionExogena === 'LOTERIA'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Seleccionar fórmula a partir de los dos últimos dígitos del premio mayor de lotería oficial"
                >
                  Lotería
                </button>
                <button
                  onClick={() => setModoSeleccionExogena('MANUAL')}
                  className={`px-3 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                    modoSeleccionExogena === 'MANUAL'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Elegir manualmente cualquiera de las 5 fórmulas de evaluación económica de CCE"
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Tarjetas de Variables Exógenas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Tarjeta 1: TRM del Dólar */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  modoSeleccionExogena === 'TRM'
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Tasa TRM (Superfinanciera)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    Dólar Oficial
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    step="0.01"
                    value={trmInput}
                    onChange={(e) => handleSeleccionarPorTRM(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-black text-base text-slate-900 bg-white"
                  />
                  <div className="text-center px-2 py-1 bg-white rounded border border-blue-200 shrink-0">
                    <span className="text-[10px] text-slate-400 block uppercase">2 Dígitos</span>
                    <span className="font-black text-blue-700 text-sm">
                      {digitosTRM.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>
                    <strong>Fórmula Asignada:</strong>{' '}
                    <span className="text-blue-700 font-bold">{infoFormulaTRM.nombreFormula}</span>
                  </div>
                  <div className="text-slate-500">{infoFormulaTRM.rangoTexto}</div>
                </div>
              </div>

              {/* Tarjeta 2: Balotera Digital de Audiencia Pública */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  modoSeleccionExogena === 'BALOTA'
                    ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Dices className="w-4 h-4 text-amber-600" />
                    Balotera de Audiencia Pública
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    Urna CCE
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <span
                        key={num}
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                          balotaSorteada === num
                            ? 'bg-amber-500 text-white shadow-md scale-110 ring-2 ring-amber-300'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleGirarBalotera}
                    className="px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-colors shrink-0"
                  >
                    Girar Urna
                  </button>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>
                    <strong>Balota Extraída:</strong> #{balotaSorteada} ({metodoSeleccionado.replace(/_/g, ' ')})
                  </div>
                  <div className="text-slate-400 font-mono text-[10px]">Hash: {codigoBalota}</div>
                </div>
              </div>

              {/* Tarjeta 3: Lotería Oficial */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  modoSeleccionExogena === 'LOTERIA'
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    Premio Mayor Lotería Oficial
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Sorteo
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={loteriaInput}
                    onChange={(e) => handleSeleccionarPorLoteria(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-black text-base text-slate-900 bg-white tracking-widest text-center"
                  />
                  <div className="text-center px-2 py-1 bg-white rounded border border-emerald-200 shrink-0">
                    <span className="text-[10px] text-slate-400 block uppercase">2 Últimos</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {digitosLoteria.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>
                    <strong>Fórmula:</strong>{' '}
                    <span className="text-emerald-700 font-bold">{infoFormulaLoteria.nombreFormula}</span>
                  </div>
                  <div className="text-slate-500">{infoFormulaLoteria.rangoTexto}</div>
                </div>
              </div>
            </div>

            {/* Malla de los 6 Rangos Oficiales de CCE con Iluminación del Rango Activo */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 uppercase block mb-2">
                Tabla Oficial de Rangos CCE para Variables Exógenas (00 a 99):
              </span>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                {ScoringFormulasEngine.RANGOS_CCE_VARIABLES_EXOGENAS.map((r) => {
                  const esActivo = metodoSeleccionado === r.metodo;
                  return (
                    <div
                      key={r.rangoMin}
                      onClick={() => setMetodoSeleccionado(r.metodo)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        esActivo
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-400/40'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono font-bold text-[11px] mb-1">
                        <span>
                          [{r.rangoMin.toString().padStart(2, '0')} - {r.rangoMax.toString().padStart(2, '0')}]
                        </span>
                        {esActivo && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="font-bold text-xs leading-snug truncate">{r.nombreFormula}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cinta de Macroindicadores Económicos Oficiales */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-3 bg-slate-50 p-2.5 rounded-lg">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                Indicadores Económicos del Entorno:
              </span>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
                <span>
                  <strong>Dólar TRM:</strong> ${trmInput.toLocaleString('es-CO')} COP
                </span>
                <span>
                  <strong>Inflación IPC:</strong> 5.81% anual (DANE)
                </span>
                <span>
                  <strong>DTF E.A.:</strong> 9.85% (BanRep)
                </span>
                <span>
                  <strong>SMMLV:</strong> ${SMMLV_2026.toLocaleString('es-CO')} COP
                </span>
                <span>
                  <strong>UVT:</strong> $49.799 COP
                </span>
              </div>
            </div>
          </div>

          {/* Panel de Configuración de la Simulación */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Configuración del Proceso y Método de Calificación
                </h2>
                <p className="text-xs text-slate-500">
                  Selecciona la fórmula elegida en audiencia pública por balota o sorteo
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={handleImportarOfertasDeSECOP2}
                  className="flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded border border-blue-200 transition-colors"
                  title="Importar ofertas radicadas en el proceso activo de SECOP II"
                >
                  <Download className="w-3.5 h-3.5" />
                  Cargar de SECOP II
                </button>
                <button
                  onClick={handleAplicarPuntajesASECOP2}
                  className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded border border-emerald-200 transition-colors"
                  title="Actualizar SECOP II con los puntajes y adjudicación calculados"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Aplicar a SECOP II
                </button>
                <button
                  onClick={() => setPestanaActiva('ACTA_ADJUDICACION')}
                  className="flex items-center gap-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-3 py-1.5 rounded border border-purple-200 transition-colors"
                  title="Generar Acta Oficial de Audiencia Pública"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Acta Oficial
                </button>
                <button
                  onClick={handleRegenerarOfertasAleatorias}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Aleatorizar
                </button>
                <button
                  onClick={handleAgregarOferta}
                  className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded border border-indigo-200 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Añadir Licitante
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Presupuesto Oficial (COP):
                </label>
                <input
                  type="number"
                  value={presupuestoOficial}
                  onChange={(e) => setPresupuestoOficial(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Fórmula Matemática CCE:
                </label>
                <select
                  value={metodoSeleccionado}
                  onChange={(e) =>
                    setMetodoSeleccionado(e.target.value as MetodoCalificacionEconomica)
                  }
                  className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MEDIA_ARITMETICA_SIMPLE">Media Aritmética Simple</option>
                  <option value="MEDIA_ARITMETICA_ALTA_TRM">Media Aritmética Alta (TRM)</option>
                  <option value="MEDIA_GEOMETRICA">Media Geométrica</option>
                  <option value="MEDIA_PONDERADA_PRESUPUESTO">
                    Media Ponderada con Presupuesto Oficial
                  </option>
                  <option value="MEDIANA_VALOR_ABSOLUTO">Mediana con Valor Absoluto</option>
                  <option value="MENOR_PRECIO">Menor Precio (Proporcionalidad)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Puntaje Máximo Económico:
                </label>
                <input
                  type="number"
                  value={puntajeMaxEcon}
                  onChange={(e) => setPuntajeMaxEcon(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ajuste TRM / Factor Aleatorio:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="0.05"
                    step="0.005"
                    value={factorTRM}
                    onChange={(e) => setFactorTRM(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <span className="font-bold text-indigo-700 w-12 text-right">
                    {(factorTRM * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Banner de Fórmula Activa y Parámetros Calculados */}
            <div className="p-3.5 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-bold text-indigo-950 block">
                  Fórmula Matemática Aplicada:
                </span>
                <code className="text-indigo-800 font-mono font-bold text-xs bg-white/80 px-2 py-0.5 rounded border border-indigo-200">
                  {resultadoSimulacion.formulaMatematicaTexto}
                </code>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Valor Referencia Calculado:</span>
                  <span className="font-extrabold text-slate-800 text-sm">
                    ${resultadoSimulacion.mediaOCalculoBase.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Desviación Estándar (σ):</span>
                  <span className="font-bold text-slate-700">
                    ${resultadoSimulacion.desviacionEstandar.toLocaleString('es-CO')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Umbral Precio Artificialmente Bajo:</span>
                  <span className="font-bold text-rose-600">
                    ${resultadoSimulacion.umbralPrecioBajo.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico Visual de Resultados y Ranking de Adjudicación */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Orden de Elegibilidad y Puntuaciones Finales (100 Puntos Máximos)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Aplica reglas de desempate Art. 35 Ley 2069 de 2020
              </span>
            </h2>

            <div className="space-y-3">
              {resultadoSimulacion.ofertasCalificadas.map((c) => {
                const esPrimero = c.posicion === 1;
                const pctPuntaje = Math.min(100, c.puntajeTotal);

                return (
                  <div
                    key={c.ofertaId}
                    className={`p-4 rounded-xl border transition-all ${
                      esPrimero
                        ? 'bg-amber-50/60 border-amber-300 shadow-sm ring-1 ring-amber-400/40'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                            esPrimero
                              ? 'bg-amber-500 text-white shadow'
                              : c.posicion === 2
                              ? 'bg-slate-300 text-slate-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.posicion}°
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm block">
                              {c.nombreProponente}
                            </span>
                            {c.nombreProponente.includes('SANJUANES') && (
                              <div className="flex items-center gap-1 bg-slate-900 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                                <img
                                  src="/sanjuanes/sanjuanes_icon.png"
                                  alt="Sanjuanes Logo"
                                  className="w-3.5 h-3.5 object-contain"
                                />
                                <span className="text-lime-400">Insignia</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            Valor Ofertado: ${c.valorOfertado.toLocaleString('es-CO')} COP (
                            {((c.valorOfertado / presupuestoOficial) * 100).toFixed(1)}% del PO)
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-slate-900">
                          {c.puntajeTotal} <span className="text-xs font-medium text-slate-500">/ 100 pts</span>
                        </div>
                        {esPrimero && (
                          <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Primer Orden de Elegibilidad (Ganador)
                          </span>
                        )}
                        {c.esPrecioArtificialmenteBajo && (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 ml-1">
                            ⚠ Sospecha Precio Bajo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Barra de Distribución de Puntaje */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex mb-2">
                      {/* Económico */}
                      <div
                        style={{ width: `${(c.puntajeEconomico / 100) * 100}%` }}
                        className="bg-indigo-600 h-full"
                        title={`Económico: ${c.puntajeEconomico} pts`}
                      />
                      {/* Calidad Técnica */}
                      <div
                        style={{ width: `${(c.puntajeCalidad / 100) * 100}%` }}
                        className="bg-emerald-500 h-full"
                        title={`Calidad Técnica: ${c.puntajeCalidad} pts`}
                      />
                      {/* Industria Nacional */}
                      <div
                        style={{ width: `${(c.puntajeIndustriaNacional / 100) * 100}%` }}
                        className="bg-amber-500 h-full"
                        title={`Industria Nacional: ${c.puntajeIndustriaNacional} pts`}
                      />
                      {/* MiPyme */}
                      <div
                        style={{ width: `${(c.puntajeMiPyme / 100) * 100}%` }}
                        className="bg-purple-500 h-full"
                        title={`MiPyme: ${c.puntajeMiPyme} pts`}
                      />
                      {/* Mujeres */}
                      <div
                        style={{ width: `${(c.puntajeMujeres / 100) * 100}%` }}
                        className="bg-pink-500 h-full"
                        title={`Empresas Mujeres: ${c.puntajeMujeres} pts`}
                      />
                      {/* Discapacidad */}
                      <div
                        style={{ width: `${(c.puntajeDiscapacidad / 100) * 100}%` }}
                        className="bg-cyan-500 h-full"
                        title={`Discapacidad: ${c.puntajeDiscapacidad} pts`}
                      />
                    </div>

                    {/* Desglose de Puntos por Factor */}
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-100 gap-2">
                      <div className="flex items-center gap-3">
                        <span>
                          <strong className="text-indigo-700">Precio:</strong> {c.puntajeEconomico}
                        </span>
                        <span>
                          <strong className="text-emerald-700">Calidad:</strong> {c.puntajeCalidad}
                        </span>
                        <span>
                          <strong className="text-amber-700">Industria Nac:</strong>{' '}
                          {c.puntajeIndustriaNacional}
                        </span>
                        <span>
                          <strong className="text-purple-700">MiPyme:</strong> {c.puntajeMiPyme}
                        </span>
                        <span>
                          <strong className="text-pink-700">Mujeres:</strong> {c.puntajeMujeres}
                        </span>
                        <span>
                          <strong className="text-cyan-700">Discapacidad:</strong>{' '}
                          {c.puntajeDiscapacidad}
                        </span>
                      </div>

                      <span className="font-mono text-slate-500 text-[10px]">
                        {c.detallesCalculo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabla Editable de Ofertas Simuladas */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Panel de Control de Licitantes Concurrentes</span>
              <span className="text-xs text-indigo-600 font-semibold">
                Edita los valores en vivo para ver la sensibilidad de la fórmula
              </span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Proponente</th>
                    <th className="p-2.5">Valor Económico (COP)</th>
                    <th className="p-2.5 text-center">MiPyme</th>
                    <th className="p-2.5 text-center">Empresa Mujeres</th>
                    <th className="p-2.5 text-center">Discapacidad</th>
                    <th className="p-2.5 text-center">Ind. Nacional</th>
                    <th className="p-2.5 text-center">Pts Calidad</th>
                    <th className="p-2.5 text-center">Habilitado</th>
                    <th className="p-2.5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ofertasSimuladas.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={o.nombreProponente}
                          onChange={(e) =>
                            handleActualizarOferta(o.id, 'nombreProponente', e.target.value)
                          }
                          className="w-full p-1.5 border border-slate-300 rounded text-slate-800 font-medium"
                        />
                      </td>

                      <td className="p-2.5">
                        <input
                          type="number"
                          value={o.valorOfertado}
                          onChange={(e) =>
                            handleActualizarOferta(o.id, 'valorOfertado', Number(e.target.value))
                          }
                          className="w-36 p-1.5 border border-slate-300 rounded font-bold text-slate-900"
                        />
                      </td>

                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={o.esMiPyme}
                          onChange={(e) =>
                            handleActualizarOferta(o.id, 'esMiPyme', e.target.checked)
                          }
                          className="rounded text-indigo-600 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={o.esEmpresaMujeres}
                          onChange={(e) =>
                            handleActualizarOferta(o.id, 'esEmpresaMujeres', e.target.checked)
                          }
                          className="rounded text-pink-600 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={o.empleadosDiscapacidad}
                          onChange={(e) =>
                            handleActualizarOferta(o.id, 'empleadosDiscapacidad', e.target.checked)
                          }
                          className="rounded text-cyan-600 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={o.industriaNacional}
                          onChange={(e) =>
                            handleActualizarOferta(o.id, 'industriaNacional', e.target.checked)
                          }
                          className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="p-2.5 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={o.puntajeCalidadTecnica}
                          onChange={(e) =>
                            handleActualizarOferta(
                              o.id,
                              'puntajeCalidadTecnica',
                              Number(e.target.value)
                            )
                          }
                          className="w-16 p-1.5 border border-slate-300 rounded text-center font-bold"
                        />
                      </td>

                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={o.habilitado}
                          onChange={(e) =>
                            handleActualizarOferta(o.id, 'habilitado', e.target.checked)
                          }
                          className="rounded text-emerald-600 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => handleEliminarOferta(o.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar licitante"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: CATÁLOGO UNIVERSAL DE INDICADORES TÍPICOS (360°) */}
      {pestanaActiva === 'CATALOGO' && (
        <div className="space-y-6">
          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700 uppercase">Filtrar por:</span>
                {[
                  { id: 'TODOS', label: 'Todos (18)' },
                  { id: 'HABILITANTE_FINANCIERO', label: 'Financieros RUP' },
                  { id: 'HABILITANTE_ORGANIZACIONAL', label: 'Organizacionales' },
                  { id: 'HABILITANTE_K_RESIDUAL', label: 'K-Residual (Obra)' },
                  { id: 'HABILITANTE_EXPERIENCIA', label: 'Experiencia' },
                  { id: 'HABILITANTE_JURIDICO', label: 'Jurídicos' },
                  { id: 'CALIFICABLE_ECONOMICO', label: 'Precio CCE' },
                  { id: 'CRITERIO_DESEMPATE', label: 'Desempates Ley 2069' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCategoriaFiltro(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      categoriaFiltro === f.id
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
                  placeholder="Buscar por nombre, ley o fórmula..."
                  value={busquedaIndicador}
                  onChange={(e) => setBusquedaIndicador(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Grilla de Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {indicadoresFiltrados.map((ind) => (
              <div
                key={ind.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        ind.tipoEvaluacion === 'PASA_NO_PASA'
                          ? 'bg-blue-100 text-blue-800'
                          : ind.tipoEvaluacion === 'ASIGNA_PUNTAJE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {ind.tipoEvaluacion.replace(/_/g, ' ')}
                    </span>
                    {ind.puntajeMaximo && (
                      <span className="font-bold text-amber-600 text-xs">
                        Máx. {ind.puntajeMaximo} Puntos
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {ind.nombre}
                  </h3>

                  <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Fórmula Matemática:
                    </span>
                    <code className="text-xs font-mono font-bold text-indigo-700 block mt-0.5">
                      {ind.formula}
                    </code>
                  </div>

                  <div className="mt-2 text-xs space-y-1">
                    <div className="flex items-start gap-1">
                      <strong className="text-slate-600 shrink-0">Rango Estándar:</strong>
                      <span className="text-slate-800 font-semibold">{ind.rangoEstandar}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <strong className="text-slate-600 shrink-0">Norma:</strong>
                      <span className="text-slate-500">{ind.fundamentoLegal}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50/50 p-2.5 rounded border border-slate-100">
                    {ind.explicacion}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 text-[11px] text-indigo-900 bg-indigo-50/50 p-2 rounded">
                  <span className="font-bold">Consideración CCE: </span>
                  {ind.importanciaEstrategica}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: CALCULADORA DE K-RESIDUAL (OBRA PÚBLICA) */}
      {pestanaActiva === 'K_RESIDUAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                <Building className="w-4 h-4" />
                Decreto 1082 de 2015 / Art. 72 Ley 1682 de 2013
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Calculadora de Capacidad Residual de Contratación (K-Residual)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Exigido obligatoriamente en procesos de obra pública. Determina si el contratista cuenta con
                capacidad operativa libre para ejecutar la obra sin caer en parálisis contractual.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  1. Experiencia Acreditada en Obra (E en SMMLV):
                </label>
                <input
                  type="number"
                  value={kDatos.experienciaSMMLV}
                  onChange={(e) =>
                    setKDatos({ ...kDatos, experienciaSMMLV: Number(e.target.value) })
                  }
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  2. Capacidad Financiera (CF - Índice de Liquidez RUP):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={kDatos.capacidadFinancieraLiquidez}
                  onChange={(e) =>
                    setKDatos({
                      ...kDatos,
                      capacidadFinancieraLiquidez: Number(e.target.value)
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  3. Capacidad Técnica (CT - Ingenieros y Técnicos de Planta vinculados):
                </label>
                <input
                  type="number"
                  value={kDatos.profesionalesTecnicos}
                  onChange={(e) =>
                    setKDatos({ ...kDatos, profesionalesTecnicos: Number(e.target.value) })
                  }
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  4. Capacidad de Organización (CO - Ingresos Operacionales en SMMLV):
                </label>
                <input
                  type="number"
                  value={kDatos.ingresosOperacionalesSMMLV}
                  onChange={(e) =>
                    setKDatos({
                      ...kDatos,
                      ingresosOperacionalesSMMLV: Number(e.target.value)
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  5. Saldos de Contratos de Obra en Ejecución (SCE en COP):
                </label>
                <input
                  type="number"
                  value={kDatos.saldosContratosEnEjecucionCOP}
                  onChange={(e) =>
                    setKDatos({
                      ...kDatos,
                      saldosContratosEnEjecucionCOP: Number(e.target.value)
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded font-bold text-rose-700"
                />
                <span className="text-[10px] text-slate-500">
                  Resta directamente de la capacidad total del proponente
                </span>
              </div>
            </div>
          </div>

          {/* Resultado de la Capacidad Residual */}
          <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-sm uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Dictamen de Habilitación de Obra</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Decreto 1082 / Guía CCE
              </span>
            </h3>

            {/* Gran Métrica del K-Residual */}
            <div className="bg-slate-900 text-white p-5 rounded-xl space-y-2">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                Capacidad Residual Final Disponible (KR):
              </span>
              <div className="text-2xl font-black text-emerald-400">
                ${resultadoKResidual.kResidualTotalCOP.toLocaleString('es-CO')} COP
              </div>
              <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Presupuesto Oficial del Proceso:</span>
                <span className="font-bold text-white">
                  ${presupuestoOficial.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="pt-2">
                {resultadoKResidual.kResidualTotalCOP >= presupuestoOficial ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 p-2 rounded border border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡CUMPLE! El K-Residual supera el Presupuesto Oficial exigido.
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/60 p-2 rounded border border-rose-800">
                    <AlertTriangle className="w-4 h-4" />
                    ¡NO CUMPLE! K-Residual insuficiente. Requiere consorciarse.
                  </span>
                )}
              </div>
            </div>

            {/* Puntuación Ponderada de Componentes */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Puntaje Experiencia (E - 40%):</span>
                <span className="font-bold text-slate-800 text-base">
                  {resultadoKResidual.puntajeE} / 100
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Capacidad Financiera (CF - 20%):</span>
                <span className="font-bold text-slate-800 text-base">
                  {resultadoKResidual.puntajeCF} / 100
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Capacidad Técnica (CT - 20%):</span>
                <span className="font-bold text-slate-800 text-base">
                  {resultadoKResidual.puntajeCT} / 100
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Organización (CO - 20%):</span>
                <span className="font-bold text-slate-800 text-base">
                  {resultadoKResidual.puntajeCO} / 100
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
              <strong>Estrategia de Licitación Plural:</strong> Si un contratista no alcanza el K-Residual
              individualmente, la normativa colombiana permite sumar las capacidades residuales de los integrantes
              mediante un <strong>Consorcio</strong> o <strong>Unión Temporal</strong>.
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: ACTA OFICIAL DE AUDIENCIA PÚBLICA Y ADJUDICACIÓN */}
      {pestanaActiva === 'ACTA_ADJUDICACION' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                  <FileSpreadsheet className="w-4 h-4" />
                  Acto Administrativo Formal - Pliegos Tipo Colombia Compra Eficiente
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Acta de Audiencia Pública de Evaluación Económica y Adjudicación
                </h2>
                <p className="text-xs text-slate-500">
                  Documento formal redactado automáticamente con base en la fórmula sorteada, cálculo de umbrales y orden de mérito.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={handleCopiarActa}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    copiadoActa
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiadoActa ? '¡Copiado!' : 'Copiar Texto'}
                </button>
                <button
                  onClick={() => handleDescargarActa('txt')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar (.txt)
                </button>
                <button
                  onClick={() => handleDescargarActa('md')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar (.md)
                </button>
                <button
                  onClick={() => setModalImpresionActa(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                  title="Generar formato institucional listo para guardar en PDF o imprimir"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Previsualizar / Imprimir PDF
                </button>
                <button
                  onClick={handleAplicarPuntajesASECOP2}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  Formalizar Adjudicación en SECOP II
                </button>
              </div>
            </div>

            {/* Cuadro Resumen del Ganador y Fórmula Sorteada */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg">
                <span className="text-blue-600 font-bold block mb-1">MÉTODO LEGAL APLICADO:</span>
                <span className="text-sm font-extrabold text-blue-950 block">
                  {resultadoSimulacion.formulaMatematicaTexto}
                </span>
                <span className="text-[11px] text-blue-700 mt-1 block">
                  Media/Base: ${Math.round(resultadoSimulacion.mediaOCalculoBase).toLocaleString('es-CO')} COP
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                <span className="text-emerald-600 font-bold block mb-1">ADJUDICATARIO OFICIAL (1° LUGAR):</span>
                <span className="text-sm font-extrabold text-emerald-950 block">
                  {resultadoSimulacion.ofertasCalificadas.find(o => o.posicion === 1)?.nombreProponente || 'N/A'}
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block">
                  Puntaje: {resultadoSimulacion.ofertasCalificadas.find(o => o.posicion === 1)?.puntajeTotal.toFixed(2)} pts | Valor: ${resultadoSimulacion.ofertasCalificadas.find(o => o.posicion === 1)?.valorOfertado.toLocaleString('es-CO')} COP
                </span>
              </div>

              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-lg">
                <span className="text-purple-600 font-bold block mb-1">VARIABLE EXÓGENA VERIFICADA:</span>
                <span className="text-sm font-extrabold text-purple-950 block">
                  {modoSeleccionExogena === 'TRM'
                    ? `TRM: $${trmInput.toFixed(2)} (Centavos: ${digitosTRM})`
                    : modoSeleccionExogena === 'LOTERIA'
                    ? `${loteriaNombre} (${loteriaInput})`
                    : `Balota #${balotaSorteada}`}
                </span>
                <span className="text-[11px] text-purple-700 mt-1 block">
                  Conforme al Manual de CCE y Pliegos Tipo
                </span>
              </div>
            </div>

            {/* Visualizador de Minuta del Acta */}
            <div className="relative">
              <textarea
                value={textoActa}
                readOnly
                className="w-full h-[420px] p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-700 leading-relaxed resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Visor Imprimible de Acta Oficial */}
      <PrintableDocumentModal
        abierto={modalImpresionActa}
        onCerrar={() => setModalImpresionActa(false)}
        tipoDocumento="ACTA_AUDIENCIA_FORMULAS"
      />
    </div>
  );
};
