import { SMMLV_2026 } from '../domain/constants';
// Motor de Vigilancia Regulatoria, Jurisprudencial y Calibrador del Entorno (Legal Watchdog Engine)
// Monitorea leyes, decretos, sentencias del Consejo de Estado y circulares CCE,
// permitiendo calibrar e impactar activamente las variables del entorno del simulador.

export type TipoFuenteLegal =
  | 'LEY_REPUBLICA'
  | 'DECRETO_REGLAMENTARIO'
  | 'SENTENCIA_CONSEJO_ESTADO'
  | 'CIRCULAR_CCE'
  | 'PROYECTO_EN_TRAMITE';

export interface HitoRegulatorioJurisprudencial {
  id: string;
  tipo: TipoFuenteLegal;
  referenciaOficial: string;
  organismoEmisor: string;
  fechaEmision: string;
  titulo: string;
  sintesisDoctrinaria: string;
  extractoJurisprudencial: string;
  variableEntornoAfectada:
    | 'EXCLUSIVIDAD_RUP_STRICT'
    | 'PREFERENCIA_SOCIEDADES_BIC'
    | 'CONTROL_ADENDAS_LEY_1882'
    | 'CORREDOR_TRM_NUBE_OBLIGATORIO'
    | 'BENEFICIARIOS_FINALES_ANTICORRUPCION'
    | 'REFORMA_COMPRAS_POPULARES_SANDBOX';
  descripcionImpactoEntorno: string;
  moduloImpactado: string;
  activoEnEntorno: boolean;
  esSandboxReforma?: boolean;
}

export interface ParametrosEntornoRegulatorio {
  exclusividadRupActiva: boolean;
  preferenciaSociedadesBicActiva: boolean;
  limiteEstrictoAdendasLey1882: boolean;
  corredorCambiarioTrmObligatorio: boolean;
  beneficiariosFinalesActivos: boolean;
  sandboxComprasPopularesActivo: boolean;
  valorSMMLV_COP: number;
  anoVigenciaFiscal: number;
}

