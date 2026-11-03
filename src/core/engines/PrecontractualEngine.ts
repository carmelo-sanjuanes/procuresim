// Motor de Ingeniería Precontractual, Estudios Previos (Dcto. 1082/2015) y Gestor de Recursos
// Articulación entre Entidad Estatal (EDP & CDP Presupuestal) y Licitante (Análisis Go/No-Go & Flujo de Caja)

export interface GarantiaExigidaEDP {
  tipo: string;
  porcentaje: number;
  vigencia: string;
}

export interface EstudioPrevioOficial {
  id: string;
  procesoReferencia: string;
  entidad: string;
  nitEntidad: string;
  // 1. Descripción de la necesidad
  necesidadJustificada: string;
  // 2. Objeto del contrato y códigos UNSPSC
  objetoContrato: string;
  codigosUNSPSC: string[];
  // 3. Modalidad de selección y fundamento legal
  modalidadSeleccion: string;
  justificacionJuridicaModalidad: string;
  // 4. Valor estimado y análisis de precios
  presupuestoOficialCOP: number;
  analisisSectorMercadoResumen: string;
  formaDePago: string;
  // 5. Criterios de selección y habilitación
  criteriosHabilitantesResumen: string;
  // 6. Análisis de riesgo y mitigación
  riesgosIdentificadosResumen: string;
  // 7. Garantías exigidas
  garantiasExigidas: GarantiaExigidaEDP[];
  // Condiciones adicionales obligatorias
  plazoEjecucionMeses: number;
  lugarEjecucion: string;
  acuerdosComercialesTLC: boolean;
  limitacionMipymes: boolean;
  estadoRevision: 'BORRADOR' | 'EN_REVISION_JURIDICA' | 'APROBADO_ORDENADOR';
  fechaElaboracion: string;
}

export interface ProgramacionPAC {
  mes: number;
  nombreMes: string;
  porcentaje: number;
  valorCOP: number;
}

export interface CertificadoDisponibilidadPresupuestalCDP {
  numeroCDP: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  rubroPresupuestal: string;
  nombreRubro: string;
  fuenteFinanciacion: 'PGN_NACION' | 'REGALIAS_SGR' | 'SGP_PARTICIPACIONES' | 'RECURSOS_PROPIOS' | 'CREDITO_EXTERNO';
  valorAmparadoCOP: number;
  saldoDisponibleCOP: number;
  requiereVigenciasFuturas: boolean;
  autorizacionVigenciasFuturas?: string;
  programacionPACMensual: ProgramacionPAC[];
}

export interface FlujoCajaMensualOferente {
  mes: number;
  concepto: string;
  ingresosCOP: number;
  egresosCOP: number;
  flujoNetoCOP: number;
  saldoAcumuladoCOP: number;
}

export interface AnalisisGoNoGoOferente {
  proponenteId: string;
  nombreProponente: string;
  nitProponente: string;
  presupuestoOficialLicitacionCOP: number;
  margenUtilidadEstimadoPct: number;
  anticipoPactadoPct: number;
  plazoPagoPromedioDias: number; // Típico en Colombia: 45 a 90 días
  plazoEjecucionMeses: number;
  capitalTrabajoDisponibleCOP: number;
  capitalTrabajoRequeridoCOP: number;
  deficitSuperavitCajaCOP: number;
  costoPolizaSeriedadCOP: number;
  costoPreparacionPropuestaCOP: number;
  dictamenViabilidad:
    | 'VIABLE_CON_ALTA_RENTABILIDAD'
    | 'VIABLE_CON_RIESGO_DE_LIQUIDEZ'
    | 'NO_VIABLE_REQUIERE_CONSORCIO'
    | 'RECHAZADO_CAPITAL_INSUFICIENTE';
  recomendacionesEstrategicas: string[];
  flujoCajaProyectado: FlujoCajaMensualOferente[];
}

export interface ObservacionProyectoPliego {
  id: string;
  remitente: string;
  nitRemitente: string;
  procesoId: string;
  fechaRadicacion: string;
  clausulaCuestionada: string;
  tipoObservacion: 'JURIDICA' | 'FINANCIERA' | 'TECNICA' | 'EXPERIENCIA_PLIEGO_SASTRE';
  argumentacion: string;
  solicitudConcreta: string;
  estado: 'PENDIENTE' | 'ACEPTADA_TOTAL' | 'ACEPTADA_PARCIAL' | 'NO_ACEPTADA';
  respuestaEntidad?: string;
  fundamentoRespuesta?: string;
}

export interface RegistroPlanAnualAdquisiciones {
  id: string;
  entidad: string;
  vigencia: number;
  codigoUNSPSC: string;
  descripcionBienServicio: string;
  fechaEstimadaInicio: string;
  duracionEstimadaMeses: number;
  modalidadSeleccion: string;
  fuenteRecursos: string;
  valorEstimadoCOP: number;
  valorVigenciaActualCOP: number;
  requiereVigenciaFutura: boolean;
  unidadContratacion: string;
  responsableContacto: string;
  procesoVinculadoId?: string;
  estadoArticulacionEDP: 'ARTICULADO_CONFORME' | 'DIFERENCIA_PRESUPUESTAL' | 'NO_REGISTRADO';
  diferenciaConPresupuestoEDPCOP?: number;
}

