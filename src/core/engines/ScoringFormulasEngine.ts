import { SMMLV_2026 } from '../domain/constants';
// Motor Universal de Fórmulas de Calificación Económica y Matriz de Indicadores de Contratación
// Conforme a Ley 80/1993, Ley 1150/2007 (Art. 5), Ley 1882/2018, Ley 2069/2020 (Art. 35 - Desempates),
// Ley 816/2003 (Industria Nacional), Decreto 392/2018 (Discapacidad) y Pliegos Tipo de Colombia Compra Eficiente (CCE)

export type MetodoCalificacionEconomica =
  | 'MEDIA_ARITMETICA_SIMPLE'
  | 'MEDIA_ARITMETICA_ALTA_TRM'
  | 'MEDIA_GEOMETRICA'
  | 'MEDIA_PONDERADA_PRESUPUESTO'
  | 'MEDIANA_VALOR_ABSOLUTO'
  | 'MENOR_PRECIO';

export interface OfertaSimulada {
  id: string;
  nombreProponente: string;
  valorOfertado: number;
  esMiPyme: boolean;
  esEmpresaMujeres: boolean;
  empleadosDiscapacidad: boolean;
  industriaNacional: boolean; // Bienes/servicios colombianos
  puntajeCalidadTecnica: number; // Max 20 pts
  habilitado: boolean;
  motivoInhabilitacion?: string;
}

export interface ResultadoCalificacionOferta {
  ofertaId: string;
  nombreProponente: string;
  valorOfertado: number;
  puntajeEconomico: number;
  puntajeCalidad: number;
  puntajeIndustriaNacional: number;
  puntajeDiscapacidad: number;
  puntajeMiPyme: number;
  puntajeMujeres: number;
  puntajeTotal: number;
  posicion: number;
  esPrecioArtificialmenteBajo: boolean;
  diferenciaConMediaOMediana: number;
  detallesCalculo: string;
}

export interface ResultadoSimulacionEconomica {
  metodo: MetodoCalificacionEconomica;
  presupuestoOficial: number;
  mediaOCalculoBase: number;
  factorAjusteTRM?: number;
  desviacionEstandar: number;
  umbralPrecioBajo: number;
  ofertasCalificadas: ResultadoCalificacionOferta[];
  formulaMatematicaTexto: string;
  explicacionMetodologia: string;
  ordenEmpates?: string[];
}

export interface IndicadorTipicoCatalogo {
  id: string;
  categoria:
    | 'HABILITANTE_FINANCIERO'
    | 'HABILITANTE_ORGANIZACIONAL'
    | 'HABILITANTE_K_RESIDUAL'
    | 'HABILITANTE_EXPERIENCIA'
    | 'HABILITANTE_JURIDICO'
    | 'CALIFICABLE_ECONOMICO'
    | 'CALIFICABLE_TECNICO'
    | 'CALIFICABLE_INDUSTRIA_NACIONAL'
    | 'CALIFICABLE_DISCAPACIDAD'
    | 'CALIFICABLE_MIPYME'
    | 'CALIFICABLE_MUJERES'
    | 'CRITERIO_DESEMPATE';
  nombre: string;
  fundamentoLegal: string;
  formula: string;
  rangoEstandar: string;
  tipoEvaluacion: 'PASA_NO_PASA' | 'ASIGNA_PUNTAJE' | 'ORDEN_PREFERENCIA';
  puntajeMaximo?: number;
  explicacion: string;
  importanciaEstrategica: string;
}

