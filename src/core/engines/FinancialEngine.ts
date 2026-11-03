import { SMMLV_2026 } from '../domain/constants';
import type { ProponenteDatos, RequisitosHabilitantes } from '../domain/types';

export interface EvaluacionFinancieraDetalle {
  indiceLiquidez: {
    valor: number;
    exigido: number;
    cumple: boolean;
    formula: string;
  };
  nivelEndeudamiento: {
    valorPct: number;
    exigidoPct: number;
    cumple: boolean;
    formula: string;
  };
  coberturaIntereses: {
    valor: number;
    exigido: number;
    cumple: boolean;
    formula: string;
    observacion?: string;
  };
  capitalTrabajo: {
    valor: number;
    exigido: number;
    cumple: boolean;
  };
  rentabilidadPatrimonio: {
    valorPct: number;
    exigidoPct: number;
    cumple: boolean;
  };
  rentabilidadActivo: {
    valorPct: number;
    exigidoPct: number;
    cumple: boolean;
  };
  resultadoGeneral: 'HABILITADO' | 'NO_HABILITADO';
  dictamenJuridicoFinanciero: string;
}

export class FinancialEngine {
  /**
   * Calcula los indicadores financieros a partir de las cuentas contables del RUP
   */
  public static evaluarCapacidadFinanciera(
    proponente: ProponenteDatos,
    requisitos: RequisitosHabilitantes
  ): EvaluacionFinancieraDetalle {
    // 1. Índice de Liquidez = Activo Corriente / Pasivo Corriente
    const indiceLiquidez =
      proponente.pasivoCorriente > 0
        ? Number((proponente.activoCorriente / proponente.pasivoCorriente).toFixed(2))
        : proponente.activoCorriente > 0
        ? 999.0 // Si no tiene pasivo corriente y tiene activo corriente
        : 0;
    const cumpleLiquidez = indiceLiquidez >= requisitos.indiceLiquidezMinimo;

    // 2. Nivel de Endeudamiento = (Pasivo Total / Activo Total) * 100
    const nivelEndeudamiento =
      proponente.activoTotal > 0
        ? Number(((proponente.pasivoTotal / proponente.activoTotal) * 100).toFixed(2))
        : 100;
    const cumpleEndeudamiento = nivelEndeudamiento <= requisitos.nivelEndeudamientoMaximoPct;

    // 3. Razón de Cobertura de Intereses = Utilidad Operacional / Gastos de Intereses
    let coberturaIntereses = 0;
    let cumpleCobertura = false;
    let obsCobertura = '';

    if (proponente.gastosIntereses === 0) {
      if (proponente.utilidadOperacional >= 0) {
        coberturaIntereses = 999.0;
        cumpleCobertura = true;
        obsCobertura = 'No registra gastos por intereses y reporta utilidad operacional positiva (Cumple plenamente según directriz CCE).';
      } else {
        coberturaIntereses = 0;
        cumpleCobertura = false;
        obsCobertura = 'No registra gastos de intereses pero reporta pérdida operacional.';
      }
    } else {
      coberturaIntereses = Number((proponente.utilidadOperacional / proponente.gastosIntereses).toFixed(2));
      cumpleCobertura = coberturaIntereses >= requisitos.coberturaInteresesMinima;
    }

    // 4. Capital de Trabajo = Activo Corriente - Pasivo Corriente
    const capitalTrabajo = proponente.activoCorriente - proponente.pasivoCorriente;
    const cumpleCapitalTrabajo = capitalTrabajo >= requisitos.capitalTrabajoMinimoCOP;

    // 5. Rentabilidad del Patrimonio (ROE) = (Utilidad Neta / Patrimonio) * 100
    const roe =
      proponente.patrimonio > 0
        ? Number(((proponente.utilidadNeta / proponente.patrimonio) * 100).toFixed(2))
        : 0;
    const cumpleRoe = roe >= requisitos.rentabilidadPatrimonioMinimaPct;

    // 6. Rentabilidad del Activo (ROA) = (Utilidad Neta / Activo Total) * 100
    const roa =
      proponente.activoTotal > 0
        ? Number(((proponente.utilidadNeta / proponente.activoTotal) * 100).toFixed(2))
        : 0;
    const cumpleRoa = roa >= requisitos.rentabilidadActivoMinimaPct;

    const todosCumplen =
      cumpleLiquidez &&
      cumpleEndeudamiento &&
      cumpleCobertura &&
      cumpleCapitalTrabajo &&
      cumpleRoe &&
      cumpleRoa;

    const resultadoGeneral: 'HABILITADO' | 'NO_HABILITADO' = todosCumplen ? 'HABILITADO' : 'NO_HABILITADO';

    let dictamen = '';
    if (resultadoGeneral === 'HABILITADO') {
      dictamen = `El proponente ${proponente.razonSocial} cumple a cabalidad con la totalidad de los indicadores de capacidad financiera y organizacional exigidos en el pliego de condiciones según su Registro Único de Proponentes (RUP).`;
    } else {
      const fallos: string[] = [];
      if (!cumpleLiquidez) fallos.push(`Liquidez (${indiceLiquidez} < ${requisitos.indiceLiquidezMinimo})`);
      if (!cumpleEndeudamiento) fallos.push(`Endeudamiento (${nivelEndeudamiento}% > ${requisitos.nivelEndeudamientoMaximoPct}%)`);
      if (!cumpleCobertura) fallos.push(`Cobertura Intereses (${coberturaIntereses} < ${requisitos.coberturaInteresesMinima})`);
      if (!cumpleCapitalTrabajo) fallos.push(`Capital de Trabajo (\$${capitalTrabajo.toLocaleString('es-CO')} < \$${requisitos.capitalTrabajoMinimoCOP.toLocaleString('es-CO')})`);
      if (!cumpleRoe) fallos.push(`Rentabilidad Patrimonio (${roe}% < ${requisitos.rentabilidadPatrimonioMinimaPct}%)`);
      if (!cumpleRoa) fallos.push(`Rentabilidad Activo (${roa}% < ${requisitos.rentabilidadActivoMinimaPct}%)`);

      dictamen = `El proponente ${proponente.razonSocial} NO resulta habilitado financieramente debido al incumplimiento de: ${fallos.join(', ')}. Recuerde que los requisitos habilitantes financieros NO son subsanables si implican modificación del corte contable del RUP a la fecha de cierre.`;
    }

    return {
      indiceLiquidez: {
        valor: indiceLiquidez,
        exigido: requisitos.indiceLiquidezMinimo,
        cumple: cumpleLiquidez,
        formula: 'Activo Corriente / Pasivo Corriente'
      },
      nivelEndeudamiento: {
        valorPct: nivelEndeudamiento,
        exigidoPct: requisitos.nivelEndeudamientoMaximoPct,
        cumple: cumpleEndeudamiento,
        formula: '(Pasivo Total / Activo Total) * 100'
      },
      coberturaIntereses: {
        valor: coberturaIntereses,
        exigido: requisitos.coberturaInteresesMinima,
        cumple: cumpleCobertura,
        formula: 'Utilidad Operacional / Gastos Intereses',
        observacion: obsCobertura
      },
      capitalTrabajo: {
        valor: capitalTrabajo,
        exigido: requisitos.capitalTrabajoMinimoCOP,
        cumple: cumpleCapitalTrabajo
      },
      rentabilidadPatrimonio: {
        valorPct: roe,
        exigidoPct: requisitos.rentabilidadPatrimonioMinimaPct,
        cumple: cumpleRoe
      },
      rentabilidadActivo: {
        valorPct: roa,
        exigidoPct: requisitos.rentabilidadActivoMinimaPct,
        cumple: cumpleRoa
      },
      resultadoGeneral,
      dictamenJuridicoFinanciero: dictamen
    };
  }