export interface AudienciaRiesgosIntervencion {
  id: string;
  procesoReferencia: string;
  fechaHora: string;
  participante: string;
  nitParticipante: string;
  rolParticipante: 'ENTIDAD' | 'OFERENTE' | 'VEEDURIA_CIUDADANA' | 'PROCURADURIA_PREVENTIVA';
  tipoRiesgoDebatido: 'CAMBIARIO_TRM' | 'OPERACIONAL_TECNICO' | 'REGULATORIO_LEGAL' | 'FUERZA_MAYOR' | 'DISPONIBILIDAD_RED';
  argumentoIntervencion: string;
  solicitudReasignacion: string;
  decisionEntidad: 'MODIFICADO_MEDIANTE_ADENDA' | 'RATIFICADO_SEGÚN_PLIEGO' | 'ACLARADO_SIN_MODIFICAR';
  justificacionLegalEntidad: string;
}

export interface AdendaModificatoria {
  id: string;
  numeroAdenda: number;
  procesoReferencia: string;
  fechaPublicacion: string;
  horaPublicacion: string;
  fechaCierreOriginal: string;
  fechaCierreAjustada: string;
  objetoModificacion: string;
  diasHabilesAntelacionAlCierre: number;
  esLegalConformeLey1882: boolean;
  analisisLegalCCE: string;
  prorrogoPlazoCierre: boolean;
}

export class PrecontractualEngine {
  /**
   * Catálogo de Estudios Previos representativos de prueba
   */
  public static readonly ESTUDIOS_PREVIOS_DEMO: EstudioPrevioOficial[] = [
    {
      id: 'EDP-MINTIC-2025-01',
      procesoReferencia: 'MINTIC-LP-004-2025',
      entidad: 'MINISTERIO DE TECNOLOGÍAS DE LA INFORMACIÓN Y LAS COMUNICACIONES',
      nitEntidad: '899.999.053-1',
      necesidadJustificada:
        'Garantizar la continuidad operativa, evolución tecnológica, ciberseguridad y analítica de datos de la plataforma nacional de gobierno digital para beneficio de las entidades estatales y la ciudadanía en el marco del Plan Nacional de Desarrollo.',
      objetoContrato:
        'Contratar la prestación de servicios tecnológicos especializados para el desarrollo, evolución, soporte y analítica de datos de la plataforma nacional de gobierno digital.',
      codigosUNSPSC: ['43230000', '81111800', '81111500', '80101500'],
      modalidadSeleccion: 'Licitación Pública',
      justificacionJuridicaModalidad:
        'Por la cuantía (\$3.850.000.000 COP) superior a la menor cuantía de la entidad y la naturaleza de servicios de tecnología e ingeniería con componente de desarrollo intelectual (Art. 2 num. 1 Ley 1150 de 2007).',
      presupuestoOficialCOP: 3850000000,
      analisisSectorMercadoResumen:
        'Se consultaron cotizaciones de 4 proveedores del mercado y precios históricos en SECOP II de los últimos 24 meses. Se proyecta un AIU del 23% y precios unitarios conformes al IPC/DANE.',
      formaDePago:
        'Pagos parciales mensuales contra entrega y aprobación de informes técnicos a satisfacción por la supervisión o interventoría designada.',
      criteriosHabilitantesResumen:
        'RUP vigente con mínimo 2.500 SMMLV de experiencia en UNSPSC 43230000 y 81111800. Liquidez >= 1.5, Endeudamiento <= 70%, Cobertura de Intereses >= 2.0.',
      riesgosIdentificadosResumen:
        'Riesgos operacionales de retraso en despliegues, fluctuación de tipo de cambio en componentes nube y riesgos de seguridad de la información mitigados mediante ISO 27001.',
      garantiasExigidas: [
        { tipo: 'Seriedad de la Oferta', porcentaje: 10, vigencia: '90 días calendario a partir del cierre' },
        { tipo: 'Cumplimiento del Contrato', porcentaje: 20, vigencia: 'Plazo del contrato y 6 meses más' },
        { tipo: 'Salarios y Prestaciones Sociales', porcentaje: 5, vigencia: 'Plazo del contrato y 3 años más' },
        { tipo: 'Calidad del Servicio', porcentaje: 20, vigencia: '1 año a partir del recibo final' }
      ],
      plazoEjecucionMeses: 10,
      lugarEjecucion: 'Bogotá D.C. con cobertura nacional remota',
      acuerdosComercialesTLC: true,
      limitacionMipymes: false,
      estadoRevision: 'APROBADO_ORDENADOR',
      fechaElaboracion: '2025-01-28'
    },
    {
      id: 'EDP-ENERGIA-2025-02',
      procesoReferencia: 'FENOGE-LP-012-2025',
      entidad: 'MINISTERIO DE MINAS Y ENERGÍA / FENOGE',
      nitEntidad: '901.112.233-4',
      necesidadJustificada:
        'Implementar sistemas solares fotovoltaicos en comunidades energéticas rurales no interconectadas para avanzar en la transición energética justa y sostenible.',
      objetoContrato:
        'Diseño, suministro, montaje e ingeniería de detalle para soluciones energéticas sostenibles y solares fotovoltaicas en zonas no interconectadas.',
      codigosUNSPSC: ['26111600', '39121000', '81101500', '72101500'],
      modalidadSeleccion: 'Licitación Pública (Compras Sostenibles BIC)',
      justificacionJuridicaModalidad:
        'Proceso de obra e instalación eléctrica que supera la menor cuantía, priorizando criterios de sostenibilidad ambiental e incentivos para Sociedades BIC (Ley 1901/2018 y Ley 2069/2020).',
      presupuestoOficialCOP: 2600000000,
      analisisSectorMercadoResumen:
        'Estudio de mercado con 3 empresas del sector fotovoltaico. Estimación de componentes importados indexados a TRM y mano de obra local calificada.',
      formaDePago:
        'Anticipo del 20% bajo encargo fiduciario (Ley 1474/2011) y actas de avance físico mensual debidamente certificadas por la interventoría técnica.',
      criteriosHabilitantesResumen:
        'RUP vigente en energía y obras civiles con experiencia acumulada de 1.800 SMMLV. Liquidez >= 1.4, Endeudamiento <= 65%.',
      riesgosIdentificadosResumen:
        'Riesgos climáticos de acceso a zonas rurales, fluctuaciones del dólar para paneles solares e inversores y riesgo comunitario mitigado con socialización previa.',
      garantiasExigidas: [
        { tipo: 'Seriedad de la Oferta', porcentaje: 10, vigencia: '90 días calendario' },
        { tipo: 'Buen Manejo del Anticipo', porcentaje: 100, vigencia: 'Hasta la amortización total' },
        { tipo: 'Cumplimiento', porcentaje: 20, vigencia: 'Plazo y 6 meses más' },
        { tipo: 'Calidad y Estabilidad', porcentaje: 30, vigencia: '3 años a partir del recibo a satisfacción' }
      ],
      plazoEjecucionMeses: 8,
      lugarEjecucion: 'Región Caribe y Zonas Rurales de Colombia',
      acuerdosComercialesTLC: true,
      limitacionMipymes: false,
      estadoRevision: 'APROBADO_ORDENADOR',
      fechaElaboracion: '2025-02-10'
    }
  ];