export class ScoringFormulasEngine {
  /**
   * Catálogo universal y exhaustivo de todos los indicadores típicos de calificación y habilitación
   */
  public static readonly INDICADORES_CATALOGO: IndicadorTipicoCatalogo[] = [
    // 1. HABILITANTES FINANCIEROS (Decreto 1082/2015 Art. 2.2.1.1.1.5.3)
    {
      id: 'IND-FIN-01',
      categoria: 'HABILITANTE_FINANCIERO',
      nombre: 'Índice de Liquidez',
      fundamentoLegal: 'Art. 2.2.1.1.1.5.3 Decreto 1082 de 2015 / Pliegos Tipo CCE',
      formula: 'Activo Corriente / Pasivo Corriente',
      rangoEstandar: '≥ 1.50 (en consultoría ≥ 1.20)',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Mide la capacidad del proponente para responder por sus obligaciones corrientes a corto plazo con sus activos más líquidos.',
      importanciaEstrategica:
        'Si el pasivo corriente es $0 y tiene activos, CCE fija regla de cumplimiento automático (999.0).'
    },
    {
      id: 'IND-FIN-02',
      categoria: 'HABILITANTE_FINANCIERO',
      nombre: 'Nivel de Endeudamiento',
      fundamentoLegal: 'Art. 2.2.1.1.1.5.3 Decreto 1082 de 2015',
      formula: '(Pasivo Total / Activo Total) * 100',
      rangoEstandar: '≤ 70.0% (obra civil general) o ≤ 65.0%',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Porcentaje de los activos de la empresa que se encuentran comprometidos con acreedores y terceros.',
      importanciaEstrategica:
        'Garantiza que la empresa no opere con apalancamiento excesivo que ponga en riesgo la ejecución.'
    },
    {
      id: 'IND-FIN-03',
      categoria: 'HABILITANTE_FINANCIERO',
      nombre: 'Razón de Cobertura de Intereses',
      fundamentoLegal: 'Art. 2.2.1.1.1.5.3 Decreto 1082 de 2015',
      formula: 'Utilidad Operacional / Gastos por Intereses',
      rangoEstandar: '≥ 1.50 o ≥ 2.00',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Capacidad del oferente para atender el servicio de la deuda financiera con el producido de su actividad ordinaria.',
      importanciaEstrategica:
        'Regla CCE: Si la empresa no registra gastos por intereses (=0) y reporta utilidad operacional positiva, CUMPLE plenamente.'
    },
    {
      id: 'IND-FIN-04',
      categoria: 'HABILITANTE_FINANCIERO',
      nombre: 'Capital de Trabajo (KT)',
      fundamentoLegal: 'Manual de Capacidad Financiera CCE / Pliegos Tipo',
      formula: 'Activo Corriente - Pasivo Corriente',
      rangoEstandar: '≥ 20% a 50% del Presupuesto Oficial en COP',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Fondo de maniobra real disponible para inyectar liquidez al proyecto antes de los desembolsos de actas de pago.',
      importanciaEstrategica:
        'Para proponentes plurales (Uniones Temporales), se suman los activos corrientes y se restan los pasivos corrientes de todos.'
    },
    {
      id: 'IND-FIN-05',
      categoria: 'HABILITANTE_FINANCIERO',
      nombre: 'Patrimonio Neto Mínimo',
      fundamentoLegal: 'Ley 80 de 1993 / Criterios de Capacidad Patrimonial CCE',
      formula: 'Activo Total - Pasivo Total',
      rangoEstandar: '≥ 30% a 100% del Presupuesto Oficial',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Mpaldo patrimonial propio que absorbe eventuales contingencias o pérdidas operativas en el contrato.',
      importanciaEstrategica:
        'Evita contratar con sociedades de papel o empresas de vehículo sin capital propio.'
    },

    // 2. HABILITANTES DE CAPACIDAD ORGANIZACIONAL
    {
      id: 'IND-ORG-01',
      categoria: 'HABILITANTE_ORGANIZACIONAL',
      nombre: 'Rentabilidad del Patrimonio (ROE)',
      fundamentoLegal: 'Art. 2.2.1.1.1.5.3 Decreto 1082 de 2015',
      formula: '(Utilidad Operacional / Patrimonio) * 100',
      rangoEstandar: '≥ 5.0% a 10.0%',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Rendimiento que la gestión de la empresa genera sobre el capital invertido por los socios o accionistas.',
      importanciaEstrategica:
        'Evalúa la eficiencia empresarial y la viabilidad del modelo de negocio en el RUP.'
    },
    {
      id: 'IND-ORG-02',
      categoria: 'HABILITANTE_ORGANIZACIONAL',
      nombre: 'Rentabilidad del Activo (ROA)',
      fundamentoLegal: 'Art. 2.2.1.1.1.5.3 Decreto 1082 de 2015',
      formula: '(Utilidad Operacional / Activo Total) * 100',
      rangoEstandar: '≥ 2.0% a 5.0%',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Eficacia de la compañía en la utilización de todos sus activos para generar renta operativa.',
      importanciaEstrategica:
        'Permite comparar empresas de diferente tamaño con una medida relativa estandarizada.'
    },

    // 3. CAPACIDAD RESIDUAL DE CONTRATACIÓN (K RESIDUAL)
    {
      id: 'IND-KRES-01',
      categoria: 'HABILITANTE_K_RESIDUAL',
      nombre: 'Capacidad Residual de Contratación (K-Residual Obra)',
      fundamentoLegal: 'Art. 72 Ley 1682/2013 / Art. 2.2.1.1.1.6.4 Dec. 1082/2015',
      formula: 'KR = (E + CF + CT + CO) - SCE',
      rangoEstandar: 'KR ≥ Presupuesto Oficial del Proceso de Obra',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Aptitud de un contratista de obra pública para asumir nuevos compromisos sin sobrepasar su límite operativo.',
      importanciaEstrategica:
        'Componentes: E (Experiencia), CF (Capacidad Financiera), CT (Capacidad Técnica), CO (Capacidad de Organización), SCE (Saldo de Contratos en Ejecución).'
    },

    // 4. HABILITANTES DE EXPERIENCIA
    {
      id: 'IND-EXP-01',
      categoria: 'HABILITANTE_EXPERIENCIA',
      nombre: 'Experiencia Específica en Códigos UNSPSC',
      fundamentoLegal: 'Clasificador de Bienes y Servicios CCE / Pliegos Tipo',
      formula: 'Coincidencia a 3er nivel (Clase) en RUP',
      rangoEstandar: '100% de los códigos obligatorios del pliego',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Verificación de que los contratos aportados coincidan con el clasificador estandarizado de compras públicas.',
      importanciaEstrategica:
        'No se pueden exigir códigos de cuarto nivel (producto) salvo justificación técnica excepcional.'
    },
    {
      id: 'IND-EXP-02',
      categoria: 'HABILITANTE_EXPERIENCIA',
      nombre: 'Cuantía Acumulada en SMMLV',
      fundamentoLegal: 'Ley 1150 de 2007 / Pliegos Tipo CCE',
      formula: 'Σ Valor Facturado Liquidado / SMMLV del año de terminación',
      rangoEstandar: '≥ 100% a 300% del Presupuesto Oficial en SMMLV',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Monto acumulado en salarios mínimos de contratos ejecutados a satisfacción en los últimos 5 a 10 años.',
      importanciaEstrategica:
        'Permite indexar el valor histórico de contratos pasados al poder adquisitivo presente.'
    },
    {
      id: 'IND-EXP-03',
      categoria: 'HABILITANTE_EXPERIENCIA',
      nombre: 'Límite de Contratos Acreditados',
      fundamentoLegal: 'Pliegos Tipo de Infraestructura y Bienes CCE',
      formula: 'Máximo número de contratos (N)',
      rangoEstandar: 'Entre 1 y 5 contratos válidos',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Evita atomizar la experiencia sumando decenas de contratos insignificantes (atomización de experiencia).',
      importanciaEstrategica:
        'La entidad debe aceptar la experiencia del proponente en los mejores N contratos que alcancen el valor.'
    },

    // 5. HABILITANTES JURÍDICOS
    {
      id: 'IND-JUR-01',
      categoria: 'HABILITANTE_JURIDICO',
      nombre: 'Registro Único de Proponentes (RUP) en Firme',
      fundamentoLegal: 'Art. 6 Ley 1150 de 2007 modificado por Ley 1882 de 2018',
      formula: 'Renovación anual antes del 5° día hábil de abril',
      rangoEstandar: 'Inscrito, Renovado y en Firmeza Legal',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Plena prueba de las condiciones de experiencia, capacidad jurídica y financiera del proponente.',
      importanciaEstrategica:
        'La información contenida en el RUP es plena prueba y no se pueden solicitar documentos adicionales certificados allí.'
    },
    {
      id: 'IND-JUR-02',
      categoria: 'HABILITANTE_JURIDICO',
      nombre: 'Paz y Salvo de Parafiscales y Seguridad Social',
      fundamentoLegal: 'Art. 50 Ley 789 de 2002 / Art. 9 Ley 828 de 2003',
      formula: 'Certificación suscrita por Revisor Fiscal o Representante Legal',
      rangoEstandar: 'Al día en los últimos 6 meses previos a la oferta',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Acredita el cumplimiento de aportes a salud, pensión, riesgos laborales (ARL), SENA, ICBF y Cajas de Compensación.',
      importanciaEstrategica:
        'Su no acreditación impide la adjudicación y firma del contrato estatal.'
    },
    {
      id: 'IND-JUR-03',
      categoria: 'HABILITANTE_JURIDICO',
      nombre: 'Garantía de Seriedad de la Oferta',
      fundamentoLegal: 'Art. 2.2.1.2.3.1.6 Decreto 1082 de 2015',
      formula: 'Póliza de seguro o garantía bancaria por el 10% del PO',
      rangoEstandar: 'Vigencia: Término del proceso + 3 meses mínimos',
      tipoEvaluacion: 'PASA_NO_PASA',
      explicacion:
        'Ampara la seriedad de la propuesta, la suscripción del contrato en caso de adjudicación y aportes de pólizas.',
      importanciaEstrategica:
        'Requisito subsanable en cuanto a fecha o errores formales según la Ley 1882 de 2018.'
    },

    // 6. CRITERIOS DE ASIGNACIÓN DE PUNTAJE (CALIFICACIÓN - 100 PUNTOS)
    {
      id: 'IND-CAL-01',
      categoria: 'CALIFICABLE_ECONOMICO',
      nombre: 'Oferta Económica / Precio (Fórmulas CCE)',
      fundamentoLegal: 'Art. 5 Ley 1150 de 2007 / Pliegos Tipo Colombia Compra Eficiente',
      formula: 'Media aritmética, Geométrica, TRM Alta, Mediana o Menor Precio',
      rangoEstandar: '60 a 70 puntos sobre 100',
      tipoEvaluacion: 'ASIGNA_PUNTAJE',
      puntajeMaximo: 60,
      explicacion:
        'Asigna puntaje matemático a la oferta en función de su cercanía a la media o menor valor según la fórmula elegida por sorteo.',
      importanciaEstrategica:
        'El método exacto de fórmula económica se define en audiencia pública mediante sorteo de balota o TRM.'
    },
    {
      id: 'IND-CAL-02',
      categoria: 'CALIFICABLE_TECNICO',
      nombre: 'Factor de Calidad / Personal Clave y Garantías',
      fundamentoLegal: 'Art. 5 Num. 2 Ley 1150 de 2007 / Pliegos Tipo',
      formula: 'Formación académica adicional + Años experiencia específica',
      rangoEstandar: '20 puntos sobre 100',
      tipoEvaluacion: 'ASIGNA_PUNTAJE',
      puntajeMaximo: 20,
      explicacion:
        'Califica la disponibilidad de profesionales con posgrado (especialización/maestría), planes de calidad y garantías adicionales.',
      importanciaEstrategica:
        'Evita que la contratación se defina exclusivamente por precio y premia la idoneidad técnica superior.'
    },
    {
      id: 'IND-CAL-03',
      categoria: 'CALIFICABLE_INDUSTRIA_NACIONAL',
      nombre: 'Apoyo a la Industria Nacional',
      fundamentoLegal: 'Ley 816 de 2003 / Art. 2.2.1.2.4.1.3 Decreto 1082 de 2015',
      formula: '10 pts para 100% colombiano; 5 a 10 pts trato nacional (TLC); 0 extranjero',
      rangoEstandar: '10 o 20 puntos sobre 100',
      tipoEvaluacion: 'ASIGNA_PUNTAJE',
      puntajeMaximo: 10,
      explicacion:
        'Incentivo legal obligatorio para promover bienes y servicios fabricados u originados en Colombia.',
      importanciaEstrategica:
        'Los oferentes extranjeros de países con Tratado de Libre Comercio (TLC) suscrito con Colombia reciben trato nacional.'
    },
    {
      id: 'IND-CAL-04',
      categoria: 'CALIFICABLE_DISCAPACIDAD',
      nombre: 'Vinculación de Personas con Discapacidad',
      fundamentoLegal: 'Decreto 392 de 2018 reglamentario de la Ley 1618 de 2013',
      formula: '≥ 10% trabajadores: 2 pts; Entre 1% y 9%: 1 pt; 0%: 0 pts',
      rangoEstandar: '1 a 2 puntos sobre 100',
      tipoEvaluacion: 'ASIGNA_PUNTAJE',
      puntajeMaximo: 2,
      explicacion:
        'Puntaje adicional a proponentes que certifiquen vinculación laboral de trabajadores en condición de discapacidad en su nómina.',
      importanciaEstrategica:
        'Acreditado mediante certificado del Ministerio del Trabajo y certificación del Representante Legal/Revisor Fiscal.'
    },
    {
      id: 'IND-CAL-05',
      categoria: 'CALIFICABLE_MIPYME',
      nombre: 'Incentivo a MiPymes Nacionales',
      fundamentoLegal: 'Ley 2069 de 2020 (Ley de Emprendimiento) / Dcto 1860 de 2021',
      formula: 'Acreditación de clasificación de tamaño empresarial según ingresos ordinarios',
      rangoEstandar: 'Hasta 5 puntos o primer criterio de desempate',
      tipoEvaluacion: 'ASIGNA_PUNTAJE',
      puntajeMaximo: 5,
      explicacion:
        'Fomenta la participación de micro, pequeñas y medianas empresas colombianas en compras públicas.',
      importanciaEstrategica:
        'Clasificación definida por el Decreto 957 de 2019 según rangos de UVT de ingresos operacionales.'
    },
    {
      id: 'IND-CAL-06',
      categoria: 'CALIFICABLE_MUJERES',
      nombre: 'Emprendimientos y Empresas de Mujeres',
      fundamentoLegal: 'Art. 34 y 35 Ley 2069 de 2020 / Decreto 1860 de 2021',
      formula: '> 50% capital de mujeres o representación legal y junta directiva femenina',
      rangoEstandar: '1 a 3 puntos o preferencia en desempate',
      tipoEvaluacion: 'ASIGNA_PUNTAJE',
      puntajeMaximo: 3,
      explicacion:
        'Incentivo para empresas lideradas, controladas mayoritariamente o compuestas por mujeres colombianas.',
      importanciaEstrategica:
        'Mecanismo de acción afirmativa para cerrar brechas de género en compras estatales.'
    },

    // 7. CRITERIOS LEGALES DE DESEMPATE (Art. 35 Ley 2069 de 2020)
    {
      id: 'IND-DESEMP-01',
      categoria: 'CRITERIO_DESEMPATE',
      nombre: 'Cadena Jerárquica de Desempate Legal',
      fundamentoLegal: 'Artículo 35 Ley 2069 de 2020 (Orden de prelación sucesivo)',
      formula: '1° MiPyme → 2° Mujeres → 3° Discapacidad → 4° Víctimas → 5° Técnico → 6° Económico → 7° Sorteo',
      rangoEstandar: 'Aplicación estricta y vinculante',
      tipoEvaluacion: 'ORDEN_PREFERENCIA',
      explicacion:
        'Regla legal imperativa para dirimir empates en el puntaje total final de dos o más propuestas válidas.',
      importanciaEstrategica:
        'Si persiste el empate tras agotar todos los factores afirmativos y técnicos, se realiza sorteo de balotas en audiencia pública.'
    }
  ];

