// Plantillas de comunicaciones oficiales de la administración pública (borradores editables).
// Son borradores: el funcionario debe revisar datos, términos y números de artículo antes de enviar.

export type IdPlantilla = 'CITACION_ART86' | 'PRECIO_BAJO' | 'ACEPTACION_MINIMA' | 'CADUCIDAD';

export interface CampoPlantilla {
  clave: string;
  etiqueta: string;
  tipo?: 'texto' | 'fecha' | 'hora' | 'largo' | 'correo';
  ejemplo?: string;
}

export interface DefinicionPlantilla {
  id: IdPlantilla;
  titulo: string;
  fundamento: string;
  campos: CampoPlantilla[];
  destinatarios: { para: string[]; cc: string[] }; // claves de campos de correo
}

export interface CorreoGenerado {
  para: string[];
  cc: string[];
  asunto: string;
  cuerpo: string;
}

export const PLANTILLAS: Record<IdPlantilla, DefinicionPlantilla> = {
  CITACION_ART86: {
    id: 'CITACION_ART86',
    titulo: 'Citación a audiencia sancionatoria',
    fundamento: 'Art. 86 Ley 1474 de 2011',
    campos: [
      { clave: 'entidad', etiqueta: 'Entidad contratante' },
      { clave: 'contrato', etiqueta: 'N.º de contrato / radicado' },
      { clave: 'contratista', etiqueta: 'Contratista (razón social)' },
      { clave: 'correoContratista', etiqueta: 'Correo del representante legal del contratista', tipo: 'correo' },
      { clave: 'aseguradora', etiqueta: 'Aseguradora garante' },
      { clave: 'correoAseguradora', etiqueta: 'Correo de la aseguradora', tipo: 'correo' },
      { clave: 'informe', etiqueta: 'Fecha del informe de la interventoría o supervisión', tipo: 'fecha' },
      { clave: 'hechos', etiqueta: 'Hechos que soportan la presunta falta o incumplimiento', tipo: 'largo' },
      { clave: 'fechaAudiencia', etiqueta: 'Fecha de la audiencia', tipo: 'fecha' },
      { clave: 'horaAudiencia', etiqueta: 'Hora', tipo: 'hora' },
      { clave: 'lugar', etiqueta: 'Lugar o enlace de la audiencia' },
      { clave: 'funcionario', etiqueta: 'Nombre y cargo de quien firma' }
    ],
    destinatarios: { para: ['correoContratista', 'correoAseguradora'], cc: [] }
  },
  PRECIO_BAJO: {
    id: 'PRECIO_BAJO',
    titulo: 'Requerimiento por precio artificialmente bajo',
    fundamento: 'Decreto 1082 de 2015, Art. 2.2.1.1.2.2.4',
    campos: [
      { clave: 'entidad', etiqueta: 'Entidad contratante' },
      { clave: 'proceso', etiqueta: 'N.º de proceso' },
      { clave: 'proponente', etiqueta: 'Proponente (razón social)' },
      { clave: 'correoProponente', etiqueta: 'Correo del proponente', tipo: 'correo' },
      { clave: 'valorOferta', etiqueta: 'Valor de la oferta (COP)' },
      { clave: 'valorReferencia', etiqueta: 'Valor de referencia o promedio de las ofertas (COP)' },
      { clave: 'desviacion', etiqueta: 'Desviación frente a la referencia (%)' },
      { clave: 'plazoDias', etiqueta: 'Plazo para responder (días hábiles)', ejemplo: '3' },
      { clave: 'funcionario', etiqueta: 'Nombre y cargo de quien firma' }
    ],
    destinatarios: { para: ['correoProponente'], cc: [] }
  },
  ACEPTACION_MINIMA: {
    id: 'ACEPTACION_MINIMA',
    titulo: 'Aceptación de oferta en mínima cuantía',
    fundamento: 'Decreto 1082 de 2015, Art. 2.2.1.2.1.5.2',
    campos: [
      { clave: 'entidad', etiqueta: 'Entidad contratante' },
      { clave: 'proceso', etiqueta: 'N.º de proceso' },
      { clave: 'objeto', etiqueta: 'Objeto', tipo: 'largo' },
      { clave: 'oferente', etiqueta: 'Oferente seleccionado (razón social)' },
      { clave: 'correoOferente', etiqueta: 'Correo del oferente', tipo: 'correo' },
      { clave: 'valor', etiqueta: 'Valor aceptado (COP)' },
      { clave: 'supervisor', etiqueta: 'Supervisor designado' },
      { clave: 'plazoGarantia', etiqueta: 'Plazo para presentar garantías, si aplican (días hábiles)', ejemplo: '3' },
      { clave: 'funcionario', etiqueta: 'Nombre y cargo de quien firma' }
    ],
    destinatarios: { para: ['correoOferente'], cc: [] }
  },
  CADUCIDAD: {
    id: 'CADUCIDAD',
    titulo: 'Notificación de caducidad del contrato',
    fundamento: 'Art. 18 Ley 80 de 1993',
    campos: [
      { clave: 'entidad', etiqueta: 'Entidad contratante' },
      { clave: 'contrato', etiqueta: 'N.º de contrato / radicado' },
      { clave: 'contratista', etiqueta: 'Contratista (razón social)' },
      { clave: 'correoContratista', etiqueta: 'Correo del contratista', tipo: 'correo' },
      { clave: 'aseguradora', etiqueta: 'Aseguradora garante' },
      { clave: 'correoAseguradora', etiqueta: 'Correo de la aseguradora', tipo: 'correo' },
      { clave: 'correoCamara', etiqueta: 'Correo de la Cámara de Comercio (registro en el RUP)', tipo: 'correo' },
      { clave: 'acto', etiqueta: 'N.º y fecha de la resolución motivada' },
      { clave: 'ejecutoria', etiqueta: 'Fecha de ejecutoria', tipo: 'fecha' },
      { clave: 'funcionario', etiqueta: 'Nombre y cargo de quien firma' }
    ],
    destinatarios: { para: ['correoContratista', 'correoAseguradora', 'correoCamara'], cc: [] }
  }
};

