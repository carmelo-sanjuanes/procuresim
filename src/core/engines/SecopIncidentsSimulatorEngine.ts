// Motor Simulador de Eventos Críticos, Incidentes y Rarezas Procesales en SECOP II
// Conforme a la Ley 80/1993, Ley 1150/2007, Ley 1882/2018, Ley 2069/2020, Decreto 1082/2015,
// Circulares de Colombia Compra Eficiente y la Superintendencia de Industria y Comercio (SIC).

export type TipoIncidenteSecop =
  | 'FLUJO_LIMPIO_ORDINARIO'
  | 'CAIDA_PLATAFORMA_INDISPONIBILIDAD'
  | 'PRECIO_ARTIFICIALMENTE_BAJO'
  | 'POLIZA_EXTEMPORANEA_LEY_1882'
  | 'COLUSION_MISMA_IP_METADATOS'
  | 'EMPATE_CASCADA_LEY_2069'
  | 'TUTELA_MEDIDA_CAUTELAR_SUSPENSION'
  | 'INHABILIDAD_SOBREVINIENTE_SIBOR'
  | 'PROPONENTE_UNICO_HABILITADO';

export interface IncidenteSecopDetalle {
  id: TipoIncidenteSecop;
  tituloHumano: string;
  etapaOcurrencia: 'CIERRE_OFERTAS' | 'EVALUACION' | 'TRASLADO' | 'AUDIENCIA_ADJUDICACION';
  icono: string;
  resumenHecho: string;
  dilemaServidor: string;
  errorComunFatal: string;
  protocoloLegalCorrecto: string;
  normativaYJurisprudencia: string;
  consecuenciaProcesal: string;
}