  /**
   * Calcula la Capacidad Residual (K Residual) de Contratación de Obra Pública
   * Conforme a la Guía Metodológica de Colombia Compra Eficiente y el Decreto 1082 de 2015
   */
  public static calcularCapacidadResidual(parametros: {
    experienciaAcreditadaSMMLV: number;
    capacidadFinancieraLiquidez: number;
    personalTecnicoIngenieros: number;
    ingresosOperacionalesSMMLV: number;
    saldosContratosEnEjecucionSMMLV: number;
    kResidualExigidoProcesoSMMLV: number;
  }): {
    puntajeExperiencia: number;
    puntajeFinanciero: number;
    puntajeTecnico: number;
    puntajeOrganizacion: number;
    capacidadOperativaTotalSMMLV: number;
    kResidualResultanteSMMLV: number;
    kResidualResultanteCOP: number;
    cumpleKResidual: boolean;
    smmlvVigenteCOP: number;
    dictamen: string;
  } {
    const smmlvVigenteCOP = SMMLV_2026; // SMMLV de referencia contractual

    // Ponderadores oficiales CCE
    const puntajeExperiencia = Math.min(parametros.experienciaAcreditadaSMMLV * 0.4, 50000);
    const puntajeFinanciero = Math.min(parametros.capacidadFinancieraLiquidez * 1500 * 0.3, 30000);
    const puntajeTecnico = Math.min(parametros.personalTecnicoIngenieros * 2000 * 0.2, 20000);
    const puntajeOrganizacion = Math.min(parametros.ingresosOperacionalesSMMLV * 0.1, 15000);

    const capacidadOperativaTotalSMMLV = Number(
      (puntajeExperiencia + puntajeFinanciero + puntajeTecnico + puntajeOrganizacion).toFixed(2)
    );

    const kResidualResultanteSMMLV = Number(
      Math.max(0, capacidadOperativaTotalSMMLV - parametros.saldosContratosEnEjecucionSMMLV).toFixed(2)
    );

    const kResidualResultanteCOP = Math.round(kResidualResultanteSMMLV * smmlvVigenteCOP);
    const cumpleKResidual = kResidualResultanteSMMLV >= parametros.kResidualExigidoProcesoSMMLV;

    const dictamen = cumpleKResidual
      ? `El proponente ACREDITA la Capacidad Residual requerida (${kResidualResultanteSMMLV.toLocaleString('es-CO')} SMMLV >= ${parametros.kResidualExigidoProcesoSMMLV.toLocaleString('es-CO')} SMMLV exigidos).`
      : `El proponente NO alcanza el K Residual mínimo exigido (${kResidualResultanteSMMLV.toLocaleString('es-CO')} SMMLV < ${parametros.kResidualExigidoProcesoSMMLV.toLocaleString('es-CO')} SMMLV exigidos). Causal de no habilitación técnica en obra pública.`;

    return {
      puntajeExperiencia: Number(puntajeExperiencia.toFixed(2)),
      puntajeFinanciero: Number(puntajeFinanciero.toFixed(2)),
      puntajeTecnico: Number(puntajeTecnico.toFixed(2)),
      puntajeOrganizacion: Number(puntajeOrganizacion.toFixed(2)),
      capacidadOperativaTotalSMMLV,
      kResidualResultanteSMMLV,
      kResidualResultanteCOP,
      cumpleKResidual,
      smmlvVigenteCOP,
      dictamen
    };
  }
}
