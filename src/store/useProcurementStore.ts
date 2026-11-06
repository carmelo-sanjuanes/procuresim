// Almacén de Estado Global Reactivo (Zustand) con Soporte de Auditoría y Persistencia
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PlataformaVista,
  ProcesoContratacion,
  EntidadContratante,
  ProponenteDatos,
  AnalisisEstudioMercado,
  EventoAuditoria,
  ObservacionBitacora,
  OfertaPresentada,
  EstadoProceso,
  ControversiaContractual,
  AsociacionPlural,
  ModoOperativoSuite
} from '../core/domain/types';
import {
  type Expediente,
  type DatosExpediente,
  crearIdExpediente,
  serializarExpedientes,
  leerExpedientes
} from '../core/domain/expedientes';
import { ENTIDADES_DEMO } from '../mock-data/entidadesDemo';
import { PROVEEDORES_DEMO } from '../mock-data/proveedoresDemo';
import { PROCESOS_DEMO } from '../mock-data/procesosDemo';
import { CONTROVERSIAS_DEMO } from '../mock-data/controversiasDemo';
import { ASOCIACIONES_DEMO } from '../mock-data/consorciosDemo';
import { leerJsonImportado, listaDeRegistros } from '../core/seguridad/entradaSegura';
import {
  LegalWatchdogEngine,
  HitoRegulatorioJurisprudencial,
  ParametrosEntornoRegulatorio
} from '../core/engines/LegalWatchdogEngine';

export type MisionEntrenamiento = 'ENTIDAD' | 'OFERENTE' | 'AUDITOR' | 'LIBRE';

interface ProcurementState {
  modoOperativo: ModoOperativoSuite;
  vistaActual: PlataformaVista;
  procesoSeleccionadoId: string;
  proveedorActivoId: string;
  procesos: ProcesoContratacion[];
  entidades: EntidadContratante[];
  proveedores: ProponenteDatos[];
  estudiosMercado: AnalisisEstudioMercado[];
  eventosAuditoria: EventoAuditoria[];
  bitacoraObservaciones: ObservacionBitacora[];
  controversias: ControversiaContractual[];
  asociaciones: AsociacionPlural[];
  parametrosRegulatorios: ParametrosEntornoRegulatorio;
  hitosRegulatorios: HitoRegulatorioJurisprudencial[];

  // Estado del Flujo Guiado y Misiones de Entrenamiento (UX Guiada)
  misionActiva: MisionEntrenamiento;
  etapaWorkflow: number; // 1: Planeación | 2: Observaciones | 3: Ofertas/RUP | 4: Evaluación/Desempate | 5: Contrato
  guiaAsistenteExpandida: boolean;
  densidadVisual: 'ENFOCADA_SIMPLE' | 'EXPERTO_AVANZADA';

  // Acciones de Flujo Guiado
  setMisionActiva: (mision: MisionEntrenamiento) => void;
  setEtapaWorkflow: (etapa: number) => void;
  avanzarEtapaWorkflow: () => void;
  retrocederEtapaWorkflow: () => void;
  iniciarRutaMision: (mision: MisionEntrenamiento) => void;
  toggleGuiaAsistente: () => void;
  setDensidadVisual: (densidad: 'ENFOCADA_SIMPLE' | 'EXPERTO_AVANZADA') => void;

  // Mis Procesos: expedientes del flujo paso a paso (persistentes)
  expedientes: Expediente[];
  expedienteActivoId: string | null;
  lienzoVersion: number; // cambia al reanudar/abrir un lienzo nuevo para remontar el flujo
  guardarExpediente: (datos: DatosExpediente, id?: string | null) => string | null;
  reanudarExpediente: (id: string) => void;
  nuevoLienzo: () => void;
  duplicarExpediente: (id: string) => string | null;
  eliminarExpediente: (id: string) => void;
  exportarExpedientesJSON: (ids?: string[]) => string;
  importarExpedientesJSON: (json: string) => { ok: boolean; importados: number; omitidos: number };

