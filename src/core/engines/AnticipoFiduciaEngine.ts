// Anticipo y fiducia en contratos de obra (Art. 91 Ley 1474 de 2011).
// Verificado en el Concepto C-814 de 2025 de Colombia Compra Eficiente:
//  - El anticipo no puede exceder el 50 % del valor del contrato.
//  - Fiducia o patrimonio autónomo irrevocable obligatorio cuando se pacta anticipo en contratos de obra,
//    concesión o salud que no sean de menor o mínima cuantía, y en todos los de licitación pública.
// El 20 % es una referencia pedagógica adoptada en la orden de trabajo, no un límite legal.

export type NivelCuantiaAnticipo = 'MINIMA' | 'MENOR' | 'MAYOR';

export interface DictamenAnticipo {
  aplicaFiduciaObligatoria: boolean;
  anticipoCOP: number;
  topeLegalCOP: number;
  referenciaSugeridaCOP: number;
  superaTopeLegal: boolean;
  superaReferencia: boolean;
  mensajes: string[];
  requisitos: string[];
}

export class AnticipoFiduciaEngine {
  public static readonly TOPE_LEGAL_PCT = 50;
  public static readonly REFERENCIA_SUGERIDA_PCT = 20;

  public static evaluar(params: {
    esObra: boolean;
    nivelCuantia: NivelCuantiaAnticipo;
    valorContratoCOP: number;
    anticipoPct: number;
  }): DictamenAnticipo {
    const { esObra, nivelCuantia, valorContratoCOP, anticipoPct } = params;
    const licitacion = nivelCuantia === 'MAYOR';
    const aplicaFiduciaObligatoria = (esObra && nivelCuantia !== 'MINIMA' && nivelCuantia !== 'MENOR') || licitacion;
    const anticipoCOP = Math.round(valorContratoCOP * (anticipoPct / 100));
    const topeLegalCOP = Math.round(valorContratoCOP * (this.TOPE_LEGAL_PCT / 100));
    const referenciaSugeridaCOP = Math.round(valorContratoCOP * (this.REFERENCIA_SUGERIDA_PCT / 100));
    const superaTopeLegal = anticipoPct > this.TOPE_LEGAL_PCT;
    const superaReferencia = anticipoPct > this.REFERENCIA_SUGERIDA_PCT;
    const mensajes: string[] = [];
    if (superaTopeLegal) {
      mensajes.push(`El anticipo (${anticipoPct}%) supera el tope legal del ${this.TOPE_LEGAL_PCT}% del valor del contrato.`);
    } else if (superaReferencia) {
      mensajes.push(`Dentro del tope legal (${this.TOPE_LEGAL_PCT}%), pero por encima de la referencia sugerida de ${this.REFERENCIA_SUGERIDA_PCT}%: justifícalo en el estudio previo.`);
    } else {
      mensajes.push(`Anticipo dentro de la referencia sugerida (${this.REFERENCIA_SUGERIDA_PCT}%) y del tope legal (${this.TOPE_LEGAL_PCT}%).`);
    }
    const requisitos = aplicaFiduciaObligatoria
      ? [
          'Constituir fiducia mercantil o patrimonio autónomo irrevocable para administrar el anticipo (Art. 91 Ley 1474 de 2011).',
          'El anticipo se entrega a la fiduciaria y no al contratista; no hace parte de su patrimonio hasta que se amortice.',
          'Plan de utilización del anticipo, con los desembolsos sujetos a la aprobación previa de la interventoría técnica (práctica que el pliego y el contrato deben establecer expresamente).',
          'El pliego debe fijar los términos y condiciones de administración del anticipo; el costo de la fiducia puede incluirse en la administración del AIU.'
        ]
      : ['En este caso la fiducia del Art. 91 no es obligatoria; si se pacta anticipo, define igualmente su manejo y amortización en el contrato.'];
    return { aplicaFiduciaObligatoria, anticipoCOP, topeLegalCOP, referenciaSugeridaCOP, superaTopeLegal, superaReferencia, mensajes, requisitos };
  }
}
