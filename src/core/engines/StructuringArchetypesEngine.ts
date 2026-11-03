// Motor de Arquetipos y Precedentes de Estructuración - ProcureSim v2.0
// Fundamentado en Case-Based Reasoning (CBR) y Reducción de Carga Administrativa (Herd & Moynihan)
// Reemplaza el "Tribunal Adversarial" por "La Mirada Preventiva y Elección Soberana"

export type FamiliaArquetipo =
  | 'ORDINARIO_Y_RESIDUAL'
  | 'RELACIONES_INTERADMINISTRATIVAS'
  | 'BASE_SOCIAL_Y_ECONOMIA_POPULAR'
  | 'GESTION_PATRIMONIAL_Y_BIENES'
  | 'FONDOS_CALAMIDAD_Y_RESERVA';

export type TipoSituacionInicial =
  // Arquetipos Ordinarios y de Rescate
  | 'NUEVO_ORDINARIO'
  | 'NUEVO_SIN_CDP'
  | 'RESCATE_DESIERTO'
  | 'RESCATE_HUERFANO'
  | 'MANUAL_PROPIO_ESP_ESE'
  | 'URGENCIA_MANIFIESTA'
  | 'PLIEGO_TIPO_VIAS'
  | 'MINIMA_CUANTIA_EXPRES'
  | 'CONSULTORIA_MERITOS'
  | 'CATALOGO_TVEC'
  | 'LIMITACION_MIPYMES'
  | 'PROVEEDOR_EXCLUSIVO'
  // Familia I: Relaciones Interadministrativas
  | 'CONVENIO_INTERADMINISTRATIVO'
  | 'CONTRATO_INTERADMINISTRATIVO_SERVICIO'
  // Familia II: Base Social, Fundaciones y Economía Popular
  | 'CONVENIO_ASOCIACION_ESAL_30'
  | 'CONVOCATORIA_COMPETITIVA_ESAL'
  | 'CONVENIO_SOLIDARIO_COMUNAL_JAC'
  // Familia III: Gestión Patrimonial, Inmuebles y Bienes Fiscales
  | 'DONACION_ACEPTACION_BIENES'
  | 'ARRENDAMIENTO_INMUEBLE_ENTIDAD'
  | 'COMODATO_PRESTAMO_USO'
  | 'ENAJENACION_SUBASTA_BIENES_FISCALES'
  // Familia IV: Fondos Fiduciarios, Calamidad y Régimen Reservado
  | 'GASTOS_RESERVADOS_DEFENSA'
  | 'ENCARGO_FIDUCIARIO_ADMINISTRACION';

export interface CuidadoBlindaje {
  ambito: 'Cuidado Fiscal (Contraloría)' | 'Cuidado con Proponentes (Reglas Abiertas)' | 'Cuidado Operativo (En Territorio)';
  titulo: string;
  explicacion: string;
  recomendacion: string;
}

export interface RutaJuridica {
  id: string;
  titulo: string;
  modalidad: string;
  fundamento: string;
  esRecomendada: boolean;
  resumen: string;
  porQueConviene: string;
  cuidadosBlindaje: CuidadoBlindaje[];
  clausulasBlindaje: string[];
}

export interface ArquetipoEstructuracion {
  id: TipoSituacionInicial;
  familia?: FamiliaArquetipo;
  tituloHumano: string;
  nudoGordiano: string;
  descripcionEmpatica: string;
  icono: string;
  fundamentoNormativo?: string;
  controlesEmergentes: {
    mostrarCosteoSinCdp?: boolean;
    mostrarDiagnosticoDesierto?: boolean;
    mostrarCargaBorradorHuerfano?: boolean;
    mostrarAlertaCalamidad?: boolean;
    mostrarVerificacionLey2195?: boolean;
    mostrarBalanceAporteEsal?: boolean;
    mostrarVerificacionSarlaftPredial?: boolean;
    mostrarAutoReconocimientoComunal?: boolean;
    recordatorioEsquina?: string;
  };
  rutasJuridicas: RutaJuridica[];
}

