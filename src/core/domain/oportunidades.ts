// Buscador de oportunidades: perfiles de búsqueda configurables y oportunidades encontradas.

export interface PerfilBusqueda {
  id: string;
  nombre: string;
  codigos: string;            // UNSPSC separados por coma (prefijos válidos: 72, 7214, 721410…)
  palabras: string;           // palabras clave separadas por coma
  excluir: string;            // palabras que descartan
  departamentos: string[];    // vacío = todo el país
  presupuestoMin: string;
  presupuestoMax: string;
  modalidades: string[];      // ids de MODALIDADES_BUSQUEDA
  dias: number;               // publicadas en los últimos N días
  vistas: string[];           // ids ya vistos (para marcar «Nueva»)
}

export interface Oportunidad {
  id: string;                 // id del proceso o id propio
  plataforma: string;         // etiqueta
  entidad: string;
  objeto: string;
  referencia: string;
  codigo: string;
  valor: number;
  modalidad: string;
  departamento: string;
  publicada: string;          // YYYY-MM-DD
  cierre?: string;            // YYYY-MM-DD (los datos abiertos de SECOP II no lo traen: se digita)
  fase: string;
  enlace: string;
  origen: 'SECOP2_ABIERTO' | 'MANUAL';
}

export interface Puntuada extends Oportunidad { puntaje: number; razones: string[]; alertas: string[]; nueva: boolean }

export type EstadoSeguimiento = 'INTERESANTE' | 'EVALUANDO' | 'POSTULADO' | 'DESCARTADA';
export interface OportunidadGuardada { op: Oportunidad; estado: EstadoSeguimiento; nota: string; guardada: string }

export const MODALIDADES_BUSQUEDA: { id: string; etiqueta: string; valores: string[] }[] = [
  { id: 'LP', etiqueta: 'Licitación pública', valores: ['Licitación pública', 'Licitación pública Obra Publica'] },
  { id: 'SAMC', etiqueta: 'Selección abreviada (menor cuantía)', valores: ['Selección Abreviada de Menor Cuantía', 'Seleccion Abreviada Menor Cuantia Sin Manifestacion Interes'] },
  { id: 'SASI', etiqueta: 'Selección abreviada (subasta inversa)', valores: ['Selección abreviada subasta inversa'] },
  { id: 'CM', etiqueta: 'Concurso de méritos', valores: ['Concurso de méritos abierto', 'Concurso de méritos con precalificación'] },
  { id: 'MC', etiqueta: 'Mínima cuantía', valores: ['Mínima cuantía'] },
  { id: 'RE', etiqueta: 'Régimen especial (con ofertas)', valores: ['Contratación régimen especial (con ofertas)', 'Contratación Directa (con ofertas)'] }
];

export const DEPARTAMENTOS = ['Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Distrito Capital de Bogotá', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés, Providencia y Santa Catalina', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'];

export const PERFIL_NUEVO = (id: string): PerfilBusqueda => ({ id, nombre: 'Mi búsqueda', codigos: '', palabras: '', excluir: '', departamentos: [], presupuestoMin: '', presupuestoMax: '', modalidades: ['LP', 'SAMC', 'SASI', 'CM'], dias: 30, vistas: [] });

/** Plataformas sin consulta pública abierta: se ofrece el acceso y el registro manual de lo que encuentres. */
export const OTRAS_PLATAFORMAS: { id: string; etiqueta: string; url: string; como: string }[] = [
  { id: 'TVEC', etiqueta: 'Tienda Virtual del Estado (Colombia Compra Eficiente)', url: 'https://www.colombiacompra.gov.co/tienda-virtual-del-estado-colombiano', como: 'Aquí no se «licita»: la entidad compra por Acuerdo Marco. Revisa en qué catálogos puedes ser proveedor y cuándo abren los procesos de incorporación.' },
  { id: 'SECOP1', etiqueta: 'SECOP I (procesos históricos)', url: 'https://www.contratos.gov.co/consultas/inicioConsulta.do', como: 'Solo consulta; las entidades ya contratan por SECOP II.' },
  { id: 'ARIBA', etiqueta: 'SAP Ariba (Ecopetrol y otras empresas)', url: 'https://service.ariba.com/Supplier.aw', como: 'Requiere ser invitado por el comprador. Regístrate como proveedor en el portal de la empresa y revisa tus invitaciones.' },
  { id: 'SUPLOS', etiqueta: 'Suplos (empresas de servicios públicos y privadas)', url: 'https://www.suplos.com', como: 'Regístrate como proveedor y activa las categorías de tu interés para recibir invitaciones.' },
  { id: 'PROPIO', etiqueta: 'Portales propios de universidades, E.S.E. y empresas', url: 'https://www.google.com/search?q=convocatorias+proveedores+portal+contratacion', como: 'Cada entidad publica en su sitio web (manual propio de contratación). Revisa la sección «Contratación» o «Convocatorias».' }
];
