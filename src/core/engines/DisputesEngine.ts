// Motor de Gestión de Controversias Contractuales, MASC y Líneas de Tiempo Preclusivas
// Conforme a Ley 80/1993, Ley 1150/2007, Ley 1474/2011 (Art. 86), CPACA (Ley 1437/2011) y Ley 2220/2022 (Conciliación)
import type { ControversiaContractual, HitoLineaTiempo, ProcesoContratacion } from '../domain/types';

export class DisputesEngine {
  /**
   * Genera una línea de tiempo legal con plazos perentorios según el tipo de controversia
   */
  public static generarLineaTiempo(
    tipo: ControversiaContractual['tipo'],
    fechaInicio: string
  ): HitoLineaTiempo[] {
    const hitos: HitoLineaTiempo[] = [];
    const baseDate = new Date(fechaInicio);

    const sumarDias = (dias: number): string => {
      const f = new Date(baseDate);
      f.setDate(f.getDate() + dias);
      return f.toISOString().split('T')[0];
    };

    if (tipo === 'SANCIONATORIO_MULTA_INCUMPLIMIENTO') {
      hitos.push(
        {
          id: 'HT-SANC-01',
          fecha: fechaInicio,
          titulo: 'Informe de Presunto Incumplimiento de Supervisión',
          descripcion: 'El supervisor radica informe detallado de atraso en el cronograma con cálculo estimado de perjuicios.',
          estadoHito: 'COMPLETADO',
          responsable: 'ENTIDAD',
          fundamentoLegal: 'Art. 84 Ley 1474 de 2011 (Facultades de Supervisión e Interventoría)'
        },
        {
          id: 'HT-SANC-02',
          fecha: sumarDias(3),
          titulo: 'Auto de Citación a Audiencia del Art. 86',
          descripcion: 'Notificación formal al contratista y a la compañía de seguros garante indicando circunstancias de hecho y pruebas.',
          diasTerminoLegal: 3,
          tipoTermino: 'HABILES',
          estadoHito: 'COMPLETADO',
          responsable: 'ENTIDAD',
          fundamentoLegal: 'Art. 86 literal a) Ley 1474 de 2011',
          accionRequerida: 'Notificar por correo electrónico institucional y publicar en SECOP II.'
        },
        {
          id: 'HT-SANC-03',
          fecha: sumarDias(8),
          titulo: 'Audiencia Pública: Descargos y Pruebas',
          descripcion: 'Presentación verbal o escrita de descargos por el contratista y la aseguradora. Solicitud y decreto de pruebas.',
          estadoHito: 'VIGENTE_EN_CURSO',
          responsable: 'CONTRATISTA',
          fundamentoLegal: 'Art. 86 literal b) y c) Ley 1474 de 2011',
          accionRequerida: 'Radicación de memorial de descargos y pruebas de eximente de responsabilidad.'
        },
        {
          id: 'HT-SANC-04',
          fecha: sumarDias(18),
          titulo: 'Reanudación y Decisión Sancionatoria Motivada',
          descripcion: 'La entidad adopta la decisión mediante resolución que impone multa, declara siniestro o archiva la actuación.',
          diasTerminoLegal: 10,
          tipoTermino: 'HABILES',
          estadoHito: 'FUTURO',
          responsable: 'ENTIDAD',
          fundamentoLegal: 'Art. 86 literal d) Ley 1474 de 2011'
        },
        {
          id: 'HT-SANC-05',
          fecha: sumarDias(20),
          titulo: 'Recurso de Reposición en Audiencia',
          descripcion: 'Contra la decisión sancionatoria solo procede el recurso de reposición, que debe interponerse y sustentarse en la misma audiencia.',
          estadoHito: 'FUTURO',
          responsable: 'CONTRATISTA',
          fundamentoLegal: 'Art. 86 literal d) Ley 1474 de 2011 (Firmeza del Acto)'
        }
      );
    } else if (tipo === 'RECURSO_REPOSICION_ADJUDICACION') {
      hitos.push(
        {
          id: 'HT-REP-01',
          fecha: fechaInicio,
          titulo: 'Notificación del Acto de Declaratoria de Desierta o Adjudicación',
          descripcion: 'Publicación formal del acto administrativo definitivo en la plataforma transaccional SECOP II.',
          estadoHito: 'COMPLETADO',
          responsable: 'ENTIDAD',
          fundamentoLegal: 'Art. 77 Ley 80 de 1993 y Art. 67 CPACA'
        },
        {
          id: 'HT-REP-02',
          fecha: sumarDias(14),
          titulo: 'Plazo Preclusivo para Interponer Recurso de Reposición',
          descripcion: 'Término improrrogable de 10 días hábiles para radicar el recurso debidamente sustentado.',
          diasTerminoLegal: 10,
          tipoTermino: 'HABILES',
          estadoHito: 'VIGENTE_EN_CURSO',
          responsable: 'CONTRATISTA',
          fundamentoLegal: 'Art. 76 Ley 1437 de 2011 (CPACA)',
          accionRequerida: 'Radicar memorial con causales de revocatoria directa o errores de evaluación.'
        },
        {
          id: 'HT-REP-03',
          fecha: sumarDias(35),
          titulo: 'Vencimiento de Término para Resolver Recurso',
          descripcion: 'La administración debe resolver confirmando, modificando o revocando la decisión. Aplica silencio administrativo si vence.',
          diasTerminoLegal: 15,
          tipoTermino: 'HABILES',
          estadoHito: 'FUTURO',
          responsable: 'ENTIDAD',
          fundamentoLegal: 'Art. 86 CPACA (Término para Resolver)'
        }
      );
    } else if (tipo === 'DESEQUILIBRIO_ECONOMICO') {
      hitos.push(
        {
          id: 'HT-DESEQ-01',
          fecha: fechaInicio,
          titulo: 'Reclamación Formal de Restablecimiento Económico',
          descripcion: 'El contratista allega estudio económico y dictamen pericial sobre sobrecostos imprevistos e irresistibles.',
          estadoHito: 'COMPLETADO',
          responsable: 'CONTRATISTA',
          fundamentoLegal: 'Art. 4 Num. 3 y Art. 5 Num. 1 Ley 80 de 1993'
        },
        {
          id: 'HT-DESEQ-02',
          fecha: sumarDias(30),
          titulo: 'Mesa de Arreglo Directo (Etapa de Concertación)',
          descripcion: 'Mesas técnicas y financieras entre supervisión, ordenador del gasto y contratista para evaluar la matriz de riesgos.',
          diasTerminoLegal: 30,
          tipoTermino: 'HABILES',
          estadoHito: 'VIGENTE_EN_CURSO',
          responsable: 'ENTIDAD',
          fundamentoLegal: 'Art. 68 Ley 80 de 1993 (Mecanismos de Arreglo Directo)'
        },
        {
          id: 'HT-DESEQ-03',
          fecha: sumarDias(60),
          titulo: 'Solicitud de Conciliación Prejudicial (Procuraduría)',
          descripcion: 'En caso de no haber arreglo directo, se convoca a audiencia de conciliación prejudicial obligatoria.',
          diasTerminoLegal: 90,
          tipoTermino: 'CALENDARIO',
          estadoHito: 'FUTURO',
          responsable: 'MINISTERIO_PUBLICO',
          fundamentoLegal: 'Ley 2220 de 2022 (Estatuto de Conciliación)'
        },
        {
          id: 'HT-DESEQ-04',
          fecha: sumarDias(730),
          titulo: 'Término Fatal de Caducidad de la Acción Judicial',
          descripcion: 'Vencimiento del término de dos (2) años para presentar demanda ante la Jurisdicción de lo Contencioso Administrativo.',
          diasTerminoLegal: 2,
          tipoTermino: 'CALENDARIO',
          estadoHito: 'FUTURO',
          responsable: 'TRIBUNAL',
          fundamentoLegal: 'Art. 164 Num. 2 Literal j) CPACA (Caducidad 2 Años)'
        }
      );
    }

    return hitos;
  }

