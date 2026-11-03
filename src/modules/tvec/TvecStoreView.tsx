// Módulo de la Tienda Virtual del Estado Colombiano (TVEC) & Acuerdos Marco de Precios
// Conforme al Decreto 1082 de 2015 (Art. 2.2.1.2.1.2.7) - Compra por Catálogo de CCE
import React, { useState } from 'react';
import {
  ShoppingBag,
  Layers,
  TrendingDown,
  FileCheck,
  CheckCircle2,
  DollarSign,
  Building2,
  Truck,
  Sparkles,
  Download,
  Info,
  ChevronRight,
  Printer
} from 'lucide-react';
import {
  TvecCatalogEngine,
  type ItemCatalogoAMP,
  type OrdenCompraTVEC
} from '../../core/engines/TvecCatalogEngine';
import { useProcurementStore } from '../../store/useProcurementStore';

export const TvecStoreView: React.FC = () => {
  const { entidades, procesos, procesoSeleccionadoId } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];
  const entidadActiva = procesoActivo.entidad || entidades[0];

  const [catalogo] = useState<ItemCatalogoAMP[]>(TvecCatalogEngine.ACUERDOS_MARCO_VIGENTES);
  const [itemSeleccionado, setItemSeleccionado] = useState<ItemCatalogoAMP>(catalogo[0]);
  const [cantidad, setCantidad] = useState<number>(25);
  const [departamento, setDepartamento] = useState<string>('Bogotá D.C.');
  const [ordenGenerada, setOrdenGenerada] = useState<OrdenCompraTVEC | null>(null);

  // Simulación de evento de cotización de catálogo (Operación Secundaria)
  const eventoCotizacion = TvecCatalogEngine.simularOperacionSecundaria(
    itemSeleccionado,
    cantidad,
    departamento
  );

  const handleGenerarOrdenCompra = () => {
    const orden = TvecCatalogEngine.generarOrdenCompra(
      itemSeleccionado,
      eventoCotizacion.mejorOferta,
      cantidad,
      entidadActiva.nombre,
      entidadActiva.nit
    );
    setOrdenGenerada(orden);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header de la Tienda Virtual */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                TIENDA VIRTUAL DEL ESTADO COLOMBIANO (TVEC)
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                ACUERDOS MARCO CCE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Catálogo oficial de bienes/servicios y Operación Secundaria según Decreto 1082 de 2015
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate max-w-xs" title={`Entidad Compradora: ${entidadActiva.nombre}`}>
            {entidadActiva.nombre}
          </span>
        </div>
      </div>

      {/* 2. Catálogo de Acuerdos Marco Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {catalogo.map((item) => {
          const esActivo = item.id === itemSeleccionado.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setItemSeleccionado(item);
                setOrdenGenerada(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                esActivo
                  ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
              title={`Clic para seleccionar el ${item.nombreAcuerdoMarco} y configurar el pedido`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400">
                  {item.acuerdoMarcoId}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  UNSPSC: {item.codigoUNSPSC}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1">
                {item.nombreAcuerdoMarco}
              </h3>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                {item.descripcionProducto}
              </p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 text-[10px]">Precio Techo CCE:</span>
                <span className="font-mono font-bold text-slate-900">
                  ${item.precioTechoUnitarioCOP.toLocaleString('es-CO')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Panel de Operación Secundaria (Evento de Cotización de Catálogo) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Configuración del Pedido (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              Configuración de Operación Secundaria
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Producto del Acuerdo Marco:
              </label>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-800">
                {itemSeleccionado.descripcionProducto}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {itemSeleccionado.especificacionesTecnicas}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cantidad ({itemSeleccionado.unidadMedida}):
                </label>
                <input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  title="Ingrese la cantidad exacta de unidades a adquirir según el estudio de necesidad"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Departamento de Entrega:
                </label>
                <select
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-slate-800 bg-slate-50 focus:outline-none"
                  title="Seleccione el departamento donde el proveedor adjudicatario debe entregar el pedido"
                >
                  <option value="Bogotá D.C.">Bogotá D.C.</option>
                  <option value="Antioquia">Antioquia</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                  <option value="Valle del Cauca">Valle del Cauca</option>
                  <option value="Santander">Santander</option>
                  <option value="Atlántico">Atlántico</option>
                </select>
              </div>
            </div>

            {/* Ahorro Estimado para la Entidad */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-700">
                  Ahorro en Operación Secundaria:
                </span>
                <span className="font-mono font-black text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  ↓ {eventoCotizacion.ahorroTotalPct}%
                </span>
              </div>
              <div className="text-lg font-black text-emerald-700 font-mono">
                ${eventoCotizacion.ahorroTotalEventoCOP.toLocaleString('es-CO')} COP
              </div>
              <p className="text-[10px] text-emerald-600">
                Economía pública lograda frente al precio techo fijado por CCE
              </p>
            </div>

            <button
              onClick={handleGenerarOrdenCompra}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              title="Expedir la Orden de Compra oficial de la Tienda Virtual en favor del mejor proveedor"
            >
              <FileCheck className="w-4 h-4" />
              <span>Expedir Orden de Compra TVEC</span>
            </button>
          </div>
        </div>

        {/* Columna Derecha: Ranking de Cotizaciones de Proveedores del Catálogo (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-sm">
                  Resultado del Evento de Cotización en Línea (TVEC)
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {eventoCotizacion.rankingProveedores.length} Proveedores Adjudicatarios
              </span>
            </div>

            <div className="space-y-2.5">
              {eventoCotizacion.rankingProveedores.map((item, idx) => {
                const esGanador = idx === 0;
                return (
                  <div
                    key={item.proveedor.proveedorId}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      esGanador
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/40'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        {esGanador && (
                          <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] bg-emerald-600 text-white">
                            1° LUGAR
                          </span>
                        )}
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {item.proveedor.nombreProveedor}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        NIT: {item.proveedor.nit} | Tiempo de Entrega: {item.proveedor.tiempoEntregaDias} días
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <div className="text-xs font-mono font-black text-slate-900">
                        ${item.costoTotalCOP.toLocaleString('es-CO')}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Unit: ${item.costoUnitario.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visor de Orden de Compra Generada */}
          {ordenGenerada && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-lime-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ORDEN DE COMPRA TVEC EXPEDIDA</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {ordenGenerada.numeroOrden}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div><strong>Adjudicatario:</strong> {ordenGenerada.proveedorSeleccionado} ({ordenGenerada.nitProveedor})</div>
                <div><strong>Total con IVA (19%):</strong> ${ordenGenerada.totalCOP.toLocaleString('es-CO')} COP</div>
                <div><strong>Fecha Límite de Entrega:</strong> {ordenGenerada.fechaEntregaMaxima}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
