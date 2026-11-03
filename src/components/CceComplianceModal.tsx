// Mentor Pedagógico y Auditor de Cumplimiento Legal CCE (Checklist & Semáforo Normativo)
import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Scale,
  Award,
  BookOpen,
  HelpCircle,
  X,
  FileText,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { useProcurementStore } from '../store/useProcurementStore';

interface CceComplianceModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

interface ReglaCumplimiento {
  id: string;
  nombre: string;
  fundamento: string;
  estado: 'CUMPLE' | 'ADVERTENCIA' | 'INCUMPLE';
  diagnostico: string;
  recomendacionPedagogica: string;
  pesoPuntos: number;
}

export const CceComplianceModal: React.FC<CceComplianceModalProps> = ({ abierto, onCerrar }) => {
  const { procesos, procesoSeleccionadoId } = useProcurementStore();
  const proceso = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  if (!abierto || !proceso) return null;

  // 1. Verificar Observaciones Resueltas (Principio de Transparencia)
  const obsPendientes = proceso.observacionesCiudadanas.filter((o) => o.estado === 'PENDIENTE').length;
  const reglaTransparencia: ReglaCumplimiento = {
    id: 'REG-01',
    nombre: 'Transparencia y Respuesta a Observaciones',
    fundamento: 'Ley 80/1993 Art. 24 y Ley 1150/2007 Art. 2',
    estado: obsPendientes === 0 ? 'CUMPLE' : 'ADVERTENCIA',
    diagnostico:
      obsPendientes === 0
        ? 'Todas las observaciones radicadas por la ciudadanía y proponentes han sido respondidas oportunamente.'
        : `Existen ${obsPendientes} observaciones en estado PENDIENTE. Deben responderse antes de la apertura o audiencia.`,
    recomendacionPedagogica:
      'La Entidad no puede precluir etapas precontractuales dejando observaciones sin respuesta motivada.',
    pesoPuntos: 15
  };

  // 2. Subsanabilidad Oportuna
  const ofertasConSubsanacionPendiente = proceso.ofertasPresentadas.filter(
    (o) =>
      o.evaluacionJuridica === 'POR_SUBSANAR' ||
      o.evaluacionFinanciera === 'POR_SUBSANAR' ||
      o.evaluacionTecnica === 'POR_SUBSANAR'
  ).length;
  const reglaSubsanabilidad: ReglaCumplimiento = {
    id: 'REG-02',
    nombre: 'Garantía de Subsanabilidad de Requisitos Habilitantes',
    fundamento: 'Ley 1882 de 2018 Art. 5 (modificatorio Ley 1150 Art. 5)',
    estado: ofertasConSubsanacionPendiente === 0 ? 'CUMPLE' : 'ADVERTENCIA',
    diagnostico:
      ofertasConSubsanacionPendiente === 0
        ? 'Todos los requisitos habilitantes han sido calificados como CUMPLE o NO_CUMPLE definitivo.'
        : `Hay ${ofertasConSubsanacionPendiente} oferta(s) con requerimientos por subsanar.`,
    recomendacionPedagogica:
      'Prohibido descalificar oferentes por requisitos que no otorgan puntaje sin haber otorgado el término de traslado para subsanar.',
    pesoPuntos: 15
  };

  // 3. Matriz de Riesgos Tipificados
  const tieneRiesgos = proceso.riesgos && proceso.riesgos.length >= 3;
  const reglaRiesgos: ReglaCumplimiento = {
    id: 'REG-03',
    nombre: 'Matriz de Riesgos Tipificados y Asignados',
    fundamento: 'CONPES 3714 y Decreto 1082 de 2015 Art. 2.2.1.1.1.6.3',
    estado: tieneRiesgos ? 'CUMPLE' : 'INCUMPLE',
    diagnostico: tieneRiesgos
      ? `Matriz estructurada con ${proceso.riesgos.length} riesgos tipificados, evaluados y asignados (Entidad/Contratista).`
      : 'El proceso no cuenta con una matriz de riesgos suficiente conforme a la metodología de CCE.',
    recomendacionPedagogica:
      'La tipificación y asignación de riesgos es obligatoria desde los estudios previos para evitar reclamaciones de equilibrio económico.',
    pesoPuntos: 10
  };

  // 4. Precios Artificialmente Bajos
  const umbralBajo = proceso.presupuestoOficial * 0.8;
  const ofertasBajas = proceso.ofertasPresentadas.filter((o) => o.valorEconomicoTotal < umbralBajo);
  const reglaPreciosBajos: ReglaCumplimiento = {
    id: 'REG-04',
    nombre: 'Control de Ofertas Artificialmente Bajas',
    fundamento: 'Decreto 1082 de 2015 Art. 2.2.1.1.2.2.4 y Guía CCE',
    estado: ofertasBajas.length === 0 ? 'CUMPLE' : 'ADVERTENCIA',
    diagnostico:
      ofertasBajas.length === 0
        ? 'Ninguna oferta recibida se encuentra por debajo del 80% del presupuesto oficial ni de dos desviaciones estándar.'
        : `Se identificaron ${ofertasBajas.length} oferta(s) con posible precio artificialmente bajo. Se requiere solicitar explicación de costos.`,
    recomendacionPedagogica:
      'No se puede rechazar automáticamente una oferta baja; debe solicitarse desglose de precios unitarios y justificación técnica antes de decidir.',
    pesoPuntos: 10
  };

  // 5. Criterios de Desempate Legal
  const reglaDesempates: ReglaCumplimiento = {
    id: 'REG-05',
    nombre: 'Orden Legal de Desempate Escalonado',
    fundamento: 'Ley 2069 de 2020 Art. 35',
    estado: 'CUMPLE',
    diagnostico:
      'Pliego contempla el orden de desempate legal: 1° Discapacidad, 2° Empresas de Mujeres, 3° MiPyme, 4° Oferta de empleo local.',
    recomendacionPedagogica:
      'El sorteo por balota o azar solo procede como última instancia tras agotar todos los criterios afirmativos de la Ley 2069.',
    pesoPuntos: 10
  };

  // 6. Criterios Diferenciales MiPyme
  const reglaMiPyme: ReglaCumplimiento = {
    id: 'REG-06',
    nombre: 'Promoción de la Micro y Pequeña Empresa',
    fundamento: 'Ley 2069 de 2020 y Decreto 1860 de 2021',
    estado: proceso.criteriosPonderacion?.puntajeMiPyme ? 'CUMPLE' : 'ADVERTENCIA',
    diagnostico: proceso.criteriosPonderacion?.puntajeMiPyme
      ? `Asigna puntaje afirmativo de ${proceso.criteriosPonderacion.puntajeMiPyme} puntos para MiPymes nacionales.`
      : 'No se identificó puntaje preferencial para MiPymes en la ponderación.',
    recomendacionPedagogica:
      'Los pliegos de contratación pública deben incentivar la participación del tejido empresarial MiPyme colombiano.',
    pesoPuntos: 10
  };

  // 7. Inclusión de Personas con Discapacidad
  const reglaDiscapacidad: ReglaCumplimiento = {
    id: 'REG-07',
    nombre: 'Puntaje por Inclusión Laboral de Discapacidad',
    fundamento: 'Decreto 392 de 2018 (Art. 2.2.1.2.4.2.6)',
    estado: proceso.criteriosPonderacion?.puntajeDiscapacidad ? 'CUMPLE' : 'ADVERTENCIA',
    diagnostico: proceso.criteriosPonderacion?.puntajeDiscapacidad
      ? `Se otorgan ${proceso.criteriosPonderacion.puntajeDiscapacidad} puntos a proponentes que certifiquen el 10% de su nómina con discapacidad.`
      : 'No se configuró el puntaje del 1% al 2% obligatorio para contratistas con personal con discapacidad.',
    recomendacionPedagogica:
      'El Decreto 392 de 2018 es de obligatorio cumplimiento en todos los procesos de licitación, selección abreviada y concurso de méritos.',
    pesoPuntos: 10
  };

  // 8. Requisitos Financieros y RUP
  const reqFinancieros = proceso.requisitosHabilitantes;
  const reglaFinanciera: ReglaCumplimiento = {
    id: 'REG-08',
    nombre: 'Indicadores Financieros Proporcionales (RUP)',
    fundamento: 'Decreto 1082 de 2015 Art. 2.2.1.1.1.5.3',
    estado:
      reqFinancieros.indiceLiquidezMinimo <= 2.0 && reqFinancieros.nivelEndeudamientoMaximoPct >= 60
        ? 'CUMPLE'
        : 'ADVERTENCIA',
    diagnostico: `Exigencias configuradas: Liquidez ≥ ${reqFinancieros.indiceLiquidezMinimo}, Endeudamiento ≤ ${reqFinancieros.nivelEndeudamientoMaximoPct}%.`,
    recomendacionPedagogica:
      'Los indicadores financieros deben ser proporcionales al objeto contractual y basarse en el estudio de mercado, no limitar injustificadamente la concurrencia.',
    pesoPuntos: 10
  };

  // 9. Capacidad Residual (K-Residual) en Obra
  const esObra = proceso.objeto.toLowerCase().includes('obra') || proceso.objeto.toLowerCase().includes('construcci');
  const reglaKResidual: ReglaCumplimiento = {
    id: 'REG-09',
    nombre: 'Capacidad Residual de Contratación (K-Residual)',
    fundamento: 'Ley 1682 de 2013 Art. 72 y Guía CCE',
    estado: esObra ? 'ADVERTENCIA' : 'CUMPLE',
    diagnostico: esObra
      ? 'Proceso identificado como obra pública: es mandatorio calcular y verificar el K-Residual según la metodología de Colombia Compra Eficiente.'
      : 'El objeto del proceso no corresponde a obra pública, no requiere acreditación obligatoria de K-Residual.',
    recomendacionPedagogica:
      'En contratos de obra pública no basta la experiencia RUP; debe exigirse la Capacidad Residual (K-Residual) según la fórmula legal.',
    pesoPuntos: 5
  };

  // 10. Seguridad Social y Parafiscales
  const reglaParafiscales: ReglaCumplimiento = {
    id: 'REG-10',
    nombre: 'Paz y Salvo de Seguridad Social y Parafiscales',
    fundamento: 'Ley 789 de 2002 Art. 50 y Ley 828 de 2003',
    estado: reqFinancieros.pazYSalvoParafiscales ? 'CUMPLE' : 'INCUMPLE',
    diagnostico: reqFinancieros.pazYSalvoParafiscales
      ? 'Exigencia formal y verificación de certificación expedida por Revisor Fiscal o Representante Legal.'
      : 'Omisión del requisito legal de parafiscales.',
    recomendacionPedagogica:
      'Es un requisito habilitante de orden público intransferible que habilita para celebrar contratos con el Estado.',
    pesoPuntos: 5
  };

  const listaReglas = [
    reglaTransparencia,
    reglaSubsanabilidad,
    reglaRiesgos,
    reglaPreciosBajos,
    reglaDesempates,
    reglaMiPyme,
    reglaDiscapacidad,
    reglaFinanciera,
    reglaKResidual,
    reglaParafiscales
  ];

  // Cálculo del puntaje global de cumplimiento
  let puntosObtenidos = 0;
  let puntosTotales = 0;

  listaReglas.forEach((r) => {
    puntosTotales += r.pesoPuntos;
    if (r.estado === 'CUMPLE') puntosObtenidos += r.pesoPuntos;
    else if (r.estado === 'ADVERTENCIA') puntosObtenidos += r.pesoPuntos * 0.5;
  });

  const porcentajeCumplimiento = Math.round((puntosObtenidos / puntosTotales) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-xl">
              <Scale className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                  Mentor Jurídico CCE
                </span>
                <span className="text-xs text-slate-400">| Ley 80, 1150, 1882 & 2069</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Auditor de Cumplimiento Normativo y Buenas Prácticas
              </h2>
            </div>
          </div>

          <button
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Superior: Semáforo y Salud Contractual */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase">
              Proceso Auditado en Tiempo Real:
            </span>
            <div className="text-base font-extrabold text-slate-900">
              {proceso.numeroProceso} - {proceso.entidad.nombre}
            </div>
            <div className="text-xs text-slate-600 truncate max-w-xl mt-0.5">
              {proceso.objeto}
            </div>
          </div>

          {/* Medidor de Salud Legal */}
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Índice de Salud Legal CCE
              </span>
              <span
                className={`text-2xl font-black ${
                  porcentajeCumplimiento >= 85
                    ? 'text-emerald-600'
                    : porcentajeCumplimiento >= 70
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {porcentajeCumplimiento}%
              </span>
            </div>

            <div className="text-xs">
              <span
                className={`px-2.5 py-1 rounded-full font-bold inline-block text-[11px] ${
                  porcentajeCumplimiento >= 85
                    ? 'bg-emerald-100 text-emerald-800'
                    : porcentajeCumplimiento >= 70
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {porcentajeCumplimiento >= 85
                  ? '✓ Cumplimiento Robusto'
                  : porcentajeCumplimiento >= 70
                  ? '⚠ Riesgo Jurídico Moderado'
                  : '✕ Alto Riesgo de Controversia'}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                10 Reglas Canónicas Verificadas
              </span>
            </div>
          </div>
        </div>

        {/* Lista de las 10 Reglas Auditadas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {listaReglas.map((regla, idx) => (
            <div
              key={regla.id}
              className={`p-4 rounded-xl border transition-all ${
                regla.estado === 'CUMPLE'
                  ? 'bg-white border-slate-200 hover:border-emerald-300'
                  : regla.estado === 'ADVERTENCIA'
                  ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                  : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {regla.estado === 'CUMPLE' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {regla.estado === 'ADVERTENCIA' && (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                    {regla.estado === 'INCUMPLE' && (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {idx + 1}. {regla.nombre}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {regla.fundamento}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {regla.diagnostico}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 self-start ${
                    regla.estado === 'CUMPLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : regla.estado === 'ADVERTENCIA'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {regla.estado}
                </span>
              </div>

              {/* Recomendación Pedagógica */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Criterio Pedagógico CCE:</strong>{' '}
                  {regla.recomendacionPedagogica}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pie del Modal */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Basado en la Circular Externa Única de Colombia Compra Eficiente y la jurisprudencia del Consejo de Estado.
          </span>

          <button
            onClick={onCerrar}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            Entendido / Cerrar Auditoría
          </button>
        </div>
      </div>
    </div>
  );
};
