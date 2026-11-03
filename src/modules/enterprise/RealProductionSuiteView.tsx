// Suite de Operación Real y Producción Enterprise - ProcureSuite v2.0
// Lector de RUP Oficial (Cámaras de Comercio), Conector SECOP II en Vivo y Dictamen Vinculante
import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  FileText,
  Search,
  Download,
  Copy,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Award,
  Hash,
  Upload,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { RupParserEngine } from '../../core/engines/RupParserEngine';
import { Secop2LiveConnectorEngine } from '../../core/engines/Secop2LiveConnectorEngine';
import type {
  CertificadoRUPOficial,
  ProcesoSecop2Real,
  DictamenHabilitacionReal
} from '../../core/domain/types';

export const RealProductionSuiteView: React.FC = () => {
  const { modoOperativo, setModoOperativo } = useProcurementStore();

  // Pestañas de la Suite Real
  const [pestana, setPestana] = useState<'RUP_OFICIAL' | 'SECOP2_EN_VIVO' | 'DICTAMEN_VINCULANTE'>('RUP_OFICIAL');

  // Estados de RUP
  const [rupsDisponibles, setRupsDisponibles] = useState<CertificadoRUPOficial[]>(
    RupParserEngine.RUPS_OFICIALES_DEMO
  );
  const [rupSeleccionado, setRupSeleccionado] = useState<CertificadoRUPOficial>(
    RupParserEngine.RUPS_OFICIALES_DEMO[0] // Sanjuanés Soluciones
  );

  // Estados de SECOP II
  const [procesosReales, setProcesosReales] = useState<ProcesoSecop2Real[]>(
    Secop2LiveConnectorEngine.PROCESOS_REALES_SECOP2
  );
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<ProcesoSecop2Real>(
    Secop2LiveConnectorEngine.PROCESOS_REALES_SECOP2[0] // MinTIC
  );
  const [busquedaSecop2, setBusquedaSecop2] = useState('');
  const [buscandoEnVivo, setBuscandoEnVivo] = useState(false);

  // Estado del Dictamen
  const [dictamen, setDictamen] = useState<DictamenHabilitacionReal>(() =>
    RupParserEngine.evaluarHabilitacionRUP(
      RupParserEngine.RUPS_OFICIALES_DEMO[0],
      Secop2LiveConnectorEngine.PROCESOS_REALES_SECOP2[0].requisitosHabilitantes,
      Secop2LiveConnectorEngine.PROCESOS_REALES_SECOP2[0]
    )
  );
  const [copiadoActa, setCopiadoActa] = useState(false);

  // Ejecutar dictamen formal
  const handleEjecutarEvaluacion = () => {
    const res = RupParserEngine.evaluarHabilitacionRUP(
      rupSeleccionado,
      procesoSeleccionado.requisitosHabilitantes,
      procesoSeleccionado
    );
    setDictamen(res);
    setPestana('DICTAMEN_VINCULANTE');
  };

  // Buscar procesos en vivo en SECOP II (datos.gov.co)
  const handleBuscarSecop2 = async () => {
    if (!busquedaSecop2.trim()) return;
    setBuscandoEnVivo(true);
    try {
      const resultados = await Secop2LiveConnectorEngine.consultarSecop2EnVivo(busquedaSecop2);
      if (resultados.length > 0) {
        setProcesosReales(resultados);
        setProcesoSeleccionado(resultados[0]);
      } else {
        alert('No se encontraron procesos en SECOP II con el criterio especificado.');
      }
    } finally {
      setBuscandoEnVivo(false);
    }
  };

  // Copiar acta oficial
  const handleCopiarActa = () => {
    const texto = RupParserEngine.redactarActaEvaluacionOficial(dictamen);
    navigator.clipboard.writeText(texto);
    setCopiadoActa(true);
    setTimeout(() => setCopiadoActa(false), 2000);
  };

  // Descargar acta oficial
  const handleDescargarActa = () => {
    const texto = RupParserEngine.redactarActaEvaluacionOficial(dictamen);
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Informe_Habilitacion_RUP_${dictamen.procesoAuditado.numeroProceso}_${dictamen.proponente.nit}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const esModoReal = modoOperativo === 'PRODUCCION_REAL';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Master Control Banner: Conmutador de Entorno Maestro */}
      <div
        className={`p-5 rounded-2xl border text-white shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          esModoReal
            ? 'bg-gradient-to-r from-slate-950 via-amber-950/80 to-slate-900 border-amber-500/40'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              esModoReal
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 ring-2 ring-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {esModoReal ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                {esModoReal
                  ? 'SUITE DE OPERACIÓN REAL & ENTERPRISE (SECOP II & RUP)'
                  : 'MODO ENTRENAMIENTO & SANDBOX DIDÁCTICO'}
              </h1>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  esModoReal
                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                    : 'bg-emerald-400 text-slate-950'
                }`}
              >
                {esModoReal ? 'VINCULANTE / LEY 527' : 'SANDBOX SIMULADOR'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {esModoReal
                ? 'Auditoría estricta de pliegos reales, lectura de RUP oficial de Cámaras de Comercio y dictámenes bloqueantes con validez probatoria.'
                : 'Entorno de pruebas y capacitación interactiva. Alterne a Modo Producción para evaluar pliegos y proponentes reales.'}
            </p>
          </div>
        </div>

        {/* Switch Maestro */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Entorno:</span>
          <button
            onClick={() => setModoOperativo('ENTRENAMIENTO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !esModoReal
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Activar Entorno Didáctico / Sandbox con simulaciones libres y tutoría guiada"
          >
            🎓 Sandbox
          </button>
          <button
            onClick={() => setModoOperativo('PRODUCCION_REAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              esModoReal
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Activar Entorno de Producción Real con validaciones bloqueantes y expedientes vinculantes"
          >
            🏢 Producción Real
          </button>
        </div>
      </div>

      {/* 2. Pestañas de la Suite Real */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs">
          <button
            onClick={() => setPestana('RUP_OFICIAL')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              pestana === 'RUP_OFICIAL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Lector, extractor y verificador de certificados RUP oficiales expedidos por Cámaras de Comercio"
          >
            <FileText className="w-4 h-4" />
            <span>1. RUP Oficial (Cámara de Comercio)</span>
          </button>

          <button
            onClick={() => setPestana('SECOP2_EN_VIVO')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              pestana === 'SECOP2_EN_VIVO'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Conector e ingestor en vivo de procesos reales de SECOP II vía Datos Abiertos y expedientes oficiales"
          >
            <Globe className="w-4 h-4" />
            <span>2. Conector SECOP II Real</span>
          </button>

          <button
            onClick={() => setPestana('DICTAMEN_VINCULANTE')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              pestana === 'DICTAMEN_VINCULANTE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dictamen formal vinculante del Comité Asesor Evaluador con hash inmutable (Ley 527 de 1999)"
          >
            <Award className="w-4 h-4" />
            <span>3. Dictamen Vinculante & Evaluación</span>
          </button>
        </div>

        {/* Botón Acción Rápida: Evaluar RUP vs Proceso */}
        <button
          onClick={handleEjecutarEvaluacion}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          title="Ejecutar auditoría bloqueante y cruzar el RUP seleccionado contra el pliego oficial de SECOP II"
        >
          <Zap className="w-4 h-4 text-lime-300" />
          <span>Evaluar Cumplimiento Habilitante</span>
        </button>
      </div>

      {/* 3. PESTAÑA 1: LECTOR & EXTRACTOR DE RUP OFICIAL */}
      {pestana === 'RUP_OFICIAL' && (
        <div className="space-y-6">
          {/* Selector de RUP / Carga de Archivo */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Certificado RUP Oficial de la Cámara de Comercio
                </h2>
                <p className="text-xs text-slate-500">
                  Extracción estructurada de capacidad jurídica, financiera, organizacional y experiencia clasificada en UNSPSC.
                </p>
              </div>

              {/* Selector de RUP */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Proponente RUP:</span>
                <select
                  value={rupSeleccionado.id}
                  onChange={(e) => {
                    const found = rupsDisponibles.find((r) => r.id === e.target.value);
                    if (found) setRupSeleccionado(found);
                  }}
                  className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 cursor-pointer focus:outline-none"
                  title="Seleccionar certificado RUP de oferente habilitado en RUES"
                >
                  {rupsDisponibles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.razonSocial} (NIT: {r.nit}) - {r.vigente ? 'Vigente' : 'Vencido'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ficha Principal del RUP Seleccionado */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Cámara Emisora:</span>
                <span className="font-bold text-slate-800 text-xs">{rupSeleccionado.camaraComercio}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Inscripción: #{rupSeleccionado.numeroInscripcionRUP}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Vigencia & Renovación:</span>
                <div className="flex items-center gap-1.5 font-bold">
                  {rupSeleccionado.vigente ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Vigente (Renovado {rupSeleccionado.fechaRenovacion})
                    </span>
                  ) : (
                    <span className="text-rose-700 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      No Renovado a Tiempo (Vencido)
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Expedición: {rupSeleccionado.fechaExpedicion}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Tamaño & Naturaleza:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-indigo-700 text-xs">Empresa {rupSeleccionado.tamanoEmpresa}</span>
                  {rupSeleccionado.esSociedadBIC && (
                    <span
                      className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[9px] font-mono"
                      title="Sociedad de Beneficio e Interés Colectivo - Ley 1901 de 2018 (Preferencia en desempates y compras sostenibles)"
                    >
                      ★ SOCIEDAD BIC
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Ley 2069 / Ley 1901</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Hash Trazabilidad RUP:</span>
                <span className="font-mono text-[10px] text-slate-600 truncate block" title={rupSeleccionado.hashVerificacionSHA256}>
                  {rupSeleccionado.hashVerificacionSHA256}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Archivo: {rupSeleccionado.archivoOrigen}</span>
              </div>
            </div>

            {/* Tarjetas de Indicadores Financieros Oficiales */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                Indicadores Financieros & Organizacionales (Decreto 1082 de 2015)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div
                  className="p-3 rounded-xl bg-blue-50/60 border border-blue-200"
                  title="Índice de Liquidez = Activo Corriente / Pasivo Corriente (mínimo típico >= 1.5)"
                >
                  <span className="text-[10px] font-bold text-blue-700 block">Índice Liquidez</span>
                  <div className="text-base font-black text-blue-900 font-mono">
                    {rupSeleccionado.indicadores.indiceLiquidez.toFixed(2)}
                  </div>
                  <span className="text-[9px] text-blue-600">Activo Cte / Pasivo Cte</span>
                </div>

                <div
                  className="p-3 rounded-xl bg-purple-50/60 border border-purple-200"
                  title="Nivel de Endeudamiento = Pasivo Total / Activo Total * 100 (máximo típico <= 70%)"
                >
                  <span className="text-[10px] font-bold text-purple-700 block">Endeudamiento</span>
                  <div className="text-base font-black text-purple-900 font-mono">
                    {rupSeleccionado.indicadores.indiceEndeudamientoPct.toFixed(1)}%
                  </div>
                  <span className="text-[9px] text-purple-600">Pasivo / Activo</span>
                </div>

                <div
                  className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200"
                  title="Razón de Cobertura de Intereses = Utilidad Operacional / Gastos de Intereses (mínimo típico >= 2.0)"
                >
                  <span className="text-[10px] font-bold text-emerald-700 block">Cobertura Intereses</span>
                  <div className="text-base font-black text-emerald-900 font-mono">
                    {rupSeleccionado.indicadores.razonCoberturaIntereses.toFixed(2)}
                  </div>
                  <span className="text-[9px] text-emerald-600">Utilidad Op / Intereses</span>
                </div>

                <div
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200"
                  title="Rentabilidad del Patrimonio = Utilidad Operacional / Patrimonio Neto"
                >
                  <span className="text-[10px] font-bold text-amber-700 block">Rent. Patrimonio</span>
                  <div className="text-base font-black text-amber-900 font-mono">
                    {rupSeleccionado.indicadores.rentabilidadPatrimonioPct.toFixed(1)}%
                  </div>
                  <span className="text-[9px] text-amber-600">Utilidad / Patrimonio</span>
                </div>

                <div
                  className="p-3 rounded-xl bg-teal-50/60 border border-teal-200"
                  title="Rentabilidad del Activo = Utilidad Operacional / Activo Total"
                >
                  <span className="text-[10px] font-bold text-teal-700 block">Rent. Activo</span>
                  <div className="text-base font-black text-teal-900 font-mono">
                    {rupSeleccionado.indicadores.rentabilidadActivoPct.toFixed(1)}%
                  </div>
                  <span className="text-[9px] text-teal-600">Utilidad / Activo</span>
                </div>

                <div
                  className="p-3 rounded-xl bg-slate-900 text-white"
                  title="Capacidad Residual de Contratación (K) según Ley 1682/2013 para obras públicas"
                >
                  <span className="text-[10px] font-bold text-lime-400 block font-mono">Capacidad K</span>
                  <div className="text-xs font-black text-white font-mono mt-0.5">
                    ${(rupSeleccionado.capacidadResidualKCOP / 1e6).toFixed(0)}M
                  </div>
                  <span className="text-[9px] text-slate-400">K Residual Obra</span>
                </div>
              </div>
            </div>

            {/* Matriz de Experiencia Acreditada en Códigos UNSPSC */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                  Contratos de Experiencia Acreditada en el RUP
                </h3>
                <span className="text-xs font-bold text-indigo-700">
                  Total SMMLV: {rupSeleccionado.experiencia.reduce((a, b) => a + b.valorSMMLV, 0).toFixed(1)} SMMLV
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Contratante / Objeto</th>
                      <th className="p-2.5">Códigos UNSPSC</th>
                      <th className="p-2.5 text-right">Valor COP</th>
                      <th className="p-2.5 text-right">Valor SMMLV</th>
                      <th className="p-2.5 text-center">Terminación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {rupSeleccionado.experiencia.map((exp) => (
                      <tr key={exp.consecutivo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2.5 font-bold font-mono text-slate-500">#{exp.consecutivo}</td>
                        <td className="p-2.5 max-w-sm">
                          <div className="font-bold text-slate-900 text-xs">{exp.contratante}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{exp.objeto}</div>
                        </td>
                        <td className="p-2.5">
                          <div className="flex flex-wrap gap-1">
                            {exp.codigosUNSPSC.map((c) => (
                              <span key={c} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          ${exp.valorCOP.toLocaleString('es-CO')}
                        </td>
                        <td className="p-2.5 text-right font-mono font-black text-indigo-700">
                          {exp.valorSMMLV.toFixed(1)}
                        </td>
                        <td className="p-2.5 text-center font-mono text-[11px] text-slate-600">
                          {exp.fechaTerminacion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PESTAÑA 2: CONECTOR SECOP II REAL (PROCESOS EN VIVO) */}
      {pestana === 'SECOP2_EN_VIVO' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Explorador de Expedientes Reales de SECOP II
                </h2>
                <p className="text-xs text-slate-500">
                  Consulte procesos en tiempo real publicados en la plataforma oficial de Colombia Compra Eficiente.
                </p>
              </div>

              {/* Barra de Búsqueda Socrata */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Ej: MINTIC, INVIAS, tecnología, pavimentación..."
                  value={busquedaSecop2}
                  onChange={(e) => setBusquedaSecop2(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscarSecop2()}
                  className="p-2 border border-slate-300 rounded-lg text-xs font-medium w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Buscar procesos reales en la API de Datos Abiertos de SECOP II"
                />
                <button
                  onClick={handleBuscarSecop2}
                  disabled={buscandoEnVivo}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Consultar datos abiertos en vivo de SECOP II"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{buscandoEnVivo ? 'Consultando...' : 'Buscar'}</span>
                </button>
              </div>
            </div>

            {/* Listado de Procesos Reales Encontrados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {procesosReales.map((proc) => {
                const esActivo = proc.idProceso === procesoSeleccionado.idProceso;
                return (
                  <div
                    key={proc.idProceso}
                    onClick={() => setProcesoSeleccionado(proc)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                      esActivo
                        ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                    title={`Seleccionar proceso ${proc.numeroProceso} para evaluar contra RUP`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400">
                        {proc.numeroProceso}
                      </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {proc.estadoSecop2}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs line-clamp-1" title={proc.entidadCompradora}>
                      {proc.entidadCompradora}
                    </h3>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed" title={proc.objetoContrato}>
                      {proc.objetoContrato}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-mono">
                      <span className="text-[10px] text-slate-500">Presupuesto:</span>
                      <span className="font-bold text-slate-900">
                        ${(proc.valorPresupuestoOficialCOP / 1e6).toFixed(0)}M COP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detalle y Requisitos Habilitantes del Proceso Seleccionado */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Proceso Activo Seleccionado para Auditoría
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {procesoSeleccionado.numeroProceso} - {procesoSeleccionado.entidadCompradora}
                  </h3>
                </div>
                {procesoSeleccionado.urlSecop2 && (
                  <a
                    href={procesoSeleccionado.urlSecop2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    title="Abrir expediente en el portal oficial de SECOP II"
                  >
                    <span>Ver en SECOP II Oficial</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Matriz de Exigencias del Pliego de Condiciones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Experiencia Mínima:</span>
                  <span className="font-mono font-bold text-indigo-700 text-sm">
                    {procesoSeleccionado.requisitosHabilitantes.experienciaMinimaSMMLV} SMMLV
                  </span>
                  <span className="text-[10px] text-slate-400 block">Acumulada en RUP</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Liquidez Exigida:</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    &gt;= {procesoSeleccionado.requisitosHabilitantes.liquidezMinima.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Activo Cte / Pasivo Cte</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Endeudamiento Máximo:</span>
                  <span className="font-mono font-bold text-purple-700 text-sm">
                    &lt;= {procesoSeleccionado.requisitosHabilitantes.endeudamientoMaximoPct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">Pasivo Total / Activo Total</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">Códigos UNSPSC Exigidos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {procesoSeleccionado.requisitosHabilitantes.codigosUNSPSCObligatorios.map((c) => (
                      <span key={c} className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-900 text-cyan-300 font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PESTAÑA 3: DICTAMEN VINCULANTE & EVALUACIÓN (LEY 527) */}
      {pestana === 'DICTAMEN_VINCULANTE' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Informe de Evaluación y Verificación de Requisitos Habilitantes
                </h2>
                <p className="text-xs text-slate-500">
                  Evaluación formal inmutable generada conforme a la Ley 1150 de 2007 (Art. 5) y Decreto 1082 de 2015.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDescargarActa}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Descargar el informe formal en formato de texto foliado (.txt)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar (.txt)</span>
                </button>
                <button
                  onClick={handleCopiarActa}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiadoActa
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                  }`}
                  title="Copiar texto formal del informe al portapapeles para radicación oficial"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiadoActa ? '¡Copiado!' : 'Copiar Dictamen'}</span>
                </button>
              </div>
            </div>

            {/* Resultado Habilitante Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                dictamen.resultadoFinal === 'HABILITADO'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {dictamen.resultadoFinal === 'HABILITADO' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <div className="font-black text-sm uppercase tracking-wide">
                    DICTAMEN: {dictamen.resultadoFinal}
                  </div>
                  <div className="text-xs opacity-90">
                    Proponente: <strong>{dictamen.proponente.razonSocial}</strong> (NIT {dictamen.proponente.nit})
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-[10px] uppercase text-slate-500 block">Proceso Auditado:</span>
                <span className="font-bold">{dictamen.procesoAuditado.numeroProceso}</span>
              </div>
            </div>

            {/* Cuadro de Verificación Detallada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Bloque Financiero */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-xs uppercase block border-b border-slate-200 pb-1">
                  1. Verificación Capacidad Financiera (RUP)
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Índice Liquidez (&gt;= {dictamen.verificacionFinanciera.liquidezExigida}):</span>
                    <span className={`font-mono font-bold ${dictamen.verificacionFinanciera.cumpleLiquidez ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {dictamen.verificacionFinanciera.liquidezRUP.toFixed(2)} {dictamen.verificacionFinanciera.cumpleLiquidez ? '✓ CUMPLE' : '✗ RECHAZADO'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nivel Endeudamiento (&lt;= {dictamen.verificacionFinanciera.endeudamientoMaximo}%):</span>
                    <span className={`font-mono font-bold ${dictamen.verificacionFinanciera.cumpleEndeudamiento ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {dictamen.verificacionFinanciera.endeudamientoRUP.toFixed(1)}% {dictamen.verificacionFinanciera.cumpleEndeudamiento ? '✓ CUMPLE' : '✗ RECHAZADO'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cobertura Intereses (&gt;= {dictamen.verificacionFinanciera.coberturaExigida}):</span>
                    <span className={`font-mono font-bold ${dictamen.verificacionFinanciera.cumpleCoberturaIntereses ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {dictamen.verificacionFinanciera.coberturaRUP.toFixed(2)} {dictamen.verificacionFinanciera.cumpleCoberturaIntereses ? '✓ CUMPLE' : '✗ RECHAZADO'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloque Experiencia */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-xs uppercase block border-b border-slate-200 pb-1">
                  2. Verificación Experiencia en SMMLV & Códigos
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Cuantía SMMLV (&gt;= {dictamen.verificacionExperiencia.experienciaExigidaSMMLV}):</span>
                    <span className={`font-mono font-bold ${dictamen.verificacionExperiencia.cumpleExperienciaTotal ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {dictamen.verificacionExperiencia.experienciaAcreditadaSMMLV.toFixed(1)} SMMLV
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Códigos Coincidentes Acreditados:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dictamen.verificacionExperiencia.codigosCoincidentes.map((c) => (
                        <span key={c} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  {dictamen.verificacionExperiencia.codigosFaltantes.length > 0 && (
                    <div>
                      <span className="text-[11px] text-rose-600 font-bold">Códigos No Acreditados en RUP:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dictamen.verificacionExperiencia.codigosFaltantes.map((c) => (
                          <span key={c} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                            ✗ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fundamentos Jurídicos Expresos */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lime-400 font-bold uppercase">
                  Motivación Jurídica Vinculante (Comité Evaluador)
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {dictamen.hashDictamenSHA256}
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {dictamen.fundamentoJuridico.map((fund, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">[{idx + 1}]</span>
                    <span>{fund}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
