// Módulo Especializado de Cotizaciones y Estudio de Mercado (Colombia Compra Eficiente)
import React, { useState } from 'react';
import {
  TrendingUp,
  PlusCircle,
  FileSpreadsheet,
  Calculator,
  Building,
  CheckCircle2,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { MarketStudyEngine } from '../../core/engines/MarketStudyEngine';
import type { ItemRequerimiento, CotizacionProveedor } from '../../core/domain/types';

export const MarketStudyView: React.FC = () => {
  const { procesos, procesoSeleccionadoId, seleccionarProceso, guardarEstudioMercado } = useProcurementStore();
  const proceso = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  const [items, setItems] = useState<ItemRequerimiento[]>(proceso?.items || []);
  const [cotizaciones, setCotizaciones] = useState<CotizacionProveedor[]>([]);
  const [metodologia, setMetodologia] = useState<'MEDIA_ARITMETICA' | 'MEDIANA' | 'MENOR_VALOR'>('MEDIA_ARITMETICA');

  // Estado para nuevo ítem
  const [nuevoCodigo, setNuevoCodigo] = useState('43211500');
  const [nuevaDesc, setNuevaDesc] = useState('Equipos de cómputo corporativo');
  const [nuevoDetalle, setNuevoDetalle] = useState('Intel Core i7, 32GB RAM, 1TB SSD');
  const [nuevaCantidad, setNuevaCantidad] = useState(15);
  const [nuevoPrecioEst, setNuevoPrecioEst] = useState(4500000);

  const handleAgregarItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ItemRequerimiento = {
      id: `ITM-MKT-${Date.now()}`,
      codigoUNSPSC: nuevoCodigo,
      descripcionUNSPSC: nuevaDesc,
      detalleTecnico: nuevoDetalle,
      unidadMedida: 'UNIDAD',
      cantidad: nuevaCantidad,
      precioUnitarioEstimado: nuevoPrecioEst
    };
    setItems([...items, item]);
  };

  const handleGenerarCotizacionesSimuladas = () => {
    const cots = MarketStudyEngine.generarCotizacionesSimuladas(items);
    setCotizaciones(cots);
  };

  // Procesar estadísticas y presupuesto oficial
  const analisis = MarketStudyEngine.procesarEstudioMercado(
    proceso.numeroProceso,
    proceso.objeto,
    items,
    cotizaciones,
    metodologia
  );

  const handleGuardarEstudio = () => {
    guardarEstudioMercado(analisis);
    alert('¡Estudio de mercado y presupuesto oficial guardados con éxito!');
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Cabecera del Módulo */}
      <div className="bg-[#1e1b4b] text-white px-6 py-4 shadow flex flex-wrap items-center justify-between border-b border-indigo-900">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold">
              Módulo de Cotizaciones y Estudio del Sector (Presupuesto Oficial CCE)
            </h1>
            <p className="text-xs text-indigo-200">
              Solicitud de cotizaciones, muestreo estadístico (medias/medianas) y fijación justificada de precios
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-indigo-200">Vincular a Proceso:</span>
          <select
            value={procesoSeleccionadoId}
            onChange={(e) => {
              seleccionarProceso(e.target.value);
              const p = procesos.find((pr) => pr.id === e.target.value);
              if (p) setItems(p.items);
            }}
            className="bg-indigo-950 text-white font-medium border border-indigo-700 rounded px-2.5 py-1 focus:outline-none"
          >
            {procesos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.numeroProceso} - {p.objeto.substring(0, 45)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 max-w-7xl w-full mx-auto flex-1 space-y-6 text-xs">
        {/* Paso 1: Ítems a Cotizar con UNSPSC */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                1. Especificación Técnica de Bienes o Servicios a Cotizar
              </h2>
              <p className="text-slate-500 text-[11px]">
                Defina los ítems clasificados bajo el estándar UNSPSC de Colombia Compra Eficiente
              </p>
            </div>
            <button
              onClick={handleGenerarCotizacionesSimuladas}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Generar Cotizaciones de Proveedores del Mercado (3-4 Cotizaciones)
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-2.5">Código UNSPSC</th>
                  <th className="p-2.5">Descripción del Bien/Servicio</th>
                  <th className="p-2.5">Especificación Técnica</th>
                  <th className="p-2.5 text-center">Cantidad</th>
                  <th className="p-2.5 text-right">Precio Ref. Unitario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-indigo-700">{i.codigoUNSPSC}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{i.descripcionUNSPSC}</td>
                    <td className="p-2.5 text-slate-600 max-w-xs">{i.detalleTecnico}</td>
                    <td className="p-2.5 text-center font-bold">
                      {i.cantidad} {i.unidadMedida}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      \$ {(i.precioUnitarioEstimado || 0).toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paso 2: Cotizaciones Recibidas del Mercado */}
        {cotizaciones.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
              <span>2. Cotizaciones Formales Recibidas de Operadores Económicos ({cotizaciones.length})</span>
              <span className="text-slate-400 font-normal text-xs">Muestreo real con NIT y desgloses</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cotizaciones.map((cot, idx) => (
                <div key={cot.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 block truncate" title={cot.proveedorNombre}>
                      {cot.proveedorNombre}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>NIT: {cot.nit}</div>
                    <div>Contacto: {cot.contacto}</div>
                    <div>Fecha: {cot.fechaCotizacion}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Subtotal: \$ {cot.subtotal.toLocaleString('es-CO')}</span>
                    <span className="text-[10px] text-slate-400 block">IVA (19%): \$ {cot.valorIVA.toLocaleString('es-CO')}</span>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      Total: \$ {cot.valorTotal.toLocaleString('es-CO')} COP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 3: Análisis Estadístico y Presupuesto Oficial */}
        {cotizaciones.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  3. Matriz Comparativa y Cálculo Estadístico del Presupuesto
                </h2>
                <p className="text-slate-500 text-[11px]">
                  Cálculo automático de media aritmética, mediana y dispersión según lineamientos CCE
                </p>
              </div>

              {/* Selector de Metodología */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Metodología de Cálculo:</span>
                <select
                  value={metodologia}
                  onChange={(e) => setMetodologia(e.target.value as any)}
                  className="bg-indigo-50 border border-indigo-300 font-bold text-indigo-900 rounded p-1.5 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MEDIA_ARITMETICA">Media Aritmética (Promedio General)</option>
                  <option value="MEDIANA">Mediana (Filtro de Valores Atípicos)</option>
                  <option value="MENOR_VALOR">Menor Valor Cotizado</option>
                </select>
              </div>
            </div>

            {/* Tabla de Resultados Estadísticos por Ítem */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">Ítem</th>
                    <th className="p-2.5 text-right">Precio Mínimo</th>
                    <th className="p-2.5 text-right">Precio Máximo</th>
                    <th className="p-2.5 text-right">Media Aritmética</th>
                    <th className="p-2.5 text-right">Mediana</th>
                    <th className="p-2.5 text-center">Desv. Estándar</th>
                    <th className="p-2.5 text-right bg-indigo-50 text-indigo-900">Precio Sugerido Unitario</th>
                    <th className="p-2.5 text-right bg-indigo-100 text-indigo-950 font-bold">Subtotal Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analisis.resultadosPorItem.map((res) => {
                    const itm = items.find((i) => i.id === res.itemId);
                    return (
                      <tr key={res.itemId} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">{itm?.descripcionUNSPSC}</td>
                        <td className="p-2.5 text-right font-mono">\$ {res.precioMinimo.toLocaleString('es-CO')}</td>
                        <td className="p-2.5 text-right font-mono">\$ {res.precioMaximo.toLocaleString('es-CO')}</td>
                        <td className="p-2.5 text-right font-mono font-semibold">
                          \$ {res.precioPromedio.toLocaleString('es-CO')}
                        </td>
                        <td className="p-2.5 text-right font-mono font-semibold">
                          \$ {res.precioMediana.toLocaleString('es-CO')}
                        </td>
                        <td className="p-2.5 text-center font-mono text-slate-500">
                          \$ {res.desviacionEstandar.toLocaleString('es-CO')} ({res.coeficienteVariacion}%)
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-indigo-700 bg-indigo-50/50">
                          \$ {res.precioSeleccionado.toLocaleString('es-CO')}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-indigo-950 bg-indigo-100/50">
                          \$ {res.subtotalEstimado.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tarjeta del Presupuesto Total Calculado */}
            <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-bold text-indigo-950 block text-sm">
                  Presupuesto Oficial Total Sugerido para los Estudios Previos:
                </span>
                <p className="text-indigo-800 text-[11px] max-w-2xl mt-1">
                  {analisis.justificacionEconomica}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-mono font-black text-indigo-900">
                  \$ {analisis.presupuestoTotalEstimado.toLocaleString('es-CO')} COP
                </div>
                <button
                  onClick={handleGuardarEstudio}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Guardar e Integrar a los Estudios Previos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