  /**
   * Catálogo de CDPs Presupuestales oficiales
   */
  public static readonly CDPS_DEMO: CertificadoDisponibilidadPresupuestalCDP[] = [
    {
      numeroCDP: 'CDP-2025-000418',
      fechaExpedicion: '2025-01-15',
      fechaVencimiento: '2025-12-31',
      rubroPresupuestal: 'A-02-02-02-008-005',
      nombreRubro: 'Servicios de tecnología de la información y comunicaciones TIC - Gobierno Digital',
      fuenteFinanciacion: 'PGN_NACION',
      valorAmparadoCOP: 3850000000,
      saldoDisponibleCOP: 3850000000,
      requiereVigenciasFuturas: false,
      programacionPACMensual: [
        { mes: 1, nombreMes: 'Febrero', porcentaje: 5, valorCOP: 192500000 },
        { mes: 2, nombreMes: 'Marzo', porcentaje: 10, valorCOP: 385000000 },
        { mes: 3, nombreMes: 'Abril', porcentaje: 10, valorCOP: 385000000 },
        { mes: 4, nombreMes: 'Mayo', porcentaje: 10, valorCOP: 385000000 },
        { mes: 5, nombreMes: 'Junio', porcentaje: 10, valorCOP: 385000000 },
        { mes: 6, nombreMes: 'Julio', porcentaje: 10, valorCOP: 385000000 },
        { mes: 7, nombreMes: 'Agosto', porcentaje: 10, valorCOP: 385000000 },
        { mes: 8, nombreMes: 'Septiembre', porcentaje: 15, valorCOP: 577500000 },
        { mes: 9, nombreMes: 'Octubre', porcentaje: 10, valorCOP: 385000000 },
        { mes: 10, nombreMes: 'Noviembre', porcentaje: 10, valorCOP: 385000000 }
      ]
    },
    {
      numeroCDP: 'CDP-2025-001290',
      fechaExpedicion: '2025-02-01',
      fechaVencimiento: '2025-12-31',
      rubroPresupuestal: 'C-3501-1000-14',
      nombreRubro: 'Fondo de Energías No Convencionales y Gestión Eficiente de la Energía - Transición Justa',
      fuenteFinanciacion: 'REGALIAS_SGR',
      valorAmparadoCOP: 2600000000,
      saldoDisponibleCOP: 2600000000,
      requiereVigenciasFuturas: true,
      autorizacionVigenciasFuturas: 'CONFIS No. 2025-014 del 20 de Enero de 2025',
      programacionPACMensual: [
        { mes: 1, nombreMes: 'Anticipo Fiduciario', porcentaje: 20, valorCOP: 520000000 },
        { mes: 2, nombreMes: 'Mes 2', porcentaje: 10, valorCOP: 260000000 },
        { mes: 3, nombreMes: 'Mes 3', porcentaje: 15, valorCOP: 390000000 },
        { mes: 4, nombreMes: 'Mes 4', porcentaje: 15, valorCOP: 390000000 },
        { mes: 5, nombreMes: 'Mes 5', porcentaje: 15, valorCOP: 390000000 },
        { mes: 6, nombreMes: 'Mes 6', porcentaje: 15, valorCOP: 390000000 },
        { mes: 7, nombreMes: 'Mes 7', porcentaje: 5, valorCOP: 130000000 },
        { mes: 8, nombreMes: 'Liquidación Final', porcentaje: 5, valorCOP: 130000000 }
      ]
    }
  ];

