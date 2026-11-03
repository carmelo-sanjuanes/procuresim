// Motor de Gestión de Consorcios, Uniones Temporales, Promesas de Sociedad y Alianzas
// Conforme a Ley 80/1993 (Art. 7), Ley 1882/2018 y Manual para Proponentes Plurales de CCE
import { SMMLV_2026 } from '../domain/constants';
import type { AsociacionPlural, MiembroAsociacion } from '../domain/types';

export class ConsortiumEngine {
  /**
   * Calcula los indicadores financieros consolidados y ponderados según el Manual de Colombia Compra Eficiente
   */
  public static calcularConsolidacion(miembros: MiembroAsociacion[]): {
    porcentajeTotal: number;
    esValido100Pct: boolean;
    indicadoresPonderados: AsociacionPlural['indicadoresPonderados'];
  } {
    const porcentajeTotal = Number(
      miembros.reduce((acc, m) => acc + (m.porcentajeParticipacion || 0), 0).toFixed(2)
    );
    const esValido100Pct = Math.round(porcentajeTotal) === 100;

    // Sumatoria consolidada de cuentas contables según fórmula de CCE
    const activoCteTotal = miembros.reduce((acc, m) => acc + (m.activoCorriente || 0), 0);
    const pasivoCteTotal = miembros.reduce((acc, m) => acc + (m.pasivoCorriente || 0), 0);
    const activoTotal = miembros.reduce((acc, m) => acc + (m.activoTotal || 0), 0);
    const pasivoTotal = miembros.reduce((acc, m) => acc + (m.pasivoTotal || 0), 0);
    const patrimonioTotal = miembros.reduce((acc, m) => acc + (m.patrimonio || 0), 0);
    const experienciaTotal = miembros.reduce((acc, m) => acc + (m.experienciaAportadaSMMLV || 0), 0);

    const indiceLiquidez = pasivoCteTotal > 0
      ? Number((activoCteTotal / pasivoCteTotal).toFixed(2))
      : activoCteTotal > 0 ? 999 : 0;

    const nivelEndeudamientoPct = activoTotal > 0
      ? Number(((pasivoTotal / activoTotal) * 100).toFixed(2))
      : 0;

    const capitalTrabajoTotalCOP = activoCteTotal - pasivoCteTotal;

    // Capacidad Residual de Contratación consolidada (K-Residual) - Art. 72 Ley 1682/2013 y Dcto 1082/2015
    // En proponentes plurales de obra pública, la capacidad residual es la sumatoria de las capacidades de los integrantes
    const capacidadResidualTotalSMMLV = Number(
      miembros.reduce((acc, m) => {
        const smmlvPatrimonio = (m.patrimonio || 0) / SMMLV_2026;
        const krIndividual = ((m.experienciaAportadaSMMLV || 0) * 0.40) + (smmlvPatrimonio * 0.25) + ((m.porcentajeParticipacion || 0) * 4);
        return acc + krIndividual;
      }, 0).toFixed(1)
    );

    return {
      porcentajeTotal,
      esValido100Pct,
      indicadoresPonderados: {
        indiceLiquidez,
        nivelEndeudamientoPct,
        capitalTrabajoTotalCOP,
        patrimonioTotalCOP: patrimonioTotal,
        experienciaTotalSMMLV: experienciaTotal,
        capacidadResidualTotalSMMLV
      }
    };
  }