export class LegalWatchdogEngine {
  /**
   * Catálogo Oficial de Hitos Normativos y Jurisprudenciales Activos
   */
  public static readonly HITOS_REGULATORIOS_OFICIALES: HitoRegulatorioJurisprudencial[] = [
    {
      id: 'HITO-BIC-LEY2069',
      tipo: 'LEY_REPUBLICA',
      referenciaOficial: 'Ley 2069 de 2020 (Art. 35) & Decreto 1860 de 2021',
      organismoEmisor: 'Congreso de la República / Presidencia de la República',
      fechaEmision: '2021-12-24',
      titulo: 'Compras Públicas Sostenibles & Criterio de Desempate para Sociedades BIC',
      sintesisDoctrinaria:
        'Obliga a las entidades estatales a incluir como factor preferente de desempate en todos los pliegos de condiciones a las Sociedades de Beneficio e Interés Colectivo (BIC).',
      extractoJurisprudencial:
        '"En los procesos de contratación pública, las entidades estatales deberán incluir criterios de desempate que promuevan la sostenibilidad ambiental y social, otorgando preferencia a los proponentes que acrediten la condición de Sociedades BIC debidamente registradas ante la Cámara de Comercio."',
      variableEntornoAfectada: 'PREFERENCIA_SOCIEDADES_BIC',
      descripcionImpactoEntorno:
        'Aplica automáticamente el factor de desempate prioritario a proponentes certificados como INGELECGROUP S.A.S. BIC en los módulos de calificación económica y auditoría.',
      moduloImpactado: 'Desempates Económicos (Ley 2069) & Evaluador de Ofertas',
      activoEnEntorno: true
    },
    {
      id: 'HITO-RUP-CONSEJO-ESTADO',
      tipo: 'SENTENCIA_CONSEJO_ESTADO',
      referenciaOficial: 'Sentencia Consejo de Estado - Sección Tercera (Rad. 65.412)',
      organismoEmisor: 'Consejo de Estado - Sala de lo Contencioso Administrativo',
      fechaEmision: '2024-03-14',
      titulo: 'Principio de Taxatividad y Exclusividad del Registro Único de Proponentes (RUP)',
      sintesisDoctrinaria:
        'Declara ilegal que las entidades estatales exijan requisitos habilitantes, balances, o índices financieros no contemplados de forma taxativa en el RUP oficial emitido por las Cámaras de Comercio.',
      extractoJurisprudencial:
        '"El RUP es prueba plena e insustituible de la capacidad jurídica, financiera y organizacional. Cualquier cláusula del pliego que imponga certificaciones adicionales, balances intermedios no inscritos o indicadores financieros exógenos deviene en pliego sastre y vicia el proceso de nulidad."',
      variableEntornoAfectada: 'EXCLUSIVIDAD_RUP_STRICT',
      descripcionImpactoEntorno:
        'Bloquea en los Estudios Previos (EDP) y en el Validador RUP cualquier exigencia por fuera de los 6 indicadores estándar del Decreto 1082 de 2015.',
      moduloImpactado: 'Validador RUP, Estudios Previos EDP & Suite Real',
      activoEnEntorno: true
    },
    {
      id: 'HITO-ADENDAS-LEY1882',
      tipo: 'LEY_REPUBLICA',
      referenciaOficial: 'Ley 1882 de 2018 (Art. 1) & Decreto 1082 de 2015',
      organismoEmisor: 'Congreso de la República / Colombia Compra Eficiente',
      fechaEmision: '2018-01-15',
      titulo: 'Regla de Oro Temporal de Adendas: Mínimo 3 Días Hábiles Previos al Cierre',
      sintesisDoctrinaria:
        'Prohíbe terminantemente la expedición de adendas modificatorias dentro de los 3 días hábiles anteriores al cierre del proceso de selección, salvo que se prorrogue el cierre por igual término.',
      extractoJurisprudencial:
        '"No se podrán expedir adendas dentro de los tres (3) días hábiles anteriores al vencimiento del plazo para la presentación de ofertas. La entidad deberá prorrogar el cierre por un término no menor a tres (3) días hábiles si requiere efectuar ajustes técnicos sustanciales."',
      variableEntornoAfectada: 'CONTROL_ADENDAS_LEY_1882',
      descripcionImpactoEntorno:
        'Activa la auditoría bloqueante que califica de Ilegal / Extemporánea cualquier adenda emitida fuera de plazo, activando alertas preventivas disciplinarias.',
      moduloImpactado: 'Simulador de Adendas & Mesa de Observaciones',
      activoEnEntorno: true
    },
    {
      id: 'HITO-TRM-CIRCULAR-CCE',
      tipo: 'CIRCULAR_CCE',
      referenciaOficial: 'Circular Externa No. 01 de Colombia Compra Eficiente',
      organismoEmisor: 'Agencia Nacional de Contratación Pública (CCE)',
      fechaEmision: '2023-08-10',
      titulo: 'Lineamientos de Matriz de Riesgos para Mitigación Cambiaria en Servicios Nube y TIC',
      sintesisDoctrinaria:
        'Recomienda a las entidades no trasladar el 100% del riesgo cambiario al contratista en contratos de tecnología o licenciamiento indexado a moneda extranjera.',
      extractoJurisprudencial:
        '"Para preservar el equilibrio económico del contrato (Art. 27 Ley 80 de 1993), las entidades deberán establecer en los Estudios Previos una banda de fluctuación cambiaria compartida (típicamente +/- 10%), a partir de la cual el Estado absorbe el impacto devaluatorio."',
      variableEntornoAfectada: 'CORREDOR_TRM_NUBE_OBLIGATORIO',
      descripcionImpactoEntorno:
        'Inyecta obligatoriamente la cláusula de corredor cambiario compartida en la formulación de Estudios Previos y en la Audiencia de Riesgos.',
      moduloImpactado: 'Matriz de Riesgos, Estudios Previos EDP & Gestor Go/No-Go',
      activoEnEntorno: true
    },
    {
      id: 'HITO-ANTICORRUPCION-LEY2195',
      tipo: 'LEY_REPUBLICA',
      referenciaOficial: 'Ley 2195 de 2022 (Art. 13 - Transparencia y Lucha contra la Corrupción)',
      organismoEmisor: 'Congreso de la República',
      fechaEmision: '2022-01-18',
      titulo: 'Declaración Obligatoria de Beneficiarios Finales y Grupos Empresariales',
      sintesisDoctrinaria:
        'Exige a los oferentes y miembros de Consorcios declarar sus beneficiarios finales y composición accionaria con más del 5% de participación para prevenir conflictos de interés.',
      extractoJurisprudencial:
        '"Toda persona jurídica nacional o extranjera que participe en procesos de contratación pública deberá identificar e individualizar a sus beneficiarios finales ante el Registro Único Empresarial y Social (RUES)."',
      variableEntornoAfectada: 'BENEFICIARIOS_FINALES_ANTICORRUPCION',
      descripcionImpactoEntorno:
        'Verifica la trazabilidad de beneficiarios finales de Sanjuanés Soluciones e Ingelecgroup BIC en las actas de adjudicación y consorcios.',
      moduloImpactado: 'Gestor de Consorcios (Art. 7) & Asistente de Propuestas',
      activoEnEntorno: true
    },
    {
      id: 'HITO-SANDBOX-COMPRAS-POPULARES',
      tipo: 'PROYECTO_EN_TRAMITE',
      referenciaOficial: 'Proyecto de Reforma Ley 80 / Asociaciones Público-Populares (Dcto. 142/2023)',
      organismoEmisor: 'Mesa de Concertación de Compras Públicas / Departamento Nacional de Planeación',
      fechaEmision: '2025-01-15',
      titulo: 'Sandbox Regulatorio: Régimen Especial para Asociaciones Público-Populares y Juntas Comunales',
      sintesisDoctrinaria:
        'Permite contratación directa hasta la menor cuantía con organizaciones de base comunitaria, economía popular y cooperativas rurales sin exigir RUP.',
      extractoJurisprudencial:
        '"(En trámite) Se autoriza a las entidades territoriales la suscripción de convenios solidarios y contratos de desarrollo comunitario con asociaciones populares hasta por 300 SMMLV con régimen simplificado de pólizas."',
      variableEntornoAfectada: 'REFORMA_COMPRAS_POPULARES_SANDBOX',
      descripcionImpactoEntorno:
        'Activa la simulación de contratación comunitaria en SECOP II con exención de índices financieros de RUP para entidades rurales.',
      moduloImpactado: 'SECOP II Entidad & Simulador de Modalidades',
      activoEnEntorno: false,
      esSandboxReforma: true
    }
  ];

