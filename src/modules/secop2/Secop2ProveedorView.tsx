// Simulador SECOP II - Vista Proveedor / Proponente (Radicación y Seguimiento)
import React, { useState } from 'react';
import {
  Search,
  Building,
  Calendar,
  Send,
  FileCheck,
  AlertTriangle,
  Lock,
  Upload,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import type { OfertaPresentada } from '../../core/domain/types';

export const Secop2ProveedorView: React.FC = () => {
  const {
    procesos,
    procesoSeleccionadoId,
    seleccionarProceso,
    proveedores,
    proveedorActivoId,
    setProveedorActivo,
    radicarOferta,
    agregarObservacion
  } = useProcurementStore();

  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [modalRadicar, setModalRadicar] = useState(false);
  const [modalObservacion, setModalObservacion] = useState(false);
  const [textoObservacion, setTextoObservacion] = useState('');
  const [interesManifestado, setInteresManifestado] = useState<{ [procesoId: string]: boolean }>({});

  const proceso = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];
  const proponenteActivo = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];

  // Estado para la oferta que el proponente radicará
  const [valorOfertado, setValorOfertado] = useState(proceso?.presupuestoOficial * 0.95 || 100000000);

  const procesosFiltrados = procesos.filter(
    (p) =>
      p.numeroProceso.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      p.objeto.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      p.entidad.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const miOferta = proceso?.ofertasPresentadas.find((o) => o.proponente.nit === proponenteActivo.nit);

  const handleEnviarObservacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoObservacion || !proceso) return;
    agregarObservacion(proceso.id, proponenteActivo.razonSocial, textoObservacion);
    setTextoObservacion('');
    setModalObservacion(false);
  };

  const handleRadicarOferta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proceso) return;

    const nuevaOferta: OfertaPresentada = {
      id: `OFR-SEC2-${Date.now()}`,
      procesoId: proceso.id,
      proponente: proponenteActivo,
      fechaRadicacion: new Date().toISOString().replace('T', ' ').substring(0, 16),
      valorEconomicoTotal: valorOfertado,
      desglosePrecios: proceso.items.map((i) => ({
        itemId: i.id,
        precioUnitarioOfertado: Math.round(valorOfertado / (proceso.items.length * i.cantidad)),
        subtotal: Math.round(valorOfertado / proceso.items.length)
      })),
      documentosCargados: [
        { tipo: 'CARTA_PRESENTACION', nombreArchivo: 'Carta_Presentacion_Firmada.pdf', estadoValidacion: 'PENDIENTE' },
        { tipo: 'RUP', nombreArchivo: 'Certificado_RUP_Vigente.pdf', estadoValidacion: 'PENDIENTE' },
        { tipo: 'CAMARA_COMERCIO', nombreArchivo: 'Existencia_Legal_CCB.pdf', estadoValidacion: 'PENDIENTE' },
        { tipo: 'PARAFISCALES', nombreArchivo: 'Certificacion_Art50_Ley789.pdf', estadoValidacion: 'PENDIENTE' },
        { tipo: 'PROPUESTA_ECONOMICA', nombreArchivo: 'Formulario_Precios_AIU.xlsx', estadoValidacion: 'PENDIENTE' }
      ],
      evaluacionJuridica: 'CUMPLE',
      evaluacionFinanciera: 'CUMPLE',
      evaluacionTecnica: 'CUMPLE',
      puntajeObtenido: {
        economico: 60,
        calidad: 20,
        industriaNacional: 10,
        discapacidad: proponenteActivo.empleadosConDiscapacidad ? 2 : 0,
        miPyme: proponenteActivo.esMiPyme ? 8 : 0,
        total: 90
      },
      esGanador: false
    };

    radicarOferta(proceso.id, nuevaOferta);
    setModalRadicar(false);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Header SECOP II Vista Proveedor */}
      <div className="bg-[#002f57] text-white px-6 py-3 flex flex-wrap items-center justify-between shadow">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded font-bold tracking-wider text-xs border border-emerald-500/30 flex items-center gap-1.5">
            {proponenteActivo.logoUrl ? (
              <img src={proponenteActivo.logoUrl} alt="Logo" className="w-5 h-5 object-contain" />
            ) : null}
            <span>SECOP II PROVEEDOR</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
              {proponenteActivo.razonSocial}
              {proponenteActivo.id === 'PROV-04' && (
                <span className="text-[10px] bg-lime-400 text-slate-950 px-1.5 py-0.5 rounded font-black uppercase">
                  Licitante Insignia
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-300">
              NIT {proponenteActivo.nit} | {proponenteActivo.ciudad} | RUP Vigente & Firme
            </p>
          </div>
        </div>

        {/* Conmutador de Proponente Activo */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-300">Cambiar Proveedor:</span>
          <select
            value={proveedorActivoId}
            onChange={(e) => setProveedorActivo(e.target.value)}
            className="bg-slate-800 text-white font-medium border border-slate-700 rounded px-2.5 py-1 focus:outline-none"
          >
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.razonSocial}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Columna Izquierda: Búsqueda y Lista de Oportunidades */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Buscar Procesos Abiertos
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Palabra clave, número o entidad..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {procesosFiltrados.map((p) => {
              const seleccionado = p.id === proceso?.id;
              const tieneOferta = p.ofertasPresentadas.some((o) => o.proponente.nit === proponenteActivo.nit);

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    seleccionarProceso(p.id);
                    setValorOfertado(Math.round(p.presupuestoOficial * 0.95));
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    seleccionado
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{p.numeroProceso}</span>
                    {tieneOferta && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                        Oferta Radicada
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 line-clamp-2 mt-1 text-[11px]">{p.objeto}</p>
                  <div className="mt-2 text-slate-500 flex items-center justify-between text-[11px]">
                    <span>{p.entidad.municipio}</span>
                    <span className="font-bold text-blue-700">
                      \$ {p.presupuestoOficial.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Detalle de Convocatoria y Radicación */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2 flex flex-col space-y-5">
          {/* Cabecera del Proceso */}
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {proceso?.numeroProceso}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Estado: {proceso?.estado.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-2">{proceso?.objeto}</h2>
            <p className="text-xs text-slate-500 mt-1">
              {proceso?.entidad.nombre} - {proceso?.entidad.municipio}, {proceso?.entidad.departamento}
            </p>
          </div>

          {/* Tarjetas de Datos Clave */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block">Presupuesto Oficial Techo:</span>
              <span className="text-base font-bold text-slate-900">
                \$ {proceso?.presupuestoOficial.toLocaleString('es-CO')} COP
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block">Cierre de Ofertas:</span>
              <span className="font-bold text-rose-700 font-mono">
                {proceso?.cronograma.presentacionOfertasLimite}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block">Plazo de Ejecución:</span>
              <span className="font-bold text-slate-800">
                {proceso?.plazoMeses > 0 ? `${proceso.plazoMeses} meses` : `${proceso?.plazoDias} días`}
              </span>
            </div>
          </div>

          {/* Requisitos Habilitantes para el Proveedor */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">Requisitos Exigidos en el Pliego</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500">Liquidez Mínima:</span>{' '}
                <strong>&gt;= {proceso?.requisitosHabilitantes.indiceLiquidezMinimo}</strong>
              </div>
              <div>
                <span className="text-slate-500">Endeudamiento Máximo:</span>{' '}
                <strong>&lt;= {proceso?.requisitosHabilitantes.nivelEndeudamientoMaximoPct}%</strong>
              </div>
              <div>
                <span className="text-slate-500">Experiencia en SMMLV:</span>{' '}
                <strong>{proceso?.requisitosHabilitantes.sumatoriaSMMLVMinima} SMMLV</strong>
              </div>
              <div>
                <span className="text-slate-500">Códigos UNSPSC:</span>{' '}
                <strong className="font-mono text-blue-700">
                  {proceso?.requisitosHabilitantes.codigosUNSPSCExigidos.join(', ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Acciones del Proponente */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-xs text-blue-900">
                  Acciones de Participación en SECOP II
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!interesManifestado[proceso?.id || ''] ? (
                  <button
                    onClick={() => setInteresManifestado({ ...interesManifestado, [proceso?.id || '']: true })}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-blue-300 text-blue-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Manifestar Interés
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100 px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Interés Manifestado
                  </span>
                )}

                <button
                  onClick={() => setModalObservacion(true)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-blue-300 text-blue-700 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Formular Observación
                </button>
              </div>
            </div>

            {/* Radicación de Propuesta */}
            <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-3">
              {miOferta ? (
                <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-white p-3 rounded-lg border border-emerald-300 w-full justify-between">
                  <div>
                    <span className="font-bold block">¡Propuesta Radicada con Éxito!</span>
                    <span className="text-[11px] text-slate-500">
                      Radicado: {miOferta.id} | Fecha: {miOferta.fechaRadicacion} | Valor: \$ {miOferta.valorEconomicoTotal.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                    Sobre Encriptado
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-600">
                    ¿Listo para presentar tu oferta económica y anexos de habilitación?
                  </span>
                  <button
                    onClick={() => setModalRadicar(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Presentar Oferta en SECOP II
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Radicar Oferta */}
      {modalRadicar && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Radicación de Oferta - Proceso {proceso?.numeroProceso}
              </h3>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>

            <form onSubmit={handleRadicarOferta} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Proponente que Radica:
                </label>
                <input
                  type="text"
                  value={`${proponenteActivo.razonSocial} (NIT: ${proponenteActivo.nit})`}
                  disabled
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Valor Económico Total Ofertado (COP):
                </label>
                <input
                  type="number"
                  value={valorOfertado}
                  onChange={(e) => setValorOfertado(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-base text-blue-800"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Presupuesto Oficial Máximo: \$ {proceso?.presupuestoOficial.toLocaleString('es-CO')} COP
                </span>
              </div>

              <div className="border border-slate-200 p-3 rounded-lg bg-slate-50 space-y-2">
                <span className="font-bold text-slate-800 block">
                  Cargue de Sobres Electrónicos (Simulación):
                </span>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Sobre 1: Requisitos Habilitantes (Jurídico, RUP, Parafiscales)</span>
                  <span className="text-emerald-600 font-bold">5 archivos cargados</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Sobre 2: Propuesta Económica y Formulario de Precios</span>
                  <span className="text-emerald-600 font-bold">1 archivo cargado</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Al hacer clic en radicar, el sistema simulará el sellado de tiempo criptográfico oficial de SECOP II. La oferta no podrá ser modificada tras el cierre.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalRadicar(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                >
                  Confirmar y Radicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Formular Observación */}
      {modalObservacion && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">
              Formular Observación a los Pliegos de Condiciones
            </h3>
            <form onSubmit={handleEnviarObservacion} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Texto de la Observación o Aclaración Jurídica/Técnica:
                </label>
                <textarea
                  rows={4}
                  value={textoObservacion}
                  onChange={(e) => setTextoObservacion(e.target.value)}
                  placeholder="Señores de la entidad, solicitamos comedidamente aclarar el numeral..."
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalObservacion(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  Enviar al SECOP II
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
