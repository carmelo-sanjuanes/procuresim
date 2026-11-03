// Módulo de Liquidación de Contratos Estatales (Bilateral & Unilateral)
// Conforme al Artículo 11 de la Ley 1150 de 2007 y Artículos 60 y 61 de la Ley 80 de 1993
import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Download,
  Building2,
  DollarSign,
  Scale,
  ShieldCheck,
  Printer,
  Info
} from 'lucide-react';
import {
  ContractSettlementEngine,
  type ParametrosLiquidacionContrato
} from '../../core/engines/ContractSettlementEngine';
import { useProcurementStore } from '../../store/useProcurementStore';

export const ContractSettlementView: React.FC = () => {
  const { procesos, procesoSeleccionadoId, proveedores, proveedorActivoId } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];
  const proponenteActivo = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];

  const [parametros, setParametros] = useState<ParametrosLiquidacionContrato>({
    numeroContrato: `CTO-${procesoActivo.numeroProceso}-2025`,
    objetoContrato: procesoActivo.objeto,
    nombreEntidad: procesoActivo.entidad?.nombre || 'Alcaldía Municipal',
    nombreContratista: proponenteActivo.razonSocial,
    nitContratista: proponenteActivo.nit,
    supervisorInterventor: 'Ing. Fernando Gómez (Interventor Externo)',
    valorInicialCOP: procesoActivo.presupuestoOficial,
    adicionesCOP: Math.round(procesoActivo.presupuestoOficial * 0.15),
    valorTotalEjecutadoActasCOP: Math.round(procesoActivo.presupuestoOficial * 1.1),
    anticipoDesembolsadoCOP: Math.round(procesoActivo.presupuestoOficial * 0.2),
    anticipoAmortizadoCOP: Math.round(procesoActivo.presupuestoOficial * 0.2),
    retencionesPracticadasCOP: Math.round(procesoActivo.presupuestoOficial * 0.06),
    mayoresCantidadesReconocidasCOP: 0,
    multasDescontadasCOP: 0,
    tipoLiquidacion: 'BILATERAL_MUTUO_ACUERDO',
    incluyeSalvedades: false,
    textoSalvedades: ''
  });

  const [copiado, setCopiado] = useState(false);

  const balance = ContractSettlementEngine.liquidar(parametros);

  const handleCopiarMinuta = () => {
    navigator.clipboard.writeText(balance.actaLiquidacionTextoOficial);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDescargarMinuta = () => {
    const blob = new Blob([balance.actaLiquidacionTextoOficial], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Acta_Liquidacion_${parametros.numeroContrato}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header del Módulo de Liquidación */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                SIMULADOR DE LIQUIDACIÓN DE CONTRATOS ESTATALES
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                LEY 1150 / ART. 11
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Balance financiero, cruce de cuentas, amortización de anticipos y actas formales de cierre
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDescargarMinuta}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            title="Descargar el texto íntegro del acta de liquidación en formato de texto (.txt)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar (.txt)</span>
          </button>
          <button
            onClick={handleCopiarMinuta}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              copiado
                ? 'bg-emerald-600 text-white'
                : 'bg-lime-400 hover:bg-lime-300 text-slate-950'
            }`}
            title="Copiar el texto oficial del acta al portapapeles para pegarlo en un editor de texto o minuta"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiado ? '¡Copiado!' : 'Copiar Acta'}</span>
          </button>
        </div>
      </div>

      {/* 2. Tarjetas de Resumen Financiero de Liquidación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1"
          title="Valor inicial acordado sumado con todas las adiciones presupuestales legalmente suscritas"
        >
          <span className="text-[11px] font-bold text-slate-500">Valor Total Convenido</span>
          <div className="text-lg font-black text-slate-900">
            ${balance.valorTotalConvenidoCOP.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] text-slate-400">
            Inicial: ${parametros.valorInicialCOP.toLocaleString('es-CO')} + Adiciones: ${parametros.adicionesCOP.toLocaleString('es-CO')}
          </span>
        </div>

        <div
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1"
          title="Valor efectivamente certificado y recibido a satisfacción por el interventor/supervisor"
        >
          <span className="text-[11px] font-bold text-slate-500">Valor Total Ejecutado</span>
          <div className="text-lg font-black text-indigo-600">
            ${balance.valorTotalEjecutadoCOP.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] text-slate-400">
            Avance financiero sobre actas de entrega
          </span>
        </div>

        <div
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1"
          title="Recursos del presupuesto que no fueron ejecutados y deben devolverse al tesoro público (PAC)"
        >
          <span className="text-[11px] font-bold text-slate-500">Saldo a Liberar (Entidad)</span>
          <div className="text-lg font-black text-emerald-600">
            ${balance.saldoLiberarPresupuestoCOP.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">
            Economía / Descompromiso presupuestal
          </span>
        </div>

        <div
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1"
          title="Monto final neto que resulta a favor del contratista una vez cruzados anticipos y retenciones de ley"
        >
          <span className="text-[11px] font-bold text-slate-500">Saldo Neto a Pagar</span>
          <div className="text-lg font-black text-blue-600">
            ${balance.saldoLiquidacionAFavorContratistaCOP.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] text-slate-400">
            {balance.estadoPazYSalvo ? 'Paz y Salvo Integral' : 'Con Salvedades Registradas'}
          </span>
        </div>
      </div>

      {/* 3. Formulario de Parámetros y Visor de Acta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Parámetros Financieros (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm">Parámetros de Liquidación</h2>
            <select
              value={parametros.tipoLiquidacion}
              onChange={(e) => setParametros({ ...parametros, tipoLiquidacion: e.target.value as any })}
              className="text-xs font-bold bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-slate-800"
              title="Seleccione si la liquidación es Bilateral (de común acuerdo) o Unilateral (por resolución)"
            >
              <option value="BILATERAL_MUTUO_ACUERDO">Bilateral (Mutuo Acuerdo)</option>
              <option value="UNILATERAL_POR_RESOLUCION">Unilateral (Por Resolución)</option>
            </select>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor Inicial Contrato:
                </label>
                <input
                  type="number"
                  value={parametros.valorInicialCOP}
                  onChange={(e) => setParametros({ ...parametros, valorInicialCOP: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  title="Valor pactado en la minuta original del contrato"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Adiciones Presupuestales:
                </label>
                <input
                  type="number"
                  value={parametros.adicionesCOP}
                  onChange={(e) => setParametros({ ...parametros, adicionesCOP: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  title="Valor acumulado de otrosíes de adición presupuestal (máximo 50% según Ley 80)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor Ejecutado en Actas:
                </label>
                <input
                  type="number"
                  value={parametros.valorTotalEjecutadoActasCOP}
                  onChange={(e) => setParametros({ ...parametros, valorTotalEjecutadoActasCOP: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-indigo-700"
                  title="Sumatoria de actas parciales de recibo a satisfacción suscritas por el supervisor"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mayores Cantidades ($):
                </label>
                <input
                  type="number"
                  value={parametros.mayoresCantidadesReconocidasCOP}
                  onChange={(e) => setParametros({ ...parametros, mayoresCantidadesReconocidasCOP: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  title="Obras o suministros no contemplados en el ítem inicial pero aprobados por la supervisión"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Anticipo Desembolsado:
                </label>
                <input
                  type="number"
                  value={parametros.anticipoDesembolsadoCOP}
                  onChange={(e) => setParametros({ ...parametros, anticipoDesembolsadoCOP: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-amber-700"
                  title="Valor inicial girado al contratista como anticipo para inversión"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Anticipo Amortizado:
                </label>
                <input
                  type="number"
                  value={parametros.anticipoAmortizadoCOP}
                  onChange={(e) => setParametros({ ...parametros, anticipoAmortizadoCOP: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-emerald-700"
                  title="Valor que ya fue descontado en actas de pago mensuales"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label
                className="flex items-center gap-2 cursor-pointer font-bold text-slate-800"
                title="Marque si el contratista se reserva el derecho de demandar en el Tribunal Contencioso"
              >
                <input
                  type="checkbox"
                  checked={parametros.incluyeSalvedades}
                  onChange={(e) => setParametros({ ...parametros, incluyeSalvedades: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <span>Registrar Salvedades del Contratista (Litigio Pendiente)</span>
              </label>

              {parametros.incluyeSalvedades && (
                <textarea
                  value={parametros.textoSalvedades}
                  onChange={(e) => setParametros({ ...parametros, textoSalvedades: e.target.value })}
                  placeholder="Detalle de la salvedad (ej. El contratista se reserva reclamaciones por mayor permanencia en obra y desequilibrio económico)..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs h-20"
                  title="Redacte con precisión la salvedad jurídica que evita la pérdida del derecho de acción contenciosa"
                />
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Visualizador del Acta Oficial de Liquidación (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                <h2 className="font-bold text-slate-900 text-sm">
                  Minuta Oficial de Liquidación Contractual
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                LISTA PARA FIRMAS
              </span>
            </div>

            <textarea
              value={balance.actaLiquidacionTextoOficial}
              readOnly
              className="w-full h-[400px] p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-700 leading-relaxed resize-none focus:outline-none"
              title="Texto legal generado automáticamente con balance financiero y manifestaciones de paz y salvo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
