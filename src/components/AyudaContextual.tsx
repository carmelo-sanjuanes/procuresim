// «¿Lo vas a necesitar?»: pregunta breve en el momento oportuno.
// Sí → deja el botón visible. No → indica cómo llamar la herramienta después.
import React from 'react';
import { HERRAMIENTAS, type IdHerramienta } from '../core/domain/herramientas';

interface Props {
  id: IdHerramienta;
  respuesta?: 'SI' | 'NO';
  onResponder: (r: 'SI' | 'NO') => void;
  onAbrir: () => void;
}

export const AyudaContextual: React.FC<Props> = ({ id, respuesta, onResponder, onAbrir }) => {
  const h = HERRAMIENTAS[id];
  if (respuesta === 'SI') {
    return (
      <div data-ayuda={id} data-estado="SI" className="flex items-center justify-between gap-3 text-xs">
        <button onClick={onAbrir} className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-900 text-slate-800 font-bold cursor-pointer">
          {h.boton}
        </button>
        <button onClick={() => onResponder('NO')} className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer">
          Ocultar
        </button>
      </div>
    );
  }
  if (respuesta === 'NO') {
    return (
      <p data-ayuda={id} data-estado="NO" className="text-[11px] text-slate-400">
        Entendido. Si la necesitas después: <kbd className="px-1 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-[10px]">Ctrl + K</kbd> y escribe «{h.busqueda}».{' '}
        <button onClick={() => onResponder('SI')} className="underline hover:text-slate-700 cursor-pointer">
          Mostrar aquí
        </button>
      </p>
    );
  }
  return (
    <div data-ayuda={id} data-estado="PREGUNTA" className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
      <span>{h.pregunta}</span>
      <span className="flex items-center gap-1.5">
        <button onClick={() => onResponder('SI')} className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold cursor-pointer">
          Sí
        </button>
        <button onClick={() => onResponder('NO')} className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600 font-bold cursor-pointer">
          No por ahora
        </button>
      </span>
    </div>
  );
};