  /**
   * Catálogo de Observaciones al Proyecto de Pliego
   */
  public static readonly OBSERVACIONES_DEMO: ObservacionProyectoPliego[] = [
    {
      id: 'OBS-001',
      remitente: 'SANJUANES SOLUCIONES S.A.S.',
      nitRemitente: '901.458.789-1',
      procesoId: 'MINTIC-LP-004-2025',
      fechaRadicacion: '2025-02-05',
      clausulaCuestionada: 'Capítulo III, Numeral 3.2.1 - Experiencia Específica Habilitante',
      tipoObservacion: 'EXPERIENCIA_PLIEGO_SASTRE',
      argumentacion:
        'El proyecto de pliego exige que los contratos aportados hayan sido ejecutados exclusivamente con entidades del orden nacional del sector central, excluyendo la experiencia homóloga válida ejecutada con entidades territoriales o del sector descentralizado. Esta restricción vulnera el principio de libre concurrencia (Art. 24 Ley 80) y configura un presunto pliego sastre.',
      solicitudConcreta:
        'Ajustar la cláusula para permitir la acreditación de experiencia en los códigos UNSPSC señalados, sin importar si el contratante fue del orden nacional, territorial o del sector privado, conforme al Decreto 1082 de 2015.',
      estado: 'ACEPTADA_TOTAL',
      respuestaEntidad:
        'Se acepta la observación. La entidad publicará en el pliego definitivo la apertura a experiencia en el sector público en cualquier nivel territorial y privado.',
      fundamentoRespuesta: 'Alineación con la jurisprudencia de Colombia Compra Eficiente sobre libre concurrencia.'
    },
    {
      id: 'OBS-002',
      remitente: 'INGELECGROUP S.A.S. BIC',
      nitRemitente: '901.624.819-5',
      procesoId: 'FENOGE-LP-012-2025',
      fechaRadicacion: '2025-02-12',
      clausulaCuestionada: 'Capítulo IV, Numeral 4.5 - Criterios de Desempate y Ponderación',
      tipoObservacion: 'JURIDICA',
      argumentacion:
        'El proyecto de pliego omitió incluir el criterio de desempate preferencial e incentivo para Sociedades de Beneficio e Interés Colectivo (BIC) reglamentado en la Ley 1901 de 2018 y la Ley 2069 de 2020 (Art. 35 num. 4).',
      solicitudConcreta:
        'Incorporar expresamente en la cascada de desempate y compras públicas sostenibles la preferencia a proponentes acreditados como Sociedades BIC.',
      estado: 'ACEPTADA_TOTAL',
      respuestaEntidad:
        'Se acepta la observación de INGELECGROUP S.A.S. BIC. Se incluye formalmente el factor de desempate para Sociedades BIC conforme a la Ley 2069 de 2020.',
      fundamentoRespuesta: 'Cumplimiento del Artículo 35 de la Ley 2069 de 2020 y Decreto 1860 de 2021.'
    }
  ];

  /**
   * Catálogo de Registros Oficiales del Plan Anual de Adquisiciones (PAA - Decreto 1082/2015 Art. 2.2.1.1.1.4.1)
   */
  public static readonly PLAN_ADQUISICIONES_DEMO: RegistroPlanAnualAdquisiciones[] = [
    {
      id: 'PAA-MINTIC-2025-089',
      entidad: 'MINISTERIO DE TECNOLOGÍAS DE LA INFORMACIÓN Y LAS COMUNICACIONES',
      vigencia: 2025,
      codigoUNSPSC: '43230000',
      descripcionBienServicio:
        'Servicios de desarrollo de software, ciberseguridad y soporte para la plataforma nacional de gobierno digital',
      fechaEstimadaInicio: '2025-02-15',
      duracionEstimadaMeses: 10,
      modalidadSeleccion: 'Licitación Pública',
      fuenteRecursos: 'Presupuesto General de la Nación (PGN)',
      valorEstimadoCOP: 3850000000,
      valorVigenciaActualCOP: 3850000000,
      requiereVigenciaFutura: false,
      unidadContratacion: 'Subdirección para las Competencias Digitales',
      responsableContacto: 'contratacion_digital@mintic.gov.co',
      procesoVinculadoId: 'MINTIC-LP-004-2025',
      estadoArticulacionEDP: 'ARTICULADO_CONFORME'
    },
    {
      id: 'PAA-FENOGE-2025-014',
      entidad: 'MINISTERIO DE MINAS Y ENERGÍA / FENOGE',
      vigencia: 2025,
      codigoUNSPSC: '26111600',
      descripcionBienServicio:
        'Soluciones energéticas sostenibles y solares fotovoltaicas para comunidades energéticas rurales en zonas ZNI',
      fechaEstimadaInicio: '2025-03-01',
      duracionEstimadaMeses: 8,
      modalidadSeleccion: 'Licitación Pública (Compras Sostenibles BIC)',
      fuenteRecursos: 'Fondo de Energías No Convencionales (FENOGE) / Regalías SGR',
      valorEstimadoCOP: 2200000000,
      valorVigenciaActualCOP: 2200000000,
      requiereVigenciaFutura: false,
      unidadContratacion: 'Gerencia Técnica de Proyectos de Transición Energética',
      responsableContacto: 'convocatorias_fenoge@minenergia.gov.co',
      procesoVinculadoId: 'FENOGE-LP-012-2025',
      estadoArticulacionEDP: 'ARTICULADO_CONFORME'
    },
    {
      id: 'PAA-IDU-2025-302',
      entidad: 'INSTITUTO DE DESARROLLO URBANO (IDU)',
      vigencia: 2025,
      codigoUNSPSC: '72141100',
      descripcionBienServicio:
        'Mantenimiento y rehabilitación de malla vial arterial no troncal de la ciudad de Bogotá D.C. Grupo 3',
      fechaEstimadaInicio: '2025-04-10',
      duracionEstimadaMeses: 12,
      modalidadSeleccion: 'Licitación de Obra Pública (Pliego Tipo CCE)',
      fuenteRecursos: 'Recursos Propios Distrito Capital',
      valorEstimadoCOP: 8900000000,
      valorVigenciaActualCOP: 6000000000,
      requiereVigenciaFutura: true,
      unidadContratacion: 'Dirección Técnica de Malla Vial',
      responsableContacto: 'procesos_licitatorios@idu.gov.co',
      estadoArticulacionEDP: 'NO_REGISTRADO'
    }
  ];

