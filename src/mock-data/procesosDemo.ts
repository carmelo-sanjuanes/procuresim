// Procesos de Contratación Demo en SECOP I, SECOP II, Suplos, Ariba y Coupa
import { ProcesoContratacion } from '../core/domain/types';
import { ENTIDADES_DEMO } from './entidadesDemo';
import { PROVEEDORES_DEMO } from './proveedoresDemo';
import { RiskMatrixEngine } from '../core/engines/RiskMatrixEngine';
import { CASOS_SIMULADOS_MAESTROS, casoAProcesoContratacion } from './casosSimuladosMaestros';

export const PROCESOS_DEMO: ProcesoContratacion[] = [
  ...CASOS_SIMULADOS_MAESTROS.map(casoAProcesoContratacion),
  {
    id: 'PROC-SECOP2-01',
    numeroProceso: 'LP-001-2025',
    plataformaOrigen: 'SECOP_II_ENTIDAD',
    entidad: ENTIDADES_DEMO[0], // Alcaldía San Pedro
    modalidad: 'LICITACION_PUBLICA',
    objeto: 'Adquisición, dotación y puesta en marcha de equipos de cómputo y conectividad para las instituciones educativas del municipio de San Pedro del Valle',
    justificacion: 'Se requiere modernizar las aulas de cómputo de 12 sedes educativas rurales y urbanas del municipio para reducir la brecha digital de más de 3.500 estudiantes, de conformidad con las metas del Plan de Desarrollo Municipal.',
    presupuestoOficial: 450000000,
    cdpNumero: '2025-00189',
    cdpFecha: '2025-01-15',
    plazoMeses: 3,
    plazoDias: 90,
    lugarEjecucion: 'Municipio de San Pedro del Valle (Sedes Educativas)',
    estado: 'PRESENTACION_OFERTAS',
    cronograma: {
      publicacionBorrador: '2025-01-20',
      observacionesBorradorLimite: '2025-01-30',
      publicacionDefinitivo: '2025-02-05',
      presentacionOfertasLimite: '2025-02-25 10:00 AM',
      aperturaSobres: '2025-02-25 10:30 AM',
      publicacionInformeEvaluacion: '2025-03-05',
      trasladoInformeLimite: '2025-03-12',
      audienciaAdjudicacion: '2025-03-18',
      firmaContrato: '2025-03-25'
    },
    items: [
      {
        id: 'ITM-01',
        codigoUNSPSC: '43211500',
        descripcionUNSPSC: 'Computadores de escritorio y periféricos',
        detalleTecnico: 'Computador corporativo con procesador Core i5 13va gen o equivalente, 16GB RAM DDR4, SSD 512GB NVMe, Pantalla 23.8" FHD, Teclado y mouse USB.',
        unidadMedida: 'UNIDAD',
        cantidad: 80,
        precioUnitarioEstimado: 3800000
      },
      {
        id: 'ITM-02',
        codigoUNSPSC: '43211503',
        descripcionUNSPSC: 'Computadores portátiles para docentes',
        detalleTecnico: 'Portátil 14" FHD antirreflejo, Intel Core i5 o Ryzen 5, 16GB RAM, SSD 512GB, Batería 3 celdas, Garantía 3 años en sitio.',
        unidadMedida: 'UNIDAD',
        cantidad: 25,
        precioUnitarioEstimado: 4200000
      },
      {
        id: 'ITM-03',
        codigoUNSPSC: '43222600',
        descripcionUNSPSC: 'Puntos de acceso inalámbrico WiFi y switch administrable',
        detalleTecnico: 'Access Point WiFi 6 banda dual concurrente empresarial, gestión en nube, incluye instalación y cableado estructurado categoría 6A.',
        unidadMedida: 'UNIDAD',
        cantidad: 12,
        precioUnitarioEstimado: 3416666
      }
    ],
    riesgos: RiskMatrixEngine.generarMatrizPredeterminada('TECNOLOGIA'),
    requisitosHabilitantes: {
      exigeRUP: true,
      tiempoConstitucionMesesMinimo: 24,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.5,
      nivelEndeudamientoMaximoPct: 70,
      coberturaInteresesMinima: 2.0,
      capitalTrabajoMinimoCOP: 200000000,
      rentabilidadPatrimonioMinimaPct: 5,
      rentabilidadActivoMinimaPct: 3,
      codigosUNSPSCExigidos: ['43211500'],
      numeroContratosAcreditar: 2,
      sumatoriaSMMLVMinima: 400,
      anosExperienciaMinima: 3
    },
    criteriosPonderacion: {
      puntajeEconomico: 60,
      puntajeTecnicoCalidad: 20,
      puntajeIndustriaNacional: 10,
      puntajeDiscapacidad: 2,
      puntajeMiPyme: 8
    },
    observacionesCiudadanas: [
      {
        id: 'OBS-01',
        remitente: 'Veeduría Ciudadana por la Transparencia',
        fecha: '2025-01-25',
        texto: 'Solicitamos verificar que el plazo de entrega no limite la pluralidad de oferentes debido a tiempos de importación de microprocesadores.',
        respuestaEntidad: 'La entidad analizó el mercado y amplió el plazo de entrega de 60 a 90 días calendario para garantizar participación plural.',
        estado: 'ACEPTADA'
      }
    ],
    ofertasPresentadas: [
      {
        id: 'OFR-01',
        procesoId: 'PROC-SECOP2-01',
        proponente: PROVEEDORES_DEMO[0],
        fechaRadicacion: '2025-02-23 15:40',
        valorEconomicoTotal: 432500000,
        desglosePrecios: [
          { itemId: 'ITM-01', precioUnitarioOfertado: 3650000, subtotal: 292000000 },
          { itemId: 'ITM-02', precioUnitarioOfertado: 4100000, subtotal: 102500000 },
          { itemId: 'ITM-03', precioUnitarioOfertado: 3166666, subtotal: 38000000 }
        ],
        documentosCargados: [
          { tipo: 'CARTA_PRESENTACION', nombreArchivo: 'Carta_Presentacion_Firmada.pdf', estadoValidacion: 'CUMPLE' },
          { tipo: 'RUP', nombreArchivo: 'Certificado_RUP_Vigente.pdf', estadoValidacion: 'CUMPLE' },
          { tipo: 'CAMARA_COMERCIO', nombreArchivo: 'Camara_Comercio.pdf', estadoValidacion: 'CUMPLE' },
          { tipo: 'PARAFISCALES', nombreArchivo: 'Certificacion_Parafiscales_Revisor.pdf', estadoValidacion: 'CUMPLE' },
          { tipo: 'PROPUESTA_ECONOMICA', nombreArchivo: 'Formulario_Economico.xlsx', estadoValidacion: 'CUMPLE' }
        ],
        evaluacionJuridica: 'CUMPLE',
        evaluacionFinanciera: 'CUMPLE',
        evaluacionTecnica: 'CUMPLE',
        puntajeObtenido: {
          economico: 58.5,
          calidad: 20,
          industriaNacional: 10,
          discapacidad: 2,
          miPyme: 0,
          total: 90.5
        },
        esGanador: false
      }
    ]
  },
  {
    id: 'PROC-SECOP1-01',
    numeroProceso: 'MC-012-2024',
    plataformaOrigen: 'SECOP_I',
    entidad: ENTIDADES_DEMO[1], // Hospital San Rafael
    modalidad: 'MINIMA_CUANTIA',
    objeto: 'Suministro de papelería, útiles de oficina y archivo para las áreas asistenciales y administrativas del Hospital Regional',
    justificacion: 'Garantizar los insumos diarios para historias clínicas, recetas y facturación hospitalaria durante el primer semestre.',
    presupuestoOficial: 38500000,
    cdpNumero: '2024-00892',
    cdpFecha: '2024-11-10',
    plazoMeses: 1,
    plazoDias: 30,
    lugarEjecucion: 'Almacén General Hospital San Rafael - Tunja',
    estado: 'ADJUDICACION',
    cronograma: {
      publicacionBorrador: '2024-11-12',
      observacionesBorradorLimite: '2024-11-13',
      publicacionDefinitivo: '2024-11-15',
      presentacionOfertasLimite: '2024-11-18 15:00',
      aperturaSobres: '2024-11-18 16:00',
      publicacionInformeEvaluacion: '2024-11-20',
      trasladoInformeLimite: '2024-11-21',
      audienciaAdjudicacion: '2024-11-22',
      firmaContrato: '2024-11-25'
    },
    items: [
      {
        id: 'ITM-PAP-01',
        codigoUNSPSC: '14111500',
        descripcionUNSPSC: 'Papel fotocopia carta y oficio',
        detalleTecnico: 'Papel bond 75g reprográfico blancura 95% caja por 10 resmas.',
        unidadMedida: 'CAJA',
        cantidad: 200,
        precioUnitarioEstimado: 145000
      }
    ],
    riesgos: RiskMatrixEngine.generarMatrizPredeterminada('SUMINISTRO'),
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 6,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.0,
      nivelEndeudamientoMaximoPct: 85,
      coberturaInteresesMinima: 1.0,
      capitalTrabajoMinimoCOP: 15000000,
      rentabilidadPatrimonioMinimaPct: 1,
      rentabilidadActivoMinimaPct: 1,
      codigosUNSPSCExigidos: ['14111500'],
      numeroContratosAcreditar: 1,
      sumatoriaSMMLVMinima: 30,
      anosExperienciaMinima: 1
    },
    criteriosPonderacion: {
      puntajeEconomico: 100, // En Mínima Cuantía el único factor de selección es el menor precio válido
      puntajeTecnicoCalidad: 0,
      puntajeIndustriaNacional: 0,
      puntajeDiscapacidad: 0,
      puntajeMiPyme: 0
    },
    observacionesCiudadanas: [],
    ofertasPresentadas: []
  },
  {
    id: 'PROC-SUPLOS-01',
    numeroProceso: 'SUPL-EVT-2025-045',
    plataformaOrigen: 'SUPLOS',
    entidad: ENTIDADES_DEMO[3], // Grupo Andino Privado
    modalidad: 'PRIVADA_RFP',
    objeto: 'Homologación y suministro continuo de válvulas de control de flujo y accesorios de instrumentación industrial para refinería',
    justificacion: 'Contrato corporativo marco por 12 meses con entregas bajo demanda para mantenimiento mayor de plantas de refinación.',
    presupuestoOficial: 850000000,
    cdpNumero: 'PO-AP-2025-88',
    cdpFecha: '2025-01-08',
    plazoMeses: 12,
    plazoDias: 365,
    lugarEjecucion: 'Complejo Industrial Barrancabermeja / Cartagena',
    estado: 'PRESENTACION_OFERTAS',
    cronograma: {
      publicacionBorrador: '2025-01-10',
      observacionesBorradorLimite: '2025-01-18',
      publicacionDefinitivo: '2025-01-22',
      presentacionOfertasLimite: '2025-02-28 17:00',
      aperturaSobres: '2025-03-01 09:00',
      publicacionInformeEvaluacion: '2025-03-08',
      trasladoInformeLimite: '2025-03-12',
      audienciaAdjudicacion: '2025-03-15',
      firmaContrato: '2025-03-20'
    },
    items: [
      {
        id: 'ITM-SUPL-01',
        codigoUNSPSC: '40141600',
        descripcionUNSPSC: 'Válvulas industriales y actuadores',
        detalleTecnico: 'Válvula de bola acero inoxidable 316 clase 300 con actuador neumático y switch limitador.',
        unidadMedida: 'UNIDAD',
        cantidad: 45,
        precioUnitarioEstimado: 12500000
      }
    ],
    riesgos: RiskMatrixEngine.generarMatrizPredeterminada('SUMINISTRO'),
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 36,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.8,
      nivelEndeudamientoMaximoPct: 65,
      coberturaInteresesMinima: 2.5,
      capitalTrabajoMinimoCOP: 400000000,
      rentabilidadPatrimonioMinimaPct: 8,
      rentabilidadActivoMinimaPct: 5,
      codigosUNSPSCExigidos: ['40141600'],
      numeroContratosAcreditar: 3,
      sumatoriaSMMLVMinima: 750,
      anosExperienciaMinima: 4
    },
    criteriosPonderacion: {
      puntajeEconomico: 50,
      puntajeTecnicoCalidad: 30,
      puntajeIndustriaNacional: 10,
      puntajeDiscapacidad: 0,
      puntajeMiPyme: 10
    },
    observacionesCiudadanas: [],
    ofertasPresentadas: []
  },
  {
    id: 'PROC-ARIBA-01',
    numeroProceso: 'ARIBA-RFQ-9902',
    plataformaOrigen: 'SAP_ARIBA',
    entidad: ENTIDADES_DEMO[3], // Corporativo Privado
    modalidad: 'PRIVADA_SUBASTA',
    objeto: 'Reverse Auction: Adquisición de Licenciamiento Corporativo y Migración de Infraestructura Cloud Híbrida',
    justificacion: 'Consolidación de data centers y optimización de costos en nube privada y pública.',
    presupuestoOficial: 620000000,
    cdpNumero: 'CAPEX-IT-2025',
    cdpFecha: '2025-01-20',
    plazoMeses: 24,
    plazoDias: 730,
    lugarEjecucion: 'Instalaciones Corporativas / Servicios Cloud',
    estado: 'PRESENTACION_OFERTAS',
    cronograma: {
      publicacionBorrador: '2025-01-22',
      observacionesBorradorLimite: '2025-01-28',
      publicacionDefinitivo: '2025-02-01',
      presentacionOfertasLimite: '2025-02-28 14:00',
      aperturaSobres: '2025-02-28 14:05',
      publicacionInformeEvaluacion: '2025-03-02',
      trasladoInformeLimite: '2025-03-04',
      audienciaAdjudicacion: '2025-03-05',
      firmaContrato: '2025-03-10'
    },
    items: [
      {
        id: 'ITM-ARB-01',
        codigoUNSPSC: '43232800',
        descripcionUNSPSC: 'Software y licencias para gestión de redes y servidores',
        detalleTecnico: 'Licencias enterprise cloud con soporte 24x7x365 misión crítica.',
        unidadMedida: 'AÑO',
        cantidad: 2,
        precioUnitarioEstimado: 310000000
      }
    ],
    riesgos: RiskMatrixEngine.generarMatrizPredeterminada('TECNOLOGIA'),
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 24,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.5,
      nivelEndeudamientoMaximoPct: 70,
      coberturaInteresesMinima: 2.0,
      capitalTrabajoMinimoCOP: 300000000,
      rentabilidadPatrimonioMinimaPct: 5,
      rentabilidadActivoMinimaPct: 3,
      codigosUNSPSCExigidos: ['43232800'],
      numeroContratosAcreditar: 2,
      sumatoriaSMMLVMinima: 500,
      anosExperienciaMinima: 3
    },
    criteriosPonderacion: {
      puntajeEconomico: 70,
      puntajeTecnicoCalidad: 30,
      puntajeIndustriaNacional: 0,
      puntajeDiscapacidad: 0,
      puntajeMiPyme: 0
    },
    observacionesCiudadanas: [],
    ofertasPresentadas: []
  },
  {
    id: 'PROC-COUPA-01',
    numeroProceso: 'COUPA-REQ-7741',
    plataformaOrigen: 'COUPA',
    entidad: ENTIDADES_DEMO[3],
    modalidad: 'PRIVADA_RFQ',
    objeto: 'Spend Management: Contratación de Flota de Transporte Corporativo y Mensajería Logística Nacional',
    justificacion: 'Optimización de rutas y trazabilidad de envíos intermunicipales con plataforma GPS y reporte de emisiones CO2.',
    presupuestoOficial: 320000000,
    cdpNumero: 'OPEX-LOG-2025',
    cdpFecha: '2025-01-12',
    plazoMeses: 12,
    plazoDias: 365,
    lugarEjecucion: 'Rutas Nacionales Colombia',
    estado: 'PRESENTACION_OFERTAS',
    cronograma: {
      publicacionBorrador: '2025-01-15',
      observacionesBorradorLimite: '2025-01-20',
      publicacionDefinitivo: '2025-01-25',
      presentacionOfertasLimite: '2025-02-28 16:00',
      aperturaSobres: '2025-03-01 10:00',
      publicacionInformeEvaluacion: '2025-03-05',
      trasladoInformeLimite: '2025-03-07',
      audienciaAdjudicacion: '2025-03-10',
      firmaContrato: '2025-03-12'
    },
    items: [
      {
        id: 'ITM-CP-01',
        codigoUNSPSC: '78101800',
        descripcionUNSPSC: 'Servicios de transporte por carretera de carga y paquetería',
        detalleTecnico: 'Flota dedicada con capacidad de 5 a 10 toneladas y monitoreo satelital en tiempo real.',
        unidadMedida: 'MES',
        cantidad: 12,
        precioUnitarioEstimado: 26666666
      }
    ],
    riesgos: RiskMatrixEngine.generarMatrizPredeterminada('SERVICIOS_GENERALES'),
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 12,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.2,
      nivelEndeudamientoMaximoPct: 75,
      coberturaInteresesMinima: 1.5,
      capitalTrabajoMinimoCOP: 100000000,
      rentabilidadPatrimonioMinimaPct: 3,
      rentabilidadActivoMinimaPct: 2,
      codigosUNSPSCExigidos: ['78101800'],
      numeroContratosAcreditar: 2,
      sumatoriaSMMLVMinima: 250,
      anosExperienciaMinima: 2
    },
    criteriosPonderacion: {
      puntajeEconomico: 60,
      puntajeTecnicoCalidad: 40,
      puntajeIndustriaNacional: 0,
      puntajeDiscapacidad: 0,
      puntajeMiPyme: 0
    },
    observacionesCiudadanas: [],
    ofertasPresentadas: []
  }
];