// Catálogo de Arquetipos Maestros (CBR Seed)
export const ARQUETIPOS_ESTRUCTURACION: Record<TipoSituacionInicial, ArquetipoEstructuracion> = {
  NUEVO_ORDINARIO: {
    id: 'NUEVO_ORDINARIO',
    tituloHumano: 'Estructurar un proceso nuevo ordinario',
    nudoGordiano: 'Definir el objeto y la modalidad correcta sin sesgos',
    descripcionEmpatica: 'Tienes una necesidad nueva y cuentas con disponibilidad o vas a solicitarla. Buscamos la ruta más segura y abierta.',
    icono: 'Sparkles',
    controlesEmergentes: {
      mostrarCosteoSinCdp: true
    },
    rutasJuridicas: [
      {
        id: 'MENOR_CUANTIA_MIPYMES',
        titulo: 'Ruta 1: Selección Abreviada con Convocatoria a Mipymes',
        modalidad: 'Selección Abreviada de Menor Cuantía (Art. 2 Ley 1150 / Ley 2069)',
        fundamento: 'Art. 2 numeral 2 Ley 1150 de 2007 • Art. 34 Ley 2069 de 2020 • Decreto 1860 de 2021',
        esRecomendada: true,
        resumen: 'Procedimiento reglado con plazos equilibrados (25 a 35 días hábiles), fomento a la industria regional y reglas de juego claras.',
        porQueConviene: 'Es la vía más sólida: permite exigir capacidad técnica comprobable y a la vez limitar a Mipymes colombianas para evitar monopolios de grandes intermediarios.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Unidad de Objeto y Planeación',
            explicacion: 'El presupuesto integra el suministro, transporte veredal y puesta en marcha.',
            recomendacion: 'Cero riesgo de fraccionamiento al unificar el entregable funcional.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Concurrencia sin Barreras Arbitrarias',
            explicacion: 'Requisitos de experiencia RUP proporcionados al valor del contrato (1 a 1.5 veces el presupuesto).',
            recomendacion: 'Evita tutelas y quejas por presunto pliego sastre.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Soporte y Garantía en Sitio',
            explicacion: 'Obligación de atención técnica en menos de 48 horas en el municipio.',
            recomendacion: 'Garantiza que los bienes o servicios no queden abandonados si falla un equipo.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de verificación estricta de RUP vigente antes de adjudicar.',
          'Obligación de soporte técnico en sitio rural en menos de 48 horas hábiles.',
          'Fórmulas de ponderación económica objetivas amparadas en el Decreto 1860 de 2021.'
        ]
      },
      {
        id: 'SUBASTA_INVERSA',
        titulo: 'Ruta 2: Subasta Inversa Electrónica (Bienes Homogéneos)',
        modalidad: 'Selección Abreviada por Subasta Inversa Presencial o Electrónica',
        fundamento: 'Art. 2 numeral 2 literal a) Ley 1150 de 2007',
        esRecomendada: false,
        resumen: 'Compite exclusivamente el menor precio. Útil para compras donde la calidad no varía entre fabricantes.',
        porQueConviene: 'Celeridad en tiempos, pero peligrosa si el objeto requiere mano de obra calificada o soporte en territorio.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Riesgo de Precio Artificialmente Bajo',
            explicacion: 'Los proponentes bajan precios sin margen y luego no pueden cumplir.',
            recomendacion: 'Exigir desglose exhaustivo de costos antes de adjudicar.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Plataforma Electrónica Estable',
            explicacion: 'Garantizar que no haya caídas del sistema durante la puja.',
            recomendacion: 'Soporte técnico certificado de SECOP II.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Calidad Mínima Garantizada',
            explicacion: 'Al ganar el más barato, suelen enviar marcas de baja durabilidad.',
            recomendacion: 'Ficha técnica con normas técnicas ICONTEC / ISO obligatorias.'
          }
        ],
        clausulasBlindaje: [
          'Rechazo automático por precio artificialmente bajo no sustentado.',
          'Muestra técnica previa o ficha de homologación del fabricante.'
        ]
      }
    ]
  },

  NUEVO_SIN_CDP: {
    id: 'NUEVO_SIN_CDP',
    tituloHumano: 'Formulación Técnica y Costeo (Sin CDP Inicial)',
    nudoGordiano: 'El dilema del huevo y la gallina presupuestal (Hacienda vs Mercado)',
    descripcionEmpatica: 'Hacienda no da el rubro si no sabe el valor exacto, y tú no puedes pedir CDP sin costeo formal. Vamos a costearlo para que te asignen la plata.',
    icono: 'Clock',
    controlesEmergentes: {
      mostrarCosteoSinCdp: true,
      recordatorioEsquina: '📌 Pendiente: Anexar número y fecha del CDP antes de radicar'
    },
    rutasJuridicas: [
      {
        id: 'FORMULACION_ESTUDIO_COSTEO',
        titulo: 'Ruta: Estructuración Técnica y Estudio Económico Previo',
        modalidad: 'Fase de Planeación y Costeo Precontractual (Art. 2.2.1.1.2.1.1 Dto 1082)',
        fundamento: 'Estatuto Orgánico del Presupuesto (Decreto 111/96) • Guía de Estudios Previos CCE',
        esRecomendada: true,
        resumen: 'Se construye el estudio de mercado, la ficha técnica y la estimación de costos para radicar la solicitud formal del CDP ante la Secretaría de Hacienda.',
        porQueConviene: 'Rompe el bloqueo institucional: le entregas a Hacienda un valor matemáticamente justificado para que expidan el CDP sin inventar cifras.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Legalidad del Gasto',
            explicacion: 'No se puede publicar el pliego en SECOP sin el CDP debidamente registrado.',
            recomendacion: 'El expediente se deja en estado borrador listo para incorporar el CDP.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Cotizaciones con Carácter Informativo',
            explicacion: 'Las solicitudes de mercado no comprometen a la entidad ni crean derecho.',
            recomendacion: 'Incluir advertencia expresa de consulta preliminar de precios.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Vigencia de las Cotizaciones',
            explicacion: 'Los precios de insumos suben si Hacienda demora la expedición del rubro.',
            recomendacion: 'Pactar cotizaciones válidas por al menos 60 días calendario.'
          }
        ],
        clausulasBlindaje: [
          'Condición suspensiva: el proceso solo inicia convocatoria formal tras la expedición del CDP.',
          'Cláusula de ajuste por IPC si la expedición presupuestal toma más de 90 días.'
        ]
      }
    ]
  },

  RESCATE_DESIERTO: {
    id: 'RESCATE_DESIERTO',
    tituloHumano: 'Rescatar un proceso declarado desierto',
    nudoGordiano: 'Diagnosticar por qué no cotizaron y reestructurar sin caer en el mismo error',
    descripcionEmpatica: 'La convocatoria anterior quedó vacía. Nadie se presentó o rechazaron todas las ofertas. Vamos a corregir la causa exacta para no perder otro mes.',
    icono: 'AlertCircle',
    controlesEmergentes: {
      mostrarDiagnosticoDesierto: true
    },
    rutasJuridicas: [
      {
        id: 'REESTRUCTURACION_AJUSTE_MERCADO',
        titulo: 'Ruta: Segunda Convocatoria Ajustada con Actualización Económica',
        modalidad: 'Selección Abreviada de Menor Cuantía o Convocatoria Directa según causal',
        fundamento: 'Art. 2.2.1.1.2.2.4 Decreto 1082 de 2015 (Procesos Desiertos)',
        esRecomendada: true,
        resumen: 'Se flexibilizan los requisitos RUP excesivos o se indexa el presupuesto a los precios reales del territorio, garantizando pluralidad de ofertas.',
        porQueConviene: 'La ley permite reabrir el proceso ajustando los pliegos para corregir las razones que ahuyentaron a los proponentes.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Motivación Expresa del Ajuste',
            explicacion: 'Si se sube el presupuesto, debe sustentarse con el informe de deserción.',
            recomendacion: 'Adjuntar el acta técnica donde los proveedores explicaron por qué no participaron.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Apertura de Barreras de Entrada',
            explicacion: 'Bajar los años de experiencia o el índice de endeudamiento que bloqueó a las Mipymes.',
            recomendacion: 'Ajustar índices financieros a la media real de la Cámara de Comercio.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Plazos de Ejecución Realistas',
            explicacion: 'Muchos procesos se caen porque piden entregar en 15 días lo que toma 60.',
            recomendacion: 'Ajustar el cronograma considerando temporadas de lluvia y fletes.'
          }
        ],
        clausulasBlindaje: [
          'Acta formal de diagnóstico de causas de declaratoria de desierto anexa a los estudios.',
          'Invitación directa a las empresas inscritas en el RUP que solicitaron aclaraciones.'
        ]
      }
    ]
  },

  RESCATE_HUERFANO: {
    id: 'RESCATE_HUERFANO',
    tituloHumano: 'Adoptar y terminar un borrador huérfano (Cambio de estructurador)',
    nudoGordiano: 'La soledad de la rúbrica sobre el trabajo incompleto de otro colega',
    descripcionEmpatica: 'Heredaste una carpeta con documentos sueltos. No sabes qué está bien hecho y qué tiene errores ocultos. Vamos a auditarlo y sanearlo.',
    icono: 'FileText',
    controlesEmergentes: {
      mostrarCargaBorradorHuerfano: true
    },
    rutasJuridicas: [
      {
        id: 'SANEAMIENTO_BORRADOR_HUERFANO',
        titulo: 'Ruta: Saneamiento Integral y Consolidación de Autoría',
        modalidad: 'Estructuración Validada con Doble Verificación Normativa',
        fundamento: 'Principio de Responsabilidad y Debido Proceso (Art. 26 Ley 80 de 1993)',
        esRecomendada: true,
        resumen: 'Se conservan los datos técnicos válidos pero se reconstruye la matriz de riesgos, la justificación de modalidad y el cuadro de firmas con tu respaldo.',
        porQueConviene: 'Te protege como nuevo funcionario: nadie podrá decir que firmaste a ciegas lo que otro dejó mal redactado.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Trazabilidad de Precios Heredados',
            explicacion: 'Verificar si las cotizaciones que dejó tu antecesor siguen vigentes.',
            recomendacion: 'Ratificar por correo o pedir una cotización adicional de control.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Revisión de Especificaciones Cerradas',
            explicacion: 'Asegurar que el estructurador anterior no haya copiado una ficha técnica amarrada a una sola marca comercial.',
            recomendacion: 'Eliminar nombres de marcas registradas o agregar la cláusula "o equivalente técnico".'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Verificación en Terreno',
            explicacion: 'Confirmar que la necesidad siga existiendo y no haya sido atendida por otra dependencia.',
            recomendacion: 'Constancia de visita técnica o confirmación con la dependencia solicitante.'
          }
        ],
        clausulasBlindaje: [
          'Acta de empalme técnico donde se detallan los ajustes realizados sobre el borrador.',
          'Cláusula de equivalencia técnica funcional para evitar marcas exclusivas.'
        ]
      }
    ]
  },

  MANUAL_PROPIO_ESP_ESE: {
    id: 'MANUAL_PROPIO_ESP_ESE',
    tituloHumano: 'Régimen Especial con Manual Propio (Hospital E.S.E. / Empresa E.S.P.)',
    nudoGordiano: 'Liberarse de las trabas de Ley 80 sin perder el amparo de los principios públicos',
    descripcionEmpatica: 'Tu entidad tiene régimen especial de derecho privado. No estás obligado a hacer licitaciones públicas de Ley 80, pero sí a respetar tu manual.',
    icono: 'ShieldCheck',
    controlesEmergentes: {},
    rutasJuridicas: [
      {
        id: 'CONVOCATORIA_MANUAL_INTERNO',
        titulo: 'Ruta 1: Convocatoria Pública por Manual Interno de Contratación',
        modalidad: 'Convocatoria Abierta Reglada por el Manual de la Entidad',
        fundamento: 'Art. 13 Ley 1150 de 2007 • Ley 142/94 (ESP) o Art. 195 Ley 100/93 (ESE)',
        esRecomendada: true,
        resumen: 'Procedimiento transparente y competitivo según los topes del Manual Interno, sin pliegos tipo ni tiempos excesivos de Ley 80.',
        porQueConviene: 'Celeridad operativa comercial con blindaje total ante los entes de control fiscal por cumplir el manual formalmente adoptado.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Acatamiento Estricto del Manual',
            explicacion: 'No inventar causales de contratación directa que no estén taxativas en el manual.',
            recomendacion: 'Citar expresamente el artículo y numeral del Manual Interno vigente.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Publicidad en el Portal Institucional',
            explicacion: 'Publicar los términos durante mínimo los días hábiles que ordene el manual.',
            recomendacion: 'Evitar invitaciones cerradas si la cuantía supera el tope menor del manual.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Continuidad de la Prestación del Servicio',
            explicacion: 'En salud o acueducto, la falta de insumos pone en riesgo la vida humana.',
            recomendacion: 'Pactar entregas escalonadas con inventario de seguridad.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de aplicación preferente del Manual Interno de Contratación.',
          'Criterios objetivos de evaluación: capacidad técnica y costo integral del servicio.'
        ]
      }
    ]
  },

  URGENCIA_MANIFIESTA: {
    id: 'URGENCIA_MANIFIESTA',
    tituloHumano: 'Urgencia Manifiesta o Calamidad Pública (Ola Invernal / Emergencia)',
    nudoGordiano: 'Contratar en horas para salvar vidas sin terminar investigado por la Contraloría',
    descripcionEmpatica: 'Ocurrió un derrumbe, una inundación o colapsó una estructura. La gente no puede esperar 40 días de licitación. Hay que actuar ya, pero con blindaje.',
    icono: 'AlertCircle',
    controlesEmergentes: {
      mostrarAlertaCalamidad: true,
      recordatorioEsquina: '⚠️ Obligatorio: enviar de inmediato el expediente al órgano de control fiscal competente (Art. 43 Ley 80); este se pronuncia en 2 meses'
    },
    rutasJuridicas: [
      {
        id: 'CONTRATACION_DIRECTA_URGENCIA',
        titulo: 'Ruta: Contratación Directa por Declaratoria de Urgencia Manifiesta',
        modalidad: 'Contratación Directa Excepcional (Art. 42 y 43 Ley 80 de 1993)',
        fundamento: 'Art. 42 Ley 80 de 1993 • Decreto de Declaratoria de Calamidad Pública (Ley 1523 de 2012)',
        esRecomendada: true,
        resumen: 'Se prescinde de estudios previos complejos y de licitación; se contrata inmediatamente al proveedor que tenga la maquinaria o suministros disponibles.',
        porQueConviene: 'Es la única vía legal para actuar el mismo día de la catástrofe sin cometer delito, siempre que el objeto se limite exclusivamente a superar la crisis.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Revisión Fiscal Obligatoria de la CGR',
            explicacion: 'La ley ordena que la Contraloría revise de oficio el decreto y los contratos de urgencia.',
            recomendacion: 'Adjuntar fotos, informes de Gestión del Riesgo y bitácora de maquinaria.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Límite Estricto del Objeto',
            explicacion: 'No incluir obras definitivas o suntuarias que no sean de atención inmediata.',
            recomendacion: 'Solo contratar lo indispensable para restablecer el paso o salvar vidas.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Disponibilidad Inmediata en Sitio',
            explicacion: 'El contratista debe tener la maquinaria en el municipio o a pocas horas.',
            recomendacion: 'Acta de inicio en menos de 24 horas tras la firma.'
          }
        ],
        clausulasBlindaje: [
          'Decreto motivado de Urgencia Manifiesta expedido por el Alcalde o Gobernador.',
          'Remisión formal del expediente a la Contraloría General de la República.'
        ]
      }
    ]
  },

  PLIEGO_TIPO_VIAS: {
    id: 'PLIEGO_TIPO_VIAS',
    tituloHumano: 'Infraestructura de Transporte con Pliegos Tipo Obligatorios (CCE)',
    nudoGordiano: 'Evitar sanciones por modificar los pliegos inalterables de Colombia Compra',
    descripcionEmpatica: 'Vas a pavimentar, hacer placa huellas o puentes. La ley prohíbe cambiar las matrices de experiencia y evaluación de Colombia Compra Eficiente.',
    icono: 'Gavel',
    controlesEmergentes: {},
    rutasJuridicas: [
      {
        id: 'LICITACION_PLIEGO_TIPO_CCE',
        titulo: 'Ruta: Licitación Pública / Menor Cuantía bajo Documentos Tipo Obligatorios',
        modalidad: 'Convocatoria Pública Regida por Pliegos Tipo de Infraestructura de Transporte',
        fundamento: 'Ley 1882 de 2018 • Ley 2022 de 2020 • Documentos Tipo CCE Versión Vigente',
        esRecomendada: true,
        resumen: 'Se adoptan sin ninguna alteración los formatos oficiales de CCE (experiencia, capacidad financiera, asignación de riesgos y criterios de ponderación).',
        porQueConviene: 'Cero riesgo disciplinario: ningún veedor ni proponente puede acusarte de armar un pliego a la medida porque los requisitos los fijó el Estado central.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Inalterabilidad de Matrices',
            explicacion: 'Cambiar un solo indicador financiero en vías es causal de investigación disciplinaria.',
            recomendacion: 'Usar estrictamente el formato Word y Excel expedido por CCE.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Publicidad de la Matriz de Riesgos Oficial',
            explicacion: 'Los riesgos geológicos y de predios están tipificados en los pliegos tipo.',
            recomendacion: 'Acompañar con el estudio de costos unitarios del territorio.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Disponibilidad de Predios y Licencias',
            explicacion: 'No se puede abrir licitación si no están los predios liberados.',
            recomendacion: 'Certificación de predios disponibles firmada por Planeación.'
          }
        ],
        clausulasBlindaje: [
          'Adopción integral del Documento Estándar de Pliegos Tipo de CCE.',
          'Certificado de viabilidad técnica y ambiental previo a la apertura.'
        ]
      }
    ]
  },

  MINIMA_CUANTIA_EXPRES: {
    id: 'MINIMA_CUANTIA_EXPRES',
    tituloHumano: 'Mínima Cuantía Exprés (Menos del 10% de la Menor Cuantía)',
    nudoGordiano: 'Comprar suministros menores en 3 días sin armar un pliego de 80 páginas',
    descripcionEmpatica: 'El monto es pequeño (menos de 65 SMMLV en municipios de 1ª categoría o 28 SMMLV en 4ª). La ley permite un trámite rápido de 1 día de publicación.',
    icono: 'Sparkles',
    controlesEmergentes: {},
    rutasJuridicas: [
      {
        id: 'MINIMA_CUANTIA_SIMPLIFICADA',
        titulo: 'Ruta: Procedimiento Simplificado de Mínima Cuantía (Art. 2 numeral 5 Ley 1150)',
        modalidad: 'Invitación Pública de Mínima Cuantía (Publicación 1 día hábil)',
        fundamento: 'Art. 2 numeral 5 Ley 1150 de 2007 • Art. 2.2.1.2.1.5.1 Decreto 1082 de 2015',
        esRecomendada: true,
        resumen: 'Se publica una invitación de 2 o 3 páginas. Se evalúa exclusivamente capacidad jurídica básica y menor precio ofertado.',
        porQueConviene: 'Extremadamente rápida y sencilla: no exige RUP, no exige estados financieros complejos y se adjudica en 3 a 5 días hábiles.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Cero Fraccionamiento de Cuantía',
            explicacion: 'No dividir una compra grande en tres mínimas cuantías para evitar licitar.',
            recomendacion: 'Verificar en el PAA que la necesidad esté consolidada.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Recepción Transparente de Ofertas',
            explicacion: 'Las ofertas se reciben electrónicamente en SECOP II a la hora exacta de cierre.',
            recomendacion: 'Acta de cierre automática de plataforma.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Garantía Mínima de Cumplimiento',
            explicacion: 'La ley no exige póliza obligatoria en mínima cuantía, pero es prudente pedirla.',
            recomendacion: 'Exigir póliza de cumplimiento y calidad del bien por el 10%.'
          }
        ],
        clausulasBlindaje: [
          'Invitación simplificada con criterios objetivos de menor precio.',
          'Póliza opcional de cumplimiento y calidad del bien.'
        ]
      }
    ]
  },

  CONSULTORIA_MERITOS: {
    id: 'CONSULTORIA_MERITOS',
    tituloHumano: 'Consultoría e Interventoría (Concurso de Méritos sin Precio)',
    nudoGordiano: 'Escoger al mejor equipo de ingenieros sin que el precio distorsione la calidad',
    descripcionEmpatica: 'Vas a contratar estudios y diseños de ingeniería o arquitectura. La ley prohíbe adjudicar por precio; se escoge al equipo más idóneo.',
    icono: 'BookOpen',
    controlesEmergentes: {},
    rutasJuridicas: [
      {
        id: 'CONCURSO_MERITOS_ABIERTO',
        titulo: 'Ruta: Concurso de Méritos Abierto / Sistema de Precalificación',
        modalidad: 'Concurso de Méritos (Art. 2 numeral 3 Ley 1150 de 2007)',
        fundamento: 'Art. 2 numeral 3 Ley 1150 • Art. 2.2.1.2.1.3.1 Decreto 1082 de 2015',
        esRecomendada: true,
        resumen: 'Se califica experiencia específica del equipo consultor, formación de postgrado y metodología. El sobre económico se abre solo con el primer elegible.',
        porQueConviene: 'Garantiza que la ciudad reciba diseños de alta calidad técnica elaborados por profesionales calificados.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Precio Justo no Negociable',
            explicacion: 'El presupuesto oficial es fijo y debe coincidir con el sobre del ganador.',
            recomendacion: 'Estudio de costos por horas-hombre según tablas gremiales (SCI / ACIEM).'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Perfiles Razonables sin Sobredimensionar',
            explicacion: 'No exigir doctorados para proyectos que requieren especialistas con experiencia en obra.',
            recomendacion: 'Permitir homologación de años de experiencia por postgrado.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Dedicación Real en Campo',
            explicacion: 'Exigir que los especialistas visiten el territorio y no firmen desde la capital.',
            recomendacion: 'Actas de visita de campo firmadas con la comunidad.'
          }
        ],
        clausulasBlindaje: [
          'Matriz de ponderación técnica del equipo consultor.',
          'Cláusula de reemplazo de personal solo por perfiles de igual o superior puntaje.'
        ]
      }
    ]
  },

  CATALOGO_TVEC: {
    id: 'CATALOGO_TVEC',
    tituloHumano: 'Compra por Catálogo en Tienda Virtual del Estado (TVEC / Acuerdo Marco)',
    nudoGordiano: 'Acatar la obligación legal de comprar por Acuerdo Marco sin desgaste licitatorio',
    descripcionEmpatica: 'Vas a comprar computadores, camionetas o combustible. Si existe un Acuerdo Marco de Precios vigente en CCE, la ley prohíbe licitar.',
    icono: 'Sparkles',
    controlesEmergentes: {},
    rutasJuridicas: [
      {
        id: 'OPERACION_SECUNDARIA_TVEC',
        titulo: 'Ruta: Operación Secundaria en la Tienda Virtual del Estado Colombiano',
        modalidad: 'Contratación mediante Acuerdo Marco de Precios (Art. 2.2.1.2.1.2.7 Dto 1082)',
        fundamento: 'Decreto 1082 de 2015 • Guía de Operación de Tienda Virtual CCE',
        esRecomendada: true,
        resumen: 'Se ingresa a la plataforma TVEC, se selecciona el catálogo y se realiza la solicitud de cotización entre los proveedores ya seleccionados por el Estado.',
        porQueConviene: 'Cero riesgo de impugnaciones: los precios y las empresas ya fueron habilitadas por Colombia Compra Eficiente a nivel nacional.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Coherencia de Fichas de Catálogo',
            explicacion: 'Comprar exactamente las referencias pactadas en el catálogo nacional.',
            recomendacion: 'Descargar el evento de cotización generado por la TVEC.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Reglas de la Operación Secundaria',
            explicacion: 'Respetar los tiempos de cotización automática de la plataforma.',
            recomendacion: 'No negociar por fuera de la tienda virtual.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Cobertura Geográfica del Catálogo',
            explicacion: 'Verificar que el proveedor seleccionado entregue en tu municipio.',
            recomendacion: 'Revisar la zona geográfica adjudicada en el Acuerdo Marco.'
          }
        ],
        clausulasBlindaje: [
          'Orden de Compra oficial generada por la plataforma TVEC.',
          'Garantía comercial estándar homologada por CCE.'
        ]
      }
    ]
  },

  LIMITACION_MIPYMES: {
    id: 'LIMITACION_MIPYMES',
    tituloHumano: 'Convocatoria Reservada a Mipymes Locales y Regionales',
    nudoGordiano: 'Proteger el empleo y las empresas del departamento sin vulnerar la libre competencia',
    descripcionEmpatica: 'Las micro y pequeñas empresas del territorio piden participar en igualdad de condiciones frente a los grandes consorcios nacionales.',
    icono: 'Building2',
    controlesEmergentes: {},
    rutasJuridicas: [
      {
        id: 'LIMITACION_FORMAL_MIPYMES',
        titulo: 'Ruta: Selección Abreviada Limitada a Mipymes Colombianas (Ley 2069 de 2020)',
        modalidad: 'Convocatoria Pública Reservada Exclusivamente a Mipymes',
        fundamento: 'Art. 34 Ley 2069 de 2020 • Decreto 1860 de 2021',
        esRecomendada: true,
        resumen: 'El proceso se reserva exclusivamente para micro, pequeñas y medianas empresas con domicilio en el país y mínimo un año de antigüedad.',
        porQueConviene: 'Crea un cerco legal transparente: los grandes conglomerados quedan excluidos legalmente, permitiendo que el dinero público circule en la región.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Recepción Oportuna de Solicitudes',
            explicacion: 'La limitación exige recibir mínimo 2 solicitudes antes de la apertura del pliego definitivo.',
            recomendacion: 'Acta de radicación formal de las solicitudes de Mipymes en el expediente.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Verificación de Antigüedad en RUES',
            explicacion: 'Comprobar que las Mipymes tengan al menos 1 año de constituidas.',
            recomendacion: 'Consulta automática en el RUES de Cámara de Comercio.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Capacidad Financiera Proporcionada',
            explicacion: 'No exigir cupos de crédito que asfixien a los talleres o empresas locales.',
            recomendacion: 'Ajustar índices de liquidez acordes a la escala Mipyme.'
          }
        ],
        clausulasBlindaje: [
          'Acta formal de limitación de convocatoria a Mipymes expedida por el ordenador del gasto.',
          'Puntaje adicional para empresas con condición de Sociedad BIC (Ley 2069).'
        ]
      }
    ]
  },

  PROVEEDOR_EXCLUSIVO: {
    id: 'PROVEEDOR_EXCLUSIVO',
    tituloHumano: 'Proveedor Único / Exclusividad Tecnológica o de Marca',
    nudoGordiano: 'Contratar sin licitación cuando solo hay una empresa en el país sin cometer delito',
    descripcionEmpatica: 'Se vencieron licencias de software privativo o necesitas repuestos que solo fabrica una empresa con patente. Hay que sustentar que no existen sustitutos.',
    icono: 'Sparkles',
    controlesEmergentes: {},
    rutasJuridicas: [
      {
        id: 'DIRECTA_PROVEEDOR_UNICO',
        titulo: 'Ruta: Contratación Directa por Inexistencia de Pluralidad de Oferentes',
        modalidad: 'Contratación Directa (Art. 2 numeral 4 literal g) Ley 1150 de 2007)',
        fundamento: 'Art. 2 numeral 4 literal g) Ley 1150 • Art. 2.2.1.2.1.4.3 Decreto 1082 de 2015',
        esRecomendada: true,
        resumen: 'Se adjudica de forma directa al fabricante o distribuidor exclusivo demostrando la inexistencia de otros proveedores en el territorio nacional.',
        porQueConviene: 'Es la única vía jurídica para no hacer una licitación ficticia que inevitablemente terminaría en una sola oferta o desierta.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Estudio de Inexistencia de Sustitutos',
            explicacion: 'La Contraloría sanciona si se demuestra que en el mercado había marcas equivalentes.',
            recomendacion: 'Informe técnico detallado que justifique por qué ninguna otra solución técnica es viable.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Certificado de Exclusividad Auténtico',
            explicacion: 'Carta notariada del fabricante internacional acreditando la representación única.',
            recomendacion: 'Certificado con vigencia menor a 90 días apostillado o legalizado.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Razonabilidad del Precio Pactado',
            explicacion: 'Al no haber puja, el precio debe compararse con listas públicas de precios del fabricante.',
            recomendacion: 'Lista oficial de precios de fábrica anexa a los estudios.'
          }
        ],
        clausulasBlindaje: [
          'Certificado formal de exclusividad del titular de la patente o derecho de autor.',
          'Estudio comparativo de mercado demostrando la ausencia de sustitutos técnicos.'
        ]
      }
    ]
  },

  // =========================================================================
  // FAMILIA I: RELACIONES INTERADMINISTRATIVAS (ENTRE ENTIDADES PÚBLICAS)
  // =========================================================================
  CONVENIO_INTERADMINISTRATIVO: {
    id: 'CONVENIO_INTERADMINISTRATIVO',
    familia: 'RELACIONES_INTERADMINISTRATIVAS',
    tituloHumano: 'Convenio Interadministrativo (Aunar Esfuerzos)',
    nudoGordiano: 'La frontera entre aunar esfuerzos sin lucro y la elusión de la licitación',
    descripcionEmpatica: 'Dos o más entidades del Estado se asocian para cumplir fines comunes sin contraprestación comercial ni cobro de utilidades.',
    icono: 'Building2',
    fundamentoNormativo: 'Art. 95 Ley 489 de 1998 • Art. 209 Constitución Política de Colombia',
    controlesEmergentes: {
      mostrarCosteoSinCdp: true
    },
    rutasJuridicas: [
      {
        id: 'CONVENIO_COOPERACION_BILATERAL',
        titulo: 'Ruta Óptima: Convenio Interadministrativo de Cooperación',
        modalidad: 'Convenio Interadministrativo (Art. 95 Ley 489 / Art. 209 C.P.)',
        fundamento: 'Artículo 95 Ley 489 de 1998 y Principios del Artículo 209 Constitucional',
        esRecomendada: true,
        resumen: 'Aporte conjunto de recursos, personal o predios para un fin institucional común. Prohibición estricta de lucro o cobro de margen comercial.',
        porQueConviene: 'Es la figura idónea para proyectos conjuntos entre nación, departamentos o municipios sin intermediación de operadores privados.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Aportes Bilaterales Ciertos y Ausencia de Utilidad',
            explicacion: 'La Contraloría sanciona si una entidad actúa como contratista comercial cobrando AIU o fee de administración.',
            recomendacion: 'Establecer matriz clara de aportes en dinero o en especie sin utilidad comercial.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'No Elusión del Estatuto de Contratación',
            explicacion: 'No se puede usar el convenio como bypass para que la otra entidad subcontrate a dedo a un privado.',
            recomendacion: 'Certificar que las actividades del convenio son ejecutadas por el personal de planta de las entidades.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Comité Coordinador Interinstitucional',
            explicacion: 'Ambas entidades deben tener delegados técnicos con actas bimensuales de seguimiento.',
            recomendacion: 'Creación del Comité Coordinador en la cláusula de supervisión del convenio.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de aportes específicos e intransferibles sin margen de intermediación comercial.',
          'Prohibición expresa de subcontratación de actividades misionales nucleares del convenio.',
          'Régimen de liquidación conjunta con reintegro obligatorio de saldos no ejecutados.'
        ]
      }
    ]
  },

  CONTRATO_INTERADMINISTRATIVO_SERVICIO: {
    id: 'CONTRATO_INTERADMINISTRATIVO_SERVICIO',
    familia: 'RELACIONES_INTERADMINISTRATIVAS',
    tituloHumano: 'Contrato Interadministrativo de Servicios (Blindado Ley 2195)',
    nudoGordiano: 'Riesgo de triangulación ilegal y subcontratación total prohibida por la Ley 2195/2022',
    descripcionEmpatica: 'Contratas a otra entidad pública especializada (ej. Universidad, EICE, Empresa Pública) pagándole una remuneración por el servicio, con obligación de ejecutar con medios propios.',
    icono: 'FileCheck',
    fundamentoNormativo: 'Art. 2 num. 4 lit. c Ley 1150/2007 • Ley 2195 de 2022 Art. 3 • Dcto 1082/2015',
    controlesEmergentes: {
      mostrarVerificacionLey2195: true
    },
    rutasJuridicas: [
      {
        id: 'CONTRATO_INTERADMINISTRATIVO_DIRECTO',
        titulo: 'Ruta 1: Contrato Interadministrativo con Ejecución Propia',
        modalidad: 'Contratación Directa Interadministrativa (Art. 2 Numeral 4 Literal c Ley 1150)',
        fundamento: 'Ley 1150 de 2007 Art. 2 • Ley 2195 de 2022 (Estatuto Anticorrupción) Art. 3',
        esRecomendada: true,
        resumen: 'Contratación directa remunerada con entidad estatal idónea que garantiza ejecutar al menos el 50% con su propia nómina e infraestructura.',
        porQueConviene: 'Aprovecha la especialidad técnica de otra entidad pública (ej. una universidad acreditada) cumpliendo el límite anticorrupción de subcontratación.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Blindaje Anti-Triangulación (Ley 2195 de 2022)',
            explicacion: 'La entidad ejecutora no puede subcontratar la totalidad del contrato con particulares.',
            recomendacion: 'Certificación previa suscrita por el representante legal acreditando capacidad operativa directa de al menos el 50%.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Idoneidad y Objeto Social Vinculado',
            explicacion: 'El objeto del contrato debe coincidir directamente con los fines misionales y legales de la entidad contratada.',
            recomendacion: 'Copia del acto de creación legal o estatutos vigentes acreditando la competencia técnica.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Razonabilidad de Precios y Costeo Directo',
            explicacion: 'El valor no puede inflarse con intermediaciones o comisiones de éxito no justificadas.',
            recomendacion: 'Anexo de costos unitarios detallados por personal, laboratorios o insumos institucionales.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de cumplimiento estricto del porcentaje de ejecución directa según la Ley 2195 de 2022.',
          'Prohibición de cesión del contrato interadministrativo a personas jurídicas de derecho privado.',
          'Obligación de la entidad contratada de aplicar la Ley 80 si adquiere insumos o bienes con terceros.'
        ]
      }
    ]
  },

  // =========================================================================
  // FAMILIA II: BASE SOCIAL, FUNDACIONES Y ECONOMÍA POPULAR
  // =========================================================================
  CONVENIO_ASOCIACION_ESAL_30: {
    id: 'CONVENIO_ASOCIACION_ESAL_30',
    familia: 'BASE_SOCIAL_Y_ECONOMIA_POPULAR',
    tituloHumano: 'Convenio con ESAL (Aporte propio ≥ 30%)',
    nudoGordiano: 'Acreditar el aporte real del 30% para sostener la legalidad de la contratación directa',
    descripcionEmpatica: 'Asociación con una fundación o corporación sin ánimo de lucro de reconocida idoneidad que financia de su bolsillo al menos el 30% del proyecto social.',
    icono: 'HeartHandshake',
    fundamentoNormativo: 'Art. 355 Constitución Política • Art. 5 Decreto 092 de 2017',
    controlesEmergentes: {
      mostrarBalanceAporteEsal: true
    },
    rutasJuridicas: [
      {
        id: 'ASOCIACION_ESAL_DIRECTA_092',
        titulo: 'Ruta Directa: Asociación bajo el Artículo 5 del Decreto 092/2017',
        modalidad: 'Contratación Directa por Asociación con ESAL (Dcto 092/2017 Art. 5)',
        fundamento: 'Artículo 355 C.P. y Artículo 5 del Decreto 092 de 2017',
        esRecomendada: true,
        resumen: 'Convenio directo para programas de bienestar o cultura donde la fundación aporta como mínimo el 30% del valor total del proyecto.',
        porQueConviene: 'Optimiza los recursos del municipio al sumar la contrapartida financiera o técnica real de una fundación con experiencia.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Verificación Contable del 30% de Contrapartida',
            explicacion: 'La Contraloría fiscaliza que el 30% sea dinero real o bienes valorados formalmente, no horas etéreas infladas.',
            recomendacion: 'Certificado de revisor fiscal o contador público con balance de contrapartida detallado.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Reconocida Idoneidad Demostrada',
            explicacion: 'La fundación debe tener mínimo 2 años de experiencia específica directa comprobable en el territorio.',
            recomendacion: 'Certificados de contratos previos cumplidos con otras entidades o donantes internacionales.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Impacto Social sin Lucro Oculto',
            explicacion: 'Los recursos públicos deben beneficiar directamente a la comunidad sin pagos de honorarios excesivos a fundadores.',
            recomendacion: 'Línea de base social y matriz de beneficiarios con actas de entrega en territorio.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de reversión y custodia de bienes adquiridos con recursos públicos del convenio.',
          'Certificación juramentada de destinación exclusiva de los aportes al objeto social convenido.',
          'Prohibición de distribución de utilidades, remanentes o dividendos.'
        ]
      }
    ]
  },

  CONVOCATORIA_COMPETITIVA_ESAL: {
    id: 'CONVOCATORIA_COMPETITIVA_ESAL',
    familia: 'BASE_SOCIAL_Y_ECONOMIA_POPULAR',
    tituloHumano: 'Convocatoria Competitiva entre ESAL (Dcto 092)',
    nudoGordiano: 'Creer que por ser fundación se puede contratar a dedo sin aportar el 30%',
    descripcionEmpatica: 'Convocatoria pública y reglada entre organizaciones no gubernamentales para seleccionar la mejor propuesta técnico-social con criterios objetivos.',
    icono: 'Users',
    fundamentoNormativo: 'Art. 4 Decreto 092 de 2017 • Guía Colombia Compra Eficiente',
    controlesEmergentes: {
      mostrarBalanceAporteEsal: true
    },
    rutasJuridicas: [
      {
        id: 'PROCESO_COMPETITIVO_ESAL_092',
        titulo: 'Ruta Reglada: Convocatoria Pública y Competitiva Decreto 092',
        modalidad: 'Proceso Competitivo con Entidades Sin Ánimo de Lucro (Dcto 092/2017 Art. 4)',
        fundamento: 'Decreto 092 de 2017 Artículo 4 • Principios de Igualdad y Publicidad',
        esRecomendada: true,
        resumen: 'Concurrencia pública para programas sociales cuando la entidad financia el 100% o la ESAL aporta menos del 30%.',
        porQueConviene: 'Elimina cualquier sospecha de favoritismo político y garantiza la mejor relación costo-impacto social.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Evaluación Objetiva Costo-Beneficio',
            explicacion: 'Los criterios de evaluación deben medir resultados concretos en beneficiarios y no favoritismos subjetivos.',
            recomendacion: 'Matriz objetiva de puntajes técnicos publicada con 5 días hábiles de traslado en SECOP II.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Pluralidad de Fundaciones Participantes',
            explicacion: 'No se pueden redactar requisitos que solo una fundación del municipio pueda cumplir.',
            recomendacion: 'Términos de referencia con requisitos habilitantes de experiencia proporcionales al monto.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Supervisión Comunitaria de Campo',
            explicacion: 'Comprobar en terreno que los talleres, alimentos o ayudas lleguen a la población vulnerable.',
            recomendacion: 'Muestreo aleatorio de beneficiarios con verificación de firmas y fotografías.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de auditoría especial sobre nómina y gastos operativos de la fundación.',
          'Póliza de salarios y cumplimiento extendida por el término del convenio más 6 meses.',
          'Publicación íntegra de informes de ejecución mensual en el portal de transparencia.'
        ]
      }
    ]
  },

  CONVENIO_SOLIDARIO_COMUNAL_JAC: {
    id: 'CONVENIO_SOLIDARIO_COMUNAL_JAC',
    familia: 'BASE_SOCIAL_Y_ECONOMIA_POPULAR',
    tituloHumano: 'Convenio Solidario y Contrato Comunal (JAC y Economía Popular)',
    nudoGordiano: 'Equilibrar la simplicidad comunal con la rendición de cuentas fiscal sin ahogar a los campesinos con burocracia',
    descripcionEmpatica: 'Contratación directa hasta la menor cuantía con Juntas de Acción Comunal, resguardos o consejos comunitarios para vías terciarias, rocería, caminos y comedores.',
    icono: 'Trowel',
    fundamentoNormativo: 'Art. 95 Ley 2166 de 2022 • Dcto 1082 Art. 2.2.1.2.1.4.8 • Decretos de Economía Popular',
    controlesEmergentes: {
      mostrarAutoReconocimientoComunal: true
    },
    rutasJuridicas: [
      {
        id: 'CONVENIO_SOLIDARIO_LEY_2166',
        titulo: 'Ruta Comunitaria: Convenio Solidario con Junta de Acción Comunal',
        modalidad: 'Convenio Solidario Comunal (Art. 95 Ley 2166 de 2022 / Dcto 1082)',
        fundamento: 'Ley 2166 de 2022 Artículo 95 • Decreto 1082 de 2015 Artículo 2.2.1.2.1.4.8',
        esRecomendada: true,
        resumen: 'Convenio directo con organizaciones comunales para ejecución de obras de baja complejidad con mano de obra del barrio o vereda.',
        porQueConviene: 'Dinamiza la economía popular y multiplica el rendimiento de los recursos públicos al vincular a la misma comunidad.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Desembolsos por Hitos y Avance de Obra',
            explicacion: 'No girar anticipos masivos; pagar contra acta de avance de metros lineales construidos.',
            recomendacion: 'Cronograma de pagos fraccionados contra informe del supervisor técnico municipal.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Reconocimiento Legal Comunal Vigente',
            explicacion: 'La JAC debe tener su dignatarios y auto de personería jurídica al día.',
            recomendacion: 'Certificado de personería y representación legal expedido por la Secretaría de Gobierno con vigencia de 30 días.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Acompañamiento Técnico de la Secretaría de Obras',
            explicacion: 'La JAC pone la mano de obra, pero el municipio debe dar los planos y ensayos de materiales.',
            recomendacion: 'Asignación formal de un maestro o ingeniero supervisor de apoyo técnico permanente.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de desembolsos contra actas de recibo parcial de obra verificadas en terreno.',
          'Compromiso de contratación de mano de obra local no calificada de la vereda o barrio.',
          'Acta de asamblea comunitaria de rendición de cuentas del uso de los recursos públicos.'
        ]
      }
    ]
  },

  // =========================================================================
  // FAMILIA III: GESTIÓN PATRIMONIAL, INMUEBLES Y BIENES FISCALES
  // =========================================================================
  DONACION_ACEPTACION_BIENES: {
    id: 'DONACION_ACEPTACION_BIENES',
    familia: 'GESTION_PATRIMONIAL_Y_BIENES',
    tituloHumano: 'Aceptación de Donación de Bienes y Recursos',
    nudoGordiano: 'Aceptar un "regalo" que traiga embargos, gravámenes, impuestos atrasados o vínculos de lavado de activos',
    descripcionEmpatica: 'Recepción formal a título gratuito de predios, vehículos, maquinaria o recursos donados por particulares, multinacionales u organismos.',
    icono: 'Gift',
    fundamentoNormativo: 'Art. 1443 y ss. Código Civil • Régimen de Contabilidad Pública (CGN)',
    controlesEmergentes: {
      mostrarVerificacionSarlaftPredial: true
    },
    rutasJuridicas: [
      {
        id: 'ACTO_ACEPTACION_DONACION',
        titulo: 'Ruta Preventiva: Aceptación por Acto Administrativo Motivado',
        modalidad: 'Aceptación de Donación a Título Gratuito (Código Civil / Régimen CGN)',
        fundamento: 'Artículos 1443 a 1493 Código Civil y Normas Contables CGN',
        esRecomendada: true,
        resumen: 'Aceptación formal con inventario, avalúo pericial y blindaje previo de títulos y SARLAFT.',
        porQueConviene: 'Permite incorporar activos valiosos al patrimonio público sin generar pasivos litigiosos para el municipio.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Estudio de Títulos y Paz y Salvo de Pasivos',
            explicacion: 'Aceptar un lote embargado o con deudas tributarias configura detrimento patrimonial.',
            recomendacion: 'Certificado de libertad y tradición de 20 años y paz y salvo de impuestos del donante.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Verificación de Integridad y SARLAFT',
            explicacion: 'Prevenir la aceptación de bienes con origen ilícito o sujetos a extinción de dominio.',
            recomendacion: 'Consulta del donante en listas OFAC, antecedentes penales, fiscales y disciplinarios.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Sostenibilidad Operativa del Bien',
            explicacion: 'Certificar que el municipio puede asumir el mantenimiento y pólizas de los bienes donados.',
            recomendacion: 'Concepto técnico de viabilidad operativa y asignación presupuestal para su sostenimiento.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de exención de asunción de pasivos previos a la fecha de suscripción del acto.',
          'Incorporación contable inmediata al inventario de activos fijos de la entidad.',
          'Suscripción de escritura pública de donación y registro en instrumentos públicos a cargo del donante.'
        ]
      }
    ]
  },

  ARRENDAMIENTO_INMUEBLE_ENTIDAD: {
    id: 'ARRENDAMIENTO_INMUEBLE_ENTIDAD',
    familia: 'GESTION_PATRIMONIAL_Y_BIENES',
    tituloHumano: 'Arrendamiento de Inmuebles para Sede Institucional',
    nudoGordiano: 'Pagar cánones superiores al mercado o arrendar teniendo la entidad inmuebles propios desocupados',
    descripcionEmpatica: 'Arriendo de sedes para alcaldías, comisarías, inspecciones de policía o bodegas mediante contratación directa reglada.',
    icono: 'Home',
    fundamentoNormativo: 'Art. 2 num. 4 lit. i Ley 1150/2007 • Art. 2.2.1.2.1.4.6 Decreto 1082 de 2015',
    controlesEmergentes: {
      mostrarVerificacionSarlaftPredial: true
    },
    rutasJuridicas: [
      {
        id: 'ARRENDAMIENTO_DIRECTO_1082',
        titulo: 'Ruta Reglamentaria: Contratación Directa de Arrendamiento',
        modalidad: 'Contratación Directa de Arrendamiento de Inmueble (Art. 2 Numeral 4 Literal i Ley 1150)',
        fundamento: 'Decreto 1082 de 2015 Artículo 2.2.1.2.1.4.6',
        esRecomendada: true,
        resumen: 'Alquiler directo sustentado en estudio de mercado, avalúo comercial corporativo y certificación de inexistencia de bienes propios.',
        porQueConviene: 'Resuelve la necesidad física de espacio institucional sin incurrir en compras costosas de predios.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Tope de Canon y Avalúo Comercial',
            explicacion: 'El canon mensual pactado no puede superar el 1% del valor comercial del inmueble fijado por perito del RAA o IGAC.',
            recomendacion: 'Avalúo comercial formal del inmueble incorporado a los estudios previos.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Certificación de Inexistencia de Bienes Propios',
            explicacion: 'La Contraloría sanciona si se paga arriendo mientras la entidad tiene locales propios sin uso.',
            recomendacion: 'Constancia expedida por la Dirección de Recursos Físicos certificando la necesidad del arriendo.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Normas de Sismorresistencia y Accesibilidad',
            explicacion: 'El inmueble debe ser seguro para los funcionarios y tener acceso para personas en condición de discapacidad.',
            recomendacion: 'Inspección de Bomberos y verificación de rampas/accesos conforme a la Ley 1618 de 2013.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de canon fijo en pesos colombianos con reajuste anual limitado al IPC.',
          'Paz y salvo de servicios públicos domiciliarios a la entrega del inmueble.',
          'Póliza de arrendamiento y de conservación del inmueble por el arrendador.'
        ]
      }
    ]
  },

  COMODATO_PRESTAMO_USO: {
    id: 'COMODATO_PRESTAMO_USO',
    familia: 'GESTION_PATRIMONIAL_Y_BIENES',
    tituloHumano: 'Comodato de Bienes Públicos (Préstamo de Uso Gratuito)',
    nudoGordiano: 'Que el comodatario privatice el bien estatal o cobre dinero a la comunidad enriqueciéndose sin causa',
    descripcionEmpatica: 'Entrega temporal gratuita de un coliseo, lote, maquinaria o vehículo a otra entidad pública, a la Defensa Civil, Bomberos o ESAL.',
    icono: 'KeyRound',
    fundamentoNormativo: 'Art. 38 Ley 80 de 1993 • Art. 2200 Código Civil • Ley 9 de 1989',
    controlesEmergentes: {
      mostrarVerificacionSarlaftPredial: true
    },
    rutasJuridicas: [
      {
        id: 'COMODATO_LEY_80',
        titulo: 'Ruta Preventiva: Contrato de Comodato Precario o a Plazo',
        modalidad: 'Contrato de Comodato de Bienes Públicos (Art. 38 Ley 80 / Código Civil)',
        fundamento: 'Artículo 38 de la Ley 80 de 1993 y Artículo 2200 del Código Civil',
        esRecomendada: true,
        resumen: 'Préstamo de uso estrictamente gratuito con prohibición absoluta de explotación comercial privada y póliza de conservación.',
        porQueConviene: 'Facilita la operación de organismos de socorro o entidades hermanas sin transferir la propiedad del bien estatal.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Prohibición Expresa de Lucro Comercial',
            explicacion: 'El comodatario no puede cobrar boletas ni subarrendar partes del bien público para beneficio particular.',
            recomendacion: 'Cláusula resolutoria de terminación inmediata si se detecta cobro de tarifas no autorizadas.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Justificación de Interés Público',
            explicacion: 'El préstamo solo puede hacerse a entidades públicas o ESAL sin fines de lucro con destino comunal.',
            recomendacion: 'Acta de entrega con inventario minucioso del estado físico del bien.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Mantenimiento y Pólizas a Cargo del Comodatario',
            explicacion: 'La entidad pública no debe asumir los daños o el desgaste ocasionado por el comodatario.',
            recomendacion: 'Póliza de todo riesgo y responsabilidad civil extracontractual aportada por el comodatario.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de restitución inmediata a solicitud de la entidad en caso de necesidad urgente.',
          'Obligación del comodatario de asumir el pago oportuno de servicios públicos durante el uso.',
          'Prohibición irrevocable de realizar mejoras o modificaciones estructurales sin autorización previa.'
        ]
      }
    ]
  },

  ENAJENACION_SUBASTA_BIENES_FISCALES: {
    id: 'ENAJENACION_SUBASTA_BIENES_FISCALES',
    familia: 'GESTION_PATRIMONIAL_Y_BIENES',
    tituloHumano: 'Enajenación y Subasta de Bienes Muebles y Chatarra',
    nudoGordiano: 'Vender activos públicos por debajo de su avalúo o entregar chatarra sin puja pública transparente',
    descripcionEmpatica: 'Venta o remate al mejor postor de vehículos dados de baja, chatarra ferrosa, maquinaria obsoleta o activos inservibles.',
    icono: 'BadgePercent',
    fundamentoNormativo: 'Art. 2 num. 2 lit. e Ley 1150/2007 • Decreto 1082 de 2015 Subasta Pública',
    controlesEmergentes: {
      mostrarCosteoSinCdp: true
    },
    rutasJuridicas: [
      {
        id: 'SUBASTA_PUBLICA_ENAJENACION',
        titulo: 'Ruta Obligatoria: Subasta Pública al Alza',
        modalidad: 'Enajenación de Bienes del Estado mediante Subasta Pública (Dcto 1082/2015)',
        fundamento: 'Artículo 2 numeral 2 literal e) Ley 1150 de 2007 y Decreto 1082 de 2015',
        esRecomendada: true,
        resumen: 'Procedimiento competitivo con puja económica hacia arriba a partir de un precio base de avalúo pericial.',
        porQueConviene: 'Maximiza el ingreso para el tesoro municipal y neutraliza cualquier sospecha de venta a precio vil.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Resolución de Baja y Avalúo Pericial Técnico',
            explicacion: 'No se puede rematar ningún bien sin previo informe técnico que certifique su obsolescencia y valor mínimo.',
            recomendacion: 'Dictamen pericial y resolución motivada de baja del inventario municipal.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Puja Pública en Plataforma Electrónica',
            explicacion: 'Todos los chatarreros o comercializadores calificados deben tener igual oportunidad de pujar.',
            recomendacion: 'Publicación en SECOP II con reglas de lances al alza transparentes.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Paz y Salvo de Desintegración y Tránsito',
            explicacion: 'En el caso de automotores, evitar que vehículos rematados sigan circulando a nombre del municipio.',
            recomendacion: 'Obligación del comprador de radicar la cancelación definitiva de matrícula ante el RUNT.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de pago total previo al retiro material de los bienes de las bodegas municipales.',
          'Póliza de garantía de cumplimiento para el retiro y desguace ambiental de los materiales.',
          'Entrega formal en el estado en que se encuentran sin garantía posterior para el comprador.'
        ]
      }
    ]
  },

  // =========================================================================
  // FAMILIA IV: FONDOS FIDUCIARIOS, CALAMIDAD Y RÉGIMEN RESERVADO
  // =========================================================================
  GASTOS_RESERVADOS_DEFENSA: {
    id: 'GASTOS_RESERVADOS_DEFENSA',
    familia: 'FONDOS_CALAMIDAD_Y_RESERVA',
    tituloHumano: 'Gastos Reservados (Seguridad Nacional e Inteligencia)',
    nudoGordiano: 'El equilibrio entre la reserva legal de inteligencia y la rendición de cuentas ante la Contraloría',
    descripcionEmpatica: 'Adquisición encubierta de bienes, fuentes de información, recompensas y operaciones tácticas de seguridad del Estado.',
    icono: 'ShieldAlert',
    fundamentoNormativo: 'Art. 2 num. 4 lit. d Ley 1150/2007 • Ley Estatutaria 1621 de 2013 • Decreto 1082',
    controlesEmergentes: {
      recordatorioEsquina: '⚠️ Proceso con Reserva Legal. No publicar en el portal público de SECOP.'
    },
    rutasJuridicas: [
      {
        id: 'CONTRATACION_RESERVADA_LEY_1621',
        titulo: 'Ruta Especial: Contratación con Reserva Legal',
        modalidad: 'Contratación Directa con Reserva Legal (Art. 2 Numeral 4 Literal d Ley 1150 / Ley 1621)',
        fundamento: 'Ley Estatutaria 1621 de 2013 y Artículo 2 numeral 4 literal d Ley 1150 de 2007',
        esRecomendada: true,
        resumen: 'Adquisición reservada para defensa y seguridad sin divulgación en plataformas públicas para salvaguardar vidas.',
        porQueConviene: 'Garantiza el éxito táctico y la confidencialidad de operativos de la Fuerza Pública o del CTI.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'Rendición ante la Sala Especial de la CGR',
            explicacion: 'La reserva legal no exime del control fiscal; se rinde informe reservado ante la Contraloría Delegada de Defensa.',
            recomendacion: 'Actas reservadas de legalización del gasto con soporte de factura y recibo a satisfacción codificado.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Causal Estricta de Necesidad Operativa',
            explicacion: 'No se pueden comprar insumos ordinarios de oficina como gastos reservados.',
            recomendacion: 'Certificación del Comandante de Unidad o Director de Inteligencia justificando la conexidad táctica.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Cadena de Custodia y Archivo de Seguridad',
            explicacion: 'El expediente físico debe custodiarse bajo normas de seguridad de documentos clasificados.',
            recomendacion: 'Archivo en caja fuerte con numeración de reserva y acta de destrucción de antecedentes según ley.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de reserva legal formal amparada en la Ley 1712 de 2014 y Ley 1621 de 2013.',
          'Acuerdo de confidencialidad perpetuo suscrito por el proveedor o agente operativo.',
          'Legalización mediante cuenta de cobro codificada autorizada por el Ordenador del Gasto.'
        ]
      }
    ]
  },

  ENCARGO_FIDUCIARIO_ADMINISTRACION: {
    id: 'ENCARGO_FIDUCIARIO_ADMINISTRACION',
    familia: 'FONDOS_CALAMIDAD_Y_RESERVA',
    tituloHumano: 'Fiducia Pública y Encargo Fiduciario de Administración',
    nudoGordiano: 'Intentar transferir la responsabilidad contractual del funcionario a la fiduciaria o eludir la Ley 80',
    descripcionEmpatica: 'Constitución de patrimonio autónomo fiduciario para la administración de anticipos, megaobras viales o recursos del SGR.',
    icono: 'Landmark',
    fundamentoNormativo: 'Art. 32 num. 5 Ley 80 de 1993 • Ley 2056 de 2020 (SGR)',
    controlesEmergentes: {
      mostrarCosteoSinCdp: true
    },
    rutasJuridicas: [
      {
        id: 'FIDUCIA_PUBLICA_ADMINISTRACION',
        titulo: 'Ruta Fiduciaria: Encargo Fiduciario Mercantil Sin Transferencia de Dominio',
        modalidad: 'Fiducia Pública / Encargo Fiduciario de Administración (Art. 32 Numeral 5 Ley 80)',
        fundamento: 'Artículo 32 numeral 5 de la Ley 80 de 1993 y Ley 2056 de 2020',
        esRecomendada: true,
        resumen: 'Administración condicionada de recursos públicos a través de sociedad fiduciaria vigilada por Superfinanciera.',
        porQueConviene: 'Blindaje estricto de los anticipos para que los contratistas no desvíen los recursos a otras obras.',
        cuidadosBlindaje: [
          {
            ambito: 'Cuidado Fiscal (Contraloría)',
            titulo: 'El Fiduciario es Pagador, No Contratante Soberano',
            explicacion: 'La entidad pública retiene la titularidad y supervisión; la fiduciaria no puede adjudicar a dedo contratos de obra.',
            recomendacion: 'Reglamento de desembolsos fiduciarios condicionados al visto bueno expreso de la interventoría.'
          },
          {
            ambito: 'Cuidado con Proponentes (Reglas Abiertas)',
            titulo: 'Selección Objetiva de la Sociedad Fiduciaria',
            explicacion: 'La fiducia se selecciona por licitación o concurso de méritos según la cuantía de la comisión fiduciaria.',
            recomendacion: 'Invitación pública a fiduciarias autorizadas evaluando comisiones y calificaciones de riesgo AAA.'
          },
          {
            ambito: 'Cuidado Operativo (En Territorio)',
            titulo: 'Rendimientos Financieros Reintegrables',
            explicacion: 'Los intereses generados por los dineros públicos no son del contratista ni de la fiduciaria.',
            recomendacion: 'Cláusula de giro periódico de rendimientos financieros a la Dirección de Tesorería municipal.'
          }
        ],
        clausulasBlindaje: [
          'Cláusula de inembargabilidad del patrimonio autónomo para proteger los dineros del anticipo.',
          'Instrucción fiduciaria irrevocable que supedita cada giro al acta de recibo aprobada por interventoría.',
          'Liquidación final y cierre de la cuenta matriz con paz y salvo de la tesorería pública.'
        ]
      }
    ]
  }
};

