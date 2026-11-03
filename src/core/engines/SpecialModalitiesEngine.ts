// Motor de modalidades especiales y atípicas (familias de ProcureSim).
// Cada función recibe datos que digita el usuario y devuelve un dictamen; nada se inventa.
//
// Fuentes verificadas en esta ronda:
//  - Decreto 092 de 2017, Art. 4 (proceso competitivo) y Art. 5 (aporte de la ESAL no inferior al 30 %
//    del valor total del convenio, en dinero).
//  - Art. 42 y 43 Ley 80 de 1993 (urgencia manifiesta y remisión del expediente al control fiscal).
//  - Art. 8 Ley 80 de 1993 (inhabilidad de 5 años por caducidad) y Art. 18 (caducidad).
//  - Art. 86 Ley 1474 de 2011 (procedimiento sancionatorio).
// No verificadas contra el texto oficial (regla adoptada por el usuario en su orden de trabajo):
//  - Límite del 50 % de subcontratación en contratos interadministrativos (Ley 2195 de 2022).

import { SMMLV_2026 } from '../domain/constants';

export interface DictamenEspecial {
  nivel: 'OK' | 'ALERTA' | 'BLOQUEO';
  titulo: string;
  detalle: string;
  fundamento: string;
  pasos: string[];
}

export class SpecialModalitiesEngine {
  /** Contrato interadministrativo: alerta si la entidad ejecutora subcontrata más del 50 % con privados. */
  public static evaluarTriangulacion(valorContratoCOP: number, valorSubcontratadoPrivadosCOP: number): DictamenEspecial {
    const fundamento =
      'Ley 2195 de 2022 y Art. 2 num. 4 lit. c) Ley 1150 de 2007 (contratos interadministrativos). El tope del 50 % es la regla adoptada en la orden de trabajo; confirma el artículo exacto antes de citarlo en un acto real.';
    if (valorContratoCOP <= 0) {
      return { nivel: 'OK', titulo: 'Falta el valor del contrato', detalle: 'Digita el valor del contrato y lo que se subcontrataría con privados.', fundamento, pasos: [] };
    }
    const pct = (valorSubcontratadoPrivadosCOP / valorContratoCOP) * 100;
    if (pct > 50) {
      return {
        nivel: 'ALERTA',
        titulo: `Posible triangulación: ${pct.toFixed(1)} % se subcontrata con privados`,
        detalle:
          'La entidad pública contratada estaría actuando como intermediaria: recibe el contrato sin competencia y entrega la mayor parte de la ejecución a particulares. Esto desnaturaliza el contrato interadministrativo.',
        fundamento,
        pasos: [
          'Verificar que el objeto esté dentro de las funciones y la capacidad operativa de la entidad ejecutora.',
          'Si se necesita contratar con privados más de la mitad, usar una modalidad competitiva (licitación, selección abreviada o concurso) en lugar del contrato interadministrativo.',
          'Dejar en el estudio previo la justificación de la capacidad real de la entidad ejecutora y el esquema de subcontratación.'
        ]
      };
    }
    return {
      nivel: 'OK',
      titulo: `Subcontratación con privados: ${pct.toFixed(1)} %`,
      detalle: 'Dentro del límite del 50 %. Mantén la supervisión de la entidad ejecutora sobre los subcontratistas.',
      fundamento,
      pasos: ['Documentar en el estudio previo el porcentaje que ejecutará directamente la entidad ejecutora.']
    };
  }

  /** Convenio de asociación con ESAL (Decreto 092 de 2017): el aporte debe ser ≥ 30 % del valor total, en dinero. */
  public static evaluarAporteEsal(valorTotalConvenioCOP: number, aporteDineroEsalCOP: number, aporteEspecieEsalCOP: number): DictamenEspecial {
    const fundamento = 'Decreto 092 de 2017, Art. 4 (proceso competitivo) y Art. 5 (aporte no inferior al 30 % del valor total del convenio, en dinero).';
    if (valorTotalConvenioCOP <= 0) {
      return { nivel: 'OK', titulo: 'Falta el valor del convenio', detalle: 'Digita el valor total del convenio y el aporte de la ESAL.', fundamento, pasos: [] };
    }
    const pctDinero = (aporteDineroEsalCOP / valorTotalConvenioCOP) * 100;
    const pctEspecie = (aporteEspecieEsalCOP / valorTotalConvenioCOP) * 100;
    const minimoCOP = Math.ceil(valorTotalConvenioCOP * 0.3);
    if (pctDinero >= 30) {
      return {
        nivel: 'OK',
        titulo: `Aporte en dinero de la ESAL: ${pctDinero.toFixed(1)} %`,
        detalle:
          'Cumple el mínimo del 30 %. Si varias ESAL ofrecen ese aporte, la entidad debe seleccionar de forma objetiva y justificar los criterios. No hay que hacer el proceso competitivo del Art. 4 por este motivo.',
        fundamento,
        pasos: [
          'Exigir certificación del aporte (recursos propios o de cooperación internacional) y su soporte bancario.',
          'Registrar el aporte en el convenio y en la supervisión del gasto.'
        ]
      };
    }
    return {
      nivel: 'BLOQUEO',
      titulo: `Aporte insuficiente: ${pctDinero.toFixed(1)} % en dinero (mínimo 30 % = $${minimoCOP.toLocaleString('es-CO')})`,
      detalle:
        `No puede tramitarse como convenio de asociación sin competencia. Debe adelantarse el proceso competitivo del Art. 4 entre ESAL.${aporteEspecieEsalCOP > 0 ? ` El aporte en especie declarado (${pctEspecie.toFixed(1)} %) no completa el mínimo según el Art. 5 (verifica el concepto aplicable).` : ''}`,
      fundamento,
      pasos: [
        'Definir y publicar los indicadores y criterios de ponderación.',
        'Fijar un plazo razonable para recibir ofertas de las ESAL.',
        'Evaluar con los criterios publicados y adjudicar de forma motivada.'
      ]
    };
  }

