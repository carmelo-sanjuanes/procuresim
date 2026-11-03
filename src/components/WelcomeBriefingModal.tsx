// Pantalla 1: El Lienzo en Blanco
// "Hola. ¿Quieres aprender o quieres producir?"
import React from 'react';
import {
  Building2,
  GraduationCap
} from 'lucide-react';
import { ProcureSimLogoSymbol } from './ProcureSimLogoSymbol';
import { useProcurementStore } from '../store/useProcurementStore';
import { soundEffects } from '../utils/soundEffects';
import { launchConfetti } from '../utils/confetti';

interface WelcomeBriefingModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const WelcomeBriefingModal: React.FC<WelcomeBriefingModalProps> = ({
  abierto,
  onCerrar
}) => {
  const {
    iniciarRutaMision,
    setModoOperativo,
    setVista,
    setDensidadVisual,
    setEtapaWorkflow
  } = useProcurementStore();

  if (!abierto) return null;

  const handleElegirEntrenamiento = () => {
    soundEffects.playSuccess();
    launchConfetti({ count: 35 });
    setModoOperativo('ENTRENAMIENTO');
    setDensidadVisual('ENFOCADA_SIMPLE');
    setVista('FLUJOGRAMA_PASO_A_PASO');
    setEtapaWorkflow(1);
    onCerrar();
  };

  const handleElegirProduccion = () => {
    soundEffects.playStepChange();
    setModoOperativo('PRODUCCION_REAL');
    setDensidadVisual('ENFOCADA_SIMPLE');
    setVista('FLUJOGRAMA_PASO_A_PASO');
    setEtapaWorkflow(1);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-white text-slate-950 flex flex-col justify-between p-4 sm:p-8 overflow-y-auto select-none animate-fadeIn">
      {/* 1. Cabecera Elegante en los Extremos: ProcureSim (Izq) y Sanjuanés Soluciones (Der) */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 shrink-0 pb-4">
        <div className="flex items-center gap-2.5">
          <ProcureSimLogoSymbol size="sm" />
          <span className="font-black text-lg tracking-tight text-slate-900 font-display">
            PROCURE<span className="text-emerald-600">SIM</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCerrar}
            className="text-xs text-slate-500 hover:text-slate-900 font-bold px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white cursor-pointer transition-colors"
          >
            Entrar directamente →
          </button>
          <img
            src="/sanjuanes/badge_empowered_sanjuanes.png"
            alt="Empowered by Sanjuanés Soluciones"
            className="h-8 w-auto object-contain drop-shadow-xs rounded-xl hidden sm:block"
          />
        </div>
      </header>

      {/* 2. Centro Armónico: Saludo y las dos puertas (100% visibles en cualquier pantalla) */}
      <main className="w-full max-w-xl mx-auto flex flex-col items-center text-center z-10 space-y-5 my-auto py-2">
        <div className="space-y-1.5 flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight font-display leading-none">
            Hola.
          </h1>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight font-display leading-snug">
            ¿Quieres aprender o quieres producir?
          </h2>
        </div>

        {/* Las dos puertas: proporcionadas y 100% visibles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-1">
          {/* APRENDER */}
          <button
            onClick={handleElegirEntrenamiento}
            className="group p-5 sm:p-6 rounded-3xl bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-slate-900 transition-all duration-200 flex flex-col items-center text-center space-y-2.5 shadow-xs hover:shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="p-3 rounded-2xl bg-white text-emerald-600 border border-slate-200 group-hover:scale-110 transition-transform shadow-2xs">
              <GraduationCap className="w-7 h-7" />
            </div>

            <span className="text-lg sm:text-xl font-black text-slate-900 font-display">
              Aprender
            </span>
            <span className="text-xs text-slate-500">
              Modo guiado con retroalimentación y tutoría legal.
            </span>
          </button>

          {/* PRODUCIR */}
          <button
            onClick={handleElegirProduccion}
            className="group p-5 sm:p-6 rounded-3xl bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-slate-900 transition-all duration-200 flex flex-col items-center text-center space-y-2.5 shadow-xs hover:shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="p-3 rounded-2xl bg-white text-sky-600 border border-slate-200 group-hover:scale-110 transition-transform shadow-2xs">
              <Building2 className="w-7 h-7" />
            </div>

            <span className="text-lg sm:text-xl font-black text-slate-900 font-display">
              Producir
            </span>
            <span className="text-xs text-slate-500">
              Estructura tu proceso real y genera tus pliegos en Word.
            </span>
          </button>
        </div>
      </main>

      {/* 3. Pie limpio y sereno */}
      <footer className="w-full max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-400 z-10 shrink-0 pt-4">
        <span className="font-mono text-[11px] text-slate-400">
          Contratación Pública Colombiana
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          ProcureSim
        </span>
      </footer>
    </div>
  );
};
