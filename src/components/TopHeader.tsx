// Cabecera Superior Delgada (TopHeader) - ProcureSim v2.0 (Edición Awwwards)
// Proporciona contexto, selector de proceso activo y herramientas rápidas con diseño de alta fidelidad
import React from 'react';
import {
  Menu,
  Lightbulb,
  ShieldCheck,
  History,
  Building2,
  Users,
  ChevronRight,
  Sparkles,
  Search,
  Scale,
  GraduationCap,
  ArrowLeft,
  FolderOpen
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import { soundEffects } from '../utils/soundEffects';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  sidebarColapsado: boolean;
  onAbrirMentorCCE: () => void;
  onAbrirMultirol: () => void;
  onAbrirAuditoria: () => void;
  onAbrirBienvenida?: () => void;
  onAbrirCommandPalette?: () => void;
  onAbrirRadarRegulatorio?: () => void;
  onAbrirExpedientes?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  sidebarColapsado,
  onAbrirMentorCCE,
  onAbrirMultirol,
  onAbrirAuditoria,
  onAbrirBienvenida,
  onAbrirCommandPalette,
  onAbrirRadarRegulatorio,
  onAbrirExpedientes
}) => {
  const {
    vistaActual,
    procesos,
    procesoSeleccionadoId,
    seleccionarProceso,
    expedientes,
    expedienteActivoId,
    reanudarExpediente,
    proveedores,
    proveedorActivoId,
    setProveedorActivo,
    eventosAuditoria,
    modoOperativo,
    setModoOperativo,
    hitosRegulatorios,
    densidadVisual,
    setDensidadVisual
  } = useProcurementStore();

  const titulosVista: Record<string, { categoria: string; titulo: string }> = {
    SECOP_II_ENTIDAD: { categoria: 'Contratación Pública', titulo: 'SECOP II (Entidad Estatal)' },
    SECOP_II_PROVEEDOR: { categoria: 'Contratación Pública', titulo: 'SECOP II (Licitante / Proveedor)' },
    SUBASTA_INVERSA: { categoria: 'Contratación Pública', titulo: 'Sala de Subasta Inversa Electrónica' },
    TIENDA_VIRTUAL_TVEC: { categoria: 'Catálogo CCE', titulo: 'Tienda Virtual del Estado (TVEC) & Acuerdos Marco' },
    SECOP_I: { categoria: 'Contratación Pública', titulo: 'SECOP I (Histórico & Publicidad)' },
    SUPLOS: { categoria: 'Privada & B2B', titulo: 'Suplos B2B Procurement' },
    SAP_ARIBA: { categoria: 'Privada & B2B', titulo: 'SAP Ariba Sourcing' },
    COUPA: { categoria: 'Privada & B2B', titulo: 'Coupa Spend Management' },
    ESTUDIO_MERCADO: { categoria: 'Ingeniería Contractual', titulo: 'Estudio de Mercado & Análisis de Precios' },
    MATRIZ_RIESGOS: { categoria: 'Ingeniería Contractual', titulo: 'Matriz de Riesgos Conpes 3714 & CCE' },
    SIMULADOR_CALIFICACION: { categoria: 'Pliegos Tipo CCE', titulo: 'Fórmulas Matemáticas & Calificación de Ofertas' },
    HERRAMIENTAS_ECONOMICAS_AVANZADAS: { categoria: 'Ingeniería Económica', titulo: 'Desempates (Ley 2069), Precios Bajos & AIU' },
    INTELIGENCIA_TENDENCIAS: { categoria: 'Inteligencia SECOP', titulo: 'Tendencias, Datos Abiertos & IA' },
    ASISTENTE_PROPUESTAS: { categoria: 'Licitante 360°', titulo: 'Asistente de Estructuración de Propuestas' },
    VALIDADOR_RUP: { categoria: 'Licitante 360°', titulo: 'Validador RUP & Capacidad Residual (K)' },
    GENERADOR_DOCUMENTOS: { categoria: 'Estatuto Contractual', titulo: 'Generador de Documentos Ley 80' },
    GESTION_CONTROVERSIAS: { categoria: 'Litigio & CPACA', titulo: 'Gestión de Controversias Contractuales' },
    LIQUIDACION_CONTRATOS: { categoria: 'Cierre Contractual', titulo: 'Liquidación de Contratos Estatales (Art. 11 Ley 1150)' },
    GESTOR_CONSORCIOS: { categoria: 'Proponentes Plurales', titulo: 'Gestor de Consorcios & Uniones Temporales' },
    SUITE_PRODUCCION_REAL: { categoria: 'Operación Real', titulo: 'Suite de Operación Real & Enterprise (SECOP II & RUP)' },
    INGENIERIA_PRECONTRACTUAL: { categoria: 'Fase Previa & EDP', titulo: 'Ingeniería Precontractual, Estudios Previos & Gestor de Recursos' },
    FLUJOGRAMA_PASO_A_PASO: { categoria: 'Flujograma Legal', titulo: 'Diagrama de Flujo Paso a Paso' },
    LINEA_TIEMPO_AUTOMATICA: { categoria: 'Cronograma Legal', titulo: 'Línea de Tiempo Automática & GPS Procesal' }
  };

  const infoVista = titulosVista[vistaActual] || { categoria: 'Módulo', titulo: vistaActual };

  // Cabecera Ultra-Limpia para el Modo Simple y Producción Guiada
  if (densidadVisual === 'ENFOCADA_SIMPLE') {
    return (
      <header className="h-14 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-800 z-30 shrink-0 select-none">
        {/* Izquierda: Volver al inicio + Logo ProcureSim */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onAbrirBienvenida) onAbrirBienvenida();
            }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer font-bold text-xs"
            title="Volver al Lienzo en Blanco"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Volver</span>
          </button>

          <div className="h-4 w-px bg-slate-200"></div>

          <span className="font-black text-slate-900 text-xs tracking-wider font-display">
            PROCURESIM
          </span>
        </div>

        {/* Centro sutil */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
            {modoOperativo === 'PRODUCCION_REAL' ? '🏢 Modo Producción' : '🎓 Modo Aprendizaje'}
          </span>
        </div>

        {/* Derecha: Botón de cambio de modo y acceso a vista experta */}
        <div className="flex items-center gap-2">
          {onAbrirExpedientes && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onAbrirExpedientes();
              }}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-700 px-2.5 py-1 transition-colors cursor-pointer"
              title="Ver, reanudar, duplicar, exportar o importar tus expedientes guardados"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Mis expedientes{expedientes.length > 0 ? ` (${expedientes.length})` : ''}</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playClick();
              setDensidadVisual('EXPERTO_AVANZADA');
            }}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-700 px-2.5 py-1 transition-colors cursor-pointer hidden sm:inline"
            title="Activar tablero completo de ingeniería contractual"
          >
            Vista Experta
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              if (onAbrirBienvenida) onAbrirBienvenida();
            }}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            <span>{modoOperativo === 'PRODUCCION_REAL' ? 'Cambiar a Aprender' : 'Cambiar a Producir'}</span>
          </button>
        </div>
      </header>
    );
  }

  const selectorProceso = (
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
        <Building2 className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[11px] font-semibold text-slate-400">Proceso:</span>
        <select
          value={expedienteActivoId ? `exp:${expedienteActivoId}` : procesoSeleccionadoId}
          aria-label="Proceso activo"
          onChange={(e) => {
            soundEffects.playClick();
            const v = e.target.value;
            if (v.startsWith('exp:')) {
              window.dispatchEvent(new Event('procuresim:guardar-expediente'));
              reanudarExpediente(v.slice(4));
            } else {
              seleccionarProceso(v);
            }
          }}
          className="bg-transparent font-extrabold text-slate-900 text-[11px] focus:outline-none cursor-pointer font-mono"
          title="Seleccionar el proceso de contratación pública activo"
        >
          {expedientes.length > 0 && (
            <optgroup label="Mis expedientes">
              {expedientes.map((x) => (
                <option key={x.id} value={`exp:${x.id}`} className="bg-white text-slate-900">
                  {x.objeto.slice(0, 32)} · {x.etiquetaPaso.split(":")[0]} · …{x.id.slice(-4)}
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="Casos de demostración">
            {procesos.map((p) => (
              <option key={p.id} value={p.id} className="bg-white text-slate-900">
                {p.numeroProceso} (${(p.presupuestoOficial / 1_000_000).toFixed(0)}M COP)
              </option>
            ))}
          </optgroup>
        </select>
      </div>
  );

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-800 z-30 shrink-0 transition-all">
      {/* Izquierda: Toggle Sidebar en Modo Experto o Botón Inicio en Modo Enfocado */}
      <div className="flex items-center gap-3 min-w-0">
        {densidadVisual === 'EXPERTO_AVANZADA' ? (
          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleSidebar();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            title={sidebarColapsado ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          >
            <Menu className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onAbrirBienvenida) onAbrirBienvenida();
            }}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-950 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition-all cursor-pointer font-bold text-xs"
            title="Volver a la pantalla de inicio (Lienzo en Blanco)"
          >
            <span>← Inicio</span>
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hidden sm:inline font-mono">
            {infoVista.categoria}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <h1 className="font-extrabold text-slate-900 text-sm tracking-tight truncate font-display">
            {infoVista.titulo}
          </h1>
        </div>
      </div>

      {/* Centro: Proceso Activo & Proponente Insignia */}
      <div className="hidden lg:flex items-center gap-2.5">
        {modoOperativo === 'ENTRENAMIENTO' ? (
          /* En Modo Entrenamiento: Contexto del caso formativo oficial */
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                if (onAbrirBienvenida) onAbrirBienvenida();
              }}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
              title="Clic para cambiar entre Modo Aprendizaje y Modo Producción"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>🎓 Aprender</span>
            </button>

            {expedientes.length > 0 ? (
              selectorProceso
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[11px] font-semibold text-slate-400">Expediente:</span>
              <span className="font-extrabold text-slate-800 text-[11px] font-mono">
                LP-001-2025 ($450M COP)
              </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-white text-slate-800 px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
              <img
                src="/sanjuanes/sanjuanes_icon.png"
                alt="Sanjuanés"
                className="w-3.5 h-3.5 object-contain"
              />
              <span className="text-[11px] font-extrabold text-slate-900">
                Sanjuanés Soluciones
              </span>
              <span className="text-[10px] text-slate-400">vs</span>
              <span className="text-[11px] font-extrabold text-emerald-600">
                Ingelec BIC
              </span>
            </div>
          </div>
        ) : (
          /* En Modo Producción Real: Selectores dinámicos limpios */
          <>
            <button
              onClick={() => {
                soundEffects.playClick();
                if (onAbrirBienvenida) onAbrirBienvenida();
              }}
              className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
              title="Clic para cambiar entre Modo Producción y Modo Aprendizaje"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>🏢 Producir</span>
            </button>

            {selectorProceso}
          </>
        )}

        {/* Toggle de Densidad Visual: Paso a Paso vs Modo Experto */}
        <button
          onClick={() => {
            soundEffects.playClick();
            setDensidadVisual('ENFOCADA_SIMPLE');
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl border font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-2xs bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950"
          title="Modo Experto activo. Clic para volver a la vista simple"
        >
          <span>🔬 Modo Experto</span>
        </button>
      </div>

      {/* Derecha: Botón de Búsqueda y herramientas avanzadas (solo en Modo Experto) */}
      <div className="flex items-center gap-2">
        {onAbrirCommandPalette && (
          <button
            onClick={() => {
              soundEffects.playSoftPop();
              onAbrirCommandPalette();
            }}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-xl font-semibold transition-all text-xs active:scale-95 cursor-pointer shadow-2xs"
            title="Abrir Paleta de Comandos Rápida (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline text-slate-500">Buscar</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono font-bold bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
              Ctrl+K
            </kbd>
          </button>
        )}

        {densidadVisual === 'EXPERTO_AVANZADA' && (
          <>
            {onAbrirExpedientes && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onAbrirExpedientes();
                }}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl font-bold transition-all text-xs shadow-2xs active:scale-95 cursor-pointer"
                title="Mis expedientes guardados"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Mis expedientes</span>
                {expedientes.length > 0 && (
                  <span className="bg-slate-200 text-slate-800 font-mono text-[10px] font-black px-1.5 rounded-full">{expedientes.length}</span>
                )}
              </button>
            )}

            {onAbrirRadarRegulatorio && (
              <button
                onClick={() => {
                  soundEffects.playSoftPop();
                  onAbrirRadarRegulatorio();
                }}
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl font-bold transition-all text-xs shadow-2xs active:scale-95 cursor-pointer"
                title="Radar de Vigilancia Regulatoria & Jurisprudencial"
              >
                <Scale className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="hidden sm:inline">Radar</span>
                <span className="bg-amber-200 text-amber-900 font-mono text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {hitosRegulatorios.filter((h) => h.activoEnEntorno).length}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playSoftPop();
                onAbrirMentorCCE();
              }}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl font-bold transition-all text-xs active:scale-95 cursor-pointer shadow-2xs"
              title="Mentor Pedagógico y Auditor CCE"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Mentor CCE</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playSoftPop();
                onAbrirMultirol();
              }}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-xl font-bold transition-all text-xs active:scale-95 cursor-pointer shadow-2xs"
              title="Auditoría Multirol (26 Stakeholders)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Auditoría (26)</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playSoftPop();
                onAbrirAuditoria();
              }}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-xl font-semibold transition-all text-xs active:scale-95 cursor-pointer shadow-2xs"
              title="Bitácora de Trazabilidad OCDS"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">Bitácora OCDS</span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1 rounded">
                {eventosAuditoria.length}
              </span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