  /**
   * Catálogo de Intervenciones en la Audiencia de Asignación y Distribución de Riesgos (Art. 4 Ley 1150 de 2007)
   */
  public static readonly AUDIENCIA_RIESGOS_DEMO: AudienciaRiesgosIntervencion[] = [
    {
      id: 'AR-MINTIC-001',
      procesoReferencia: 'MINTIC-LP-004-2025',
      fechaHora: '2025-02-05 10:30 a.m.',
      participante: 'SANJUANES SOLUCIONES S.A.S.',
      nitParticipante: '901.345.678-2',
      rolParticipante: 'OFERENTE',
      tipoRiesgoDebatido: 'CAMBIARIO_TRM',
      argumentoIntervencion:
        'La matriz de riesgos asigna el 100% del riesgo cambiario por indexación dólar de licenciamiento en la nube al contratista. Dada la volatilidad macroeconómica y el plazo de 10 meses, solicitamos establecer una banda de flotación del +/- 8% a partir de la cual el Estado absorba el diferencial.',
      solicitudReasignacion:
        'Pactar techo de fluctuación cambiaria y reequilibrio económico ante devaluación del peso superior al 8% frente a la TRM oficial de la fecha de cierre.',
      decisionEntidad: 'MODIFICADO_MEDIANTE_ADENDA',
      justificacionLegalEntidad:
        'Se acoge parcialmente la solicitud de Sanjuanés Soluciones S.A.S. Mediante Adenda No. 1 se ajustará la cláusula de riesgo cambiario estableciendo un corredor de variación compartida del 10% para garantizar la ecuación contractual (Art. 27 Ley 80/93).'
    },
    {
      id: 'AR-FENOGE-002',
      procesoReferencia: 'FENOGE-LP-012-2025',
      fechaHora: '2025-02-12 02:15 p.m.',
      participante: 'INGELECGROUP S.A.S. BIC',
      nitParticipante: '900.876.543-9',
      rolParticipante: 'OFERENTE',
      tipoRiesgoDebatido: 'DISPONIBILIDAD_RED',
      argumentoIntervencion:
        'En los puntos de instalación de las micro-redes solares fotovoltaicas en zonas rurales, el acceso a vías terciarias y los permisos ambientales comunitarios presentan retrasos no atribuibles al ejecutor. El riesgo debe ser tipificado como riesgo compartido de orden social y ambiental.',
      solicitudReasignacion:
        'Aclarar que los retrasos por concertación previa con comunidades locales suspenden el término de ejecución sin imposición de multas conminatorias.',
      decisionEntidad: 'RATIFICADO_SEGÚN_PLIEGO',
      justificacionLegalEntidad:
        'FENOGE asume directamente el acompañamiento social con delegados territoriales, por lo cual se ratifica la matriz pero se precisa en el acta de audiencia el procedimiento de suspensión concertada de plazos.'
    },
    {
      id: 'AR-MINTIC-003',
      procesoReferencia: 'MINTIC-LP-004-2025',
      fechaHora: '2025-02-05 11:45 a.m.',
      participante: 'PROCURADURÍA SEGUNDA DELEGADA PARA LA CONTRATACIÓN PREVENTIVA',
      nitParticipante: '899.999.119-5',
      rolParticipante: 'PROCURADURIA_PREVENTIVA',
      tipoRiesgoDebatido: 'OPERACIONAL_TECNICO',
      argumentoIntervencion:
        'Se exhorta al Comité Evaluador y Estructurador a verificar que las pruebas técnicas de concepto y ciberseguridad previas al despliegue definitivo cuenten con estándares NIST y no configuren exclusión desproporcionada de proponentes nacionales.',
      solicitudReasignacion:
        'Alinear los entregables técnicos a las guías de ciberseguridad del MinTIC sin exigir certificaciones de fábrica de un solo fabricante.',
      decisionEntidad: 'ACLARADO_SIN_MODIFICAR',
      justificacionLegalEntidad:
        'La entidad acoge la recomendación del ente de control y confirma que se admitirán estándares equivalentes certificados bajo ISO/IEC 27001 o NIST CSF.'
    }
  ];

