// Aviso de privacidad y control de los datos guardados en este equipo (derecho de supresión).
import React, { useEffect, useRef, useState } from 'react';
import { Lock, Trash2, X } from 'lucide-react';
import { borrarDatosDeEsteEquipo, clavesDeProcureSim } from '../core/seguridad/datosLocales';

const contarClaves = (): number => {
  try {
    return clavesDeProcureSim(window.localStorage).length;
  } catch {
    return 0;
  }
};

export const TusDatosPrivacidad: React.FC<{ compacto?: boolean }> = ({ compacto = false }) => {
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    cerrarRef.current?.focus();
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto]);

  const borrar = () => {
    borrarDatosDeEsteEquipo();
    // Recargar sin volver a guardar nada: la aplicación abre como nueva.
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setConfirmando(false);
          setAbierto(true);
        }}
        className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl font-semibold transition-all text-xs cursor-pointer"
        title="Dónde quedan tus datos y cómo borrarlos"
      >
        <Lock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
        <span className={compacto ? 'hidden lg:inline' : 'hidden sm:inline'}>Tus datos</span>
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setAbierto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-tus-datos"
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-slate-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="titulo-tus-datos" className="text-lg font-bold text-slate-900">
                Tus datos se quedan en este equipo
              </h2>
              <button
                ref={cerrarRef}
                type="button"
                onClick={() => setAbierto(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
              <li>
                Lo que escribes (procesos, expedientes, ofertas, alarmas y notas) se guarda solo en este navegador.
                No se envía a ningún servidor de ProcureSim.
              </li>
              <li>
                Cuando usas un buscador en vivo, el término que escribes se consulta en el portal público de Datos
                Abiertos de Colombia (datos.gov.co). No escribas ahí datos personales.
              </li>
              <li>
                Si usas un equipo compartido, borra tus datos al terminar o usa una ventana privada.
              </li>
              <li>
                Para guardar una copia, usa «Exportar» o «Mis expedientes». El archivo queda en tu equipo y tú decides con quién lo compartes.
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
              {!confirmando ? (
                <button
                  type="button"
                  onClick={() => setConfirmando(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-rose-700 border border-rose-300 hover:bg-rose-100"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Borrar mis datos de este equipo
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-rose-900">
                    Se borrarán todos tus procesos, expedientes, alarmas, búsquedas y preferencias de este navegador
                    ({contarClaves()} registros). No se puede deshacer.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={borrar}
                      className="flex-1 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-800"
                    >
                      Sí, borrar todo
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmando(false)}
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
