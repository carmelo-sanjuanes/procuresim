// Barra Lateral de Navegación Inteligente (Sidebar) - ProcureSim v2.0
// Diseñado para optimizar el espacio vertical y maximizar el área de trabajo
import React from 'react';
import {
  Building2,
  FileText,
  TrendingUp,
  Briefcase,
  Layers,
  History,
  RotateCcw,
  ShieldCheck,
  Zap,
  Users,
  Scale,
  Calculator,
  Brain,
  Download,
  Upload,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Sliders,
  CheckCircle2,
  FolderSync,
  Gavel,
  ShieldAlert,
  FileCheck,
  ShoppingBag,
  FileSpreadsheet,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import type { PlataformaVista } from '../core/domain/types';
import { soundEffects } from '../utils/soundEffects';

interface SidebarProps {
  colapsado: boolean;
  onToggleColapsar: () => void;
  onAbrirAuditoria: () => void;
  onAbrirMultirol: () => void;
  onAbrirMentorCCE: () => void;
  onAbrirBienvenida?: () => void;
  onAbrirRadarRegulatorio?: () => void;
}

interface ItemNavegacion {
  id: PlataformaVista;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  colapsado,
  onToggleColapsar,
  onAbrirAuditoria,
  onAbrirMultirol,
  onAbrirMentorCCE,
  onAbrirBienvenida,
  onAbrirRadarRegulatorio
}) => {
  const {
    vistaActual,
    setVista,
    reiniciarDatosDemo,
    eventosAuditoria,
    exportarEstadoJSON,
    importarEstadoJSON,
    modoOperativo,
    setModoOperativo,
    densidadVisual,
    setDensidadVisual,
    hitosRegulatorios,
    etapaWorkflow,
    setEtapaWorkflow
  } = useProcurementStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportarEscenario = () => {
    const jsonStr = exportarEstadoJSON();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ProcureSim_Escenario_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const exito = importarEstadoJSON(content);
      if (exito) {
        alert('¡Escenario de entrenamiento cargado exitosamente!');
      } else {
        alert('El archivo no tiene un formato de escenario válido para ProcureSim.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Estado de Acordeón para Agrupación de Módulos (plegar / desplegar categorías)
  const [gruposAbiertos, setGruposAbiertos] = React.useState<Record<string, boolean>>({
    'Operación Real & Enterprise': true,
    'Contratación Pública': true,
    'Privada & B2B': false,
    'Motores de Ingeniería': false,
    'Jurídico & Alianzas': false
  });

  const toggleGrupo = (titulo: string) => {
    setGruposAbiertos((prev) => ({
      ...prev,
      [titulo]: !prev[titulo]
    }));
  };

  const expandirTodos = () => {
    const todos: Record<string, boolean> = {};
    gruposNavegacion.forEach((g) => {
      todos[g.titulo] = true;
    });
    setGruposAbiertos(todos);
  };

  const colapsarTodos = () => {
    const ninguno: Record<string, boolean> = {};
    gruposNavegacion.forEach((g) => {
      ninguno[g.titulo] = false;
    });
    // Mantener abierto el que contiene la vista actual
    const grupoConVista = gruposNavegacion.find((g) => g.items.some((item) => item.id === vistaActual));
    if (grupoConVista) {
      ninguno[grupoConVista.titulo] = true;
    }
    setGruposAbiertos(ninguno);
  };

  const gruposNavegacion: {
    titulo: string;
    items: ItemNavegacion[];
  }[] = [
    {
      titulo: 'Operación Real & Enterprise',
      items: [
        {
          id: 'INGENIERIA_PRECONTRACTUAL',
          label: 'Fase Previa & Estudios Previos',
          badge: 'CDP / Go-NoGo',
          icon: <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
        },
        {
          id: 'LINEA_TIEMPO_AUTOMATICA',
          label: 'Línea de Tiempo Legal (GPS)',
          badge: 'Días Hábiles',
          icon: <Calendar className="w-4 h-4 text-emerald-400" />
        },
        {
          id: 'SUITE_PRODUCCION_REAL',
          label: 'Suite Real (SECOP II & RUP)',
          badge: 'Vinculante',
          icon: <ShieldAlert className="w-4 h-4 text-amber-400" />
        }
      ]
    },
    {
      titulo: 'Contratación Pública',
      items: [
        {
          id: 'SECOP_II_ENTIDAD',
          label: 'SECOP II (Entidad)',
          badge: 'Oficial',
          icon: <Building2 className="w-4 h-4 text-blue-400" />
        },
        {
          id: 'SECOP_II_PROVEEDOR',
          label: 'SECOP II (Proveedor)',
          badge: 'Ofertas',
          icon: <Users className="w-4 h-4 text-emerald-400" />
        },
        {
          id: 'SUBASTA_INVERSA',
          label: 'Subasta Inversa SECOP',
          badge: 'Puja Viva',
          icon: <Gavel className="w-4 h-4 text-amber-400" />
        },
        {
          id: 'TIENDA_VIRTUAL_TVEC',
          label: 'Tienda Virtual TVEC',
          badge: 'Catálogo CCE',
          icon: <ShoppingBag className="w-4 h-4 text-cyan-400" />
        },
        {
          id: 'SECOP_I',
          label: 'SECOP I',
          badge: 'Publicidad',
          icon: <History className="w-4 h-4 text-amber-400" />
        }
      ]
    },
    {
      titulo: 'Privada & B2B',
      items: [
        {
          id: 'SUPLOS',
          label: 'Suplos B2B',
          badge: 'LatAm',
          icon: <Layers className="w-4 h-4 text-teal-400" />
        },
        {
          id: 'SAP_ARIBA',
          label: 'SAP Ariba',
          badge: 'Subastas',
          icon: <Zap className="w-4 h-4 text-yellow-400" />
        },
        {
          id: 'COUPA',
          label: 'Coupa Spend',
          badge: 'Procure',
          icon: <Briefcase className="w-4 h-4 text-orange-400" />
        }
      ]
    },
    {
      titulo: 'Motores de Ingeniería',
      items: [
        {
          id: 'ESTUDIO_MERCADO',
          label: 'Estudio de Mercado & Precios',
          badge: 'CCE',
          icon: <TrendingUp className="w-4 h-4 text-indigo-400" />
        },
        {
          id: 'MATRIZ_RIESGOS',
          label: 'Matriz Riesgos Conpes 3714',
          badge: '5x5 CCE',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />
        },
        {
          id: 'SIMULADOR_CALIFICACION',
          label: 'Fórmulas & Calificación CCE',
          badge: 'TRM / Balota',
          icon: <Calculator className="w-4 h-4 text-amber-400" />
        },
        {
          id: 'HERRAMIENTAS_ECONOMICAS_AVANZADAS',
          label: 'Desempates, Precios & AIU',
          badge: 'Ley 2069 / OCDS',
          icon: <Scale className="w-4 h-4 text-emerald-400" />
        },
        {
          id: 'INTELIGENCIA_TENDENCIAS',
          label: 'Tendencias & SECOP IA',
          badge: 'Monte Carlo',
          icon: <Brain className="w-4 h-4 text-purple-400" />
        },
        {
          id: 'ASISTENTE_PROPUESTAS',
          label: 'Asistente de Propuestas',
          badge: 'Licitante',
          icon: <ShieldCheck className="w-4 h-4 text-pink-400" />
        },
        {
          id: 'GENERADOR_DOCUMENTOS',
          label: 'Generador Documentos Ley 80',
          badge: '.docx',
          icon: <FileText className="w-4 h-4 text-cyan-400" />
        }
      ]
    },
    {
      titulo: 'Jurídico & Alianzas',
      items: [
        {
          id: 'VALIDADOR_RUP',
          label: 'Validador RUP & K Residual',
          badge: 'Financiero',
          icon: <FileCheck className="w-4 h-4 text-teal-400" />
        },
        {
          id: 'GESTION_CONTROVERSIAS',
          label: 'Controversias & Líneas Tiempo',
          badge: 'Art. 86',
          icon: <Scale className="w-4 h-4 text-rose-400" />
        },
        {
          id: 'LIQUIDACION_CONTRATOS',
          label: 'Liquidación Contratos',
          badge: 'Art. 11',
          icon: <FileCheck className="w-4 h-4 text-purple-400" />
        },
        {
          id: 'GESTOR_CONSORCIOS',
          label: 'Consorcios & UT (Aliados)',
          badge: 'Art. 7',
          icon: <Users className="w-4 h-4 text-pink-400" />
        }
      ]
    }
  ];

  // Auto-expandir el grupo donde reside la vista activa
  React.useEffect(() => {
    const grupoConVista = gruposNavegacion.find((g) => g.items.some((item) => item.id === vistaActual));
    if (grupoConVista) {
      setGruposAbiertos((prev) => ({
        ...prev,
        [grupoConVista.titulo]: true
      }));
    }
  }, [vistaActual]);

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-white flex flex-col transition-all duration-300 z-40 shrink-0 ${
        colapsado ? 'w-18' : 'w-72'
      }`}
    >
      {/* 1. Cabecera con Logo Oficial de Sanjuanes Soluciones */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950">
        {!colapsado ? (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <img
                src="/sanjuanes/sanjuanes-logo-horizontal-dark.svg"
                alt="Sanjuanés Soluciones"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PROCURESIM v2.0</span>
              <span className="text-slate-600">|</span>
              <span className="text-[10px] text-lime-400 font-mono">SUITE IA</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <img
              src="/sanjuanes/sanjuanes_icon.png"
              alt="Sanjuanés Icon"
              className="w-7 h-7 object-contain"
              title="Sanjuanés Soluciones S.A.S."
            />
          </div>
        )}

        <button
          onClick={onToggleColapsar}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          title={colapsado ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          {colapsado ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Lista de Grupos de Navegación Verticales (Scrollable con Acordeón) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3 custom-scrollbar text-xs">
        {modoOperativo === 'ENTRENAMIENTO' && densidadVisual === 'ENFOCADA_SIMPLE' ? (
          /* ========================================================================= */
          /* RUTA JUSTO A TIEMPO (JUST-IN-TIME TOOLING): SE OCULTAN 19 HERRAMIENTAS   */
          /* Solo se muestra la ruta de 5 hitos y la herramienta del paso activo      */
          /* ========================================================================= */
          <div className="space-y-3 animate-fadeIn">
            {/* Cabecera del Flujo Guiado */}
            {!colapsado ? (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-1 shadow-inner">
                <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider font-mono">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GPS de Entrenamiento</span>
                </div>
                <div className="font-extrabold text-white text-xs">
                  LP-001-2025 ($450M COP)
                </div>
                <div className="text-[10px] text-slate-400">
                  Alcaldía de San Pedro del Valle
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center py-1" title="GPS de Entrenamiento">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
            )}

            {/* Stepper Vertical de 5 Hitos */}
            <div className="space-y-1 pt-1">
              {!colapsado && (
                <div className="px-2 text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Ruta Formativa (5 Estaciones)
                </div>
              )}
              {[
                { num: 1, label: '1. Planeación & CDP' },
                { num: 2, label: '2. Observaciones & Adendas' },
                { num: 3, label: '3. Ofertas & RUP' },
                { num: 4, label: '4. Evaluación & Desempate' },
                { num: 5, label: '5. Contrato & Liquidación' }
              ].map((etapa) => {
                const esActiva = etapaWorkflow === etapa.num;
                const esCompletada = etapaWorkflow > etapa.num;

                return (
                  <button
                    key={etapa.num}
                    onClick={() => {
                      soundEffects.playStepChange();
                      setEtapaWorkflow(etapa.num);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer active:scale-95 border ${
                      esActiva
                        ? 'bg-blue-600/30 text-white border-blue-500/60 shadow-md shadow-blue-500/20 font-bold'
                        : esCompletada
                        ? 'bg-emerald-950/20 text-emerald-300 border-emerald-900/30 hover:bg-emerald-950/40'
                        : 'bg-slate-900/40 text-slate-400 border-slate-800/60 hover:text-white hover:bg-slate-800/50'
                    } ${colapsado ? 'justify-center px-1' : ''}`}
                    title={`Paso ${etapa.num}: ${etapa.label}`}
                  >
                    <div className="shrink-0">
                      {esCompletada ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                            esActiva ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {etapa.num}
                        </span>
                      )}
                    </div>
                    {!colapsado && <span className="truncate text-xs">{etapa.label}</span>}
                  </button>
                );
              })}
            </div>

            {/* Revelación Justo a Tiempo: Herramienta Específica de esta Etapa */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              {!colapsado && (
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>Herramienta del Paso {etapaWorkflow}</span>
                </div>
              )}

              {/* Herramienta 1 de la etapa */}
              {etapaWorkflow === 1 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setVista('INGENIERIA_PRECONTRACTUAL');
                    setDensidadVisual('EXPERTO_AVANZADA');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-left cursor-pointer active:scale-95 shadow-md shadow-blue-500/25 ring-1 ring-blue-400/40"
                  title="Abrir Estudios Previos & CDP ($450M COP)"
                >
                  <Building2 className="w-4 h-4 text-cyan-300 shrink-0" />
                  {!colapsado && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs">Estudios Previos & CDP</div>
                      <div className="text-[10px] text-cyan-200 font-mono">$450M COP</div>
                    </div>
                  )}
                </button>
              )}

              {etapaWorkflow === 2 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setVista('GESTION_CONTROVERSIAS');
                    setDensidadVisual('EXPERTO_AVANZADA');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-left cursor-pointer active:scale-95 shadow-md shadow-amber-500/25 ring-1 ring-amber-400/40"
                  title="Abrir Observaciones y Límite de Adendas"
                >
                  <Scale className="w-4 h-4 text-amber-200 shrink-0" />
                  {!colapsado && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs">Observaciones & Adendas</div>
                      <div className="text-[10px] text-amber-200 font-mono">Ley 1882/2018</div>
                    </div>
                  )}
                </button>
              )}

              {etapaWorkflow === 3 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setVista('VALIDADOR_RUP');
                    setDensidadVisual('EXPERTO_AVANZADA');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-left cursor-pointer active:scale-95 shadow-md shadow-teal-500/25 ring-1 ring-teal-400/40"
                  title="Abrir Validador RUP (Sanjuanés Soluciones vs Ingelec BIC)"
                >
                  <FileCheck className="w-4 h-4 text-teal-200 shrink-0" />
                  {!colapsado && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs">Validador RUP & Balances</div>
                      <div className="text-[10px] text-teal-200 font-mono">Sanjuanés / BIC</div>
                    </div>
                  )}
                </button>
              )}

              {etapaWorkflow === 4 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setVista('HERRAMIENTAS_ECONOMICAS_AVANZADAS');
                    setDensidadVisual('EXPERTO_AVANZADA');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-left cursor-pointer active:scale-95 shadow-md shadow-indigo-500/25 ring-1 ring-indigo-400/40"
                  title="Abrir Desempate Ley 2069 (BIC) y AIU Art. 462-1"
                >
                  <Scale className="w-4 h-4 text-purple-200 shrink-0" />
                  {!colapsado && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs">Desempate Ley 2069 (BIC)</div>
                      <div className="text-[10px] text-purple-200 font-mono">100 Pts / AIU</div>
                    </div>
                  )}
                </button>
              )}

              {etapaWorkflow === 5 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setVista('LIQUIDACION_CONTRATOS');
                    setDensidadVisual('EXPERTO_AVANZADA');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-left cursor-pointer active:scale-95 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400/40"
                  title="Abrir Liquidación de Contratos y Pólizas"
                >
                  <FileCheck className="w-4 h-4 text-cyan-200 shrink-0" />
                  {!colapsado && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs">Liquidación & Pólizas</div>
                      <div className="text-[10px] text-cyan-200 font-mono">Art. 11 Ley 1150</div>
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Botón para Desplegar el Catálogo Completo (Modo Experto) */}
            <div className="pt-3 border-t border-slate-800/80">
              <button
                onClick={() => {
                  soundEffects.playSoftPop();
                  setDensidadVisual('EXPERTO_AVANZADA');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-semibold transition-all cursor-pointer text-left"
                title="Desplegar el catálogo completo de las 22 herramientas avanzadas"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {!colapsado && <span>Ver Catálogo Completo (22)</span>}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODO EXPERTO / PRODUCCIÓN REAL: CATÁLOGO COMPLETO DE LOS 22 MÓDULOS      */
          /* ========================================================================= */
          <>
            {/* Barra superior de control rápido del Acordeón */}
            {!colapsado && (
              <div className="flex items-center justify-between px-2 pt-0.5 pb-1 text-[10px] text-slate-400 border-b border-slate-800/60 mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-500 text-[9px]">
                  Módulos ({gruposNavegacion.reduce((acc, g) => acc + g.items.length, 0)})
                </span>
                <div className="flex items-center gap-1.5 text-[9px]">
                  <button
                    onClick={expandirTodos}
                    className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400"
                    title="Desplegar todas las categorías de módulos"
                  >
                    Expandir
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={colapsarTodos}
                    className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400"
                    title="Plegar categorías secundarias y conservar solo la activa"
                  >
                    Plegar
                  </button>
                </div>
              </div>
            )}

            {/* Botón para regresar al Flujo Guiado */}
            <div className="pb-2">
              <button
                onClick={() => {
                  soundEffects.playStepChange();
                  setModoOperativo('ENTRENAMIENTO');
                  setDensidadVisual('ENFOCADA_SIMPLE');
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer active:scale-95 border ${
                  modoOperativo === 'ENTRENAMIENTO' && densidadVisual === 'ENFOCADA_SIMPLE'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/50 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
                } ${colapsado ? 'justify-center px-2' : ''}`}
                title="Regresar a la Ruta Guiada de Aprendizaje"
              >
                <div className="shrink-0">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                </div>
                {!colapsado && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black truncate">🎯 Volver al GPS Guiado</div>
                    <div className="text-[10px] text-slate-400 truncate">LP-001-2025 San Pedro</div>
                  </div>
                )}
              </button>
            </div>

            {gruposNavegacion.map((grupo) => {
              const estaAbierto = gruposAbiertos[grupo.titulo] ?? true;
              const tieneActivo = grupo.items.some((item) => item.id === vistaActual);

              return (
                <div key={grupo.titulo} className="space-y-1">
                  {!colapsado ? (
                    <button
                      onClick={() => toggleGrupo(grupo.titulo)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer group select-none ${
                        tieneActivo
                          ? 'text-cyan-400 font-bold bg-slate-800/50 border border-cyan-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                      }`}
                      title={`Clic para ${estaAbierto ? 'plegar' : 'desplegar'} ${grupo.titulo}`}
                    >
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider truncate">
                          {grupo.titulo}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
                          {grupo.items.length}
                        </span>
                      </span>
                      <span className="shrink-0 text-slate-500 group-hover:text-slate-300">
                        {estaAbierto ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>
                  ) : (
                    <div className="w-full border-t border-slate-800 my-2" />
                  )}

                  {/* Contenido del grupo */}
                  {(!colapsado ? estaAbierto : true) && (
                    <div className="space-y-0.5">
                      {grupo.items.map((item) => {
                        const activo = vistaActual === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              soundEffects.playClick();
                              setVista(item.id);
                              setDensidadVisual('EXPERTO_AVANZADA');
                            }}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium transition-all text-left cursor-pointer active:scale-95 ${
                              activo
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/40 font-semibold'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                            } ${colapsado ? 'justify-center' : ''}`}
                            title={`${item.label} [${item.badge || 'Módulo'}] - Clic para navegar`}
                          >
                            <div className="shrink-0">{item.icon}</div>
                            {!colapsado && (
                              <div className="flex items-center justify-between flex-1 min-w-0">
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ml-1.5 ${
                                      activo
                                        ? 'bg-blue-500/60 text-white'
                                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* 3. Panel de Herramientas de Auditoría, Tutoría & Sistema */}
        <div className="space-y-1 pt-2 border-t border-slate-800/80">
          {!colapsado && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Herramientas & Auditoría
            </span>
          )}

          <div className="space-y-1">
            {/* Radar de Vigilancia Regulatoria & Calibrador */}
            {onAbrirRadarRegulatorio && (
              <button
                onClick={onAbrirRadarRegulatorio}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-amber-500/20 border border-amber-500/40 transition-colors font-semibold ${
                  colapsado ? 'justify-center' : ''
                }`}
                title="Radar de Vigilancia Regulatoria, Jurisprudencial y Calibrador de Entorno"
              >
                <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                {!colapsado && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">Radar Normativo</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                      {hitosRegulatorios.filter((h) => h.activoEnEntorno).length}
                    </span>
                  </div>
                )}
              </button>
            )}

            {/* Mentor CCE */}
            <button
              onClick={onAbrirMentorCCE}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-amber-500/20 border border-amber-500/30 transition-colors font-semibold ${
                colapsado ? 'justify-center' : ''
              }`}
              title="Auditor y Mentor de Cumplimiento Legal CCE (10 Reglas)"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              {!colapsado && <span>Mentor CCE (10 Reglas)</span>}
            </button>

            {/* Auditoría Multirol */}
            <button
              onClick={onAbrirMultirol}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-600/30 border border-indigo-500/40 transition-colors font-semibold ${
                colapsado ? 'justify-center' : ''
              }`}
              title="Matriz de Auditoría y Verificación para 26 Partes Interesadas (Stakeholders)"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              {!colapsado && <span>Auditoría Multirol (26)</span>}
            </button>

            {/* Bitácora OCDS */}
            <button
              onClick={onAbrirAuditoria}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
                colapsado ? 'justify-center' : ''
              }`}
              title={`Bitácora de Auditoría OCDS (${eventosAuditoria.length} eventos)`}
            >
              <History className="w-4 h-4 text-blue-400 shrink-0" />
              {!colapsado && (
                <div className="flex items-center justify-between flex-1">
                  <span>Bitácora Auditoría</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-blue-300 border border-slate-700 font-mono">
                    {eventosAuditoria.length}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 4. Portabilidad de Escenarios */}
        <div className="space-y-1 pt-2 border-t border-slate-800/80">
          {!colapsado && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Gestión de Casos (JSON)
            </span>
          )}

          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={handleExportarEscenario}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 ${
                colapsado ? 'col-span-2 justify-center' : ''
              }`}
              title="Exportar archivo JSON con todo el estado del caso formativo"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              {!colapsado && <span className="text-[11px]">Exportar</span>}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 ${
                colapsado ? 'col-span-2 justify-center' : ''
              }`}
              title="Importar archivo JSON de caso práctico"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              {!colapsado && <span className="text-[11px]">Importar</span>}
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportarArchivo}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={reiniciarDatosDemo}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-colors border border-rose-500/20 text-[11px] ${
              colapsado ? 'justify-center' : ''
            }`}
            title="Restablecer todos los datos iniciales de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {!colapsado && <span>Restablecer Datos Demo</span>}
          </button>
        </div>
      </div>

      {/* 5. Pie del Sidebar: Badge Oficial Empowered Sanjuanes Soluciones */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col items-center space-y-2">
        {!colapsado ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Modo Operativo:</span>
              <button
                onClick={() =>
                  setModoOperativo(
                    modoOperativo === 'PRODUCCION_REAL' ? 'ENTRENAMIENTO' : 'PRODUCCION_REAL'
                  )
                }
                className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  modoOperativo === 'PRODUCCION_REAL'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
                title={
                  modoOperativo === 'PRODUCCION_REAL'
                    ? 'Modo Producción Real activo: validaciones estrictas y bloqueos de cumplimiento CCE'
                    : 'Modo Entrenamiento activo: alertas formativas, sugerencias guiadas y simulaciones pedagógicas'
                }
              >
                {modoOperativo === 'PRODUCCION_REAL' ? 'Producción' : 'Entrenamiento'}
              </button>
            </div>

            {/* Badge Oficial Sanjuanes Soluciones */}
            <div
              onClick={onAbrirBienvenida}
              className="pt-1 w-full flex justify-center cursor-pointer group"
              title="Abrir Briefing Estratégico & Tips Tácticos Sanjuanés"
            >
              <img
                src="/sanjuanes/badge_empowered_sanjuanes.png"
                alt="Empowered by Sanjuanes Soluciones"
                className="w-full max-w-[220px] h-auto object-contain rounded-lg shadow-md group-hover:scale-[1.03] group-hover:ring-1 group-hover:ring-lime-400/50 transition-all"
              />
            </div>
          </div>
        ) : (
          <div
            onClick={onAbrirBienvenida}
            className="cursor-pointer hover:scale-110 transition-transform"
            title="Empowered by Sanjuanés Soluciones S.A.S. - Clic para ver Briefing & Tips"
          >
            <img
              src="/sanjuanes/sanjuanes_symbol_lime.png"
              alt="Sanjuanes Symbol"
              className="w-6 h-6 object-contain"
            />
          </div>
        )}
      </div>
    </aside>
  );
};
