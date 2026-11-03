import React, { useState, useEffect } from 'react';
import { useProcurementStore } from './store/useProcurementStore';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { AuditTrailModal } from './components/AuditTrailModal';
import { MultiRoleAuditModal } from './components/MultiRoleAuditModal';
import { CceComplianceModal } from './components/CceComplianceModal';
import { WelcomeBriefingModal } from './components/WelcomeBriefingModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { RegulatoryWatchdogModal } from './components/RegulatoryWatchdogModal';
import { GuidedWorkflowBar } from './components/GuidedWorkflowBar';
import { AwwwardsFloatingHud } from './components/AwwwardsFloatingHud';
import { Secop2EntidadView } from './modules/secop2/Secop2EntidadView';
import { Secop2ProveedorView } from './modules/secop2/Secop2ProveedorView';
import { ReverseAuctionView } from './modules/secop2/ReverseAuctionView';
import { Secop1View } from './modules/secop1/Secop1View';
import { SuplosView } from './modules/private/SuplosView';
import { AribaView } from './modules/private/AribaView';
import { CoupaView } from './modules/private/CoupaView';
import { DocumentGeneratorView } from './modules/document-generator/DocumentGeneratorView';
import { MarketStudyView } from './modules/market-study/MarketStudyView';
import { RiskMatrixView } from './modules/compliance/RiskMatrixView';
import { RupValidatorView } from './modules/compliance/RupValidatorView';
import { BidAssistantView } from './modules/bid-assistant/BidAssistantView';
import { DisputesView } from './modules/disputes/DisputesView';
import { ConsortiumView } from './modules/consortium/ConsortiumView';
import { ScoringSimulatorView } from './modules/scoring/ScoringSimulatorView';
import { ProcurementTrendsView } from './modules/trends/ProcurementTrendsView';
import { TvecStoreView } from './modules/tvec/TvecStoreView';
import { EconomicAuditToolsView } from './modules/analysis/EconomicAuditToolsView';
import { ContractSettlementView } from './modules/settlement/ContractSettlementView';
import { RealProductionSuiteView } from './modules/enterprise/RealProductionSuiteView';
import { PrecontractualSuiteView } from './modules/precontractual/PrecontractualSuiteView';
import { ProgressiveFlowView } from './modules/progressive/ProgressiveFlowView';
import { AutomaticTimelineView } from './modules/production/AutomaticTimelineView';
import { ContractFlowchartView } from './modules/flowchart/ContractFlowchartView';

