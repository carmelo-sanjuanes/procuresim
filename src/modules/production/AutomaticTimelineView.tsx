// Vista de Línea de Tiempo Automática y Navegación GPS - ProcureSim v2.0 (Edición Awwwards)
// Calcula y renderiza cronogramas legales vinculantes con días hábiles colombianos y navegación contextual directa.
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Scale,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Download,
  RotateCcw,
  ShieldAlert,
  ChevronRight,
  Sliders,
  ExternalLink,
  Award
} from 'lucide-react';
import {
  TimelineGeneratorEngine,
  type ModalidadContratacionLegal,
  type CronogramaGenerado,
  type HitoCronogramaLegal
} from '../../core/engines/TimelineGeneratorEngine';
import { useProcurementStore } from '../../store/useProcurementStore';
import { soundEffects } from '../../utils/soundEffects';

export const AutomaticTimelineView: React.FC = () => {
  const { setVista, registrarAuditoria } = useProcurementStore();

  const [modalidad, setModalidad] = useState<ModalidadContratacionLegal>('LICITACION_PUBLICA');
  const [presupuestoCOP, setPresupuestoCOP] = useState(450000000);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [hitoSeleccionado, setHitoSeleccionado] = useState<HitoCronogramaLegal | null>(null);

  const [cronograma, setCronograma] = useState<CronogramaGenerado>(() =>
    TimelineGeneratorEngine.generarCronogramaAutomatico('LICITACION_PUBLICA', 450000000, new Date().toISOString().split('T')[0])
  );

  const handleRecalcular = () => {
    soundEffects.playStepChange();
    const nuevo = TimelineGeneratorEngine.generarCronogramaAutomatico(modalidad, presupuestoCOP, fechaInicio);
    setCronograma(nuevo);
    setHitoSeleccionado(nuevo.hitos[0]);
    registrarAuditoria(
      'CRONOGRAMA LEGAL',
      `Generación de Línea de Tiempo para ${nuevo.modalidadNombre}`,
      `Total: ${nuevo.totalDiasHabiles} días hábiles calculados con festivos colombianos.`,
      'ENTIDAD'
    );
  };

  const handleIrAHerramienta = (hito: HitoCronogramaLegal) => {
    soundEffects.playClick();
    setVista(hito.herramientaAsociada);
  };

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fadeIn relative">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 ambient-glow-indigo pointer-events-none rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 right-10 w-96 h-96 ambient-glow-cyan pointer-events-none rounded-full blur-3xl opacity-25" />

      <div className="max-w-6xl mx-auto space-y-6 relative">
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30 font-mono text-[10px] font-bold tracking-wider">
                ⚡ MOTOR CRONOGRAMA AUTOMÁTICO
              </span>
              <span className="text-xs text-slate-400 font-mono">Dcto. 1082 / Ley 1882 / Ley 1150</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Línea de Tiempo Legal & Navegador GPS de Herramientas
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
              Genera los plazos procesales exactos en días hábiles (descontando festivos colombianos) y abre directamente la herramienta precisa para cada momento del expediente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRecalcular}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalcular Línea de Tiempo</span>
            </button>
          </div>
        </div>

        {/* Panel de Configuración del Proceso */}
        <div className="glass-card-dark rounded-3xl p-5 border border-slate-800/80 shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              1. Modalidad de Selección Legal
            </label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value as ModalidadContratacionLegal)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="LICITACION_PUBLICA">Licitación Pública (Mayor Cuantía)</option>
              <option value="SELECCION_ABREVIADA_MENOR_CUANTIA">Selección Abreviada Menor Cuantía (SAMC)</option>
              <option value="MINIMA_CUANTIA">Contratación de Mínima Cuantía</option>
              <option value="CONCURSO_MERITOS_ABIERTO">Concurso de Méritos (Consultoría)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              2. Presupuesto Oficial ($ COP)
            </label>
            <input
              type="number"
              value={presupuestoCOP}
              onChange={(e) => setPresupuestoCOP(Number(e.target.value))}
              step={10000000}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              3. Fecha de Publicación Inicial
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Bento Grid de Resumen Estadístico */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bento-card p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-md">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Duración Precontractual</div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-1">
              {cronograma.hitos.find((h) => h.id.includes('05') || h.titulo.includes('Cierre'))?.diasHabilesDesdeInicio || 20} <span className="text-xs text-slate-400 font-sans font-normal">días hábiles</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Hasta el cierre de ofertas</div>
          </div>

          <div className="bento-card p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-md">
            <div className="text-[10px] font-mono text-amber-400 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Límite Fatal de Adendas
            </div>
            <div className="text-sm sm:text-base font-black text-white font-mono mt-1">
              {cronograma.hitos.find((h) => h.id.includes('04') || h.titulo.includes('Adendas'))?.fechaCalculada}
            </div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">Mínimo 3 días antes del cierre</div>
          </div>

          <div className="bento-card p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-md">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Cierre & Apertura</div>
            <div className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-1">
              {cronograma.fechaCierreEstimada}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">10:00 AM Bloqueo SECOP II</div>
          </div>

          <div className="bento-card p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-md">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Plazo Máx. Liquidación</div>
            <div className="text-sm sm:text-base font-black text-purple-400 font-mono mt-1">
              {cronograma.fechaLiquidacionEstimada}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">4 meses bilateral (Art. 11)</div>
          </div>
        </div>

        {/* Línea de Tiempo Interactiva (Subway Track) */}
        <div className="glass-card-dark rounded-3xl p-6 sm:p-7 border border-slate-800/80 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight font-display">
                Mapa Procesal del Expediente ({cronograma.hitos.length} Hitos Obligatorios)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Haz clic en cualquier hito para abrir su herramienta ➔
            </span>
          </div>

          {/* Lista de Hitos con Conector Vertical */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-purple-500">
            {cronograma.hitos.map((hito, idx) => {
              const esCritico = hito.esCriticoLegal;
              const esCompletado = hito.estado === 'COMPLETADO';
              const esEnCurso = hito.estado === 'EN_CURSO';

              return (
                <div
                  key={hito.id}
                  className="relative group transition-all"
                >
                  {/* Nodo / Conector */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 transition-all ${
                      esCritico
                        ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-lg shadow-amber-500/40 animate-pulse'
                        : esCompletado
                        ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                        : esEnCurso
                        ? 'bg-cyan-500 border-cyan-300 text-slate-950 ring-4 ring-cyan-500/20'
                        : 'bg-slate-900 border-slate-700 text-slate-400 group-hover:border-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Tarjeta del Hito */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all shadow-md space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                            Fase: {hito.fase}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 font-bold border border-blue-800">
                            Día hábil {hito.diasHabilesDesdeInicio} • {hito.fechaCalculada}
                          </span>
                          {esCritico && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono tracking-tight flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              PLAZO FATAL
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                          {hito.titulo}
                        </h3>
                      </div>

                      {/* Botón GPS: Abre directamente la herramienta vinculada */}
                      <button
                        onClick={() => handleIrAHerramienta(hito)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-cyan-300 hover:text-white border border-slate-700 hover:border-blue-500 font-bold text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm active:scale-95 group/btn shrink-0"
                        title={`Ir al módulo: ${hito.herramientaNombre}`}
                      >
                        <span>Abrir: {hito.herramientaNombre}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {hito.descripcion}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        ⚖️ Base Legal: <strong className="text-slate-300">{hito.baseLegal}</strong>
                      </span>
                      {hito.alertaLegal && (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {hito.alertaLegal}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