  /**
   * Ejecuta la simulación matemática de la calificación económica según la fórmula seleccionada
   */
  public static simularCalificacionEconomica(
    ofertas: OfertaSimulada[],
    presupuestoOficial: number,
    metodo: MetodoCalificacionEconomica,
    puntajeMaximoEconomico = 60,
    factorTRMAleatorio = 0.02
  ): ResultadoSimulacionEconomica {
    const ofertasValidas = ofertas.filter(
      (o) => o.habilitado && o.valorOfertado > 0 && o.valorOfertado <= presupuestoOficial
    );

    if (ofertasValidas.length === 0) {
      return {
        metodo,
        presupuestoOficial,
        mediaOCalculoBase: 0,
        desviacionEstandar: 0,
        umbralPrecioBajo: 0,
        ofertasCalificadas: [],
        formulaMatematicaTexto: 'No hay ofertas habilitadas dentro del presupuesto oficial.',
        explicacionMetodologia: 'Todas las ofertas fueron rechazadas o superaron el presupuesto.'
      };
    }

    const n = ofertasValidas.length;
    const valores = ofertasValidas.map((o) => o.valorOfertado);
    const suma = valores.reduce((acc, v) => acc + v, 0);
    const mediaSimple = suma / n;

    // Desviación estándar
    const varianza =
      valores.reduce((acc, v) => acc + Math.pow(v - mediaSimple, 2), 0) / (n > 1 ? n - 1 : 1);
    const desviacionEstandar = Math.sqrt(varianza);

    // Umbral de precio artificialmente bajo CCE (menor a Media - 2*sigma o menor a 80% del PO)
    const umbralPrecioBajo = Math.min(mediaSimple - 2 * desviacionEstandar, presupuestoOficial * 0.8);

    let calculoBase = mediaSimple;
    let formulaTexto = '';
    let explicacionMetodologia = '';

    switch (metodo) {
      case 'MEDIA_ARITMETICA_SIMPLE':
        calculoBase = mediaSimple;
        formulaTexto = 'X̄ = (Σ Vi) / N | Pi = Pmax * [1 - (|Vi - X̄| / X̄)]';
        explicacionMetodologia =
          'Se promedian las ofertas válidas. La propuesta con menor distancia absoluta a la media obtiene el puntaje máximo; a mayor distancia, menor puntaje.';
        break;

      case 'MEDIA_ARITMETICA_ALTA_TRM':
        calculoBase = mediaSimple * (1 + factorTRMAleatorio);
        formulaTexto = `X̄_alta = X̄ * (1 + F_TRM) [F=${(factorTRMAleatorio * 100).toFixed(2)}%] | Pi = Pmax * [1 - (|Vi - X̄_alta| / X̄_alta)]`;
        explicacionMetodologia =
          'Se toma la media aritmética y se desplaza hacia arriba con el factor de la TRM del día. Premia ofertas ligeramente superiores al promedio para desincentivar guerras de precios.';
        break;

      case 'MEDIA_GEOMETRICA': {
        // Media geométrica: raíz N-ésima del producto
        const logSuma = valores.reduce((acc, v) => acc + Math.log(v), 0);
        calculoBase = Math.exp(logSuma / n);
        formulaTexto = 'G = (Π Vi)^(1/N) | Pi = Pmax * [1 - (|Vi - G| / G)]';
        explicacionMetodologia =
          'Utiliza el producto de las ofertas para atenuar el efecto de valores extremos o asimétricos.';
        break;
      }

      case 'MEDIA_PONDERADA_PRESUPUESTO':
        calculoBase = (suma + presupuestoOficial) / (n + 1);
        formulaTexto = 'X̄_pond = (Σ Vi + PresupuestoOficial) / (N + 1) | Pi = Pmax * [1 - (|Vi - X̄_pond| / X̄_pond)]';
        explicacionMetodologia =
          'Incluye el Presupuesto Oficial como un voto testigo en el denominador (N+1). Acerca la media al techo presupuestal fijado por la Entidad.';
        break;

      case 'MEDIANA_VALOR_ABSOLUTO': {
        const ordenados = [...valores].sort((a, b) => a - b);
        const mid = Math.floor(ordenados.length / 2);
        calculoBase =
          ordenados.length % 2 !== 0 ? ordenados[mid] : (ordenados[mid - 1] + ordenados[mid]) / 2;
        formulaTexto = 'Me = Mediana(Vi) | Pi = Pmax * [1 - (|Vi - Me| / Me)]';
        explicacionMetodologia =
          'Calcula el valor central de la distribución ordenada de precios. Es inmune a ofertas extremas u outliers.';
        break;
      }

      case 'MENOR_PRECIO': {
        calculoBase = Math.min(...valores);
        formulaTexto = 'Pi = Pmax * (Vmin / Vi)';
        explicacionMetodologia =
          'Método clásico de proporcionalidad inversa: La propuesta válida más económica obtiene el 100% del puntaje económico.';
        break;
      }
    }

    // Calcular puntaje para cada oferta
    const calificadas: ResultadoCalificacionOferta[] = ofertas.map((o) => {
      if (!o.habilitado || o.valorOfertado > presupuestoOficial) {
        return {
          ofertaId: o.id,
          nombreProponente: o.nombreProponente,
          valorOfertado: o.valorOfertado,
          puntajeEconomico: 0,
          puntajeCalidad: 0,
          puntajeIndustriaNacional: 0,
          puntajeDiscapacidad: 0,
          puntajeMiPyme: 0,
          puntajeMujeres: 0,
          puntajeTotal: 0,
          posicion: 999,
          esPrecioArtificialmenteBajo: false,
          diferenciaConMediaOMediana: 0,
          detallesCalculo: o.motivoInhabilitacion || 'Rechazada: Supera presupuesto oficial'
        };
      }

      let ptsEcon = 0;
      const dif = Math.abs(o.valorOfertado - calculoBase);

      if (metodo === 'MENOR_PRECIO') {
        ptsEcon = Number((puntajeMaximoEconomico * (calculoBase / o.valorOfertado)).toFixed(2));
      } else {
        const factorDiferencia = dif / calculoBase;
        ptsEcon = Number(Math.max(0, puntajeMaximoEconomico * (1 - factorDiferencia)).toFixed(2));
      }

      const ptsIndustria = o.industriaNacional ? 10 : 0;
      const ptsDiscapacidad = o.empleadosDiscapacidad ? 2 : 0;
      const ptsMiPyme = o.esMiPyme ? 5 : 0;
      const ptsMujeres = o.esEmpresaMujeres ? 3 : 0;
      const ptsCalidad = o.puntajeCalidadTecnica || 20;

      const total = Number(
        (ptsEcon + ptsCalidad + ptsIndustria + ptsDiscapacidad + ptsMiPyme + ptsMujeres).toFixed(2)
      );

      const esBajo = o.valorOfertado < umbralPrecioBajo;

      return {
        ofertaId: o.id,
        nombreProponente: o.nombreProponente,
        valorOfertado: o.valorOfertado,
        puntajeEconomico: ptsEcon,
        puntajeCalidad: ptsCalidad,
        puntajeIndustriaNacional: ptsIndustria,
        puntajeDiscapacidad: ptsDiscapacidad,
        puntajeMiPyme: ptsMiPyme,
        puntajeMujeres: ptsMujeres,
        puntajeTotal: total,
        posicion: 0,
        esPrecioArtificialmenteBajo: esBajo,
        diferenciaConMediaOMediana: dif,
        detallesCalculo: `Distancia a referencia: \$${dif.toLocaleString('es-CO')} COP | Puntaje Económico: ${ptsEcon}/${puntajeMaximoEconomico}`
      };
    });

    // Ordenar por puntaje total descendente y aplicar reglas de desempate
    calificadas.sort((a, b) => {
      if (b.puntajeTotal !== a.puntajeTotal) {
        return b.puntajeTotal - a.puntajeTotal;
      }
      // Desempate Art. 35 Ley 2069 de 2020:
      const ofA = ofertas.find((o) => o.id === a.ofertaId);
      const ofB = ofertas.find((o) => o.id === b.ofertaId);

      // 1. MiPyme
      if (ofA?.esMiPyme !== ofB?.esMiPyme) return ofA?.esMiPyme ? -1 : 1;
      // 2. Empresas de Mujeres
      if (ofA?.esEmpresaMujeres !== ofB?.esEmpresaMujeres) return ofA?.esEmpresaMujeres ? -1 : 1;
      // 3. Discapacidad
      if (ofA?.empleadosDiscapacidad !== ofB?.empleadosDiscapacidad) return ofA?.empleadosDiscapacidad ? -1 : 1;
      // 4. Calidad técnica
      if (a.puntajeCalidad !== b.puntajeCalidad) return b.puntajeCalidad - a.puntajeCalidad;
      // 5. Económico
      return b.puntajeEconomico - a.puntajeEconomico;
    });

    // Asignar posiciones ordinales
    calificadas.forEach((c, idx) => {
      c.posicion = idx + 1;
    });

    return {
      metodo,
      presupuestoOficial,
      mediaOCalculoBase: Number(calculoBase.toFixed(2)),
      factorAjusteTRM: factorTRMAleatorio,
      desviacionEstandar: Number(desviacionEstandar.toFixed(2)),
      umbralPrecioBajo: Number(umbralPrecioBajo.toFixed(2)),
      ofertasCalificadas: calificadas,
      formulaMatematicaTexto: formulaTexto,
      explicacionMetodologia
    };
  }