export function App() {
  const { vistaActual, densidadVisual, modoOperativo, setDensidadVisual, setVista } = useProcurementStore();
  const [sidebarColapsado, setSidebarColapsado] = useState(true);
  const [modalAuditoria, setModalAuditoria] = useState(false);
  const [modalMultirol, setModalMultirol] = useState(false);
  const [modalMentorCCE, setModalMentorCCE] = useState(false);
  const [modalBienvenida, setModalBienvenida] = useState(false);
  const [modalCommandPalette, setModalCommandPalette] = useState(false);
  const [modalRadarRegulatorio, setModalRadarRegulatorio] = useState(false);

  // Apertura directa en el Flujograma Limpio (Lienzo en blanco)
  useEffect(() => {
    setDensidadVisual('ENFOCADA_SIMPLE');
    setVista('FLUJOGRAMA_PASO_A_PASO');
    setModalBienvenida(false);
  }, []);

  // Atajo global de teclado para abrir la Paleta de Comandos Universal (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setModalCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen bg-white flex text-slate-900 selection:bg-slate-900 selection:text-white overflow-hidden relative">
      {/* 1. Barra Lateral de Navegación Inteligente (Sidebar) - Solo en Modo Experto */}
      {densidadVisual === 'EXPERTO_AVANZADA' && (
        <Sidebar
          colapsado={sidebarColapsado}
          onToggleColapsar={() => setSidebarColapsado(!sidebarColapsado)}
          onAbrirAuditoria={() => setModalAuditoria(true)}
          onAbrirMultirol={() => setModalMultirol(true)}
          onAbrirMentorCCE={() => setModalMentorCCE(true)}
          onAbrirBienvenida={() => setModalBienvenida(true)}
          onAbrirRadarRegulatorio={() => setModalRadarRegulatorio(true)}
        />
      )}

      {/* 2. Área Principal: Cabecera Delgada Contextual + Vista Activa */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white relative">
        <TopHeader
          onToggleSidebar={() => setSidebarColapsado(!sidebarColapsado)}
          sidebarColapsado={sidebarColapsado}
          onAbrirMentorCCE={() => setModalMentorCCE(true)}
          onAbrirMultirol={() => setModalMultirol(true)}
          onAbrirAuditoria={() => setModalAuditoria(true)}
          onAbrirBienvenida={() => setModalBienvenida(true)}
          onAbrirCommandPalette={() => setModalCommandPalette(true)}
          onAbrirRadarRegulatorio={() => setModalRadarRegulatorio(true)}
        />

        {/* 3. Barra de Flujo Guiado: Solo visible en Modo Experto */}
        {densidadVisual === 'EXPERTO_AVANZADA' && (
          <GuidedWorkflowBar
            onAbrirMisiones={() => setModalBienvenida(true)}
            onAbrirMultirol={() => setModalMultirol(true)}
          />
        )}

        {/* 4. Contenedor de la Vista Activa: Diagrama de Flujo Paso a Paso por defecto */}
        <main className="flex-1 overflow-y-auto flex flex-col relative pb-8 bg-white">
          {densidadVisual === 'ENFOCADA_SIMPLE' || vistaActual === 'FLUJOGRAMA_PASO_A_PASO' ? (
            <ContractFlowchartView />
          ) : (
            <>
              {vistaActual === 'LINEA_TIEMPO_AUTOMATICA' && <AutomaticTimelineView />}
              {vistaActual === 'SECOP_II_ENTIDAD' && <Secop2EntidadView />}
              {vistaActual === 'SECOP_II_PROVEEDOR' && <Secop2ProveedorView />}
              {vistaActual === 'SUBASTA_INVERSA' && <ReverseAuctionView />}
              {vistaActual === 'TIENDA_VIRTUAL_TVEC' && <TvecStoreView />}
              {vistaActual === 'SECOP_I' && <Secop1View />}
              {vistaActual === 'SUPLOS' && <SuplosView />}
              {vistaActual === 'SAP_ARIBA' && <AribaView />}
              {vistaActual === 'COUPA' && <CoupaView />}
              {vistaActual === 'GENERADOR_DOCUMENTOS' && <DocumentGeneratorView />}
              {vistaActual === 'ESTUDIO_MERCADO' && <MarketStudyView />}
              {vistaActual === 'MATRIZ_RIESGOS' && <RiskMatrixView />}
              {vistaActual === 'ASISTENTE_PROPUESTAS' && <BidAssistantView />}
              {vistaActual === 'VALIDADOR_RUP' && <RupValidatorView />}
              {vistaActual === 'GESTION_CONTROVERSIAS' && <DisputesView />}
              {vistaActual === 'GESTOR_CONSORCIOS' && <ConsortiumView />}
              {vistaActual === 'SIMULADOR_CALIFICACION' && <ScoringSimulatorView />}
              {vistaActual === 'HERRAMIENTAS_ECONOMICAS_AVANZADAS' && <EconomicAuditToolsView />}
              {vistaActual === 'LIQUIDACION_CONTRATOS' && <ContractSettlementView />}
              {vistaActual === 'INTELIGENCIA_TENDENCIAS' && <ProcurementTrendsView />}
              {vistaActual === 'SUITE_PRODUCCION_REAL' && <RealProductionSuiteView />}
              {vistaActual === 'INGENIERIA_PRECONTRACTUAL' && <PrecontractualSuiteView />}
            </>
          )}
        </main>
      </div>

      {/* 5. Barra de Control Flotante (Solo en Modo Experto) */}
      {densidadVisual === 'EXPERTO_AVANZADA' && (
        <AwwwardsFloatingHud
          onAbrirCommandPalette={() => setModalCommandPalette(true)}
          onAbrirBienvenida={() => setModalBienvenida(true)}
        />
      )}

      {/* Paleta de Comandos Universal (Ctrl + K) */}
      <CommandPaletteModal
        abierto={modalCommandPalette}
        onCerrar={() => setModalCommandPalette(false)}
        onAbrirAuditoriaMultirol={() => setModalMultirol(true)}
        onAbrirMentorCCE={() => setModalMentorCCE(true)}
        onAbrirBriefing={() => setModalBienvenida(true)}
        onAbrirBitacora={() => setModalAuditoria(true)}
        onAbrirRadarRegulatorio={() => setModalRadarRegulatorio(true)}
      />

      {/* Modales de Auditoría y Tutoría */}
      <AuditTrailModal
        abierto={modalAuditoria}
        onCerrar={() => setModalAuditoria(false)}
      />
      <MultiRoleAuditModal
        abierto={modalMultirol}
        onCerrar={() => setModalMultirol(false)}
      />
      <CceComplianceModal
        abierto={modalMentorCCE}
        onCerrar={() => setModalMentorCCE(false)}
      />
      <RegulatoryWatchdogModal
        abierto={modalRadarRegulatorio}
        onCerrar={() => setModalRadarRegulatorio(false)}
      />
      <WelcomeBriefingModal
        abierto={modalBienvenida}
        onCerrar={() => setModalBienvenida(false)}
      />
    </div>
  );
}

export default App;
