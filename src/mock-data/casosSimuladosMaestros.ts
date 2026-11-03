// Biblioteca Maestra de Casos Simulados de Contratación Pública y Privada
// Diseñada para Auditoría Adversarial, Entrenamiento Pedagógico y Simulación de Extremo a Extremo
// Abarca desde la Mínima Cuantía más elemental hasta Megaproyectos APP (Ley 1508) y Parques Solares FNCER.

import type {
  ProcesoContratacion,
  ModalidadContratacion,
  PlataformaVista,
  ItemRequerimiento,
  RequisitosHabilitantes,
  RiesgoContratacion
} from '../core/domain/types';
import type { Oportunidad } from '../core/domain/oportunidades';
import { ENTIDADES_DEMO } from './entidadesDemo';

export type CategoriaCaso =
  | 'BASICO_COTIDIANO'
  | 'ESTANDAR_OBRA_CONSULTORIA'
  | 'CATALOGO_AGREGACION'
  | 'REGIMEN_PRIVADO_SERVICIOS'
  | 'COMPLEJO_INDUSTRIAL'
  | 'FNCER_SOLAR'
  | 'MEGAPROYECTO_APP'
  | 'INTERADMINISTRATIVO_LEY2195'
  | 'ESAL_DECRETO092'
  | 'SOLIDARIO_JAC'
  | 'URGENCIA_MANIFIESTA';

export interface CasoSimuladoMaestro {
  id: string;
  categoria: CategoriaCaso;
  titulo: string;
  descripcionBreve: string;
  numeroProceso: string;
  entidadId: string;
  modalidad: ModalidadContratacion;
  modalidadTexto: string;
  plataforma: PlataformaVista;
  plataformaTexto: string;
  objeto: string;
  justificacion: string;
  presupuestoCOP: number;
  cdpNumero: string;
  cdpFecha: string;
  plazoMeses: number;
  plazoDias: number;
  lugarEjecucion: string;
  unspsc: string;
  unspscTexto: string;
  publicada: string;
  cierre: string;
  enlace: string;
  tags: string[];
  caracteristicasJuridicas: string[];
  trampaOPeligroAuditado: string;
  solucionBlindaje: string;
  items: ItemRequerimiento[];
  requisitosHabilitantes: RequisitosHabilitantes;
}

