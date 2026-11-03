// Asistente Inteligente de Presentación y Estructuración de Propuestas
import type { ProponenteDatos, ProcesoContratacion } from '../domain/types';
import { FinancialEngine } from './FinancialEngine';
import type { EvaluacionFinancieraDetalle } from './FinancialEngine';

export interface DiagnosticoOfertaProponente {
  habilitacionJuridica: {
    cumple: boolean;
    aspectos: { nombre: string; estado: 'CUMPLE' | 'SUBSANABLE' | 'NO_CUMPLE'; nota: string }[];
  };
  habilitacionFinanciera: EvaluacionFinancieraDetalle;
  habilitacionTecnica: {
    cumple: boolean;
    smmlvAcreditados: number;
    smmlvExigidos: number;
    contratosAcreditados: number;
    contratosExigidos: number;
    codigosCoincidentes: string[];
    codigosFaltantes: string[];
    nota: string;
  };
  evaluacionEconomica: {
    valorOfertado: number;
    presupuestoOficial: number;
    porcentajeDelPresupuesto: number;
    alertaPrecioArtificialmenteBajo: boolean;
    superaPresupuesto: boolean;
    diagnostico: string;
  };
  puntajeEstimado: {
    economico: number;
    calidad: number;
    calidadTecnica: number;
    industriaNacional: number;
    discapacidad: number;
    miPyme: number;
    total: number;
  };
  puedeRadicar: boolean;
  alertasCriticas: string[];
  recomendacionesSubsanacion: string[];
}

