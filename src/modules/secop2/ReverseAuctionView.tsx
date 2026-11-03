// Sala de Subasta Inversa Electrónica en Tiempo Real - SECOP II
// Decreto 1082 de 2015 / Selección Abreviada de Menor Cuantía
import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Clock,
  TrendingDown,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  DollarSign,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  ReverseAuctionEngine,
  type EstadoSubastaInversa,
  type LanceSubasta
} from '../../core/engines/ReverseAuctionEngine';
import { useProcurementStore } from '../../store/useProcurementStore';

export const ReverseAuctionView: React.FC = () => {
  const { procesos, procesoSeleccionadoId, registrarAuditoria } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  const [subasta, setSubasta] = useState<EstadoSubastaInversa>(() =>
    ReverseAuctionEngine.crearSubastaInicial(
      procesoActivo.id,
      procesoActivo.numeroProceso,
      procesoActivo.objeto,
      procesoActivo.presupuestoOficial
    )
  );

  const [valorLanceInput, setValorLanceInput] = useState<number>(0);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Inicializar input con una propuesta competitiva sugerida
  useEffect(() => {
    if (subasta.mejorLanceActual) {
      setValorLanceInput(subasta.mejorLanceActual.valorLance - subasta.margenMinimoMejoraCOP);
    }
  }, [subasta.mejorLanceActual]);

  // Temporizador regresivo y simulación de competidores
  useEffect(() => {
    if (subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA') return;

    const interval = setInterval(() => {
      setSubasta((prev) => {
        if (prev.segundosRestantes <= 1) {
          registrarAuditoria(
            'SUBASTA_INVERSA',
            'Cierre de Sala de Subasta',
            `Subasta cerrada. Mejor lance definitivo: \$${prev.mejorLanceActual?.valorLance.toLocaleString('es-CO')} por ${prev.mejorLanceActual?.nombreProponente}.`,
            'SISTEMA'
          );
          return {
            ...prev,
            segundosRestantes: 0,
            estado: 'FINALIZADA'
          };
        }

        // Decrementar 1 segundo y evaluar si un competidor lanza
        const nuevoTiempo = prev.segundosRestantes - 1;
        const subastaConTiempo = { ...prev, segundosRestantes: nuevoTiempo };

        // Cada 3 a 5 segundos hay posibilidad de puja de competidores
        if (nuevoTiempo % 4 === 0) {
          return ReverseAuctionEngine.simularTurnoCompetidores(subastaConTiempo);
        }

        return subastaConTiempo;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [subasta.estado]);

  const handleIniciarSubasta = () => {
    setSubasta((prev) => ({
      ...prev,
      estado: 'EN_CURSO',
      segundosRestantes: 300
    }));
    registrarAuditoria(
      'SUBASTA_INVERSA',
      'Apertura de Sala de Subasta Inversa',
      `Inicio de subasta con valor de arranque de \$${subasta.valorArranque.toLocaleString('es-CO')}.`,
      'ENTIDAD'
    );
  };

  const handleReiniciarSubasta = () => {
    setSubasta(
      ReverseAuctionEngine.crearSubastaInicial(
        procesoActivo.id,
        procesoActivo.numeroProceso,
        procesoActivo.objeto,
        procesoActivo.presupuestoOficial
      )
    );
    setErrorValidacion(null);
    setMensajeExito(null);
  };

  const handleEnviarLanceUsuario = () => {
    setErrorValidacion(null);
    setMensajeExito(null);

    const res = ReverseAuctionEngine.procesarLance(
      subasta,
      'PROV-04', // Sanjuanés Soluciones
      Number(valorLanceInput),
      'USUARIO'
    );

    if (!res.valido) {
      setErrorValidacion(res.motivoRechazo || 'El lance no cumple los requisitos.');
    } else {
      setSubasta(res.subastaActualizada);
      setMensajeExito(
        `¡Lance líder confirmado! Nuevo valor líder: \$${Number(valorLanceInput).toLocaleString('es-CO')}.`
      );
      registrarAuditoria(
        'SUBASTA_INVERSA',
        'Lance Presentado por Licitante',
        `SANJUANÉS SOLUCIONES radicó lance por \$${Number(valorLanceInput).toLocaleString('es-CO')}.`,
        'PROVEEDOR'
      );
    }
  };

  const handleAplicarDecrementoRapido = (multiplicador: number) => {
    if (!subasta.mejorLanceActual) return;
    const nuevoValor = subasta.mejorLanceActual.valorLance - subasta.margenMinimoMejoraCOP * multiplicador;
    setValorLanceInput(nuevoValor);
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const ahorroCOP = subasta.mejorLanceActual
    ? subasta.presupuestoOficial - subasta.mejorLanceActual.valorLance
    : 0;
  const ahorroPct = subasta.mejorLanceActual
    ? Number(((ahorroCOP / subasta.presupuestoOficial) * 100).toFixed(2))
    : 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Cabecera de la Sala de Subasta */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Gavel className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">
                  SALA DE SUBASTA INVERSA ELECTRÓNICA SECOP II
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                  DECRETO 1082 / 2015
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {procesoActivo.numeroProceso} — {procesoActivo.objeto}
              </p>
            </div>
          </div>
        </div>

        {/* Reloj y Estado de la Sala */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 font-mono shadow-md ${
              subasta.estado === 'EN_CURSO'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : subasta.estado === 'PRORROGA'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 animate-pulse'
                : subasta.estado === 'FINALIZADA'
                ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Clock className="w-5 h-5" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {subasta.estado.replace(/_/g, ' ')}
              </div>
              <div className="text-xl font-black">
                {formatearTiempo(subasta.segundosRestantes)}
              </div>
            </div>
          </div>

          {subasta.estado === 'NO_INICIADA' ? (
            <button
              onClick={handleIniciarSubasta}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Abrir Sala de Puja</span>
            </button>
          ) : (
            <button
              onClick={handleReiniciarSubasta}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Reiniciar Sala de Subasta"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Tarjetas de Indicadores Económicos Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Presupuesto Oficial Base</span>
          <div className="text-base font-black text-slate-900 mt-1">
            ${procesoActivo.presupuestoOficial.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] text-slate-400">Techo máximo permitido</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Lance Líder Actual (Menor Valor)</span>
          <div className="text-base font-black text-emerald-600 mt-1">
            ${subasta.mejorLanceActual?.valorLance.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] font-medium text-slate-600 truncate block">
            Líder: {subasta.mejorLanceActual?.nombreProponente}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Ahorro para el Estado</span>
          <div className="text-base font-black text-blue-600 mt-1">
            ${ahorroCOP.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] font-bold text-emerald-600">
            ↓ {ahorroPct}% de economía fiscal
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Margen Mínimo de Mejora</span>
          <div className="text-base font-black text-amber-600 mt-1">
            ${subasta.margenMinimoMejoraCOP.toLocaleString('es-CO')} COP
          </div>
          <span className="text-[10px] text-slate-400">Decremento obligatorio por puja</span>
        </div>
      </div>

      {/* 3. Panel de Acción del Licitante (Pujar) y Sala de Competidores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Columna Izquierda: Panel de Puja para el Usuario (Sanjuanés Soluciones) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-lime-500" />
              <h2 className="font-bold text-slate-900 text-sm">Tu Puesto de Puja</h2>
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-lime-400">
              SANJUANÉS SOLUCIONES
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Valor de tu Próximo Lance (COP):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  disabled={subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA'}
                  value={valorLanceInput}
                  onChange={(e) => setValorLanceInput(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-xl font-bold font-mono text-sm text-slate-900 focus:ring-2 focus:ring-lime-400 focus:outline-none disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Botones de decremento rápido */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 text-[10px]">Atajos:</span>
              <button
                type="button"
                onClick={() => handleAplicarDecrementoRapido(1)}
                disabled={subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA'}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 disabled:opacity-50"
              >
                -1 Margen
              </button>
              <button
                type="button"
                onClick={() => handleAplicarDecrementoRapido(2)}
                disabled={subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA'}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 disabled:opacity-50"
              >
                -2 Márgenes
              </button>
              <button
                type="button"
                onClick={() => handleAplicarDecrementoRapido(3)}
                disabled={subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA'}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 disabled:opacity-50"
              >
                -3 Márgenes
              </button>
            </div>

            {errorValidacion && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorValidacion}</span>
              </div>
            )}

            {mensajeExito && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{mensajeExito}</span>
              </div>
            )}

            <button
              onClick={handleEnviarLanceUsuario}
              disabled={subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA'}
              className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Gavel className="w-4 h-4" />
              <span>Radicar Lance en SECOP II</span>
            </button>
          </div>

          {/* Cuadro de Competidores Habilitados */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">
              Oferentes en Sala ({subasta.participantes.length}):
            </span>
            <div className="space-y-1.5">
              {subasta.participantes.map((p) => {
                const esLider = p.id === subasta.mejorLanceActual?.proponenteId;
                return (
                  <div
                    key={p.id}
                    className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                      esLider
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.colorHex }}
                      />
                      <span className="truncate">{p.nombre}</span>
                    </div>
                    <span className="font-mono text-[11px] shrink-0 ml-2">
                      ${p.valorActual.toLocaleString('es-CO')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Bitácora de Lances en Vivo */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm">
                Registro Oficial de Lances Sucesivos (SECOP II)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total Lances: {subasta.historialLances.length}
            </span>
          </div>

          <div className="overflow-y-auto max-h-[420px] custom-scrollbar flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold sticky top-0">
                <tr>
                  <th className="p-2.5">Hora</th>
                  <th className="p-2.5">Proponente</th>
                  <th className="p-2.5 text-right">Valor del Lance</th>
                  <th className="p-2.5 text-right">Decremento</th>
                  <th className="p-2.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subasta.historialLances.map((lance) => (
                  <tr
                    key={lance.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      lance.esLanceLider ? 'bg-emerald-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="p-2.5 font-mono text-slate-500 text-[11px]">
                      {lance.horaRegistro}
                    </td>
                    <td className="p-2.5 font-medium text-slate-800">
                      {lance.nombreProponente}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      ${lance.valorLance.toLocaleString('es-CO')}
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-600">
                      {lance.decrementoAbsoluto > 0 ? (
                        <span>
                          -${lance.decrementoAbsoluto.toLocaleString('es-CO')} ({lance.decrementoPct}%)
                        </span>
                      ) : (
                        <span className="text-slate-400">Arranque</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {lance.esLanceLider ? (
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ★ LÍDER
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Superado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
