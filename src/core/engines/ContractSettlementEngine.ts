// Motor de Liquidación de Contratos Estatales
// Conforme al Artículo 11 de la Ley 1150 de 2007 y Artículos 60 y 61 de la Ley 80 de 1993
export interface ParametrosLiquidacionContrato {
  numeroContrato: string;
  objetoContrato: string;
  nombreEntidad: string;
  nombreContratista: string;
  nitContratista: string;
  supervisorInterventor: string;
  valorInicialCOP: number;
  adicionesCOP: number;
  valorTotalEjecutadoActasCOP: number;
  anticipoDesembolsadoCOP: number;
  anticipoAmortizadoCOP: number;
  retencionesPracticadasCOP: number; // ReteFuente, ReteICA, estampillas
  mayoresCantidadesReconocidasCOP: number;
  multasDescontadasCOP: number;
  tipoLiquidacion: 'BILATERAL_MUTUO_ACUERDO' | 'UNILATERAL_POR_RESOLUCION';
  incluyeSalvedades: boolean;
  textoSalvedades?: string;
}

export interface BalanceLiquidacionFinal {
  valorTotalConvenidoCOP: number;
  valorTotalEjecutadoCOP: number;
  saldoLiberarPresupuestoCOP: number; // Recursos no ejecutados que se devuelven al PAC
  saldoAnticipoPendienteReintegrarCOP: number;
  saldoLiquidacionAFavorContratistaCOP: number;
  saldoLiquidacionAFavorEntidadCOP: number;
  estadoPazYSalvo: boolean;
  actaLiquidacionTextoOficial: string;
}

export class ContractSettlementEngine {
  public static liquidar(parametros: ParametrosLiquidacionContrato): BalanceLiquidacionFinal {
    const valorConvenido = parametros.valorInicialCOP + parametros.adicionesCOP;
    const valorEjecutado = parametros.valorTotalEjecutadoActasCOP + parametros.mayoresCantidadesReconocidasCOP;

    // Recursos presupuestales no ejecutados que la entidad debe descomprometer/liberar
    const saldoLiberar = Math.max(0, valorConvenido - valorEjecutado);

    // Anticipo no amortizado
    const saldoAnticipoPendiente = Math.max(0, parametros.anticipoDesembolsadoCOP - parametros.anticipoAmortizadoCOP);

    // Neto a pagar o cobrar
    // Neto = Ejecutado - Anticipo ya pagado (o amortizado) - Retenciones - Multas
    const pagosPendientesBrutos = Math.max(0, valorEjecutado - parametros.anticipoAmortizadoCOP);
    const deducciones = parametros.retencionesPracticadasCOP + parametros.multasDescontadasCOP + saldoAnticipoPendiente;

    let saldoAFavorContratista = 0;
    let saldoAFavorEntidad = 0;

    if (pagosPendientesBrutos >= deducciones) {
      saldoAFavorContratista = pagosPendientesBrutos - deducciones;
    } else {
      saldoAFavorEntidad = deducciones - pagosPendientesBrutos;
    }

    const pazYSalvo = saldoAFavorEntidad === 0 && !parametros.incluyeSalvedades;

    const fechaHoy = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const actaTexto = `ACTA DE LIQUIDACIÓN ${parametros.tipoLiquidacion === 'BILATERAL_MUTUO_ACUERDO' ? 'BILATERAL' : 'UNILATERAL'} DEL CONTRATO N.° ${parametros.numeroContrato}
(Artículo 11 de la Ley 1150 de 2007)

En la fecha ${fechaHoy}, se reunieron de una parte el Supervisor/Interventor en representación de la entidad ${parametros.nombreEntidad}, y de la otra el Contratista ${parametros.nombreContratista} (NIT ${parametros.nitContratista}), con el fin de suscribir la presente Acta de Liquidación.

1. BALANCE FINANCIERO Y PRESUPUESTAL CONSOLIDADO:
- Valor Inicial Contratado: $${parametros.valorInicialCOP.toLocaleString('es-CO')} COP
- Valor Adiciones Formales: $${parametros.adicionesCOP.toLocaleString('es-CO')} COP
- VALOR TOTAL CONVENIDO: $${valorConvenido.toLocaleString('es-CO')} COP
- VALOR TOTAL EJECUTADO Y APROBADO: $${valorEjecutado.toLocaleString('es-CO')} COP
- SALDO A LIBERAR PRESUPUESTALMENTE: $${saldoLiberar.toLocaleString('es-CO')} COP

2. CRUCE DE CUENTAS, ANTICIPOS Y DEDUCCIONES:
- Anticipo Entregado: $${parametros.anticipoDesembolsadoCOP.toLocaleString('es-CO')} COP
- Anticipo Amortizado: $${parametros.anticipoAmortizadoCOP.toLocaleString('es-CO')} COP
- Saldo de Anticipo Pendiente: $${saldoAnticipoPendiente.toLocaleString('es-CO')} COP
- Descuentos de Ley / Multas: $${(parametros.retencionesPracticadasCOP + parametros.multasDescontadasCOP).toLocaleString('es-CO')} COP
- SALDO NETO A FAVOR DEL CONTRATISTA: $${saldoAFavorContratista.toLocaleString('es-CO')} COP
- SALDO A REINTEGRAR A LA ENTIDAD: $${saldoAFavorEntidad.toLocaleString('es-CO')} COP

3. MANIFESTACIÓN DE PAZ Y SALVO Y SALVEDADES:
${parametros.incluyeSalvedades
  ? `SALVEDADES DEL CONTRATISTA: "${parametros.textoSalvedades || 'El contratista se reserva el derecho de acudir a la jurisdicción contencioso administrativa por reclamaciones de desequilibrio económico.'}"`
  : 'Las partes declaran que con el pago del saldo aquí liquidado, se declaran a paz y salvo recíproco por todo concepto derivado del contrato.'}

En constancia se firma por las partes intervinientes.`;

    return {
      valorTotalConvenidoCOP: valorConvenido,
      valorTotalEjecutadoCOP: valorEjecutado,
      saldoLiberarPresupuestoCOP: saldoLiberar,
      saldoAnticipoPendienteReintegrarCOP: saldoAnticipoPendiente,
      saldoLiquidacionAFavorContratistaCOP: saldoAFavorContratista,
      saldoLiquidacionAFavorEntidadCOP: saldoAFavorEntidad,
      estadoPazYSalvo: pazYSalvo,
      actaLiquidacionTextoOficial: actaTexto
    };
  }
}
