import { SMMLV_2026 } from '../domain/constants';
// Motor de Ciclo de Vida Contractual, Ejecución, Modificaciones y Liquidación
// Fundamento Legal: Ley 80 de 1993, Ley 1150 de 2007, Ley 1474 de 2011 (Estatuto Anticorrupción),
// Decreto 1082 de 2015, Ley 2195 de 2022 (Transparencia) y CPACA (Ley 1437 de 2011).

export interface RequisitosLegalizacion {
  firmaContratoSecop: boolean;
  registroPresupuestalRP: boolean;
  numeroRP: string;
  polizaAprobada: boolean;
  amparosAprobados: {
    buenManejoAnticipo?: { valor: number; porcentaje: number; cumple: boolean };
    cumplimiento: { valor: number; porcentaje: number; cumple: boolean };
    pagoSalariosPrestaciones: { valor: number; porcentaje: number; cumple: boolean };
    calidadEstabilidad: { valor: number; porcentaje: number; cumple: boolean };
    responsabilidadCivilExtracontractual?: { valor: number; cumple: boolean };
  };
  pazYSalvoSeguridadSocial: boolean;
  designacionSupervision: {
    tipo: 'SUPERVISION_INTERNA' | 'INTERVENTORIA_EXTERNA';
    nombreResponsable: string;
    cargoOContrato: string;
    actaPosesionOContratoFirmado: boolean;
  };
  actaInicioSuscrita: boolean;
  fechaInicio: string;
}

export interface ModificacionContractualSimulada {
  tipo: 'ADICION_PRESUPUESTAL' | 'PRORROGA_TIEMPO' | 'SUSPENSION_TEMPORAL' | 'MODIFICACION_TECNICA';
  valorAdicionCOP?: number;
  diasProrroga?: number;
  motivoJustificacion: string;
  esValidaJuridicamente: boolean;
  advertenciaLegal: string;
  fundamentoArticulo: string;
}

export interface ProcedimientoSancionatorioArt86 {
  tipoFalta: 'RETRASO_CRONOGRAMA' | 'INCUMPLIMIENTO_CALIDAD' | 'ABANDONO_OBRA_GRAVE';
  multaEstimadaCOP: number;
  citacionNotificada: boolean;
  llamamientoAseguradora: boolean;
  descargosPresentados: boolean;
  audienciaCelebrada: boolean;
  decisionAdoptada: 'IMPOSICION_MULTA' | 'DECLARATORIA_CADUCIDAD' | 'CONCILIACION_COMPROMISO' | 'ARCHIVO';
  recursoReposicionResuelto: boolean;
  blindajeDebidoProceso: string;
}

export class ContractExecutionLifecycleEngine {
  /**
   * Calcula los valores y porcentajes legales mínimos de la Garantía Única de Cumplimiento
   * según el Decreto 1082 de 2015 (Subsección 1 y 2, Sección 3)
   */
  public static calcularGarantiaUnica(valorContratoCOP: number, tieneAnticipo: boolean = false, porcentajeAnticipo: number = 0) {
    const valorAnticipo = tieneAnticipo ? (valorContratoCOP * porcentajeAnticipo) / 100 : 0;

    return {
      cumplimiento: {
        porcentaje: 10,
        valorCOP: Math.round(valorContratoCOP * 0.10),
        vigenciaTexto: 'Plazo contractual y cuatro (4) meses más'
      },
      salariosYPrestaciones: {
        porcentaje: 5,
        valorCOP: Math.round(valorContratoCOP * 0.05),
        vigenciaTexto: 'Plazo contractual y tres (3) años más'
      },
      calidadEstabilidad: {
        porcentaje: 20,
        valorCOP: Math.round(valorContratoCOP * 0.20),
        vigenciaTexto: 'Cinco (5) años para estabilidad de obras / Un (1) año para calidad de bienes o servicios'
      },
      buenManejoAnticipo: tieneAnticipo ? {
        porcentaje: 100, // 100% del monto del anticipo
        valorCOP: valorAnticipo,
        vigenciaTexto: 'Hasta la liquidación del contrato o amortización total'
      } : null,
      responsabilidadCivilExtracontractual: {
        porcentajeSmmlv: 200,
        valorAproximadoCOP: 200 * SMMLV_2026, // 200 SMMLV (2026: $350.181.000)
        vigenciaTexto: 'Plazo contractual'
      }
    };
  }

  /**
   * Evalúa la viabilidad jurídica de una adición contractual conforme al Artículo 40 de la Ley 80 de 1993
   * Regla de oro: No puede adicionarse en más del 50% del valor inicial expresado en SMMLV.
   */
  public static validarAdicionPresupuestal(valorInicialCOP: number, valorAdicionPropuestaCOP: number): {
    esValida: boolean;
    porcentajeAdicion: number;
    limiteMaximo50COP: number;
    mensajeLegal: string;
    riesgoResponsabilidad: string;
  } {
    const limite50 = valorInicialCOP * 0.50;
    const porcentaje = (valorAdicionPropuestaCOP / valorInicialCOP) * 100;

    if (valorAdicionPropuestaCOP <= limite50) {
      return {
        esValida: true,
        porcentajeAdicion: parseFloat(porcentaje.toFixed(2)),
        limiteMaximo50COP: limite50,
        mensajeLegal: `✓ Adición procedente (${porcentaje.toFixed(1)}%). Respeta el límite perentorio del 50% previsto en el inciso 2° del Artículo 40 de la Ley 80 de 1993. Requiere CDP previo y ajuste proporcional de las pólizas.`,
        riesgoResponsabilidad: 'Blindado disciplinaria y penalmente siempre que esté justificada la necesidad técnica sobreviniente.'
      };
    } else {
      return {
        esValida: false,
        porcentajeAdicion: parseFloat(porcentaje.toFixed(2)),
        limiteMaximo50COP: limite50,
        mensajeLegal: `❌ ADICIÓN ILEGAL (${porcentaje.toFixed(1)}%). Supera el tope perentorio del 50% ($${limite50.toLocaleString('es-CO')} COP) establecido en el Artículo 40 de la Ley 80 de 1993.`,
        riesgoResponsabilidad: 'Configura presunto delito de Contrato sin Cumplimiento de Requisitos Legales (Art. 410 C.P.) e investigación disciplinaria por falta gravísima en Procuraduría.'
      };
    }
  }

