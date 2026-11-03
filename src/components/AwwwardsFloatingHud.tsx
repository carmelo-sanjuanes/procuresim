// Barra de Control Flotante Estilo Awwwards (Island HUD) - ProcureSim v2.0
// Proporciona interacción háptica, control de sonido, navegación de etapas y telemetría en tiempo real.
import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Command,
  Maximize2,
  Minimize2,
  Layers,
  Activity,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Compass
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import { soundEffects } from '../utils/soundEffects';
import { launchConfetti } from '../utils/confetti';

interface AwwwardsFloatingHudProps {
  onAbrirCommandPalette: () => void;
  onAbrirBienvenida: () => void;
}

export const AwwwardsFloatingHud: React.FC<AwwwardsFloatingHudProps> = ({
  onAbrirCommandPalette,
  onAbrirBienvenida
}) => {
  const {
    etapaWorkflow,
    setEtapaWorkflow,
    densidadVisual,
    setDensidadVisual,
    misionActiva,
    modoOperativo,
    vistaActual
  } = useProcurementStore();

  const [soundMuted, setSoundMuted] = useState(soundEffects.isMuted());
  const [hudColapsado, setHudColapsado] = useState(false);
  const [latency, setLatency] = useState(24);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Latencia simulada en tiempo real para emular telemetría con servidores de SECOP II
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(21 + Math.random() * 14));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nuevoMuted = soundEffects.toggleMute();
    setSoundMuted(nuevoMuted);
  };

  const handleStageClick = (etapa: number) => {
    soundEffects.playStepChange();
    setEtapaWorkflow(etapa);
  };

  const handleCelebrar = () => {
    soundEffects.playFanfare();
    launchConfetti();
  };

  const handleToggleFullscreen = () => {
    soundEffects.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const etapasInfo = [
    { num: 1, label: 'Planeación & CDP' },
    { num: 2, label: 'Observaciones & Adendas' },
    { num: 3, label: 'Ofertas & RUP' },
    { num: 4, label: 'Evaluación & Desempate BIC' },
    { num: 5, label: 'Contrato & Liquidación' }
  ];

  return (
    <aside aria-label="Consola de telemetría y navegación rápida" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none animate-fadeIn">
      {/* Botón flotante para desplegar si está minimizado */}
      {hudColapsado ? (
        <button
          onClick={() => {
            soundEffects.playSoftPop();
            setHudColapsado(false);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xl border border-white/15 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Desplegar barra de control inteligente"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-300">ProcureSim HUD</span>
          <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-2xl bg-slate-950/85 text-white backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/5 transition-all">
          {/* 1. Telemetría SECOP II */}
          <div className="hidden xl:flex items-center gap-2 pr-2.5 border-r border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-[10px] font-mono leading-tight">
              <div className="text-slate-400 flex items-center gap-1">
                <span>SECOP II</span>
                <span className="text-emerald-400 font-bold">{latency}ms</span>
              </div>
              <div className="text-[9px] text-slate-500 font-sans">OCDS 1.1.5 Compliance</div>
            </div>
          </div>

          {/* 2. Indicador Elegante de Etapa Activa (Limpio y Contextual) */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs shadow-inner">
            {modoOperativo === 'PRODUCCION_REAL' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="text-cyan-400 font-mono text-[10px] font-bold uppercase hidden sm:inline">Producción:</span>
                <span className="font-extrabold text-white text-[11px] truncate max-w-[140px] sm:max-w-[210px]">
                  {vistaActual === 'LINEA_TIEMPO_AUTOMATICA' ? '⚡ Cronograma Legal' : 'Suite Real Ley 80'}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">Paso {etapaWorkflow}/5:</span>
                <span className="font-extrabold text-white text-[11px] truncate max-w-[120px] sm:max-w-[190px]">
                  {etapasInfo.find((e) => e.num === etapaWorkflow)?.label}
                </span>
              </>
            )}
          </div>

          {/* 3. Selector de Misión / Rol Activo */}
          <button
            onClick={() => {
              soundEffects.playSoftPop();
              onAbrirBienvenida();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all cursor-pointer"
            title="Cambiar Misión o Rol de Entrenamiento (Entidad, Oferente o Auditor)"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="hidden sm:inline text-[11px]">
              {misionActiva === 'ENTIDAD' && '🏛️ Entidad'}
              {misionActiva === 'OFERENTE' && '💼 Oferente'}
              {misionActiva === 'AUDITOR' && '⚖️ Auditor'}
              {misionActiva === 'LIBRE' && '🚀 Libre'}
            </span>
          </button>

          {/* 4. Switch de Densidad Visual */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setDensidadVisual(densidadVisual === 'ENFOCADA_SIMPLE' ? 'EXPERTO_AVANZADA' : 'ENFOCADA_SIMPLE');
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={densidadVisual === 'ENFOCADA_SIMPLE' ? 'Modo Enfoque activo: clic para Modo Experto' : 'Modo Experto activo: clic para Modo Enfoque'}
          >
            <Layers className="w-3.5 h-3.5 text-slate-300" />
          </button>

          {/* 5. Interruptor de Sonido Háptico */}
          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              soundMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20'
            }`}
            title={soundMuted ? 'Activar efectos de sonido inmersivos' : 'Silenciar efectos de sonido'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* 6. Botón de Celebración & Confeti */}
          <button
            onClick={handleCelebrar}
            className="p-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-lime-500/20 hover:from-amber-500/30 hover:to-lime-500/30 border border-amber-400/40 text-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Lanzar confeti triunfal"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
          </button>

          {/* 7. Pantalla Completa Zen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer hidden md:flex"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Modo Zen / Pantalla Completa'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* 8. Botón para minimizar el HUD */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setHudColapsado(true);
            }}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer ml-1"
            title="Minimizar barra flotante"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