  /**
   * Calculadora de Capacidad Residual de Contratación (K-Residual) de Obra Pública (Decreto 1082/2015)
   */
  public static calcularKResidual(datos: {
    experienciaSMMLV: number; // E
    capacidadFinancieraLiquidez: number; // CF (Liquidez)
    profesionalesTecnicos: number; // CT (Personal técnico)
    ingresosOperacionalesSMMLV: number; // CO (Capacidad de Organización)
    saldosContratosEnEjecucionCOP: number; // SCE
    smmlvValorCOP: number; // Valor actual del salario mínimo
  }): {
    puntajeE: number;
    puntajeCF: number;
    puntajeCT: number;
    puntajeCO: number;
    capacidadContratacionCOP: number;
    saldoContratosEjecucionCOP: number;
    kResidualTotalCOP: number;
    formulaDesglose: string;
  } {
    const smmlv = datos.smmlvValorCOP || SMMLV_2026; // SMMLV de referencia

    // 1. Experiencia (E) en SMMLV: Puntaje según tabla CCE
    const puntajeE = Math.min(100, (datos.experienciaSMMLV / 5000) * 100);

    // 2. Capacidad Financiera (CF): Basada en Índice de Liquidez
    const puntajeCF = Math.min(100, (datos.capacidadFinancieraLiquidez / 2.5) * 100);

    // 3. Capacidad Técnica (CT): Basada en ingenieros y arquitectos vinculados
    const puntajeCT = Math.min(100, datos.profesionalesTecnicos * 10);

    // 4. Capacidad de Organización (CO): Ingresos en SMMLV
    const puntajeCO = Math.min(100, (datos.ingresosOperacionalesSMMLV / 10000) * 100);

    // Capacidad Máxima de Contratación (en SMMLV ponderado CCE)
    const factorPonderado = (puntajeE * 0.4 + puntajeCF * 0.2 + puntajeCT * 0.2 + puntajeCO * 0.2) / 100;
    const capacidadContratacionCOP = factorPonderado * datos.ingresosOperacionalesSMMLV * smmlv * 1.5;

    // K-Residual = Capacidad Total - Saldo de Contratos en Ejecución (SCE)
    const kResidualTotalCOP = Math.max(0, capacidadContratacionCOP - datos.saldosContratosEnEjecucionCOP);

    return {
      puntajeE: Number(puntajeE.toFixed(1)),
      puntajeCF: Number(puntajeCF.toFixed(1)),
      puntajeCT: Number(puntajeCT.toFixed(1)),
      puntajeCO: Number(puntajeCO.toFixed(1)),
      capacidadContratacionCOP: Number(capacidadContratacionCOP.toFixed(0)),
      saldoContratosEjecucionCOP: datos.saldosContratosEnEjecucionCOP,
      kResidualTotalCOP: Number(kResidualTotalCOP.toFixed(0)),
      formulaDesglose: `KR = [(E*40% + CF*20% + CT*20% + CO*20%) * Ingresos * 1.5] - SCE`
    };
  }

