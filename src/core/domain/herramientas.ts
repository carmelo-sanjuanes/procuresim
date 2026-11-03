// Herramientas de ayuda que el flujo ofrece en el momento oportuno («¿Lo vas a necesitar?»).
// Sí → el botón queda visible en ese paso. No → se le indica cómo llamarla después (Ctrl + K).

export type IdHerramienta = 'CRONOGRAMA' | 'TVEC' | 'COTIZACIONES' | 'EMPATE' | 'AIU' | 'COMUNICACIONES';

export interface DefinicionHerramienta {
  id: IdHerramienta;
  titulo: string;
  pregunta: string;
  boton: string;
  /** Texto que el usuario escribe en la búsqueda (Ctrl + K) para encontrarla de nuevo. */
  busqueda: string;
  /** Palabras clave adicionales para la paleta de comandos. */
  claves: string;
}

export const HERRAMIENTAS: Record<IdHerramienta, DefinicionHerramienta> = {
  CRONOGRAMA: {
    id: 'CRONOGRAMA',
    titulo: 'Cronograma legal con festivos de Colombia',
    pregunta: '¿Quieres calcular el cronograma legal con los festivos de Colombia?',
    boton: 'Calcular cronograma legal',
    busqueda: 'cronograma',
    claves: 'cronograma plazos fechas festivos días hábiles línea de tiempo ley emiliani'
  },
  TVEC: {
    id: 'TVEC',
    titulo: 'Cotizador de Acuerdo Marco (Tienda Virtual del Estado)',
    pregunta: '¿Este bien o servicio podría estar en un Acuerdo Marco de Precios?',
    boton: 'Abrir cotizador de Acuerdo Marco',
    busqueda: 'acuerdo marco',
    claves: 'acuerdo marco tvec tienda virtual catálogo cotizador orden de compra computadores combustible vehículos'
  },
  COTIZACIONES: {
    id: 'COTIZACIONES',
    titulo: 'Análisis de cotizaciones (media, mediana, menor valor)',
    pregunta: '¿Vas a sustentar el presupuesto con cotizaciones?',
    boton: 'Analizar cotizaciones',
    busqueda: 'cotizaciones',
    claves: 'cotizaciones estudio de mercado media mediana menor valor presupuesto oficial precios'
  },
  EMPATE: {
    id: 'EMPATE',
    titulo: 'Desempate con criterios de la Ley 2069 de 2020',
    pregunta: '¿Hubo empate entre propuestas?',
    boton: 'Resolver el empate',
    busqueda: 'empate',
    claves: 'empate desempate ley 2069 decreto 1860 mipyme criterios balota'
  },
  AIU: {
    id: 'AIU',
    titulo: 'AIU e IVA sobre la utilidad',
    pregunta: '¿El contrato de obra se pacta con AIU?',
    boton: 'Desglosar AIU e IVA',
    busqueda: 'aiu',
    claves: 'aiu administración imprevistos utilidad iva obra'
  },
  COMUNICACIONES: {
    id: 'COMUNICACIONES',
    titulo: 'Centro de comunicaciones y alarmas de términos',
    pregunta: '¿Vas a enviar alguna notificación o citación oficial?',
    boton: 'Abrir centro de comunicaciones',
    busqueda: 'comunicaciones',
    claves: 'comunicaciones notificaciones correo citación audiencia caducidad precio bajo mínima cuantía alarmas términos adendas traslado'
  }
};

export interface ContextoHerramienta {
  modalidad?: 'LICITACION_PUBLICA' | 'SELECCION_ABREVIADA_MENOR_CUANTIA' | 'MINIMA_CUANTIA' | 'CONCURSO_MERITOS_ABIERTO' | 'CONTRATACION_DIRECTA';
  presupuestoCOP?: number;
}

export const EVENTO_ABRIR_HERRAMIENTA = 'procuresim:abrir-herramienta';

export function abrirHerramienta(id: IdHerramienta, contexto?: ContextoHerramienta): void {
  window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_HERRAMIENTA, { detail: { id, contexto } }));
}