  /**
   * Determina si el contrato requiere Supervisión interna o Interventoría externa obligatoria
   * según el Artículo 83 y 84 de la Ley 1474 de 2011 (Estatuto Anticorrupción)
   */
  public static determinarRegimenSupervision(modalidad: string, requiereObra: boolean = false, valorCOP: number = 0): {
    tipoObligatorio: 'SUPERVISION_INTERNA' | 'INTERVENTORIA_EXTERNA';
    fundamentoLegal: string;
    explicacion: string;
  } {
    if (requiereObra || modalidad.toLowerCase().includes('obra') || modalidad.toLowerCase().includes('licitacion')) {
      return {
        tipoObligatorio: 'INTERVENTORIA_EXTERNA',
        fundamentoLegal: 'Artículo 83 y 84 Ley 1474 de 2011',
        explicacion: 'Es legalmente obligatoria la contratación de Interventoría Externa independiente cuando el objeto corresponda a contratos de obra surgidos de licitación pública, o cuando la entidad no cuente con personal calificado de planta para ejercer el control técnico especializado.'
      };
    }

    return {
      tipoObligatorio: 'SUPERVISION_INTERNA',
      fundamentoLegal: 'Artículo 83 Ley 1474 de 2011',
      explicacion: 'La supervisión puede ser ejercida directamente por un servidor público de la entidad estatal (funcionario de planta) con funciones de seguimiento técnico, administrativo, financiero, contable y jurídico.'
    };
  }

  /**
   * Simula el procedimiento administrativo sancionatorio del Artículo 86 de la Ley 1474 de 2011
   */
  public static ejecutarSimulacionSancionatoria(
    tipoFalta: 'RETRASO_CRONOGRAMA' | 'INCUMPLIMIENTO_CALIDAD' | 'ABANDONO_OBRA_GRAVE',
    valorContratoCOP: number
  ): ProcedimientoSancionatorioArt86 {
    const multaCalculada = tipoFalta === 'RETRASO_CRONOGRAMA'
      ? Math.round(valorContratoCOP * 0.02) // 2%
      : tipoFalta === 'INCUMPLIMIENTO_CALIDAD'
      ? Math.round(valorContratoCOP * 0.05) // 5%
      : Math.round(valorContratoCOP * 0.10); // 10% (Cláusula penal / caducidad)

    const decision: ProcedimientoSancionatorioArt86['decisionAdoptada'] =
      tipoFalta === 'ABANDONO_OBRA_GRAVE' ? 'DECLARATORIA_CADUCIDAD' : 'IMPOSICION_MULTA';

    return {
      tipoFalta,
      multaEstimadaCOP: multaCalculada,
      citacionNotificada: true,
      llamamientoAseguradora: true,
      descargosPresentados: true,
      audienciaCelebrada: true,
      decisionAdoptada: decision,
      recursoReposicionResuelto: true,
      blindajeDebidoProceso:
        'Se respetaron las 5 etapas preclusivas del Art. 86 Ley 1474: 1. Citación detallada con informe del supervisor, 2. Vinculación de la compañía de seguros garante, 3. Oportunidad oral y escrita de descargos, 4. Motivación técnica de la resolución en audiencia pública, y 5. Resolución inmediata del recurso de reposición en estrados.'
    };
  }

  /**
   * Calcula los términos legales preclusivos para la liquidación del contrato
   * según el Artículo 11 de la Ley 1150 de 2007 y jurisprudencia del Consejo de Estado
   */
  public static calcularTerminosLiquidacion(fechaTerminacion: string) {
    const baseDate = new Date(fechaTerminacion);

    const sumarMeses = (meses: number): string => {
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + meses);
      return d.toISOString().split('T')[0];
    };

    const sumarAnos = (anos: number): string => {
      const d = new Date(baseDate);
      d.setFullYear(d.getFullYear() + anos);
      return d.toISOString().split('T')[0];
    };

    return {
      plazoBilateralFin: sumarMeses(4), // 4 meses legales supletorios
      plazoUnilateralFin: sumarMeses(6), // 2 meses adicionales
      caducidadJudicialFin: sumarAnos(2), // 2 años de controversias contractuales
      reglas: [
        '1. Término Bilateral: El pactado en el contrato o en su defecto cuatro (4) meses siguientes al vencimiento del plazo.',
        '2. Término Unilateral: Dentro de los dos (2) meses siguientes al vencimiento del término bilateral si el contratista no se presenta o no hay acuerdo.',
        '3. Término Judicial / Caducidad: Dos (2) años contados a partir del vencimiento del término para liquidar unilateralmente (Art. 164 CPACA).'
      ]
    };
  }
}
