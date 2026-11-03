import React, { useState } from 'react';
import {
  Scale,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserCheck,
  Send,
  PlusCircle,
  Copy,
  Download,
  ShieldAlert,
  ChevronRight,
  Gavel,
  History,
  Info
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { DisputesEngine } from '../../core/engines/DisputesEngine';
import type { ControversiaContractual, HitoLineaTiempo } from '../../core/domain/types';

export const DisputesView: React.FC = () => {
  const {
    controversias,
    procesos,
    agregarControversia,
    responderControversia
  } = useProcurementStore();

  const [expedienteSeleccionadoId, setExpedienteSeleccionadoId] = useState<string>(
    controversias[0]?.id || ''
  );
  const [tipoActoDraft, setTipoActoDraft] = useState<
    'AUTO_APERTURA' | 'MEMORIAL_DESCARGOS' | 'RESOLUCION_MOTIVADA' | 'ACTA_ARREGLO_DIRECTO'
  >('RESOLUCION_MOTIVADA');

  const [textoRedactado, setTextoRedactado] = useState<string>('');
  const [copiado, setCopiado] = useState(false);
  const [modalNuevoExpediente, setModalNuevoExpediente] = useState(false);

  // Formulario nuevo expediente
  const [nuevoTipo, setNuevoTipo] = useState<ControversiaContractual['tipo']>(
    'SANCIONATORIO_MULTA_INCUMPLIMIENTO'
  );
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoRadicador, setNuevoRadicador] = useState('');
  const [nuevoProcesoId, setNuevoProcesoId] = useState(procesos[0]?.id || '');
  const [nuevaSintesis, setNuevaSintesis] = useState('');
  const [nuevaPretension, setNuevaPretension] = useState(50000000);

  const expedienteActual =
    controversias.find((c) => c.id === expedienteSeleccionadoId) || controversias[0];

  const procesoAsociado =
    procesos.find((p) => p.numeroProceso === expedienteActual?.procesoId || p.id === expedienteActual?.procesoId) ||
    procesos[0];

  // Actualizar borrador cuando cambia el expediente o tipo de acto
  React.useEffect(() => {
    if (expedienteActual && procesoAsociado) {
      const borrador = DisputesEngine.redactarRespuestaControversia(
        tipoActoDraft,
        expedienteActual,
        procesoAsociado
      );
      setTextoRedactado(borrador);
    }
  }, [expedienteActual, tipoActoDraft, procesoAsociado]);

  const handleCopiar = () => {
    navigator.clipboard.writeText(textoRedactado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDescargar = () => {
    const element = document.createElement('a');
    const file = new Blob([textoRedactado], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${expedienteActual.numeroExpediente}_${tipoActoDraft}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleResolver = (nuevoEstado: ControversiaContractual['estado']) => {
    responderControversia(expedienteActual.id, textoRedactado, nuevoEstado);
    alert(`El expediente ${expedienteActual.numeroExpediente} ha sido actualizado a estado: ${nuevoEstado}`);
  };

  const handleCrearExpediente = (e: React.FormEvent) => {
    e.preventDefault();
    const proc = procesos.find((p) => p.id === nuevoProcesoId) || procesos[0];
    const fechaHoy = new Date().toISOString().split('T')[0];
    const idRandom = `EXP-${Math.floor(Math.random() * 9000 + 1000)}`;

    const nuevaControversia: ControversiaContractual = {
      id: idRandom,
      numeroExpediente: `${idRandom}-${new Date().getFullYear()}`,
      procesoId: proc.numeroProceso,
      tipo: nuevoTipo,
      estado: 'RADICADA',
      titulo: nuevoTitulo || `Controversia en ${proc.numeroProceso}`,
      fechaRadicacion: fechaHoy,
      radicador: nuevoRadicador || 'Interesado Anónimo',
      rolRadicador: 'CONTRATISTA',
      sintesisHechos: nuevaSintesis || 'Hechos expuestos en la solicitud.',
      fundamentoJuridico: 'Normas del Estatuto General de Contratación y CPACA.',
      pretensionEconomicaCOP: Number(nuevaPretension),
      diasParaVencerTermino: 10,
      alertaVencimiento: 'AMARILLA',
      lineaTiempo: DisputesEngine.generarLineaTiempo(nuevoTipo, fechaHoy),
      respuestasEmitidas: []
    };

    agregarControversia(nuevaControversia);
    setExpedienteSeleccionadoId(nuevaControversia.id);
    setModalNuevoExpediente(false);
    setNuevoTitulo('');
    setNuevaSintesis('');
  };

  const cuantiasEnDisputa = controversias.reduce(
    (acc, c) => acc + (c.pretensionEconomicaCOP || 0),
    0
  );

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      {/* Cabecera del Módulo */}
      <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              <Scale className="w-5 h-5" />
              Estatuto General de Contratación & CPACA
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Asistente de Respuesta y Gestión de Controversias Contractuales
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-4xl">
              Simulador integral de debido proceso para actuaciones sancionatorias (Art. 86 Ley 1474/2011),
              recursos de reposición en vía gubernativa (Art. 77 Ley 80 / CPACA), desequilibrio económico
              del contrato y caducidad contenciosa administrativa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalNuevoExpediente(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Radicar Controversia / Expediente
            </button>
          </div>
        </div>

        {/* Métricas y Semáforo de Riesgo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Expedientes en Trámite</div>
            <div className="text-xl font-bold text-slate-800 mt-1">
              {controversias.length} radicados
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-0.5">
              100% con debido proceso
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Cuantía Total en Disputa</div>
            <div className="text-xl font-bold text-slate-800 mt-1">
              ${(cuantiasEnDisputa / 1_000_000).toFixed(1)}M COP
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-0.5">
              Pretensiones económicas
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Procedimientos Art. 86</div>
            <div className="text-xl font-bold text-rose-700 mt-1">
              {
                controversias.filter(
                  (c) => c.tipo === 'SANCIONATORIO_MULTA_INCUMPLIMIENTO'
                ).length
              }{' '}
              audiencias
            </div>
            <div className="text-[11px] text-rose-600 font-medium mt-0.5">
              Multas y cláusula penal
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Marco Legal Aplicable</div>
            <div className="text-xl font-bold text-emerald-700 mt-1">
              Ley 1474 / 2220
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Conciliación y MASC
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal: Dos Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Listado de Expedientes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Expedientes Activos</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {controversias.length}
              </span>
            </h2>

            <div className="space-y-2.5">
              {controversias.map((c) => {
                const activo = c.id === expedienteSeleccionadoId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setExpedienteSeleccionadoId(c.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      activo
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">
                        {c.numeroExpediente}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.estado === 'RESUELTA_ENTIDAD' || c.estado === 'ACUERDO_LOGRADO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.estado === 'EN_DESCARGOS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.estado.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {c.titulo}
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
                      <span>Proceso: {c.procesoId}</span>
                      <span className="font-semibold text-slate-700">
                        ${(c.pretensionEconomicaCOP || 0).toLocaleString('es-CO')}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Radicado por: {c.radicador}</span>
                      <span className="flex items-center gap-1 text-indigo-600 font-medium">
                        Ver expediente <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tarjeta de Riesgo y Tipología Legal */}
          {expedienteActual && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs space-y-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                Ficha del Caso Jurídico
              </h3>

              <div>
                <span className="text-slate-500 block">Tipo de Controversia:</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  {expedienteActual.tipo.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Síntesis de los Hechos:</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 mt-1 leading-relaxed">
                  {expedienteActual.sintesisHechos}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 block">Semáforo de Plazo:</span>
                  <span
                    className={`font-bold ${
                      expedienteActual.alertaVencimiento === 'ROJA'
                        ? 'text-rose-600'
                        : expedienteActual.alertaVencimiento === 'AMARILLA'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {expedienteActual.diasParaVencerTermino} días ({expedienteActual.alertaVencimiento})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fecha de Radicación:</span>
                  <span className="font-semibold text-slate-800">
                    {expedienteActual.fechaRadicacion}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Línea de Tiempo y Redactor Jurídico (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {expedienteActual && (
            <>
              {/* Sección 1: Línea de Tiempo Legal Preclusiva */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">
                        Línea de Tiempo y Términos Preclusivos
                      </h2>
                      <p className="text-xs text-slate-500">
                        Cálculo estricto de términos legales (Ley 1474 Art. 86 / CPACA)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {expedienteActual.lineaTiempo.length} Hitos Procesales
                  </span>
                </div>

                {/* Hitos Procesales */}
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {expedienteActual.lineaTiempo.map((hito, index) => {
                    const esCompletado = hito.estadoHito === 'COMPLETADO';
                    const esEnCurso = hito.estadoHito === 'VIGENTE_EN_CURSO';

                    return (
                      <div key={hito.id} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            esCompletado
                              ? 'bg-emerald-500 border-white text-white shadow-sm'
                              : esEnCurso
                              ? 'bg-amber-500 border-white text-white animate-pulse shadow-sm'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}
                        >
                          {esCompletado ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <span className="text-[10px] font-bold">{index + 1}</span>
                          )}
                        </div>

                        <div
                          className={`p-4 rounded-lg border transition-all ${
                            esEnCurso
                              ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                              : esCompletado
                              ? 'bg-slate-50/80 border-slate-200'
                              : 'bg-white border-slate-200 opacity-80'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <span className="font-bold text-slate-900 text-sm">
                              {hito.titulo}
                            </span>
                            <div className="flex items-center gap-2">
                              {hito.diasTerminoLegal && (
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                                  Término: {hito.diasTerminoLegal} días {hito.tipoTermino?.toLowerCase()}
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  esCompletado
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : esEnCurso
                                    ? 'bg-amber-200 text-amber-900 font-extrabold'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {hito.estadoHito.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                            {hito.descripcion}
                          </p>

                          <div className="flex flex-wrap items-center justify-between text-[11px] gap-2 pt-2 border-t border-slate-200/60">
                            <span className="text-indigo-700 font-medium">
                              Fundamento: {hito.fundamentoLegal}
                            </span>
                            <span className="text-slate-500 flex items-center gap-1 font-semibold">
                              <Calendar className="w-3 h-3" /> Fecha: {hito.fecha}
                            </span>
                          </div>

                          {hito.accionRequerida && (
                            <div className="mt-2 text-[11px] bg-white p-2 rounded border border-amber-200 text-amber-900 font-medium flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{hito.accionRequerida}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sección 2: Redactor de Actos Administrativos y Respuestas */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Redactor Jurídico de Respuestas y Actos
                    </h2>
                    <p className="text-xs text-slate-500">
                      Genera minutas con motivación legal estricta y jurisprudencia del Consejo de Estado
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopiar}
                      className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiado ? '¡Copiado!' : 'Copiar Texto'}
                    </button>
                    <button
                      onClick={handleDescargar}
                      className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded border border-indigo-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar .txt
                    </button>
                  </div>
                </div>

                {/* Selector de Tipo de Acto */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {(
                    [
                      { id: 'RESOLUCION_MOTIVADA', label: 'Resolución de Reposición', icon: <Gavel className="w-3.5 h-3.5" /> },
                      { id: 'MEMORIAL_DESCARGOS', label: 'Memorial de Descargos', icon: <UserCheck className="w-3.5 h-3.5" /> },
                      { id: 'AUTO_APERTURA', label: 'Auto de Apertura (Art. 86)', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
                      { id: 'ACTA_ARREGLO_DIRECTO', label: 'Acta de Arreglo Directo', icon: <Scale className="w-3.5 h-3.5" /> }
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTipoActoDraft(t.id)}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-semibold border transition-all ${
                        tipoActoDraft === t.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.icon}
                      <span className="truncate">{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Editor / Vista previa del documento */}
                <textarea
                  value={textoRedactado}
                  onChange={(e) => setTextoRedactado(e.target.value)}
                  rows={14}
                  className="w-full font-mono text-xs p-4 bg-slate-900 text-emerald-300 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"
                  placeholder="El texto legal redactado aparecerá aquí..."
                />

                {/* Acciones de Tramitación Formal */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Cambiar estado formal del expediente con este acto:
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolver('EN_DESCARGOS')}
                      className="px-3 py-1.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                    >
                      Marcar en Descargos
                    </button>
                    <button
                      onClick={() => handleResolver('ACUERDO_LOGRADO')}
                      className="px-3 py-1.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      Pasar a Arreglo Directo
                    </button>
                    <button
                      onClick={() => handleResolver('RESUELTA_ENTIDAD')}
                      className="px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
                    >
                      Emitir Acto Definitivo (Resolver)
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Nuevo Expediente / Radicación */}
      {modalNuevoExpediente && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Radicar Nueva Controversia Contractual
              </h3>
              <button
                onClick={() => setModalNuevoExpediente(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearExpediente} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Proceso de Contratación Vinculado:
                </label>
                <select
                  value={nuevoProcesoId}
                  onChange={(e) => setNuevoProcesoId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {procesos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.numeroProceso} - {p.objeto.substring(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tipo de Actuación Jurídica:
                </label>
                <select
                  value={nuevoTipo}
                  onChange={(e) =>
                    setNuevoTipo(e.target.value as ControversiaContractual['tipo'])
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="SANCIONATORIO_MULTA_INCUMPLIMIENTO">
                    Procedimiento Sancionatorio de Multa / Incumplimiento (Art. 86)
                  </option>
                  <option value="RECURSO_REPOSICION_ADJUDICACION">
                    Recurso de Reposición contra Acto Administrativo (CPACA)
                  </option>
                  <option value="DESEQUILIBRIO_ECONOMICO">
                    Reclamación de Desequilibrio Económico / Sobrecostos
                  </option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Título o Asunto de la Controversia:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Incumplimiento grave en entrega de hitos de obra civil..."
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Radicador / Solicitante:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Consorcio Vial 2025 o Supervisión"
                    value={nuevoRadicador}
                    onChange={(e) => setNuevoRadicador(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Pretensión Económica (COP):
                  </label>
                  <input
                    type="number"
                    value={nuevaPretension}
                    onChange={(e) => setNuevaPretension(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Síntesis de Hechos y Fundamentos:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalle los hechos que motivan la solicitud o informe..."
                  value={nuevaSintesis}
                  onChange={(e) => setNuevaSintesis(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalNuevoExpediente(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
                >
                  Crear y Generar Línea de Tiempo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