  /** Urgencia manifiesta (Arts. 42 y 43 Ley 80 de 1993). */
  public static recordatoriosUrgenciaManifiesta(): DictamenEspecial {
    return {
      nivel: 'ALERTA',
      titulo: 'Urgencia manifiesta: contratación inmediata con control fiscal posterior',
      detalle:
        'Se puede contratar sin los procedimientos de selección ordinarios, pero solo lo indispensable para conjurar la emergencia. Después de celebrar los contratos, el expediente debe enviarse de inmediato al órgano de control fiscal competente.',
      fundamento:
        'Arts. 42 y 43 Ley 80 de 1993. El Art. 43 ordena remitir el expediente "inmediatamente" y fija 2 meses para el pronunciamiento del órgano de control. El plazo de 3 días hábiles de la orden de trabajo no pude confirmarlo en la norma: úsalo como meta interna si tu entidad lo tiene.',
      pasos: [
        'Acto administrativo motivado que declare la urgencia (hecho, necesidad inmediata y límite del objeto).',
        'Celebrar los contratos necesarios; no incluir obras definitivas que no sean de atención inmediata.',
        'Remitir de inmediato el expediente (acto, antecedentes y pruebas de los hechos) a la Contraloría competente.',
        'Si el contrato requiere presupuesto, hacer los traslados o adiciones presupuestales necesarios.'
      ]
    };
  }

  /** Sancionatorio con aseguradora; caducidad (Art. 18 Ley 80) y multa (Art. 86 Ley 1474). */
  public static procedimientoSancionatorio(tipo: 'MULTA' | 'CADUCIDAD', valorContratoCOP: number): DictamenEspecial {
    const comunes = [
      'Informe del supervisor o interventor que describe el presunto incumplimiento y su tasación.',
      'Citación escrita al contratista y a la aseguradora garante, con el informe y las normas y cláusulas posiblemente violadas.',
      'Audiencia: presentación de descargos, práctica de pruebas y alegatos; la aseguradora puede intervenir y objetar.'
    ];
    if (tipo === 'MULTA') {
      return {
        nivel: 'ALERTA',
        titulo: 'Procedimiento para imponer multa',
        detalle: 'La multa es un apremio al cumplimiento y se rige por lo pactado en el contrato.',
        fundamento: 'Art. 86 Ley 1474 de 2011 y Art. 17 Ley 1150 de 2007.',
        pasos: [...comunes, 'Resolución motivada en la audiencia, notificada en estrados; recurso de reposición que se resuelve en la misma audiencia.']
      };
    }
    return {
      nivel: 'BLOQUEO',
      titulo: 'Caducidad del contrato',
      detalle:
        `Cuando el incumplimiento afecta grave y directamente la ejecución y evidencia riesgo de paralización, la entidad puede declarar la caducidad por acto motivado. Efectos: terminación y liquidación en el estado en que se encuentre, y exigibilidad de la cláusula penal y de la garantía (valor del contrato de referencia: $${valorContratoCOP.toLocaleString('es-CO')} ≈ ${(valorContratoCOP / SMMLV_2026).toFixed(1)} SMMLV).`,
      fundamento: 'Art. 18 Ley 80 de 1993 (caducidad), Art. 86 Ley 1474 de 2011 (procedimiento) y Art. 8 num. 1 lit. c) Ley 80 de 1993 (inhabilidad).',
      pasos: [
        ...comunes,
        'Acto administrativo motivado de caducidad, notificado al contratista y a la aseguradora; recurso de reposición.',
        'Declaratoria del siniestro de incumplimiento y reclamación a la aseguradora con el acto ejecutoriado.',
        'Inhabilidad sobreviniente: el contratista (y, si es plural, sus integrantes) queda inhabilitado por 5 años contados desde la ejecutoria del acto.',
        'Registrar la sanción en el RUP y reportarla en el SECOP; continuar con la liquidación unilateral o con un nuevo contratista.'
      ]
    };
  }
}