  /**
   * Catálogo de Adendas Modificatorias del Proceso
   */
  public static readonly ADENDAS_DEMO: AdendaModificatoria[] = [
    {
      id: 'AD-MINTIC-001',
      numeroAdenda: 1,
      procesoReferencia: 'MINTIC-LP-004-2025',
      fechaPublicacion: '2025-02-07',
      horaPublicacion: '16:30',
      fechaCierreOriginal: '2025-02-14',
      fechaCierreAjustada: '2025-02-18',
      objetoModificacion:
        'Modificación de la cláusula de riesgo cambiario (Audiencia de Riesgos), ajuste al cronograma de entrega de pruebas técnicas y prórroga del cierre en 4 días hábiles.',
      diasHabilesAntelacionAlCierre: 5,
      esLegalConformeLey1882: true,
      analisisLegalCCE:
        'Adenda expedida con 5 días hábiles de antelación al cierre (mínimo legal: 3 días hábiles). Prórroga el cierre conforme al Artículo 2.2.1.1.2.2.1 del Decreto 1082 de 2015 y Ley 1882 de 2018.',
      prorrogoPlazoCierre: true
    },
    {
      id: 'AD-FENOGE-001',
      numeroAdenda: 1,
      procesoReferencia: 'FENOGE-LP-012-2025',
      fechaPublicacion: '2025-02-14',
      horaPublicacion: '15:10',
      fechaCierreOriginal: '2025-02-21',
      fechaCierreAjustada: '2025-02-21',
      objetoModificacion:
        'Inclusión formal de factor de desempate preferencial para Sociedades de Beneficio e Interés Colectivo (BIC) amparadas en Ley 2069/2020 y Dcto 1860/2021.',
      diasHabilesAntelacionAlCierre: 4,
      esLegalConformeLey1882: true,
      analisisLegalCCE:
        'Publicada 4 días hábiles antes del cierre sin alterar fecha límite. Cumple con la restricción de los 3 días hábiles de la Ley 1882 de 2018.',
      prorrogoPlazoCierre: false
    }
  ];

  /**
   * Evalúa la legalidad de una Adenda Modificatoria conforme a la Ley 1882 de 2018 y Decreto 1082 de 2015
   * Regla de oro CCE: "No se podrán expedir adendas dentro de los 3 días hábiles anteriores al cierre"
   */
  public static evaluarLegalidadAdenda(params: {
    fechaPublicacion: string;
    diasHabilesAntelacionAlCierre: number;
    prorrogaCierreDiasHabiles: number;
  }): { esLegal: boolean; dictamen: string; sancionPotencial: string } {
    const { diasHabilesAntelacionAlCierre, prorrogaCierreDiasHabiles } = params;

    if (diasHabilesAntelacionAlCierre >= 3) {
      return {
        esLegal: true,
        dictamen: `ADENDA CONFORME A LEY: Fue expedida con ${diasHabilesAntelacionAlCierre} días hábiles de antelación al cierre (cumple la regla de mínimo 3 días hábiles de la Ley 1882 de 2018 y Art. 2.2.1.1.2.2.1 Dcto. 1082/2015).`,
        sancionPotencial: 'Ninguna. Proceso blindado jurídicamente ante acciones de tutela o revocatoria directa.'
      };
    }

    // Si se publica a menos de 3 días, la ley OBLIGA a prorrogar el cierre por al menos 3 días hábiles
    if (prorrogaCierreDiasHabiles >= 3) {
      return {
        esLegal: true,
        dictamen: `ADENDA CONVALIDADA CON PRÓRROGA OBLIGATORIA: Aunque se emitió a menos de 3 días (${diasHabilesAntelacionAlCierre} días), la entidad prorrogó válidamente el cierre en ${prorrogaCierreDiasHabiles} días hábiles, garantizando el plazo a los oferentes para ajustar sus ofertas.`,
        sancionPotencial: 'Convalidada. Cumple la exigencia jurisprudencial del Consejo de Estado.'
      };
    }

    return {
      esLegal: false,
      dictamen: `ADENDA ILEGAL / EXTEMPORÁNEA: Expedida a sólo ${diasHabilesAntelacionAlCierre} días hábiles del cierre sin prorrogar el término por los 3 días mínimos requeridos. Viola el Artículo 1 de la Ley 1882 de 2018.`,
      sancionPotencial:
        'Vicio de nulidad absoluta del acto de adjudicación. Susceptible de medida cautelar de suspensión de proceso, acción de tutela o queja disciplinaria ante la Procuraduría General de la Nación.'
    };
  }

