// Paleta de Comandos Universal (Command Palette - Ctrl + K / Cmd + K)
// Acceso instantáneo a cualquier vista, proceso, proponente y herramienta de auditoría
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Building2,
  Users,
  ShieldCheck,
  Scale,
  Brain,
  History,
  FileText,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  Layers,
  ChevronRight,
  Gavel,
  CheckCircle2,
  X,
  ShoppingBag,
  Calculator,
  Award,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import type { PlataformaVista } from '../core/domain/types';

interface CommandPaletteModalProps {
  abierto: boolean;
  onCerrar: () => void;
  onAbrirAuditoriaMultirol: () => void;
  onAbrirMentorCCE: () => void;
  onAbrirBriefing: () => void;
  onAbrirBitacora: () => void;
  onAbrirRadarRegulatorio?: () => void;
}

interface ItemComando {
  id: string;
  categoria: 'MÓDULOS' | 'PROCESOS' | 'PROPONENTES' | 'AUDITORÍA & HERRAMIENTAS';
  titulo: string;
  subtitulo: string;
  icono: React.ReactNode;
  accion: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  abierto,
  onCerrar,
  onAbrirAuditoriaMultirol,
  onAbrirMentorCCE,
  onAbrirBriefing,
  onAbrirBitacora,
  onAbrirRadarRegulatorio
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setVista,
    procesos,
    seleccionarProceso,
    proveedores,
    setProveedorActivo
  } = useProcurementStore();

  useEffect(() => {
    if (abierto) {
      setBusqueda('');
      setIndiceSeleccionado(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [abierto]);

  const comandos: ItemComando[] = [
    // Módulos
    {
      id: 'cmd-precontractual',
      categoria: 'MÓDULOS',
      titulo: 'Ingeniería Precontractual, Estudios Previos & Gestor de Recursos',
      subtitulo: 'EDP (Dcto. 1082/2015), CDP, PAC, Análisis Go/No-Go y Observaciones al Borrador',
      icono: <FileSpreadsheet className="w-4 h-4 text-cyan-400" />,
      accion: () => {
        setVista('INGENIERIA_PRECONTRACTUAL');
        onCerrar();
      }
    },
    {
      id: 'cmd-produccion-real',
      categoria: 'MÓDULOS',
      titulo: 'Suite de Operación Real & Enterprise (SECOP II & RUP)',
      subtitulo: 'Lector RUP Cámara de Comercio, conector SECOP II en vivo y dictámenes vinculantes',
      icono: <ShieldAlert className="w-4 h-4 text-amber-400" />,
      accion: () => {
        setVista('SUITE_PRODUCCION_REAL');
        onCerrar();
      }
    },
    {
      id: 'cmd-secop2-entidad',
      categoria: 'MÓDULOS',
      titulo: 'SECOP II (Entidad Estatal)',
      subtitulo: 'Estructuración, pliegos, evaluación y adjudicación',
      icono: <Building2 className="w-4 h-4 text-blue-400" />,
      accion: () => {
        setVista('SECOP_II_ENTIDAD');
        onCerrar();
      }
    },
    {
      id: 'cmd-secop2-prov',
      categoria: 'MÓDULOS',
      titulo: 'SECOP II (Licitante / Proveedor)',
      subtitulo: 'Búsqueda, postulación y radicación de ofertas',
      icono: <Users className="w-4 h-4 text-emerald-400" />,
      accion: () => {
        setVista('SECOP_II_PROVEEDOR');
        onCerrar();
      }
    },
    {
      id: 'cmd-subasta-inversa',
      categoria: 'MÓDULOS',
      titulo: 'Sala de Subasta Inversa Electrónica',
      subtitulo: 'Puja en vivo, decrementos y reloj de lances (Dto. 1082)',
      icono: <Gavel className="w-4 h-4 text-amber-400" />,
      accion: () => {
        setVista('SUBASTA_INVERSA');
        onCerrar();
      }
    },
    {
      id: 'cmd-scoring',
      categoria: 'MÓDULOS',
      titulo: 'Simulador de Calificación & Fórmulas CCE',
      subtitulo: 'Media Geométrica, Aritmética Alta, Ponderada y Mediana',
      icono: <Scale className="w-4 h-4 text-cyan-400" />,
      accion: () => {
        setVista('SIMULADOR_CALIFICACION');
        onCerrar();
      }
    },
    {
      id: 'cmd-validador-rup',
      categoria: 'MÓDULOS',
      titulo: 'Validador RUP & Capacidad Residual (K)',
      subtitulo: 'Verificación financiera RUP y cálculo oficial de K Residual',
      icono: <CheckCircle2 className="w-4 h-4 text-teal-400" />,
      accion: () => {
        setVista('VALIDADOR_RUP');
        onCerrar();
      }
    },
    {
      id: 'cmd-matriz-riesgos',
      categoria: 'MÓDULOS',
      titulo: 'Matriz de Riesgos Conpes 3714 & CCE',
      subtitulo: 'Mapa de calor 5x5, tipificación y asignación de riesgos',
      icono: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      accion: () => {
        setVista('MATRIZ_RIESGOS');
        onCerrar();
      }
    },
    {
      id: 'cmd-trends',
      categoria: 'MÓDULOS',
      titulo: 'Tendencias, Datos Abiertos & IA',
      subtitulo: 'Monte Carlo TRM, explorador en vivo datos.gov.co y noticias',
      icono: <TrendingUp className="w-4 h-4 text-violet-400" />,
      accion: () => {
        setVista('INTELIGENCIA_TENDENCIAS');
        onCerrar();
      }
    },
    {
      id: 'cmd-consorcios',
      categoria: 'MÓDULOS',
      titulo: 'Gestor de Consorcios & Uniones Temporales',
      subtitulo: 'Ponderación de experiencia y responsabilidad solidaria',
      icono: <Layers className="w-4 h-4 text-indigo-400" />,
      accion: () => {
        setVista('GESTOR_CONSORCIOS');
        onCerrar();
      }
    },
    {
      id: 'cmd-tvec',
      categoria: 'MÓDULOS',
      titulo: 'Tienda Virtual TVEC & Acuerdos Marco (AMP)',
      subtitulo: 'Catálogo CCE, evento de cotización en vivo y expedición de Órdenes de Compra',
      icono: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
      accion: () => {
        setVista('TIENDA_VIRTUAL_TVEC');
        onCerrar();
      }
    },
    {
      id: 'cmd-herramientas-economicas',
      categoria: 'MÓDULOS',
      titulo: 'Herramientas Económicas, Desempates & AIU',
      subtitulo: '10 factores de desempate (Ley 2069), precios artificialmente bajos, AIU e IVA, OCDS',
      icono: <Calculator className="w-4 h-4 text-amber-400" />,
      accion: () => {
        setVista('HERRAMIENTAS_ECONOMICAS_AVANZADAS');
        onCerrar();
      }
    },
    {
      id: 'cmd-liquidacion',
      categoria: 'MÓDULOS',
      titulo: 'Liquidación de Contratos Estatales',
      subtitulo: 'Art. 11 Ley 1150/2007, balance financiero, salvedades y acta de liquidación',
      icono: <Award className="w-4 h-4 text-cyan-400" />,
      accion: () => {
        setVista('LIQUIDACION_CONTRATOS');
        onCerrar();
      }
    },

    // Herramientas de Auditoría
    {
      id: 'cmd-radar-normativo',
      categoria: 'AUDITORÍA & HERRAMIENTAS',
      titulo: 'Radar de Vigilancia Regulatoria & Calibrador de Entorno',
      subtitulo: 'Monitoreo de sentencias del Consejo de Estado, Ley 2069, Ley 1882 y calibración activa',
      icono: <Scale className="w-4 h-4 text-amber-400" />,
      accion: () => {
        onCerrar();
        onAbrirRadarRegulatorio?.();
      }
    },
    {
      id: 'cmd-briefing',
      categoria: 'AUDITORÍA & HERRAMIENTAS',
      titulo: 'Briefing Estratégico & Tips Rotativos',
      subtitulo: 'Sanjuanés Soluciones y motor generativo de directrices',
      icono: <Sparkles className="w-4 h-4 text-lime-400" />,
      accion: () => {
        onCerrar();
        onAbrirBriefing();
      }
    },
    {
      id: 'cmd-multirol',
      categoria: 'AUDITORÍA & HERRAMIENTAS',
      titulo: 'Auditoría Multirol Simultánea (26 Stakeholders)',
      subtitulo: 'Contraloría DIARI, Procuraduría, Evaluadores y Competidores',
      icono: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
      accion: () => {
        onCerrar();
        onAbrirAuditoriaMultirol();
      }
    },
    {
      id: 'cmd-mentor-cce',
      categoria: 'AUDITORÍA & HERRAMIENTAS',
      titulo: 'Mentor Legal & Cumplimiento CCE',
      subtitulo: 'Asesor pedagógico de la Ley 80, 1150, 1882 y 2069',
      icono: <Brain className="w-4 h-4 text-amber-400" />,
      accion: () => {
        onCerrar();
        onAbrirMentorCCE();
      }
    },
    {
      id: 'cmd-bitacora',
      categoria: 'AUDITORÍA & HERRAMIENTAS',
      titulo: 'Bitácora de Trazabilidad OCDS',
      subtitulo: 'Historial inmutable de eventos y acciones realizadas',
      icono: <History className="w-4 h-4 text-blue-400" />,
      accion: () => {
        onCerrar();
        onAbrirBitacora();
      }
    },

    // Proponentes
    {
      id: 'cmd-prov-sanjuanes',
      categoria: 'PROPONENTES',
      titulo: 'Activar SANJUANES SOLUCIONES S.A.S. (PROV-04)',
      subtitulo: 'Proponente Insignia habilitado en RUP - Especialista Tecnológico',
      icono: <Zap className="w-4 h-4 text-lime-400" />,
      accion: () => {
        setProveedorActivo('PROV-04');
        onCerrar();
      }
    },
    {
      id: 'cmd-prov-ingelecgroup',
      categoria: 'PROPONENTES',
      titulo: 'Activar INGELECGROUP S.A.S. BIC (PROV-05)',
      subtitulo: 'Sociedad BIC (Ley 1901) - Ingeniería, redes eléctricas y energía sostenible',
      icono: <Zap className="w-4 h-4 text-emerald-400" />,
      accion: () => {
        setProveedorActivo('PROV-05');
        onCerrar();
      }
    },

    // Procesos
    ...procesos.map((p) => ({
      id: `cmd-proc-${p.id}`,
      categoria: 'PROCESOS' as const,
      titulo: `Cargar ${p.numeroProceso}`,
      subtitulo: `${p.objeto.slice(0, 65)}... (\$${(p.presupuestoOficial / 1_000_000).toFixed(0)}M COP)`,
      icono: <FileText className="w-4 h-4 text-slate-300" />,
      accion: () => {
        seleccionarProceso(p.id);
        onCerrar();
      }
    }))
  ];

  // Filtrado de comandos según la búsqueda
  const filtrados = comandos.filter((c) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      c.titulo.toLowerCase().includes(q) ||
      c.subtitulo.toLowerCase().includes(q) ||
      c.categoria.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndiceSeleccionado((prev) => (prev + 1) % filtrados.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndiceSeleccionado((prev) => (prev - 1 + filtrados.length) % filtrados.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtrados[indiceSeleccionado]) {
        filtrados[indiceSeleccionado].accion();
      }
    } else if (e.key === 'Escape') {
      onCerrar();
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full text-white overflow-hidden flex flex-col max-h-[75vh]">
        {/* Cabecera del buscador */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setIndiceSeleccionado(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribe para buscar vistas, procesos, proveedores o auditorías (Ctrl+K)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onCerrar}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de resultados */}
        <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar flex-1">
          {filtrados.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No se encontraron acciones o módulos para "{busqueda}".
            </div>
          ) : (
            filtrados.map((item, idx) => {
              const activo = idx === indiceSeleccionado;
              return (
                <button
                  key={item.id}
                  onClick={item.accion}
                  onMouseEnter={() => setIndiceSeleccionado(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    activo
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        activo ? 'bg-blue-700 text-white' : 'bg-slate-800'
                      }`}
                    >
                      {item.icono}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs truncate">
                          {item.titulo}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            activo
                              ? 'bg-blue-800 text-blue-200'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {item.categoria}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          activo ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {item.subtitulo}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      activo ? 'text-white translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer con atajos de ayuda */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                ↑↓
              </kbd>{' '}
              Navegar
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                ↵
              </kbd>{' '}
              Ejecutar
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                ESC
              </kbd>{' '}
              Cerrar
            </span>
          </div>
          <span className="text-[10px] text-lime-400 font-mono">
            Empowered by Sanjuanés Soluciones
          </span>
        </div>
      </div>
    </div>
  );
};
