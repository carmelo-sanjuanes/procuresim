import React, { useState } from 'react';
import {
  Users,
  Building,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  PlusCircle,
  Trash2,
  Copy,
  Download,
  Save,
  HelpCircle,
  TrendingUp,
  Percent,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { ConsortiumEngine } from '../../core/engines/ConsortiumEngine';
import type { AsociacionPlural, MiembroAsociacion, TipoAsociacion } from '../../core/domain/types';

export const ConsortiumView: React.FC = () => {
  const { asociaciones, guardarAsociacion, procesos } = useProcurementStore();

  const [asociacionSeleccionadaId, setAsociacionSeleccionadaId] = useState<string>(
    asociaciones[0]?.id || ''
  );

  const asociacionActiva =
    asociaciones.find((a) => a.id === asociacionSeleccionadaId) || asociaciones[0];

  // Estado editable para la asociación activa
  const [tipo, setTipo] = useState<TipoAsociacion>(asociacionActiva?.tipo || 'UNION_TEMPORAL');
  const [nombreAsociacion, setNombreAsociacion] = useState(
    asociacionActiva?.nombreAsociacion || ''
  );
  const [objetoLicitacion, setObjetoLicitacion] = useState(
    asociacionActiva?.objetoLicitacion || ''
  );
  const [representanteDesignado, setRepresentanteDesignado] = useState(
    asociacionActiva?.representanteDesignado || ''
  );
  const [cedulaRepresentante, setCedulaRepresentante] = useState(
    asociacionActiva?.cedulaRepresentante || ''
  );
  const [direccionSede, setDireccionSede] = useState(
    asociacionActiva?.direccionSede || ''
  );
  const [ciudad, setCiudad] = useState(asociacionActiva?.ciudad || 'Bogotá D.C.');
  const [emailNotificacion, setEmailNotificacion] = useState(
    asociacionActiva?.emailNotificacion || ''
  );
  const [telefono, setTelefono] = useState(asociacionActiva?.telefono || '');
  const [miembros, setMiembros] = useState<MiembroAsociacion[]>(
    asociacionActiva?.miembros || []
  );

  // Sincronizar estado cuando cambia la selección externa
  React.useEffect(() => {
    if (asociacionActiva) {
      setTipo(asociacionActiva.tipo);
      setNombreAsociacion(asociacionActiva.nombreAsociacion);
      setObjetoLicitacion(asociacionActiva.objetoLicitacion);
      setRepresentanteDesignado(asociacionActiva.representanteDesignado);
      setCedulaRepresentante(asociacionActiva.cedulaRepresentante);
      setDireccionSede(asociacionActiva.direccionSede);
      setCiudad(asociacionActiva.ciudad);
      setEmailNotificacion(asociacionActiva.emailNotificacion);
      setTelefono(asociacionActiva.telefono);
      setMiembros(asociacionActiva.miembros);
    }
  }, [asociacionSeleccionadaId]);

  // Cálculo en tiempo real de la consolidación según el Manual de CCE
  const consolidacion = ConsortiumEngine.calcularConsolidacion(miembros);

  // Selector de documento a redactar
  const [tipoDocDraft, setTipoDocDraft] = useState<
    'DOCUMENTO_CONSTITUCION' | 'PODER_ESPECIAL' | 'ACUERDO_CONFIDENCIALIDAD' | 'MEMORANDO_ENTENDIMIENTO'
  >('DOCUMENTO_CONSTITUCION');
  const [copiado, setCopiado] = useState(false);

  // Objeto temporal para el motor de redacción
  const asociacionParaRedaccion: AsociacionPlural = {
    id: asociacionActiva?.id || 'ASOC-TEMP',
    tipo,
    nombreAsociacion,
    objetoLicitacion,
    representanteDesignado,
    cedulaRepresentante,
    direccionSede,
    ciudad,
    emailNotificacion,
    telefono,
    miembros,
    porcentajeTotal: consolidacion.porcentajeTotal,
    esValido100Pct: consolidacion.esValido100Pct,
    indicadoresPonderados: consolidacion.indicadoresPonderados,
    documentosGenerados: asociacionActiva?.documentosGenerados || []
  };

  const textoDocumento = ConsortiumEngine.redactarDocumentoAsociacion(
    asociacionParaRedaccion,
    tipoDocDraft
  );

  const handleCopiarDoc = () => {
    navigator.clipboard.writeText(textoDocumento);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDescargarDoc = () => {
    const element = document.createElement('a');
    const file = new Blob([textoDocumento], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${nombreAsociacion.replace(/\s+/g, '_')}_${tipoDocDraft}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGuardarCambios = () => {
    guardarAsociacion(asociacionParaRedaccion);
    alert(`¡Asociación "${nombreAsociacion}" guardada exitosamente en el sistema!`);
  };

  const handleCrearNuevaAsociacion = () => {
    const nuevoId = `ASOC-${Date.now().toString().slice(-4)}`;
    const nueva: AsociacionPlural = {
      id: nuevoId,
      tipo: 'UNION_TEMPORAL',
      nombreAsociacion: `Unión Temporal Aliados ${nuevoId}`,
      objetoLicitacion: procesos[0]?.objeto || 'Construcción y dotación de infraestructura técnica',
      representanteDesignado: 'Dr. Alejandro Montoya Cárdenas',
      cedulaRepresentante: '79.845.120',
      direccionSede: 'Carrera 15 # 93-45 Oficina 502',
      ciudad: 'Bogotá D.C.',
      emailNotificacion: 'notificaciones@alianzastemporal.co',
      telefono: '(601) 745-9800',
      porcentajeTotal: 100,
      esValido100Pct: true,
      miembros: [
        {
          id: `M-1`,
          razonSocial: 'Ingeniería & Proyectos Andinos S.A.S.',
          nit: '900.567.890-1',
          porcentajeParticipacion: 60,
          representanteLegal: 'Carlos Alberto Restrepo',
          cedulaRepresentante: '71.234.567',
          compromisoObligaciones: 'Ejecución técnica principal, maquinaria y dirección de obra (60%).',
          aportesFinancierosCOP: 1200000000,
          esLider: true,
          activoCorriente: 3500000000,
          pasivoCorriente: 1800000000,
          activoTotal: 6500000000,
          pasivoTotal: 2500000000,
          patrimonio: 4000000000,
          experienciaAportadaSMMLV: 5500
        },
        {
          id: `M-2`,
          razonSocial: 'Soluciones Logísticas y Suministros S.A.S.',
          nit: '830.123.456-7',
          porcentajeParticipacion: 40,
          representanteLegal: 'María Jimena Vargas',
          cedulaRepresentante: '52.345.678',
          compromisoObligaciones: 'Gestión de compras, dotación, transporte y soporte administrativo (40%).',
          aportesFinancierosCOP: 800000000,
          esLider: false,
          activoCorriente: 2200000000,
          pasivoCorriente: 950000000,
          activoTotal: 3800000000,
          pasivoTotal: 1200000000,
          patrimonio: 2600000000,
          experienciaAportadaSMMLV: 3200
        }
      ],
      indicadoresPonderados: {
        indiceLiquidez: 2.07,
        nivelEndeudamientoPct: 35.92,
        capitalTrabajoTotalCOP: 2950000000,
        patrimonioTotalCOP: 6600000000,
        experienciaTotalSMMLV: 8700
      },
      documentosGenerados: []
    };
    guardarAsociacion(nueva);
    setAsociacionSeleccionadaId(nueva.id);
  };

  const handleAgregarMiembro = () => {
    const nuevoId = `M-${Date.now().toString().slice(-4)}`;
    const nuevoMiembro: MiembroAsociacion = {
      id: nuevoId,
      razonSocial: `Nuevo Consorciado S.A.S.`,
      nit: '901.999.888-2',
      porcentajeParticipacion: 0,
      representanteLegal: 'Representante Por Designar',
      cedulaRepresentante: '80.000.000',
      compromisoObligaciones: 'Aporte de experiencia y capacidad operativa específica.',
      aportesFinancierosCOP: 0,
      esLider: false,
      activoCorriente: 1000000000,
      pasivoCorriente: 500000000,
      activoTotal: 2000000000,
      pasivoTotal: 700000000,
      patrimonio: 1300000000,
      experienciaAportadaSMMLV: 1500
    };
    setMiembros([...miembros, nuevoMiembro]);
  };

  const handleRemoverMiembro = (id: string) => {
    if (miembros.length <= 1) {
      alert('Una asociación plural debe contar al menos con dos (2) miembros integrantes.');
      return;
    }
    setMiembros(miembros.filter((m) => m.id !== id));
  };

  const handleActualizarMiembro = (id: string, campo: keyof MiembroAsociacion, valor: any) => {
    setMiembros(
      miembros.map((m) => (m.id === id ? { ...m, [campo]: valor } : m))
    );
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      {/* Cabecera del Módulo */}
      <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              <Users className="w-5 h-5" />
              Proponentes Plurales & Alianzas Estratégicas
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Gestor de Consorciados, Uniones Temporales y Asociaciones
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-4xl">
              Estructura alianzas empresariales con verificación estricta de participación al 100%,
              cálculo de indicadores financieros ponderados según el Manual de Colombia Compra Eficiente (CCE),
              y generación de minutas con individualización de sanciones (Art. 7 Ley 80/1993).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCrearNuevaAsociacion}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Estructurar Nueva Alianza
            </button>
            <button
              onClick={handleGuardarCambios}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Guía Rápida Legal Art. 7 Ley 80/1993 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-200 text-xs">
            <span className="font-bold text-blue-900 block mb-1">
              Unión Temporal (Art. 7 Par. 2)
            </span>
            <p className="text-blue-800 leading-relaxed">
              Solidaridad en la propuesta y ejecución. Sin embargo, las <strong>sanciones</strong> se
              individualizan según el porcentaje y las obligaciones de cada miembro.
            </p>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200 text-xs">
            <span className="font-bold text-amber-900 block mb-1">
              Consorcio (Art. 7 Num. 1)
            </span>
            <p className="text-amber-800 leading-relaxed">
              Responsabilidad <strong>solidaria e ilimitada</strong> de todos los integrantes por la
              totalidad de las obligaciones, multas y perjuicios, sin división.
            </p>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-900 block mb-1">
              Fórmula de CCE para Ratios
            </span>
            <p className="text-emerald-800 leading-relaxed">
              No es promedio simple: Los activos y pasivos de cada socio se <strong>suman en bloque</strong>{' '}
              antes de calcular la Liquidez y el Endeudamiento final habilitante.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Configuración de la Alianza y Socios (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selector de Alianzas Registradas */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700 uppercase">
                Alianza en Edición:
              </span>
            </div>
            <select
              value={asociacionSeleccionadaId}
              onChange={(e) => setAsociacionSeleccionadaId(e.target.value)}
              className="text-xs font-semibold p-2 border border-slate-300 rounded-lg text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500 max-w-xs"
            >
              {asociaciones.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombreAsociacion} ({a.tipo.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Formulario de Datos Generales de la Asociación */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Identificación del Proponente Plural</span>
              <span className="text-xs font-semibold text-indigo-600">
                Paso 1: Datos Base
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Figura Jurídica:
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoAsociacion)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="UNION_TEMPORAL">Unión Temporal (Ley 80)</option>
                  <option value="CONSORCIO">Consorcio (Ley 80)</option>
                  <option value="PROMESA_SOCIEDAD_FUTURA">Promesa Sociedad Futura</option>
                  <option value="ACUERDO_COLABORACION_ALIANZA">Acuerdo de Alianza / MoU</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Nombre o Razón Social de la Alianza:
                </label>
                <input
                  type="text"
                  value={nombreAsociacion}
                  onChange={(e) => setNombreAsociacion(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej. Unión Temporal Mantenimiento Vial 2025"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-700 block mb-1">
                Objeto Contractual de la Licitación:
              </label>
              <textarea
                rows={2}
                value={objetoLicitacion}
                onChange={(e) => setObjetoLicitacion(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                placeholder="Objeto exacto publicado en el pliego de condiciones..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Representante Legal Común Designado:
                </label>
                <input
                  type="text"
                  value={representanteDesignado}
                  onChange={(e) => setRepresentanteDesignado(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre completo del apoderado común"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Cédula del Representante Designado:
                </label>
                <input
                  type="text"
                  value={cedulaRepresentante}
                  onChange={(e) => setCedulaRepresentante(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej. C.C. 79.845.120"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Sede / Domicilio:
                </label>
                <input
                  type="text"
                  value={direccionSede}
                  onChange={(e) => setDireccionSede(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ciudad Domicilio:
                </label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Correo de Notificaciones:
                </label>
                <input
                  type="email"
                  value={emailNotificacion}
                  onChange={(e) => setEmailNotificacion(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Constructor de Miembros y Verificación del 100% */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Socios Integrantes y Participaciones
                </h2>
                <p className="text-xs text-slate-500">
                  La suma total de participaciones debe ser exactamente el 100.00%
                </p>
              </div>

              <button
                onClick={handleAgregarMiembro}
                className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Agregar Consorciado
              </button>
            </div>

            {/* Barra de Progreso del 100% */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Porcentaje Consolidado:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-extrabold flex items-center gap-1 ${
                    consolidacion.esValido100Pct
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {consolidacion.esValido100Pct ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      100.00% Válido para SECOP II
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      {consolidacion.porcentajeTotal}% (Invalido: Debe sumar 100%)
                    </>
                  )}
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
                {miembros.map((m, idx) => {
                  const colores = ['bg-indigo-600', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-purple-500'];
                  const color = colores[idx % colores.length];
                  return (
                    <div
                      key={m.id}
                      style={{ width: `${Math.min(m.porcentajeParticipacion, 100)}%` }}
                      className={`${color} h-full transition-all duration-300`}
                      title={`${m.razonSocial}: ${m.porcentajeParticipacion}%`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Lista de Miembros Editables */}
            <div className="space-y-4">
              {miembros.map((miembro, index) => (
                <div
                  key={miembro.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                        {index + 1}
                      </span>
                      {miembro.razonSocial}
                    </span>

                    <button
                      onClick={() => handleRemoverMiembro(miembro.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Eliminar socio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-5">
                      <label className="font-medium text-slate-600 block mb-1">Razón Social:</label>
                      <input
                        type="text"
                        value={miembro.razonSocial}
                        onChange={(e) => handleActualizarMiembro(miembro.id, 'razonSocial', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="font-medium text-slate-600 block mb-1">NIT:</label>
                      <input
                        type="text"
                        value={miembro.nit}
                        onChange={(e) => handleActualizarMiembro(miembro.id, 'nit', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="font-medium text-slate-600 block mb-1 flex items-center justify-between">
                        <span>Participación (%):</span>
                        <span className="font-bold text-indigo-600">{miembro.porcentajeParticipacion}%</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={miembro.porcentajeParticipacion}
                        onChange={(e) =>
                          handleActualizarMiembro(
                            miembro.id,
                            'porcentajeParticipacion',
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  {/* Compromisos y obligaciones asignadas (Clave para UT) */}
                  <div className="text-xs">
                    <label className="font-medium text-slate-600 block mb-1">
                      Obligaciones y Actividades Específicas Asumidas (Art. 7 Par. 2 Ley 80):
                    </label>
                    <input
                      type="text"
                      value={miembro.compromisoObligaciones}
                      onChange={(e) =>
                        handleActualizarMiembro(
                          miembro.id,
                          'compromisoObligaciones',
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                      placeholder="Ej. Ejecución técnica, suministro de asfalto, dirección de obra..."
                    />
                  </div>

                  {/* Cuentas Contables Individuales para el RUP */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Activo Cte (COP):</span>
                      <input
                        type="number"
                        value={miembro.activoCorriente}
                        onChange={(e) =>
                          handleActualizarMiembro(
                            miembro.id,
                            'activoCorriente',
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pasivo Cte (COP):</span>
                      <input
                        type="number"
                        value={miembro.pasivoCorriente}
                        onChange={(e) =>
                          handleActualizarMiembro(
                            miembro.id,
                            'pasivoCorriente',
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block">Patrimonio (COP):</span>
                      <input
                        type="number"
                        value={miembro.patrimonio}
                        onChange={(e) =>
                          handleActualizarMiembro(
                            miembro.id,
                            'patrimonio',
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block">Exp. RUP (SMMLV):</span>
                      <input
                        type="number"
                        value={miembro.experienciaAportadaSMMLV}
                        onChange={(e) =>
                          handleActualizarMiembro(
                            miembro.id,
                            'experienciaAportadaSMMLV',
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Indicadores Consolidados CCE y Redactor de Minutas (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Panel de Indicadores Consolidados CCE */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm uppercase">
                    Consolidación Financiera CCE
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Fórmulas oficiales del Manual de Proponentes Plurales
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ponderación CCE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Índice de Liquidez */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Índice de Liquidez</span>
                  <span className="text-[11px] text-slate-500">
                    Σ Activo Cte / Σ Pasivo Cte (Requerido: ≥ 1.5)
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-base font-extrabold ${
                      consolidacion.indicadoresPonderados.indiceLiquidez >= 1.5
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {consolidacion.indicadoresPonderados.indiceLiquidez}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {consolidacion.indicadoresPonderados.indiceLiquidez >= 1.5
                      ? '✓ Habilita'
                      : '⚠ Revisar'}
                  </span>
                </div>
              </div>

              {/* Nivel de Endeudamiento */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Nivel de Endeudamiento</span>
                  <span className="text-[11px] text-slate-500">
                    (Σ Pasivo Total / Σ Activo Total) * 100 (Requerido: ≤ 70%)
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-base font-extrabold ${
                      consolidacion.indicadoresPonderados.nivelEndeudamientoPct <= 70
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {consolidacion.indicadoresPonderados.nivelEndeudamientoPct}%
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {consolidacion.indicadoresPonderados.nivelEndeudamientoPct <= 70
                      ? '✓ Habilita'
                      : '✕ Supera tope'}
                  </span>
                </div>
              </div>

              {/* Capital de Trabajo Consolidado */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Capital de Trabajo Total</span>
                  <span className="text-[11px] text-slate-500">
                    Σ Activo Cte - Σ Pasivo Cte
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-800">
                  ${(consolidacion.indicadoresPonderados.capitalTrabajoTotalCOP / 1_000_000).toFixed(0)}M COP
                </span>
              </div>

              {/* Patrimonio Consolidado */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Patrimonio Total</span>
                  <span className="text-[11px] text-slate-500">Suma total de patrimonios</span>
                </div>
                <span className="text-sm font-bold text-slate-800">
                  ${(consolidacion.indicadoresPonderados.patrimonioTotalCOP / 1_000_000).toFixed(0)}M COP
                </span>
              </div>

              {/* Experiencia Total RUP */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Experiencia Aportada</span>
                  <span className="text-[11px] text-slate-500">Suma RUP en Salarios Mínimos</span>
                </div>
                <span className="text-sm font-bold text-indigo-700">
                  {consolidacion.indicadoresPonderados.experienciaTotalSMMLV.toLocaleString('es-CO')} SMMLV
                </span>
              </div>

              {/* Capacidad Residual Consolidada (K-Residual) */}
              <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-900 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    K-Residual Consolidado
                  </span>
                  <span className="text-[11px] text-indigo-700">
                    Art. 72 Ley 1682/2013 (Obra Pública)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-indigo-900">
                    {(consolidacion.indicadoresPonderados.capacidadResidualTotalSMMLV || 0).toLocaleString('es-CO')} SMMLV
                  </span>
                  <span className="block text-[10px] text-indigo-600 font-semibold">
                    Σ K-Residual Integrantes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Redactor de Minuta Jurídica de Asociación */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm uppercase">
                    Generador de Minutas de Asociación
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Documento contractual conforme a la Ley 80/1993
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopiarDoc}
                  className="p-1.5 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded text-xs transition-colors flex items-center gap-1"
                  title="Copiar texto"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiado ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={handleDescargarDoc}
                  className="p-1.5 text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded text-xs transition-colors flex items-center gap-1 border border-indigo-200"
                  title="Descargar archivo"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </button>
              </div>
            </div>

            {/* Selector de Documento */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {(
                [
                  { id: 'DOCUMENTO_CONSTITUCION', label: 'Minuta Constitución' },
                  { id: 'PODER_ESPECIAL', label: 'Poder Especial' },
                  { id: 'ACUERDO_CONFIDENCIALIDAD', label: 'Acuerdo Confidencialidad' },
                  { id: 'MEMORANDO_ENTENDIMIENTO', label: 'MoU Estratégico' }
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTipoDocDraft(t.id)}
                  className={`p-2 rounded text-center font-semibold border transition-all ${
                    tipoDocDraft === t.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Visor de Minuta Generada */}
            <textarea
              readOnly
              value={textoDocumento}
              rows={16}
              className="w-full font-mono text-[11px] p-3.5 bg-slate-900 text-emerald-300 rounded-lg border border-slate-800 focus:outline-none leading-relaxed resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
