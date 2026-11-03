// Tipos y Modelos de Dominio - Suite de Contratación Pública & Privada

export type ModalidadContratacion =
  | 'LICITACION_PUBLICA'
  | 'SELECCION_ABREVIADA_MENOR_CUANTIA'
  | 'SELECCION_ABREVIADA_SUBASTA_INVERSA'
  | 'CONCURSO_MERITOS'
  | 'MINIMA_CUANTIA'
  | 'CONTRATACION_DIRECTA'
  | 'REGIMEN_ESPECIAL'
  | 'PRIVADA_RFP' // Request for Proposal
  | 'PRIVADA_RFQ' // Request for Quotation
  | 'PRIVADA_SUBASTA';

export type EstadoProceso =
  | 'BORRADOR'
  | 'ESTUDIOS_PREVIOS'
  | 'PUBLICADO_BORRADOR' // Proyecto de Pliego
  | 'OBSERVACIONES_BORRADOR'
  | 'CONVOCATORIA_DEFINITIVA' // Pliego Definitivo
  | 'PRESENTACION_OFERTAS'
  | 'CIERRE_RECEPCION'
  | 'EVALUACION'
  | 'TRASLADO_EVALUACION'
  | 'SUBSANACIONES'
  | 'ADJUDICACION'
  | 'DESIERTO'
  | 'FIRMADO'
  | 'EJECUCION'
  | 'LIQUIDADO';

export type PlataformaVista =
  | 'SECOP_I'
  | 'SECOP_II_ENTIDAD'
  | 'SECOP_II_PROVEEDOR'
  | 'SUBASTA_INVERSA'
  | 'TIENDA_VIRTUAL_TVEC'
  | 'SUPLOS'
  | 'SAP_ARIBA'
  | 'COUPA'
  | 'GENERADOR_DOCUMENTOS'
  | 'ESTUDIO_MERCADO'
  | 'MATRIZ_RIESGOS'
  | 'ASISTENTE_PROPUESTAS'
  | 'VALIDADOR_RUP'
  | 'HERRAMIENTAS_ECONOMICAS_AVANZADAS'
  | 'GESTION_CONTROVERSIAS'
  | 'LIQUIDACION_CONTRATOS'
  | 'GESTOR_CONSORCIOS'
  | 'SIMULADOR_CALIFICACION'
  | 'INTELIGENCIA_TENDENCIAS'
  | 'SUITE_PRODUCCION_REAL'
  | 'INGENIERIA_PRECONTRACTUAL'
  | 'LINEA_TIEMPO_AUTOMATICA'
  | 'FLUJOGRAMA_PASO_A_PASO';

export interface EntidadContratante {
  id: string;
  nombre: string;
  nit: string;
  orden: 'NACIONAL' | 'TERRITORIAL_DEPARTAMENTAL' | 'TERRITORIAL_MUNICIPAL' | 'PRIVADO';
  municipio: string;
  departamento: string;
  direccion: string;
  representanteLegal: string;
  cargoRepresentante: string;
  ordenadorGasto: string;
  telefono: string;
  email: string;
  logoUrl?: string;
}

export interface ItemRequerimiento {
  id: string;
  codigoUNSPSC: string;
  descripcionUNSPSC: string;
  detalleTecnico: string;
  unidadMedida: string;
  cantidad: number;
  precioUnitarioEstimado?: number;
}

export interface CotizacionProveedor {
  id: string;
  proveedorNombre: string;
  nit: string;
  contacto: string;
  telefono: string;
  email: string;
  fechaCotizacion: string;
  items: {
    itemId: string;
    valorUnitario: number;
    subtotal: number;
  }[];
  aplicaAIU: boolean;
  administracionPct?: number;
  imprevistosPct?: number;
  utilidadPct?: number;
  ivaSobreUtilidad: boolean; // Si es AIU, IVA se calcula usualmente sobre la utilidad
  ivaGeneralPct: number;
  subtotal: number;
  valorAIU?: number;
  valorIVA: number;
  valorTotal: number;
  plazoEntregaDias: number;
  vigenciaOfertaDias: number;
  observaciones: string;
}

