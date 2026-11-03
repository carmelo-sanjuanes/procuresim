// Borrador de la propuesta licitatoria en Word. Solo usa los datos que registraste: lo que falta queda marcado como [PENDIENTE].
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import type { DatosVendo } from '../domain/vendo';
import {
  num, estadoLista, evaluarRequisitos, indicadores, experiencia, codigosExigidos, smmlvDeContrato, calcularOferta, flujoCaja,
  LISTA_SOBRE1, LISTA_GARANTIA
} from './VendoEngine';

const PEND = '[PENDIENTE]';
/** Quita caracteres de control que vuelven inválido el XML de Word (el archivo no abriría). */
const limpio = (t: string) => t.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '');
const v = (t?: string) => (t && limpio(t).trim() ? limpio(t).trim() : PEND);
const cop = (n: number) => `$ ${Math.round(n).toLocaleString('es-CO')}`;
const p = (t: string, bold = false) => new Paragraph({ spacing: { after: 140 }, children: [new TextRun({ text: limpio(t), bold })] });
const h = (t: string) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun(limpio(t))] });
const celda = (t: string, bold = false) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: limpio(t), bold, size: 20 })] })] });
const tabla = (filas: string[][], cab = true) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: filas.map((f, i) => new TableRow({ children: f.map((t) => celda(t, cab && i === 0)) }))
  });

const ESTADO_TXT = { EN_REGLA: 'Cumple', SUBSANAR: 'Requiere subsanación', PENDIENTE: 'Pendiente de verificar' } as const;

