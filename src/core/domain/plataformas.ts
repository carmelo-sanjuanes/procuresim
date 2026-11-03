// Plataforma de publicación del proceso según la entidad y el objeto.
export type IdPlataforma = 'SECOP_II' | 'TVEC' | 'SUPLOS' | 'SAP_ARIBA' | 'SECOP_I' | 'PORTAL_PROPIO' | 'MULTILATERAL';
export type VistaPlataforma = 'SECOP2' | 'TVEC' | 'SUPLOS' | 'ARIBA' | 'SECOP1';

export interface Plataforma {
  id: IdPlataforma;
  etiqueta: string; // texto del selector
  en: string; // «… en {en}»
  de: string; // «… de {de}»
  subtitulo: string; // cabecera del Paso 10
  accionPublicar: string; // botón del Paso 9
  nota: string; // aviso breve en el Paso 9
  vista?: VistaPlataforma; // simulador de la plataforma, si existe
}

export const PLATAFORMAS: Record<IdPlataforma, Plataforma> = {
  SECOP_II: {
    id: 'SECOP_II', etiqueta: 'SECOP II', en: 'SECOP II', de: 'SECOP II',
    subtitulo: 'SECOP II • Sistema Electrónico de Contratación Pública',
    accionPublicar: 'Publicar Proceso en SECOP II',
    nota: 'Estatuto General (Ley 80 / Ley 1150): la gestión contractual se publica y tramita en SECOP II.',
    vista: 'SECOP2'
  },
  TVEC: {
    id: 'TVEC', etiqueta: 'Tienda Virtual del Estado (TVEC)', en: 'la Tienda Virtual del Estado', de: 'de la Tienda Virtual del Estado',
    subtitulo: 'Tienda Virtual del Estado Colombiano • Acuerdo Marco de Precios',
    accionPublicar: 'Colocar Orden de Compra en la Tienda Virtual del Estado',
    nota: 'Compra por catálogo: la entidad se vincula al Acuerdo Marco y coloca la orden de compra; no hay pliego ni adjudicación competitiva.',
    vista: 'TVEC'
  },
  SUPLOS: {
    id: 'SUPLOS', etiqueta: 'Suplos', en: 'Suplos', de: 'de Suplos',
    subtitulo: 'Suplos • Plataforma de compras (empresas de servicios públicos)',
    accionPublicar: 'Publicar Solicitud de Cotización (RFQ) en Suplos',
    nota: 'Empresas de servicios públicos (Ley 142 de 1994) contratan con su manual y suelen usar plataformas B2B. Confirma cuál usa tu entidad.',
    vista: 'SUPLOS'
  },
  SAP_ARIBA: {
    id: 'SAP_ARIBA', etiqueta: 'SAP Ariba', en: 'SAP Ariba', de: 'de SAP Ariba',
    subtitulo: 'SAP Ariba • Eventos de sourcing y subasta inversa',
    accionPublicar: 'Lanzar Evento de Sourcing / Subasta Inversa en SAP Ariba',
    nota: 'Empresas con régimen privado y grandes contratantes (Ecopetrol, concesiones) gestionan sus compras por eventos de sourcing.',
    vista: 'ARIBA'
  },
  SECOP_I: {
    id: 'SECOP_I', etiqueta: 'SECOP I (publicidad)', en: 'SECOP I', de: 'de SECOP I',
    subtitulo: 'SECOP I • Portal de publicidad (sin transaccionalidad)',
    accionPublicar: 'Publicar Proceso en SECOP I',
    nota: 'SECOP I solo da publicidad y está en desuso: confirma que tu entidad aún lo tenga autorizado.',
    vista: 'SECOP1'
  },
  PORTAL_PROPIO: {
    id: 'PORTAL_PROPIO', etiqueta: 'Portal propio de la entidad', en: 'el portal propio de la entidad', de: 'del portal propio de la entidad',
    subtitulo: 'Portal de contratación de la entidad • Manual interno (derecho privado)',
    accionPublicar: 'Publicar Convocatoria en el Portal Institucional según el Manual Propio',
    nota: 'Régimen de manual propio: se publica en el portal que fije tu manual de contratación. Verifica si además debes registrar el contrato en SECOP II (Ley 1712 de 2014 y tu régimen especial).'
  },
  MULTILATERAL: {
    id: 'MULTILATERAL', etiqueta: 'Plataforma del organismo multilateral', en: 'la plataforma del organismo multilateral', de: 'de la plataforma del organismo multilateral',
    subtitulo: 'Plataforma del organismo financiador • Reglas del convenio de crédito o cooperación',
    accionPublicar: 'Publicar Convocatoria en la plataforma del organismo multilateral',
    nota: 'Recursos de un organismo multilateral: se aplican sus reglas y su plataforma. Verifica en el convenio si además se exige publicar en SECOP.'
  }
};