  // Acciones Generales
  setModoOperativo: (modo: ModoOperativoSuite) => void;
  setVista: (vista: PlataformaVista) => void;
  seleccionarProceso: (id: string) => void;
  setProveedorActivo: (id: string) => void;
  conmutarHitoRegulatorio: (hitoId: string, activo: boolean) => void;
  actualizarParametroRegulatorio: <K extends keyof ParametrosEntornoRegulatorio>(parametro: K, valor: ParametrosEntornoRegulatorio[K]) => void;
  restablecerParametrosRegulatorios: () => void;
  crearProceso: (proceso: ProcesoContratacion) => void;
  actualizarEstadoProceso: (procesoId: string, nuevoEstado: EstadoProceso) => void;
  radicarOferta: (procesoId: string, oferta: OfertaPresentada) => void;
  evaluarOferta: (procesoId: string, ofertaId: string, evalJuridica: 'CUMPLE' | 'POR_SUBSANAR' | 'NO_CUMPLE', evalFinanciera: 'CUMPLE' | 'POR_SUBSANAR' | 'NO_CUMPLE', evalTecnica: 'CUMPLE' | 'POR_SUBSANAR' | 'NO_CUMPLE') => void;
  adjudicarProceso: (procesoId: string, ofertaGanadoraId: string) => void;
  aplicarPuntajesEconomicosProceso: (
    procesoId: string,
    ofertasCalificadas: { ofertaId: string; puntajeEconomico: number; puntajeTotal: number; esGanador: boolean }[]
  ) => void;
  agregarObservacion: (procesoId: string, remitente: string, texto: string) => void;
  responderObservacion: (procesoId: string, obsId: string, respuesta: string, estado: 'ACEPTADA' | 'RECHAZADA') => void;
  guardarEstudioMercado: (estudio: AnalisisEstudioMercado) => void;
  agregarControversia: (controversia: ControversiaContractual) => void;
  responderControversia: (controversiaId: string, respuesta: any, nuevoEstado: any) => void;
  guardarAsociacion: (asociacion: AsociacionPlural) => void;
  registrarAuditoria: (modulo: string, accion: string, detalles: string, rol?: 'ENTIDAD' | 'PROVEEDOR' | 'AUDITOR' | 'SISTEMA') => void;
  registrarObservacionBitacora: (obs: Omit<ObservacionBitacora, 'id' | 'fecha' | 'manual'> & { manual?: boolean }) => void;
  reiniciarDatosDemo: () => void;
  exportarEstadoJSON: () => string;
  importarEstadoJSON: (jsonString: string) => boolean;
}

