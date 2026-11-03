// Motor de Detección y Análisis de Precios Artificialmente Bajos / Temerarios
// Conforme al Decreto 1082 de 2015 (Art. 2.2.1.1.2.2.4) y Guía de CCE para Ofertas con Precios Artificialmente Bajos
export interface OfertaAnalisisPrecio {
  id: string;
  nombreProponente: string;
  valorOfertado: number;
  desviacionFrenteAMediaPct: number;
  zScore: number;
  esSospechosa: boolean;
  motivoAlerta?: string;
  requerimientoEmitido?: boolean;
  sustentacionRadicada?: string;
  evaluacionComite?: 'ACEPTADA_CON_SUSTENTO' | 'RECHAZADA_POR_TEMERIDAD' | 'EN_REVISION';
}

export interface DiagnosticoPreciosArtificialmenteBajos {
  presupuestoOficial: number;
  mediaOfertas: number;
  medianaOfertas: number;
  desviacionEstandar: number;
  umbralSospechaInferiorCOP: number;
  totalOfertas: number;
  ofertasSospechosas: number;
  ofertasAnalizadas: OfertaAnalisisPrecio[];
  requerimientoPlantillaOficial: string;
}

export class AbnormallyLowPriceEngine {
  /**
   * Analiza estadísticamente el conjunto de ofertas económicas para identificar precios temerarios
   */
  public static analizarPrecios(
    presupuestoOficial: number,
    ofertas: { id: string; nombre: string; valor: number }[]
  ): DiagnosticoPreciosArtificialmenteBajos {
    if (ofertas.length === 0) {
      throw new Error('Se requiere al menos una oferta para el análisis de precios.');
    }

    const n = ofertas.length;
    const suma = ofertas.reduce((acc, o) => acc + o.valor, 0);
    const media = suma / n;

    // Desviación estándar muestral
    const varianza =
      n > 1
        ? ofertas.reduce((acc, o) => acc + Math.pow(o.valor - media, 2), 0) / (n - 1)
        : 0;
    const desviacion = Math.sqrt(varianza);

    // Mediana
    const valoresOrdenados = [...ofertas].map((o) => o.valor).sort((a, b) => a - b);
    const mitad = Math.floor(valoresOrdenados.length / 2);
    const mediana =
      valoresOrdenados.length % 2 === 0
        ? (valoresOrdenados[mitad - 1] + valoresOrdenados[mitad]) / 2
        : valoresOrdenados[mitad];

    // Umbral inferior CCE: media - 1.5 * desviación, o 75% del presupuesto si hay baja dispersión
    const umbral1 = media - 1.5 * desviacion;
    const umbral2 = presupuestoOficial * 0.75;
    const umbralSospecha = Math.min(umbral1, umbral2);

    const ofertasAnalizadas: OfertaAnalisisPrecio[] = ofertas.map((o) => {
      const zScore = desviacion > 0 ? Number(((o.valor - media) / desviacion).toFixed(2)) : 0;
      const desviacionMediaPct = Number((((o.valor - media) / media) * 100).toFixed(2));
      const esSospechosa = o.valor < umbralSospecha || zScore < -1.5;

      let motivo = undefined;
      if (esSospechosa) {
        motivo = `El valor ofertado (\$${o.valor.toLocaleString('es-CO')}) se sitúa ${Math.abs(
          desviacionMediaPct
        )}% por debajo de la media del mercado y supera el umbral estadístico de riesgo de CCE (Z-Score: ${zScore}).`;
      }

      return {
        id: o.id,
        nombreProponente: o.nombre,
        valorOfertado: o.valor,
        desviacionFrenteAMediaPct: desviacionMediaPct,
        zScore,
        esSospechosa,
        motivoAlerta: motivo,
        requerimientoEmitido: esSospechosa,
        // La sustentación del proponente y la decisión del comité las aporta el usuario; el simulador no las inventa.
        sustentacionRadicada: undefined,
        evaluacionComite: esSospechosa ? 'EN_REVISION' : undefined
      };
    });

    const sospechosasCount = ofertasAnalizadas.filter((o) => o.esSospechosa).length;

    const requerimiento = `REQUERIMIENTO DE EXPLICACIÓN POR PRECIO ARTIFICIALMENTE BAJO
(Artículo 2.2.1.1.2.2.4 del Decreto 1082 de 2015)

Señores Proponentes con Alerta de Precio:
El Comité Evaluador de la Entidad Estatal, una vez analizada la estructura de costos de las ofertas presentadas, ha identificado que el valor de su propuesta económica se ubica significativamente por debajo de los precios corrientes de mercado y del umbral de sostenibilidad técnica (${umbralSospecha.toLocaleString('es-CO')} COP).

En cumplimiento del debido proceso administrativo, se le solicita presentar en el término perentorio de dos (2) días hábiles:
1. Análisis detallado de costos unitarios directos (materiales, mano de obra legal con factor prestacional y equipos).
2. Soportes de convenios comerciales, facturas de compra mayorista o economías de escala que justifiquen el precio.
3. Certificación de que el precio propuesto no vulnera el salario mínimo legal ni pone en riesgo la ejecución integral del objeto contractual.

En caso de no justificar satisfactoriamente la viabilidad del precio, la propuesta será rechazada por el Comité Evaluador.`;

    return {
      presupuestoOficial,
      mediaOfertas: Math.round(media),
      medianaOfertas: Math.round(mediana),
      desviacionEstandar: Math.round(desviacion),
      umbralSospechaInferiorCOP: Math.round(umbralSospecha),
      totalOfertas: n,
      ofertasSospechosas: sospechosasCount,
      ofertasAnalizadas,
      requerimientoPlantillaOficial: requerimiento
    };
  }
}