export interface AnalisisEstudioMercado {
  id: string;
  codigoProceso: string;
  objeto: string;
  fechaElaboracion: string;
  items: ItemRequerimiento[];
  cotizacionesRecibidas: CotizacionProveedor[];
  metodologiaCalculo: 'MEDIA_ARITMETICA' | 'MEDIANA' | 'MENOR_VALOR' | 'PRECIO_HISTORICO_INDEXADO';
  resultadosPorItem: {
    itemId: string;
    precioMinimo: number;
    precioMaximo: number;
    precioPromedio: number;
    precioMediana: number;
    desviacionEstandar: number;
    coeficienteVariacion: number;
    precioSeleccionado: number;
    subtotalEstimado: number;
  }[];
  presupuestoTotalEstimado: number;
  justificacionEconomica: string;
  fuentesConsultadas: string[];
}

export interface RiesgoContratacion {
  id: string;
  tipo: 'OPERACIONAL' | 'FINANCIERO' | 'REGULATORIO' | 'AMBIENTAL' | 'TECNOLOGICO' | 'FUERZA_MAYOR';
  etapa: 'PLANEACION' | 'SELECCION' | 'CONTRATACION' | 'EJECUCION' | 'LIQUIDACION';
  descripcion: string;
  consecuencia: string;
  probabilidad: 1 | 2 | 3 | 4 | 5; // CCE: Raro (1), Improbable (2), Posible (3), Probable (4), Casi Seguro (5)
  impacto: 1 | 2 | 3 | 4 | 5; // CCE: Insignificante (1), Menor (2), Moderado (3), Mayor (4), Catastrófico (5)
  calificacion: number; // Probabilidad + Impacto (2 a 10)
  categoria: 'BAJO' | 'MEDIO' | 'ALTO' | 'EXTREMO';
  asignacion: 'ENTIDAD' | 'CONTRATISTA' | 'COMPARTIDO';
  tratamientoMitigacion: string;
  responsableMonitoreo: string;
}

export interface RequisitosHabilitantes {
  // Requisitos Jurídicos
  exigeRUP: boolean;
  tiempoConstitucionMesesMinimo: number;
  objetoSocialAcorde: boolean;
  pazYSalvoParafiscales: boolean;
  antecedentesDisciplinariosJudiciales: boolean;
  
  // Requisitos Financieros (Valores Mínimos/Máximos requeridos)
  indiceLiquidezMinimo: number; // Activo Cte / Pasivo Cte (ej. >= 1.5)
  nivelEndeudamientoMaximoPct: number; // Pasivo Total / Activo Total * 100 (ej. <= 70%)
  coberturaInteresesMinima: number; // Utilidad Operacional / Gastos Intereses (ej. >= 2.0)
  capitalTrabajoMinimoCOP: number; // Activo Cte - Pasivo Cte
  rentabilidadPatrimonioMinimaPct: number; // ROE (ej. >= 5%)
  rentabilidadActivoMinimaPct: number; // ROA (ej. >= 3%)

  // Requisitos Técnicos y Experiencia
  codigosUNSPSCExigidos: string[];
  numeroContratosAcreditar: number;
  sumatoriaSMMLVMinima: number;
  anosExperienciaMinima: number;
}

export interface ProcesoContratacion {
  id: string;
  numeroProceso: string; // Ej: LP-001-2025 o MC-045-2025
  plataformaOrigen: PlataformaVista;
  entidad: EntidadContratante;
  modalidad: ModalidadContratacion;
  objeto: string;
  justificacion: string;
  presupuestoOficial: number;
  cdpNumero: string;
  cdpFecha: string;
  plazoMeses: number;
  plazoDias: number;
  lugarEjecucion: string;
  estado: EstadoProceso;
  cronograma: {
    publicacionBorrador: string;
    observacionesBorradorLimite: string;
    publicacionDefinitivo: string;
    presentacionOfertasLimite: string;
    aperturaSobres: string;
    publicacionInformeEvaluacion: string;
    trasladoInformeLimite: string;
    audienciaAdjudicacion: string;
    firmaContrato: string;
  };
  items: ItemRequerimiento[];
  riesgos: RiesgoContratacion[];
  requisitosHabilitantes: RequisitosHabilitantes;
  criteriosPonderacion: {
    puntajeEconomico: number; // Ej: 60 puntos
    puntajeTecnicoCalidad: number; // Ej: 20 puntos
    puntajeIndustriaNacional: number; // Ley 816: 10 o 20 puntos
    puntajeDiscapacidad: number; // Dcto 392: 1 o 2 puntos
    puntajeMiPyme: number; // Ley 2069: hasta 5 puntos
  };
  observacionesCiudadanas: {
    id: string;
    remitente: string;
    fecha: string;
    texto: string;
    respuestaEntidad?: string;
    estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';
  }[];
  ofertasPresentadas: OfertaPresentada[];
}

