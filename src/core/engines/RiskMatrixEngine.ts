import type { RiesgoContratacion } from '../domain/types';

export class RiskMatrixEngine {
  /**
   * Calcula la calificación y categoría del riesgo según las tablas oficiales de CCE
   */
  public static calcularNivelRiesgo(probabilidad: 1 | 2 | 3 | 4 | 5, impacto: 1 | 2 | 3 | 4 | 5): {
    calificacion: number;
    categoria: 'BAJO' | 'MEDIO' | 'ALTO' | 'EXTREMO';
  } {
    const calificacion = probabilidad + impacto;

    let categoria: 'BAJO' | 'MEDIO' | 'ALTO' | 'EXTREMO' = 'BAJO';
    if (calificacion <= 4) {
      categoria = 'BAJO';
    } else if (calificacion <= 6) {
      categoria = 'MEDIO';
    } else if (calificacion <= 8) {
      categoria = 'ALTO';
    } else {
      categoria = 'EXTREMO';
    }

    return { calificacion, categoria };
  }

  /**
   * Genera una matriz de riesgos base pre-configurada según la tipología del objeto contractual
   */
  public static generarMatrizPredeterminada(tipoObjeto: 'SUMINISTRO' | 'OBRA' | 'TECNOLOGIA' | 'CONSULTORIA' | 'SERVICIOS_GENERALES'): RiesgoContratacion[] {
    const riesgosBase: RiesgoContratacion[] = [
      {
        id: 'RSK-01',
        tipo: 'OPERACIONAL',
        etapa: 'EJECUCION',
        descripcion: 'Retraso en los plazos de entrega de los bienes o prestación del servicio por causas imputables al contratista.',
        consecuencia: 'Afectación en la continuidad de la prestación del servicio a la comunidad o funcionamiento de la entidad.',
        probabilidad: 2,
        impacto: 3,
        calificacion: 5,
        categoria: 'MEDIO',
        asignacion: 'CONTRATISTA',
        tratamientoMitigacion: 'Exigencia de póliza de cumplimiento del contrato (10% a 20% del valor total) y supervisión técnica periódica con informes quincenales.',
        responsableMonitoreo: 'Supervisor del Contrato / Interventor'
      },
      {
        id: 'RSK-02',
        tipo: 'FINANCIERO',
        etapa: 'EJECUCION',
        descripcion: 'Fluctuación en los precios de los insumos, inflación imprevista o variación de la tasa de cambio.',
        consecuencia: 'Pérdida de equilibrio económico del contrato o riesgo de insolvencia del contratista.',
        probabilidad: 3,
        impacto: 3,
        calificacion: 6,
        categoria: 'MEDIO',
        asignacion: 'CONTRATISTA',
        tratamientoMitigacion: 'Contrato a precios fijos no reajustables durante la vigencia contractual. El contratista asume la gestión comercial con proveedores mayoristas.',
        responsableMonitoreo: 'Contratista y Ordenador del Gasto'
      },
      {
        id: 'RSK-03',
        tipo: 'REGULATORIO',
        etapa: 'EJECUCION',
        descripcion: 'Incumplimiento en el pago de aportes a la seguridad social integral y parafiscales de los trabajadores del contratista.',
        consecuencia: 'Responsabilidad solidaria laboral o paralización de las actividades por requerimientos de la UGPP.',
        probabilidad: 2,
        impacto: 4,
        calificacion: 6,
        categoria: 'MEDIO',
        asignacion: 'CONTRATISTA',
        tratamientoMitigacion: 'Requisito obligatorio de adjuntar certificación expedida por Revisor Fiscal o Contador Público previa a cada acta de pago o desembolso.',
        responsableMonitoreo: 'Supervisor del Contrato'
      },
      {
        id: 'RSK-04',
        tipo: 'OPERACIONAL',
        etapa: 'LIQUIDACION',
        descripcion: 'Fallas de calidad o vicios ocultos en los bienes suministrados o en la obra ejecutada tras la entrega formal.',
        consecuencia: 'Inoperatividad de los bienes o deterioro prematuro de la infraestructura estatal.',
        probabilidad: 2,
        impacto: 4,
        calificacion: 6,
        categoria: 'MEDIO',
        asignacion: 'CONTRATISTA',
        tratamientoMitigacion: 'Amparo de garantía de Calidad de los Bienes o Estabilidad de la Obra en la póliza única de cumplimiento por un término no inferior a un (1) año.',
        responsableMonitoreo: 'Supervisor del Contrato / Almacén General'
      },
      {
        id: 'RSK-05',
        tipo: 'FINANCIERO',
        etapa: 'CONTRATACION',
        descripcion: 'Demora en los giros presupuestales o retraso en las órdenes de pago por trámites administrativos de la Tesorería.',
        consecuencia: 'Generación de intereses moratorios o suspensión justificada de labores por el contratista.',
        probabilidad: 2,
        impacto: 3,
        calificacion: 5,
        categoria: 'MEDIO',
        asignacion: 'ENTIDAD',
        tratamientoMitigacion: 'Planificación oportuna del PAC (Plan Anualizado de Caja) y radicación ágil de cuentas de cobro con soportes completos.',
        responsableMonitoreo: 'Área Financiera y Contable de la Entidad'
      }
    ];

    if (tipoObjeto === 'TECNOLOGIA') {
      riesgosBase.push({
        id: 'RSK-06',
        tipo: 'TECNOLOGICO',
        etapa: 'EJECUCION',
        descripcion: 'Incidentes de ciberseguridad, fuga de información confidencial o incompatibilidad con la infraestructura de servidores de la entidad.',
        consecuencia: 'Interrupción crítica de los sistemas, vulneración de datos personales (Ley 1581) o sanciones de la SIC.',
        probabilidad: 3,
        impacto: 4,
        calificacion: 7,
        categoria: 'ALTO',
        asignacion: 'COMPARTIDO',
        tratamientoMitigacion: 'Acuerdos de nivel de servicio (SLA) con penalidades, auditoría de código, cifrado de datos en reposo y en tránsito, y póliza de responsabilidad civil extracontractual.',
        responsableMonitoreo: 'Oficina de Tecnologías de la Información (OTI)'
      });
    }

    if (tipoObjeto === 'OBRA') {
      riesgosBase.push({
        id: 'RSK-07',
        tipo: 'AMBIENTAL',
        etapa: 'EJECUCION',
        descripcion: 'Imprevistos climáticos extremos (ola invernal) o hallazgos geotécnicos/arqueológicos imprevistos durante la excavación.',
        consecuencia: 'Suspensión temporal del cronograma o necesidad de prórrogas en tiempo.',
        probabilidad: 3,
        impacto: 4,
        calificacion: 7,
        categoria: 'ALTO',
        asignacion: 'COMPARTIDO',
        tratamientoMitigacion: 'Estudios de suelos detallados, plan de contingencia ambiental aprobado por la CAR y comité semanal de obra con la interventoría.',
        responsableMonitoreo: 'Interventoría Técnica y Ambiental'
      });
    }

    return riesgosBase;
  }
}
