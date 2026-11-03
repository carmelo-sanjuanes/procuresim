// Motor de tipología del objeto contractual.
// Determina la tipología a partir del texto que redacta el usuario y entrega la cláusula
// de recibo que corresponde al Acta de Liquidación (Art. 60 Ley 80/1993, Art. 11 Ley 1150/2007).

export type TipologiaObjeto = 'OBRA' | 'CONSULTORIA' | 'SUMINISTRO' | 'SERVICIOS_PROFESIONALES';

export const ETIQUETAS_TIPOLOGIA: Record<TipologiaObjeto, string> = {
  OBRA: 'Obra pública',
  CONSULTORIA: 'Consultoría / Estudios',
  SUMINISTRO: 'Compraventa / Suministro',
  SERVICIOS_PROFESIONALES: 'Prestación de servicios profesionales'
};

export const CONSTANCIA_RECIBO: Record<TipologiaObjeto, string> = {
  OBRA: 'Constancia de obras ejecutadas a satisfacción, planos récord entregados y bitácora técnica de obra cerrada.',
  CONSULTORIA:
    'Constancia de entrega y aprobación por la supervisión de los informes técnicos finales, memorias de cálculo y productos pactados.',
  SUMINISTRO:
    'Constancia de ingreso de bienes al almacén general e incorporación formal al inventario de la entidad.',
  SERVICIOS_PROFESIONALES:
    'Constancia de cumplimiento a satisfacción de las obligaciones contractuales, informe final de actividades y paz y salvo de aportes al SGSSS.'
};

/** Cláusula neutra cuando el objeto no permite inferir una tipología. */
export const CONSTANCIA_GENERICA =
  'Constancia de recibo a satisfacción de las prestaciones pactadas, conforme al objeto y a las obligaciones del contrato.';

const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const PALABRAS: Array<[TipologiaObjeto, RegExp]> = [
  ['SERVICIOS_PROFESIONALES', /prestacion de servicios|apoyo a la gestion|asesoria|asesor|abogad|contador/],
  ['CONSULTORIA', /consultoria|estudios?|disenos?|interventoria|plan de ordenamiento|\bpot\b|factibilidad|diagnostico/],
  ['OBRA', /\bobras?\b|construccion|pavimentacion|\bvias?\b|\bvial|placa huella|adecuacion|rehabilitacion|mejoramiento|alcantarillado|acueducto|puente|polideportivo|mantenimiento/],
  ['SUMINISTRO', /suministro|compraventa|compra|adquisicion|computador|portatil|combustible|papeleria|insumos?|dotacion|equipos?|elementos/]
];

export class ObjectTypologyEngine {
  /** Devuelve la tipología inferida o null si el texto no es concluyente. */
  public static inferir(texto: string): TipologiaObjeto | null {
    const t = normalizar(texto || '');
    if (!t.trim()) return null;
    for (const [tipo, re] of PALABRAS) {
      if (re.test(t)) return tipo;
    }
    return null;
  }

  public static constancia(tipo: TipologiaObjeto | null): string {
    return tipo ? CONSTANCIA_RECIBO[tipo] : CONSTANCIA_GENERICA;
  }
}