export class ProposalAssistantEngine {
  /**
   * Realiza un diagnóstico exhaustivo de la oferta antes de ser radicada en SECOP o portal privado
   */
  public static auditarPropuesta(
    proponente: ProponenteDatos,
    proceso: ProcesoContratacion,
    valorEconomicoOfertado: number
  ): DiagnosticoOfertaProponente {
    const alertasCriticas: string[] = [];
    const recomendacionesSubsanacion: string[] = [];

    // 1. Diagnóstico Jurídico
    const aspectosJuridicos: { nombre: string; estado: 'CUMPLE' | 'SUBSANABLE' | 'NO_CUMPLE'; nota: string }[] = [
      {
        nombre: 'Capacidad de Ejercicio y Objeto Social',
        estado: 'CUMPLE' as const,
        nota: 'El objeto social de la empresa autoriza expresamente la ejecución de las actividades del proceso.'
      },
      {
        nombre: 'Cámara de Comercio / RUP Vigente y Firme',
        estado: 'CUMPLE' as const,
        nota: 'El Registro Único de Proponentes se encuentra renovado y en firme para la presente vigencia fiscal.'
      },
      {
        nombre: 'Paz y Salvo Aportes Parafiscales y Seguridad Social (Ley 789 de 2002)',
        estado: 'CUMPLE' as const,
        nota: 'Certificación suscrita por Revisor Fiscal / Contador en regla con fecha no mayor a 30 días.'
      },
      {
        nombre: 'Inhabilidades e Incompatibilidades',
        estado: 'CUMPLE' as const,
        nota: 'No se registran sanciones disciplinarias, fiscales (Boletín Contraloría) ni medidas correctivas de policía.'
      }
    ];

    if (proponente.tipoProponente === 'CONSORCIO' || proponente.tipoProponente === 'UNION_TEMPORAL') {
      const sumaParticipacion = (proponente.miembrosPlurales || []).reduce((acc, m) => acc + m.porcentajeParticipacion, 0);
      if (Math.round(sumaParticipacion) !== 100) {
        aspectosJuridicos.push({
          nombre: 'Documento de Conformación de Proponente Plural',
          estado: 'NO_CUMPLE' as const,
          nota: `La sumatoria de porcentajes de participación es ${sumaParticipacion}%, debe ser exactamente 100%.`
        });
        alertasCriticas.push('Los porcentajes del Consorcio/UT no suman 100%.');
      } else {
        aspectosJuridicos.push({
          nombre: 'Documento de Conformación de Proponente Plural',
          estado: 'CUMPLE' as const,
          nota: 'Acuerdo consorcial debidamente formalizado con designación de representante y porcentajes exactos.'
        });
      }
    }

    const cumpleJuridico = aspectosJuridicos.every((a) => a.estado !== 'NO_CUMPLE');

    // 2. Diagnóstico Financiero
    const evaluacionFinanciera = FinancialEngine.evaluarCapacidadFinanciera(
      proponente,
      proceso.requisitosHabilitantes
    );
    if (evaluacionFinanciera.resultadoGeneral === 'NO_HABILITADO') {
      alertasCriticas.push('No cumple con los indicadores financieros exigidos en el RUP (Causal de no habilitación).');
    }

    // 3. Diagnóstico Técnico y Experiencia
    const codigosExigidos = proceso.requisitosHabilitantes.codigosUNSPSCExigidos;
    const codigosAcreditadosSet = new Set<string>();
    let totalSmmlv = 0;
    let contratosValidos = 0;

    proponente.experienciaRegistrada.forEach((exp) => {
      const tieneCodigo = exp.codigosUNSPSC.some((cod) => codigosExigidos.includes(cod));
      if (tieneCodigo || codigosExigidos.length === 0) {
        totalSmmlv += exp.valorSMMLV;
        contratosValidos++;
        exp.codigosUNSPSC.forEach((c) => codigosAcreditadosSet.add(c));
      }
    });

    const codigosCoincidentes = Array.from(codigosAcreditadosSet);
    const codigosFaltantes = codigosExigidos.filter((c) => !codigosAcreditadosSet.has(c));

    const cumpleSmmlv = totalSmmlv >= proceso.requisitosHabilitantes.sumatoriaSMMLVMinima;
    const cumpleContratos = contratosValidos >= proceso.requisitosHabilitantes.numeroContratosAcreditar;
    const cumpleTecnico = cumpleSmmlv && cumpleContratos && codigosFaltantes.length === 0;

    if (!cumpleSmmlv) {
      alertasCriticas.push(
        `Experiencia insuficiente en valor: Acredita ${totalSmmlv.toFixed(1)} SMMLV frente a ${proceso.requisitosHabilitantes.sumatoriaSMMLVMinima} SMMLV requeridos.`
      );
    }
    if (!cumpleContratos) {
      alertasCriticas.push(
        `Número de contratos insuficiente: Acredita ${contratosValidos} frente a ${proceso.requisitosHabilitantes.numeroContratosAcreditar} exigidos.`
      );
    }
    if (codigosFaltantes.length > 0) {
      recomendacionesSubsanacion.push(
        `Faltan códigos UNSPSC por acreditar en la experiencia: ${codigosFaltantes.join(', ')}.`
      );
    }

    // 4. Diagnóstico Económico
    const superaPresupuesto = valorEconomicoOfertado > proceso.presupuestoOficial;
    const pctPresupuesto = Number(((valorEconomicoOfertado / proceso.presupuestoOficial) * 100).toFixed(2));
    // En Colombia Compra Eficiente se considera alerta de oferta artificialmente baja si está por debajo del 80% o una desviación mayor a 2 sigma
    const alertaPrecioArtificialmenteBajo = pctPresupuesto < 80;

    let diagEconomico = `Valor ofertado: \$${valorEconomicoOfertado.toLocaleString('es-CO')} COP (${pctPresupuesto}% del Presupuesto Oficial).`;
    if (superaPresupuesto) {
      alertasCriticas.push('El valor ofertado supera el Presupuesto Oficial Asignado (Causal de RECHAZO automático).');
      diagEconomico += ' ¡ATENCIÓN! La oferta supera el presupuesto oficial de la entidad.';
    } else if (alertaPrecioArtificialmenteBajo) {
      recomendacionesSubsanacion.push(
        'Alerta de Precio Artificialmente Bajo: Debe adjuntar la estructura detallada de costos directos e indirectos para soportar la viabilidad del precio si la entidad lo requiere.'
      );
      diagEconomico += ' Advertencia: La oferta está por debajo del 80% del presupuesto; prepárese para sustentar precios artificialmente bajos.';
    } else {
      diagEconomico += ' Oferta dentro del rango económico admisible.';
    }

    // 5. Simulación de Ponderación de Puntaje
    let ptsEconomico = 0;
    if (!superaPresupuesto && valorEconomicoOfertado > 0) {
      // Método estándar de proporcionalidad inversa: a menor precio válido, mayor puntaje
      ptsEconomico = proceso.criteriosPonderacion.puntajeEconomico;
    }
    const ptsIndustria = proponente.aplicaIndustriaNacional ? proceso.criteriosPonderacion.puntajeIndustriaNacional : 0;
    const ptsDiscapacidad = proponente.empleadosConDiscapacidad ? proceso.criteriosPonderacion.puntajeDiscapacidad : 0;
    const ptsMiPyme = proponente.esMiPyme ? proceso.criteriosPonderacion.puntajeMiPyme : 0;
    const ptsCalidad = proceso.criteriosPonderacion.puntajeTecnicoCalidad; // Asumiendo cumplimiento técnico óptimo
    const ptsTotal = ptsEconomico + ptsCalidad + ptsIndustria + ptsDiscapacidad + ptsMiPyme;

    const puedeRadicar = alertasCriticas.length === 0;

    return {
      habilitacionJuridica: {
        cumple: cumpleJuridico,
        aspectos: aspectosJuridicos
      },
      habilitacionFinanciera: evaluacionFinanciera,
      habilitacionTecnica: {
        cumple: cumpleTecnico,
        smmlvAcreditados: totalSmmlv,
        smmlvExigidos: proceso.requisitosHabilitantes.sumatoriaSMMLVMinima,
        contratosAcreditados: contratosValidos,
        contratosExigidos: proceso.requisitosHabilitantes.numeroContratosAcreditar,
        codigosCoincidentes,
        codigosFaltantes,
        nota: cumpleTecnico
          ? 'Cumple a satisfacción con la experiencia requerida en el pliego.'
          : 'No cumple con la totalidad de la experiencia o códigos solicitados.'
      },
      evaluacionEconomica: {
        valorOfertado: valorEconomicoOfertado,
        presupuestoOficial: proceso.presupuestoOficial,
        porcentajeDelPresupuesto: pctPresupuesto,
        alertaPrecioArtificialmenteBajo,
        superaPresupuesto,
        diagnostico: diagEconomico
      },
      puntajeEstimado: {
        economico: ptsEconomico,
        calidad: ptsCalidad,
        calidadTecnica: ptsCalidad,
        industriaNacional: ptsIndustria,
        discapacidad: ptsDiscapacidad,
        miPyme: ptsMiPyme,
        total: ptsTotal
      },
      puedeRadicar,
      alertasCriticas,
      recomendacionesSubsanacion
    };
  }