export interface ProponenteDatos {
  id: string;
  tipoProponente: 'INDIVIDUAL_PERSONA_JURIDICA' | 'INDIVIDUAL_PERSONA_NATURAL' | 'CONSORCIO' | 'UNION_TEMPORAL';
  razonSocial: string;
  nit: string;
  representanteLegal: string;
  cedulaRepresentante: string;
  direccion: string;
  ciudad: string;
  email: string;
  telefono: string;
  esMiPyme: boolean;
  esSociedadBIC?: boolean; // Sociedad de Beneficio e Interés Colectivo (Ley 1901 de 2018)
  aplicaIndustriaNacional: boolean;
  empleadosConDiscapacidad: boolean;
  logoUrl?: string;
  
  // Miembros (en caso de Consorcio o UT)
  miembrosPlurales?: {
    nombre: string;
    nit: string;
    porcentajeParticipacion: number;
    compromisoEspecifico?: string;
  }[];

  // Datos Financieros (Último corte RUP / Balance)
  activoCorriente: number;
  pasivoCorriente: number;
  activoTotal: number;
  pasivoTotal: number;
  patrimonio: number;
  utilidadOperacional: number;
  gastosIntereses: number;
  utilidadNeta: number;

  // Experiencia RUP Registrada
  experienciaRegistrada: {
    consecutivoRUP: number;
    contratante: string;
    objeto: string;
    codigosUNSPSC: string[];
    valorSMMLV: number;
    fechaInicio: string;
    fechaFin: string;
  }[];
}

export interface OfertaPresentada {
  id: string;
  procesoId: string;
  proponente: ProponenteDatos;
  fechaRadicacion: string;
  valorEconomicoTotal: number;
  desglosePrecios: {
    itemId: string;
    precioUnitarioOfertado: number;
    subtotal: number;
  }[];
  documentosCargados: {
    tipo: 'CARTA_PRESENTACION' | 'RUP' | 'CAMARA_COMERCIO' | 'PARAFISCALES' | 'CONSORCIAL' | 'EXPERIENCIA' | 'GARANTIA_SERIEDAD' | 'PROPUESTA_ECONOMICA';
    nombreArchivo: string;
    estadoValidacion: 'CUMPLE' | 'POR_SUBSANAR' | 'NO_CUMPLE' | 'PENDIENTE';
    observacionEvaluador?: string;
  }[];
  evaluacionJuridica: 'CUMPLE' | 'POR_SUBSANAR' | 'NO_CUMPLE';
  evaluacionFinanciera: 'CUMPLE' | 'POR_SUBSANAR' | 'NO_CUMPLE';
  evaluacionTecnica: 'CUMPLE' | 'POR_SUBSANAR' | 'NO_CUMPLE';
  puntajeObtenido: {
    economico: number;
    calidad: number;
    industriaNacional: number;
    discapacidad: number;
    miPyme: number;
    total: number;
  };
  esGanador: boolean;
}

export interface EventoAuditoria {
  id: string;
  fechaHora: string;
  usuario: string;
  rol: 'ENTIDAD' | 'PROVEEDOR' | 'AUDITOR' | 'SISTEMA';
  modulo: string;
  accion: string;
  detalles: string;
}

export type OrigenObservacionBitacora =
  | 'VEEDURIA_CIUDADANA'
  | 'CONTRALORIA'
  | 'PROCURADURIA'
  | 'DECISION_SIMULADOR'
  | 'OTRO';

export interface ObservacionBitacora {
  id: string;
  /** Fecha ISO (AAAA-MM-DD) en que se registró la observación. */
  fecha: string;
  origen: OrigenObservacionBitacora;
  descripcion: string;
  normaInfringida: string;
  nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  /** true si la digitó el usuario; false si la generó el simulador. */
  manual: boolean;
}

export type TipoControversia =
  | 'RECURSO_REPOSICION_ADJUDICACION' // Contra acto de adjudicación o declaratoria de desierta
  | 'SANCIONATORIO_MULTA_INCUMPLIMIENTO' // Art. 86 Ley 1474/2011 (Multas, cláusula penal, caducidad)
  | 'DESEQUILIBRIO_ECONOMICO' // Reclamación de compensación económica (Teoría de la imprevisión)
  | 'CONTROVERSIA_LIQUIDACION' // Liquidación unilateral o bilateral con salvedades
  | 'ARREGLO_DIRECTO_MASC' // Mecanismo de arreglo directo / amigable composición
  | 'CONCILIACION_PREJUDICIAL' // Ante Procuraduría General de la Nación
  | 'ARBITRAJE_TRIBUNAL'; // Tribunal de Arbitramento