export const useProcurementStore = create<ProcurementState>()(
  persist(
    (set, get) => ({
  modoOperativo: 'ENTRENAMIENTO',
  vistaActual: 'FLUJOGRAMA_PASO_A_PASO',
  procesoSeleccionadoId: 'PROC-SECOP2-01',
  proveedorActivoId: 'PROV-04',
  procesos: PROCESOS_DEMO,
  entidades: ENTIDADES_DEMO,
  proveedores: PROVEEDORES_DEMO,
  estudiosMercado: [],
  controversias: CONTROVERSIAS_DEMO,
  asociaciones: ASOCIACIONES_DEMO,
  parametrosRegulatorios: LegalWatchdogEngine.PARAMETROS_DEFAULT,
  hitosRegulatorios: LegalWatchdogEngine.HITOS_REGULATORIOS_OFICIALES,

  // Estado Guiado
  misionActiva: 'ENTIDAD',
  etapaWorkflow: 1,
  guiaAsistenteExpandida: false,
  densidadVisual: 'ENFOCADA_SIMPLE',

  setDensidadVisual: (densidad) => set({ densidadVisual: densidad }),
  setMisionActiva: (mision) => set({ misionActiva: mision }),
  setEtapaWorkflow: (etapa) => {
    const clamped = Math.max(1, Math.min(5, etapa));
    if (get().vistaActual === 'FLUJOGRAMA_PASO_A_PASO' || get().densidadVisual === 'ENFOCADA_SIMPLE') {
      set({ etapaWorkflow: clamped, vistaActual: 'FLUJOGRAMA_PASO_A_PASO' });
      return;
    }
    let nuevaVista: PlataformaVista = get().vistaActual;
    if (clamped === 1) nuevaVista = 'INGENIERIA_PRECONTRACTUAL';
    else if (clamped === 2) nuevaVista = 'INGENIERIA_PRECONTRACTUAL';
    else if (clamped === 3) nuevaVista = 'VALIDADOR_RUP';
    else if (clamped === 4) nuevaVista = 'HERRAMIENTAS_ECONOMICAS_AVANZADAS';
    else if (clamped === 5) nuevaVista = 'LIQUIDACION_CONTRATOS';

    set({ etapaWorkflow: clamped, vistaActual: nuevaVista });
  },
  avanzarEtapaWorkflow: () => {
    const siguiente = Math.min(5, get().etapaWorkflow + 1);
    get().setEtapaWorkflow(siguiente);
  },
  retrocederEtapaWorkflow: () => {
    const anterior = Math.max(1, get().etapaWorkflow - 1);
    get().setEtapaWorkflow(anterior);
  },
  iniciarRutaMision: (mision) => {
    set({
      misionActiva: mision,
      etapaWorkflow: 1,
      vistaActual: 'FLUJOGRAMA_PASO_A_PASO',
      guiaAsistenteExpandida: false
    });
  },
  toggleGuiaAsistente: () => {
    set((state) => ({ guiaAsistenteExpandida: !state.guiaAsistenteExpandida }));
  },

  bitacoraObservaciones: [],

  eventosAuditoria: [
    {
      id: 'AUD-001',
      fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuario: 'Sistema de Entrenamiento',
      rol: 'SISTEMA',
      modulo: 'INICIALIZACIÓN',
      accion: 'Carga de Entorno de Entrenamiento',
      detalles: 'Entorno de simulación inicializado con procesos en SECOP I, SECOP II, Suplos, SAP Ariba y Coupa.'
    }
  ],

  conmutarHitoRegulatorio: (hitoId, activo) => {
    const hitosActualizados = get().hitosRegulatorios.map((h) =>
      h.id === hitoId ? { ...h, activoEnEntorno: activo } : h
    );
    const hitoModificado = hitosActualizados.find((h) => h.id === hitoId);

    // Mapear el hito con la variable del entorno
    const nuevosParametros = { ...get().parametrosRegulatorios };
    if (hitoModificado) {
      switch (hitoModificado.variableEntornoAfectada) {
        case 'PREFERENCIA_SOCIEDADES_BIC':
          nuevosParametros.preferenciaSociedadesBicActiva = activo;
          break;
        case 'EXCLUSIVIDAD_RUP_STRICT':
          nuevosParametros.exclusividadRupActiva = activo;
          break;
        case 'CONTROL_ADENDAS_LEY_1882':
          nuevosParametros.limiteEstrictoAdendasLey1882 = activo;
          break;
        case 'CORREDOR_TRM_NUBE_OBLIGATORIO':
          nuevosParametros.corredorCambiarioTrmObligatorio = activo;
          break;
        case 'BENEFICIARIOS_FINALES_ANTICORRUPCION':
          nuevosParametros.beneficiariosFinalesActivos = activo;
          break;
        case 'REFORMA_COMPRAS_POPULARES_SANDBOX':
          nuevosParametros.sandboxComprasPopularesActivo = activo;
          break;
      }
    }

    set({
      hitosRegulatorios: hitosActualizados,
      parametrosRegulatorios: nuevosParametros
    });

    get().registrarAuditoria(
      'RADAR REGULATORIO',
      `Conmutación de Hito Legal [${hitoModificado?.referenciaOficial || hitoId}]`,
      `El usuario ${activo ? 'ACTIVÓ' : 'DESACTIVÓ'} el hito "${hitoModificado?.titulo}". Impacto en entorno: ${hitoModificado?.descripcionImpactoEntorno}.`,
      'AUDITOR'
    );
  },

  actualizarParametroRegulatorio: (parametro, valor) => {
    set((state) => ({
      parametrosRegulatorios: {
        ...state.parametrosRegulatorios,
        [parametro]: valor
      }
    }));
    get().registrarAuditoria(
      'RADAR REGULATORIO',
      `Calibración de Parámetro Regulatorio [${String(parametro)}]`,
      `Valor actualizado a: ${JSON.stringify(valor)}.`,
      'SISTEMA'
    );
  },

  restablecerParametrosRegulatorios: () => {
    set({
      parametrosRegulatorios: LegalWatchdogEngine.PARAMETROS_DEFAULT,
      hitosRegulatorios: LegalWatchdogEngine.HITOS_REGULATORIOS_OFICIALES
    });
    get().registrarAuditoria(
      'RADAR REGULATORIO',
      'Restablecimiento de Entorno Regulatorio',
      'Se restauraron las variables normativas y jurisprudenciales a los valores oficiales de fábrica.',
      'SISTEMA'
    );
  },

  setModoOperativo: (modo) => {
    set({ modoOperativo: modo, vistaActual: 'FLUJOGRAMA_PASO_A_PASO' });
    get().registrarAuditoria(
      'ENTORNO OPERATIVO',
      `Cambio de Modo a ${modo === 'PRODUCCION_REAL' ? 'PRODUCCIÓN REAL & ENTERPRISE' : 'ENTRENAMIENTO & SANDBOX'}`,
      `El usuario conmutó el entorno maestro a ${modo}.`,
      'SISTEMA'
    );
  },

  setVista: (vista) => {
    let nuevaEtapa = get().etapaWorkflow;
    if (vista === 'INGENIERIA_PRECONTRACTUAL' || vista === 'GENERADOR_DOCUMENTOS' || vista === 'ESTUDIO_MERCADO' || vista === 'MATRIZ_RIESGOS' || vista === 'SECOP_I') {
      nuevaEtapa = 1;
    } else if (vista === 'GESTION_CONTROVERSIAS') {
      nuevaEtapa = 2;
    } else if (vista === 'VALIDADOR_RUP' || vista === 'ASISTENTE_PROPUESTAS' || vista === 'SECOP_II_PROVEEDOR' || vista === 'GESTOR_CONSORCIOS' || vista === 'SUPLOS' || vista === 'SAP_ARIBA' || vista === 'COUPA') {
      nuevaEtapa = 3;
    } else if (vista === 'HERRAMIENTAS_ECONOMICAS_AVANZADAS' || vista === 'SIMULADOR_CALIFICACION' || vista === 'SECOP_II_ENTIDAD' || vista === 'SUBASTA_INVERSA' || vista === 'TIENDA_VIRTUAL_TVEC') {
      nuevaEtapa = 4;
    } else if (vista === 'LIQUIDACION_CONTRATOS' || vista === 'SUITE_PRODUCCION_REAL' || vista === 'INTELIGENCIA_TENDENCIAS') {
      nuevaEtapa = 5;
    }
    set({ vistaActual: vista, etapaWorkflow: nuevaEtapa });
    get().registrarAuditoria('NAVEGACIÓN', `Cambio de plataforma a ${vista}`, `El usuario cambió la vista a ${vista}`);
  },

  seleccionarProceso: (id) => {
    set({ procesoSeleccionadoId: id });
  },

  setProveedorActivo: (id) => {
    set({ proveedorActivoId: id });
  },

  crearProceso: (nuevoProceso) => {
    set((state) => ({
      procesos: [nuevoProceso, ...state.procesos],
      procesoSeleccionadoId: nuevoProceso.id
    }));
    get().registrarAuditoria(
      'ESTRUCTURACIÓN',
      'Creación de Proceso de Contratación',
      `Se creó el proceso ${nuevoProceso.numeroProceso} con presupuesto de \$${nuevoProceso.presupuestoOficial.toLocaleString('es-CO')}`,
      'ENTIDAD'
    );
  },

  actualizarEstadoProceso: (procesoId, nuevoEstado) => {
    set((state) => ({
      procesos: state.procesos.map((p) => (p.id === procesoId ? { ...p, estado: nuevoEstado } : p))
    }));
    get().registrarAuditoria(
      'GESTIÓN CONTRACTUAL',
      `Cambio de Estado de Proceso a ${nuevoEstado}`,
      `El proceso ${procesoId} avanzó a la etapa ${nuevoEstado}`,
      'ENTIDAD'
    );
  },

  radicarOferta: (procesoId, oferta) => {
    set((state) => ({
      procesos: state.procesos.map((p) => {
        if (p.id === procesoId) {
          return {
            ...p,
            ofertasPresentadas: [...p.ofertasPresentadas, oferta]
          };
        }
        return p;
      })
    }));
    get().registrarAuditoria(
      'PROPONENTES',
      'Radicación de Oferta Económica y Técnica',
      `El proponente ${oferta.proponente.razonSocial} radicó la oferta ${oferta.id} por \$${oferta.valorEconomicoTotal.toLocaleString('es-CO')}`,
      'PROVEEDOR'
    );
  },

  evaluarOferta: (procesoId, ofertaId, evalJuridica, evalFinanciera, evalTecnica) => {
    set((state) => ({
      procesos: state.procesos.map((p) => {
        if (p.id === procesoId) {
          return {
            ...p,
            ofertasPresentadas: p.ofertasPresentadas.map((o) => {
              if (o.id === ofertaId) {
                return {
                  ...o,
                  evaluacionJuridica: evalJuridica,
                  evaluacionFinanciera: evalFinanciera,
                  evaluacionTecnica: evalTecnica
                };
              }
              return o;
            })
          };
        }
        return p;
      })
    }));
    get().registrarAuditoria(
      'COMITÉ EVALUADOR',
      'Evaluación de Requisitos Habilitantes',
      `Evaluación registrada para la oferta ${ofertaId}: Jurídica (${evalJuridica}), Financiera (${evalFinanciera}), Técnica (${evalTecnica})`,
      'ENTIDAD'
    );
  },

  adjudicarProceso: (procesoId, ofertaGanadoraId) => {
    set((state) => ({
      procesos: state.procesos.map((p) => {
        if (p.id === procesoId) {
          return {
            ...p,
            estado: 'ADJUDICACION' as EstadoProceso,
            ofertasPresentadas: p.ofertasPresentadas.map((o) => ({
              ...o,
              esGanador: o.id === ofertaGanadoraId
            }))
          };
        }
        return p;
      })
    }));
    get().registrarAuditoria(
      'AUDIENCIA DE ADJUDICACIÓN',
      'Adjudicación Formal del Contrato',
      `El proceso ${procesoId} fue adjudicado a la oferta ganadora ${ofertaGanadoraId}`,
      'ENTIDAD'
    );
  },

  agregarObservacion: (procesoId, remitente, texto) => {
    const nuevaObs = {
      id: `OBS-${Date.now()}`,
      remitente,
      fecha: new Date().toISOString().split('T')[0],
      texto,
      estado: 'PENDIENTE' as const
    };
    set((state) => ({
      procesos: state.procesos.map((p) => {
        if (p.id === procesoId) {
          return {
            ...p,
            observacionesCiudadanas: [...p.observacionesCiudadanas, nuevaObs]
          };
        }
        return p;
      })
    }));
    get().registrarAuditoria(
      'PARTICIPACIÓN CIUDADANA',
      'Formulación de Observación a los Pliegos',
      `Observación radicada por ${remitente} en el proceso ${procesoId}`,
      'PROVEEDOR'
    );
  },

  responderObservacion: (procesoId, obsId, respuesta, estado) => {
    set((state) => ({
      procesos: state.procesos.map((p) => {
        if (p.id === procesoId) {
          return {
            ...p,
            observacionesCiudadanas: p.observacionesCiudadanas.map((obs) => {
              if (obs.id === obsId) {
                return { ...obs, respuestaEntidad: respuesta, estado };
              }
              return obs;
            })
          };
        }
        return p;
      })
    }));
    get().registrarAuditoria(
      'RESPUESTA A OBSERVACIONES',
      `Observación ${obsId} marcada como ${estado}`,
      `Respuesta emitida por la entidad en el proceso ${procesoId}`,
      'ENTIDAD'
    );
  },

  guardarEstudioMercado: (estudio) => {
    set((state) => ({
      estudiosMercado: [estudio, ...state.estudiosMercado]
    }));
    get().registrarAuditoria(
      'ESTUDIO DEL SECTOR',
      'Registro de Estudio de Mercado y Análisis de Precios',
      `Estudio ${estudio.id} calculado con presupuesto oficial de \$${estudio.presupuestoTotalEstimado.toLocaleString('es-CO')}`,
      'ENTIDAD'
    );
  },

  agregarControversia: (controversia: ControversiaContractual) => {
    set((state) => ({
      controversias: [controversia, ...state.controversias]
    }));
    get().registrarAuditoria(
      'GESTIÓN DE CONTROVERSIAS',
      `Apertura de Controversia: ${controversia.tipo}`,
      `Radicado ${controversia.id} en proceso ${controversia.procesoId} con cuantía \$${(controversia.pretensionEconomicaCOP || 0).toLocaleString('es-CO')}`,
      'ENTIDAD'
    );
  },

  registrarObservacionBitacora: (obs) => {
    const nueva: ObservacionBitacora = {
      id: `OBS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fecha: new Date().toISOString().split('T')[0],
      origen: obs.origen,
      descripcion: obs.descripcion,
      normaInfringida: obs.normaInfringida,
      nivelRiesgo: obs.nivelRiesgo,
      manual: obs.manual ?? false
    };
    set((state) => ({
      bitacoraObservaciones: [nueva, ...state.bitacoraObservaciones.slice(0, 199)]
    }));
    get().registrarAuditoria(
      'LEGAL WATCHDOG',
      `Observación registrada (${obs.origen}) — riesgo ${obs.nivelRiesgo}`,
      `${obs.normaInfringida}: ${obs.descripcion}`,
      'AUDITOR'
    );
  },

  responderControversia: (controversiaId: string, respuesta: string, nuevoEstado: ControversiaContractual['estado']) => {
    set((state) => ({
      controversias: state.controversias.map((c) =>
        c.id === controversiaId
          ? {
              ...c,
              estado: nuevoEstado,
              respuestasEmitidas: [
                ...c.respuestasEmitidas,
                {
                  id: `RESP-${Date.now()}`,
                  fecha: new Date().toISOString().split('T')[0],
                  tipoActo: 'RESOLUCION_MOTIVADA',
                  titulo: `Decisión sobre expediente ${c.numeroExpediente}`,
                  contenidoRedactado: respuesta,
                  autor: 'Entidad Contratante'
                }
              ]
            }
          : c
      )
    }));
    get().registrarAuditoria(
      'GESTIÓN DE CONTROVERSIAS',
      `Respuesta a Controversia ${controversiaId}`,
      `Estado actualizado a ${nuevoEstado}`,
      'ENTIDAD'
    );
  },

  guardarAsociacion: (asociacion: AsociacionPlural) => {
    set((state) => {
      const existe = state.asociaciones.some((a) => a.id === asociacion.id);
      return {
        asociaciones: existe
          ? state.asociaciones.map((a) => (a.id === asociacion.id ? asociacion : a))
          : [asociacion, ...state.asociaciones]
      };
    });
    get().registrarAuditoria(
      'CONSORCIOS Y ASOCIACIONES',
      `Estructuración de ${asociacion.tipo}: ${asociacion.nombreAsociacion}`,
      `Registrada asociación con ${asociacion.miembros.length} miembros. Participación total: ${asociacion.miembros.reduce((acc, m) => acc + m.porcentajeParticipacion, 0)}%`,
      'PROVEEDOR'
    );
  },

  registrarAuditoria: (modulo, accion, detalles, rol = 'SISTEMA') => {
    const nuevoEvento: EventoAuditoria = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuario: rol === 'ENTIDAD' ? 'Funcionario Estructurador' : rol === 'PROVEEDOR' ? 'Representante Legal Oferente' : 'Sistema Auditor',
      rol,
      modulo,
      accion,
      detalles
    };
    set((state) => ({
      eventosAuditoria: [nuevoEvento, ...state.eventosAuditoria.slice(0, 99)] // Guardar últimos 100 eventos
    }));
  },

  aplicarPuntajesEconomicosProceso: (procesoId, ofertasCalificadas) => {
    set((state) => ({
      procesos: state.procesos.map((p) => {
        if (p.id === procesoId) {
          const mapa = new Map(ofertasCalificadas.map((c) => [c.ofertaId, c]));
          return {
            ...p,
            ofertasPresentadas: p.ofertasPresentadas.map((o) => {
              const cal = mapa.get(o.id);
              if (cal) {
                return {
                  ...o,
                  puntajeObtenido: {
                    ...o.puntajeObtenido,
                    economico: cal.puntajeEconomico,
                    total: cal.puntajeTotal
                  },
                  esGanador: cal.esGanador
                };
              }
              return o;
            })
          };
        }
        return p;
      })
    }));
    get().registrarAuditoria(
      'CALIFICACIÓN CCE',
      'Aplicación de Fórmulas CCE a Ofertas',
      `Se actualizaron los puntajes económicos oficiales de las ofertas en el proceso ${procesoId}`,
      'ENTIDAD'
    );
  },

  expedientes: [],
  expedienteActivoId: null,
  lienzoVersion: 0,

  guardarExpediente: (datos, id) => {
    const ahora = new Date().toISOString();
    if (id) {
      if (!get().expedientes.some((e) => e.id === id)) return null; // fue eliminado
      set((st) => ({
        expedientes: st.expedientes.map((e) => (e.id === id ? { ...e, ...datos, id: e.id, creadoEn: e.creadoEn, actualizadoEn: ahora } : e))
      }));
      return id;
    }
    const nuevo: Expediente = { ...datos, id: crearIdExpediente(), creadoEn: ahora, actualizadoEn: ahora };
    set((st) => ({ expedientes: [nuevo, ...st.expedientes], expedienteActivoId: nuevo.id }));
    return nuevo.id;
  },

  reanudarExpediente: (id) => {
    if (!get().expedientes.some((e) => e.id === id)) return;
    set((st) => ({ expedienteActivoId: id, lienzoVersion: st.lienzoVersion + 1, vistaActual: 'FLUJOGRAMA_PASO_A_PASO' }));
  },

  nuevoLienzo: () => {
    set((st) => ({ expedienteActivoId: null, lienzoVersion: st.lienzoVersion + 1, vistaActual: 'FLUJOGRAMA_PASO_A_PASO' }));
  },

  duplicarExpediente: (id) => {
    const origen = get().expedientes.find((e) => e.id === id);
    if (!origen) return null;
    const ahora = new Date().toISOString();
    const copia: Expediente = {
      ...origen,
      id: crearIdExpediente(),
      creadoEn: ahora,
      actualizadoEn: ahora,
      objeto: origen.objeto.endsWith('(copia)') ? origen.objeto : `${origen.objeto} (copia)`,
      estado: JSON.parse(JSON.stringify(origen.estado))
    };
    set((st) => ({ expedientes: [copia, ...st.expedientes] }));
    return copia.id;
  },

  eliminarExpediente: (id) => {
    const eraActivo = get().expedienteActivoId === id;
    set((st) => ({
      expedientes: st.expedientes.filter((e) => e.id !== id),
      expedienteActivoId: eraActivo ? null : st.expedienteActivoId,
      lienzoVersion: eraActivo ? st.lienzoVersion + 1 : st.lienzoVersion
    }));
  },

  exportarExpedientesJSON: (ids) => {
    const todos = get().expedientes;
    return serializarExpedientes(ids ? todos.filter((e) => ids.includes(e.id)) : todos);
  },

  importarExpedientesJSON: (json) => {
    const leidos = leerExpedientes(json);
    if (!leidos) return { ok: false, importados: 0, omitidos: 0 };
    const existentes = new Set(get().expedientes.map((e) => e.id));
    const nuevos = leidos.expedientes.map((e) =>
      existentes.has(e.id) ? { ...e, id: crearIdExpediente(), objeto: `${e.objeto} (importado)` } : e
    );
    set((st) => ({ expedientes: [...nuevos, ...st.expedientes] }));
    return { ok: true, importados: nuevos.length, omitidos: leidos.omitidos };
  },

  exportarEstadoJSON: () => {
    const state = get();
    const data = {
      version: '2.0',
      fechaExportacion: new Date().toISOString(),
      procesos: state.procesos,
      entidades: state.entidades,
      proveedores: state.proveedores,
      controversias: state.controversias,
      asociaciones: state.asociaciones,
      estudiosMercado: state.estudiosMercado,
      eventosAuditoria: state.eventosAuditoria
    };
    return JSON.stringify(data, null, 2);
  },

  importarEstadoJSON: (jsonString: string) => {
    try {
      // Archivo no confiable: límite de tamaño, sin claves que contaminen prototipos y solo registros con id.
      const data = leerJsonImportado<Record<string, unknown>>(jsonString);
      const procesos = data ? listaDeRegistros<ProcesoContratacion>(data.procesos) : null;
      if (data && procesos && procesos.length > 0) {
        const st = get();
        set({
          procesos,
          entidades: listaDeRegistros<EntidadContratante>(data.entidades) ?? st.entidades,
          proveedores: listaDeRegistros<ProponenteDatos>(data.proveedores) ?? st.proveedores,
          controversias: listaDeRegistros<ControversiaContractual>(data.controversias) ?? st.controversias,
          asociaciones: listaDeRegistros<AsociacionPlural>(data.asociaciones) ?? st.asociaciones,
          estudiosMercado: listaDeRegistros<AnalisisEstudioMercado>(data.estudiosMercado) ?? st.estudiosMercado,
          eventosAuditoria: listaDeRegistros<EventoAuditoria>(data.eventosAuditoria) ?? st.eventosAuditoria,
          procesoSeleccionadoId: procesos[0]?.id || st.procesoSeleccionadoId
        });
        get().registrarAuditoria('SISTEMA', 'Importación de Escenario', 'Se cargó exitosamente un archivo de escenario formativo.');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  reiniciarDatosDemo: () => {
    set({
      procesos: PROCESOS_DEMO,
      entidades: ENTIDADES_DEMO,
      proveedores: PROVEEDORES_DEMO,
      controversias: CONTROVERSIAS_DEMO,
      asociaciones: ASOCIACIONES_DEMO,
      estudiosMercado: [],
      procesoSeleccionadoId: 'PROC-SECOP2-01',
      proveedorActivoId: 'PROV-01'
    });
    get().registrarAuditoria('SISTEMA', 'Reinicio de datos demo', 'Base de datos de entrenamiento restablecida');
  }
}),
    {
      name: 'procuresim-storage-v3',
      partialize: (state) => ({
        modoOperativo: state.modoOperativo,
        procesos: state.procesos,
        entidades: state.entidades,
        proveedores: state.proveedores,
        controversias: state.controversias,
        asociaciones: state.asociaciones,
        estudiosMercado: state.estudiosMercado,
        eventosAuditoria: state.eventosAuditoria,
        bitacoraObservaciones: state.bitacoraObservaciones,
        procesoSeleccionadoId: state.procesoSeleccionadoId,
        proveedorActivoId: state.proveedorActivoId,
        expedientes: state.expedientes,
        expedienteActivoId: state.expedienteActivoId
      })
    }
  )
);