  /**
   * Realiza el análisis financiero y de liquidez "Go / No-Go" para el oferente
   */
  public static calcularViabilidadGoNoGo(params: {
    proponenteId: string;
    nombreProponente: string;
    nitProponente: string;
    presupuestoLicitacionCOP: number;
    capitalTrabajoDisponibleCOP: number;
    plazoEjecucionMeses: number;
    plazoPagoEstatalDias: number; // 45, 60 o 90 días
    anticipoPct: number;
    margenUtilidadPct: number;
  }): AnalisisGoNoGoOferente {
    const {
      proponenteId,
      nombreProponente,
      nitProponente,
      presupuestoLicitacionCOP,
      capitalTrabajoDisponibleCOP,
      plazoEjecucionMeses,
      plazoPagoEstatalDias,
      anticipoPct,
      margenUtilidadPct
    } = params;

    // Costo de preparación de la oferta (visitas, pólizas, garantías, personal)
    const costoPreparacionPropuestaCOP = Math.round(presupuestoLicitacionCOP * 0.004); // 0.4% del presupuesto

    // Prima de póliza de seriedad de la oferta (10% de valor asegurado a tarifa del 1.2% anual)
    const valorAseguradoSeriedad = presupuestoLicitacionCOP * 0.1;
    const costoPolizaSeriedadCOP = Math.round(valorAseguradoSeriedad * 0.012);

    // Músculo financiero requerido para sostener la operación durante el desfase de pago estatal
    // Si el Estado paga a 60 días, la empresa debe financiar de 2 a 3 meses de costo directo antes de recibir el primer giro
    const costoDirectoTotal = presupuestoLicitacionCOP * (1 - margenUtilidadPct / 100);
    const costoDirectoMensual = costoDirectoTotal / Math.max(1, plazoEjecucionMeses);

    // Meses de colchón de tesorería requerido por el plazo de pago estatal
    const mesesColchonRequeridos = Math.ceil(plazoPagoEstatalDias / 30);
    const anticipoEfectivo = (presupuestoLicitacionCOP * anticipoPct) / 100;

    // Capital de trabajo mínimo indispensable
    const capitalTrabajoRequeridoCOP = Math.max(
      0,
      Math.round(costoDirectoMensual * mesesColchonRequeridos - anticipoEfectivo + costoPolizaSeriedadCOP)
    );

    const deficitSuperavitCajaCOP = capitalTrabajoDisponibleCOP - capitalTrabajoRequeridoCOP;

    // Determinación del Dictamen de Viabilidad Go / No-Go
    let dictamenViabilidad: AnalisisGoNoGoOferente['dictamenViabilidad'] = 'VIABLE_CON_ALTA_RENTABILIDAD';
    const recomendaciones: string[] = [];

    const ratioCobertura = capitalTrabajoDisponibleCOP / Math.max(1, capitalTrabajoRequeridoCOP);

    if (ratioCobertura >= 1.5) {
      dictamenViabilidad = 'VIABLE_CON_ALTA_RENTABILIDAD';
      recomendaciones.push(
        'El proponente cuenta con holgura de capital de trabajo superior al 150% del requerido. Se recomienda presentar oferta individual sin necesidad de aliados.'
      );
    } else if (ratioCobertura >= 1.0) {
      dictamenViabilidad = 'VIABLE_CON_RIESGO_DE_LIQUIDEZ';
      recomendaciones.push(
        'El capital de trabajo es apenas suficiente. Cualquier retraso de la tesorería estatal más allá de los ' +
          plazoPagoEstatalDias +
          ' días podría presionar el flujo de caja. Se sugiere negociar pronto pago de facturas o factoring con bancos.'
      );
    } else if (ratioCobertura >= 0.5) {
      dictamenViabilidad = 'NO_VIABLE_REQUIERE_CONSORCIO';
      recomendaciones.push(
        'Déficit de capital de trabajo detectado (\$ ' +
          Math.abs(deficitSuperavitCajaCOP).toLocaleString('es-CO') +
          ' COP). Se recomienda NO presentarse de forma individual. La opción estratégica óptima es conformar un Consorcio o Unión Temporal con un socio financiero (Art. 7 Ley 80).'
      );
    } else {
      dictamenViabilidad = 'RECHAZADO_CAPITAL_INSUFICIENTE';
      recomendaciones.push(
        'Alto riesgo de quiebra técnica o incumplimiento contractual. El tamaño del contrato sobrepasa la capacidad de tesorería del oferente en este momento. Se sugiere abstenerse de cotizar.'
      );
    }

    // Proyección del Flujo de Caja Mes a Mes
    const flujoCajaProyectado: FlujoCajaMensualOferente[] = [];
    let saldoAcumulado = capitalTrabajoDisponibleCOP - costoPreparacionPropuestaCOP - costoPolizaSeriedadCOP;

    // Mes 0: Preparación
    flujoCajaProyectado.push({
      mes: 0,
      concepto: 'Preparación de oferta, radicación y expedición de póliza',
      ingresosCOP: 0,
      egresosCOP: costoPreparacionPropuestaCOP + costoPolizaSeriedadCOP,
      flujoNetoCOP: -(costoPreparacionPropuestaCOP + costoPolizaSeriedadCOP),
      saldoAcumuladoCOP: saldoAcumulado
    });

    const facturacionMensual = presupuestoLicitacionCOP / plazoEjecucionMeses;

    for (let m = 1; m <= plazoEjecucionMeses; m++) {
      let ingresoMes = 0;
      // Si hay anticipo, entra en el mes 1
      if (m === 1 && anticipoEfectivo > 0) {
        ingresoMes += anticipoEfectivo;
      }
      // Los pagos de actas entran con el rezago del plazo de pago estatal
      const mesCobroFactura = m - mesesColchonRequeridos;
      if (mesCobroFactura >= 1) {
        ingresoMes += facturacionMensual;
      }

      const egresoMes = costoDirectoMensual;
      const flujoNeto = ingresoMes - egresoMes;
      saldoAcumulado += flujoNeto;

      flujoCajaProyectado.push({
        mes: m,
        concepto: `Ejecución operativa Mes ${m} (Desfase tesorería ${plazoPagoEstatalDias}d)`,
        ingresosCOP: Math.round(ingresoMes),
        egresosCOP: Math.round(egresoMes),
        flujoNetoCOP: Math.round(flujoNeto),
        saldoAcumuladoCOP: Math.round(saldoAcumulado)
      });
    }

    return {
      proponenteId,
      nombreProponente,
      nitProponente,
      presupuestoOficialLicitacionCOP: presupuestoLicitacionCOP,
      margenUtilidadEstimadoPct: margenUtilidadPct,
      anticipoPactadoPct: anticipoPct,
      plazoPagoPromedioDias: plazoPagoEstatalDias,
      plazoEjecucionMeses,
      capitalTrabajoDisponibleCOP,
      capitalTrabajoRequeridoCOP,
      deficitSuperavitCajaCOP,
      costoPolizaSeriedadCOP,
      costoPreparacionPropuestaCOP,
      dictamenViabilidad,
      recomendacionesEstrategicas: recomendaciones,
      flujoCajaProyectado
    };
  }