export type EstadoControversia =
  | 'RADICADA'
  | 'EN_TRASLADO'
  | 'AUDIENCIA_PROGRAMADA'
  | 'EN_DESCARGOS'
  | 'RESUELTA_ENTIDAD'
  | 'EN_CONCILIACION'
  | 'ACUERDO_LOGRADO'
  | 'VIA_JUDICIAL';

export interface HitoLineaTiempo {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  diasTerminoLegal?: number;
  tipoTermino?: 'HABILES' | 'CALENDARIO';
  estadoHito: 'COMPLETADO' | 'VIGENTE_EN_CURSO' | 'VENCIDO' | 'FUTURO';
  responsable: 'ENTIDAD' | 'CONTRATISTA' | 'MINISTERIO_PUBLICO' | 'TRIBUNAL';
  fundamentoLegal: string;
  accionRequerida?: string;
}

export interface ControversiaContractual {
  id: string;
  procesoId: string;
  numeroExpediente: string;
  tipo: TipoControversia;
  titulo: string;
  radicador: string; // Quien interpone: Contratista / Proponente / Entidad
  rolRadicador: 'CONTRATISTA' | 'PROPONENTE_NO_FAVORECIDO' | 'ENTIDAD_ESTATAL';
  fechaRadicacion: string;
  pretensionEconomicaCOP?: number;
  sintesisHechos: string;
  fundamentoJuridico: string;
  estado: EstadoControversia;
  diasParaVencerTermino: number;
  alertaVencimiento: 'VERDE' | 'AMARILLA' | 'ROJA'; // Semáforo de términos perentorios
  lineaTiempo: HitoLineaTiempo[];
  respuestasEmitidas: {
    id: string;
    fecha: string;
    tipoActo: 'AUTO_APERTURA' | 'MEMORIAL_DESCARGOS' | 'RESOLUCION_MOTIVADA' | 'ACTA_ARREGLO_DIRECTO' | 'ACTA_CONCILIACION';
    titulo: string;
    contenidoRedactado: string;
    autor: string;
  }[];
}

export type TipoAsociacion =
  | 'UNION_TEMPORAL'
  | 'CONSORCIO'
  | 'PROMESA_SOCIEDAD_FUTURA'
  | 'JOINT_VENTURE'
  | 'CONVENIO_ASOCIACION';

export interface MiembroAsociacion {
  id: string;
  razonSocial: string;
  nit: string;
  representanteLegal: string;
  cedulaRepresentante: string;
  porcentajeParticipacion: number;
  compromisoObligaciones: string;
  aportesFinancierosCOP: number;
  experienciaAportadaSMMLV: number;
  esLider: boolean;
  activoCorriente: number;
  pasivoCorriente: number;
  activoTotal: number;
  pasivoTotal: number;
  patrimonio: number;
  /** Capacidad residual (obra pública): datos que aporta el usuario, opcionales. */
  ingresosOperacionalesMaxCOP?: number; // CO
  puntosExperiencia?: number; // E (máx. 120)
  puntosCapTecnica?: number; // CT (máx. 40)
  puntosCapFinanciera?: number; // CF (máx. 40)
  saldoContratosEjecucionCOP?: number; // SCE
}

export interface AsociacionPlural {
  id: string;
  nombreAsociacion: string;
  tipo: TipoAsociacion;
  procesoVinculadoId?: string;
  objetoLicitacion: string;
  representanteDesignado: string;
  cedulaRepresentante: string;
  direccionSede: string;
  ciudad: string;
  emailNotificacion: string;
  telefono: string;
  miembros: MiembroAsociacion[];
  porcentajeTotal: number;
  esValido100Pct: boolean;
  indicadoresPonderados: {
    indiceLiquidez: number;
    nivelEndeudamientoPct: number;
    capitalTrabajoTotalCOP: number;
    patrimonioTotalCOP: number;
    experienciaTotalSMMLV: number;
    capacidadResidualTotalSMMLV?: number;
  };
  documentosGenerados: {
    tipoDocumento: 'DOCUMENTO_CONSTITUCION' | 'PODER_ESPECIAL' | 'ACUERDO_CONFIDENCIALIDAD' | 'MEMORANDO_ENTENDIMIENTO';
    nombre: string;
    fecha: string;
    contenido: string;
  }[];
}

