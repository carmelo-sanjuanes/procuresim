// Logosímbolo Oficial de ProcureSim v2.0
// Fusión de: Escudo Jurídico (Ley 80) + Balanza de Ponderación Objetiva (CCE) + Red Neuronal de IA y Analítica
import React from 'react';

interface ProcureSimLogoSymbolProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  conTexto?: boolean;
}

export const ProcureSimLogoSymbol: React.FC<ProcureSimLogoSymbolProps> = ({
  className = '',
  size = 'md',
  conTexto = false
}) => {
  const tamanios = {
    sm: { w: 32, h: 32, stroke: 2 },
    md: { w: 48, h: 48, stroke: 2.5 },
    lg: { w: 72, h: 72, stroke: 3 },
    xl: { w: 110, h: 110, stroke: 3.5 }
  };

  const { w, h, stroke } = tamanios[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md"
      >
        <defs>
          {/* Gradiente del Escudo Exterior */}
          <linearGradient id="shieldGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Gradiente de Luz Neón Cyan a Lima */}
          <linearGradient id="neonGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#c6f24e" />
            <stop offset="100%" stopColor="#a3e635" />
          </linearGradient>

          {/* Gradiente Balanza Dorada/Lima */}
          <linearGradient id="scaleGrad" x1="40" y1="30" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c6f24e" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Resplandor Filtro */}
          <filter id="glowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Escudo Base Hexagonal de Protección Jurídica */}
        <polygon
          points="60,6 106,24 106,68 60,114 14,68 14,24"
          fill="url(#shieldGrad)"
          stroke="url(#neonGrad)"
          strokeWidth={stroke * 1.2}
          strokeLinejoin="round"
        />

        {/* 2. Marco Interno Tecnológico / Pistas de Circuito */}
        <polygon
          points="60,16 96,30 96,64 60,102 24,64 24,30"
          fill="none"
          stroke="#334155"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />

        {/* 3. Balanza de Ponderación Objetiva (Escudo Central CCE) */}
        {/* Pilar Central */}
        <line x1="60" y1="28" x2="60" y2="84" stroke="url(#scaleGrad)" strokeWidth={stroke * 1.1} strokeLinecap="round" />
        {/* Base del Pilar */}
        <path d="M46 84 H74" stroke="url(#scaleGrad)" strokeWidth={stroke * 1.1} strokeLinecap="round" />

        {/* Barra Transversal de la Balanza */}
        <path
          d="M32 42 C45 38 75 38 88 42"
          stroke="url(#neonGrad)"
          strokeWidth={stroke * 1.1}
          strokeLinecap="round"
          filter="url(#glowFilter)"
        />

        {/* Platillo Izquierdo (Requisitos Jurídicos & Calidad) */}
        <line x1="32" y1="42" x2="26" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="32" y1="42" x2="38" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M22 60 C26 68 38 68 42 60 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

        {/* Platillo Derecho (Precio & Fórmulas Económicas) */}
        <line x1="88" y1="42" x2="82" y2="56" stroke="#c6f24e" strokeWidth="1.5" />
        <line x1="88" y1="42" x2="94" y2="56" stroke="#c6f24e" strokeWidth="1.5" />
        <path d="M78 56 C82 64 94 64 98 56 Z" fill="#65a30d" stroke="#c6f24e" strokeWidth="1.5" />

        {/* 4. Nodos de Red Neuronal / IA & Transparencia */}
        <circle cx="60" cy="28" r="4.5" fill="#c6f24e" stroke="#0f172a" strokeWidth="1.5" filter="url(#glowFilter)" />
        <circle cx="60" cy="54" r="3.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.2" />
        <circle cx="32" cy="42" r="3" fill="#38bdf8" />
        <circle cx="88" cy="42" r="3" fill="#c6f24e" />

        {/* Conexión de Datos Cruzada */}
        <circle cx="60" cy="94" r="2.5" fill="#c6f24e" />
        <line x1="60" y1="84" x2="60" y2="92" stroke="#c6f24e" strokeWidth="1.2" strokeDasharray="2 2" />
      </svg>

      {conTexto && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white text-base tracking-tight font-sans">
              PROCURE<span className="text-lime-400">SIM</span>
            </span>
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-lime-400 text-slate-950 font-mono">
              v2.0
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Simulador Universal de Contratación & IA
          </span>
        </div>
      )}
    </div>
  );
};