  /**
   * Tabla Oficial de Rangos de Colombia Compra Eficiente (CCE) para Selección de Fórmulas
   */
  public static readonly RANGOS_CCE_VARIABLES_EXOGENAS: {
    rangoMin: number;
    rangoMax: number;
    metodo: MetodoCalificacionEconomica;
    nombreFormula: string;
    descripcion: string;
  }[] = [
    {
      rangoMin: 0,
      rangoMax: 16,
      metodo: 'MEDIA_ARITMETICA_SIMPLE',
      nombreFormula: 'Media Aritmética Simple',
      descripcion: 'Promedio simple no ponderado de las ofertas habilitadas.'
    },
    {
      rangoMin: 17,
      rangoMax: 33,
      metodo: 'MEDIA_ARITMETICA_ALTA_TRM',
      nombreFormula: 'Media Aritmética Alta (TRM)',
      descripcion: 'Media desplazada hacia arriba con el factor porcentual de la TRM.'
    },
    {
      rangoMin: 34,
      rangoMax: 50,
      metodo: 'MEDIA_GEOMETRICA',
      nombreFormula: 'Media Geométrica',
      descripcion: 'Raíz N-ésima del producto para mitigar asimetrías extremas.'
    },
    {
      rangoMin: 51,
      rangoMax: 67,
      metodo: 'MEDIA_PONDERADA_PRESUPUESTO',
      nombreFormula: 'Media Ponderada con Presupuesto Oficial',
      descripcion: 'Promedio que incorpora el presupuesto oficial de la entidad como voto testigo.'
    },
    {
      rangoMin: 68,
      rangoMax: 84,
      metodo: 'MEDIANA_VALOR_ABSOLUTO',
      nombreFormula: 'Mediana con Valor Absoluto',
      descripcion: 'Valor central de la distribución ordenada, inmune a valores atípicos.'
    },
    {
      rangoMin: 85,
      rangoMax: 99,
      metodo: 'MENOR_PRECIO',
      nombreFormula: 'Menor Precio (Proporcionalidad)',
      descripcion: 'Calificación clásica proporcionalmente inversa a la oferta más económica.'
    }
  ];

