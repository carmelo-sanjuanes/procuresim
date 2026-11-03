// Abre una herramienta de ayuda sobre el flujo, sin sacar al usuario de su expediente. Esc o «Volver al flujo» la cierra.
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { HERRAMIENTAS, EVENTO_ABRIR_HERRAMIENTA, EVENTO_ABRIR_PLATAFORMA, type IdHerramienta, type ContextoHerramienta } from '../core/domain/herramientas';
import { AutomaticTimelineView } from '../modules/production/AutomaticTimelineView';
import { TvecStoreView } from '../modules/tvec/TvecStoreView';
import { MarketStudyView } from '../modules/market-study/MarketStudyView';
import { EconomicAuditToolsView } from '../modules/analysis/EconomicAuditToolsView';
import { CentroComunicaciones } from './CentroComunicaciones';
import { Secop2EntidadView } from '../modules/secop2/Secop2EntidadView';
import { Secop1View } from '../modules/secop1/Secop1View';
import { SuplosView } from '../modules/private/SuplosView';
import { AribaView } from '../modules/private/AribaView';
import type { VistaPlataforma } from '../core/domain/plataformas';

const TITULO_PLATAFORMA: Record<VistaPlataforma, string> = { SECOP2: 'SECOP II', TVEC: 'Tienda Virtual del Estado', SUPLOS: 'Suplos', ARIBA: 'SAP Ariba', SECOP1: 'SECOP I' };

export const HerramientaModal: React.FC = () => {
  const [plataforma, setPlataforma] = useState<VistaPlataforma | null>(null);
  const [abierta, setAbierta] = useState<{ id: IdHerramienta; contexto?: ContextoHerramienta } | null>(null);

  useEffect(() => {
    const alAbrir = (e: Event) => setAbierta((e as CustomEvent).detail);
    window.addEventListener(EVENTO_ABRIR_HERRAMIENTA, alAbrir);
    return () => window.removeEventListener(EVENTO_ABRIR_HERRAMIENTA, alAbrir);
  }, []);

  useEffect(() => {
    const alAbrir = (e: Event) => setPlataforma((e as CustomEvent).detail.vista);
    window.addEventListener(EVENTO_ABRIR_PLATAFORMA, alAbrir);
    return () => window.removeEventListener(EVENTO_ABRIR_PLATAFORMA, alAbrir);
  }, []);

  useEffect(() => {
    if (!abierta && !plataforma) return;
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAbierta(null); setPlataforma(null); } };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [abierta, plataforma]);

  if (plataforma) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto" role="dialog" aria-modal="true" aria-label={TITULO_PLATAFORMA[plataforma]}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button onClick={() => setPlataforma(null)} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Volver al flujo
          </button>
          <span className="text-xs font-black text-slate-900">{TITULO_PLATAFORMA[plataforma]}</span>
          <span className="w-24" />
        </div>
        {plataforma === 'SECOP2' && <Secop2EntidadView />}
        {plataforma === 'SECOP1' && <Secop1View />}
        {plataforma === 'SUPLOS' && <SuplosView />}
        {plataforma === 'ARIBA' && <AribaView />}
        {plataforma === 'TVEC' && <TvecStoreView />}
      </div>
    );
  }

  if (!abierta) return null;
  const { id, contexto } = abierta;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto" role="dialog" aria-modal="true" aria-label={HERRAMIENTAS[id].titulo}>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 sm:px-6 h-14 flex items-center justify-between">
        <button onClick={() => setAbierta(null)} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Volver al flujo
        </button>
        <span className="text-xs font-black text-slate-900">{HERRAMIENTAS[id].titulo}</span>
        <span className="w-24" />
      </div>
      {id === 'CRONOGRAMA' && <AutomaticTimelineView modalidadInicial={contexto?.modalidad} presupuestoInicial={contexto?.presupuestoCOP} />}
      {id === 'TVEC' && <TvecStoreView />}
      {id === 'COTIZACIONES' && <MarketStudyView />}
      {id === 'EMPATE' && <EconomicAuditToolsView pestanaInicial="DESEMPATES" />}
      {id === 'AIU' && <EconomicAuditToolsView pestanaInicial="AIU_IVA" />}
      {id === 'COMUNICACIONES' && <CentroComunicaciones />}
    </div>
  );
};
