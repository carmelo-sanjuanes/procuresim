// Motor de Consejos Estratégicos y Tácticas de Contratación Pública Colombiana
// Genera combinaciones cuasi-aleatorias, contextuales y de alto impacto formativo
// Fundamentado en: Ley 80/1993, Ley 1150/2007, Ley 1882/2018, Ley 2069/2020, Pliegos Tipo CCE y Consejo de Estado

export interface ConsejoEstrategico {
  id: string;
  categoria:
    | 'FORMULAS_Y_TRM'
    | 'HABILITACION_FINANCIERA'
    | 'DEFENSA_JURIDICA'
    | 'CONSORCIOS_Y_ALIANZAS'
    | 'TACTICA_LICITATORIA'
    | 'PRECIOS_Y_AIU';
  titulo: string;
  fundamentoLegal: string;
  resumen: string;
  estrategiaAplicada: string;
  icono: string;
}

export class StrategicTipsEngine {
  public static CONSEJOS: ConsejoEstrategico[] = [
    {
      id: 'TIP-01',
      categoria: 'FORMULAS_Y_TRM',
      titulo: 'El Efecto Fin de Semana en la TRM y el Sorteo de Fórmulas CCE',
      fundamentoLegal: 'Pliegos Tipo CCE & Circular Externa Superfinanciera',
      resumen:
        'Si la audiencia pública se celebra en lunes o posterior a un día festivo, la TRM de la Superfinanciera permanece fija desde el cierre del viernes previo.',
      estrategiaAplicada:
        'Al conocer los decimales fijos de la TRM con 72 horas de antelación, puedes calcular con certeza matemática del 100% cuál de las 6 fórmulas CCE aplicará (ej. Media Geométrica o Ponderada) antes de que la Entidad inicie la audiencia, permitiéndote simular los puntajes exactos del orden de mérito.',
      icono: 'TrendingUp'
    },
    {
      id: 'TIP-02',
      categoria: 'DEFENSA_JURIDICA',
      titulo: 'La Regla de Oro de la Subsanabilidad Estricta (Ley 1882 Art. 5)',
      fundamentoLegal: 'Artículo 5 de la Ley 1882 de 2018 (modifica Ley 1150 Art. 5)',
      resumen:
        'Ninguna entidad pública puede rechazar de plano una oferta por la omisión de documentos que no otorguen puntaje.',
      estrategiaAplicada:
        'Los certificados de experiencia, paz y salvos, balances o cédulas nacidos antes del cierre pero no aportados pueden allegarse válidamente durante el traslado del informe de evaluación. Si la Entidad te descalifica sin previo requerimiento, la decisión es nula por vulneración del debido proceso.',
      icono: 'Scale'
    },
    {
      id: 'TIP-03',
      categoria: 'PRECIOS_Y_AIU',
      titulo: 'Optimización Tributaria del AIU en Servicios Integrales',
      fundamentoLegal: 'Artículo 462-1 del Estatuto Tributario y Ley 1607 de 2012',
      resumen:
        'En contratos de servicios integrales de aseo, cafetería, vigilancia o temporales, la base gravable especial del IVA se aplica únicamente sobre la Utilidad (U).',
      estrategiaAplicada:
        'Estructurar una oferta discriminando A (Administración 8%), I (Imprevistos 2%) y U (Utilidad 5%) permite liquidar el IVA al 19% solo sobre el 5% de Utilidad, reduciendo el precio final ofertado hasta en un 15% frente a competidores que liquiden IVA general sobre el total.',
      icono: 'Coins'
    },
    {
      id: 'TIP-04',
      categoria: 'CONSORCIOS_Y_ALIANZAS',
      titulo: 'Blindaje de Responsabilidad Sancionatoria en Uniones Temporales',
      fundamentoLegal: 'Artículo 7 Parágrafo 2° de la Ley 80 de 1993',
      resumen:
        'A diferencia del Consorcio (donde la responsabilidad es solidaria e ilimitada en todo), en la Unión Temporal las sanciones se individualizan por obligaciones asumidas.',
      estrategiaAplicada:
        'Si un socio aporta el capital o la experiencia financiera pero no la operación técnica en campo, debe especificar en el documento de constitución que su actividad es exclusivamente administrativa. Así, ante un atraso de obra, la multa o caducidad no afectará su RUP con inhabilidad general.',
      icono: 'ShieldCheck'
    },
    {
      id: 'TIP-05',
      categoria: 'TACTICA_LICITATORIA',
      titulo: 'Defensa Inmediata ante Sospecha de Precio Artificialmente Bajo',
      fundamentoLegal: 'Artículo 2.2.1.1.2.2.4 del Decreto 1082 de 2015',
      resumen:
        'Si tu oferta queda por debajo del 80% del presupuesto o a más de dos desviaciones estándar de la media, la entidad no puede rechazarla de forma inmediata.',
      estrategiaAplicada:
        'Prepara de antemano un Análisis de Precios Unitarios (APU) desglosado con cartas de cotización firme de fabricantes mayoristas o economías de escala. La Entidad está obligada a requerirte para que expliques tus costos antes de resolver.',
      icono: 'AlertTriangle'
    },
    {
      id: 'TIP-06',
      categoria: 'HABILITACION_FINANCIERA',
      titulo: 'Acreditación del K-Residual de Obra sin Contratos Activos Diluidos',
      fundamentoLegal: 'Artículo 72 Ley 1682 de 2013 y Decreto 1082 de 2015',
      resumen:
        'El Saldo de Contratos en Ejecución (SCE) resta directamente de la Capacidad Residual del proponente en obra pública.',
      estrategiaAplicada:
        'Si tienes contratos terminados pendientes de acta de liquidación formal, solicita al contratante una certificación de ejecución al 100% o acta de recibo a satisfacción. Con este documento, el valor de ese contrato deja de restar en la fórmula de K-Residual.',
      icono: 'Building2'
    },
    {
      id: 'TIP-07',
      categoria: 'TACTICA_LICITATORIA',
      titulo: 'El Factor de Desempate Decisivo de la Ley 2069 (MiPyme vs. Consorcios)',
      fundamentoLegal: 'Artículo 35 de la Ley 2069 de 2020',
      resumen:
        'En caso de empate en el puntaje total definitivo (100 pts), la ley establece un estricto orden de prelación afirmativo.',
      estrategiaAplicada:
        'Una empresa nacional clasificada como Micro o Pequeña (ej. Sanjuanes Soluciones) o que certifique personal con discapacidad (Dcto 392) o mujeres (Dcto 1860) derrota legalmente en el primer orden a grandes corporaciones o consorcios multinacionales sin tener que someterse al azar de balotas.',
      icono: 'Award'
    },
    {
      id: 'TIP-08',
      categoria: 'FORMULAS_Y_TRM',
      titulo: 'Estrategia en Media Geométrica: Cómo Mitigar Ofertas Extremas',
      fundamentoLegal: 'Guía de Selección de Fórmulas de Calificación CCE',
      resumen:
        'La Media Geométrica mitiga el impacto de los valores extremos en comparación con la media aritmética simple.',
      estrategiaAplicada:
        'Al calcular el producto enésimo (∏ V_i)^(1/N), si anticipas que habrá una oferta temeraria muy baja, la media geométrica se moverá menos hacia abajo que la media simple. Tu oferta ideal debe situarse cerca del 91% al 94% del Presupuesto Oficial para maximizar puntaje.',
      icono: 'Calculator'
    },
    {
      id: 'TIP-09',
      categoria: 'DEFENSA_JURIDICA',
      titulo: 'Impugnación de Pliegos Sastre y Requisitos Desproporcionados',
      fundamentoLegal: 'Artículo 24 Numeral 5° Ley 80 de 1993 & Consejo de Estado',
      resumen:
        'Exigir índices de liquidez superiores a 2.5 o experiencias en códigos UNSPSC que no guarden relación directa con el objeto contractual vulnera el principio de selección objetiva.',
      estrategiaAplicada:
        'Radica la observación en la etapa de proyecto de pliego citando el estudio de mercado del sector. Si la entidad no lo modifica, presenta una acción de tutela preventiva o queja ante la Procuraduría Delegada para la Vigilancia Preventiva de la Función Pública.',
      icono: 'FileText'
    },
    {
      id: 'TIP-10',
      categoria: 'HABILITACION_FINANCIERA',
      titulo: 'Aprovechamiento de la Experiencia en RUP de Sociedades Absorbidas',
      fundamentoLegal: 'Circular Única de la Superintendencia de Sociedades y CCE',
      resumen:
        'En procesos de fusión o absorción empresarial, la absorbente hereda el 100% de los contratos ejecutados y la experiencia RUP acumulada.',
      estrategiaAplicada:
        'Empresas emergentes pueden adquirir o absorber personas jurídicas inactivas con contratos UNSPSC históricos certificados para multiplicar su capacidad en SMMLV en el RUP sin esperar los años tradicionales de maduración de la empresa.',
      icono: 'Layers'
    }
  ];

  /**
   * Obtiene un consejo aleatorio o el siguiente en la secuencia
   */
  public static obtenerConsejoAleatorio(): ConsejoEstrategico {
    const idx = Math.floor(Math.random() * this.CONSEJOS.length);
    return this.CONSEJOS[idx];
  }

  /**
   * Obtiene una combinación cuasi-aleatoria de N consejos pertinentes
   */
  public static obtenerCombinacionConsejos(cantidad: number = 2): ConsejoEstrategico[] {
    const barajados = [...this.CONSEJOS].sort(() => 0.5 - Math.random());
    return barajados.slice(0, Math.min(cantidad, barajados.length));
  }

  /**
   * Obtiene un consejo por índice cíclico
   */
  public static obtenerConsejoPorIndice(indice: number): ConsejoEstrategico {
    const pos = Math.abs(indice) % this.CONSEJOS.length;
    return this.CONSEJOS[pos];
  }
}