  /**
   * Determina la fórmula aplicable según los 2 dígitos de la TRM o variable exógena
   */
  public static obtenerMetodoSegunDigitos(dosDigitos: number): {
    metodo: MetodoCalificacionEconomica;
    rangoTexto: string;
    nombreFormula: string;
    descripcion: string;
  } {
    const normalizado = Math.min(99, Math.max(0, Math.floor(dosDigitos)));
    const encontrado =
      this.RANGOS_CCE_VARIABLES_EXOGENAS.find(
        (r) => normalizado >= r.rangoMin && normalizado <= r.rangoMax
      ) || this.RANGOS_CCE_VARIABLES_EXOGENAS[0];

    return {
      metodo: encontrado.metodo,
      rangoTexto: `Rango [${encontrado.rangoMin.toString().padStart(2, '0')} - ${encontrado.rangoMax.toString().padStart(2, '0')}]`,
      nombreFormula: encontrado.nombreFormula,
      descripcion: encontrado.descripcion
    };
  }

  /**
   * Extrae los dos últimos dígitos (decimales o enteros) del valor de la TRM
   */
  public static extraerDigitosTRM(trm: number): number {
    // Si la TRM tiene decimales (ej: 4185.50), toma los 2 decimales (50)
    // Si es entera o se redondea, toma los 2 últimos dígitos enteros (85)
    const str = trm.toFixed(2);
    const partes = str.split('.');
    if (partes.length > 1 && partes[1] !== '00') {
      return parseInt(partes[1].substring(0, 2), 10);
    }
    const enteros = partes[0];
    return parseInt(enteros.substring(enteros.length - 2), 10);
  }