const v = (d: Record<string, string>, k: string, marcador?: string) => (d[k] ?? '').trim() || `[${marcador ?? k}]`;
const lista = (d: Record<string, string>, claves: string[]) => claves.map((k) => (d[k] ?? '').trim()).filter((x) => /.+@.+\..+/.test(x));

export function generarCorreo(id: IdPlantilla, d: Record<string, string>): CorreoGenerado {
  const def = PLANTILLAS[id];
  const firma = `\n\nCordialmente,\n\n${v(d, 'funcionario', 'Nombre y cargo')}\n${v(d, 'entidad', 'Entidad')}`;
  let asunto = '';
  let cuerpo = '';
  if (id === 'CITACION_ART86') {
    asunto = `Citación a audiencia – Art. 86 Ley 1474 de 2011 – Contrato ${v(d, 'contrato')}`;
    cuerpo =
      `Señores\n${v(d, 'contratista')} (representante legal)\n${v(d, 'aseguradora')} (representante legal o apoderado, en calidad de garante)\n\n` +
      `Asunto: Citación a audiencia dentro del procedimiento sancionatorio del contrato ${v(d, 'contrato')}.\n\n` +
      `La entidad ${v(d, 'entidad')} los cita a audiencia el ${v(d, 'fechaAudiencia', 'fecha')} a las ${v(d, 'horaAudiencia', 'hora')}, en ${v(d, 'lugar', 'lugar o enlace'
      )}, en desarrollo del artículo 86 de la Ley 1474 de 2011.\n\n` +
      `Con esta citación se les remite el informe de la interventoría o supervisión del ${v(d, 'informe', 'fecha del informe')}, que sustenta la actuación, y se les informan los hechos que la motivan:\n${v(d, 'hechos', 'hechos')}\n\n` +
      `En la audiencia podrán presentar sus descargos, rendir las explicaciones del caso, aportar pruebas y controvertir las allegadas por la entidad. ` +
      `Pueden presentar también sus descargos por escrito antes de la audiencia.${firma}`;
  } else if (id === 'PRECIO_BAJO') {
    asunto = `Requerimiento de explicación del precio ofertado – Proceso ${v(d, 'proceso')}`;
    cuerpo =
      `Señores\n${v(d, 'proponente')}\n\n` +
      `En el proceso ${v(d, 'proceso')} de ${v(d, 'entidad')}, su oferta por $${v(d, 'valorOferta', 'valor')} presenta una desviación de ${v(d, 'desviacion', '%')} % frente al valor de referencia de $${v(d, 'valorReferencia', 'valor de referencia')}, ` +
      `por lo que la entidad inicia la verificación de una posible oferta con valor artificialmente bajo (Decreto 1082 de 2015, Art. 2.2.1.1.2.2.4).\n\n` +
      `Les solicitamos allegar, dentro de ${v(d, 'plazoDias', 'plazo')} días hábiles contados desde el recibo de esta comunicación:\n` +
      `1. El análisis de precios unitarios (APU) de los ítems de la oferta.\n2. El detalle de costos laborales, prestacionales y de seguridad social.\n3. La justificación técnica y financiera que explique el precio ofertado.\n\n` +
      `Vencido el término sin respuesta, o si la justificación no es suficiente, la entidad podrá rechazar la oferta de manera motivada.${firma}`;
  } else if (id === 'ACEPTACION_MINIMA') {
    asunto = `Aceptación de oferta – Mínima cuantía – Proceso ${v(d, 'proceso')}`;
    cuerpo =
      `Señores\n${v(d, 'oferente')}\n\n` +
      `La entidad ${v(d, 'entidad')} le comunica que, en el proceso de mínima cuantía ${v(d, 'proceso')}, aceptó su oferta para: ${v(d, 'objeto', 'objeto')}, por un valor de $${v(d, 'valor', 'valor')}.\n\n` +
      `Conforme al procedimiento de mínima cuantía (Decreto 1082 de 2015, Art. 2.2.1.2.1.5.2), la oferta y su aceptación constituyen para todos los efectos el contrato. ` +
      `Se designa como supervisor a ${v(d, 'supervisor', 'supervisor')}.\n\n` +
      `Si el proceso exige garantías, deberán presentarse dentro de ${v(d, 'plazoGarantia', 'plazo')} días hábiles siguientes a esta comunicación.${firma}`;
  } else {
    asunto = `Notificación de caducidad – Contrato ${v(d, 'contrato')}`;
    cuerpo =
      `Señores\n${v(d, 'contratista')}\n${v(d, 'aseguradora')} (garante)\nCámara de Comercio (registro de la sanción en el RUP)\n\n` +
      `La entidad ${v(d, 'entidad')} les notifica la resolución ${v(d, 'acto', 'N.º y fecha')}, mediante la cual, de manera motivada, declaró la caducidad del contrato ${v(d, 'contrato')} (artículo 18 de la Ley 80 de 1993).\n\n` +
      `Efectos principales:\n1. Con la ejecutoria del acto (${v(d, 'ejecutoria', 'fecha de ejecutoria')}) queda en firme la declaratoria, y se declara el siniestro de incumplimiento ante la aseguradora garante.\n` +
      `2. El contratista queda inhabilitado para contratar con entidades estatales por 5 años contados desde la ejecutoria (Art. 8 Ley 80 de 1993).\n` +
      `3. Se solicita a la Cámara de Comercio inscribir la sanción en el registro correspondiente (RUP).\n\n` +
      `Contra el acto procede el recurso de reposición, dentro del término legal, indicado en la resolución.${firma}`;
  }
  return { para: lista(d, def.destinatarios.para), cc: lista(d, def.destinatarios.cc), asunto, cuerpo };
}

/** mailto: con asunto y cuerpo codificados (saltos de línea CRLF). */
export function construirMailto(c: CorreoGenerado): string {
  const partes = [`subject=${encodeURIComponent(c.asunto)}`, `body=${encodeURIComponent(c.cuerpo.replace(/\n/g, '\r\n'))}`];
  if (c.cc.length) partes.unshift(`cc=${encodeURIComponent(c.cc.join(','))}`);
  return `mailto:${c.para.map((x) => encodeURIComponent(x).replace(/%40/g, '@')).join(',')}?${partes.join('&')}`;
}

export const LIMITE_MAILTO = 1900;