  /**
   * Parámetros base por defecto del Entorno Regulatorio
   */
  public static readonly PARAMETROS_DEFAULT: ParametrosEntornoRegulatorio = {
    exclusividadRupActiva: true,
    preferenciaSociedadesBicActiva: true,
    limiteEstrictoAdendasLey1882: true,
    corredorCambiarioTrmObligatorio: true,
    beneficiariosFinalesActivos: true,
    sandboxComprasPopularesActivo: false,
    valorSMMLV_COP: SMMLV_2026, // SMMLV 2026 (Decreto 1469 de 2025)
    anoVigenciaFiscal: 2026
  };

  /**
   * Diagnostica el estado general de calibración del entorno regulatorio
   */
  public static diagnosticarSaludEntorno(params: ParametrosEntornoRegulatorio): {
    porcentajeBlindaje: number;
    nivelSeguridadJuridica: 'MÁXIMO_BLINDAJE' | 'MEDIO_CON_RIESGOS' | 'VULNERABLE';
    alertas: string[];
  } {
    let puntuacion = 0;
    const alertas: string[] = [];

    if (params.exclusividadRupActiva) {
      puntuacion += 25;
    } else {
      alertas.push('Alerta: Principio de Taxatividad del RUP desactivado. Riesgo de pliegos sastre no detectados.');
    }

    if (params.preferenciaSociedadesBicActiva) {
      puntuacion += 20;
    } else {
      alertas.push('Alerta: Régimen de Sociedades BIC (Ley 2069) desactivado. Se omitirá desempate a empresas BIC.');
    }

    if (params.limiteEstrictoAdendasLey1882) {
      puntuacion += 25;
    } else {
      alertas.push('Alerta: Límite de 3 días de la Ley 1882 desactivado. Posible vulneración de plazos procesales.');
    }

    if (params.corredorCambiarioTrmObligatorio) {
      puntuacion += 15;
    } else {
      alertas.push('Alerta: Riesgo cambiario no compartido. Contratos TIC expuestos a desequilibrio económico.');
    }

    if (params.beneficiariosFinalesActivos) {
      puntuacion += 15;
    } else {
      alertas.push('Alerta: Control de beneficiarios finales desactivado.');
    }

    let nivelSeguridadJuridica: 'MÁXIMO_BLINDAJE' | 'MEDIO_CON_RIESGOS' | 'VULNERABLE' = 'MÁXIMO_BLINDAJE';
    if (puntuacion < 60) {
      nivelSeguridadJuridica = 'VULNERABLE';
    } else if (puntuacion < 90) {
      nivelSeguridadJuridica = 'MEDIO_CON_RIESGOS';
    }

    return {
      porcentajeBlindaje: puntuacion,
      nivelSeguridadJuridica,
      alertas
    };
  }
}
