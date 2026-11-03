// Simulador Suplos - Plataforma Líder de Compras Privadas y B2B en Colombia y LatAm
import React, { useState } from 'react';
import {
  Layers,
  Building,
  CheckCircle2,
  Clock,
  Send,
  FileCheck,
  Shield,
  Tag,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';

export const SuplosView: React.FC = () => {
  const { procesos, seleccionarProceso, proveedorActivoId, proveedores } = useProcurementStore();
  const [pestanaSuplos, setPestanaSuplos] = useState<'EVENTOS' | 'HOMOLOGACION' | 'NEGOCIACION'>('EVENTOS');
  const [homologacionCompletada, setHomologacionCompletada] = useState(true);

  const procesosPrivados = procesos.filter(
    (p) => p.modalidad.startsWith('PRIVADA') || p.plataformaOrigen === 'SUPLOS'
  );

  const procesoActivo = procesosPrivados[0] || procesos[0];
  const proveedor = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Cabecera Estilo Suplos */}
      <div className="bg-[#1b365d] text-white px-6 py-3.5 shadow flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-[#2a9d8f] text-white px-2.5 py-1 rounded font-black tracking-wider text-xs">
            SUPLOS B2B
          </div>
          <div>
            <h1 className="text-base font-bold">Portal de Abastecimiento Estratégico Corporativo</h1>
            <p className="text-xs text-slate-300">
              Red privada de compras empresariales (Ecopetrol, Argos, Bancolombia, Terpel)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-[#0f233d] px-3 py-1 rounded text-teal-300 border border-teal-500/30">
            Proveedor: <strong>{proveedor.razonSocial}</strong>
          </span>
          <span className="bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30 font-semibold">
            {homologacionCompletada ? 'Homologado A+' : 'En Validación'}
          </span>
        </div>
      </div>

      {/* Navegación Interna de Suplos */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center space-x-4 text-xs font-semibold">
        <button
          onClick={() => setPestanaSuplos('EVENTOS')}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
            pestanaSuplos === 'EVENTOS'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Eventos de Cotización (RFx)
        </button>
        <button
          onClick={() => setPestanaSuplos('HOMOLOGACION')}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
            pestanaSuplos === 'HOMOLOGACION'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Homologación y Calificación de Proveedores
        </button>
        <button
          onClick={() => setPestanaSuplos('NEGOCIACION')}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
            pestanaSuplos === 'NEGOCIACION'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Mesa de Negociación y BAFO
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl w-full mx-auto p-6 flex-1 text-xs">
        {pestanaSuplos === 'EVENTOS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Eventos Privados */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b">
                Invitaciones a Cotizar ({procesosPrivados.length})
              </h2>

              <div className="space-y-2">
                {procesosPrivados.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => seleccionarProceso(p.id)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-teal-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{p.numeroProceso}</span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                        RFP Privado
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2 mt-1">{p.objeto}</p>
                    <div className="mt-2 text-slate-500 flex justify-between text-[11px]">
                      <span>{p.entidad.nombre}</span>
                      <span className="font-bold text-teal-700">
                        \$ {p.presupuestoOficial.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalle del Evento Seleccionado en Suplos */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2 space-y-4">
              <div className="border-b pb-3">
                <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded text-xs">
                  {procesoActivo?.numeroProceso} - Solicitud de Oferta Vinculante
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">{procesoActivo?.objeto}</h2>
                <p className="text-slate-500 text-[11px]">
                  Comprador: <strong>{procesoActivo?.entidad.nombre}</strong> (Sector Privado Corporativo)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <span className="text-slate-500 block">Presupuesto Estimado:</span>
                  <span className="text-base font-bold text-slate-900">
                    \$ {procesoActivo?.presupuestoOficial.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <span className="text-slate-500 block">Fecha Límite Ronda 1:</span>
                  <span className="font-bold text-rose-600">
                    {procesoActivo?.cronograma.presentacionOfertasLimite}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <span className="text-slate-500 block">Vigencia del Acuerdo:</span>
                  <span className="font-bold text-slate-800">
                    {procesoActivo?.plazoMeses} Meses (Orden de Compra Abierta)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-2">Especificaciones de los Bienes</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2">Ítem</th>
                        <th className="p-2">Descripción Técnica</th>
                        <th className="p-2">Cantidad</th>
                        <th className="p-2">Precio Referencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {procesoActivo?.items.map((i) => (
                        <tr key={i.id} className="hover:bg-slate-50">
                          <td className="p-2 font-mono text-teal-700 font-bold">{i.codigoUNSPSC}</td>
                          <td className="p-2">{i.detalleTecnico}</td>
                          <td className="p-2 font-bold">{i.cantidad} {i.unidadMedida}</td>
                          <td className="p-2">\$ {(i.precioUnitarioEstimado || 0).toLocaleString('es-CO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-teal-900 block">
                    ¿Deseas enviar tu oferta comercial a la mesa de compras de Suplos?
                  </span>
                  <span className="text-teal-700 text-[11px]">
                    Las empresas en Suplos negocian condiciones comerciales en rondas directas de BAFO.
                  </span>
                </div>
                <button
                  onClick={() => alert('Oferta cargada en la bóveda de Suplos para evaluación del comprador.')}
                  className="px-4 py-2 bg-[#2a9d8f] hover:bg-[#21867a] text-white rounded-lg font-bold shadow transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Radicar Cotización Suplos
                </button>
              </div>
            </div>
          </div>
        )}

        {pestanaSuplos === 'HOMOLOGACION' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              Estado de Homologación de Proveedor en Suplos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 block">Capacidad Financiera y Legal</span>
                <p className="text-slate-600 text-[11px]">
                  RUT, Estados Financieros auditados y Certificación Bancaria al 100% aprobados.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 block">Cumplimiento SAGRILAFT & PTEE</span>
                <p className="text-slate-600 text-[11px]">
                  Consulta en listas restrictivas (OFAC, ONU, Interpol, Contraloría) sin coincidencias.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 block">SST & Estándares Ambientales</span>
                <p className="text-slate-600 text-[11px]">
                  Puntaje RUC / Sistema de Gestión de Seguridad y Salud en el Trabajo calificado en 96/100.
                </p>
              </div>
            </div>
          </div>
        )}

        {pestanaSuplos === 'NEGOCIACION' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              Ronda de Mejores Ofertas Finales (BAFO - Best and Final Offer)
            </h2>
            <p className="text-slate-600 text-xs">
              El comprador corporativo ha abierto una ventana de negociación de 48 horas para ajustar precios unitarios por volumen.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900 block">Oferta Base Actual: \$ 820.000.000 COP</span>
                <span className="text-amber-700 text-[11px]">Objetivo del Comprador: \$ 785.000.000 COP con pronto pago a 30 días.</span>
              </div>
              <button
                onClick={() => alert('Nueva postura BAFO enviada a la junta de compras.')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold"
              >
                Presentar Postura BAFO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