// Función para detectar el arquetipo a partir de la necesidad y las condiciones del usuario
export function detectarArquetipo(
  textoNecesidad: string,
  opciones: {
    tieneCdp?: boolean;
    esRescate?: boolean;
    esManualPropio?: boolean;
    esUrgencia?: boolean;
  }
): ArquetipoEstructuracion {
  const txt = (textoNecesidad || '').toLowerCase();

  // 1. Urgencia y Calamidad
  if (opciones.esUrgencia || txt.includes('urgencia') || txt.includes('calamidad') || txt.includes('derrumbe') || txt.includes('inundacion') || txt.includes('ola invernal')) {
    return ARQUETIPOS_ESTRUCTURACION.URGENCIA_MANIFIESTA;
  }

  // 2. Familia I: Interadministrativos
  if (txt.includes('convenio interadministrativo') || txt.includes('aunar esfuerzos') || txt.includes('entre entidades')) {
    return ARQUETIPOS_ESTRUCTURACION.CONVENIO_INTERADMINISTRATIVO;
  }
  if (txt.includes('contrato interadministrativo') || txt.includes('universidad publica') || txt.includes('eice') || txt.includes('fondo mixto')) {
    return ARQUETIPOS_ESTRUCTURACION.CONTRATO_INTERADMINISTRATIVO_SERVICIO;
  }

  // 3. Familia II: Base Social y JAC
  if (txt.includes('junta de accion comunal') || txt.includes('jac') || txt.includes('comunal') || txt.includes('economia popular') || txt.includes('cabildo') || txt.includes('camino veredal')) {
    return ARQUETIPOS_ESTRUCTURACION.CONVENIO_SOLIDARIO_COMUNAL_JAC;
  }
  if (txt.includes('fundacion') || txt.includes('esal') || txt.includes('corporacion sin animo') || txt.includes('decreto 092') || txt.includes('355')) {
    if (txt.includes('30%') || txt.includes('contrapartida') || txt.includes('asociacion')) {
      return ARQUETIPOS_ESTRUCTURACION.CONVENIO_ASOCIACION_ESAL_30;
    }
    return ARQUETIPOS_ESTRUCTURACION.CONVOCATORIA_COMPETITIVA_ESAL;
  }

  // 4. Familia III: Patrimonio, Inmuebles y Bienes
  if (txt.includes('donacion') || txt.includes('donar') || txt.includes('dacion en pago') || txt.includes('a titulo gratuito')) {
    return ARQUETIPOS_ESTRUCTURACION.DONACION_ACEPTACION_BIENES;
  }
  if (txt.includes('arrendamiento') || txt.includes('arriendo') || txt.includes('alquilar sede') || txt.includes('alquiler de predio')) {
    return ARQUETIPOS_ESTRUCTURACION.ARRENDAMIENTO_INMUEBLE_ENTIDAD;
  }
  if (txt.includes('comodato') || txt.includes('prestar lote') || txt.includes('prestar coliseo') || txt.includes('prestamo de uso')) {
    return ARQUETIPOS_ESTRUCTURACION.COMODATO_PRESTAMO_USO;
  }
  if (txt.includes('chatarra') || txt.includes('remate') || txt.includes('enajenacion') || txt.includes('subasta de vehiculos') || txt.includes('baja de bienes')) {
    return ARQUETIPOS_ESTRUCTURACION.ENAJENACION_SUBASTA_BIENES_FISCALES;
  }

  // 5. Familia IV: Reserva y Fiducias
  if (txt.includes('inteligencia') || txt.includes('gastos reservados') || txt.includes('seguridad nacional') || txt.includes('recompensas')) {
    return ARQUETIPOS_ESTRUCTURACION.GASTOS_RESERVADOS_DEFENSA;
  }
  if (txt.includes('fiducia') || txt.includes('encargo fiduciario') || txt.includes('patrimonio autonomo') || txt.includes('regalias') || txt.includes('sgr')) {
    return ARQUETIPOS_ESTRUCTURACION.ENCARGO_FIDUCIARIO_ADMINISTRACION;
  }

  // 6. Rescates de Procesos
  if (opciones.esRescate || txt.includes('desierto') || txt.includes('se cayo') || txt.includes('nadie se presento') || txt.includes('no cotizaron')) {
    return ARQUETIPOS_ESTRUCTURACION.RESCATE_DESIERTO;
  }
  if (txt.includes('herede') || txt.includes('borrador') || txt.includes('dejo el anterior') || txt.includes('a medias')) {
    return ARQUETIPOS_ESTRUCTURACION.RESCATE_HUERFANO;
  }

  // 7. Manual Propio ESE/ESP
  if (opciones.esManualPropio || txt.includes('hospital') || txt.includes('ese') || txt.includes('esp') || txt.includes('acueducto') || txt.includes('manual interno') || txt.includes('manual propio')) {
    return ARQUETIPOS_ESTRUCTURACION.MANUAL_PROPIO_ESP_ESE;
  }

  // 8. Obras y Pliegos Tipo
  if (txt.includes('placa huella') || txt.includes('pavimento') || txt.includes('vias') || txt.includes('carretera') || txt.includes('puente')) {
    return ARQUETIPOS_ESTRUCTURACION.PLIEGO_TIPO_VIAS;
  }

  // 9. Consultorías
  if (txt.includes('consultoria') || txt.includes('estudios y disenos') || txt.includes('interventoria') || txt.includes('diseno arquitectonico')) {
    return ARQUETIPOS_ESTRUCTURACION.CONSULTORIA_MERITOS;
  }

  // 10. TVEC
  if (txt.includes('camionetas') || txt.includes('combustible') || txt.includes('tvec') || txt.includes('tienda virtual') || txt.includes('acuerdo marco')) {
    return ARQUETIPOS_ESTRUCTURACION.CATALOGO_TVEC;
  }

  // 11. Exclusivo
  if (txt.includes('exclusivo') || txt.includes('patente') || txt.includes('distribuidor unico') || txt.includes('licencia de software')) {
    return ARQUETIPOS_ESTRUCTURACION.PROVEEDOR_EXCLUSIVO;
  }

  // 12. Mipymes
  if (txt.includes('mipyme') || txt.includes('local') || txt.includes('artesanos') || txt.includes('pequenas empresas')) {
    return ARQUETIPOS_ESTRUCTURACION.LIMITACION_MIPYMES;
  }

  // 13. Sin CDP
  if (opciones.tieneCdp === false || txt.includes('sin cdp') || txt.includes('no tengo cdp') || txt.includes('costeo') || txt.includes('para pedir la plata')) {
    return ARQUETIPOS_ESTRUCTURACION.NUEVO_SIN_CDP;
  }

  return ARQUETIPOS_ESTRUCTURACION.NUEVO_ORDINARIO;
}