  /**
   * Genera el acto administrativo o memorial de respuesta según la tipología
   */
  public static redactarRespuestaControversia(
    tipoActo: 'AUTO_APERTURA' | 'MEMORIAL_DESCARGOS' | 'RESOLUCION_MOTIVADA' | 'ACTA_ARREGLO_DIRECTO',
    controversia: ControversiaContractual,
    proceso: ProcesoContratacion
  ): string {
    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    if (tipoActo === 'RESOLUCION_MOTIVADA') {
      return `REPÚBLICA DE COLOMBIA
${proceso.entidad.nombre.toUpperCase()}
RESOLUCIÓN No. ${(Math.random() * 800 + 100).toFixed(0)} DE 2025

"Por medio de la cual se resuelve el recurso de reposición interpuesto contra la actuación en el Proceso No. ${proceso.numeroProceso}"

EL ORDENADOR DEL GASTO DE LA ${proceso.entidad.nombre.toUpperCase()}, en ejercicio de sus facultades legales consagradas en la Ley 80 de 1993, la Ley 1150 de 2007, y el Código de Procedimiento Administrativo y de lo Contencioso Administrativo (CPACA), y

CONSIDERANDO:

1. Que la entidad adelantó el proceso de selección No. ${proceso.numeroProceso}, cuyo objeto es: "${proceso.objeto}".
2. Que con fecha ${controversia.fechaRadicacion}, el señor ${controversia.radicador} radicó formal escrito formulando: "${controversia.titulo}".
3. FUNDAMENTOS DEL RECURRENTE: El solicitante alega en síntesis que: ${controversia.sintesisHechos}
4. ANÁLISIS JURÍDICO Y TÉCNICO DE LA ENTIDAD:
   Revisados los antecedentes contractuales y el informe del comité evaluador, la entidad encuentra que la evaluación se ajustó estrictamente al Pliego de Condiciones definitivo y a los mandatos de la Ley 1882 de 2018. Los requisitos habilitantes financieros y de experiencia son de verificación reglada y objetiva, sin que quepa discrecionalidad.
5. De conformidad con reiterada jurisprudencia de la Sección Tercera del Consejo de Estado, los pliegos de condiciones son ley para las partes y los proponentes deben acatar las reglas preclusivas de subsanación.

RESUELVE:

ARTÍCULO PRIMERO: NO REPONER y en consecuencia CONFIRMAR en todas sus partes la decisión adoptada dentro del proceso de selección No. ${proceso.numeroProceso}.
ARTÍCULO SEGUNDO: NOTIFICAR la presente resolución al recurrente conforme a las reglas del CPACA y publicar su texto íntegro en la plataforma transaccional SECOP II.
ARTÍCULO TERCERO: Contra la presente resolución NO procede recurso alguno, quedando agotada la vía administrativa.

NOTIFÍQUESE Y CÚMPLASE,
Expedida en ${proceso.entidad.municipio}, a los ${fecha}.


_____________________________________________
${proceso.entidad.ordenadorGasto}
Ordenador del Gasto - ${proceso.entidad.nombre}`;
    }

    if (tipoActo === 'MEMORIAL_DESCARGOS') {
      return `SEÑORES:
${proceso.entidad.nombre.toUpperCase()}
OFICINA JURÍDICA / COMITÉ DE CONTRATACIÓN
Referencia: Memorial de Descargos en Audiencia Sancionatoria Art. 86 Ley 1474
Expediente: ${controversia.numeroExpediente} | Proceso: ${proceso.numeroProceso}

Respetados Señores:

El suscrito, ${controversia.radicador}, en calidad de Representante Legal del CONTRATISTA, acudo comedidamente dentro de la oportunidad legal para presentar DESCARGOS frente al informe de supervisión:

I. DE LOS HECHOS:
El retraso alegado por la supervisión no obedece a negligencia o dolo de mi representada, sino a causas de fuerza mayor y hechos imprevisibles no imputables al contratista consistentes en demoras en la entrega de las licencias y bloqueos de vías acreditados oportunamente.

II. EXIMENTE DE RESPONSABILIDAD:
El artículo 1616 del Código Civil y la jurisprudencia del Consejo de Estado reconocen que la mora se purga y no genera sanción cuando sobreviene causa extraña o hecho de la administración contratante (Teoría de la compensación de culpas).

III. PETICIONES:
1. Solicito se declare que el contratista NO incurrió en incumplimiento culpable.
2. Solicito se abstengan de imponer multa o hacer efectiva la cláusula penal pecuniaria.
3. Se acuerde una prórroga compensatoria equivalente a los días de suspensión forzosa.

ANEXOS: Bitácora de obra, actas de suspensión y comunicaciones a la supervisión.

Atentamente,


_____________________________________________
${controversia.radicador.toUpperCase()}
Representante Legal / Apoderado`;
    }

    if (tipoActo === 'ACTA_ARREGLO_DIRECTO') {
      return `ACTA DE TRANSACCIÓN Y ARREGLO DIRECTO DE CONTROVERSIA CONTRACTUAL
EXPEDIENTE No. ${controversia.numeroExpediente}

En ${proceso.entidad.municipio}, a los ${fecha}, se reunieron de una parte ${proceso.entidad.ordenadorGasto}, y de la otra parte ${controversia.radicador}, con el fin de resolver de común acuerdo la controversia surgida en torno a: "${controversia.titulo}".

ACUERDAN:
CLÁUSULA PRIMERA: La entidad reconoce un ajuste en el cronograma de ejecución de 25 días calendario sin penalidades.
CLÁUSULA SEGUNDA: El contratista renuncia expresamente a reclamaciones judiciales por lucro cesante o daño emergente derivadas de este hecho.
CLÁUSULA TERCERA: Las partes declaran a paz y salvo este concepto y continuarán con la ejecución del contrato amparado en el CDP No. ${proceso.cdpNumero}.

En constancia firman:

_____________________________             _____________________________
Por la Entidad Estatal                     Por el Contratista`;
    }

    // Default: AUTO_APERTURA
    return `AUTO DE APERTURA DE PROCEDIMIENTO SANCIONATORIO (ART. 86 LEY 1474 DE 2011)
Expediente: ${controversia.numeroExpediente} | Contrato derivado de ${proceso.numeroProceso}

LA ${proceso.entidad.nombre.toUpperCase()}, en ejercicio de las facultades del Estatuto Anticorrupción:
CITA a audiencia pública al contratista ${controversia.radicador} y a la compañía de seguros garante para el día hábil fijado en el cronograma a las 10:00 AM en la Sala de Audiencias de la Entidad o mediante conexión virtual SECOP II, con el fin de debatir los presuntos incumplimientos informados por el supervisor.`;
  }
}
