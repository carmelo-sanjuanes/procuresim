// Modal del Radar de Vigilancia Regulatoria, Jurisprudencial y Calibrador de Entorno
// Monitoreo en vivo de sentencias del Consejo de Estado, leyes y decretos con conmutadores que impactan el entorno
import React, { useState } from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Zap,
  BookOpen,
  Sliders,
  RotateCcw,
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import {
  LegalWatchdogEngine,
  HitoRegulatorioJurisprudencial
} from '../core/engines/LegalWatchdogEngine';

interface RegulatoryWatchdogModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const RegulatoryWatchdogModal: React.FC<RegulatoryWatchdogModalProps> = ({
  abierto,
  onCerrar
}) => {
  const {
    hitosRegulatorios,
    parametrosRegulatorios,
    conmutarHitoRegulatorio,
    actualizarParametroRegulatorio,
    restablecerParametrosRegulatorios,
    bitacoraObservaciones,
    registrarObservacionBitacora
  } = useProcurementStore();

  const [pestana, setPestana] = useState<'RADAR_NORMAS' | 'CALIBRADOR_VARIABLES' | 'SANDBOX_REFORMAS' | 'BITACORA'>('RADAR_NORMAS');
  const [obsOrigen, setObsOrigen] = useState<'VEEDURIA_CIUDADANA' | 'CONTRALORIA' | 'PROCURADURIA' | 'OTRO'>('VEEDURIA_CIUDADANA');
  const [obsTexto, setObsTexto] = useState('');
  const [obsNorma, setObsNorma] = useState('');
  const [obsRiesgo, setObsRiesgo] = useState<'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO'>('MEDIO');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');

  if (!abierto) return null;

  const diagnostico = LegalWatchdogEngine.diagnosticarSaludEntorno(parametrosRegulatorios);

  const hitosFiltrados = hitosRegulatorios.filter((h) => {
    if (filtroTipo === 'TODOS') return true;
    return h.tipo === filtroTipo;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 1. Cabecera del Modal */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  RADAR DE VIGILANCIA REGULATORIA & JURISPRUDENCIAL
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-bold">
                  CONSEJO DE ESTADO / CCE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Observatorio activo de normas y fallos vinculantes. Los cambios en el radar modifican de inmediato las reglas operativas del simulador.
              </p>
            </div>
          </div>

          <button
            onClick={onCerrar}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar Radar Regulatorio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Barra de Diagnóstico de Salud Jurídica y Navegación */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs">
          {/* Indicador de Blindaje */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Blindaje Jurídico:</span>
              <span
                className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg ${
                  diagnostico.nivelSeguridadJuridica === 'MÁXIMO_BLINDAJE'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : diagnostico.nivelSeguridadJuridica === 'MEDIO_CON_RIESGOS'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {diagnostico.porcentajeBlindaje}% ({diagnostico.nivelSeguridadJuridica.replace(/_/g, ' ')})
              </span>
            </div>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <span className="text-[11px] text-slate-600 hidden md:inline">
              Hitos Activos en Entorno: <strong>{hitosRegulatorios.filter((h) => h.activoEnEntorno).length} / {hitosRegulatorios.length}</strong>
            </span>
          </div>

          {/* Pestañas del Radar */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs font-bold">
            <button
              onClick={() => setPestana('RADAR_NORMAS')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                pestana === 'RADAR_NORMAS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vigilancia activa de sentencias del Consejo de Estado, leyes y circulares"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hitos Normativos ({hitosRegulatorios.length})</span>
            </button>

            <button
              onClick={() => setPestana('CALIBRADOR_VARIABLES')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                pestana === 'CALIBRADOR_VARIABLES'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Calibrar parámetros macroeconómicos, SMMLV y vigencias del entorno"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Calibrador de Variables</span>
            </button>

            <button
              onClick={() => setPestana('SANDBOX_REFORMAS')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                pestana === 'SANDBOX_REFORMAS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Simulador de impacto de nuevos proyectos de reforma en trámite en el Congreso"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sandbox de Reformas</span>
            </button>

            <button
              onClick={() => setPestana('BITACORA')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                pestana === 'BITACORA'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Registro trazable de observaciones de veeduría, Contraloría y decisiones del simulador"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Bitácora de Observaciones y Vigilancia ({bitacoraObservaciones.length})</span>
            </button>
          </div>
        </div>

        {/* 3. Contenido Dinámico con Scroll Interno */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* PESTAÑA 1: HITOS NORMATIVOS & CONMUTADORES EN VIVO */}
          {pestana === 'RADAR_NORMAS' && (
            <div className="space-y-4">
              {/* Filtro por Tipo de Fuente Legal */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <span className="text-slate-400 uppercase text-[10px] mr-1">Filtrar por Fuente:</span>
                  {['TODOS', 'LEY_REPUBLICA', 'SENTENCIA_CONSEJO_ESTADO', 'CIRCULAR_CCE', 'PROYECTO_EN_TRAMITE'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setFiltroTipo(tipo)}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        filtroTipo === tipo
                          ? 'bg-slate-900 text-cyan-400 font-mono'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={`Filtrar por ${tipo}`}
                    >
                      {tipo === 'TODOS'
                        ? 'Todas las Fuentes'
                        : tipo === 'LEY_REPUBLICA'
                        ? 'Leyes'
                        : tipo === 'SENTENCIA_CONSEJO_ESTADO'
                        ? 'Consejo de Estado'
                        : tipo === 'CIRCULAR_CCE'
                        ? 'Circulares CCE'
                        : 'Proyectos'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={restablecerParametrosRegulatorios}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
                  title="Restaurar todos los hitos y variables del entorno a sus valores predeterminados"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer Valores Oficiales</span>
                </button>
              </div>

              {/* Grid de Fichas Normativas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hitosFiltrados.map((hito) => (
                  <div
                    key={hito.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      hito.activoEnEntorno
                        ? 'bg-white border-blue-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    {/* Cabecera de la Ficha */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {hito.referenciaOficial}
                        </span>
                        <h3 className="font-bold text-slate-900 text-xs mt-1 leading-snug">
                          {hito.titulo}
                        </h3>
                        <span className="text-[10px] text-slate-500">
                          Emisor: <strong>{hito.organismoEmisor}</strong> ({hito.fechaEmision})
                        </span>
                      </div>

                      {/* Switch Interactivo */}
                      <div className="flex flex-col items-end shrink-0">
                        <button
                          onClick={() => conmutarHitoRegulatorio(hito.id, !hito.activoEnEntorno)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            hito.activoEnEntorno ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                          title={`Haga clic para ${hito.activoEnEntorno ? 'desactivar' : 'activar'} el impacto de esta norma en el simulador`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              hito.activoEnEntorno ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-[9px] font-mono mt-0.5 font-bold text-slate-500">
                          {hito.activoEnEntorno ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </div>
                    </div>

                    {/* Síntesis y Doctrina */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 leading-relaxed">
                      <strong>Doctrina:</strong> {hito.sintesisDoctrinaria}
                    </div>

                    {/* Extracto Jurisprudencial */}
                    <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-[10px] text-blue-950 italic leading-relaxed">
                      {hito.extractoJurisprudencial}
                    </div>

                    {/* Impacto Concreto en el Entorno */}
                    <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-950 text-[11px]">
                      <div className="font-bold text-[10px] uppercase text-emerald-800 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span>Impacto Real en el Entorno:</span>
                      </div>
                      <p className="mt-0.5">{hito.descripcionImpactoEntorno}</p>
                      <div className="mt-1 text-[10px] text-emerald-700 font-mono">
                        Módulo Vinculado: <strong>{hito.moduloImpactado}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PESTAÑA 2: CALIBRADOR DE VARIABLES MACROECONÓMICAS Y REGULATORIAS */}
          {pestana === 'CALIBRADOR_VARIABLES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Calibrador Directo de Variables de Entorno
                </h3>
                <p className="text-xs text-slate-500">
                  Modifique las constantes legales y financieras que rigen los cálculos en todos los módulos de ProcureSim.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Variable 1: Salario Mínimo Legal Vigente (SMMLV) */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Salario Mínimo Legal Vigente (SMMLV):</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">
                      ${parametrosRegulatorios.valorSMMLV_COP.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1500000"
                    max="2000000"
                    step="5000"
                    value={parametrosRegulatorios.valorSMMLV_COP}
                    onChange={(e) =>
                      actualizarParametroRegulatorio('valorSMMLV_COP', Number(e.target.value))
                    }
                    className="w-full accent-indigo-600 cursor-pointer"
                    title="Calibrar valor del SMMLV oficial"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Afecta de inmediato la conversión de experiencia RUP en SMMLV y los topes de Menor y Mínima Cuantía.
                  </span>
                </div>

                {/* Variable 2: Vigencia Fiscal */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Vigencia Fiscal de Ejecución:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      Año {parametrosRegulatorios.anoVigenciaFiscal}
                    </span>
                  </div>
                  <select
                    value={parametrosRegulatorios.anoVigenciaFiscal}
                    onChange={(e) =>
                      actualizarParametroRegulatorio('anoVigenciaFiscal', Number(e.target.value))
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-bold focus:outline-none"
                    title="Calibrar el año fiscal de vigencia para CDP y PAC"
                  >
                    <option value={2024}>Vigencia 2024</option>
                    <option value={2025}>Vigencia 2025 (Oficial)</option>
                    <option value={2026}>Vigencia 2026 (Proyectada)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block">
                    Determina la vigencia de imputación presupuestal del CDP y el Plan Anual de Adquisiciones.
                  </span>
                </div>

                {/* Switch: Régimen Sociedades BIC */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Desempate Ley 2069 (Sociedades BIC):</span>
                    <span className="text-[10px] text-slate-500">
                      Preferencia legal a empresas como INGELECGROUP S.A.S. BIC
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      actualizarParametroRegulatorio(
                        'preferenciaSociedadesBicActiva',
                        !parametrosRegulatorios.preferenciaSociedadesBicActiva
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      parametrosRegulatorios.preferenciaSociedadesBicActiva
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    title="Activar/Desactivar preferencia para Sociedades BIC"
                  >
                    {parametrosRegulatorios.preferenciaSociedadesBicActiva ? 'ACTIVADO' : 'DESACTIVADO'}
                  </button>
                </div>

                {/* Switch: Principio de Exclusividad del RUP */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Exclusividad RUP (Consejo de Estado):</span>
                    <span className="text-[10px] text-slate-500">
                      Bloquea requisitos financieros extralegales
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      actualizarParametroRegulatorio(
                        'exclusividadRupActiva',
                        !parametrosRegulatorios.exclusividadRupActiva
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      parametrosRegulatorios.exclusividadRupActiva
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    title="Activar/Desactivar principio de taxatividad del RUP"
                  >
                    {parametrosRegulatorios.exclusividadRupActiva ? 'ACTIVADO' : 'DESACTIVADO'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: SANDBOX DE PROYECTOS DE REFORMA EN TRÁMITE */}

          {/* PESTAÑA 4: BITÁCORA DE OBSERVACIONES Y AUDITORÍA */}
          {pestana === 'BITACORA' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <strong className="text-slate-900 block">Registrar observación de veeduría o ente de control</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select value={obsOrigen} onChange={(e) => setObsOrigen(e.target.value as typeof obsOrigen)} className="p-2 rounded-lg border border-slate-300 bg-white">
                    <option value="VEEDURIA_CIUDADANA">Veeduría ciudadana</option>
                    <option value="CONTRALORIA">Contraloría</option>
                    <option value="PROCURADURIA">Procuraduría</option>
                    <option value="OTRO">Otro</option>
                  </select>
                  <select value={obsRiesgo} onChange={(e) => setObsRiesgo(e.target.value as typeof obsRiesgo)} className="p-2 rounded-lg border border-slate-300 bg-white">
                    <option value="BAJO">Riesgo bajo</option>
                    <option value="MEDIO">Riesgo medio</option>
                    <option value="ALTO">Riesgo alto</option>
                    <option value="CRITICO">Riesgo crítico</option>
                  </select>
                </div>
                <input value={obsNorma} onChange={(e) => setObsNorma(e.target.value)} placeholder="Norma presuntamente infringida (ej. Art. 24 Ley 80 de 1993)" className="w-full p-2 rounded-lg border border-slate-300 bg-white" />
                <textarea value={obsTexto} onChange={(e) => setObsTexto(e.target.value)} rows={3} placeholder="Descripción de la observación o advertencia" className="w-full p-2 rounded-lg border border-slate-300 bg-white" />
                <button
                  type="button"
                  disabled={!obsTexto.trim() || !obsNorma.trim()}
                  onClick={() => {
                    registrarObservacionBitacora({ origen: obsOrigen, descripcion: obsTexto.trim(), normaInfringida: obsNorma.trim(), nivelRiesgo: obsRiesgo, manual: true });
                    setObsTexto('');
                    setObsNorma('');
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold disabled:opacity-40 cursor-pointer"
                >
                  Registrar en bitácora
                </button>
              </div>

              {bitacoraObservaciones.length === 0 ? (
                <p className="text-slate-500">Aún no hay observaciones registradas. Aparecerán aquí las que digites y las que genere el simulador (observaciones de veeduría en el Paso 9 y decisiones del Paso 10).</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="p-2">Fecha</th>
                        <th className="p-2">Origen</th>
                        <th className="p-2">Norma infringida</th>
                        <th className="p-2">Riesgo</th>
                        <th className="p-2">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bitacoraObservaciones.map((o) => (
                        <tr key={o.id} className="border-t border-slate-200 align-top">
                          <td className="p-2 font-mono whitespace-nowrap">{o.fecha}</td>
                          <td className="p-2">{o.origen.replace(/_/g, ' ')}{o.manual ? '' : ' (simulador)'}</td>
                          <td className="p-2">{o.normaInfringida}</td>
                          <td className="p-2 font-bold">{o.nivelRiesgo}</td>
                          <td className="p-2">{o.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {pestana === 'SANDBOX_REFORMAS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm">
                    Sandbox Regulatorio: Proyectos de Reforma en Trámite en el Congreso
                  </h3>
                </div>
                <p className="text-xs leading-relaxed">
                  El Sandbox Regulatorio permite ensayar cómo reaccionarían las entidades y los proponentes si se aprueban las reformas legislativas en curso (ej: Reforma al Estatuto de Contratación Ley 80 / Asociaciones Público-Populares).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                      PROYECTO DE REFORMA NO. 142-2025
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">
                      Compras Públicas Populares & Contratación Directa con Juntas de Acción Comunal
                    </h4>
                    <span className="text-xs text-slate-500">
                      Estado: En debate en Comisión Primera de Senado • Ponencia para Segundo Debate
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      actualizarParametroRegulatorio(
                        'sandboxComprasPopularesActivo',
                        !parametrosRegulatorios.sandboxComprasPopularesActivo
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      parametrosRegulatorios.sandboxComprasPopularesActivo
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                    title="Simular en todo el entorno la entrada en vigor de esta reforma"
                  >
                    {parametrosRegulatorios.sandboxComprasPopularesActivo
                      ? '✓ Reforma Simulada en Entorno'
                      : 'Simular Aprobación de Reforma'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">Tope Contratación Comunitaria:</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">Hasta 300 SMMLV</span>
                    <span className="text-[10px] text-slate-400 block">Sin licitación previa</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">Exención de RUP:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">100% Exento</span>
                    <span className="text-[10px] text-slate-400 block">Para organizaciones de base</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">Pólizas Requeridas:</span>
                    <span className="font-mono font-bold text-amber-700 text-sm">Fondo Solidario</span>
                    <span className="text-[10px] text-slate-400 block">Reemplaza aseguradora</span>
                  </div>
                </div>

                {parametrosRegulatorios.sandboxComprasPopularesActivo && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Entorno Adaptado al Sandbox:</strong> El simulador ha activado la modalidad de contratación comunitaria directa para convenios de desarrollo local y obras rurales en SECOP II.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Pie del Modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Los cambios en los interruptores impactan al instante los motores de evaluación, RUP y pliegos.</span>
          </div>

          <button
            onClick={onCerrar}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer"
            title="Cerrar y aplicar configuración"
          >
            Entendido y Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