export const CASOS_SIMULADOS_MAESTROS: CasoSimuladoMaestro[] = [
  // 1. Mínima Cuantía Básica
  {
    id: 'CASO-01-MINIMA-PAPELERIA',
    categoria: 'BASICO_COTIDIANO',
    titulo: 'Mínima Cuantía: Suministro de Papelería y Aseo Hospitalario',
    descripcionBreve: 'Proceso ágil por menor precio sin exigencia de RUP. Término de publicación ultra-corto (1 día hábil).',
    numeroProceso: 'MC-014-2026',
    entidadId: 'ENT-02', // Hospital Regional San Rafael
    modalidad: 'MINIMA_CUANTIA',
    modalidadTexto: 'Mínima cuantía',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Adquisición y entrega de papelería, útiles de oficina y elementos de bioseguridad y aseo para las áreas asistenciales y administrativas de la E.S.E.',
    justificacion: 'Asegurar la operación continua de admisiones, historias clínicas y desinfección preventiva de áreas críticas.',
    presupuestoCOP: 28500000,
    cdpNumero: 'CDP-2026-00412',
    cdpFecha: '2026-10-15',
    plazoMeses: 2,
    plazoDias: 60,
    lugarEjecucion: 'Tunja (Boyacá)',
    unspsc: '44120000',
    unspscTexto: 'Suministros de oficina y papelería',
    publicada: '2026-10-20',
    cierre: '2026-10-27',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.MC-014-2026',
    tags: ['Mínima Cuantía', 'Menor Precio', 'Sin RUP', 'Salud'],
    caracteristicasJuridicas: [
      'Art. 2 num. 5 Ley 1150 de 2007 y Art. 2.2.1.2.1.5.1 Decreto 1082 de 2015',
      'Invitación pública publicada por al menos 1 día hábil',
      'Criterio de adjudicación exclusivo: menor precio entre ofertas habilitadas',
      'El RUP NO es obligatorio según ley; se habilita con cédula/RUT y capacidad jurídica'
    ],
    trampaOPeligroAuditado: 'Exigir RUP o pedir experiencia desproporcionada de gran empresa en mínima cuantía (vulnera el principio de proporcionalidad y libre concurrencia).',
    solucionBlindaje: 'Verificación directa de Registro Único Tributario (RUT), paz y salvo de parafiscales y cotización formal detallada.',
    items: [
      { id: 'ITM-MC-01', codigoUNSPSC: '44122000', descripcionUNSPSC: 'Papel bond carta reprográfico 75g (resmas)', detalleTecnico: 'Caja x 5 resmas 500 hojas, blancura 98%', unidadMedida: 'CAJA', cantidad: 120, precioUnitarioEstimado: 125000 },
      { id: 'ITM-MC-02', codigoUNSPSC: '47131800', descripcionUNSPSC: 'Soluciones desinfectantes de amonio cuaternario', detalleTecnico: 'Galón x 3.785 ml con ficha técnica Invima', unidadMedida: 'GALON', cantidad: 90, precioUnitarioEstimado: 150000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 6,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.0,
      nivelEndeudamientoMaximoPct: 80,
      coberturaInteresesMinima: 1.0,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 10000000,
      numeroContratosAcreditar: 1,
      anosExperienciaMinima: 1
    }
  },

  // 2. Selección Abreviada Menor Cuantía - Obra Vial con Pliegos Tipo
  {
    id: 'CASO-02-SAMC-OBRA-VIAL',
    categoria: 'ESTANDAR_OBRA_CONSULTORIA',
    titulo: 'Selección Abreviada: Pavimentación Placa Huella con Pliegos Tipo CCE',
    descripcionBreve: 'Obra pública de infraestructura vial con aplicación estricta de Pliegos Tipo, K-residual oficial y anticipo del 20% con fiducia obligatoria.',
    numeroProceso: 'SAMC-008-2026',
    entidadId: 'ENT-01', // Alcaldía de San Pedro
    modalidad: 'SELECCION_ABREVIADA_MENOR_CUANTIA',
    modalidadTexto: 'Selección abreviada de menor cuantía',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Mejoramiento mediante pavimento rígido tipo placa huella y obras de drenaje en la vía terciaria que comunica la vereda El Naranjal con la cabecera municipal.',
    justificacion: 'Recuperar la transitabilidad para el transporte de cosechas agrícolas y conectar a más de 180 familias campesinas.',
    presupuestoCOP: 890000000,
    cdpNumero: 'CDP-2026-00088',
    cdpFecha: '2026-09-10',
    plazoMeses: 4,
    plazoDias: 120,
    lugarEjecucion: 'San Pedro del Valle (Vereda El Naranjal)',
    unspsc: '72141000',
    unspscTexto: 'Construcción y pavimentación de autopistas y carreteras',
    publicada: '2026-10-05',
    cierre: '2026-10-30',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.SAMC-008-2026',
    tags: ['Obra Civil', 'Pliegos Tipo', 'K Residual', 'Fiducia Anticipo', 'AIU'],
    caracteristicasJuridicas: [
      'Documentos Tipo obligatorios de Colombia Compra Eficiente (Decreto 1082/15 y Ley 2022/20)',
      'Fórmula de Capacidad Residual CCE: CR = CO x (E + CT + CF) / 100 - SCE',
      'Anticipo del 20% con constitución obligatoria de encargo fiduciario (Art. 91 Ley 1474 de 2011)',
      'Desempate mediante cascada del Art. 35 de la Ley 2069 de 2020 (Mipyme, industria nacional, discapacidad)'
    ],
    trampaOPeligroAuditado: 'Alterar los requisitos de experiencia de los Pliegos Tipo (práctica sancionada por la SIC y Procuraduría) o desembolsar anticipo a cuenta corriente sin fiducia.',
    solucionBlindaje: 'Adopción textual de la matriz de experiencia CCE y apertura de cuenta fiduciaria mercantil antes del Acta de Inicio.',
    items: [
      { id: 'ITM-OBR-01', codigoUNSPSC: '72141003', descripcionUNSPSC: 'Excavación y explanación en terreno semiduro', detalleTecnico: 'Excavación mecánica para cimentación de calzada y cunetas', unidadMedida: 'METRO_CUBICO', cantidad: 3200, precioUnitarioEstimado: 38000 },
      { id: 'ITM-OBR-02', codigoUNSPSC: '72141004', descripcionUNSPSC: 'Concreto hidráulico MR-42 para placa huella', detalleTecnico: 'Concreto estructural premezclado 3000 PSI reforzado con malla electrosoldada', unidadMedida: 'METRO_CUBICO', cantidad: 680, precioUnitarioEstimado: 850000 },
      { id: 'ITM-OBR-03', codigoUNSPSC: '72141008', descripcionUNSPSC: 'Piedra pegada para franjas intermedias ciclópeas', detalleTecnico: 'Mampostería de piedra media zanja y mortero 1:3', unidadMedida: 'METRO_CUADRADO', cantidad: 1450, precioUnitarioEstimado: 135000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: true,
      tiempoConstitucionMesesMinimo: 24,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.3,
      nivelEndeudamientoMaximoPct: 70,
      coberturaInteresesMinima: 2.0,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 260000000,
      numeroContratosAcreditar: 2,
      anosExperienciaMinima: 3
    }
  },

  // 3. Concurso de Méritos Abierto - Interventoría Técnica
  {
    id: 'CASO-03-CONCURSO-MERITOS-INTERVENTORIA',
    categoria: 'ESTANDAR_OBRA_CONSULTORIA',
    titulo: 'Concurso de Méritos: Interventoría Integral de Acueducto Rural',
    descripcionBreve: 'Evaluación técnica de calidad y equipo humano sin puja económica. Apertura de Sobre 2 económico solo del primer orden de elegibilidad.',
    numeroProceso: 'CMA-003-2026',
    entidadId: 'ENT-RIVERA',
    modalidad: 'CONCURSO_MERITOS',
    modalidadTexto: 'Concurso de méritos',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Interventoría técnica, administrativa, financiera, jurídica y ambiental para la construcción y optimización de la planta de tratamiento de agua potable y red de distribución.',
    justificacion: 'Garantizar el cumplimiento estricto de las especificaciones hidráulicas del RAS y vigilar la correcta inversión de recursos públicos.',
    presupuestoCOP: 420000000,
    cdpNumero: 'CDP-2026-00195',
    cdpFecha: '2026-09-22',
    plazoMeses: 6,
    plazoDias: 180,
    lugarEjecucion: 'Rivera (Huila)',
    unspsc: '81101500',
    unspscTexto: 'Servicios de ingeniería civil y consultoría técnica',
    publicada: '2026-10-01',
    cierre: '2026-10-28',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.CMA-003-2026',
    tags: ['Concurso de Méritos', 'Consultoría', 'Interventoría', 'Sin Puja', 'Sobre 2'],
    caracteristicasJuridicas: [
      'Art. 2 num. 3 Ley 1150 de 2007 y Art. 2.2.1.2.1.3.1 Decreto 1082 de 2015',
      'Prohibición tajante de calificar el factor precio o permitir descuentos económicos que deterioren la calidad técnica',
      'El Sobre Económico solo se abre si el proponente obtiene el primer puesto en puntaje técnico',
      'Interventoría debe actuar con independencia frente al contratista de obra (Art. 83 Ley 1474/11)'
    ],
    trampaOPeligroAuditado: 'Intentar calificar el precio en un concurso de méritos o negociar la propuesta económica a la baja (nulo de pleno derecho).',
    solucionBlindaje: 'Puntaje enfocado en experiencia específica del director de interventoría y especialistas (hidráulico, ambiental, financiero).',
    items: [
      { id: 'ITM-CM-01', codigoUNSPSC: '81101508', descripcionUNSPSC: 'Servicios de interventoría de obras de acueducto', detalleTecnico: 'Dirección e inspección de obra civil hidráulica y control de calidad', unidadMedida: 'MES', cantidad: 6, precioUnitarioEstimado: 70000000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: true,
      tiempoConstitucionMesesMinimo: 36,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.5,
      nivelEndeudamientoMaximoPct: 65,
      coberturaInteresesMinima: 2.5,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 180000000,
      numeroContratosAcreditar: 3,
      anosExperienciaMinima: 5
    }
  },

  // 4. Catálogo y Tienda Virtual del Estado (TVEC)
  {
    id: 'CASO-04-TVEC-DOTACION-SENA',
    categoria: 'CATALOGO_AGREGACION',
    titulo: 'Tienda Virtual (TVEC): Adquisición de Dotación y Ropa de Trabajo',
    descripcionBreve: 'Compra por agregación de demanda mediante Acuerdo Marco de Precios CCE. Evento de cotización electrónica en plataforma transaccional.',
    numeroProceso: 'OC-SENA-2026-44',
    entidadId: 'ENT-SENA',
    modalidad: 'SELECCION_ABREVIADA_SUBASTA_INVERSA',
    modalidadTexto: 'Acuerdo Marco de Precios (TVEC)',
    plataforma: 'TIENDA_VIRTUAL_TVEC',
    plataformaTexto: 'Tienda Virtual (TVEC)',
    objeto: 'Adquisición de dotación institucional de calzado y vestido de labor para aprendices en talleres técnicos y funcionarios de campo a nivel nacional.',
    justificacion: 'Cumplimiento de la obligación legal de dotación laboral según Código Sustantivo del Trabajo mediante el catálogo de precios CCE.',
    presupuestoCOP: 1250000000,
    cdpNumero: 'CDP-SENA-0891',
    cdpFecha: '2026-08-30',
    plazoMeses: 3,
    plazoDias: 90,
    lugarEjecucion: 'Nivel Nacional (Centros de Formación SENA)',
    unspsc: '53102700',
    unspscTexto: 'Prendas de vestir y uniformes de trabajo',
    publicada: '2026-10-10',
    cierre: '2026-10-24',
    enlace: 'https://www.colombiacompra.gov.co/tienda-virtual-del-estado-colombiano',
    tags: ['TVEC', 'Acuerdo Marco', 'Catálogo CCE', 'Dotación', 'Orden de Compra'],
    caracteristicasJuridicas: [
      'Art. 2 num. 2 lit. a Ley 1150 de 2007 y Art. 2.2.1.2.1.2.7 Decreto 1082 de 2015',
      'Obligatoriedad para entidades de orden nacional de adquirir bienes estandarizados por Acuerdos Marco',
      'No requiere estructurar pliegos desde cero: opera por cotización de segundo nivel entre proveedores preadjudicados'
    ],
    trampaOPeligroAuditado: 'Lanzar licitación pública por fuera del Acuerdo Marco existiendo catálogo vigente en Colombia Compra Eficiente (falta disciplinaria gravísima).',
    solucionBlindaje: 'Consulta de la Guía de Compra del Acuerdo Marco de Dotaciones vigente y emisión de Orden de Compra electrónica en TVEC.',
    items: [
      { id: 'ITM-TV-01', codigoUNSPSC: '53102701', descripcionUNSPSC: 'Overol industrial enterizo antifluido y retardante', detalleTecnico: 'Dril 100% algodón con cintas reflectivas 3M y bordado institucional', unidadMedida: 'UNIDAD', cantidad: 4500, precioUnitarioEstimado: 140000 },
      { id: 'ITM-TV-02', codigoUNSPSC: '53111501', descripcionUNSPSC: 'Calzado de seguridad dieléctrico con puntera composite', detalleTecnico: 'Bota cuero hidrofugado, suela poliuretano antideslizante certificada ASTM', unidadMedida: 'PAR', cantidad: 3800, precioUnitarioEstimado: 163000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: true,
      tiempoConstitucionMesesMinimo: 12,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.2,
      nivelEndeudamientoMaximoPct: 75,
      coberturaInteresesMinima: 1.5,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 400000000,
      numeroContratosAcreditar: 2,
      anosExperienciaMinima: 2
    }
  },

  // 5. Régimen Especial Privado con Plataforma Suplos (EPM)
  {
    id: 'CASO-05-SUPLOS-EPM-TRANSFORMADORES',
    categoria: 'REGIMEN_PRIVADO_SERVICIOS',
    titulo: 'Régimen Privado EPM (Suplos): Suministro de Transformadores 13.2 kV',
    descripcionBreve: 'Contratación bajo Manual Privado de EPM (Art. 15 Ley 142 de 1994). Gestión B2B transaccional en Suplos.',
    numeroProceso: 'CR-EPM-2026-00318',
    entidadId: 'ENT-EPM',
    modalidad: 'REGIMEN_ESPECIAL',
    modalidadTexto: 'Régimen especial (Manual Privado EPM)',
    plataforma: 'SUPLOS',
    plataformaTexto: 'Suplos Procurement',
    objeto: 'Fabricación, pruebas en fábrica (FAT), suministro y transporte de transformadores de distribución trifásicos en aceite de 75 kVA y 112.5 kVA para la red del Valle de Aburrá.',
    justificacion: 'Reposición de activos críticos del plan de expansión eléctrica y atención de demanda industrial del departamento de Antioquia.',
    presupuestoCOP: 3800000000,
    cdpNumero: 'PR-EPM-8812',
    cdpFecha: '2026-09-01',
    plazoMeses: 8,
    plazoDias: 240,
    lugarEjecucion: 'Medellín y Municipios del Área Metropolitana',
    unspsc: '39121000',
    unspscTexto: 'Transformadores eléctricos de potencia y distribución',
    publicada: '2026-10-02',
    cierre: '2026-11-06',
    enlace: 'https://epm.suplos.com/procurement/tender/CR-EPM-2026-00318',
    tags: ['Suplos', 'EPM', 'Servicios Públicos', 'Régimen Privado', 'Energía'],
    caracteristicasJuridicas: [
      'Empresa de Servicios Públicos Domiciliarios excluida de Ley 80/93 (Art. 31 Ley 142 de 1994)',
      'Regida por el Derecho Privado comercial y las normas de su Manual Interno de Contratación',
      'Plataforma transaccional privada Suplos con homologación previa de proveedores',
      'No sujeta a pliegos tipo ni audiencia de adjudicación obligatoria de Ley 80'
    ],
    trampaOPeligroAuditado: 'Interponer recursos de la Ley 80 (como reposición contra adjudicación) en un proceso regido por el derecho privado (serán rechazados por improcedentes).',
    solucionBlindaje: 'Sujeción a los mecanismos de reclamación comercial del pliego y solución de controversias en tribunal de arbitramento de la Cámara de Comercio de Medellín.',
    items: [
      { id: 'ITM-TR-01', codigoUNSPSC: '39121002', descripcionUNSPSC: 'Transformador trifásico 75 kVA 13.200/214-123V', detalleTecnico: 'Enfriamiento ONAN, devanados en cobre, pérdidas reducidas norma NTC 3997', unidadMedida: 'UNIDAD', cantidad: 60, precioUnitarioEstimado: 32000000 },
      { id: 'ITM-TR-02', codigoUNSPSC: '39121002', descripcionUNSPSC: 'Transformador trifásico 112.5 kVA 13.200/214-123V', detalleTecnico: 'Aislamiento clase AO, tanque aleteado acero inoxidable para intemperie', unidadMedida: 'UNIDAD', cantidad: 40, precioUnitarioEstimado: 47000000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 36,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.4,
      nivelEndeudamientoMaximoPct: 65,
      coberturaInteresesMinima: 2.0,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 1200000000,
      numeroContratosAcreditar: 3,
      anosExperienciaMinima: 5
    }
  },

  // 6. Complejo Industrial Oil & Gas con SAP Ariba (Ecopetrol)
  {
    id: 'CASO-06-ARIBA-ECOPETROL-OLEODUCTO',
    categoria: 'COMPLEJO_INDUSTRIAL',
    titulo: 'SAP Ariba (Ecopetrol): Integridad Mecánica e Inspección Phased Array',
    descripcionBreve: 'Proceso de alta ingeniería petrolera en SAP Ariba Sourcing. Exigencias estrictas de HSE (RUC > 90%), estándares API y FCPA.',
    numeroProceso: 'REQ-ECP-2026-9921',
    entidadId: 'ENT-ECOPETROL',
    modalidad: 'PRIVADA_RFP',
    modalidadTexto: 'Concurso corporativo privado (SAP Ariba)',
    plataforma: 'SAP_ARIBA',
    plataformaTexto: 'SAP Ariba Sourcing',
    objeto: 'Servicios de inspección no destructiva por ultrasonido avanzado (Phased Array y TOFD), evaluación de corrosión y certificación de integridad mecánica para líneas de transporte de hidrocarburos.',
    justificacion: 'Prevenir incidentes ambientales de derrame y asegurar la confiabilidad operativa del transporte de crudo en la cuenca del Magdalena Medio.',
    presupuestoCOP: 14500000000,
    cdpNumero: 'CAPEX-ECP-4102',
    cdpFecha: '2026-08-15',
    plazoMeses: 12,
    plazoDias: 365,
    lugarEjecucion: 'Barrancabermeja y Cuenca Magdalena Medio',
    unspsc: '71151100',
    unspscTexto: 'Servicios de ensayos no destructivos (NDT) e integridad',
    publicada: '2026-09-28',
    cierre: '2026-11-15',
    enlace: 'https://service.ariba.com/discovery/ecopetrol/tenders/REQ-ECP-2026-9921',
    tags: ['SAP Ariba', 'Ecopetrol', 'Oil & Gas', 'HSE', 'Phased Array', 'RUC'],
    caracteristicasJuridicas: [
      'Sociedad de Economía Mixta regida por derecho privado (Art. 76 Ley 1118 de 2006)',
      'Gestión de proveedores 100% en plataforma SAP Ariba Sourcing',
      'Cumplimiento estricto del Código de Ética y Conducta Corporativa y normativa FCPA antisoborno',
      'Póliza de Responsabilidad Civil Extracontractual con amparo de contaminación súbita e imprevista'
    ],
    trampaOPeligroAuditado: 'Presentar inspectores sin certificación Level III ASNT o con calificación RUC en seguridad industrial inferior al 90%.',
    solucionBlindaje: 'Hoja de vida de inspectores certificados bajo ISO 9712 / ASNT SNT-TC-1A y plan de contingencia ambiental aprobado.',
    items: [
      { id: 'ITM-NDT-01', codigoUNSPSC: '71151101', descripcionUNSPSC: 'Inspección Phased Array y TOFD por kilómetro de tubería', detalleTecnico: 'Ultrasonido multielemento computarizado para detección de grietas en soldaduras', unidadMedida: 'KILOMETRO', cantidad: 85, precioUnitarioEstimado: 95000000 },
      { id: 'ITM-NDT-02', codigoUNSPSC: '71151105', descripcionUNSPSC: 'Análisis de aptitud para el servicio (Fitness For Service - API 579)', detalleTecnico: 'Modelación por elementos finitos de pérdida de espesor y cálculo de presión de falla', unidadMedida: 'INFORME', cantidad: 35, precioUnitarioEstimado: 183571420 }
    ],
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 48,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.6,
      nivelEndeudamientoMaximoPct: 60,
      coberturaInteresesMinima: 3.0,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 5000000000,
      numeroContratosAcreditar: 4,
      anosExperienciaMinima: 8
    }
  },

  // 7. Transición Energética FNCER - Gran Parque Solar Fotovoltaico 40 MWp (No Convencional)
  {
    id: 'CASO-07-FNCER-PARQUE-SOLAR-GUAJIRA',
    categoria: 'FNCER_SOLAR',
    titulo: 'Transición Energética: Parque Solar Fotovoltaico 40 MWp + BESS en La Guajira',
    descripcionBreve: 'Ingeniería, compras y construcción (EPC) con incentivos UPME (Ley 1715/2099), licenciamiento ANLA y consulta previa étnica.',
    numeroProceso: 'LP-FENOGE-FNCER-002-2026',
    entidadId: 'ENT-FENOGE',
    modalidad: 'LICITACION_PUBLICA',
    modalidadTexto: 'Licitación pública de transición energética',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Diseño detallado, suministro de equipos, obra civil, montaje electromecánico, interconexión a subestación de 115 kV y puesta en marcha comercial (EPC) de un Parque Solar Fotovoltaico de 40 MWp con sistema de almacenamiento de energía en baterías (BESS) de 10 MWh.',
    justificacion: 'Contribuir a la descarbonización de la matriz energética y abastecer de energía limpia a las Zonas No Interconectadas y municipios del norte de La Guajira.',
    presupuestoCOP: 68000000000,
    cdpNumero: 'CDP-FENOGE-2026-081',
    cdpFecha: '2026-07-20',
    plazoMeses: 18,
    plazoDias: 540,
    lugarEjecucion: 'Uribia y Maicao (La Guajira)',
    unspsc: '26111600',
    unspscTexto: 'Generación de energía solar y paneles fotovoltaicos',
    publicada: '2026-09-15',
    cierre: '2026-11-20',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.LP-FNCER-002-2026',
    tags: ['FNCER', 'Energía Solar', 'Ley 1715', 'Ley 2099', 'Baterías BESS', 'UPME', 'ANLA', 'Consulta Previa'],
    caracteristicasJuridicas: [
      'Marco de las Leyes 1715 de 2014 y 2099 de 2021 sobre Fuentes No Convencionales de Energía Renovable',
      'Incentivos tributarios: Exclusión de IVA, exención arancelaria para equipos fotovoltaicos y deducción especial de renta',
      'Licencia Ambiental expedida por la ANLA y protocolización de acuerdos de Consulta Previa con comunidades Wayúu',
      'Garantía de rendimiento energético (Performance Ratio > 82%) durante el primer año y degradación de paneles <= 0.5% anual'
    ],
    trampaOPeligroAuditado: 'Ofertar paneles sin certificación Tier 1 de BloombergNEF o cotizar asumiendo aranceles del 15% desconociendo el certificado UPME de exención aduanera.',
    solucionBlindaje: 'Alianza en Consorcio entre integrador tecnológico internacional (Tier 1) y firma colombiana de ingeniería eléctrica con RUP y experiencia local.',
    items: [
      { id: 'ITM-SOL-01', codigoUNSPSC: '26111607', descripcionUNSPSC: 'Módulos fotovoltaicos monocristalinos bifaciales TOPCon 600W+', detalleTecnico: 'Paneles solares bifaciales grado Tier 1 con certificación IEC 61215 e IEC 61730', unidadMedida: 'UNIDAD', cantidad: 67000, precioUnitarioEstimado: 550000 },
      { id: 'ITM-SOL-02', codigoUNSPSC: '26111604', descripcionUNSPSC: 'Inversores centrales de corriente continua a alterna 3.125 MVA', detalleTecnico: 'Inversor solar centralizado para intemperie IP65 con tecnología Grid Forming', unidadMedida: 'UNIDAD', cantidad: 12, precioUnitarioEstimado: 680000000 },
      { id: 'ITM-SOL-03', codigoUNSPSC: '26111700', descripcionUNSPSC: 'Sistema BESS de almacenamiento de baterías de litio-ferrofosfato (LFP)', detalleTecnico: 'Contenedorizado 10 MWh / 5 MW con sistema HVAC, extinción de incendios FM200 y BMS', unidadMedida: 'SISTEMA', cantidad: 2, precioUnitarioEstimado: 11495000000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: true,
      tiempoConstitucionMesesMinimo: 60,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.5,
      nivelEndeudamientoMaximoPct: 65,
      coberturaInteresesMinima: 2.5,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 15000000000,
      numeroContratosAcreditar: 2,
      anosExperienciaMinima: 5
    }
  },

  // 8. Megaproyecto APP (Asociación Público Privada) Corredor 5G (No Convencional)
  {
    id: 'CASO-08-APP-CONCESION-VIAL-5G',
    categoria: 'MEGAPROYECTO_APP',
    titulo: 'Megaproyecto APP: Concesión Vial y Túneles Corredor 5G (1,85 Billones)',
    descripcionBreve: 'Concesión de iniciativa pública bajo Ley 1508 de 2012 a 28 años. Retribución por disponibilidad de servicio y matriz de riesgos CONPES 3714.',
    numeroProceso: 'APP-ANI-001-2026',
    entidadId: 'ENT-ANI',
    modalidad: 'LICITACION_PUBLICA',
    modalidadTexto: 'Licitación pública de concesión (APP)',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II (Concesiones)',
    objeto: 'Otorgamiento de una concesión bajo el esquema de Asociación Público Privada (APP) de iniciativa pública para la financiación, estudios definitivos, gestión predial, ambiental y social, construcción, mejoramiento, rehabilitación, operación y mantenimiento del Corredor Vial de 142 kilómetros y 3 túneles.',
    justificacion: 'Conectar los centros de producción agroindustrial con los puertos marítimos del Caribe reduciendo los tiempos de viaje en un 45%.',
    presupuestoCOP: 1850000000000, // 1.85 billones COP
    cdpNumero: 'VIGENCIAS-FUTURAS-CONFIS-2026',
    cdpFecha: '2026-06-10',
    plazoMeses: 336, // 28 años
    plazoDias: 10220,
    lugarEjecucion: 'Santander y Cesar',
    unspsc: '72141100',
    unspscTexto: 'Construcción y concesión de autopistas y túneles',
    publicada: '2026-08-01',
    cierre: '2026-12-15',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.APP-ANI-001-2026',
    tags: ['APP', 'Ley 1508', 'Concesión 5G', 'Megaproyecto', 'Cierre Financiero', 'CONPES 3714', 'Patrimonio Autónomo'],
    caracteristicasJuridicas: [
      'Ley 1508 de 2012 y Título 2 Parte 2 Libro 2 del Decreto 1082 de 2015 sobre Asociaciones Público Privadas',
      'Retribución vinculada estrictamente a la disponibilidad del servicio y cumplimiento de indicadores de calidad (KPIs)',
      'Asignación y transferencia de riesgos geológicos, prediales y de demanda según CONPES 3714',
      'Constitución obligatoria de un Patrimonio Autónomo en fiduciaria de primer orden como vehículo receptor de capital y deuda',
      'Obligación de acreditación de Cierre Financiero formal ante la ANI dentro de los plazos contractuales'
    ],
    trampaOPeligroAuditado: 'Pretender recibir desembolsos públicos anticipados durante la etapa previa: en las APP la retribución sólo procede cuando las unidades funcionales están terminadas y en operación.',
    solucionBlindaje: 'Estructuración financiera con sindicato de banca multilateral y fondos de capital privado, y garantía bancaria irrevocable de cumplimiento.',
    items: [
      { id: 'ITM-APP-01', codigoUNSPSC: '72141103', descripcionUNSPSC: 'Unidad Funcional 1: Doble calzada 45 km', detalleTecnico: 'Construcción de calzada bidireccional en pavimento asfáltico modificado con polímeros', unidadMedida: 'KILOMETRO', cantidad: 45, precioUnitarioEstimado: 18500000000 },
      { id: 'ITM-APP-02', codigoUNSPSC: '72141108', descripcionUNSPSC: 'Unidad Funcional 2: Obras subterráneas y 3 túneles (5.2 km acumulados)', detalleTecnico: 'Excavación método NATM, revestimiento definitivo de concreto y sistema electromecánico SCADA', unidadMedida: 'KILOMETRO', cantidad: 5.2, precioUnitarioEstimado: 98000000000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: true,
      tiempoConstitucionMesesMinimo: 60,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.8,
      nivelEndeudamientoMaximoPct: 50,
      coberturaInteresesMinima: 3.5,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 200000000000,
      numeroContratosAcreditar: 4,
      anosExperienciaMinima: 10
    }
  },

  // 9. Convenio Interadministrativo - Control contra Triangulación (Ley 2195 de 2022)
  {
    id: 'CASO-09-INTERADMINISTRATIVO-CIBERSEGURIDAD',
    categoria: 'INTERADMINISTRATIVO_LEY2195',
    titulo: 'Interadministrativo: Centro de Ciberseguridad y Analítica IA',
    descripcionBreve: 'Contratación directa entre entidades públicas con auditoría del límite de subcontratación privada del 50% (Art. 50 Ley 2195/2022).',
    numeroProceso: 'CI-MINTIC-009-2026',
    entidadId: 'ENT-MINTIC',
    modalidad: 'CONTRATACION_DIRECTA',
    modalidadTexto: 'Contratación directa interadministrativa',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Aunar esfuerzos técnicos, administrativos y operativos entre el MinTIC y la Entidad Pública Ejecutora para implementar el Centro Nacional de Operaciones de Ciberseguridad (SOC) y analítica predictiva con IA.',
    justificacion: 'Blindar la infraestructura crítica nacional contra ciberataques de denegación de servicio y ransomware mediante cooperación interinstitucional estatal.',
    presupuestoCOP: 22000000000,
    cdpNumero: 'CDP-MINTIC-2026-112',
    cdpFecha: '2026-08-20',
    plazoMeses: 10,
    plazoDias: 300,
    lugarEjecucion: 'Bogotá D.C. y Red Nacional',
    unspsc: '81111800',
    unspscTexto: 'Servicios de seguridad informática y ciberseguridad',
    publicada: '2026-09-10',
    cierre: '2026-10-05',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.CI-MINTIC-009-2026',
    tags: ['Interadministrativo', 'Ley 2195', 'Anticorrupción', 'Triangulación', 'Ciberseguridad', 'IA'],
    caracteristicasJuridicas: [
      'Art. 2 num. 4 lit. c Ley 1150 de 2007: Contratos interadministrativos proceden si la entidad ejecutora tiene capacidad en su régimen',
      'Art. 50 Ley 2195 de 2022 (Estatuto Anticorrupción): Prohibición de eludir la licitación pública subcontratando más del 50% del valor del convenio con terceros privados',
      'La entidad ejecutora pública debe demostrar capacidad técnica real e infraestructura para desarrollar por sí misma el núcleo del objeto'
    ],
    trampaOPeligroAuditado: 'Triangulación contractual: Que la entidad pública receptora actúe como mera fachada y subcontrate el 85% del valor con empresas de ciberseguridad privadas cobrando una comisión de administración del 15% (delito de celebración indebida de contratos).',
    solucionBlindaje: 'Plan de ejecución detallado donde la entidad ejecutora asume con su propio personal y laboratorios al menos el 55% de la carga técnica operativa.',
    items: [
      { id: 'ITM-IA-01', codigoUNSPSC: '81111801', descripcionUNSPSC: 'Implementación del SOC con plataforma SIEM / SOAR en nube segura', detalleTecnico: 'Infraestructura de correlación de eventos en tiempo real con inteligencia de amenazas', unidadMedida: 'SISTEMA', cantidad: 1, precioUnitarioEstimado: 12500000000 },
      { id: 'ITM-IA-02', codigoUNSPSC: '81111805', descripcionUNSPSC: 'Servicios de análisis forense digital y respuesta a incidentes 24/7', detalleTecnico: 'Equipo de especialistas certificados CISSP / CEH para contención de ataques', unidadMedida: 'MES', cantidad: 10, precioUnitarioEstimado: 950000000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 24,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.2,
      nivelEndeudamientoMaximoPct: 70,
      coberturaInteresesMinima: 1.5,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 3000000000,
      numeroContratosAcreditar: 2,
      anosExperienciaMinima: 3
    }
  },

  // 10. Convenio de Asociación con ESAL (Decreto 092 de 2017)
  {
    id: 'CASO-10-CONVENIO-ESAL-ICBF-NUTRICION',
    categoria: 'ESAL_DECRETO092',
    titulo: 'Convenio ESAL (Decreto 092): Nutrición y Primera Infancia Rural',
    descripcionBreve: 'Asociación con entidad sin ánimo de lucro bajo Art. 355 CP. Exigencia irrestricta de aporte mínimo del 30% en dinero según Art. 5 Dcto 092/17.',
    numeroProceso: 'CAS-ICBF-004-2026',
    entidadId: 'ENT-ICBF',
    modalidad: 'REGIMEN_ESPECIAL',
    modalidadTexto: 'Convenio de asociación con ESAL (Decreto 092 de 2017)',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Aunar recursos y esfuerzos humanos, técnicos y financieros para ejecutar el programa de prevención de la desnutrición infantil y acompañamiento pedagógico a familias en zonas rurales dispersas.',
    justificacion: 'Fomentar la participación de la sociedad civil organizada en el desarrollo de programas de interés público contemplados en el Plan Nacional de Desarrollo.',
    presupuestoCOP: 3600000000, // Total convenio: Aporte ICBF $2.520 M + Aporte ESAL $1.080 M (30%)
    cdpNumero: 'CDP-ICBF-2026-904',
    cdpFecha: '2026-09-05',
    plazoMeses: 8,
    plazoDias: 240,
    lugarEjecucion: 'Uribia, Manaure y Maicao (La Guajira)',
    unspsc: '93141500',
    unspscTexto: 'Servicios de desarrollo social y nutrición comunitaria',
    publicada: '2026-09-25',
    cierre: '2026-10-18',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.CAS-ICBF-004-2026',
    tags: ['ESAL', 'Decreto 092 de 2017', 'Art. 355 CP', 'Aporte 30% en Dinero', 'Nutrición', 'ICBF'],
    caracteristicasJuridicas: [
      'Art. 355 de la Constitución Política y Decreto Reglamentario 092 de 2017',
      'Contratación directa de asociación solo es legal si la ESAL aporta al menos el 30% del valor total del proyecto EN DINERO (Art. 5)',
      'Si el aporte de la ESAL es inferior al 30% o es en especie, la entidad está OBLIGADA a convocar un proceso competitivo público (Art. 4 Decreto 092)',
      'Prohibición de subcontratar el núcleo del convenio con terceros lucrativos'
    ],
    trampaOPeligroAuditado: 'Intentar justificar el 30% con "aportes en especie" intangibles o voluntariado sobrevalorado para eludir el proceso competitivo de selección.',
    solucionBlindaje: 'Certificación bancaria de depósito de la contrapartida en cuenta fiduciaria y pólizas de garantía de manejo de anticipo y cumplimiento.',
    items: [
      { id: 'ITM-ES-01', codigoUNSPSC: '93141505', descripcionUNSPSC: 'Atención nutricional preventiva y suministro de complementos', detalleTecnico: 'Paquetes nutricionales balanceados y seguimiento antropométrico mensual', unidadMedida: 'FAMILIA', cantidad: 1200, precioUnitarioEstimado: 2100000 },
      { id: 'ITM-ES-02', codigoUNSPSC: '93141508', descripcionUNSPSC: 'Talleres pedagógicos de buenas prácticas de lactancia e higiene', detalleTecnico: 'Acompañamiento psicosocial con trabajadoras sociales bilingües wayuunaiki', unidadMedida: 'TALLER', cantidad: 180, precioUnitarioEstimado: 6000000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 24,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.1,
      nivelEndeudamientoMaximoPct: 70,
      coberturaInteresesMinima: 1.2,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 500000000,
      numeroContratosAcreditar: 2,
      anosExperienciaMinima: 3
    }
  },

  // 11. Convenio Solidario con Junta de Acción Comunal (JAC)
  {
    id: 'CASO-11-CONVENIO-SOLIDARIO-JAC-RIVERA',
    categoria: 'SOLIDARIO_JAC',
    titulo: 'Convenio Solidario JAC: Construcción de Placa Huella Comunitaria',
    descripcionBreve: 'Contratación comunitaria participativa bajo Ley 2166 de 2021 (Art. 95) y Decreto 142 de 2023. Exenta de RUP.',
    numeroProceso: 'CS-JAC-RIV-002-2026',
    entidadId: 'ENT-RIVERA',
    modalidad: 'REGIMEN_ESPECIAL',
    modalidadTexto: 'Convenio solidario comunal (Ley 2166 de 2021)',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Aunar recursos y mano de obra comunitaria para la construcción de 400 metros lineales de placa huella en el tramo crítico de acceso a la escuela rural de la vereda El Retiro.',
    justificacion: 'Fomentar la autogestión comunitaria y generar empleo local en sectores campesinos con bajos recursos de transporte.',
    presupuestoCOP: 160000000,
    cdpNumero: 'CDP-RIV-2026-045',
    cdpFecha: '2026-09-18',
    plazoMeses: 3,
    plazoDias: 90,
    lugarEjecucion: 'Rivera (Huila - Vereda El Retiro)',
    unspsc: '72141000',
    unspscTexto: 'Construcción y pavimentación de caminos rurales',
    publicada: '2026-10-08',
    cierre: '2026-10-25',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.CS-JAC-RIV-002-2026',
    tags: ['JAC', 'Comunal', 'Ley 2166', 'Decreto 142', 'Placa Huella', 'Sin RUP'],
    caracteristicasJuridicas: [
      'Art. 95 de la Ley 2166 de 2021 y Decreto 142 de 2023',
      'Permite celebrar convenios solidarios con Organismos de Acción Comunal hasta el tope de la menor cuantía municipal',
      'No exige Registro Único de Proponentes (RUP)',
      'Exige personería jurídica comunitaria vigente ante Secretaría de Gobierno, RUT y designación del representante comunal'
    ],
    trampaOPeligroAuditado: 'Superar el límite de menor cuantía de la entidad o utilizar la figura comunitaria para encubrir a un contratista privado convencional que no rinde cuentas.',
    solucionBlindaje: 'Conformación del Comité de Seguimiento y Veeduría Comunitaria y acompañamiento técnico del Secretario de Obras de la Alcaldía.',
    items: [
      { id: 'ITM-JAC-01', codigoUNSPSC: '72141004', descripcionUNSPSC: 'Materiales para placa huella (cemento, arena, gravilla, acero)', detalleTecnico: 'Suministro en sitio de obra de agregados y cemento estructural', unidadMedida: 'GLOBAL', cantidad: 1, precioUnitarioEstimado: 110000000 },
      { id: 'ITM-JAC-02', codigoUNSPSC: '72141008', descripcionUNSPSC: 'Mano de obra comunitaria calificada y no calificada', detalleTecnico: 'Cuadrilla comunitaria para fundición de placas, zanjas y cunetas', unidadMedida: 'GLOBAL', cantidad: 1, precioUnitarioEstimado: 50000000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 12,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: false,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.0,
      nivelEndeudamientoMaximoPct: 80,
      coberturaInteresesMinima: 1.0,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 15000000,
      numeroContratosAcreditar: 1,
      anosExperienciaMinima: 1
    }
  },

  // 12. Urgencia Manifiesta por Desastre Natural (Declaratoria de Calamidad)
  {
    id: 'CASO-12-URGENCIA-MANIFIESTA-UNGRD',
    categoria: 'URGENCIA_MANIFIESTA',
    titulo: 'Urgencia Manifiesta: Obras Geotécnicas de Emergencia por Ruptura de Jarillón',
    descripcionBreve: 'Contratación inmediata sin CDP previo (Art. 42 Ley 80/93). Control automático y posterior obligatorio ante la Contraloría General dentro de 3 días.',
    numeroProceso: 'URG-UNGRD-2026-03',
    entidadId: 'ENT-UNGRD',
    modalidad: 'CONTRATACION_DIRECTA',
    modalidadTexto: 'Contratación directa por urgencia manifiesta',
    plataforma: 'SECOP_II_ENTIDAD',
    plataformaTexto: 'SECOP II',
    objeto: 'Atención inmediata, suministro de bolsacreto, pedraplén y dragado hidráulico de emergencia para el cierre del boquete de ruptura del jarillón de contención del río Magdalena.',
    justificacion: 'Inminente desbordamiento sobre el casco urbano municipal con riesgo vital para más de 12.000 habitantes y afectación de 4.000 hectáreas productivas.',
    presupuestoCOP: 7400000000,
    cdpNumero: 'EXENTO_URGENCIA_ART42',
    cdpFecha: '2026-10-12',
    plazoMeses: 2,
    plazoDias: 60,
    lugarEjecucion: 'Magangué (Bolívar)',
    unspsc: '72141500',
    unspscTexto: 'Servicios de dragado y obras geotécnicas fluviales',
    publicada: '2026-10-12',
    cierre: '2026-10-13',
    enlace: 'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.URG-UNGRD-2026-03',
    tags: ['Urgencia Manifiesta', 'Ley 80 Art. 42', 'Sin CDP Previo', 'Control Contraloría', 'Calamidad Pública'],
    caracteristicasJuridicas: [
      'Art. 42 y 43 de la Ley 80 de 1993: Declaratoria formal de Urgencia Manifiesta mediante acto motivado',
      'Excepción legal de contratación inmediata que prescinde de estudios previos completos y del CDP previo',
      'Los traslados presupuestales e incorporación deben tramitarse simultáneamente con la ejecución',
      'Control de legalidad obligatorio: El expediente completo debe remitirse a la Contraloría General de la República dentro de los 3 días hábiles siguientes a la suscripción'
    ],
    trampaOPeligroAuditado: 'Omitir el envío del expediente a la Contraloría dentro de los 3 días o contratar objetos previsibles o diferibles que no obedezcan a la inminencia del desastre (delito de contrato sin cumplimiento de requisitos legales).',
    solucionBlindaje: 'Acto motivado de calamidad pública con soporte técnico del Consejo Municipal de Gestión del Riesgo y remisión formal inmediata al órgano de control.',
    items: [
      { id: 'ITM-URG-01', codigoUNSPSC: '72141505', descripcionUNSPSC: 'Bolsacretos de 3 toneladas y colocación con grúa sobre pontón', detalleTecnico: 'Celdas geotextiles de alta resistencia para control de socavación ribereña', unidadMedida: 'UNIDAD', cantidad: 1400, precioUnitarioEstimado: 3200000 },
      { id: 'ITM-URG-02', codigoUNSPSC: '72141501', descripcionUNSPSC: 'Dragado de descolmatación con draga de succión y tubería flotante', detalleTecnico: 'Remoción de sedimentos para reconducir el canal principal del río', unidadMedida: 'METRO_CUBICO', cantidad: 65000, precioUnitarioEstimado: 45000 }
    ],
    requisitosHabilitantes: {
      exigeRUP: false,
      tiempoConstitucionMesesMinimo: 12,
      objetoSocialAcorde: true,
      pazYSalvoParafiscales: true,
      antecedentesDisciplinariosJudiciales: true,
      indiceLiquidezMinimo: 1.0,
      nivelEndeudamientoMaximoPct: 80,
      coberturaInteresesMinima: 1.0,
      rentabilidadPatrimonioMinimaPct: 5, rentabilidadActivoMinimaPct: 3, codigosUNSPSCExigidos: [], sumatoriaSMMLVMinima: 100,
      capitalTrabajoMinimoCOP: 1500000000,
      numeroContratosAcreditar: 2,
      anosExperienciaMinima: 3
    }
  }
];

/** Convierte un Caso Simulado Maestro en el formato Oportunidad (para el Buscador de Oportunidades y la ruta Vendo) */
export function casoAOportunidad(c: CasoSimuladoMaestro): Oportunidad {
  const entidad = ENTIDADES_DEMO.find((e) => e.id === c.entidadId);
  return {
    id: c.id,
    plataforma: c.plataformaTexto,
    entidad: entidad?.nombre || c.entidadId,
    objeto: c.objeto,
    referencia: c.numeroProceso,
    codigo: `V1.${c.unspsc}`,
    valor: c.presupuestoCOP,
    modalidad: c.modalidadTexto,
    departamento: entidad?.departamento || 'Nacional',
    publicada: c.publicada,
    cierre: c.cierre,
    fase: 'Presentación de ofertas',
    enlace: c.enlace,
    origen: 'MANUAL'
  };
}

/** Convierte un Caso Simulado Maestro en ProcesoContratacion para el store global */
export function casoAProcesoContratacion(c: CasoSimuladoMaestro): ProcesoContratacion {
  const entidad = ENTIDADES_DEMO.find((e) => e.id === c.entidadId) || ENTIDADES_DEMO[0];
  return {
    id: c.id,
    numeroProceso: c.numeroProceso,
    plataformaOrigen: c.plataforma,
    entidad,
    modalidad: c.modalidad,
    objeto: c.objeto,
    justificacion: c.justificacion,
    presupuestoOficial: c.presupuestoCOP,
    cdpNumero: c.cdpNumero,
    cdpFecha: c.cdpFecha,
    plazoMeses: c.plazoMeses,
    plazoDias: c.plazoDias,
    lugarEjecucion: c.lugarEjecucion,
    estado: 'PRESENTACION_OFERTAS',
    cronograma: {
      publicacionBorrador: c.publicada,
      observacionesBorradorLimite: c.publicada,
      publicacionDefinitivo: c.publicada,
      presentacionOfertasLimite: `${c.cierre} 10:00 AM`,
      aperturaSobres: `${c.cierre} 10:30 AM`,
      publicacionInformeEvaluacion: c.cierre,
      trasladoInformeLimite: c.cierre,
      audienciaAdjudicacion: c.cierre,
      firmaContrato: c.cierre
    },
    items: c.items,
    riesgos: [],
    requisitosHabilitantes: c.requisitosHabilitantes,
    criteriosPonderacion: {
      puntajeEconomico: 60,
      puntajeTecnicoCalidad: 20,
      puntajeIndustriaNacional: 10,
      puntajeDiscapacidad: 1,
      puntajeMiPyme: 5
    },
    observacionesCiudadanas: [],
    ofertasPresentadas: []
  };
}
