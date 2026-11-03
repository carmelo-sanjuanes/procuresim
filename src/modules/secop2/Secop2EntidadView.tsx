// Simulador SECOP II - Vista Entidad Estatal (Transaccional Oficial CCE)
import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  DollarSign,
  MessageSquare,
  Shield,
  PlusCircle,
  Eye,
  CheckSquare,
  XCircle,
  Send,
  Calculator,
  Scale
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import type { EstadoProceso, ModalidadContratacion } from '../../core/domain/types';
import { ScoringFormulasEngine, type OfertaSimulada } from '../../core/engines/ScoringFormulasEngine';

export const Secop2EntidadView: React.FC = () => {
  const {
    procesos,
    procesoSeleccionadoId,
    seleccionarProceso,
    actualizarEstadoProceso,
    evaluarOferta,
    adjudicarProceso,
    aplicarPuntajesEconomicosProceso,
    responderObservacion,
    crearProceso,
    entidades,
    setVista
  } = useProcurementStore();

  const [pestanaActiva, setPestanaActiva] = useState<'GENERAL' | 'CRONOGRAMA' | 'HABILITANTES' | 'OFERTAS' | 'OBSERVACIONES' | 'ADJUDICACION'>('GENERAL');
  const [modalNuevoProceso, setModalNuevoProceso] = useState(false);
  const [nuevaRespTexto, setNuevaRespTexto] = useState<{ [obsId: string]: string }>({});

  const proceso = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  // Estado para formulario de nuevo proceso
  const [nuevoNum, setNuevoNum] = useState(`LP-00${procesos.length + 1}-2025`);
  const [nuevoObj, setNuevoObj] = useState('');
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState(250000000);
  const [nuevaModalidad, setNuevaModalidad] = useState<ModalidadContratacion>('LICITACION_PUBLICA');

  const handleCrearProceso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoObj) return;

    crearProceso({
      id: `PROC-${Date.now()}`,
      numeroProceso: nuevoNum,
      plataformaOrigen: 'SECOP_II_ENTIDAD',
      entidad: entidades[0],
      modalidad: nuevaModalidad,
      objeto: nuevoObj,
      justificacion: 'Justificación precontractual estructurada en cumplimiento del Decreto 1082 de 2015.',
      presupuestoOficial: nuevoPresupuesto,
      cdpNumero: `CDP-2025-${Math.floor(Math.random() * 9000 + 1000)}`,
      cdpFecha: new Date().toISOString().split('T')[0],
      plazoMeses: 3,
      plazoDias: 90,
      lugarEjecucion: entidades[0].municipio,
      estado: 'PRESENTACION_OFERTAS',
      cronograma: {
        publicacionBorrador: '2025-02-01',
        observacionesBorradorLimite: '2025-02-10',
        publicacionDefinitivo: '2025-02-15',
        presentacionOfertasLimite: '2025-03-05 10:00 AM',
        aperturaSobres: '2025-03-05 10:30 AM',
        publicacionInformeEvaluacion: '2025-03-12',
        trasladoInformeLimite: '2025-03-18',
        audienciaAdjudicacion: '2025-03-22',
        firmaContrato: '2025-03-30'
      },
      items: [
        {
          id: `ITM-${Date.now()}`,
          codigoUNSPSC: '43211500',
          descripcionUNSPSC: 'Equipos tecnológicos y periféricos',
          detalleTecnico: 'Especificaciones mínimas requeridas según pliego de condiciones.',
          unidadMedida: 'UNIDAD',
          cantidad: 10,
          precioUnitarioEstimado: Math.round(nuevoPresupuesto / 10)
        }
      ],
      riesgos: [],
      requisitosHabilitantes: {
        exigeRUP: true,
        tiempoConstitucionMesesMinimo: 24,
        objetoSocialAcorde: true,
        pazYSalvoParafiscales: true,
        antecedentesDisciplinariosJudiciales: true,
        indiceLiquidezMinimo: 1.5,
        nivelEndeudamientoMaximoPct: 70,
        coberturaInteresesMinima: 2.0,
        capitalTrabajoMinimoCOP: 100000000,
        rentabilidadPatrimonioMinimaPct: 5,
        rentabilidadActivoMinimaPct: 3,
        codigosUNSPSCExigidos: ['43211500'],
        numeroContratosAcreditar: 2,
        sumatoriaSMMLVMinima: 300,
        anosExperienciaMinima: 2
      },
      criteriosPonderacion: {
        puntajeEconomico: 60,
        puntajeTecnicoCalidad: 20,
        puntajeIndustriaNacional: 10,
        puntajeDiscapacidad: 2,
        puntajeMiPyme: 8
      },
      observacionesCiudadanas: [],
      ofertasPresentadas: []
    });

    setModalNuevoProceso(false);
  };

  const handleCalcularConFormulasCCE = () => {
    if (!proceso || proceso.ofertasPresentadas.length === 0) {
      alert('No hay ofertas radicadas para calificar en este proceso.');
      return;
    }

    const ofertasSim: OfertaSimulada[] = proceso.ofertasPresentadas.map((o) => ({
      id: o.id,
      nombreProponente: o.proponente.razonSocial,
      valorOfertado: o.valorEconomicoTotal,
      esMiPyme: o.proponente.esMiPyme,
      esEmpresaMujeres: false,
      empleadosDiscapacidad: o.proponente.empleadosConDiscapacidad,
      industriaNacional: true,
      puntajeCalidadTecnica: o.puntajeObtenido.calidad || 20,
      habilitado: o.evaluacionJuridica === 'CUMPLE' && o.evaluacionFinanciera === 'CUMPLE' && o.evaluacionTecnica === 'CUMPLE',
      motivoInhabilitacion: o.evaluacionJuridica !== 'CUMPLE' ? 'No habilitado jurídicamente' : undefined
    }));

    const res = ScoringFormulasEngine.simularCalificacionEconomica(
      ofertasSim,
      proceso.presupuestoOficial,
      'MEDIA_GEOMETRICA',
      proceso.criteriosPonderacion?.puntajeEconomico || 60,
      0.025
    );

    const mapeadas = res.ofertasCalificadas.map((c) => ({
      ofertaId: c.ofertaId,
      puntajeEconomico: c.puntajeEconomico,
      puntajeTotal: c.puntajeTotal,
      esGanador: c.posicion === 1
    }));

    aplicarPuntajesEconomicosProceso(proceso.id, mapeadas);
    const ganadora = res.ofertasCalificadas.find((c) => c.posicion === 1);
    if (ganadora) {
      adjudicarProceso(proceso.id, ganadora.ofertaId);
    }
    alert(`¡Puntajes calculados exitosamente con la fórmula CCE (${res.formulaMatematicaTexto})! Ganador preliminar: ${ganadora?.nombreProponente || 'N/A'}`);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Barra Institucional Estilo SECOP II */}
      <div className="bg-[#004884] text-white px-6 py-3 flex flex-wrap items-center justify-between shadow">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 px-2.5 py-1 rounded font-bold tracking-wider text-xs border border-white/20">
            SECOP II
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Portal Transaccional de Contratación Pública</h1>
            <p className="text-xs text-blue-100">Vista del Comprador: {proceso?.entidad.nombre}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setModalNuevoProceso(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Crear Nuevo Proceso
          </button>
          <div className="bg-blue-900/60 px-3 py-1 rounded border border-blue-400/30 text-blue-100">
            Rol: <strong>Estructurador / Evaluador</strong>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel Lateral: Lista de Procesos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            Procesos en Trámite ({procesos.length})
          </h2>
          <div className="space-y-2">
            {procesos.map((p) => {
              const seleccionado = p.id === proceso?.id;
              return (
                <div
                  key={p.id}
                  onClick={() => seleccionarProceso(p.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    seleccionado
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{p.numeroProceso}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {p.modalidad.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 mt-1 text-[11px]">{p.objeto}</p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>\$ {p.presupuestoOficial.toLocaleString('es-CO')}</span>
                    <span className="font-semibold text-emerald-600">{p.estado.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel Central: Detalle y Operaciones del Proceso */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-3 flex flex-col overflow-hidden">
          {/* Encabezado del Proceso Activo */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {proceso?.numeroProceso} - {proceso?.modalidad.replace(/_/g, ' ')}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">{proceso?.objeto}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Entidad: {proceso?.entidad.nombre} | CDP: {proceso?.cdpNumero} ({proceso?.cdpFecha})
                </p>
              </div>

              {/* Conmutador de Estado */}
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Etapa Actual:</span>
                <select
                  value={proceso?.estado}
                  onChange={(e) => actualizarEstadoProceso(proceso.id, e.target.value as EstadoProceso)}
                  className="mt-1 text-xs font-bold bg-white border border-slate-300 text-slate-800 rounded px-2.5 py-1 shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ESTUDIOS_PREVIOS">Estudios Previos</option>
                  <option value="PUBLICADO_BORRADOR">Proyecto de Pliego (Borrador)</option>
                  <option value="CONVOCATORIA_DEFINITIVA">Pliego Definitivo</option>
                  <option value="PRESENTACION_OFERTAS">Presentación de Ofertas</option>
                  <option value="EVALUACION">Evaluación de Ofertas</option>
                  <option value="TRASLADO_EVALUACION">Traslado de Informe</option>
                  <option value="ADJUDICACION">Adjudicado</option>
                  <option value="DESIERTO">Declarado Desierto</option>
                  <option value="FIRMADO">Contrato Firmado</option>
                  <option value="EJECUCION">En Ejecución</option>
                  <option value="LIQUIDADO">Liquidado</option>
                </select>
              </div>
            </div>

            {/* Pestañas de Navegación del SECOP II */}
            <div className="flex items-center space-x-1 mt-4 border-b border-slate-200 text-xs overflow-x-auto">
              {[
                { id: 'GENERAL', label: '1. Información General', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'CRONOGRAMA', label: '2. Cronograma', icon: <Clock className="w-3.5 h-3.5" /> },
                { id: 'HABILITANTES', label: '3. Requisitos RUP', icon: <Shield className="w-3.5 h-3.5" /> },
                { id: 'OFERTAS', label: `4. Ofertas Recibidas (${proceso?.ofertasPresentadas.length || 0})`, icon: <CheckSquare className="w-3.5 h-3.5" /> },
                { id: 'OBSERVACIONES', label: `5. Observaciones (${proceso?.observacionesCiudadanas.length || 0})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { id: 'ADJUDICACION', label: '6. Adjudicación', icon: <Award className="w-3.5 h-3.5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPestanaActiva(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    pestanaActiva === tab.id
                      ? 'border-blue-600 text-blue-700 bg-white font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido de la Pestaña Activa */}
          <div className="p-6 flex-1 overflow-y-auto">
            {/* 1. Información General */}
            {pestanaActiva === 'GENERAL' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold">Presupuesto Oficial:</span>
                    <div className="text-base font-bold text-slate-900 mt-1">
                      \$ {proceso?.presupuestoOficial.toLocaleString('es-CO')} COP
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold">Plazo de Ejecución:</span>
                    <div className="text-base font-bold text-slate-900 mt-1">
                      {proceso?.plazoMeses > 0 ? `${proceso.plazoMeses} meses` : `${proceso?.plazoDias} días`}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold">Lugar de Ejecución:</span>
                    <div className="text-base font-bold text-slate-900 mt-1">{proceso?.lugarEjecucion}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Justificación y Necesidad</h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {proceso?.justificacion}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2">Ítems a Contratar (UNSPSC)</h3>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-semibold">
                        <tr>
                          <th className="p-2.5">Código UNSPSC</th>
                          <th className="p-2.5">Descripción</th>
                          <th className="p-2.5">Cantidad</th>
                          <th className="p-2.5">Valor Unitario Est.</th>
                          <th className="p-2.5">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {proceso?.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono text-blue-600">{item.codigoUNSPSC}</td>
                            <td className="p-2.5">
                              <span className="font-semibold block">{item.descripcionUNSPSC}</span>
                              <span className="text-slate-500 text-[11px]">{item.detalleTecnico}</span>
                            </td>
                            <td className="p-2.5 font-bold">
                              {item.cantidad} {item.unidadMedida}
                            </td>
                            <td className="p-2.5">\$ {(item.precioUnitarioEstimado || 0).toLocaleString('es-CO')}</td>
                            <td className="p-2.5 font-bold text-slate-900">
                              \$ {((item.precioUnitarioEstimado || 0) * item.cantidad).toLocaleString('es-CO')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Cronograma */}
            {pestanaActiva === 'CRONOGRAMA' && (
              <div className="space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 text-sm">Cronograma Oficial del Proceso (Tiempos de Ley)</h3>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {Object.entries(proceso?.cronograma || {}).map(([clave, valor]) => {
                    const etiquetas: { [k: string]: string } = {
                      publicacionBorrador: 'Publicación del Proyecto de Pliego (Borrador)',
                      observacionesBorradorLimite: 'Límite para Presentar Observaciones al Borrador',
                      publicacionDefinitivo: 'Publicación del Pliego de Condiciones Definitivo',
                      presentacionOfertasLimite: 'Cierre y Presentación de Ofertas (Sobre Criptográfico)',
                      aperturaSobres: 'Apertura de Sobres y Publicación de Lista de Oferentes',
                      publicacionInformeEvaluacion: 'Publicación del Informe de Evaluación y Habilitación',
                      trasladoInformeLimite: 'Término de Traslado del Informe y Subsanaciones',
                      audienciaAdjudicacion: 'Audiencia Pública de Adjudicación',
                      firmaContrato: 'Suscripción y Registro del Contrato Electrónico'
                    };

                    return (
                      <div key={clave} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <span className="font-medium text-slate-700">{etiquetas[clave] || clave}</span>
                        <span className="font-mono bg-blue-50 text-blue-800 font-bold px-2.5 py-1 rounded border border-blue-200">
                          {valor}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Requisitos Habilitantes RUP */}
            {pestanaActiva === 'HABILITANTES' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-800 text-sm">Requisitos Financieros y Organizacionales (RUP)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block">Índice de Liquidez Mínimo</span>
                    <span className="text-slate-500">Activo Corriente / Pasivo Corriente</span>
                    <div className="text-base font-bold text-blue-600 mt-1">
                      &gt;= {proceso?.requisitosHabilitantes.indiceLiquidezMinimo}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block">Nivel de Endeudamiento Máximo</span>
                    <span className="text-slate-500">(Pasivo Total / Activo Total) * 100</span>
                    <div className="text-base font-bold text-blue-600 mt-1">
                      &lt;= {proceso?.requisitosHabilitantes.nivelEndeudamientoMaximoPct}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block">Razón de Cobertura de Intereses</span>
                    <span className="text-slate-500">Utilidad Operacional / Gastos de Intereses</span>
                    <div className="text-base font-bold text-blue-600 mt-1">
                      &gt;= {proceso?.requisitosHabilitantes.coberturaInteresesMinima}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800 block">Experiencia Mínima en SMMLV</span>
                    <span className="text-slate-500">
                      En {proceso?.requisitosHabilitantes.numeroContratosAcreditar} contratos registrados en el RUP
                    </span>
                    <div className="text-base font-bold text-blue-600 mt-1">
                      {proceso?.requisitosHabilitantes.sumatoriaSMMLVMinima} SMMLV
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Ofertas Recibidas y Evaluación */}
            {pestanaActiva === 'OFERTAS' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Ofertas Presentadas en SECOP II ({proceso?.ofertasPresentadas.length})
                  </h3>
                  <span className="text-slate-500 text-[11px]">
                    Las ofertas se encuentran desencriptadas tras la fecha de cierre.
                  </span>
                </div>

                {/* Banner de Calificación Económica Oficial CCE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
                  <div>
                    <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-600" />
                      Evaluación Económica Oficial CCE (Pliegos Tipo)
                    </h4>
                    <p className="text-[11px] text-blue-700">
                      Calcula y asigna puntajes matemáticos oficiales de Colombia Compra Eficiente (Ley 80/1993, Ley 1150/2007 y Pliegos Tipo).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCalcularConFormulasCCE}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors text-xs flex items-center gap-1.5"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      Calcular con Fórmulas CCE
                    </button>
                    <button
                      onClick={() => setVista('SIMULADOR_CALIFICACION')}
                      className="bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors text-xs flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Simulador Avanzado
                    </button>
                  </div>
                </div>

                {proceso?.ofertasPresentadas.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-slate-500">Aún no se han recibido ofertas en este proceso.</p>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Puedes ir a la pestaña <strong>SECOP II (Proveedor)</strong> o al <strong>Asistente de Propuestas</strong> para radicar una oferta de prueba.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proceso?.ofertasPresentadas.map((oferta) => (
                      <div
                        key={oferta.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-400 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">
                              {oferta.proponente.razonSocial}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              NIT: {oferta.proponente.nit} | Radicado: {oferta.fechaRadicacion}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block text-[11px]">Valor Ofertado:</span>
                            <span className="font-bold text-sm text-blue-700">
                              \$ {oferta.valorEconomicoTotal.toLocaleString('es-CO')} COP
                            </span>
                          </div>
                        </div>

                        {/* Matriz de Habilitación para el Comité Evaluador */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-slate-600 font-semibold block mb-1">Habilitación Jurídica:</span>
                            <div className="flex gap-1.5">
                              {(['CUMPLE', 'POR_SUBSANAR', 'NO_CUMPLE'] as const).map((estado) => (
                                <button
                                  key={estado}
                                  onClick={() =>
                                    evaluarOferta(
                                      proceso.id,
                                      oferta.id,
                                      estado,
                                      oferta.evaluacionFinanciera,
                                      oferta.evaluacionTecnica
                                    )
                                  }
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    oferta.evaluacionJuridica === estado
                                      ? estado === 'CUMPLE'
                                        ? 'bg-emerald-600 text-white'
                                        : estado === 'POR_SUBSANAR'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-rose-600 text-white'
                                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  }`}
                                >
                                  {estado}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-slate-600 font-semibold block mb-1">Habilitación Financiera:</span>
                            <div className="flex gap-1.5">
                              {(['CUMPLE', 'POR_SUBSANAR', 'NO_CUMPLE'] as const).map((estado) => (
                                <button
                                  key={estado}
                                  onClick={() =>
                                    evaluarOferta(
                                      proceso.id,
                                      oferta.id,
                                      oferta.evaluacionJuridica,
                                      estado,
                                      oferta.evaluacionTecnica
                                    )
                                  }
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    oferta.evaluacionFinanciera === estado
                                      ? estado === 'CUMPLE'
                                        ? 'bg-emerald-600 text-white'
                                        : estado === 'POR_SUBSANAR'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-rose-600 text-white'
                                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  }`}
                                >
                                  {estado}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-slate-600 font-semibold block mb-1">Habilitación Técnica:</span>
                            <div className="flex gap-1.5">
                              {(['CUMPLE', 'POR_SUBSANAR', 'NO_CUMPLE'] as const).map((estado) => (
                                <button
                                  key={estado}
                                  onClick={() =>
                                    evaluarOferta(
                                      proceso.id,
                                      oferta.id,
                                      oferta.evaluacionJuridica,
                                      oferta.evaluacionFinanciera,
                                      estado
                                    )
                                  }
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    oferta.evaluacionTecnica === estado
                                      ? estado === 'CUMPLE'
                                        ? 'bg-emerald-600 text-white'
                                        : estado === 'POR_SUBSANAR'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-rose-600 text-white'
                                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  }`}
                                >
                                  {estado}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Puntuación y Acción de Adjudicación */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-700">Puntaje Total Ponderado:</span>
                            <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded text-xs">
                              {oferta.puntajeObtenido.total} / 100 pts
                            </span>
                          </div>

                          {oferta.esGanador ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-md flex items-center gap-1">
                              <Award className="w-4 h-4 text-emerald-600" />
                              ADJUDICATARIO OFICIAL
                            </span>
                          ) : (
                            <button
                              onClick={() => adjudicarProceso(proceso.id, oferta.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded shadow-sm transition-colors flex items-center gap-1"
                            >
                              <Award className="w-3.5 h-3.5" />
                              Adjudicar a este Proponente
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Observaciones Ciudadanas */}
            {pestanaActiva === 'OBSERVACIONES' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-800 text-sm">
                  Observaciones Radicadas a los Pliegos ({proceso?.observacionesCiudadanas.length})
                </h3>

                {proceso?.observacionesCiudadanas.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg">
                    No se han registrado observaciones en este proceso.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proceso?.observacionesCiudadanas.map((obs) => (
                      <div key={obs.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{obs.remitente}</span>
                          <span className="text-[10px] text-slate-400">{obs.fecha}</span>
                        </div>
                        <p className="text-slate-700">{obs.texto}</p>

                        {obs.respuestaEntidad ? (
                          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded text-slate-800 text-[11px]">
                            <strong className="text-blue-900 block mb-0.5">
                              Respuesta de la Entidad ({obs.estado}):
                            </strong>
                            {obs.respuestaEntidad}
                          </div>
                        ) : (
                          <div className="space-y-1.5 pt-2">
                            <textarea
                              placeholder="Redactar respuesta oficial a la observación..."
                              value={nuevaRespTexto[obs.id] || ''}
                              onChange={(e) =>
                                setNuevaRespTexto({ ...nuevaRespTexto, [obs.id]: e.target.value })
                              }
                              className="w-full p-2 bg-white border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-blue-500"
                              rows={2}
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  if (nuevaRespTexto[obs.id]) {
                                    responderObservacion(proceso.id, obs.id, nuevaRespTexto[obs.id], 'RECHAZADA');
                                  }
                                }}
                                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold"
                              >
                                No Aceptar
                              </button>
                              <button
                                onClick={() => {
                                  if (nuevaRespTexto[obs.id]) {
                                    responderObservacion(proceso.id, obs.id, nuevaRespTexto[obs.id], 'ACEPTADA');
                                  }
                                }}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                Aceptar y Responder
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. Adjudicación */}
            {pestanaActiva === 'ADJUDICACION' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-800 text-sm">Acto Administrativo de Adjudicación</h3>
                {proceso?.estado === 'ADJUDICACION' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span>Proceso Adjudicado Exitosamente</span>
                    </div>
                    <p className="text-emerald-700 leading-relaxed">
                      El contrato ha sido adjudicado formalmente de acuerdo con el orden de elegibilidad resultante del informe de evaluación definitivo. Proceda a la suscripción de la minuta contractual y cargue de garantías de cumplimiento.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 space-y-2">
                    <p>
                      El proceso se encuentra en etapa de: <strong>{proceso?.estado.replace(/_/g, ' ')}</strong>.
                    </p>
                    <p>
                      Para adjudicar, diríjase a la pestaña <strong>4. Ofertas Recibidas</strong> y presione el botón <em>Adjudicar a este Proponente</em> tras verificar las habilitaciones jurídicas, financieras y técnicas.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Crear Nuevo Proceso */}
      {modalNuevoProceso && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Crear Nuevo Proceso en SECOP II</h3>
            <form onSubmit={handleCrearProceso} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Número de Proceso:</label>
                <input
                  type="text"
                  value={nuevoNum}
                  onChange={(e) => setNuevoNum(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Modalidad de Selección:</label>
                <select
                  value={nuevaModalidad}
                  onChange={(e) => setNuevaModalidad(e.target.value as ModalidadContratacion)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                >
                  <option value="LICITACION_PUBLICA">Licitación Pública</option>
                  <option value="SELECCION_ABREVIADA_MENOR_CUANTIA">Selección Abreviada Menor Cuantía</option>
                  <option value="SELECCION_ABREVIADA_SUBASTA_INVERSA">Selección Abreviada por Subasta Inversa</option>
                  <option value="CONCURSO_MERITOS">Concurso de Méritos</option>
                  <option value="MINIMA_CUANTIA">Mínima Cuantía</option>
                  <option value="CONTRATACION_DIRECTA">Contratación Directa</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Objeto a Contratar:</label>
                <textarea
                  value={nuevoObj}
                  onChange={(e) => setNuevoObj(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                  rows={3}
                  placeholder="Descripción precisa del bien o servicio..."
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Presupuesto Oficial (COP):</label>
                <input
                  type="number"
                  value={nuevoPresupuesto}
                  onChange={(e) => setNuevoPresupuesto(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalNuevoProceso(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                >
                  Publicar Proceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