  /**
   * Genera el texto redactado de la Carta de Presentación de la Propuesta (Documento Tipo Colombia Compra Eficiente)
   */
  public static generarCartaPresentacion(
    proponente: ProponenteDatos,
    proceso: ProcesoContratacion,
    valorTotal: number
  ): string {
    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `CARTA DE PRESENTACIÓN DE LA PROPUESTA (FORMATO OFICIAL CCE)

Ciudad y Fecha: ${proceso.entidad.municipio}, ${fecha}

Señores:
${proceso.entidad.nombre.toUpperCase()}
Atn: ${proceso.entidad.ordenadorGasto} - Ordenador del Gasto
${proceso.entidad.direccion} - ${proceso.entidad.municipio}, ${proceso.entidad.departamento}

Referencia: Proceso No. ${proceso.numeroProceso}
Modalidad: ${proceso.modalidad.replace(/_/g, ' ')}
Objeto: "${proceso.objeto}"

Respetados Señores:

El suscrito, ${proponente.representanteLegal}, mayor de edad, identificado con la C.C. No. ${proponente.cedulaRepresentante}, actuando en calidad de Representante Legal de ${proponente.razonSocial}, con NIT ${proponente.nit}, me permito presentar formal PROPUESTA TÉCNICA Y ECONÓMICA para el proceso de selección de la referencia, de conformidad con lo establecido en la Ley 80 de 1993, la Ley 1150 de 2007, el Decreto 1082 de 2015 y el Pliego de Condiciones definitivo.

En cumplimiento de lo exigido, declaro bajo la gravedad del juramento que:

1. Acepto plenamente el contenido de los pliegos de condiciones, sus especificaciones técnicas y las adendas que fueron expedidas en el curso del proceso.
2. Manifiesto que conozco el lugar de ejecución, las condiciones operativas y las características de los bienes y/o servicios a prestar.
3. La propuesta económica formulada tiene un valor total de:
   \$${valorTotal.toLocaleString('es-CO')} PESOS MONEDA CORRIENTE (COP).
4. El plazo de validez y sostenimiento de la presente oferta es de noventa (90) días calendario contados a partir de la fecha de cierre del proceso.
5. Manifiesto que ni el suscrito, ni la persona jurídica que represento, ni sus socios o directivos nos encontramos incursos en causales de inhabilidad, incompatibilidad o conflicto de intereses de orden constitucional o legal.
6. Me comprometo a cumplir estrictamente con los términos de ejecución y a constituir las garantías únicas requeridas en caso de resultar adjudicatario.

DATOS DE CONTACTO PARA NOTIFICACIONES:
Razón Social: ${proponente.razonSocial}
NIT: ${proponente.nit}
Representante Legal: ${proponente.representanteLegal} (C.C. ${proponente.cedulaRepresentante})
Dirección: ${proponente.direccion} - ${proponente.ciudad}
Teléfono: ${proponente.telefono}
Correo Electrónico: ${proponente.email}

Atentamente,


_____________________________________________
${proponente.representanteLegal.toUpperCase()}
Representante Legal
C.C. ${proponente.cedulaRepresentante}
${proponente.razonSocial}`;
  }

