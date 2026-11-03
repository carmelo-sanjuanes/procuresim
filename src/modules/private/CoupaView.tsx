// Simulador Coupa - Gestión Integral del Gasto y Aprobaciones Multinivel (Spend Management)
import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';

export const CoupaView: React.FC = () => {
  const { procesos } = useProcurementStore();
  const procesoCoupa = procesos.find((p) => p.plataformaOrigen === 'COUPA') || procesos[0];

  const [requisicionAprobadaNivel1, setRequisicionAprobadaNivel1] = useState(true);
  const [requisicionAprobadaNivel2, setRequisicionAprobadaNivel2] = useState(true);
  const [requisicionAprobadaNivel3, setRequisicionAprobadaNivel3] = useState(false);
  const [ordenCompraEmitida, setOrdenCompraEmitida] = useState(false);

  const presupuestoTotal = procesoCoupa.presupuestoOficial;
  const gastoComprometido = 185000000;
  const gastoDisponible = presupuestoTotal - gastoComprometido;

  const emitirOrdenCompra = () => {
    setRequisicionAprobadaNivel3(true);
    setOrdenCompraEmitida(true);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Cabecera Coupa */}
      <div className="bg-[#0b2341] text-white px-6 py-3.5 shadow flex flex-wrap items-center justify-between border-b-2 border-[#ff6200]">
        <div className="flex items-center space-x-3">
          <div className="bg-[#ff6200] text-white px-2.5 py-1 rounded font-black tracking-wider text-xs">
            COUPA SPEND
          </div>
          <div>
            <h1 className="text-base font-bold">Business Spend Management & Procure-to-Pay (P2P)</h1>
            <p className="text-xs text-slate-300">
              Control presupuestal, matriz de aprobación y órdenes de compra automáticas
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-[#1a385f] px-3 py-1 rounded text-orange-200 border border-orange-500/30">
            Módulo: <strong>Requisition & Purchase Order</strong>
          </span>
        </div>
      </div>

      <div className="p-6 max-w-7xl w-full mx-auto flex-1 space-y-6 text-xs">
        {/* Métricas Presupuestales en Coupa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-500 font-semibold block">Presupuesto Anual Asignado:</span>
            <div className="text-xl font-bold text-slate-900 font-mono">
              \$ {presupuestoTotal.toLocaleString('es-CO')} COP
            </div>
            <span className="text-[11px] text-slate-400">Centro de Costos: 4100 - Operaciones Logísticas</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-500 font-semibold block">Gasto Comprometido en Órdenes:</span>
            <div className="text-xl font-bold text-amber-600 font-mono">
              \$ {gastoComprometido.toLocaleString('es-CO')} COP
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${(gastoComprometido / presupuestoTotal) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-500 font-semibold block">Presupuesto Disponible:</span>
            <div className="text-xl font-bold text-emerald-600 font-mono">
              \$ {gastoDisponible.toLocaleString('es-CO')} COP
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Fondos suficientes para requisición</span>
          </div>
        </div>

        {/* Flujo de Aprobación Multinivel (Workflow) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
            <span>Matriz de Aprobación Corporativa (Approval Chain)</span>
            <span className="text-[11px] text-slate-500 font-mono">
              Requisición No. {procesoCoupa.numeroProceso}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nivel 1 */}
            <div className="p-4 rounded-xl border bg-emerald-50/60 border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Nivel 1: Líder de Área</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-slate-600 text-[11px]">
                Validación de necesidad operativa y especificaciones técnicas.
              </p>
              <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                Aprobado por Carlos Restrepo (12/01/2025)
              </span>
            </div>

            {/* Nivel 2 */}
            <div className="p-4 rounded-xl border bg-emerald-50/60 border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Nivel 2: Gerente Financiero</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-slate-600 text-[11px]">
                Verificación de suficiencia de caja y centro de costos.
              </p>
              <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                Aprobado por Luisa Fernanda Hoyos (15/01/2025)
              </span>
            </div>

            {/* Nivel 3 */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              requisicionAprobadaNivel3
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/60 border-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Nivel 3: Vicepresidencia / CFO</span>
                {requisicionAprobadaNivel3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <p className="text-slate-600 text-[11px]">
                Aprobación obligatoria para órdenes mayores a \$ 200.000.000 COP.
              </p>
              {requisicionAprobadaNivel3 ? (
                <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Aprobado por Vicepresidencia
                </span>
              ) : (
                <button
                  onClick={emitirOrdenCompra}
                  className="w-full py-1.5 bg-[#ff6200] hover:bg-[#e05600] text-white font-bold rounded text-xs shadow transition-colors"
                >
                  Aprobar y Emitir Orden de Compra (PO)
                </button>
              )}
            </div>
          </div>

          {/* Estado de Orden de Compra */}
          {ordenCompraEmitida && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Orden de Compra Generada: PO-COUPA-2025-00918
                  </h4>
                  <p className="text-emerald-800 text-[11px]">
                    Despachada automáticamente al proveedor homologado vía Coupa Supplier Network (CSN) con integración ERP SAP/Oracle.
                  </p>
                </div>
              </div>
              <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded text-xs">
                PO Activa
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