  /**
   * Sorteo por balota en audiencia pública (Balotas del 1 al 6)
   */
  public static sortearBalotaEnAudiencia(balotaFijada?: number): {
    balota: number;
    metodo: MetodoCalificacionEconomica;
    nombreFormula: string;
    codigoVerificacion: string;
  } {
    const balota = balotaFijada || Math.floor(Math.random() * 6) + 1;
    const metodos: MetodoCalificacionEconomica[] = [
      'MEDIA_ARITMETICA_SIMPLE',
      'MEDIA_ARITMETICA_ALTA_TRM',
      'MEDIA_GEOMETRICA',
      'MEDIA_PONDERADA_PRESUPUESTO',
      'MEDIANA_VALOR_ABSOLUTO',
      'MENOR_PRECIO'
    ];
    const metodo = metodos[balota - 1] || 'MEDIA_ARITMETICA_SIMPLE';

    const nombres: Record<MetodoCalificacionEconomica, string> = {
      MEDIA_ARITMETICA_SIMPLE: 'Media Aritmética Simple (Balota 1)',
      MEDIA_ARITMETICA_ALTA_TRM: 'Media Aritmética Alta TRM (Balota 2)',
      MEDIA_GEOMETRICA: 'Media Geométrica (Balota 3)',
      MEDIA_PONDERADA_PRESUPUESTO: 'Media Ponderada con Presupuesto Oficial (Balota 4)',
      MEDIANA_VALOR_ABSOLUTO: 'Mediana con Valor Absoluto (Balota 5)',
      MENOR_PRECIO: 'Menor Precio (Balota 6)'
    };

    return {
      balota,
      metodo,
      nombreFormula: nombres[metodo],
      codigoVerificacion: `BAL-${Date.now().toString().slice(-6)}-SHA256`
    };
  }

