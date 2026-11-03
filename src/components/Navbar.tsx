// Barra de Navegación Principal y Selector de Plataformas
import React, { useState } from 'react';
import {
  Building2,
  FileText,
  TrendingUp,
  Briefcase,
  Layers,
  History,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Users,
  Scale,
  Gavel,
  Calculator,
  Compass,
  Brain,
  Download,
  Upload,
  Lightbulb
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import type { PlataformaVista } from '../core/domain/types';

interface NavbarProps {
  onAbrirAuditoria: () => void;
  onAbrirMultirol: () => void;
  onAbrirMentorCCE: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAbrirAuditoria,
  onAbrirMultirol,
  onAbrirMentorCCE
}) => {
  const {
    vistaActual,
    setVista,
    reiniciarDatosDemo,
    eventosAuditoria,
    exportarEstadoJSON,
    importarEstadoJSON
  } = useProcurementStore();
  const [modoProduccion, setModoProduccion] = useState(false);
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

  const plataformasPublicas: { id: PlataformaVista; label: string; badge: string; icon: React.ReactNode }[] = [
    {
      id: 'SECOP_II_ENTIDAD',
      label: 'SECOP II (Entidad)',
      badge: 'Transaccional',
      icon: <Building2 className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'SECOP_II_PROVEEDOR',
      label: 'SECOP II (Proveedor)',
      badge: 'Ofertas',
      icon: <Users className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'SECOP_I',
      label: 'SECOP I',
      badge: 'Publicidad',
      icon: <History className="w-4 h-4 text-amber-400" />
    }
  ];

  const plataformasPrivadas: { id: PlataformaVista; label: string; badge: string; icon: React.ReactNode }[] = [
    {
      id: 'SUPLOS',
      label: 'Suplos B2B',
      badge: 'Colombia / LatAm',
      icon: <Layers className="w-4 h-4 text-teal-400" />
    },
    {
      id: 'SAP_ARIBA',
      label: 'SAP Ariba',
      badge: 'Subastas / RFQ',
      icon: <Zap className="w-4 h-4 text-yellow-400" />
    },
    {
      id: 'COUPA',
      label: 'Coupa',
      badge: 'Spend Mgmt',
      icon: <Briefcase className="w-4 h-4 text-orange-400" />
    }
  ];

  const motoresEspecializados: { id: PlataformaVista; label: string; badge: string; icon: React.ReactNode }[] = [
    {
      id: 'ESTUDIO_MERCADO',
      label: 'Cotizaciones & Estudio de Mercado',
      badge: 'Precios CCE',
      icon: <TrendingUp className="w-4 h-4 text-indigo-400" />
    },
    {
      id: 'GENERADOR_DOCUMENTOS',
      label: 'Generador de Documentos Ley 80',
      badge: 'Word .docx',
      icon: <FileText className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'ASISTENTE_PROPUESTAS',
      label: 'Asistente de Propuestas',
      badge: 'Licitante 360°',
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />
    },
    {
      id: 'SIMULADOR_CALIFICACION',
      label: 'Fórmulas & Calificación',
      badge: 'CCE / Indicadores',
      icon: <Calculator className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'INTELIGENCIA_TENDENCIAS',
      label: 'Tendencias & Datos Abiertos',
      badge: 'SECOP / IA',
      icon: <Brain className="w-4 h-4 text-emerald-400" />
    }
  ];

  const modulosJuridicos: { id: PlataformaVista; label: string; badge: string; icon: React.ReactNode }[] = [
    {
      id: 'GESTION_CONTROVERSIAS',
      label: 'Controversias & Líneas de Tiempo',
      badge: 'Art. 86 / CPACA',
      icon: <Scale className="w-4 h-4 text-rose-400" />
    },
    {
      id: 'GESTOR_CONSORCIOS',
      label: 'Consorcios & UT (Aliados)',
      badge: 'Art. 7 / CCE',
      icon: <Users className="w-4 h-4 text-pink-400" />
    }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner de Estado y Modo */}
      <div className="bg-slate-950 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span className="flex items-center font-bold tracking-wider text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
            PROCURESIM v2.0
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            Suite Universal de Entrenamiento y Gestión Contractual
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setModoProduccion(!modoProduccion)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
              modoProduccion
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
            title="Alternar entre modo formativo (datos demo) y arquitectura de producción real"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${modoProduccion ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            {modoProduccion ? 'Modo Producción Conectable' : 'Modo Entrenamiento Activo'}
          </button>

          <button
            onClick={onAbrirMentorCCE}
            className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 hover:text-white px-2.5 py-0.5 rounded border border-amber-500/30 transition-colors font-semibold"
            title="Auditor y Mentor de Cumplimiento Normativo CCE (10 Reglas de Oro)"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Mentor CCE (10)
          </button>

          <button
            onClick={onAbrirMultirol}
            className="flex items-center gap-1.5 bg-indigo-600/30 text-indigo-300 hover:text-white px-2.5 py-0.5 rounded border border-indigo-500/40 transition-colors font-semibold"
            title="Matriz de Auditoría y Verificación para 26 Partes Interesadas (Stakeholders)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Auditoría Multirol (26)
          </button>

          <button
            onClick={onAbrirAuditoria}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors hover:underline"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            Bitácora ({eventosAuditoria.length})
          </button>

          <button
            onClick={handleExportarEscenario}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            title="Exportar archivo JSON con todo el estado actual del caso/taller formativo"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Exportar
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            title="Cargar archivo JSON de caso formativo"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            Importar
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportarArchivo}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={reiniciarDatosDemo}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-300 transition-colors"
            title="Restablecer datos ficticios iniciales"
          >
            <RotateCcw className="w-3 h-3" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* Selector de Plataformas y Módulos */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-slate-900">
        <div className="flex items-center flex-wrap gap-2">
          {/* Grupo 1: Contratación Pública */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Pública:</span>
            {plataformasPublicas.map((p) => {
              const active = vistaActual === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setVista(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Grupo 2: Compras Privadas */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Privada:</span>
            {plataformasPrivadas.map((p) => {
              const active = vistaActual === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setVista(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Grupo 3: Motores Inteligentes */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Motores:</span>
            {motoresEspecializados.map((p) => {
              const active = vistaActual === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setVista(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Grupo 4: Legal & Alianzas */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Legal & Alianzas:</span>
            {modulosJuridicos.map((p) => {
              const active = vistaActual === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setVista(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