export class SecopIncidentsSimulatorEngine {
  public static readonly CATALOGO_INCIDENTES: Record<TipoIncidenteSecop, IncidenteSecopDetalle> = {
    FLUJO_LIMPIO_ORDINARIO: {
      id: 'FLUJO_LIMPIO_ORDINARIO',
      tituloHumano: '1. Proceso Ordinario Limpio (Flujo Ideal)',
      etapaOcurrencia: 'AUDIENCIA_ADJUDICACION',
      icono: '✨',
      resumenHecho: 'El proceso transcurre sin caídas de plataforma, sin reclamaciones temerarias y con pluralidad de oferentes habilitados.',
      dilemaServidor: 'Verificar minuciosamente la matriz de evaluación y adjudicar a la mejor propuesta objetiva.',
      errorComunFatal: 'Creer que siempre habrá controversia y dilatar innecesariamente la adjudicación.',
      protocoloLegalCorrecto: 'Expedir el informe definitivo, correr traslado legal y emitir resolución motivada de adjudicación.',
      normativaYJurisprudencia: 'Art. 2 Ley 1150 de 2007 • Principio de Selección Objetiva Art. 29 Ley 80 de 1993.',
      consecuenciaProcesal: 'Adjudicación exitosa y paso a Registro Presupuestal (RP) y firma electrónica.'
    },

    CAIDA_PLATAFORMA_INDISPONIBILIDAD: {
      id: 'CAIDA_PLATAFORMA_INDISPONIBILIDAD',
      tituloHumano: '2. Caída de SECOP II en Cierre (Protocolo de Indisponibilidad)',
      etapaOcurrencia: 'CIERRE_OFERTAS',
      icono: '⚡',
      resumenHecho: 'A las 09:42 AM (el cierre es a las 10:00 AM), el servidor de SECOP II colapsa arrojando Error 500 y timeout a los oferentes.',
      dilemaServidor: '¿Cierro el proceso con la única oferta que subió temprano o recibo las demás por correo?',
      errorComunFatal: 'Cerrar el proceso ignorando las quejas de los proponentes, generando nulidad absoluta por violar la libre concurrencia.',
      protocoloLegalCorrecto: 'Validar si la falla ocurrió en las 4 horas previas. Exigir radicado de Mesa de Ayuda de CCE y correo previo al cierre. Esperar Certificado de Indisponibilidad de CCE y permitir radicación por correo dentro de las 48 horas siguientes.',
      normativaYJurisprudencia: 'Protocolo Oficial de Indisponibilidad de Colombia Compra Eficiente • Circulares Externas SECOP II.',
      consecuenciaProcesal: 'Recepción subsidiaria por correo electrónico oficial y prórroga reglada del cronograma.'
    },

    PRECIO_ARTIFICIALMENTE_BAJO: {
      id: 'PRECIO_ARTIFICIALMENTE_BAJO',
      tituloHumano: '3. Alerta de Precio Artificialmente Bajo (-55%)',
      etapaOcurrencia: 'EVALUACION',
      icono: '📉',
      resumenHecho: 'Con presupuesto de $420M, un proponente oferta $190M. El comité evaluador sospecha que no podrá ejecutar o dejará la obra botada.',
      dilemaServidor: '¿Lo rechazo de inmediato por ser muy barato o tengo que aceptarlo porque es la oferta más económica?',
      errorComunFatal: 'Rechazarlo automáticamente sin requerimiento previo. CCE y el Consejo de Estado prohíben el rechazo automático.',
      protocoloLegalCorrecto: 'Emitir requerimiento formal por escrito pidiendo justificación de APU y estructura de costos. Si demuestra que cubre salarios mínimos legales, insumos y fletes, se valida. Si no sustenta o no cubre costos de ley, se rechaza motivadamente.',
      normativaYJurisprudencia: 'Art. 2.2.1.1.2.2.4 Decreto 1082 de 2015 • Guía de Precios Artificialmente Bajos CCE.',
      consecuenciaProcesal: 'Requerimiento contradictorio obligatorio antes de cualquier decisión de descalificación.'
    },

    POLIZA_EXTEMPORANEA_LEY_1882: {
      id: 'POLIZA_EXTEMPORANEA_LEY_1882',
      tituloHumano: '4. Póliza Fechada Después del Cierre (Trampa de Subsanabilidad)',
      etapaOcurrencia: 'TRASLADO',
      icono: '🛑',
      resumenHecho: 'El cierre fue a las 10:00 AM. El oferente adjuntó recibo de pago o carátula de póliza expedida por la aseguradora a las 11:30 AM.',
      dilemaServidor: 'El contratista argumenta que la Ley 1882 permite subsanar requisitos que no dan puntaje y que la póliza solo habilita.',
      errorComunFatal: 'Aceptar la póliza con fecha posterior creyendo que es subsanable, violando la prohibición legal expresa.',
      protocoloLegalCorrecto: 'La Ley 1882 prohíbe acreditar circunstancias posteriores al cierre y consagra expresamente que la no entrega de la póliza junto con la oferta no es subsanable. RECHAZO AUTOMÁTICO.',
      normativaYJurisprudencia: 'Artículo 5 Ley 1882 de 2018 • Sentencias de Unificación Consejo de Estado Sección Tercera.',
      consecuenciaProcesal: 'Rechazo definitivo de la propuesta sin posibilidad de subsanación.'
    },

    COLUSION_MISMA_IP_METADATOS: {
      id: 'COLUSION_MISMA_IP_METADATOS',
      tituloHumano: '5. Indicios Graves de Colusión y Cartelización Digital',
      etapaOcurrencia: 'EVALUACION',
      icono: '🕵️',
      resumenHecho: 'Dos consorcios supuestamente competidores radicaron en SECOP II desde la misma IP pública y sus PDFs tienen los mismos metadatos y faltas ortográficas.',
      dilemaServidor: '¿Finjo que no me di cuenta porque no soy juez penal o tomo acciones en el proceso?',
      errorComunFatal: 'Adjudicar al consorcio colusorio configurando posible complicidad en el delito de colusión en contratación.',
      protocoloLegalCorrecto: 'Evaluar la pérdida de independencia y pluralidad de oferentes para rechazar las ofertas colusorias. Compulsa de copias inmediata con trazabilidad digital a la Superintendencia de Industria y Comercio (SIC) y Fiscalía General de la Nación.',
      normativaYJurisprudencia: 'Art. 410A Código Penal • Art. 47 num. 9 Decreto 2153 de 1992 • Guía SIC de Licitaciones Colusorias.',
      consecuenciaProcesal: 'Rechazo por violación a la selección objetiva y apertura de investigación sancionatoria en la SIC.'
    },

    EMPATE_CASCADA_LEY_2069: {
      id: 'EMPATE_CASCADA_LEY_2069',
      tituloHumano: '6. Empate Técnico Absoluto a 100 Puntos (Cascada Ley 2069)',
      etapaOcurrencia: 'AUDIENCIA_ADJUDICACION',
      icono: '🎯',
      resumenHecho: 'Dos proponentes obtienen 100.00 puntos matemáticos perfectos. Ambos reclaman ser los adjudicatarios legítimos.',
      dilemaServidor: '¿Tiro una moneda al aire o adjudico al que radicó primero?',
      errorComunFatal: 'Hacer un sorteo de inmediato sin agotar los criterios obligatorios de desempate fijados por el Congreso.',
      protocoloLegalCorrecto: 'Aplicar la cascada del Art. 35 Ley 2069: 1. Bienes nacionales, 2. Mipyme, 3. Mujeres, 4. Empleo a personas con discapacidad (Dcto 392), 5. Sociedad BIC. Si persiste el empate tras el paso 7, sorteo por balotas en audiencia pública.',
      normativaYJurisprudencia: 'Artículo 35 Ley 2069 de 2020 • Decreto 1860 de 2021 • Decreto 392 de 2018.',
      consecuenciaProcesal: 'Desempate reglado por preferencia legal, evitando demandas de nulidad del proponente no favorecido.'
    },

    TUTELA_MEDIDA_CAUTELAR_SUSPENSION: {
      id: 'TUTELA_MEDIDA_CAUTELAR_SUSPENSION',
      tituloHumano: '7. Medida Cautelar de Tutela 15 Minutos antes de Adjudicar',
      etapaOcurrencia: 'AUDIENCIA_ADJUDICACION',
      icono: '⚖️',
      resumenHecho: 'A las 09:45 AM, un juzgado notifica auto admisorio de tutela de un oferente descalificado ordenando la suspensión preventiva del proceso.',
      dilemaServidor: '¿Adjudico rápido antes de que se enteren o acato la orden del juez y congelo el proceso?',
      errorComunFatal: 'Adjudicar ignorando la medida cautelar. Incurre en Fraude a Resolución Judicial (Art. 454 C.P.) y arresto por desacato.',
      protocoloLegalCorrecto: 'Suspender inmediatamente la audiencia en el estado en que se encuentre. Levantar acta en SECOP II y remitir informe al juzgado rindiendo descargos sobre la legalidad de la evaluación.',
      normativaYJurisprudencia: 'Decreto 2591 de 1991 • Artículo 454 Código Penal (Fraude a Resolución Judicial).',
      consecuenciaProcesal: 'Suspensión procesal obligatoria hasta que el juez constitucional falle o levante la medida cautelar.'
    },

    INHABILIDAD_SOBREVINIENTE_SIBOR: {
      id: 'INHABILIDAD_SOBREVINIENTE_SIBOR',
      tituloHumano: '8. Inhabilidad Sobreviniente en SIBOR de Contraloría',
      etapaOcurrencia: 'AUDIENCIA_ADJUDICACION',
      icono: '🚫',
      resumenHecho: 'El oferente 1° en orden de elegibilidad amaneció reportado con fallo de responsabilidad fiscal en el Boletín de la Contraloría (SIBOR).',
      dilemaServidor: '¿Le adjudico porque cuando cerró el proceso no estaba inhabilitado o tengo que rechazarlo?',
      errorComunFatal: 'Adjudicar argumentando que el reporte fue posterior al cierre. El contrato estatal no puede celebrarse con inhabilitados.',
      protocoloLegalCorrecto: 'Verificar la firmeza del reporte en el SIBOR. Descartar al inhabilitado por imposibilidad legal sobreviniente y adjudicar al segundo calificado en el orden de elegibilidad.',
      normativaYJurisprudencia: 'Artículos 8 y 9 Ley 80 de 1993 • Ley 610 de 2000 (Responsabilidad Fiscal).',
      consecuenciaProcesal: 'Paso al segundo elegible y notificación formal de la inhabilidad sobreviniente.'
    },

    PROPONENTE_UNICO_HABILITADO: {
      id: 'PROPONENTE_UNICO_HABILITADO',
      tituloHumano: '9. Proponente Único Habilitado (Temor a Declarar Desierta)',
      etapaOcurrencia: 'AUDIENCIA_ADJUDICACION',
      icono: '👤',
      resumenHecho: 'Solo un proponente presentó oferta o solo uno resultó habilitado tras el informe de evaluación.',
      dilemaServidor: '¿Declaro desierto el proceso por falta de pluralidad o puedo adjudicarle válidamente?',
      errorComunFatal: 'Declarar desierta la licitación por el simple hecho de haber un solo oferente. Esto genera demanda por lucro cesante y daño patrimonial.',
      protocoloLegalCorrecto: 'La Ley 1150 permite expresamente adjudicar a la oferta única si esta cumple plenamente los pliegos de condiciones y el presupuesto oficial. No se requiere pluralidad mínima para adjudicar.',
      normativaYJurisprudencia: 'Artículo 2 numeral 1 Ley 1150 de 2007 • Jurisprudencia reiterada Consejo de Estado.',
      consecuenciaProcesal: 'Adjudicación legítima y vinculante al único oferente calificado.'
    }
  };

  /**
   * Retorna la lista de todos los incidentes simulables
   */
  public static listarIncidentes(): IncidenteSecopDetalle[] {
    return Object.values(this.CATALOGO_INCIDENTES);
  }

  /**
   * Obtiene el detalle de un incidente específico
   */
  public static obtenerIncidente(id: TipoIncidenteSecop): IncidenteSecopDetalle {
    return this.CATALOGO_INCIDENTES[id] || this.CATALOGO_INCIDENTES.FLUJO_LIMPIO_ORDINARIO;
  }
}
