// Vista Integral de Ingeniería Precontractual, Estudios Previos & Gestor de Recursos
// Decreto 1082 de 2015 (Art. 2.2.1.1.2.1.1), Presupuesto Público (CDP/PAC) y Decisión Licitante Go/No-Go
import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Briefcase,
  MessageSquare,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Copy,
  Layers,
  ShieldCheck,
  TrendingUp,
  Clock,
  Send,
  Zap,
  HelpCircle,
  FileCheck,
  Calendar,
  Scale,
  CalendarClock,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import {
  PrecontractualEngine,
  EstudioPrevioOficial,
  CertificadoDisponibilidadPresupuestalCDP,
  ObservacionProyectoPliego,
  RegistroPlanAnualAdquisiciones,
  AudienciaRiesgosIntervencion,
  AdendaModificatoria
} from '../../core/engines/PrecontractualEngine';

export const PrecontractualSuiteView: React.FC = () => {
  const { proveedores, proveedorActivoId, setProveedorActivo } = useProcurementStore();

  const [pestana, setPestana] = useState<
    | 'PAA_PLAN_ADQUISICIONES'
    | 'ESTUDIOS_PREVIOS'
    | 'GESTOR_PRESUPUESTAL_CDP'
    | 'GESTOR_RECURSOS_LICITANTE'
    | 'AUDIENCIA_RIESGOS_ADENDAS'
    | 'OBSERVACIONES_PLIEGO'
  >('ESTUDIOS_PREVIOS');

  // Estados de Agrupación por Macro-Rol (Entidad vs. Licitante vs. Todos)
  const [filtroMacroRol, setFiltroMacroRol] = useState<'TODOS' | 'ENTIDAD' | 'LICITANTE'>('TODOS');

  const handleCambiarMacroRol = (rol: 'TODOS' | 'ENTIDAD' | 'LICITANTE') => {
    setFiltroMacroRol(rol);
    if (rol === 'ENTIDAD') {
      if (!['PAA_PLAN_ADQUISICIONES', 'ESTUDIOS_PREVIOS', 'GESTOR_PRESUPUESTAL_CDP'].includes(pestana)) {
        setPestana('ESTUDIOS_PREVIOS');
      }
    } else if (rol === 'LICITANTE') {
      if (!['GESTOR_RECURSOS_LICITANTE', 'AUDIENCIA_RIESGOS_ADENDAS', 'OBSERVACIONES_PLIEGO'].includes(pestana)) {
        setPestana('GESTOR_RECURSOS_LICITANTE');
      }
    }
  };

  // Estados de Estudios Previos y CDP
  const [edpActivo, setEdpActivo] = useState<EstudioPrevioOficial>(
    PrecontractualEngine.ESTUDIOS_PREVIOS_DEMO[0]
  );
  const [cdpActivo, setCdpActivo] = useState<CertificadoDisponibilidadPresupuestalCDP>(
    PrecontractualEngine.CDPS_DEMO[0]
  );

  // Estados de Plan Anual de Adquisiciones (PAA)
  const [planesAdquisiciones, setPlanesAdquisiciones] = useState<RegistroPlanAnualAdquisiciones[]>(
    PrecontractualEngine.PLAN_ADQUISICIONES_DEMO
  );
  const [filtroPaa, setFiltroPaa] = useState('');

  // Estados de Audiencia de Riesgos y Adendas
  const [intervencionesAudiencia, setIntervencionesAudiencia] = useState<AudienciaRiesgosIntervencion[]>(
    PrecontractualEngine.AUDIENCIA_RIESGOS_DEMO
  );
  const [adendasList, setAdendasList] = useState<AdendaModificatoria[]>(
    PrecontractualEngine.ADENDAS_DEMO
  );
  const [tipoRiesgoAudiencia, setTipoRiesgoAudiencia] = useState<
    'CAMBIARIO_TRM' | 'OPERACIONAL_TECNICO' | 'REGULATORIO_LEGAL' | 'FUERZA_MAYOR' | 'DISPONIBILIDAD_RED'
  >('CAMBIARIO_TRM');
  const [argumentoAudiencia, setArgumentoAudiencia] = useState('');
  const [solicitudAudiencia, setSolicitudAudiencia] = useState('');

  // Simulador interactivo de legalidad de Adendas (Ley 1882/2018)
  const [diasAntelacionAdenda, setDiasAntelacionAdenda] = useState<number>(4);
  const [prorrogaDiasAdenda, setProrrogaDiasAdenda] = useState<number>(0);

  // Estados de Observaciones al Borrador
  const [observaciones, setObservaciones] = useState<ObservacionProyectoPliego[]>(
    PrecontractualEngine.OBSERVACIONES_DEMO
  );
  const [nuevaClausula, setNuevaClausula] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<'JURIDICA' | 'FINANCIERA' | 'TECNICA' | 'EXPERIENCIA_PLIEGO_SASTRE'>('EXPERIENCIA_PLIEGO_SASTRE');
  const [nuevoArgumento, setNuevoArgumento] = useState('');
  const [nuevaSolicitud, setNuevaSolicitud] = useState('');

  // Parámetros para el Gestor de Recursos del Licitante (Go/No-Go)
  const proponenteActivo = proveedores.find((p) => p.id === proveedorActivoId) || proveedores[0];
  const [plazoPagoEstatalDias, setPlazoPagoEstatalDias] = useState<number>(60);
  const [margenUtilidadPct, setMargenUtilidadPct] = useState<number>(15);
  const [anticipoPct, setAnticipoPct] = useState<number>(edpActivo.id === 'EDP-ENERGIA-2025-02' ? 20 : 0);

  // Cálculo dinámico del análisis Go / No-Go
  const analisisGoNoGo = PrecontractualEngine.calcularViabilidadGoNoGo({
    proponenteId: proponenteActivo.id,
    nombreProponente: proponenteActivo.razonSocial,
    nitProponente: proponenteActivo.nit,
    presupuestoLicitacionCOP: edpActivo.presupuestoOficialCOP,
    capitalTrabajoDisponibleCOP: proponenteActivo.activoCorriente - proponenteActivo.pasivoCorriente,
    plazoEjecucionMeses: edpActivo.plazoEjecucionMeses,
    plazoPagoEstatalDias,
    anticipoPct,
    margenUtilidadPct
  });

  const [copiadoMinuta, setCopiadoMinuta] = useState(false);

  // Copiar y descargar minuta oficial de Estudios Previos
  const handleCopiarMinuta = () => {
    const texto = PrecontractualEngine.redactarMinutaEstudiosPrevios(edpActivo, cdpActivo);
    navigator.clipboard.writeText(texto);
    setCopiadoMinuta(true);
    setTimeout(() => setCopiadoMinuta(false), 2000);
  };

  const handleDescargarMinuta = () => {
    const texto = PrecontractualEngine.redactarMinutaEstudiosPrevios(edpActivo, cdpActivo);
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Estudios_Previos_${edpActivo.procesoReferencia}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Radicar nueva observación al proyecto de pliego
  const handleRadicarObservacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaClausula.trim() || !nuevoArgumento.trim() || !nuevaSolicitud.trim()) {
      alert('Por favor complete todos los campos de la observación.');
      return;
    }

    const nueva: ObservacionProyectoPliego = {
      id: `OBS-${Date.now().toString().slice(-4)}`,
      remitente: proponenteActivo.razonSocial,
      nitRemitente: proponenteActivo.nit,
      procesoId: edpActivo.procesoReferencia,
      fechaRadicacion: new Date().toISOString().split('T')[0],
      clausulaCuestionada: nuevaClausula,
      tipoObservacion: nuevoTipo,
      argumentacion: nuevoArgumento,
      solicitudConcreta: nuevaSolicitud,
      estado: 'PENDIENTE',
      respuestaEntidad: 'En estudio por el comité técnico y jurídico de la entidad contratante.',
      fundamentoRespuesta: 'Trámite ordinario precontractual del Decreto 1082 de 2015.'
    };

    setObservaciones([nueva, ...observaciones]);
    setNuevaClausula('');
    setNuevoArgumento('');
    setNuevaSolicitud('');
    alert('¡Observación al proyecto de pliego radicada formalmente ante la entidad!');
  };

  // Radicar intervención en Audiencia de Riesgos (Art. 4 Ley 1150 de 2007)
  const handleRadicarIntervencionAudiencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentoAudiencia.trim() || !solicitudAudiencia.trim()) {
      alert('Por favor complete el argumento y la solicitud de reasignación de riesgo.');
      return;
    }

    const nuevaIntervencion: AudienciaRiesgosIntervencion = {
      id: `AR-${Date.now().toString().slice(-4)}`,
      procesoReferencia: edpActivo.procesoReferencia,
      fechaHora: new Date().toLocaleDateString('es-CO') + ' 10:00 a.m.',
      participante: proponenteActivo.razonSocial,
      nitParticipante: proponenteActivo.nit,
      rolParticipante: 'OFERENTE',
      tipoRiesgoDebatido: tipoRiesgoAudiencia,
      argumentoIntervencion: argumentoAudiencia,
      solicitudReasignacion: solicitudAudiencia,
      decisionEntidad: 'MODIFICADO_MEDIANTE_ADENDA',
      justificacionLegalEntidad:
        'En análisis por la mesa técnica y financiera durante el curso de la audiencia pública del Art. 4 de la Ley 1150 de 2007.'
    };

    setIntervencionesAudiencia([nuevaIntervencion, ...intervencionesAudiencia]);
    setArgumentoAudiencia('');
    setSolicitudAudiencia('');
    alert('¡Intervención oficial radicada en la Audiencia de Asignación de Riesgos!');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header del Módulo Precontractual */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-900/60 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                INGENIERÍA PRECONTRACTUAL & GESTOR DE RECURSOS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400 text-slate-950 font-bold">
                PAA / DCTO. 1082 / LEY 1882 / PAC
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Estructuración completa del ciclo previo: PAA, Estudios Previos (EDP), Presupuesto (CDP/PAC), Viabilidad Go/No-Go, Audiencia de Riesgos y Control de Adendas.
            </p>
          </div>
        </div>

        {/* Selector de Estudio Previo de Referencia */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-xs">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-400 hidden sm:inline">Proceso Previo:</span>
          <select
            value={edpActivo.id}
            onChange={(e) => {
              const found = PrecontractualEngine.ESTUDIOS_PREVIOS_DEMO.find((x) => x.id === e.target.value);
              if (found) {
                setEdpActivo(found);
                const cdpFound = PrecontractualEngine.CDPS_DEMO.find((c) =>
                  found.id === 'EDP-ENERGIA-2025-02' ? c.numeroCDP === 'CDP-2025-001290' : c.numeroCDP === 'CDP-2025-000418'
                );
                if (cdpFound) setCdpActivo(cdpFound);
                setAnticipoPct(found.id === 'EDP-ENERGIA-2025-02' ? 20 : 0);
              }
            }}
            className="bg-transparent font-bold text-slate-100 cursor-pointer focus:outline-none"
            title="Seleccionar el expediente precontractual para auditar sus estudios previos o viabilidad"
          >
            {PrecontractualEngine.ESTUDIOS_PREVIOS_DEMO.map((edp) => (
              <option key={edp.id} value={edp.id} className="bg-slate-900 text-white">
                {edp.procesoReferencia} (${(edp.presupuestoOficialCOP / 1e6).toFixed(0)}M)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Pestañas de Navegación Precontractual con Filtro por Macro-Rol */}
      <div className="space-y-2 border-b border-slate-200 pb-3">
        {/* Selector de Macro-Rol (Entidad vs. Licitante vs. Todos) */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-600">
            <span className="text-[10px] uppercase text-slate-500 px-2 font-mono">Enfoque:</span>
            <button
              onClick={() => handleCambiarMacroRol('TODOS')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filtroMacroRol === 'TODOS'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              title="Mostrar las 6 etapas del ciclo precontractual completo"
            >
              Todos (6)
            </button>
            <button
              onClick={() => handleCambiarMacroRol('ENTIDAD')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                filtroMacroRol === 'ENTIDAD'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              title="Filtrar por etapas de la Entidad Estatal: PAA, Estudios Previos EDP y Presupuesto CDP/PAC"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Entidad Estatal (3)</span>
            </button>
            <button
              onClick={() => handleCambiarMacroRol('LICITANTE')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                filtroMacroRol === 'LICITANTE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              title="Filtrar por etapas del Licitante: Decisión Go/No-Go, Audiencia de Riesgos y Observaciones"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Licitante / Oferente (3)</span>
            </button>
          </div>

          {/* Botones de Exportación / Copia de Minuta */}
          {pestana === 'ESTUDIOS_PREVIOS' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDescargarMinuta}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Descargar minuta completa de los Estudios Previos en formato de texto (.txt)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar (.txt)</span>
              </button>
              <button
                onClick={handleCopiarMinuta}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copiadoMinuta
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                }`}
                title="Copiar texto formal de los Estudios Previos al portapapeles"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiadoMinuta ? '¡Copiado!' : 'Copiar Estudios Previos'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Lista de Pestañas Filtradas */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs overflow-x-auto max-w-full">
          {/* 1. PAA */}
          {(filtroMacroRol === 'TODOS' || filtroMacroRol === 'ENTIDAD') && (
            <button
              onClick={() => setPestana('PAA_PLAN_ADQUISICIONES')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                pestana === 'PAA_PLAN_ADQUISICIONES'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Plan Anual de Adquisiciones (PAA - Art. 2.2.1.1.1.4.1 Decreto 1082/2015)"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>1. Plan Adquisiciones (PAA)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                Entidad
              </span>
            </button>
          )}

          {/* 2. EDP */}
          {(filtroMacroRol === 'TODOS' || filtroMacroRol === 'ENTIDAD') && (
            <button
              onClick={() => setPestana('ESTUDIOS_PREVIOS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                pestana === 'ESTUDIOS_PREVIOS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Estructurador y auditor formal de Estudios y Documentos Previos según los 7 componentes del Decreto 1082 de 2015"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Estudios Previos (EDP)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                Entidad
              </span>
            </button>
          )}

          {/* 3. CDP & PAC */}
          {(filtroMacroRol === 'TODOS' || filtroMacroRol === 'ENTIDAD') && (
            <button
              onClick={() => setPestana('GESTOR_PRESUPUESTAL_CDP')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                pestana === 'GESTOR_PRESUPUESTAL_CDP'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Gestión de recursos presupuestales, certificado de disponibilidad (CDP), fuentes y PAC"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>3. Presupuesto (CDP/PAC)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                Entidad
              </span>
            </button>
          )}

          {/* Separador cuando está en modo TODOS */}
          {filtroMacroRol === 'TODOS' && (
            <div className="h-5 w-px bg-slate-200 mx-1 shrink-0" />
          )}

          {/* 4. GO/NO-GO */}
          {(filtroMacroRol === 'TODOS' || filtroMacroRol === 'LICITANTE') && (
            <button
              onClick={() => setPestana('GESTOR_RECURSOS_LICITANTE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                pestana === 'GESTOR_RECURSOS_LICITANTE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Gestor de recursos del oferente: flujo de caja, capital de trabajo requerido y decisión estratégica Go / No-Go"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>4. Gestor Licitante (Go/No-Go)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                Licitante
              </span>
            </button>
          )}

          {/* 5. AUDIENCIA & ADENDAS */}
          {(filtroMacroRol === 'TODOS' || filtroMacroRol === 'LICITANTE') && (
            <button
              onClick={() => setPestana('AUDIENCIA_RIESGOS_ADENDAS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                pestana === 'AUDIENCIA_RIESGOS_ADENDAS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Audiencia pública de asignación de riesgos (Art. 4 Ley 1150) y simulador legal de adendas (Ley 1882)"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>5. Audiencia Riesgos & Adendas</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                Licitante
              </span>
            </button>
          )}

          {/* 6. OBSERVACIONES */}
          {(filtroMacroRol === 'TODOS' || filtroMacroRol === 'LICITANTE') && (
            <button
              onClick={() => setPestana('OBSERVACIONES_PLIEGO')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                pestana === 'OBSERVACIONES_PLIEGO'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mesa de radicación de observaciones al proyecto de pliego borrador para derribar pliegos sastre"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>6. Observaciones ({observaciones.length})</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                Licitante
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 3. PESTAÑA 1: PLAN ANUAL DE ADQUISICIONES (PAA - ART. 2.2.1.1.1.4.1 DCTO. 1082/2015) */}
      {pestana === 'PAA_PLAN_ADQUISICIONES' && (
        <div className="space-y-6">
          {/* Banner de Articulación del Proceso con el PAA */}
          {(() => {
            const lineaPaa = planesAdquisiciones.find((p) => p.procesoVinculadoId === edpActivo.procesoReferencia);
            const articulado = !!lineaPaa;
            const diffPresupuesto = lineaPaa ? edpActivo.presupuestoOficialCOP - lineaPaa.valorEstimadoCOP : 0;

            return (
              <div
                className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  articulado && diffPresupuesto === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : articulado
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {articulado && diffPresupuesto === 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : articulado ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-black text-sm uppercase tracking-wide">
                      {articulado && diffPresupuesto === 0
                        ? 'PROCESO DEBIDAMENTE ARTICULADO AL PLAN ANUAL DE ADQUISICIONES (PAA)'
                        : articulado
                        ? 'ADVERTENCIA: DESFASE ENTRE PAA Y PRESUPUESTO OFICIAL DEL EDP'
                        : 'ALERTA LEGAL: PROCESO NO ENCONTRADO EN EL PAA PUBLICADO'}
                    </div>
                    <p className="text-xs opacity-90 mt-1">
                      {articulado && diffPresupuesto === 0
                        ? `El proceso ${edpActivo.procesoReferencia} se encuentra registrado y amparado en el PAA con código ${lineaPaa?.id}. Cumple a cabalidad con el Art. 2.2.1.1.1.4.1 del Decreto 1082 de 2015.`
                        : articulado
                        ? `El valor del EDP ($${(edpActivo.presupuestoOficialCOP / 1e6).toFixed(0)}M) difiere de la estimación en el PAA ($${(lineaPaa!.valorEstimadoCOP / 1e6).toFixed(0)}M). Se requiere actualizar formalmente el PAA en SECOP antes de la resolución de apertura.`
                        : `El proceso ${edpActivo.procesoReferencia} no tiene registro en el PAA institucional. Su apertura sin previa inclusión constituye falta precontractual sancionable.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                  <span className="p-2 rounded-xl bg-white/80 border border-slate-200/60 font-bold">
                    Vigencia PAA: 2025
                  </span>
                  <span className="p-2 rounded-xl bg-white/80 border border-slate-200/60 font-bold">
                    UNSPSC: {edpActivo.codigosUNSPSC[0]}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Panel Principal del PAA */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Plan Anual de Adquisiciones Oficial (PAA)
                </h2>
                <p className="text-xs text-slate-500">
                  Herramienta de planeación de compras públicas. Permite a la entidad estructurar con anticipación y a los licitantes prever la demanda estatal.
                </p>
              </div>

              {/* Buscador PAA */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por UNSPSC, objeto o entidad..."
                  value={filtroPaa}
                  onChange={(e) => setFiltroPaa(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
                  title="Filtrar adquisiciones planificadas en el PAA por código o texto"
                />
              </div>
            </div>

            {/* Tabla de Adquisiciones Planificadas */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-200 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">ID PAA</th>
                    <th className="p-3">Código UNSPSC</th>
                    <th className="p-3">Descripción Bien / Servicio</th>
                    <th className="p-3">Modalidad Selección</th>
                    <th className="p-3 text-center">Inicio Estimado</th>
                    <th className="p-3 text-right">Valor Estimado COP</th>
                    <th className="p-3 text-center">Estado EDP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {planesAdquisiciones
                    .filter(
                      (p) =>
                        p.descripcionBienServicio.toLowerCase().includes(filtroPaa.toLowerCase()) ||
                        p.codigoUNSPSC.includes(filtroPaa) ||
                        p.entidad.toLowerCase().includes(filtroPaa.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-700">{item.id}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{item.codigoUNSPSC}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900 text-xs">{item.descripcionBienServicio}</div>
                          <div className="text-[10px] text-slate-500">
                            Entidad: {item.entidad} | Responsable: {item.responsableContacto}
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{item.modalidadSeleccion}</td>
                        <td className="p-3 text-center font-mono text-slate-600">
                          {item.fechaEstimadaInicio} ({item.duracionEstimadaMeses}m)
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ${item.valorEstimadoCOP.toLocaleString('es-CO')}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.estadoArticulacionEDP === 'ARTICULADO_CONFORME'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : item.estadoArticulacionEDP === 'DIFERENCIA_PRESUPUESTAL'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {item.estadoArticulacionEDP.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Nota de Orientación Estratégica para el Oferente */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Consejo Táctico para el Licitante (Sanjuanés Soluciones e Ingelecgroup BIC):</strong> Monitorear las publicaciones del PAA durante enero y febrero en SECOP II permite identificar compras con 3 a 6 meses de antelación. Esto otorga el tiempo necesario para renovar el RUP, verificar la Capacidad Residual (K), tramitar cupos de crédito bancario y estructurar Consorcios antes de que se publiquen los pliegos borrador.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PESTAÑA 2: ESTUDIOS PREVIOS OFICIALES (ENTIDAD ESTATAL) */}
      {pestana === 'ESTUDIOS_PREVIOS' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Estudios y Documentos Previos (EDP) - Decreto 1082 de 2015
                </h2>
                <p className="text-xs text-slate-500">
                  Soporte técnico, legal y financiero que justifica la necesidad y la viabilidad de la contratación estatal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Estado:</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {edpActivo.estadoRevision}
                </span>
              </div>
            </div>

            {/* Los 7 Acápites Obligatorios del Decreto 1082 de 2015 */}
            <div className="space-y-3 text-xs">
              {/* 1. Descripción de la necesidad */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">
                  1. Descripción de la Necesidad que la Entidad Pretende Satisfacer (Num. 1)
                </span>
                <p className="text-slate-700 leading-relaxed">{edpActivo.necesidadJustificada}</p>
              </div>

              {/* 2. Objeto a contratar y clasificación UNSPSC */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  2. Objeto a Contratar y Clasificación UNSPSC (Num. 2)
                </span>
                <p className="font-semibold text-slate-800">{edpActivo.objetoContrato}</p>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] text-slate-500">Códigos UNSPSC:</span>
                  {edpActivo.codigosUNSPSC.map((c) => (
                    <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      {c}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-500 ml-2">Plazo: {edpActivo.plazoEjecucionMeses} meses</span>
                  <span className="text-[11px] text-slate-500 ml-2">Lugar: {edpActivo.lugarEjecucion}</span>
                </div>
              </div>

              {/* 3. Modalidad de selección */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">
                  3. Modalidad de Selección y Fundamento Jurídico (Num. 3)
                </span>
                <div className="font-bold text-indigo-700">{edpActivo.modalidadSeleccion}</div>
                <p className="text-slate-600">{edpActivo.justificacionJuridicaModalidad}</p>
              </div>

              {/* 4. Valor estimado y análisis de precios */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    4. Valor Estimado del Contrato y Análisis del Sector (Num. 4)
                  </span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    ${edpActivo.presupuestoOficialCOP.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <p className="text-slate-600">{edpActivo.analisisSectorMercadoResumen}</p>
                <div className="text-[11px] text-slate-500 font-medium">
                  <strong>Forma de Pago:</strong> {edpActivo.formaDePago}
                </div>
              </div>

              {/* 5. Criterios habilitantes y limitación a MiPymes */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">
                  5. Criterios Habilitantes y Factores de Ponderación (Num. 5)
                </span>
                <p className="text-slate-700">{edpActivo.criteriosHabilitantesResumen}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-1">
                  <span>Limitación a MiPymes (Ley 2069/2020): <strong>{edpActivo.limitacionMipymes ? 'Sí aplica' : 'No convocada'}</strong></span>
                  <span>Acuerdos Comerciales Internacionales (TLCs): <strong>{edpActivo.acuerdosComercialesTLC ? 'Sí cobijado' : 'No cobijado'}</strong></span>
                </div>
              </div>

              {/* 6. Análisis del Riesgo (Conpes 3714) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">
                  6. Análisis del Riesgo y Forma de Mitigarlo (Num. 6 - Conpes 3714)
                </span>
                <p className="text-slate-700">{edpActivo.riesgosIdentificadosResumen}</p>
              </div>

              {/* 7. Garantías exigidas */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  7. Exigencia de Garantías Contractuales (Num. 7)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {edpActivo.garantiasExigidas.map((g) => (
                    <div key={g.tipo} className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="font-bold text-slate-800 text-[11px] block">{g.tipo}</span>
                      <span className="font-mono text-indigo-700 font-bold">{g.porcentaje}% del valor</span>
                      <span className="text-[10px] text-slate-400 block">{g.vigencia}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PESTAÑA 2: GESTOR PRESUPUESTAL & FINANCIERO (CDP & PAC) */}
      {pestana === 'GESTOR_PRESUPUESTAL_CDP' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Gestor de Recursos Presupuestales & Certificado de Disponibilidad (CDP)
                </h2>
                <p className="text-xs text-slate-500">
                  Respaldo financiero legal previo a la apertura del proceso en SECOP II (Estatuto Orgánico del Presupuesto).
                </p>
              </div>

              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono font-bold">
                {cdpActivo.numeroCDP}
              </div>
            </div>

            {/* Ficha del CDP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Rubro Presupuestal:</span>
                <span className="font-mono font-bold text-slate-800 text-xs block">{cdpActivo.rubroPresupuestal}</span>
                <span className="text-[10px] text-slate-500 leading-tight block">{cdpActivo.nombreRubro}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Fuente de Financiación:</span>
                <span className="font-bold text-indigo-700 text-xs block">
                  {cdpActivo.fuenteFinanciacion === 'PGN_NACION'
                    ? 'Presupuesto General de la Nación (PGN)'
                    : cdpActivo.fuenteFinanciacion === 'REGALIAS_SGR'
                    ? 'Sistema General de Regalías (SGR)'
                    : cdpActivo.fuenteFinanciacion}
                </span>
                <span className="text-[10px] text-slate-400 block">Recurso público fiscal amparado</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Valor Amparado:</span>
                <span className="font-mono font-black text-emerald-700 text-sm block">
                  ${cdpActivo.valorAmparadoCOP.toLocaleString('es-CO')} COP
                </span>
                <span className="text-[10px] text-slate-400 block">Saldo 100% disponible</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Vigencias Futuras:</span>
                <span className={`font-bold text-xs block ${cdpActivo.requiereVigenciasFuturas ? 'text-amber-700' : 'text-slate-700'}`}>
                  {cdpActivo.requiereVigenciasFuturas ? 'Requiere CONFIS / Vigencias Futuras' : 'No requiere (Vigencia actual)'}
                </span>
                {cdpActivo.autorizacionVigenciasFuturas && (
                  <span className="text-[10px] text-slate-500 block">{cdpActivo.autorizacionVigenciasFuturas}</span>
                )}
              </div>
            </div>

            {/* Cronograma Mensual del PAC (Plan Anual Mensualizado de Caja) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                  Programación del Plan Anual Mensualizado de Caja (PAC)
                </h3>
                <span className="text-[11px] font-bold text-slate-500">
                  Total Programado: 100% (\$ {cdpActivo.valorAmparadoCOP.toLocaleString('es-CO')} COP)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Mes / Hito PAC</th>
                      <th className="p-2.5 text-center">Porcentaje (%)</th>
                      <th className="p-2.5 text-right">Valor Asignado COP</th>
                      <th className="p-2.5 text-center">Disponibilidad en Tesorería</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {cdpActivo.programacionPACMensual.map((p) => (
                      <tr key={p.mes} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2.5 font-bold text-slate-900">{p.nombreMes}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-indigo-700">{p.porcentaje}%</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          ${p.valorCOP.toLocaleString('es-CO')}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            Giro Garantizado
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PESTAÑA 3: GESTOR DE RECURSOS DEL LICITANTE (ANÁLISIS GO / NO-GO) */}
      {pestana === 'GESTOR_RECURSOS_LICITANTE' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Gestor de Recursos Financieros del Licitante (Decisión Go / No-Go)
                </h2>
                <p className="text-xs text-slate-500">
                  Simulación de viabilidad de tesorería y colchón de liquidez para sostener la operación antes de ofertar.
                </p>
              </div>

              {/* Selector de Licitante Activo */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Proponente:</span>
                <select
                  value={proveedorActivoId}
                  onChange={(e) => setProveedorActivo(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 cursor-pointer focus:outline-none"
                  title="Cambiar oferente para evaluar su capacidad de tesorería y flujo de caja"
                >
                  <option value="PROV-04">SANJUANES SOLUCIONES S.A.S.</option>
                  <option value="PROV-05">INGELECGROUP S.A.S. BIC</option>
                  <option value="PROV-01">TECNOLOGÍA & SERVICIOS DE COLOMBIA</option>
                  <option value="PROV-02">INVERSIONES & SUMINISTROS</option>
                </select>
              </div>
            </div>

            {/* Parámetros Financieros Variables */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Desfase Pago Tesorería Estatal (Días):
                </label>
                <select
                  value={plazoPagoEstatalDias}
                  onChange={(e) => setPlazoPagoEstatalDias(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white"
                  title="Tiempo estimado en días que tarda la entidad estatal entre la radicación del acta y el giro efectivo"
                >
                  <option value={30}>30 días (Pago ágil / Raro en Colombia)</option>
                  <option value={60}>60 días (Estándar habitual entidad pública)</option>
                  <option value={90}>90 días (Tesorería lenta / Fin de año fiscal)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Margen de Utilidad Proyectado (%):
                </label>
                <input
                  type="number"
                  min={5}
                  max={40}
                  value={margenUtilidadPct}
                  onChange={(e) => setMargenUtilidadPct(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                  title="Margen de utilidad neto proyectado por el oferente en su oferta económica"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Anticipo Pactado en Pliego (%):
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={anticipoPct}
                  onChange={(e) => setAnticipoPct(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-indigo-700 bg-white"
                  title="Porcentaje de anticipo pactado en el contrato (requiere fiduciaria si es obra según Ley 1474)"
                />
              </div>
            </div>

            {/* Tarjetas de Balance Financiero del Licitante */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">Capital Trabajo Disponible:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ${(analisisGoNoGo.capitalTrabajoDisponibleCOP / 1e6).toFixed(0)}M COP
                </span>
                <span className="text-[10px] text-slate-400 block">Activo Cte - Pasivo Cte</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">Capital Trabajo Requerido:</span>
                <span className="font-mono font-bold text-indigo-700 text-sm">
                  ${(analisisGoNoGo.capitalTrabajoRequeridoCOP / 1e6).toFixed(0)}M COP
                </span>
                <span className="text-[10px] text-slate-400 block">Para cubrir desfase de caja</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">Prima Póliza Seriedad:</span>
                <span className="font-mono font-bold text-amber-700 text-sm">
                  ${(analisisGoNoGo.costoPolizaSeriedadCOP / 1e6).toFixed(1)}M COP
                </span>
                <span className="text-[10px] text-slate-400 block">Costo con aseguradora</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">Balance de Caja Previo:</span>
                <span
                  className={`font-mono font-black text-sm ${
                    analisisGoNoGo.deficitSuperavitCajaCOP >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  ${(analisisGoNoGo.deficitSuperavitCajaCOP / 1e6).toFixed(0)}M COP
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {analisisGoNoGo.deficitSuperavitCajaCOP >= 0 ? 'Superávit disponible' : 'Déficit de capital'}
                </span>
              </div>
            </div>

            {/* Banner de Dictamen Semafórico Go / No-Go */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                analisisGoNoGo.dictamenViabilidad === 'VIABLE_CON_ALTA_RENTABILIDAD'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : analisisGoNoGo.dictamenViabilidad === 'VIABLE_CON_RIESGO_DE_LIQUIDEZ'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {analisisGoNoGo.dictamenViabilidad === 'VIABLE_CON_ALTA_RENTABILIDAD' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : analisisGoNoGo.dictamenViabilidad === 'VIABLE_CON_RIESGO_DE_LIQUIDEZ' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <div className="font-black text-sm uppercase tracking-wide">
                    DICTAMEN GO / NO-GO: {analisisGoNoGo.dictamenViabilidad.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs opacity-90">
                    Proponente evaluado: <strong>{analisisGoNoGo.nombreProponente}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-[10px] uppercase text-slate-500 block">Músculo Financiero:</span>
                <span className="font-bold">
                  {((analisisGoNoGo.capitalTrabajoDisponibleCOP / Math.max(1, analisisGoNoGo.capitalTrabajoRequeridoCOP)) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Recomendaciones Estratégicas */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <span className="font-mono text-lime-400 font-bold uppercase block">
                Recomendaciones Estratégicas del Gestor de Recursos:
              </span>
              <ul className="space-y-1 text-slate-300">
                {analisisGoNoGo.recomendacionesEstrategicas.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">[{i + 1}]</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curva de Flujo de Caja Proyectado Mes a Mes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                Flujo de Caja Proyectado Mes a Mes (Desfase de Tesorería Estatal: {plazoPagoEstatalDias} días)
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Mes</th>
                      <th className="p-2.5">Hito / Concepto</th>
                      <th className="p-2.5 text-right text-emerald-700">Ingresos COP</th>
                      <th className="p-2.5 text-right text-rose-700">Egresos COP</th>
                      <th className="p-2.5 text-right">Flujo Neto</th>
                      <th className="p-2.5 text-right font-black">Saldo en Caja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {analisisGoNoGo.flujoCajaProyectado.map((f) => (
                      <tr key={f.mes} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2.5 font-bold font-mono">Mes {f.mes}</td>
                        <td className="p-2.5 text-slate-600 text-[11px]">{f.concepto}</td>
                        <td className="p-2.5 text-right font-mono text-emerald-700 font-bold">
                          ${f.ingresosCOP.toLocaleString('es-CO')}
                        </td>
                        <td className="p-2.5 text-right font-mono text-rose-700 font-bold">
                          ${f.egresosCOP.toLocaleString('es-CO')}
                        </td>
                        <td className={`p-2.5 text-right font-mono font-bold ${f.flujoNetoCOP >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          ${f.flujoNetoCOP.toLocaleString('es-CO')}
                        </td>
                        <td className={`p-2.5 text-right font-mono font-black ${f.saldoAcumuladoCOP >= 0 ? 'text-slate-900' : 'text-rose-700 bg-rose-50'}`}>
                          ${f.saldoAcumuladoCOP.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PESTAÑA 5: AUDIENCIA DE ASIGNACIÓN DE RIESGOS (ART. 4 LEY 1150) & AUDITOR DE ADENDAS (LEY 1882) */}
      {pestana === 'AUDIENCIA_RIESGOS_ADENDAS' && (
        <div className="space-y-6">
          {/* Bloque Superior: Audiencia de Asignación y Distribución de Riesgos */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  Audiencia Pública de Asignación y Distribución de Riesgos (Art. 4 Ley 1150 de 2007)
                </h2>
                <p className="text-xs text-slate-500">
                  Hito procesal obligatorio en Licitaciones Públicas. Fija de manera definitiva e inmodificable la matriz de riesgos previsibles.
                </p>
              </div>

              <div className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                Proceso: {edpActivo.procesoReferencia}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Formulario de Radicación de Intervención en Audiencia (5 cols) */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-slate-900 text-xs block">
                  Radicar Intervención en la Audiencia de Riesgos
                </span>

                <form onSubmit={handleRadicarIntervencionAudiencia} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Participante / Oferente:
                    </label>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 font-bold text-slate-900">
                      {proponenteActivo.razonSocial}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tipología de Riesgo a Debatir:
                    </label>
                    <select
                      value={tipoRiesgoAudiencia}
                      onChange={(e) => setTipoRiesgoAudiencia(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:border-indigo-500"
                      title="Seleccionar el tipo de riesgo previsible a debatir"
                    >
                      <option value="CAMBIARIO_TRM">Riesgo Cambiario y Volatilidad TRM (Moneda Extranjera)</option>
                      <option value="OPERACIONAL_TECNICO">Riesgo Operacional y de Ejecución Técnica</option>
                      <option value="REGULATORIO_LEGAL">Riesgo Regulatorio, Normativo y Tributario</option>
                      <option value="DISPONIBILIDAD_RED">Riesgo de Servidumbres, Vías y Redes</option>
                      <option value="FUERZA_MAYOR">Fuerza Mayor y Eventos de la Naturaleza</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Argumentación Técnica y Jurídica:
                    </label>
                    <textarea
                      rows={3}
                      value={argumentoAudiencia}
                      onChange={(e) => setArgumentoAudiencia(e.target.value)}
                      placeholder="Describa el desequilibrio o imprevisión que genera la asignación de este riesgo..."
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                      title="Detalle los motivos por los cuales el riesgo no debe ser asumido íntegramente por el contratista"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Solicitud Concreta de Reasignación:
                    </label>
                    <textarea
                      rows={2}
                      value={solicitudAudiencia}
                      onChange={(e) => setSolicitudAudiencia(e.target.value)}
                      placeholder="Pactar corredor de variación compartida del +/- 8%, suspender plazos ante retraso en permisos, etc."
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 text-xs"
                      title="Indique qué redacción o fórmula de reparto de riesgo solicita que adopte la entidad"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    title="Registrar intervención formal en el acta de la audiencia de riesgos"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Radicar Intervención en Audiencia</span>
                  </button>
                </form>
              </div>

              {/* Registro de Intervenciones y Decisiones de la Entidad (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <span className="font-bold text-slate-900 text-xs block">
                  Acta de Intervenciones y Decisiones de la Entidad ({intervencionesAudiencia.length})
                </span>

                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {intervencionesAudiencia.map((ar) => (
                    <div key={ar.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900 text-indigo-300">
                          {ar.id} • {ar.tipoRiesgoDebatido.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ar.decisionEntidad === 'MODIFICADO_MEDIANTE_ADENDA'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : ar.decisionEntidad === 'RATIFICADO_SEGÚN_PLIEGO'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {ar.decisionEntidad.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900">{ar.participante}</span>
                        <span className="text-[10px] text-slate-500 block">
                          Rol: {ar.rolParticipante} | Hora: {ar.fechaHora}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed text-[11px]">
                        <strong>Intervención:</strong> {ar.argumentoIntervencion}
                      </div>

                      <div className="text-[11px] text-indigo-700 font-medium">
                        <strong>Solicitud:</strong> {ar.solicitudReasignacion}
                      </div>

                      <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-[11px] space-y-1">
                        <div className="font-bold text-[10px] uppercase text-indigo-800">
                          Decisión Oficial de la Entidad Estatal:
                        </div>
                        <p className="leading-relaxed">{ar.justificacionLegalEntidad}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Inferior: Simulador y Auditor de Adendas Modificatorias (Ley 1882 de 2018) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-emerald-600" />
                  Simulador & Auditor de Legalidad de Adendas (Ley 1882 de 2018)
                </h2>
                <p className="text-xs text-slate-500">
                  Control temporal estricto: "No se podrán expedir adendas dentro de los 3 días hábiles anteriores al cierre del proceso".
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                Regla de Oro: Mínimo 3 Días Hábiles
              </span>
            </div>

            {/* Controles de Simulación de Adenda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block flex items-center justify-between">
                  <span>Días Hábiles de Antelación al Cierre:</span>
                  <span className="font-mono text-sm text-indigo-700 font-bold">
                    {diasAntelacionAdenda} días hábiles
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={diasAntelacionAdenda}
                  onChange={(e) => setDiasAntelacionAdenda(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                  title="Ajustar con cuántos días de antelación al cierre se expide la adenda"
                />
                <span className="text-[10px] text-slate-500 block">
                  Si es menor a 3 días hábiles, la adenda es extemporánea a menos que se prorrogue el cierre.
                </span>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 block flex items-center justify-between">
                  <span>Prórroga Obligatoria al Cierre Otorgada:</span>
                  <span className="font-mono text-sm text-emerald-700 font-bold">
                    {prorrogaDiasAdenda} días hábiles
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={prorrogaDiasAdenda}
                  onChange={(e) => setProrrogaDiasAdenda(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                  title="Ajustar cuántos días hábiles de prórroga concede la entidad para la entrega de ofertas"
                />
                <span className="text-[10px] text-slate-500 block">
                  Para convalidar una adenda tardía, la entidad debe prorrogar el cierre por al menos 3 días hábiles.
                </span>
              </div>
            </div>

            {/* Dictamen Jurídico en Vivo del Simulador */}
            {(() => {
              const resultado = PrecontractualEngine.evaluarLegalidadAdenda({
                fechaPublicacion: new Date().toISOString().split('T')[0],
                diasHabilesAntelacionAlCierre: diasAntelacionAdenda,
                prorrogaCierreDiasHabiles: prorrogaDiasAdenda
              });

              return (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    resultado.esLegal
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  {resultado.esLegal ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs">
                    <div className="font-black text-xs uppercase tracking-wide">
                      {resultado.esLegal ? 'DICTAMEN: ADENDA JURÍDICAMENTE VÁLIDA' : 'DICTAMEN: ADENDA ILEGAL / EXTEMPORÁNEA'}
                    </div>
                    <p className="leading-relaxed">{resultado.dictamen}</p>
                    <div className="text-[11px] font-medium opacity-90">
                      <strong>Riesgo Contencioso / Disciplinario:</strong> {resultado.sancionPotencial}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Listado de Adendas Oficiales Expedidas en el Proceso */}
            <div className="space-y-2 pt-2">
              <span className="font-bold text-slate-900 text-xs block">
                Historial de Adendas Oficiales Publicadas en SECOP II ({adendasList.length})
              </span>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Adenda No.</th>
                      <th className="p-2.5">Publicación</th>
                      <th className="p-2.5">Objeto de Modificación</th>
                      <th className="p-2.5 text-center">Antelación</th>
                      <th className="p-2.5 text-center">Prórroga</th>
                      <th className="p-2.5 text-center">Estado Legal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adendasList.map((ad) => (
                      <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-mono font-bold text-indigo-700">
                          Adenda {ad.numeroAdenda}
                        </td>
                        <td className="p-2.5 font-mono text-slate-600 text-[11px]">
                          {ad.fechaPublicacion} ({ad.horaPublicacion})
                        </td>
                        <td className="p-2.5 text-slate-800 text-[11px] leading-relaxed max-w-md">
                          {ad.objetoModificacion}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                          {ad.diasHabilesAntelacionAlCierre} días
                        </td>
                        <td className="p-2.5 text-center font-mono">
                          {ad.prorrogoPlazoCierre ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Sí
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">No</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                            Conforme Ley 1882
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PESTAÑA 6: MESA DE OBSERVACIONES AL PROYECTO DE PLIEGO */}
      {pestana === 'OBSERVACIONES_PLIEGO' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Formulario de Radicación de Observación (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-900 text-sm">
                  Radicar Observación al Borrador de Pliego
                </h2>
              </div>

              <form onSubmit={handleRadicarObservacion} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Licitante Remitente:
                  </label>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-900">
                    {proponenteActivo.razonSocial} (NIT {proponenteActivo.nit})
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cláusula o Numeral Cuestionado:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Numeral 3.1 - Experiencia RUP / Pliego Sastre"
                    value={nuevaClausula}
                    onChange={(e) => setNuevaClausula(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    title="Identifique la sección o acápite del proyecto de pliego objeto de controversia"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tipo de Cuestionamiento:
                  </label>
                  <select
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-slate-50"
                    title="Seleccione la naturaleza de la objeción jurídica, técnica o económica"
                  >
                    <option value="EXPERIENCIA_PLIEGO_SASTRE">Requisito Restrictivo / Presunto Pliego Sastre</option>
                    <option value="JURIDICA">Inconsistencia Jurídica / Omisión Ley 2069</option>
                    <option value="FINANCIERA">Ratio Financiero Desproporcionado</option>
                    <option value="TECNICA">Especificación Técnica Restrictiva</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Argumentación Jurídica y Fáctica:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Sustente por qué la exigencia vulnera la selección objetiva o la libre concurrencia..."
                    value={nuevoArgumento}
                    onChange={(e) => setNuevoArgumento(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    title="Exponga la fundamentación legal invocando normas de la Ley 80, Ley 1150 o circulares de CCE"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Solicitud Concreta a la Entidad:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Solicito modificar la cláusula para que rece de la siguiente manera..."
                    value={nuevaSolicitud}
                    onChange={(e) => setNuevaSolicitud(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    title="Redacte el texto exacto sustitutivo que la entidad debe publicar en el pliego definitivo"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  title="Radicar formalmente la observación ante la entidad estatal en el marco del Decreto 1082"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Radicar Observación al Pliego</span>
                </button>
              </form>
            </div>

            {/* Listado de Observaciones y Respuestas Oficiales (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">
                  Historial de Observaciones & Respuestas Oficiales de la Entidad
                </h3>
                <span className="text-xs font-mono font-bold text-indigo-700">
                  {observaciones.length} radicadas
                </span>
              </div>

              <div className="space-y-3">
                {observaciones.map((obs) => (
                  <div key={obs.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900 text-cyan-400">
                        {obs.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          obs.estado === 'ACEPTADA_TOTAL'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : obs.estado === 'PENDIENTE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {obs.estado.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{obs.clausulaCuestionada}</span>
                      <span className="text-[10px] text-slate-500">
                        Remitente: <strong>{obs.remitente}</strong> | Fecha: {obs.fechaRadicacion}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                      <strong>Argumento:</strong> {obs.argumentacion}
                    </div>

                    <div className="text-[11px] text-indigo-700 font-medium">
                      <strong>Solicitud:</strong> {obs.solicitudConcreta}
                    </div>

                    {obs.respuestaEntidad && (
                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-950 space-y-1">
                        <div className="font-bold text-[10px] uppercase text-blue-800">
                          Respuesta Oficial de la Entidad Estatal:
                        </div>
                        <p className="leading-relaxed">{obs.respuestaEntidad}</p>
                        {obs.fundamentoRespuesta && (
                          <div className="text-[10px] text-blue-700 italic">
                            Motivación: {obs.fundamentoRespuesta}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