export function construirPropuesta(d: DatosVendo): Document {
  const c = d.campos;
  const o = calcularOferta(d);
  const ind = indicadores(c);
  const exp = experiencia(d.contratos, codigosExigidos(c.r_unspsc));
  const reqs = evaluarRequisitos(d);
  const antec = estadoLista(d.checks, ['a_proc', 'a_contr', 'a_pol', 'a_rnmc', 'a_inh', 'a_mul', 'a_conf']);
  const flujo = flujoCaja(d);
  const hoy = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  const declaracion =
    antec === 'EN_REGLA'
      ? 'Declaro bajo la gravedad de juramento, que se entiende prestado con la firma de esta carta, que no me encuentro incurso en inhabilidades, incompatibilidades ni conflictos de interés para contratar con el Estado.'
      : '[NO FIRMAR ESTA DECLARACIÓN: la verificación de antecedentes e inhabilidades no está completa o tiene puntos por resolver.]';

  const hijos = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'PROPUESTA', bold: true, size: 40 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Proceso ${v(c.p_numero)}`, bold: true, size: 26 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: v(c.p_objeto), size: 24 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: `Entidad: ${v(c.p_entidad)} · Proponente: ${v(c.q_razon)}`, size: 22 })] }),
    p('Borrador generado con ProcureSim. Contiene únicamente los datos registrados; todo lo marcado como [PENDIENTE] debe completarse y respaldarse con los documentos originales antes de radicar.'),

    h('1. Carta de presentación'),
    p(`${hoy}`),
    p(`Señores\n${v(c.p_entidad)}`),
    p(`Ref.: Proceso ${v(c.p_numero)} — ${v(c.p_objeto)}`),
    p(`${v(c.q_rep)}, obrando como representante legal de ${v(c.q_razon)}, identificado con NIT ${v(c.q_nit)}, presenta oferta para el proceso de la referencia y manifiesta que ha estudiado los documentos del proceso, sus adendas y anexos, y que acepta las condiciones allí previstas.`),
    p(declaracion),
    p(`Valor total de la oferta: ${o ? cop(o.total) : PEND}.`),

    h('2. Identificación del proponente'),
    tabla([
      ['Dato', 'Información'],
      ['Razón social o nombre', v(c.q_razon)],
      ['NIT o documento', v(c.q_nit)],
      ['Representante legal', v(c.q_rep)],
      ['Tipo de proponente', c.q_tipo === 'NATURAL' ? 'Persona natural' : c.q_tipo === 'JURIDICA' ? 'Persona jurídica' : c.q_tipo === 'PLURAL' ? 'Consorcio o unión temporal' : PEND],
      ['Tamaño empresarial', c.q_tam === 'MIPYME' ? 'Mipyme' : c.q_tam === 'GRANDE' ? 'Gran empresa' : PEND]
    ]),

    ...(d.tipoAlianza && d.miembros.length > 0 ? [
      h(`2.1 Integrantes del ${d.tipoAlianza === 'CONSORCIO' ? 'consorcio' : 'la unión temporal'}`),
      tabla([
        ['Integrante', 'NIT', 'Participación', 'Rol', 'Experiencia aportada (SMMLV)', ...(d.tipoAlianza === 'UNION_TEMPORAL' ? ['Actividades'] : [])],
        ...d.miembros.map((m) => [v(m.razonSocial), v(m.nit), m.porcentaje ? `${m.porcentaje} %` : PEND, m.esLider ? 'Líder / representante' : 'Integrante', m.experienciaSMMLV ? String(m.experienciaSMMLV) : '—', ...(d.tipoAlianza === 'UNION_TEMPORAL' ? [v(m.actividades)] : [])])
      ]),
      ...(Math.round(d.miembros.reduce((x, m) => x + (m.porcentaje || 0), 0)) !== 100 ? [p(`[REVISAR] Las participaciones no suman 100 %.`)] : []),
      p(`Representante designado: ${v((d.miembros.find((m) => m.esLider)?.razonSocial) || '')}${c.q_rep && d.miembros.find((m) => m.esLider)?.razonSocial === c.q_razon ? `, actuando por medio de ${c.q_rep}` : ''}.`),
      p(d.tipoAlianza === 'CONSORCIO'
        ? 'Responsabilidad: en el consorcio, los integrantes responden solidariamente por todas y cada una de las obligaciones derivadas de la propuesta y del contrato; las sanciones por incumplimiento se imponen a todos (Art. 7, numeral 1, Ley 80 de 1993).'
        : 'Responsabilidad: en la unión temporal, los integrantes responden solidariamente por el cumplimiento de la propuesta y del contrato, pero las sanciones por incumplimiento se imponen de acuerdo con la participación de cada uno en la ejecución, cuyos términos y extensión quedan discriminados en el cuadro anterior (Art. 7, numeral 2, Ley 80 de 1993).'),
      p('El documento de constitución firmado por todos los integrantes debe anexarse a la propuesta.')
    ] : []),

    h('3. Requisitos habilitantes (estado según tu verificación)'),
    tabla([
      ['Requisito', 'Estado'],
      ['Habilitación de la empresa (RUT, Cámara de Comercio, RUP, plataforma)', ESTADO_TXT[estadoLista(d.checks, ['h_rut', 'h_camara', 'h_rup', 'h_cod', 'h_plat', 'h_firma'])]],
      ['Antecedentes e inhabilidades', ESTADO_TXT[antec]],
      ['Capacidad jurídica', ESTADO_TXT[estadoLista(d.checks, ['j_fac', 'j_jun', 'j_dur', 'j_obj', 'j_par'])]],
      ...reqs.map((r) => [r.etiqueta, `${r.estado === 'CUMPLE' ? 'Cumple' : r.estado === 'NO_CUMPLE' ? 'No cumple' : 'Falta dato'} — ${r.detalle}`])
    ]),

    h('4. Experiencia'),
    d.contratos.length === 0
      ? p(`${PEND} No registraste contratos.`)
      : tabla([
          ['Contratante', 'Objeto', 'Valor (COP)', 'Año', 'UNSPSC', 'SMMLV'],
          ...d.contratos.map((k) => [v(k.cliente), v(k.objeto), cop(k.valorCOP), String(k.anio || ''), v(k.unspsc), (smmlvDeContrato(k)).toLocaleString('es-CO', { maximumFractionDigits: 1 })])
        ]),
    p(`Total acreditado${exp.filtrado ? ' en los códigos exigidos' : ''}: ${exp.aplicanSMMLV.toLocaleString('es-CO', { maximumFractionDigits: 1 })} SMMLV. Anexar las certificaciones originales.`),

    h('5. Capacidad financiera'),
    tabla([
      ['Indicador', 'Valor'],
      ['Índice de liquidez', ind.liquidez === null ? PEND : ind.liquidez.toFixed(2)],
      ['Nivel de endeudamiento', ind.endeudamiento === null ? PEND : `${ind.endeudamiento.toFixed(1)} %`],
      ['Cobertura de intereses', ind.coberturaSinIntereses ? 'Sin gastos de intereses' : ind.cobertura === null ? PEND : ind.cobertura.toFixed(2)],
      ['Capital de trabajo', ind.capitalTrabajoCOP === null ? PEND : cop(ind.capitalTrabajoCOP)]
    ]),

    h('6. Oferta económica'),
    o
      ? tabla([
          ['Concepto', 'Valor'],
          ['Costo directo', cop(o.costoDirecto)],
          ['Administración (A)', `${o.aiuPct.a} % — ${cop(o.costoDirecto * o.aiuPct.a / 100)}`],
          ['Imprevistos (I)', `${o.aiuPct.i} % — ${cop(o.costoDirecto * o.aiuPct.i / 100)}`],
          ['Utilidad (U)', `${o.aiuPct.u} % — ${cop(o.costoDirecto * o.aiuPct.u / 100)}`],
          ['Valor antes de IVA', cop(o.valorAntesIVA)],
          [o.ivaSoloUtilidad ? 'IVA sobre la utilidad' : 'IVA', cop(o.iva)],
          ['VALOR TOTAL DE LA OFERTA', cop(o.total)]
        ])
      : p(`${PEND} Falta registrar las partidas de costo (paso 16).`),
    flujo ? p(`Plazo: ${v(c.fc_plazo)} meses. Anticipo previsto: ${v(c.fc_anticipo)} %.`) : p(''),

    h('7. Garantía de seriedad de la oferta'),
    tabla([
      ['Dato', 'Información'],
      ['Aseguradora', v(c.gs_aseguradora)],
      ['N.º de póliza', v(c.gs_numero)],
      ['Tomador', v(c.gs_tomador || c.q_razon)],
      ['Asegurado', v(c.gs_asegurado || c.p_entidad)],
      ['Valor asegurado', c.gs_valor ? cop(num(c.gs_valor)) : PEND],
      ['Vigencia hasta', v(c.gs_vigencia)]
    ]),

    h('8. Lista de documentos del sobre habilitante'),
    tabla([
      ['Documento', 'Estado'],
      ...LISTA_SOBRE1.map((x) => [x.t, d.checks[x.id] === 'SI' ? 'Listo' : d.checks[x.id] === 'NO' ? 'Falta' : PEND]),
      ...LISTA_GARANTIA.map((x) => [`Garantía: ${x.t}`, d.checks[x.id] === 'SI' ? 'Verificado' : d.checks[x.id] === 'NO' ? 'Por corregir' : PEND])
    ]),
    p(''),
    p('Firma del representante legal: ______________________________'),
    p(v(c.q_rep))
  ];

  return new Document({ sections: [{ children: hijos }] });
}

export async function descargarPropuesta(d: DatosVendo): Promise<void> {
  const blob = await Packer.toBlob(construirPropuesta(d));
  const nombre = (d.campos.p_numero || d.campos.q_razon || 'oferta').replace(/[^\w-]+/g, '_');
  saveAs(blob, `Propuesta_${nombre}.docx`);
}