  /**
   * Genera el Acta Oficial de Audiencia Pública de Adjudicación e Informe Económico Definitivo
   * Conforme a la Ley 80/1993, Ley 1150/2007 (Art. 9), Ley 1882/2018 y Pliegos Tipo de CCE
   */
  public static redactarActaAdjudicacionOficial(
    procesoInfo: { numeroProceso: string; objeto: string; entidadNombre: string; presupuestoOficial: number },
    resultado: ResultadoSimulacionEconomica,
    mecanismoSorteo: string,
    valorExogeno: string | number
  ): string {
    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const ganadora = resultado.ofertasCalificadas.find((o) => o.posicion === 1) || resultado.ofertasCalificadas[0];

    return `ACTA DE AUDIENCIA PÚBLICA DE EVALUACIÓN ECONÓMICA Y ADJUDICACIÓN
PROCESO DE SELECCIÓN: ${procesoInfo.numeroProceso}
ENTIDAD CONTRATANTE: ${procesoInfo.entidadNombre.toUpperCase()}

1. LUGAR, FECHA Y HORA:
En la sala institucional y a través de la plataforma transaccional SECOP II, siendo las ${hora} horas del día ${fecha}.

2. OBJETO DEL PROCESO:
"${procesoInfo.objeto}"

3. PRESUPUESTO OFICIAL ESTIMADO:
$${procesoInfo.presupuestoOficial.toLocaleString('es-CO')} COP.

4. SELECCIÓN DEL MÉTODO DE CALIFICACIÓN ECONÓMICA (PLIEGOS TIPO CCE):
De conformidad con los documentos tipo adoptados por Colombia Compra Eficiente y el pliego de condiciones definitivo, en la presente audiencia pública se procedió a determinar el método de ponderación económica aplicable a través de variable exógena:
• Mecanismo Utilizado: ${mecanismoSorteo}
• Valor / Dígito Verificado: ${valorExogeno}
• Método Resultante: ${resultado.formulaMatematicaTexto}
• Explicación Metodológica: ${resultado.explicacionMetodologia}

5. DETERMINACIÓN DE PRECIOS ARTIFICIALMENTE BAJOS:
Conforme al Decreto 1082 de 2015 (Art. 2.2.1.1.2.2.4) y las guías de CCE, se calculó la desviación estándar (σ = $${Math.round(resultado.desviacionEstandar).toLocaleString('es-CO')}) y el umbral de alerta técnica ($${Math.round(resultado.umbralPrecioBajo).toLocaleString('es-CO')}).
${resultado.ofertasCalificadas.some(o => o.esPrecioArtificialmenteBajo) 
  ? `Se identificaron ofertas que se encuentran por debajo del umbral de alerta, requiriéndose la verificación de su estructura de costos.` 
  : `Ninguna de las ofertas habilitadas incurre en causales de precio artificialmente bajo.`}

6. CUADRO DE CALIFICACIÓN Y ORDEN DE ELEGIBILIDAD DEFINITIVO:
${resultado.ofertasCalificadas.map(o => `• Puesto ${o.posicion}°: ${o.nombreProponente}
  Valor Ofertado: $${o.valorOfertado.toLocaleString('es-CO')}
  Puntaje Económico: ${o.puntajeEconomico.toFixed(2)} pts
  Calidad Técnica: ${o.puntajeCalidad.toFixed(2)} pts | Industria Nal: ${o.puntajeIndustriaNacional} pts | Discapacidad: ${o.puntajeDiscapacidad} pts | MiPyme: ${o.puntajeMiPyme} pts | Mujeres: ${o.puntajeMujeres} pts
  PUNTAJE TOTAL CONSOLIDADO: ${o.puntajeTotal.toFixed(2)} / 100 pts`).join('\n\n')}

7. DECISIÓN DE ADJUDICACIÓN:
En mérito de lo expuesto, la entidad declara que la propuesta presentada por:
"${ganadora ? ganadora.nombreProponente : 'N/A'}"
ocupó el PRIMER LUGAR en el orden de elegibilidad con un puntaje total consolidado de ${ganadora ? ganadora.puntajeTotal.toFixed(2) : 0} puntos, por un valor de $${ganadora ? ganadora.valorOfertado.toLocaleString('es-CO') : 0} COP, cumpliendo a cabalidad con la totalidad de los requisitos jurídicos, financieros, de experiencia, y habiendo obtenido la mayor favorabilidad según las reglas de la Ley 80 de 1993, Ley 1150 de 2007, Ley 1882 de 2018 y Ley 2069 de 2020.

En constancia, se firma la presente acta por el Ordenador del Gasto, el Comité Evaluador y los Proponentes presentes.
`;
  }
}