// ==========================================
// MODO DUAL: ENTRENAMIENTO VS. PRODUCCIÓN REAL
// ==========================================
export type ModoOperativoSuite = 'ENTRENAMIENTO' | 'PRODUCCION_REAL';

export interface IndicadoresFinancierosRUP {
  indiceLiquidez: number; // Activo Corriente / Pasivo Corriente (>= 1.5 típico)
  indiceEndeudamientoPct: number; // Pasivo Total / Activo Total * 100 (<= 70% típico)
  razonCoberturaIntereses: number; // Utilidad Operacional / Gastos Intereses (>= 2.0 típico)
  rentabilidadPatrimonioPct: number; // Utilidad Operacional / Patrimonio
  rentabilidadActivoPct: number; // Utilidad Operacional / Activo Total
  patrimonioNetoCOP: number;
  capitalTrabajoCOP: number;
}

export interface ExperienciaContratoRUP {
  consecutivo: number;
  numeroContrato: string;
  contratante: string;
  objeto: string;
  valorCOP: number;
  valorSMMLV: number;
  fechaTerminacion: string;
  codigosUNSPSC: string[]; // Segmento, Familia, Clase
  porcentajeParticipacion: number;
  esConsorcio: boolean;
}

export interface CertificadoRUPOficial {
  id: string;
  camaraComercio: string;
  numeroInscripcionRUP: string;
  fechaExpedicion: string;
  fechaRenovacion: string;
  vigente: boolean;
  razonSocial: string;
  nit: string;
  tamanoEmpresa: 'MICRO' | 'PEQUENA' | 'MEDIANA' | 'GRANDE';
  esSociedadBIC?: boolean; // Sociedad de Beneficio e Interés Colectivo (Ley 1901 de 2018)
  indicadores: IndicadoresFinancierosRUP;
  experiencia: ExperienciaContratoRUP[];
  capacidadResidualKCOP: number;
  hashVerificacionSHA256: string;
  archivoOrigen?: string;
}

export interface RequisitosHabilitantesPliego {
  experienciaMinimaSMMLV: number;
  codigosUNSPSCObligatorios: string[];
  liquidezMinima: number;
  endeudamientoMaximoPct: number;
  coberturaInteresesMinima: number;
  patrimonioMinimoCOP: number;
  kResidualMinimoCOP?: number;
}

export interface ProcesoSecop2Real {
  idProceso: string;
  numeroProceso: string; // ej: CO1.BDOS.8921456
  entidadCompradora: string;
  nitEntidad: string;
  objetoContrato: string;
  modalidad: string;
  valorPresupuestoOficialCOP: number;
  estadoSecop2: string;
  fechaPublicacion: string;
  fechaCierreOfertas: string;
  departamento: string;
  municipio: string;
  requisitosHabilitantes: RequisitosHabilitantesPliego;
  urlSecop2?: string;
  origenDatos: 'DATOS_ABIERTOS_API' | 'SECOP2_OFICIAL' | 'EXPEDIENTE_CARGADO';
}

export interface DictamenHabilitacionReal {
  fechaDictamen: string;
  proponente: {
    razonSocial: string;
    nit: string;
    numeroInscripcionRUP: string;
  };
  procesoAuditado: {
    numeroProceso: string;
    entidad: string;
    objeto: string;
    presupuestoCOP: number;
  };
  resultadoFinal: 'HABILITADO' | 'RECHAZADO_NO_SUBSANABLE' | 'REQUIERE_SUBSANACION';
  verificacionFinanciera: {
    cumpleLiquidez: boolean;
    liquidezRUP: number;
    liquidezExigida: number;
    cumpleEndeudamiento: boolean;
    endeudamientoRUP: number;
    endeudamientoMaximo: number;
    cumpleCoberturaIntereses: boolean;
    coberturaRUP: number;
    coberturaExigida: number;
    cumplePatrimonio: boolean;
    patrimonioRUPCOP: number;
    patrimonioExigidoCOP: number;
  };
  verificacionExperiencia: {
    cumpleExperienciaTotal: boolean;
    experienciaAcreditadaSMMLV: number;
    experienciaExigidaSMMLV: number;
    codigosCoincidentes: string[];
    codigosFaltantes: string[];
  };
  verificacionKResidual?: {
    cumpleK: boolean;
    kResidualAcreditadoCOP: number;
    kResidualExigidoCOP: number;
  };
  fundamentoJuridico: string[];
  hashDictamenSHA256: string;
}