  /**
   * Genera el texto íntegro del documento oficial de Estudios Previos conforme al Decreto 1082 de 2015
   */
  public static redactarMinutaEstudiosPrevios(
    edp: EstudioPrevioOficial,
    cdp: CertificadoDisponibilidadPresupuestalCDP
  ): string {
    return `
================================================================================
ESTUDIOS Y DOCUMENTOS PREVIOS (EDP)
CONFORME AL ARTÍCULO 2.2.1.1.2.1.1 DEL DECRETO 1082 DE 2015
ENTIDAD CONTRATANTE: ${edp.entidad}
NIT: ${edp.nitEntidad}
PROCESO REFERENCIA: ${edp.procesoReferencia}
FECHA DE EXPEDICIÓN: ${edp.fechaElaboracion}
================================================================================

1. DESCRIPCIÓN DE LA NECESIDAD QUE SE PRETENDE SATISFACER (NUM. 1)
--------------------------------------------------------------------------------
${edp.necesidadJustificada}

2. OBJETO A CONTRATAR Y CLASIFICACIÓN UNSPSC (NUM. 2)
--------------------------------------------------------------------------------
Objeto: ${edp.objetoContrato}
Plazo de Ejecución: ${edp.plazoEjecucionMeses} meses
Lugar de Ejecución: ${edp.lugarEjecucion}
Códigos UNSPSC Principales: [${edp.codigosUNSPSC.join(', ')}]

3. MODALIDAD DE SELECCIÓN Y FUNDAMENTO JURÍDICO (NUM. 3)
--------------------------------------------------------------------------------
Modalidad: ${edp.modalidadSeleccion}
Justificación Jurídica:
${edp.justificacionJuridicaModalidad}

4. VALOR ESTIMADO DEL CONTRATO Y ANÁLISIS ECONÓMICO (NUM. 4)
--------------------------------------------------------------------------------
Presupuesto Oficial Estimado: \$${edp.presupuestoOficialCOP.toLocaleString('es-CO')} COP
Forma de Pago: ${edp.formaDePago}
Resumen Análisis del Sector y Precios de Mercado:
${edp.analisisSectorMercadoResumen}

5. GESTIÓN Y DISPONIBILIDAD PRESUPUESTAL (CDP & PAC)
--------------------------------------------------------------------------------
Certificado de Disponibilidad Presupuestal (CDP): No. ${cdp.numeroCDP}
Fecha Expedición CDP: ${cdp.fechaExpedicion} | Vigencia: ${cdp.fechaVencimiento}
Rubro Presupuestal: ${cdp.rubroPresupuestal} - ${cdp.nombreRubro}
Fuente de Financiación: ${cdp.fuenteFinanciacion}
Valor Amparado: \$${cdp.valorAmparadoCOP.toLocaleString('es-CO')} COP
Vigencias Futuras: ${cdp.requiereVigenciasFuturas ? `Sí (${cdp.autorizacionVigenciasFuturas})` : 'No requiere'}

6. CRITERIOS HABILITANTES Y SELECCIÓN OBJETIVA (NUM. 5)
--------------------------------------------------------------------------------
${edp.criteriosHabilitantesResumen}
- Limitación a MiPymes (Ley 2069/2020): ${edp.limitacionMipymes ? 'Sí aplica convocatoria limitada' : 'No limitada'}
- Acuerdos Comerciales / TLCs: ${edp.acuerdosComercialesTLC ? 'Cobijado por Capítulos de Compras Públicas' : 'No cobijado'}

7. ANÁLISIS DEL RIESGO Y FORMA DE MITIGARLO (NUM. 6)
--------------------------------------------------------------------------------
${edp.riesgosIdentificadosResumen}

8. EXIGENCIA DE GARANTÍAS Y AMPAROS (NUM. 7)
--------------------------------------------------------------------------------
${edp.garantiasExigidas.map((g, i) => `${i + 1}. ${g.tipo}: ${g.porcentaje}% del valor del contrato - Vigencia: ${g.vigencia}`).join('\n')}

================================================================================
CONSTANCIA DE APROBACIÓN PRECONTRACTUAL
El presente documento constituye el soporte técnico, jurídico y financiero para
la apertura del proceso de selección en la plataforma SECOP II.

______________________________________________
ORDENADOR DEL GASTO / SECRETARIO GENERAL
${edp.entidad}
================================================================================
`.trim();
  }
}
