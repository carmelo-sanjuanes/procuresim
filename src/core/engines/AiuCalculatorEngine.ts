// Calculadora Analítica de AIU (Administración, Imprevistos y Utilidad)
// Conforme a la Guía de CCE para Obras y el Artículo 462-1 del Estatuto Tributario (IVA sobre Utilidad)
export interface EstructuraCostosDirectos {
  materialesCOP: number;
  manoDeObraDirectaCOP: number;
  factorPrestacionalPct: number; // Típico en Colombia: 52% (cesantías, primas, salud, pensión, ARL, parafiscales)
  equiposMaquinariaCOP: number;
  transporteLogisticaCOP: number;
}

export interface EstructuraAIU {
  administracionPct: number; // Típico: 12% - 18%
  imprevistosPct: number;    // Típico: 1% - 5%
  utilidadPct: number;        // Típico: 3% - 8%
  tarifaIvaPct: number;       // Típico: 19%
}

export interface ResultadoCalculoAIU {
  costoDirectoTotalCOP: number;
  manoDeObraTotalConPrestacionesCOP: number;
  valorAdministracionCOP: number;
  valorImprevistosCOP: number;
  valorUtilidadCOP: number;
  valorTotalAIUCOP: number;
  aiuTotalPct: number;
  // Impacto Tributario Estatuto Tributario Art. 462-1
  ivaSobreUtilidadLegalCOP: number;
  ivaTotalErroneoSiFueraSobreTotalCOP: number;
  ahorroTributarioLegalCOP: number;
  precioTotalPropuestaEconomicaCOP: number;
  desglosePorcentual: {
    directoPct: number;
    adminPct: number;
    imprevistosPct: number;
    utilidadPct: number;
    ivaPct: number;
  };
}

export class AiuCalculatorEngine {
  public static calcular(
    directos: EstructuraCostosDirectos,
    aiu: EstructuraAIU
  ): ResultadoCalculoAIU {
    const manoDeObraConPrestaciones =
      directos.manoDeObraDirectaCOP * (1 + directos.factorPrestacionalPct / 100);

    const costoDirectoTotal =
      directos.materialesCOP +
      manoDeObraConPrestaciones +
      directos.equiposMaquinariaCOP +
      directos.transporteLogisticaCOP;

    const valorAdmin = Math.round(costoDirectoTotal * (aiu.administracionPct / 100));
    const valorImprevistos = Math.round(costoDirectoTotal * (aiu.imprevistosPct / 100));
    const valorUtilidad = Math.round(costoDirectoTotal * (aiu.utilidadPct / 100));
    const valorTotalAIU = valorAdmin + valorImprevistos + valorUtilidad;
    const aiuTotalPct = Number((aiu.administracionPct + aiu.imprevistosPct + aiu.utilidadPct).toFixed(2));

    // IVA legal según Art. 462-1: Se causa ÚNICAMENTE sobre la porción de Utilidad (U)
    const ivaSobreUtilidad = Math.round(valorUtilidad * (aiu.tarifaIvaPct / 100));

    // Si erróneamente se calculara sobre el subtotal completo
    const subtotal = costoDirectoTotal + valorTotalAIU;
    const ivaErroneo = Math.round(subtotal * (aiu.tarifaIvaPct / 100));
    const ahorroTributario = ivaErroneo - ivaSobreUtilidad;

    const precioTotal = subtotal + ivaSobreUtilidad;

    return {
      costoDirectoTotalCOP: Math.round(costoDirectoTotal),
      manoDeObraTotalConPrestacionesCOP: Math.round(manoDeObraConPrestaciones),
      valorAdministracionCOP: valorAdmin,
      valorImprevistosCOP: valorImprevistos,
      valorUtilidadCOP: valorUtilidad,
      valorTotalAIUCOP: valorTotalAIU,
      aiuTotalPct,
      ivaSobreUtilidadLegalCOP: ivaSobreUtilidad,
      ivaTotalErroneoSiFueraSobreTotalCOP: ivaErroneo,
      ahorroTributarioLegalCOP: ahorroTributario,
      precioTotalPropuestaEconomicaCOP: precioTotal,
      desglosePorcentual: {
        directoPct: Number(((costoDirectoTotal / precioTotal) * 100).toFixed(2)),
        adminPct: Number(((valorAdmin / precioTotal) * 100).toFixed(2)),
        imprevistosPct: Number(((valorImprevistos / precioTotal) * 100).toFixed(2)),
        utilidadPct: Number(((valorUtilidad / precioTotal) * 100).toFixed(2)),
        ivaPct: Number(((ivaSobreUtilidad / precioTotal) * 100).toFixed(2))
      }
    };
  }
}
