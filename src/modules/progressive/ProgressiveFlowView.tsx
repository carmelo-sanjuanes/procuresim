// Vista de Flujo Progresivo y Modo Enfoque (Progressive Disclosure & Focus Mode) - Edición Awwwards
// Diseñada con arquitectura Bento Box, micro-interacciones de alta fidelidad, sonidos sintetizados y confeti triunfal
import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Scale,
  FileCheck2,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Layers,
  RotateCcw,
  Trophy,
  X,
  FileText,
  Award,
  Check
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { soundEffects } from '../../utils/soundEffects';
import { launchConfetti } from '../../utils/confetti';

export const ProgressiveFlowView: React.FC = () => {
  const {
    etapaWorkflow,
    setEtapaWorkflow,
    parametrosRegulatorios,
    conmutarHitoRegulatorio,
    setDensidadVisual
  } = useProcurementStore();

  // Estados de Divulgación Progresiva
  const [paso1RevelarItems, setPaso1RevelarItems] = useState(false);
  const [paso2ObservacionRespondida, setPaso2ObservacionRespondida] = useState(false);
  const [paso5ContratoFirmado, setPaso5ContratoFirmado] = useState(false);

  // Estado del Cajón Lateral (Drawer) para detalles técnicos profundos
  const [drawerAbierto, setDrawerAbierto] = useState<
    'NINGUNO' | 'DETALLES_PRESUPUESTO' | 'AUDITORIA_RUP' | 'AUDITORIA_FORENSE_26' | 'ESTRUCTURA_AIU'
  >('NINGUNO');

  const bicActiva = parametrosRegulatorios?.preferenciaSociedadesBicActiva ?? true;

  // Porcentaje de progreso del expediente según la etapa
  const porcentajeProgreso = etapaWorkflow * 20;

  return (
    <div className="relative flex-1 bg-slate-50/70 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Esferas de iluminación ambiental estilo Awwwards */}
      <div className="absolute top-12 left-1/4 w-96 h-96 ambient-glow-cyan pointer-events-none rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/2 right-10 w-96 h-96 ambient-glow-emerald pointer-events-none rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 ambient-glow-indigo pointer-events-none rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-4xl mx-auto space-y-5">
        {/* Encabezado Conciso del Caso de Estudio (Limpio, sin duplicar el stepper superior) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 px-4 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-xs font-display">
                  Caso Guiado: Licitación LP-001-2025
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                  $450.000.000 COP
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Alcaldía de San Pedro del Valle · Dotación Tecnológica y Redes Educativas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200 shadow-2xs">
              Avance: {porcentajeProgreso}%
            </span>
            <button
              onClick={() => {
                soundEffects.playClick();
                setDensidadVisual('EXPERTO_AVANZADA');
              }}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-slate-300/80 shadow-2xs"
              title="Ver todas las tablas completas en Modo Experto"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Modo Experto</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ETAPA 1: PLANEACIÓN & ESTUDIOS PREVIOS (DIVULGACIÓN PROGRESIVA) */}
        {/* ============================================================== */}
        {etapaWorkflow === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-awwwards space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-100/90 text-blue-800 font-black text-[10px] uppercase font-mono tracking-wider border border-blue-200">
                      Licitación Pública LP-001-2025
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100/90 text-emerald-800 font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      CDP No. 2025-00189 Garantizado
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                    Dotación de Equipos Tecnológicos y Conectividad Educativa
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Entidad Compradora: <strong>Alcaldía de San Pedro del Valle</strong> (12 sedes educativas rurales y urbanas). Objeto estructurado conforme a la Guía de Estudios Previos de Colombia Compra Eficiente.
                  </p>
                </div>

                <div className="sm:text-right shrink-0 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-3.5 rounded-2xl border border-emerald-200/90 shadow-2xs">
                  <div className="text-[10px] font-black text-emerald-900 uppercase font-mono tracking-wider">Presupuesto Oficial</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono tracking-tight">
                    $ 450.000.000 COP
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">346 SMMLV Aprox.</div>
                </div>
              </div>

              {/* Botón de Divulgación: Si aún no se han revelado los ítems */}
              {!paso1RevelarItems ? (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    El presupuesto oficial y el amparo presupuestal son conformes con el Plan de Desarrollo.
                  </p>
                  <button
                    onClick={() => {
                      soundEffects.playSoftPop();
                      setPaso1RevelarItems(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer shrink-0"
                  >
                    <span>Confirmar Presupuesto y Revelar Ítems Técnicos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Bloque Revelado Progresivamente */
                <div className="pt-4 border-t border-slate-100 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 text-xs space-y-1.5 shadow-2xs">
                      <div className="font-black text-slate-900 flex items-center justify-between">
                        <span>80 PCs de Escritorio</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">UNSPSC 43211500</span>
                      </div>
                      <div className="text-emerald-700 font-black font-mono text-sm">$ 304.000.000 COP</div>
                      <p className="text-[11px] text-slate-500 leading-snug">Core i5 13va gen, 16GB RAM, SSD 512GB, monitor 24" IPS.</p>
                    </div>

                    <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 text-xs space-y-1.5 shadow-2xs">
                      <div className="font-black text-slate-900 flex items-center justify-between">
                        <span>25 Portátiles Docentes</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">UNSPSC 43211503</span>
                      </div>
                      <div className="text-emerald-700 font-black font-mono text-sm">$ 105.000.000 COP</div>
                      <p className="text-[11px] text-slate-500 leading-snug">Portátil 14" FHD antirreflejo, 16GB RAM, batería 8h.</p>
                    </div>

                    <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 text-xs space-y-1.5 shadow-2xs">
                      <div className="font-black text-slate-900 flex items-center justify-between">
                        <span>12 Puntos WiFi 6</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">UNSPSC 43222600</span>
                      </div>
                      <div className="text-emerald-700 font-black font-mono text-sm">$ 41.000.000 COP</div>
                      <p className="text-[11px] text-slate-500 leading-snug">Access Point empresarial PoE con cableado estructurado 6A.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs shadow-2xs">
                    <div className="flex items-center gap-2 text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Estudios previos blindados:</strong> Clasificación UNSPSC verificada y sin requisitos fuera del RUP.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundEffects.playSoftPop();
                          setDrawerAbierto('DETALLES_PRESUPUESTO');
                        }}
                        className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        Ver matriz de riesgos completa ➔
                      </button>

                      <button
                        onClick={() => {
                          soundEffects.playStepChange();
                          setEtapaWorkflow(2);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                      >
                        <span>Aprobar y Pasar a Observaciones</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ETAPA 2: OBSERVACIONES & PLIEGO DE CONDICIONES                   */}
        {/* ============================================================== */}
        {etapaWorkflow === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-awwwards space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                    Etapa de Consulta y Observaciones de los Licitantes
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Se han publicado los prepliegos. Dos oferentes han radicado observaciones jurídicas antes del cierre.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto shadow-2xs">
                  Límite Adendas: Ley 1882 (3 días)
                </span>
              </div>

              {/* Las 2 Observaciones de los Licitantes */}
              <div className="space-y-3">
                <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-900">1. Observación de SANJUANÉS SOLUCIONES S.A.S.</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">Radicado OBS-01</span>
                  </div>
                  <p className="text-slate-700 italic">
                    "Solicitamos eliminar la exigencia de certificar experiencia en sedes educativas fuera del RUP, conforme al fallo de unificación del Consejo de Estado que prohíbe crear requisitos habilitantes no taxativos."
                  </p>
                </div>

                <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-900">2. Observación de INGELECGROUP S.A.S. BIC</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">Radicado OBS-02</span>
                  </div>
                  <p className="text-slate-700 italic">
                    "Solicitamos incorporar explícitamente el factor de desempate preferencial para Sociedades BIC previsto en el Decreto 1860 de 2021 (Ley 2069 de Emprendimiento)."
                  </p>
                </div>
              </div>

              {/* Botón de Respuesta / Publicación de Adenda */}
              {!paso2ObservacionRespondida ? (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    Ambas observaciones son jurídicamente fundadas y previenen demandas de nulidad.
                  </p>
                  <button
                    onClick={() => {
                      soundEffects.playSuccess();
                      setPaso2ObservacionRespondida(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer shrink-0"
                  >
                    <span>Acoger Observaciones y Ajustar Pliego Definitivo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs animate-fadeIn shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Pliego definitivo expedido:</strong> Se acogieron las observaciones respetando el plazo de 3 días de la Ley 1882.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      soundEffects.playStepChange();
                      setEtapaWorkflow(3);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                  >
                    <span>Pasar a Verificación RUP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ETAPA 3: PRESENTACIÓN DE OFERTAS & CAPACIDAD FINANCIERA RUP      */}
        {/* ============================================================== */}
        {etapaWorkflow === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-awwwards space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                    Verificación de Capacidad Financiera y RUP de Oferentes
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Exigencia legal: Liquidez ≥ 1.50 | Endeudamiento ≤ 70% | Cobertura de Intereses ≥ 2.50.
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundEffects.playSoftPop();
                    setDrawerAbierto('AUDITORIA_RUP');
                  }}
                  className="text-xs font-bold text-blue-700 hover:underline cursor-pointer self-start sm:self-auto"
                >
                  Ver balances completos ➔
                </button>
              </div>

              {/* Las Dos Tarjetas Ejecutivas de los Licitantes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Oferente 1: SANJUANÉS SOLUCIONES */}
                <div className="bento-card p-5 rounded-2xl border border-blue-200/90 bg-blue-50/30 space-y-3.5 shadow-2xs hover:border-blue-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-black text-slate-900 text-sm font-display">
                        SANJUANÉS SOLUCIONES S.A.S.
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">NIT 901.458.712-4 • Neiva, Huila</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[10px] font-mono">
                      HABILITADO
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold">Liquidez</div>
                      <div className="font-black text-emerald-700 font-mono text-sm">2.67</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold">Endeudam.</div>
                      <div className="font-black text-emerald-700 font-mono text-sm">35.58%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold">Cobertura</div>
                      <div className="font-black text-emerald-700 font-mono text-sm">11.55</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                    <span>Experiencia RUP: <strong>1.850 SMMLV</strong></span>
                    <span className="text-blue-700 font-bold">60% Liderazgo Femenino</span>
                  </div>
                </div>

                {/* Oferente 2: INGELECGROUP BIC */}
                <div className="bento-card p-5 rounded-2xl border border-emerald-200/90 bg-emerald-50/30 space-y-3.5 shadow-2xs hover:border-emerald-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-black text-slate-900 text-sm font-display">
                        INGELECGROUP S.A.S. BIC
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">NIT 901.624.819-5 • Bogotá D.C.</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[10px] font-mono">
                      HABILITADO
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold">Liquidez</div>
                      <div className="font-black text-emerald-700 font-mono text-sm">2.15</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold">Endeudam.</div>
                      <div className="font-black text-emerald-700 font-mono text-sm">37.97%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold">Cobertura</div>
                      <div className="font-black text-emerald-700 font-mono text-sm">7.88</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                    <span>Experiencia RUP: <strong>2.250 SMMLV</strong></span>
                    <span className="text-emerald-800 font-black">🌱 Sociedad BIC Oficial</span>
                  </div>
                </div>
              </div>

              {/* Botón de Avance */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-600">
                  Ambos oferentes superan holgadamente la capacidad financiera y jurídica habilitante.
                </p>
                <button
                  onClick={() => {
                    soundEffects.playStepChange();
                    setEtapaWorkflow(4);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
                >
                  <span>Avanzar a Calificación y Desempate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ETAPA 4: CALIFICACIÓN & DESEMPATE EN VIVO (LEY 2069)            */}
        {/* ============================================================== */}
        {etapaWorkflow === 4 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Bloque A: Detección de Precios Temerarios */}
            <div className="bento-card p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm font-display">
                    Auditoría de Precios Artificialmente Bajos (Decreto 1082/2015)
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono">
                  3 Ofertas en Mercado • 1 Rechazada
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Se detectó una oferta temeraria de $279M (-27% de la media). Conforme a la Guía de Colombia Compra Eficiente, fue requerida y no logró justificar sus costos directos. Quedan en disputa las ofertas válidas.
              </p>
            </div>

            {/* Bloque B: La Audiencia de Desempate en Vivo */}
            <div className="glass-card rounded-3xl border-2 border-emerald-400 p-6 sm:p-7 shadow-awwwards space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                      Audiencia de Desempate (Empate Técnico a 100 Puntos)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Se aplica la cascada estricta del Art. 35 de la Ley 2069 de 2020 (prohibido el sorteo directo).
                  </p>
                </div>

                {/* Ganador Dinámico */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 text-right shadow-2xs">
                  <div className="text-[10px] font-black text-emerald-800 uppercase font-mono tracking-wider">Adjudicatario Legítimo</div>
                  <div className="text-base sm:text-lg font-black text-emerald-950 font-mono">
                    {bicActiva ? 'INGELECGROUP S.A.S. BIC' : 'SANJUANÉS SOLUCIONES S.A.S.'}
                  </div>
                </div>
              </div>

              {/* Explicación de la Decisión */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2">
                <div className="font-extrabold text-slate-900">
                  Criterio Resolutorio Aplicado:{' '}
                  <span className="text-blue-700 underline font-mono">
                    {bicActiva
                      ? 'Criterio #3: Preferencia Sociedades BIC (Decreto 1860 de 2021)'
                      : 'Criterio #3: Emprendimientos de Mujeres y Víctimas (Art. 35 num. 3 Ley 2069)'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {bicActiva
                    ? 'Habiendo empatado en condición Mipyme y domicilio, INGELECGROUP S.A.S. BIC gana por acreditación de Sociedad de Beneficio e Interés Colectivo registrada en Cámara de Comercio.'
                    : 'Al conmutar la regla BIC, la cascada avanza al factor de género y víctimas: SANJUANÉS SOLUCIONES gana por acreditar 60% de mujeres en dirección y vinculación de población vulnerable.'}
                </p>
              </div>

              {/* El Interruptor de Calibración en Vivo */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                <div className="flex items-center gap-2 text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Experimenta en vivo:</strong> Conmuta la regla de Sociedades BIC para ver la resolución en tiempo real:
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playSuccess();
                    conmutarHitoRegulatorio('HITO-01', !bicActiva);
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer shadow-sm border active:scale-95 ${
                    bicActiva
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                      : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  }`}
                  title="Conmutar la preferencia del Decreto 1860 de 2021 en vivo"
                >
                  Regla BIC: {bicActiva ? 'ACTIVADA (Gana INGELEC)' : 'DESACTIVADA (Gana SANJUANÉS)'}
                </button>
              </div>

              {/* Botón de Avance a Minuta */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => {
                    soundEffects.playSoftPop();
                    setDrawerAbierto('AUDITORIA_FORENSE_26');
                  }}
                  className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  Ver dictamen de los 26 auditores concurrentes ➔
                </button>

                <button
                  onClick={() => {
                    soundEffects.playSuccess();
                    launchConfetti({ count: 70 });
                    setEtapaWorkflow(5);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
                >
                  <span>Adjudicar y Pasar a Minuta Contractual</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ETAPA 5: CONTRATO, PÓLIZAS, SUPERVISIÓN & LIQUIDACIÓN           */}
        {/* ============================================================== */}
        {etapaWorkflow === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-awwwards space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                    Perfeccionamiento, Supervisión y Liquidación Bilateral
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contrato adjudicado por $ 418.500.000 COP • Supervisión técnica ejecutada al 100%.
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundEffects.playSoftPop();
                    setDrawerAbierto('ESTRUCTURA_AIU');
                  }}
                  className="text-xs font-bold text-blue-700 hover:underline cursor-pointer self-start sm:self-auto"
                >
                  Ver cálculo de AIU e IVA (Art. 462-1) ➔
                </button>
              </div>

              {/* Ficha Ejecutiva del Contrato */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 space-y-1 shadow-2xs">
                  <div className="font-extrabold text-slate-900">Garantías Aprobadas</div>
                  <div className="text-emerald-700 font-black font-mono">100% de Pólizas en Firme</div>
                  <p className="text-[11px] text-slate-500">Cumplimiento (10%) y Salarios (5%) amparadas.</p>
                </div>

                <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 space-y-1 shadow-2xs">
                  <div className="font-extrabold text-slate-900">Actas de Recibo Parcial</div>
                  <div className="text-emerald-700 font-black font-mono">3 de 3 Entregas Aprobadas</div>
                  <p className="text-[11px] text-slate-500">Interventor certifica recibo a satisfacción.</p>
                </div>

                <div className="bento-card p-4 rounded-2xl bg-white border border-slate-200/90 space-y-1 shadow-2xs">
                  <div className="font-extrabold text-slate-900">Balance Financiero</div>
                  <div className="text-emerald-700 font-black font-mono">$ 0 Saldos Pendientes</div>
                  <p className="text-[11px] text-slate-500">Paz y salvo de aportes parafiscales verificado.</p>
                </div>
              </div>

              {/* Botón Final de Liquidación */}
              {!paso5ContratoFirmado ? (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    No existen controversias contractuales ni solicitudes de reequilibrio económico pendientes.
                  </p>
                  <button
                    onClick={() => {
                      soundEffects.playFanfare();
                      launchConfetti({ count: 120, durationMs: 4500 });
                      setPaso5ContratoFirmado(true);
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Trophy className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Suscribir Acta de Liquidación Bilateral</span>
                  </button>
                </div>
              ) : (
                /* Certificado Awwwards de Finalización Triunfal */
                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-emerald-500/40 shadow-2xl space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-lime-400 text-slate-950 shadow-md shadow-emerald-500/30">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base sm:text-lg text-white font-display">
                            Expediente Blindado & Liquidado
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            100% AUDITABLE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Acta de Liquidación Bilateral suscrita • Sin Glosas Fiscales ni Disciplinarias
                        </p>
                      </div>
                    </div>

                    <img
                      src="/sanjuanes/badge_empowered_sanjuanes.png"
                      alt="Empowered by Sanjuanés Soluciones"
                      className="h-10 w-auto object-contain self-start sm:self-auto"
                    />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Has completado con éxito la simulación del ciclo contractual estatal bajo el régimen de las Leyes 80 de 1993, 1150 de 2007, 1882 de 2018 y 2069 de 2020. Todos los requisitos habilitantes y criterios de ponderación económica quedaron soportados en el estándar internacional de datos abiertos OCDS.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        soundEffects.playStepChange();
                        setEtapaWorkflow(1);
                        setPaso5ContratoFirmado(false);
                        setPaso1RevelarItems(false);
                        setPaso2ObservacionRespondida(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-md shadow-blue-500/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reiniciar con otro Desafío o Misión</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        launchConfetti();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer border border-slate-700"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                      <span>Lanzar Celebración</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* CAJÓN LATERAL UNIVERSAL (SLIDE-OVER DRAWER PARA DETALLES)        */}
      {/* ============================================================== */}
      {drawerAbierto !== 'NINGUNO' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 sm:p-7 overflow-y-auto space-y-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base font-display">
                  {drawerAbierto === 'DETALLES_PRESUPUESTO' && 'Matriz Técnica y Presupuesto Oficial'}
                  {drawerAbierto === 'AUDITORIA_RUP' && 'Balances Auditados y Certificado RUP'}
                  {drawerAbierto === 'AUDITORIA_FORENSE_26' && 'Dictamen Forense de 26 Auditores Concurrentes'}
                  {drawerAbierto === 'ESTRUCTURA_AIU' && 'Estructura Analítica de AIU e IVA (Art. 462-1)'}
                </h3>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setDrawerAbierto('NINGUNO');
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido según el Drawer */}
            <div className="flex-1 space-y-3.5 text-xs text-slate-700">
              {drawerAbierto === 'DETALLES_PRESUPUESTO' && (
                <div className="space-y-3">
                  <p>
                    El presupuesto oficial de <strong>$450.000.000 COP</strong> cuenta con estudio de mercado de 3 cotizaciones y amparo en el CDP 2025-00189.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px]">
                    <div>• Ítem 1 (80 PCs): $304.000.000 COP (67.5%)</div>
                    <div>• Ítem 2 (25 Portátiles): $105.000.000 COP (23.3%)</div>
                    <div>• Ítem 3 (12 WiFi 6): $41.000.000 COP (9.1%)</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900">
                    <strong>Matriz de Riesgos Cambiarios (Circular CCE 01):</strong> Se fijó banda de protección TRM entre $3.900 y $4.400 COP por dólar para equipos importados.
                  </div>
                </div>
              )}

              {drawerAbierto === 'AUDITORIA_RUP' && (
                <div className="space-y-3">
                  <p>
                    Verificación comparativa de estados financieros registrados en Cámara de Comercio con corte a 31 de diciembre:
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-extrabold text-slate-900">SANJUANÉS SOLUCIONES S.A.S. (Neiva)</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>Activo Total: $5.200M</div>
                      <div>Pasivo Total: $1.850M</div>
                      <div>Utilidad Op: $520M</div>
                      <div>Gastos Int: $45M</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-extrabold text-slate-900">INGELECGROUP S.A.S. BIC (Bogotá)</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>Activo Total: $3.950M</div>
                      <div>Pasivo Total: $1.500M</div>
                      <div>Utilidad Op: $410M</div>
                      <div>Gastos Int: $52M</div>
                    </div>
                  </div>
                </div>
              )}

              {drawerAbierto === 'AUDITORIA_FORENSE_26' && (
                <div className="space-y-3">
                  <p>
                    Escrutinio paralelo de 26 partes interesadas. Resumen de hallazgos:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <strong>Contraloría General:</strong> Sin hallazgos fiscales. Oferta temeraria requerida oportunamente.
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <strong>Veeduría Ciudadana:</strong> Cumplimiento de publicidad y plazos de observaciones en SECOP II.
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <strong>Gremio de Ingeniería:</strong> Pliegos tipo respetaron la taxatividad de la experiencia en RUP.
                    </div>
                  </div>
                </div>
              )}

              {drawerAbierto === 'ESTRUCTURA_AIU' && (
                <div className="space-y-3">
                  <p>
                    Liquidación de AIU bajo el <strong>Artículo 462-1 del Estatuto Tributario</strong>:
                  </p>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                    <div>• Costos Directos (con 52% prestaciones): $545.400.000 COP</div>
                    <div>• Administración (15%): $81.810.000 COP</div>
                    <div>• Imprevistos (3%): $16.362.000 COP</div>
                    <div>• Utilidad (5%): $27.270.000 COP</div>
                    <div className="pt-1 text-emerald-700 font-bold">
                      • IVA Legal (19% solo sobre Utilidad): $5.181.300 COP
                    </div>
                    <div className="text-blue-700 font-bold">
                      • Ahorro tributario legal frente a gravar todo el AIU: $18.652.680 COP
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setDrawerAbierto('NINGUNO');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
              >
                Cerrar cajón
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
