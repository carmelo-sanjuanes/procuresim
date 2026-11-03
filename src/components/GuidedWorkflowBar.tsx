// Barra de Flujo Guiado y Línea de Tiempo Contractual (Stepper) - ProcureSim v2.0 (Edición Awwwards)
// Diseñada con iluminación sutil, barra conectora de progreso y micro-interacciones táctiles
import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Building2,
  Scale,
  FileCheck2,
  GraduationCap,
  BookOpen,
  Trophy,
  AlertTriangle,
  X,
  Calendar,
  FileText
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';
import { soundEffects } from '../utils/soundEffects';

interface GuidedWorkflowBarProps {
  onAbrirMisiones: () => void;
  onAbrirMultirol?: () => void;
}

export const GuidedWorkflowBar: React.FC<GuidedWorkflowBarProps> = ({ onAbrirMisiones, onAbrirMultirol }) => {
  const {
    modoOperativo,
    vistaActual,
    misionActiva,
    etapaWorkflow,
    guiaAsistenteExpandida,
    setModoOperativo,
    setEtapaWorkflow,
    avanzarEtapaWorkflow,
    retrocederEtapaWorkflow,
    toggleGuiaAsistente,
    setVista
  } = useProcurementStore();

  const [modalGlosario, setModalGlosario] = useState(false);

  const etapas = [
    {
      numero: 1,
      titulo: '1. Planeación & CDP',
      subtitulo: 'Estudios Previos y Presupuesto',
      icono: Building2,
      vista: 'INGENIERIA_PRECONTRACTUAL'
    },
    {
      numero: 2,
      titulo: '2. Observaciones & Adendas',
      subtitulo: 'Aclaraciones y Pliego Definitivo',
      icono: Sparkles,
      vista: 'INGENIERIA_PRECONTRACTUAL'
    },
    {
      numero: 3,
      titulo: '3. Ofertas & RUP',
      subtitulo: 'Capacidad Financiera y Oferentes',
      icono: Briefcase,
      vista: 'VALIDADOR_RUP'
    },
    {
      numero: 4,
      titulo: '4. Evaluación & Desempate',
      subtitulo: 'Precios Bajos y Ley 2069 (BIC)',
      icono: Scale,
      vista: 'HERRAMIENTAS_ECONOMICAS_AVANZADAS'
    },
    {
      numero: 5,
      titulo: '5. Contrato & Liquidación',
      subtitulo: 'Pólizas, Supervisión y Cierre',
      icono: FileCheck2,
      vista: 'LIQUIDACION_CONTRATOS'
    }
  ];

  // Contenido formativo enriquecido para el MODO ENTRENAMIENTO
  const obtenerContenidoFormativo = () => {
    switch (etapaWorkflow) {
      case 1:
        return {
          titulo: 'Etapa 1: Planeación, Estudios Previos & Presupuesto Oficial',
          rolLabel: misionActiva === 'ENTIDAD' ? 'Estructurador Público' : 'Licitante en Fase Previa',
          mision: 'Estructurar una licitación de $450.000.000 COP con CDP garantizado, clasificación UNSPSC rigurosa y sin pliegos restrictivos.',
          pildoraPedagogica: 'El 70% de las demandas de nulidad ante el Consejo de Estado nacen aquí por falta de estudios de mercado o por exigir requisitos no contemplados taxativamente en el RUP.',
          retoEntrenamiento: 'Revisa los 3 ítems del proceso (computadores, portátiles y redes). Confirma que el CDP No. 2025-00189 ampare el 100% del presupuesto.',
          errorComun: 'Exigir que el proponente tenga sede física en el municipio sin justificación técnica (vulnera el principio de libre concurrencia).',
          baseLegal: 'Art. 2.2.1.1.2.1.1 Decreto 1082/2015 y Ley 80/1993.'
        };
      case 2:
        return {
          titulo: 'Etapa 2: Consulta Pública, Observaciones & Límite de Adendas',
          rolLabel: misionActiva === 'OFERENTE' ? 'Estratega de Licitaciones' : 'Asesor Jurídico de la Entidad',
          mision: 'Identificar requisitos "pliego sastre", radicar observaciones jurídicas fundadas y vigilar el límite estricto de adendas.',
          pildoraPedagogica: 'La Ley 1882 de 2018 prohibió modificar los pliegos a menos de 3 días hábiles del cierre de ofertas para evitar que las entidades beneficien a proponentes afines a última hora.',
          retoEntrenamiento: 'Consulta las observaciones radicadas por SANJUANÉS SOLUCIONES o INGELECGROUP BIC solicitando ampliar el plazo y ajustar la experiencia.',
          errorComun: 'Responder observaciones con evasivas tipo "estése a lo dispuesto en el pliego" en lugar de motivación técnica y jurídica.',
          baseLegal: 'Art. 4 de la Ley 1882 de 2018 y Decreto 1082/2015.'
        };
      case 3:
        return {
          titulo: 'Etapa 3: Presentación de Ofertas, Capacidad Financiera & RUP',
          rolLabel: misionActiva === 'OFERENTE' ? 'Gerente Financiero Proponente' : 'Comité Verificador',
          mision: 'Auditar que las empresas cumplan los 3 indicadores de oro del RUP: Liquidez ≥ 1.50, Endeudamiento ≤ 70% y Cobertura de Intereses ≥ 2.50.',
          pildoraPedagogica: 'Los requisitos habilitantes no dan puntaje, pero su incumplimiento descarta de plano la propuesta. No son subsanables los requisitos que pretendan mejorar o complementar la oferta.',
          retoEntrenamiento: 'Compara los balances de SANJUANÉS SOLUCIONES (Liquidez 2.67) y de INGELECGROUP BIC (Liquidez 2.15). Ambas son aptas para continuar.',
          errorComun: 'Presentar balances sin firma del Revisor Fiscal o con fecha de corte distinta a la registrada en Cámara de Comercio.',
          baseLegal: 'Circular 001 de Colombia Compra Eficiente y Registro Único de Proponentes (RUP).'
        };
      case 4:
        return {
          titulo: 'Etapa 4: Calificación de Ofertas, Precios Temerarios & Desempate Ley 2069',
          rolLabel: 'Comité de Evaluación & Adjudicación en Audiencia',
          mision: 'Detectar ofertas temerarias (-27% de la media) y resolver el empate técnico de 100 puntos aplicando la Ley de Emprendimiento.',
          pildoraPedagogica: 'La Ley 2069 de 2020 y el Decreto 1860 de 2021 otorgaron preferencia obligatoria de desempate a Sociedades BIC y Mipymes colombianas para dinamizar la economía solidaria.',
          retoEntrenamiento: 'Ejecuta el desempate entre SANJUANÉS e INGELECGROUP BIC. Observa cómo la condición BIC otorga la adjudicación legal.',
          errorComun: 'Desempatar mediante sorteo o balotas cuando existe un oferente acreditado con criterio legal preferente (Ley 2069).',
          baseLegal: 'Art. 35 Ley 2069/2020, Decreto 1860/2021 y Pliegos Tipo CCE.'
        };
      case 5:
        return {
          titulo: 'Etapa 5: Perfeccionamiento del Contrato, Garantías & Cierre',
          rolLabel: 'Supervisor Contractual / Ordenador del Gasto',
          mision: 'Exigir las 4 pólizas de cumplimiento, registrar las cuentas de cobro y formalizar el acta de liquidación bilateral sin saldos pendientes.',
          pildoraPedagogica: 'Todo contrato estatal requiere registro presupuestal (RP) y aprobación de garantías antes de iniciar ejecución. La omisión genera responsabilidad fiscal y disciplinaria.',
          retoEntrenamiento: 'Verifica la expedición de la Póliza No. SURA-98124 y firma el acta de liquidación final del contrato por $450.000.000 COP.',
          errorComun: 'Permitir el inicio de obra o entrega de bienes con solo el acta de adjudicación sin haber legalizado la póliza ni el acta de inicio.',
          baseLegal: 'Art. 41 de la Ley 80 de 1993 y Art. 11 de la Ley 1150 de 2007.'
        };
      default:
        return {
          titulo: 'Ciclo Contractual Colombiano',
          rolLabel: 'Operador de Contratación',
          mision: 'Navegar las 5 etapas del ciclo contractual estatal.',
          pildoraPedagogica: 'Alineado con el Estatuto General de Contratación de la Administración Pública.',
          retoEntrenamiento: 'Completar la simulación.',
          errorComun: 'Desconocer las normas imperativas.',
          baseLegal: 'Leyes 80/93, 1150/07, 1882/18 y 2069/20.'
        };
    }
  };

  const contenido = obtenerContenidoFormativo();

  const terminosGlosario = [
    { sigla: 'RUP', nombre: 'Registro Único de Proponentes', desc: 'Registro que llevan las Cámaras de Comercio donde consta la capacidad jurídica, financiera, organizacional y experiencia de los licitantes.' },
    { sigla: 'BIC', nombre: 'Sociedad de Beneficio e Interés Colectivo', desc: 'Figura de la Ley 1901 de 2018 que acredita impacto social y ambiental positivo, con preferencia legal en desempates (Dcto. 1860 de 2021).' },
    { sigla: 'UNSPSC', nombre: 'Clasificador de Bienes y Servicios', desc: 'Código estándar internacional de 8 dígitos obligatorio en Colombia para identificar qué compra el Estado.' },
    { sigla: 'CDP', nombre: 'Certificado de Disponibilidad Presupuestal', desc: 'Documento expedido por el área de presupuesto que garantiza la existencia de recursos para contratar antes de abrir el proceso.' },
    { sigla: 'AIU', nombre: 'Administración, Imprevistos y Utilidad', desc: 'Estructura de costos indirectos en obras y servicios. En Colombia, el IVA del 19% se liquida únicamente sobre la Utilidad (Art. 462-1 E.T.).' },
    { sigla: 'SMMLV', nombre: 'Salarios Mínimos Mensuales Legales Vigentes', desc: 'Unidad de medida obligatoria en Colombia para clasificar las cuantías de menor y mínima cuantía y la experiencia en el RUP.' },
    { sigla: 'Pliego Sastre', nombre: 'Pliego de Condiciones Direccionado', desc: 'Práctica ilegal consistente en diseñar requisitos tan específicos que solo un oferente predeterminado pueda cumplirlos.' },
    { sigla: 'OCDS', nombre: 'Open Contracting Data Standard', desc: 'Estándar global abierto para publicar datos de contratación pública en formato interoperable JSON y CSV.' }
  ];

  return (
    <div className="bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/80 text-white shadow-lg shrink-0 select-none transition-all">
      {modoOperativo === 'PRODUCCION_REAL' ? (
        /* 1. Barra Ejecutiva del MODO PRODUCCIÓN REAL (Obsidian Dark Glass) */
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Lado izquierdo: Indicador de Producción y Conmutador a Entrenamiento */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/95 text-white text-xs font-black shadow-md border border-slate-700/80">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>🏢 MODO PRODUCCIÓN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </div>

            <button
              onClick={() => {
                soundEffects.playSoftPop();
                setModoOperativo('ENTRENAMIENTO');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Cambiar al Modo Sandbox de Entrenamiento con casos guiados"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Ir a</span>
              <span>🎓 Entrenamiento</span>
            </button>
          </div>

          {/* Centro: Accesos GPS directos a los motores de Producción (Labels concisos, sin cortes) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => {
                soundEffects.playStepChange();
                setVista('LINEA_TIEMPO_AUTOMATICA');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer active:scale-95 ${
                vistaActual === 'LINEA_TIEMPO_AUTOMATICA'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
              title="Calcula cronogramas legales con días hábiles colombianos"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>⚡ Cronograma Legal</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playStepChange();
                setVista('INGENIERIA_PRECONTRACTUAL');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer active:scale-95 ${
                vistaActual === 'INGENIERIA_PRECONTRACTUAL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Estudios & CDP</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playStepChange();
                setVista('VALIDADOR_RUP');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer active:scale-95 ${
                vistaActual === 'VALIDADOR_RUP'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Balances RUP</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playStepChange();
                setVista('HERRAMIENTAS_ECONOMICAS_AVANZADAS');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer active:scale-95 ${
                vistaActual === 'HERRAMIENTAS_ECONOMICAS_AVANZADAS'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Desempate BIC</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playStepChange();
                setVista('GENERADOR_DOCUMENTOS');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer active:scale-95 ${
                vistaActual === 'GENERADOR_DOCUMENTOS'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Pliegos .docx</span>
            </button>
          </div>

          {/* Lado derecho: Acciones de Auditoría y Glosario */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onAbrirMultirol && (
              <button
                onClick={() => {
                  soundEffects.playSoftPop();
                  onAbrirMultirol();
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-700/60 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Auditoría Multirol con los 26 interesados del sistema"
              >
                <Scale className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Auditoría (26)</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playSoftPop();
                setModalGlosario(true);
              }}
              className="p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Glosario legal"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Glosario</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. Barra Pedagógica del MODO ENTRENAMIENTO (Obsidian Dark Glass) */
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Selector de Modo y Misión */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Badge del Modo Operativo */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-extrabold shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-emerald-400 font-semibold">Modo:</span>
              <span className="text-white font-black">🎓 Entrenamiento</span>
            </div>

            {/* Botón de Selección de Rol / Misión */}
            <button
              onClick={() => {
                soundEffects.playSoftPop();
                onAbrirMisiones();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-950/60 text-blue-200 hover:bg-blue-900/80 border border-blue-700/60 font-bold text-xs transition-all shadow-sm group cursor-pointer active:scale-95"
              title="Haz clic aquí para cambiar tu ROL o MISIÓN"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span className="text-slate-400 font-semibold hidden sm:inline">Rol:</span>
              <span className="font-extrabold text-white underline decoration-blue-400">
                {misionActiva === 'ENTIDAD' && '🏛️ Entidad'}
                {misionActiva === 'OFERENTE' && '💼 Oferente'}
                {misionActiva === 'AUDITOR' && '⚖️ Auditor'}
                {misionActiva === 'LIBRE' && '🚀 Libre'}
              </span>
              <span className="text-[10px] font-black bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ml-0.5">
                Cambiar
                <ChevronDown className="w-3 h-3 text-blue-300" />
              </span>
            </button>

            {/* Botón para alternar la Guía / Tutor Didáctico */}
            <button
              onClick={() => {
                soundEffects.playClick();
                toggleGuiaAsistente();
              }}
              className={`p-1 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                guiaAsistenteExpandida
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-600/60 shadow-sm font-extrabold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title={guiaAsistenteExpandida ? 'Plegar tutor pedagógico' : 'Desplegar tutor didáctico'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline font-bold">Tutor Didáctico</span>
              {guiaAsistenteExpandida ? (
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Botón Glosario Rápido */}
            <button
              onClick={() => {
                soundEffects.playSoftPop();
                setModalGlosario(true);
              }}
              className="p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Abrir diccionario de términos clave en contratación pública"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Glosario</span>
            </button>
          </div>

          {/* Pasos Secuenciales del Ciclo de Vida (Stepper Awwwards Dark Glass) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {etapas.map((etapa) => {
              const Icon = etapa.icono;
              const esActiva = etapaWorkflow === etapa.numero;
              const esCompletada = etapaWorkflow > etapa.numero;

              return (
                <button
                  key={etapa.numero}
                  onClick={() => {
                    soundEffects.playStepChange();
                    setEtapaWorkflow(etapa.numero);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer active:scale-95 ${
                    esActiva
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                      : esCompletada
                      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
                      : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={`Paso ${etapa.numero}: ${etapa.subtitulo}`}
                >
                  {esCompletada ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${esActiva ? 'text-white' : 'text-slate-400'}`} />
                  )}
                  <span>{etapa.titulo}</span>
                </button>
              );
            })}
          </div>

          {/* Botones de Navegación Paso a Paso */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                soundEffects.playClick();
                retrocederEtapaWorkflow();
              }}
              disabled={etapaWorkflow <= 1}
              className="px-2.5 py-1 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Regresar a la etapa anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playStepChange();
                avanzarEtapaWorkflow();
              }}
              disabled={etapaWorkflow >= 5}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              title="Avanzar a la siguiente etapa"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Tarjeta Pedagógica del Tutor Didáctico (Compacta, Awwwards Bento Strip) */}
      {guiaAsistenteExpandida && (
        <div className="bg-gradient-to-r from-amber-50/90 via-slate-50 to-blue-50/90 border-t border-amber-200/80 px-3 sm:px-4 py-2 text-xs animate-fadeIn">
          <div className="max-w-7xl mx-auto space-y-1.5">
            {/* Cabecera del Tutor con botón de plegar directo */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-amber-200/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[9px] font-mono shadow-2xs">
                  TUTOR PASO {etapaWorkflow}/5
                </span>
                <span className="font-extrabold text-slate-900 text-xs tracking-tight font-display">
                  {contenido.titulo}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-blue-100/90 text-blue-800 border border-blue-200">
                  Rol: {contenido.rolLabel}
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-2 py-0.2 rounded border border-slate-200">
                  ⚖️ {contenido.baseLegal}
                </span>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  toggleGuiaAsistente();
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                title="Plegar tutor para ver toda la pantalla"
              >
                <span>Plegar</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fila Horizontal Compacta: Misión, Reto y Error Común */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-0.5">
              {/* Columna 1: Tu Misión */}
              <div className="p-2 rounded-xl bg-white/90 border border-blue-100 shadow-2xs space-y-0.5">
                <div className="flex items-center gap-1 text-blue-900 font-extrabold text-[10px] uppercase tracking-wider">
                  <Compass className="w-3 h-3 text-blue-600" />
                  <span>Tu Objetivo</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-snug line-clamp-2">
                  {contenido.mision}
                </p>
              </div>

              {/* Columna 2: Reto Didáctico Práctico */}
              <div className="p-2 rounded-xl bg-emerald-50/90 border border-emerald-200/90 shadow-2xs space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-950 font-extrabold text-[10px] uppercase tracking-wider">
                  <Trophy className="w-3 h-3 text-emerald-600" />
                  <span>Reto Práctico</span>
                </div>
                <p className="text-emerald-950 text-[11px] leading-snug font-medium line-clamp-2">
                  {contenido.retoEntrenamiento}
                </p>
              </div>

              {/* Columna 3: Píldora Pedagógica / Error Común */}
              <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200/90 shadow-2xs space-y-0.5">
                <div className="flex items-center gap-1 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Evitar Error</span>
                </div>
                <p className="text-amber-950 text-[11px] leading-snug line-clamp-2">
                  {contenido.errorComun}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal de Glosario Rápido Interactivo */}
      {modalGlosario && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-800 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg tracking-tight font-display">
                    Glosario de Contratación Pública Colombiana
                  </h3>
                  <p className="text-xs text-slate-500">
                    Conceptos clave indispensables para el entrenamiento en ProcureSim
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setModalGlosario(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
              {terminosGlosario.map((t, idx) => (
                <div key={idx} className="pt-3 first:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                      {t.sigla}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {t.nombre}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-1 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setModalGlosario(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
              >
                Entendido, volver al simulador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