export function obtenerArquetipoPorId(id: TipoSituacionInicial): ArquetipoEstructuracion {
  return ARQUETIPOS_ESTRUCTURACION[id] || ARQUETIPOS_ESTRUCTURACION.NUEVO_ORDINARIO;
}

export function listarArquetiposPorFamilia(familia: FamiliaArquetipo): ArquetipoEstructuracion[] {
  return Object.values(ARQUETIPOS_ESTRUCTURACION).filter((a) => a.familia === familia);
}

export function listarTodosLosArquetipos(): ArquetipoEstructuracion[] {
  return Object.values(ARQUETIPOS_ESTRUCTURACION);
}

export function listarArquetiposPrincipales(): ArquetipoEstructuracion[] {
  return [
    ARQUETIPOS_ESTRUCTURACION.NUEVO_ORDINARIO,
    ARQUETIPOS_ESTRUCTURACION.NUEVO_SIN_CDP,
    ARQUETIPOS_ESTRUCTURACION.CONVENIO_INTERADMINISTRATIVO,
    ARQUETIPOS_ESTRUCTURACION.CONTRATO_INTERADMINISTRATIVO_SERVICIO,
    ARQUETIPOS_ESTRUCTURACION.CONVENIO_ASOCIACION_ESAL_30,
    ARQUETIPOS_ESTRUCTURACION.CONVENIO_SOLIDARIO_COMUNAL_JAC,
    ARQUETIPOS_ESTRUCTURACION.DONACION_ACEPTACION_BIENES,
    ARQUETIPOS_ESTRUCTURACION.RESCATE_DESIERTO,
    ARQUETIPOS_ESTRUCTURACION.MANUAL_PROPIO_ESP_ESE,
    ARQUETIPOS_ESTRUCTURACION.URGENCIA_MANIFIESTA,
    ARQUETIPOS_ESTRUCTURACION.PLIEGO_TIPO_VIAS,
    ARQUETIPOS_ESTRUCTURACION.MINIMA_CUANTIA_EXPRES
  ];
}