  /**
   * Genera el documento formal redactado de asociación
   */
  public static redactarDocumentoAsociacion(
    asociacion: AsociacionPlural,
    tipoDoc: 'DOCUMENTO_CONSTITUCION' | 'PODER_ESPECIAL' | 'ACUERDO_CONFIDENCIALIDAD' | 'MEMORANDO_ENTENDIMIENTO'
  ): string {
    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const tipoTexto = asociacion.tipo.replace(/_/g, ' ');

    if (tipoDoc === 'DOCUMENTO_CONSTITUCION') {
      const esUT = asociacion.tipo === 'UNION_TEMPORAL';

      return `DOCUMENTO PRIVADO DE CONSTITUCIÓN DE ${tipoTexto.toUpperCase()}
DENOMINADA: "${asociacion.nombreAsociacion.toUpperCase()}"

Ciudad y Fecha: ${asociacion.ciudad}, ${fecha}

Entre los suscritos, a saber:
${asociacion.miembros.map((m, idx) => `${idx + 1}. ${m.razonSocial}, sociedad identificada con NIT ${m.nit}, representada legalmente por ${m.representanteLegal}, identificado con C.C. No. ${m.cedulaRepresentante}.`).join('\n')}

Hemos acordado de manera libre y voluntaria celebrar el presente ACUERDO DE CONFORMACIÓN DE ${tipoTexto.toUpperCase()}, regulado por el artículo 7° de la Ley 80 de 1993, la Ley 1150 de 2007, y las siguientes cláusulas:

CLÁUSULA PRIMERA. DENOMINACIÓN:
El proponente plural actuará bajo la denominación social de: "${asociacion.nombreAsociacion}".

CLÁUSULA SEGUNDA. OBJETO:
Participar conjuntamente en la presentación de la propuesta, suscripción y ejecución cabal del proceso de selección cuyo objeto es:
"${asociacion.objetoLicitacion}".

CLÁUSULA TERCERA. PORCENTAJES DE PARTICIPACIÓN Y COMPROMISOS:
Los miembros acuerdan que su participación porcentual y distribución de obligaciones operativas será la siguiente:
${asociacion.miembros.map((m) => `• ${m.razonSocial} (NIT: ${m.nit}): Participación del ${m.porcentajeParticipacion}%. Obligación y alcance: ${m.compromisoObligaciones || 'Aporte técnico, comercial y administrativo integral.'} Aporte económico: \$${(m.aportesFinancierosCOP || 0).toLocaleString('es-CO')} COP.`).join('\n')}

CLÁUSULA CUARTA. DESIGNACIÓN DEL REPRESENTANTE LEGAL:
Se designa como Representante Legal y Apoderado General del ${tipoTexto} a:
${asociacion.representanteDesignado.toUpperCase()}, identificado con C.C. No. ${asociacion.cedulaRepresentante}, con plenas facultades para suscribir la propuesta, acudir a audiencias de adjudicación, firmar el contrato estatal, adendas, actas de modificación y liquidación.

CLÁUSULA QUINTA. RESPONSABILIDAD:
${esUT 
  ? 'De conformidad con el parágrafo 2° del artículo 7° de la Ley 80 de 1993, los miembros responderán solidariamente por el cumplimiento de la propuesta y en la ejecución del contrato. No obstante, las SANCIONES por incumplimiento de obligaciones se impondrán atendiendo al porcentaje de participación y a la asignación de las actividades específicas asumidas por cada integrante.' 
  : 'De conformidad con el numeral 1° del artículo 7° de la Ley 80 de 1993, los integrantes del CONSORCIO responderán SOLIDARIA E ILIMITADAMENTE por todas y cada una de las obligaciones derivadas de la propuesta y del contrato estatal resultante, sin beneficio de división ni excusión.'}

CLÁUSULA SEXTA. SEDE Y DOMICILIO CONTRACTUAL:
El domicilio contractual y de notificaciones judiciales y administrativas será:
Dirección: ${asociacion.direccionSede} - ${asociacion.ciudad}
Correo Electrónico Oficial: ${asociacion.emailNotificacion}
Teléfono: ${asociacion.telefono}

CLÁUSULA SÉPTIMA. DURACIÓN:
La duración del presente acuerdo será igual al término del proceso precontractual, el plazo total de ejecución del contrato, y dos (2) años más contados a partir de la liquidación definitiva a satisfacción.

En señal de aceptación y compromiso, se suscribe por todos los otorgantes a los ${fecha}:

${asociacion.miembros.map((m) => `\n_________________________________________________\nPOR: ${m.razonSocial.toUpperCase()}\nNIT: ${m.nit}\nRepresentante: ${m.representanteLegal} (C.C. ${m.cedulaRepresentante})\nParticipación: ${m.porcentajeParticipacion}%\n`).join('\n')}`;
    }

    if (tipoDoc === 'ACUERDO_CONFIDENCIALIDAD') {
      return `ACUERDO DE CONFIDENCIALIDAD, EXCLUSIVIDAD Y NO COMPETENCIA (NDA)
PROCESO LICITATORIO: "${asociacion.objetoLicitacion}"

Entre las sociedades integrantes de la alianza "${asociacion.nombreAsociacion}":
1. Las partes se comprometen a guardar estricta reserva de la información comercial, precios unitarios, esquemas de AIU y secretos industriales compartidos para la estructuración de la oferta.
2. Cláusula de Exclusividad: Ninguna de las partes podrá participar en este mismo proceso de selección de manera individual ni como integrante de otro proponente plural.
3. Vigencia: Cinco (5) años a partir de la firma del presente memorando.`;
    }

    if (tipoDoc === 'PODER_ESPECIAL') {
      return `PODER ESPECIAL, AMPLIO Y SUFICIENTE
PARA REPRESENTACIÓN DE PROPONENTE PLURAL

Los suscritos representantes legales de las sociedades que conforman la alianza "${asociacion.nombreAsociacion}", por medio del presente documento conferimos PODER ESPECIAL, AMPLIO Y SUFICIENTE a:
${asociacion.representanteDesignado.toUpperCase()}, identificado con C.C. No. ${asociacion.cedulaRepresentante},
para que en nuestro nombre y representación radique ofertas, subsane requisitos habilitantes, participe en audiencias públicas de adjudicación y suscriba el contrato derivado de: "${asociacion.objetoLicitacion}".`;
    }

    // Default: MEMORANDO_ENTENDIMIENTO
    return `MEMORANDO DE ENTENDIMIENTO (MoU) PARA ALIANZA ESTRATÉGICA
Denominación: "${asociacion.nombreAsociacion}"
Las empresas intervinientes manifiestan su voluntad de sumar esfuerzos financieros, logísticos y experiencia en contratación pública para conformar el proponente plural definitivo que concurrirá ante la Entidad Estatal.`;
  }
}
