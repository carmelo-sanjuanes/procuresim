// Simulador SAP Ariba Sourcing & Subasta Inversa Electrónica en Vivo (Reverse Auction)
import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  TrendingDown,
  Award,
  DollarSign,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle,
  ArrowDown
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';

export const AribaView: React.FC = () => {
  const { proveedorActivoId, proveedores } = useProcurementStore();
  const proponente = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];

  // Estado de la Subasta Inversa en Vivo
  const [tiempoSegundos, setTiempoSegundos] = useState(180); // 3 minutos
  const [subastaEnCurso, setSubastaEnCurso] = useState(false);
  const [precioTecho] = useState(620000000);
  const [miPostura, setMiPostura] = useState(590000000);
  const [nuevaPosturaInput, setNuevaPosturaInput] = useState(575000000);

  // Competidores simulados en vivo
  const [competidores, setCompetidores] = useState([
    { id: 'COMP-1', nombre: 'Proveedor Competidor Alfa', postura: 580000000, esUsuario: false },
    { id: 'COMP-2', nombre: 'Proveedor Competidor Beta', postura: 595000000, esUsuario: false },
    { id: 'COMP-USER', nombre: proponente.razonSocial, postura: 590000000, esUsuario: true }
  ]);

  // Cronómetro regresivo
  useEffect(() => {
    let intervalo: any;
    if (subastaEnCurso && tiempoSegundos > 0) {
      intervalo = setInterval(() => {
        setTiempoSegundos((prev) => {
          if (prev <= 1) {
            setSubastaEnCurso(false);
            return 0;
          }
          return prev - 1;
        });

        // Simulación de posturas automáticas de los competidores si el tiempo corre
        if (Math.random() < 0.15 && tiempoSegundos > 10) {
          setCompetidores((prev) => {
            const menorActual = Math.min(...prev.map((c) => c.postura));
            return prev.map((c) => {
              if (!c.esUsuario && Math.random() < 0.4) {
                const reduccion = Math.round((Math.random() * 2000000 + 500000) / 100000) * 100000;
                const nueva = menorActual - reduccion;
                if (nueva > 520000000) {
                  return { ...c, postura: nueva };
                }
              }
              return c;
            });
          });
        }
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [subastaEnCurso, tiempoSegundos]);

  // Ordenar competidores por postura ascendente (menor precio = Rank 1)
  const ranking = [...competidores].sort((a, b) => a.postura - b.postura);
  const miRank = ranking.findIndex((c) => c.esUsuario) + 1;
  const mejorPostura = ranking[0].postura;

  const enviarNuevaPostura = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaPosturaInput >= miPostura) {
      alert('La postura en una subasta inversa debe ser MENOR que tu postura anterior.');
      return;
    }
    setMiPostura(nuevaPosturaInput);
    setCompetidores((prev) =>
      prev.map((c) => (c.esUsuario ? { ...c, postura: nuevaPosturaInput } : c))
    );
    setNuevaPosturaInput(Math.max(500000000, nuevaPosturaInput - 2000000));
  };

  const formatearTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const reiniciarSubasta = () => {
    setTiempoSegundos(180);
    setSubastaEnCurso(false);
    setMiPostura(590000000);
    setNuevaPosturaInput(575000000);
    setCompetidores([
      { id: 'COMP-1', nombre: 'Proveedor Competidor Alfa', postura: 580000000, esUsuario: false },
      { id: 'COMP-2', nombre: 'Proveedor Competidor Beta', postura: 595000000, esUsuario: false },
      { id: 'COMP-USER', nombre: proponente.razonSocial, postura: 590000000, esUsuario: true }
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-100 flex flex-col font-sans">
      {/* Cabecera SAP Ariba */}
      <div className="bg-[#001e3d] text-white px-6 py-3.5 shadow border-b-2 border-[#f0ab00] flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-[#f0ab00] text-slate-900 px-2.5 py-1 rounded font-black tracking-wider text-xs">
            SAP ARIBA SOURCING
          </div>
          <div>
            <h1 className="text-base font-bold">Subasta Inversa Electrónica Dinámica (Live Reverse Auction)</h1>
            <p className="text-xs text-slate-300">
              Evento No. ARIBA-RFQ-9902 | Cloud Enterprise Services
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-300">
            Usuario: <strong>{proponente.razonSocial}</strong>
          </span>
          <span className="bg-[#0a6ed1] text-white px-2 py-0.5 rounded font-bold">
            Ariba Network
          </span>
        </div>
      </div>

      <div className="p-6 max-w-7xl w-full mx-auto flex-1 space-y-6 text-xs">
        {/* Panel de Control de la Subasta */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Cronómetro */}
          <div className="p-4 bg-slate-900 text-white rounded-xl text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#f0ab00]" />
              Tiempo Restante
            </span>
            <div className="text-3xl font-mono font-black text-[#f0ab00]">
              {formatearTiempo(tiempoSegundos)}
            </div>
            <span className="text-[10px] text-slate-400">
              {tiempoSegundos === 0 ? 'SUBASTA FINALIZADA' : subastaEnCurso ? 'EN CURSO (POSTURAS EN VIVO)' : 'PAUSADO'}
            </span>
          </div>

          {/* Posición / Ranking */}
          <div className={`p-4 rounded-xl border text-center space-y-1 ${
            miRank === 1 ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Tu Posición Actual
            </span>
            <div className={`text-3xl font-black ${miRank === 1 ? 'text-emerald-700' : 'text-amber-700'}`}>
              Rango #{miRank}
            </div>
            <span className="text-[11px] font-semibold text-slate-600">
              {miRank === 1 ? '¡Estás liderando el evento!' : 'Se requiere postura más baja'}
            </span>
          </div>

          {/* Mejor Oferta del Mercado */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Oferta Líder (Menor Precio)
            </span>
            <div className="text-xl font-bold text-slate-900 font-mono">
              \$ {mejorPostura.toLocaleString('es-CO')} COP
            </div>
            <span className="text-[11px] text-slate-500">
              Presupuesto Techo: \$ {precioTecho.toLocaleString('es-CO')}
            </span>
          </div>

          {/* Controles del Simulador */}
          <div className="space-y-2">
            {!subastaEnCurso && tiempoSegundos > 0 ? (
              <button
                onClick={() => setSubastaEnCurso(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Play className="w-4 h-4" />
                Iniciar Subasta Inversa
              </button>
            ) : subastaEnCurso ? (
              <button
                onClick={() => setSubastaEnCurso(false)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
              >
                Pausar Simulación
              </button>
            ) : (
              <button
                onClick={reiniciarSubasta}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar Subasta
              </button>
            )}
            <span className="text-[10px] text-slate-400 block text-center">
              Mecanismo oficial SAP Ariba con extensión de tiempo por regla Overtime
            </span>
          </div>
        </div>

        {/* Tablero de Posturas y Envío */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de Lanzamiento de Postura Decreciente */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-[#0a6ed1]" />
              Formular Nueva Postura en SAP Ariba
            </h3>

            <div className="space-y-1">
              <span className="text-slate-500">Tu Última Postura Registrada:</span>
              <div className="text-lg font-bold text-slate-800 font-mono">
                \$ {miPostura.toLocaleString('es-CO')} COP
              </div>
            </div>

            <form onSubmit={enviarNuevaPostura} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nueva Oferta Decreciente (COP):
                </label>
                <input
                  type="number"
                  value={nuevaPosturaInput}
                  onChange={(e) => setNuevaPosturaInput(Number(e.target.value))}
                  disabled={!subastaEnCurso}
                  className="w-full p-2.5 border border-slate-300 rounded font-bold text-sm text-blue-900 focus:ring-2 focus:ring-[#0a6ed1]"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Debe ser estrictamente menor a \$ {miPostura.toLocaleString('es-CO')}
                </span>
              </div>

              <button
                type="submit"
                disabled={!subastaEnCurso}
                className={`w-full py-2.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-1.5 ${
                  subastaEnCurso
                    ? 'bg-[#0a6ed1] hover:bg-[#0854a0] shadow'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <ArrowDown className="w-4 h-4" />
                Enviar Postura a la Sala de Subasta
              </button>
            </form>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
              <strong>Regla Ariba:</strong> Todas las posturas son vinculantes e irrevocables. El comprador adjudicará al proponente que conserve el Rango #1 al agotar el tiempo.
            </div>
          </div>

          {/* Tabla de Ranking en Tiempo Real */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
              <span>Tabla de Posiciones en Vivo (Live Bidding Cockpit)</span>
              <span className="text-[11px] text-slate-400 font-normal">Actualización continua</span>
            </h3>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">Rango</th>
                    <th className="p-2.5">Proponente (Blind Auction)</th>
                    <th className="p-2.5 text-right">Última Postura</th>
                    <th className="p-2.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ranking.map((prov, index) => (
                    <tr
                      key={prov.id}
                      className={prov.esUsuario ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2.5 font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          index === 0
                            ? 'bg-emerald-100 text-emerald-800 font-black'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-2.5">
                        {prov.esUsuario ? (
                          <span className="text-blue-900 font-bold">{prov.nombre} (Tú)</span>
                        ) : (
                          <span className="text-slate-500 font-mono">Participante #{index + 1}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        \$ {prov.postura.toLocaleString('es-CO')} COP
                      </td>
                      <td className="p-2.5 text-center">
                        {index === 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            Líder
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Superado</span>
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
    </div>
  );
};