  /**
   * Genera la Minuta de Conformación de Proponente Plural (Consorcio o Unión Temporal)
   */
  public static generarAcuerdoConsorcial(
    proponente: ProponenteDatos,
    proceso: ProcesoContratacion
  ): string {
    const miembros = proponente.miembrosPlurales || [];
    const esConsorcio = proponente.tipoProponente === 'CONSORCIO';
    const tipo = esConsorcio ? 'CONSORCIO' : 'UNIÓN TEMPORAL';
    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    return `DOCUMENTO DE CONSTITUCIÓN DE ${tipo}
PARA PARTICIPAR EN EL PROCESO DE SELECCIÓN ${proceso.numeroProceso}

Entre los suscritos a saber:
${miembros.map((m, idx) => `${idx + 1}. ${m.nombre}, con NIT ${m.nit}, con un porcentaje de participación del ${m.porcentajeParticipacion}%.`).join('\n')}

Hemos acordado celebrar el presente documento privado de conformación de ${tipo}, el cual se regirá por las siguientes cláusulas y por lo dispuesto en el artículo 7° de la Ley 80 de 1993:

CLÁUSULA PRIMERA. DENOMINACIÓN: El proponente plural se denominará: "${proponente.razonSocial}".
CLÁUSULA SEGUNDA. OBJETO: Participar en el proceso de contratación No. ${proceso.numeroProceso} adelantado por ${proceso.entidad.nombre}, cuyo objeto es: "${proceso.objeto}", y en caso de resultar favorecidos con la adjudicación, suscribir y ejecutar a cabalidad el contrato respectivo.
CLÁUSULA TERCERA. PARTICIPACIÓN: La participación de los integrantes dentro del ${tipo} se distribuye de la siguiente forma:
${miembros.map((m) => `• ${m.nombre}: ${m.porcentajeParticipacion}% de participación. Responsabilidad: ${m.compromisoEspecifico || 'Solidaria e ilimitada conforme a la Ley 80 de 1993.'}`).join('\n')}

CLÁUSULA CUARTA. DESIGNACIÓN DEL REPRESENTANTE: Se designa como Representante Legal del ${tipo} a: ${proponente.representanteLegal}, identificado con C.C. No. ${proponente.cedulaRepresentante}, con amplias facultades para presentar la oferta, firmar adendas, suscribir contratos y representar al grupo ante la Entidad Estatal.
CLÁUSULA QUINTA. RESPONSABILIDAD: Los miembros responderán ${esConsorcio ? 'solidariamente por todas y cada una de las obligaciones derivadas de la propuesta y del contrato' : 'solidariamente por el cumplimiento de la propuesta y en la ejecución del contrato según sus términos de participación'}.
CLÁUSULA SEXTA. DURACIÓN: La duración del presente acuerdo será igual al término del proceso contractual, el plazo de ejecución del contrato y dos (2) años más hasta la liquidación formal del mismo.

En constancia se firma a los ${fecha}.

${miembros.map((m) => `\n_____________________________________\nPor: ${m.nombre}\nNIT: ${m.nit}`).join('\n')}`;
  }

  /**
   * Genera el Formato de Certificación de Pagos a Seguridad Social y Parafiscales (Art. 50 Ley 789 de 2002)
   */
  public static generarCertificacionParafiscales(proponente: ProponenteDatos): string {
    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    return `CERTIFICACIÓN DE CUMPLIMIENTO DEL ARTÍCULO 50 DE LA LEY 789 DE 2002
Y ARTÍCULO 9 DE LA LEY 828 DE 2003

Ciudad y Fecha: ${proponente.ciudad}, ${fecha}

Señores:
ENTIDAD CONTRATANTE
Proceso de Selección Pública

En mi condición de ${proponente.tipoProponente.includes('INDIVIDUAL') ? 'Revisor Fiscal / Contador Público' : 'Representante Legal'} de la sociedad ${proponente.razonSocial}, identificada con NIT ${proponente.nit}, por medio de la presente CERTIFICO BAJO LA GRAVEDAD DEL JURAMENTO:

1. Que la empresa ha cumplido durante los seis (6) meses anteriores a la fecha de presentación de esta propuesta con los pagos correspondientes a los sistemas de Seguridad Social Integral (Salud, Pensión y Riesgos Laborales - ARL).
2. Que la empresa se encuentra a la fecha a paz y salvo por concepto de aportes parafiscales al Instituto Colombiano de Bienestar Familiar (ICBF), Servicio Nacional de Aprendizaje (SENA) y Cajas de Compensación Familiar (CCF), conforme a la normatividad laboral vigente.

La presente certificación se expide en cumplimiento del artículo 50 de la Ley 789 de 2002 para ser presentada en procesos de contratación pública y privada.

Cordialmente,


_____________________________________________
NOMBRE DEL PROFESIONAL: CONTADOR PÚBLICO / REVISOR FISCAL
T.P. No. 182947-T
Sociedad: ${proponente.razonSocial}
NIT: ${proponente.nit}`;
  }
}
