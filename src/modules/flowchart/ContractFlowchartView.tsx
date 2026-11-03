// Vista de Producción y Diálogo Natural - ProcureSim v2.0
// Implementación del Skill: Interacción Humana Progresiva y Empatía Activa
// Novedades integradas:
// 1. Identificación inequívoca de la Organización (NIT oficial) y del Área responsable (Centro de costos / Estructura).
// 2. Pregunta clave de régimen: ¿Cuentan con Manual de Contratación Propio o se rigen por la Ley 80?
// 3. Estudio de mercado empático: Sugerencia de proveedores calificados, procesos similares de SECOP o NIT propio.
import { SMMLV_2026 } from '../../core/domain/constants';
import React, { useState, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Download,
  Search,
  Check,
  Send,
  HelpCircle,
  AlertCircle,
  FileText,
  Sparkles,
  BookOpen,
  Scale,
  ShieldCheck,
  Gavel,
  Clock,
  Award,
  X,
  GitBranch,
  CheckCircle2,
  ListChecks,
  Shield,
  MessageSquare,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useProcurementStore } from '../../store/useProcurementStore';
import { soundEffects } from '../../utils/soundEffects';
import { launchConfetti } from '../../utils/confetti';
import { DocumentEngine } from '../../core/engines/DocumentEngine';
import {
  ARQUETIPOS_ESTRUCTURACION,
  detectarArquetipo,
  ArquetipoEstructuracion,
  TipoSituacionInicial
} from '../../core/engines/StructuringArchetypesEngine';
import {
  NationalEntityClassifierEngine,
  EntidadOficialDinamica
} from '../../core/engines/NationalEntityClassifierEngine';

import {
  DynamicMarketSupplierEngine,
  ProveedorDinamico,
  EstampillasTerritoriales
} from '../../core/engines/DynamicMarketSupplierEngine';
import {
  DynamicRiskAndThresholdsEngine,
  AnalisisCuantia,
  RiesgoConpesTerritorial
} from '../../core/engines/DynamicRiskAndThresholdsEngine';
import {
  SecopIncidentsSimulatorEngine,
  TipoIncidenteSecop,
  IncidenteSecopDetalle
} from '../../core/engines/SecopIncidentsSimulatorEngine';
import { ContractExecutionLifecycleEngine } from '../../core/engines/ContractExecutionLifecycleEngine';
import { ContractSettlementEngine } from '../../core/engines/ContractSettlementEngine';

// Directorio y Clasificación Dinámica Nacional
// Toda entidad y proveedor se procesa en tiempo real mediante motores heurísticos y la API de SECOP II
export type EntidadOficial = EntidadOficialDinamica;

export interface AlternativaAuditoria {
  id: string;
  titulo: string;
  modalidad: string;
  fundamento: string;
  puntaje: number;
  esRecomendada: boolean;
  resumen: string;
  jueces: {
    fiscal: {
      titulo: string;
      estado: 'APROBADO' | 'ADVERTENCIA' | 'RIESGOSO';
      score: number;
      dictamen: string;
    };
    litigio: {
      titulo: string;
      estado: 'APROBADO' | 'ADVERTENCIA' | 'RIESGOSO';
      score: number;
      dictamen: string;
    };
    operativo: {
      titulo: string;
      estado: 'APROBADO' | 'ADVERTENCIA' | 'RIESGOSO';
      score: number;
      dictamen: string;
    };
  };
  clausulasBlindaje: string[];
}

type NivelCuantia = 'MINIMA' | 'MENOR' | 'MAYOR';

const ALT_SUBASTA_INVERSA: AlternativaAuditoria = {
  id: 'SUBASTA_INVERSA',
  titulo: 'Subasta Inversa Electrónica',
  modalidad: 'Bienes y Servicios de Características Técnicas Uniformes (CTU)',
  fundamento: 'Decreto 1082 de 2015 Art. 2.2.1.2.1.2.1',
  puntaje: 57.5,
  esRecomendada: false,
  resumen: 'Enfoque de menor precio. Solo procede si el objeto se puede describir con características técnicas uniformes; de lo contrario sacrifica calidad y soporte.',
  jueces: {
    fiscal: { titulo: 'Cuidado Fiscal (Contraloría / Planeación)', estado: 'ADVERTENCIA', score: 55, dictamen: 'Riesgo de daño patrimonial si el objeto no es 100% estandarizado: se adjudica el menor precio sin asegurar la calidad ni la utilidad real de lo contratado.' },
    litigio: { titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)', estado: 'ADVERTENCIA', score: 60, dictamen: 'Posibles observaciones en SECOP II alegando indebida tipificación como bien o servicio de características técnicas uniformes; riesgo de revocatoria del acto de apertura.' },
    operativo: { titulo: 'Cuidado Operativo (En Territorio)', estado: 'RIESGOSO', score: 45, dictamen: 'Riesgo de adjudicar a un oferente sin capacidad de atención en el lugar de ejecución, con posible incumplimiento del plazo y de la vigencia presupuestal.' }
  },
  clausulasBlindaje: [
    'Exigir entrega o ejecución en el sitio definido en los estudios previos.',
    'Fijar ficha técnica estricta, homologada en Colombia Compra Eficiente cuando exista.'
  ]
};

const ALT_MENOR_CUANTIA: AlternativaAuditoria = {
  id: 'MENOR_CUANTIA_MIPYMES',
  titulo: 'Menor Cuantía con Limitación a Mipymes',
  modalidad: 'Selección Abreviada de Menor Cuantía con Convocatoria Limitada a Mipymes',
  fundamento: 'Ley 1150/2007 Art. 2, Ley 2069/2020 Art. 34 y Decreto 1860/2021',
  puntaje: 91.2,
  esRecomendada: false,
  resumen: 'Ruta indicada cuando el valor está dentro de la menor cuantía: amparo legal pleno, fomento a Mipymes regionales y ponderación de calidad y soporte en el territorio.',
  jueces: {
    fiscal: { titulo: 'Cuidado Fiscal (Contraloría / Planeación)', estado: 'APROBADO', score: 95, dictamen: 'Cumple el principio de planeación integral (unidad de objeto). La cuantía estimada está dentro del tope de menor cuantía. No hay riesgo de fraccionamiento si se contrata el objeto completo.' },
    litigio: { titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)', estado: 'APROBADO', score: 92, dictamen: 'Alta solidez procesal. Cuando procede, la limitación a Mipymes con un año de antigüedad ampara el proceso frente a impugnaciones; verifica que la cuantía la permita (Ley 2069/2020 Art. 34 y Decreto 1860/2021).' },
    operativo: { titulo: 'Cuidado Operativo (En Territorio)', estado: 'APROBADO', score: 90, dictamen: 'Permite exigir capacidad de respuesta en el territorio de ejecución. El cronograma de menor cuantía es corto y facilita liquidar dentro de la vigencia.' }
  },
  clausulasBlindaje: [
    'Unidad de Objeto: contratar el objeto completo para evitar fraccionamiento (Art. 24 Ley 80).',
    'Pluralidad Mipyme: convocatoria limitada bajo Dcto 1860/2021, con códigos UNSPSC acordes al objeto.',
    'Acuerdo de Nivel de Servicio (SLA): ponderar el tiempo de respuesta en el territorio de ejecución.'
  ]
};

const ALT_TVEC: AlternativaAuditoria = {
  id: 'TVEC_CATALOGO',
  titulo: 'Catálogo CCE (TVEC) + Mínima Cuantía',
  modalidad: 'Compra por Catálogo de Acuerdo Marco de Precios + Mínima Cuantía para lo accesorio',
  fundamento: 'Decreto 1082/2015 Art. 2.2.1.2.1.2.7 y Numeral 5 Art. 2 Ley 1150',
  puntaje: 51.2,
  esRecomendada: false,
  resumen: 'La compra por Acuerdo Marco es obligatoria si el bien o servicio está en catálogo; combinarla con una mínima cuantía para lo accesorio puede dividir artificialmente el contrato.',
  jueces: {
    fiscal: { titulo: 'Cuidado Fiscal (Contraloría / Planeación)', estado: 'RIESGOSO', score: 30, dictamen: 'ALERTA POR FRACCIONAMIENTO: separar en dos contratos prestaciones que forman una unidad funcional se considera elusión de la modalidad que corresponde por cuantía.' },
    litigio: { titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)', estado: 'ADVERTENCIA', score: 65, dictamen: 'Riesgo de garantías cruzadas: ante una falla, cada contratista atribuirá la responsabilidad al otro y la entidad queda sin un responsable claro.' },
    operativo: { titulo: 'Cuidado Operativo (En Territorio)', estado: 'ADVERTENCIA', score: 60, dictamen: 'Coordinar la orden de compra del catálogo con el contrato accesorio puede generar retrasos de empalme.' }
  },
  clausulasBlindaje: [
    'Exigir que la orden de compra incluya garantía extendida en sitio.',
    'Sincronizar las actas de inicio de ambos contratos bajo la misma supervisión.'
  ]
};

const ALT_LICITACION: AlternativaAuditoria = {
  id: 'LICITACION_PUBLICA',
  titulo: 'Licitación Pública',
  modalidad: 'Licitación Pública (con pliegos tipo cuando existan)',
  fundamento: 'Ley 1150/2007 Art. 2 num. 1 y Decreto 1082 de 2015',
  puntaje: 90,
  esRecomendada: false,
  resumen: 'Es la modalidad obligatoria cuando el valor supera la menor cuantía y no aplica otra causal. Ofrece máxima publicidad y pluralidad, con un cronograma más largo.',
  jueces: {
    fiscal: { titulo: 'Cuidado Fiscal (Contraloría / Planeación)', estado: 'APROBADO', score: 92, dictamen: 'Respeta la selección objetiva y evita el riesgo de contratar por una modalidad inferior a la que corresponde por cuantía.' },
    litigio: { titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)', estado: 'APROBADO', score: 88, dictamen: 'Mayor exposición a observaciones; se mitiga con pliegos tipo de Colombia Compra Eficiente y respuestas motivadas publicadas en SECOP II.' },
    operativo: { titulo: 'Cuidado Operativo (En Territorio)', estado: 'ADVERTENCIA', score: 70, dictamen: 'Cronograma extenso (alrededor de 45 días hábiles o más): programa la vigencia presupuestal y el plazo de ejecución con holgura.' }
  },
  clausulasBlindaje: [
    'Aplicar el pliego tipo de Colombia Compra Eficiente cuando exista para el objeto.',
    'Respetar los plazos mínimos de publicación del aviso y del proyecto de pliego.',
    'Realizar la audiencia de asignación de riesgos y la audiencia de adjudicación.'
  ]
};

const ALT_MINIMA_CUANTIA: AlternativaAuditoria = {
  id: 'MINIMA_CUANTIA',
  titulo: 'Mínima Cuantía',
  modalidad: 'Contratación de Mínima Cuantía',
  fundamento: 'Ley 1150/2007 Art. 2 num. 5 y Decreto 1082 de 2015',
  puntaje: 90,
  esRecomendada: false,
  resumen: 'Trámite ágil para valores hasta el 10% de la menor cuantía: invitación pública, adjudicación por menor precio y sin RUP obligatorio.',
  jueces: {
    fiscal: { titulo: 'Cuidado Fiscal (Contraloría / Planeación)', estado: 'APROBADO', score: 90, dictamen: 'El valor está dentro del tope; documenta el estudio de mercado para sustentar el precio y no fraccionar el objeto.' },
    litigio: { titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)', estado: 'APROBADO', score: 85, dictamen: 'Proceso corto con pocas etapas de impugnación; publica la invitación y la evaluación en SECOP II.' },
    operativo: { titulo: 'Cuidado Operativo (En Territorio)', estado: 'APROBADO', score: 88, dictamen: 'Ejecución rápida; verifica la capacidad real del oferente en el lugar de ejecución antes de adjudicar.' }
  },
  clausulasBlindaje: [
    'No fraccionar el objeto para mantenerse bajo el tope de mínima cuantía.',
    'Adjudicar al menor precio entre las ofertas que cumplan los requisitos habilitantes.'
  ]
};

/** Rutas de Ley 80 según la cuantía determinada; la recomendada es la que corresponde legalmente. */
export const construirAlternativasLey80 = (nivel: NivelCuantia): AlternativaAuditoria[] => {
  const marcar = (a: AlternativaAuditoria, rec: boolean): AlternativaAuditoria => ({ ...a, esRecomendada: rec });
  if (nivel === 'MAYOR') return [marcar(ALT_LICITACION, true), marcar(ALT_SUBASTA_INVERSA, false), marcar(ALT_TVEC, false)];
  if (nivel === 'MINIMA') return [marcar(ALT_SUBASTA_INVERSA, false), marcar(ALT_MINIMA_CUANTIA, true), marcar(ALT_TVEC, false)];
  return [marcar(ALT_SUBASTA_INVERSA, false), marcar(ALT_MENOR_CUANTIA, true), marcar(ALT_TVEC, false)];
};

export const ALTERNATIVAS_LEY_80: AlternativaAuditoria[] = construirAlternativasLey80('MENOR');

export const ALTERNATIVAS_MANUAL_PROPIO: AlternativaAuditoria[] = [
  {
    id: 'CONVOCATORIA_PUBLICA_MANUAL',
    titulo: 'Alternativa 1: Convocatoria Pública por Manual Interno',
    modalidad: 'Invitación Pública Institucional (Régimen Especial - Derecho Privado)',
    fundamento: 'Manual de Contratación Propio de la Entidad y Art. 13 Ley 1150/2007',
    puntaje: 92.5,
    esRecomendada: true,
    resumen: 'Apertura pública reglada bajo el manual propio: garantiza máxima concurrencia y neutraliza riesgos de favoritismo o direccionamiento.',
    jueces: {
      fiscal: {
        titulo: 'Cuidado Fiscal (Contraloría / Planeación)',
        estado: 'APROBADO',
        score: 95,
        dictamen: 'Cumple a cabalidad con los principios del Art. 209 de la Constitución Política (igualdad, moralidad, publicidad y economía). Cero hallazgo por favoritismo o concentración indebida.'
      },
      litigio: {
        titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)',
        estado: 'APROBADO',
        score: 93,
        dictamen: 'Reglas de juego abiertas y previsibles. Convocatoria publicada con términos claros de referencia y recepción de ofertas sin barreras arbitrarias de entrada.'
      },
      operativo: {
        titulo: 'Cuidado Operativo (En Territorio)',
        estado: 'APROBADO',
        score: 89,
        dictamen: 'Permite seleccionar la mejor oferta integral (calidad-precio) asegurando soporte continuo y cumplimiento de indicadores de servicio en el territorio.'
      }
    },
    clausulasBlindaje: [
      'Publicación de términos de referencia durante mínimo 5 días hábiles en el portal web institucional.',
      'Criterios objetivos de evaluación: capacidad técnica demostrable y garantía del servicio.',
      'Comité evaluador interdisciplinario con acta formal motivada.'
    ]
  },
  {
    id: 'INVITACION_CERRADA_TRES_OFERTAS',
    titulo: 'Alternativa 2: Solicitud Privada de Ofertas (Mínimo 3 Cotizaciones)',
    modalidad: 'Invitación Cerrada a Proveedores Idóneos Registrados',
    fundamento: 'Causal de Cuantía Media del Manual Interno de Contratación',
    puntaje: 68.0,
    esRecomendada: false,
    resumen: 'Envío de invitación directa a 3 o más empresas del ramo: proceso rápido pero vulnerable a sospechas de cartelización o círculo cerrado de proveedores.',
    jueces: {
      fiscal: {
        titulo: 'Cuidado Fiscal (Contraloría / Planeación)',
        estado: 'ADVERTENCIA',
        score: 65,
        dictamen: 'Riesgo de cuestionamiento fiscal si las empresas invitadas tienen vínculos entre sí o si no se demuestra que se consultaron las mejores condiciones del mercado regional.'
      },
      litigio: {
        titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)',
        estado: 'RIESGOSO',
        score: 55,
        dictamen: 'Riesgo de quejas por restricción a la competencia de proveedores locales que no fueron invitados a cotizar a pesar de estar calificados en el mercado.'
      },
      operativo: {
        titulo: 'Cuidado Operativo (En Territorio)',
        estado: 'APROBADO',
        score: 84,
        dictamen: 'Celeridad en la adjudicación (10 a 15 días), útil si hay apremio en la prestación del servicio pero con exposición a controversias.'
      }
    },
    clausulasBlindaje: [
      'Rotación obligatoria de proveedores en la base de datos de invitaciones.',
      'Verificación previa de RUES para descartar socios o representantes comunes entre los invitados.'
    ]
  },
  {
    id: 'CONTRATACION_DIRECTA_MANUAL',
    titulo: 'Alternativa 3: Contratación Directa por Causal del Manual',
    modalidad: 'Contratación Directa Excepcional (Proveedor Único / Urgencia Operativa)',
    fundamento: 'Causal Específica del Manual de Contratación de la Entidad',
    puntaje: 42.0,
    esRecomendada: false,
    resumen: 'Adjudicación directa sin pluralidad: solo procede si se demuestra exclusividad tecnológica o riesgo inminente de parálisis del servicio público.',
    jueces: {
      fiscal: {
        titulo: 'Cuidado Fiscal (Contraloría / Planeación)',
        estado: 'RIESGOSO',
        score: 35,
        dictamen: 'ALERTA ROJA: Si no existe carta de exclusividad legal del fabricante o urgencia manifiesta debidamente declarada, se configura presunto contrato sin cumplimiento de requisitos legales (Art. 410 C.P.).'
      },
      litigio: {
        titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)',
        estado: 'RIESGOSO',
        score: 40,
        dictamen: 'Alto riesgo de denuncias por favorecimiento indebido y falta de justificación técnica objetiva.'
      },
      operativo: {
        titulo: 'Cuidado Operativo (En Territorio)',
        estado: 'ADVERTENCIA',
        score: 51,
        dictamen: 'Inmediatez de inicio, pero enorme fragilidad jurídica ante auditorías de la Contraloría o demanda civil de perjuicios.'
      }
    },
    clausulasBlindaje: [
      'Certificado notariado o consularizado de exclusividad del fabricante sin distribuidores autorizados en Colombia.',
      'Estudio de costos independiente que demuestre razonabilidad del precio pactado.'
    ]
  }
];

export const ALTERNATIVAS_MULTILATERAL: AlternativaAuditoria[] = [
  {
    id: 'SHOPPING_MULTILATERAL' as any,
    titulo: 'Alternativa 1: Comparación de Precios (Shopping / Políticas BID - Banco Mundial)',
    modalidad: 'Solicitud de al menos 3 cotizaciones bajo manual fiduciario internacional',
    fundamento: 'Convenio de Cooperación / Crédito y Art. 20 Ley 80 de 1993',
    puntaje: 93.0,
    esRecomendada: true,
    resumen: 'Procedimiento fiduciario ágil y transparente según el reglamento de adquisiciones del organismo donante/prestamista.',
    jueces: {
      fiscal: {
        titulo: 'Cuidado Fiscal y Auditoría Fiduciaria',
        estado: 'APROBADO',
        score: 95,
        dictamen: 'Cumple el acuerdo marco suscrito por la Nación con banca multilateral (Art. 20 Ley 80). Cero riesgo por aplicación preferente de la política fiduciaria del organismo multilateral.'
      },
      litigio: {
        titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)',
        estado: 'APROBADO',
        score: 91,
        dictamen: 'Inoponibilidad de pliegos tipo locales de Ley 80 al amparo del régimen de excepción de fondos multilaterales.'
      },
      operativo: {
        titulo: 'Cuidado Operativo (En Territorio)',
        estado: 'APROBADO',
        score: 93,
        dictamen: 'Elegibilidad de gasto garantizada. Tiempos ágiles de no-objeción con el oficial de adquisiciones del banco.'
      }
    },
    clausulasBlindaje: [
      'Cláusula de no-objeción previa o posterior del organismo multilateral.',
      'Políticas de prevención de fraude, colusión y prácticas corruptas del Banco.',
      'Elegibilidad expresa de los códigos de gasto del convenio.'
    ]
  },
  {
    id: 'LPN_MULTILATERAL' as any,
    titulo: 'Alternativa 2: Licitación Pública Nacional (LPN Multilateral)',
    modalidad: 'Convocatoria Pública bajo Documento Estándar de Licitación del Banco',
    fundamento: 'Regulaciones de Adquisiciones para Prestatarios de Proyectos de Inversión',
    puntaje: 74.0,
    esRecomendada: false,
    resumen: 'Convocatoria amplia con pliego estándar internacional: ideal para grandes montos pero excesivamente dispendiosa para cuantías medias.',
    jueces: {
      fiscal: {
        titulo: 'Cuidado Fiscal y Auditoría Fiduciaria',
        estado: 'APROBADO',
        score: 90,
        dictamen: 'Máxima publicidad y concurrencia internacional, pero con costo administrativo elevado para el presupuesto asignado.'
      },
      litigio: {
        titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)',
        estado: 'APROBADO',
        score: 85,
        dictamen: 'Términos de referencia internacionales muy estrictos con baja probabilidad de litigio local.'
      },
      operativo: {
        titulo: 'Cuidado Operativo (En Territorio)',
        estado: 'RIESGOSO',
        score: 47,
        dictamen: 'Cronograma excesivo (4 a 6 meses con revisiones previas del Banco). Riesgo inminente de vencimiento de la fecha de cierre del crédito.'
      }
    },
    clausulasBlindaje: [
      'Publicación obligatoria en Development Business de Naciones Unidas y SECOP.',
      'Plazos mínimos de 30 días para preparación y presentación de propuestas.'
    ]
  },
  {
    id: 'DIRECT_SELECTION_MULTILATERAL' as any,
    titulo: 'Alternativa 3: Selección Directa (Direct Contracting Multilateral)',
    modalidad: 'Contratación Directa Excepcional bajo Políticas de la Banca',
    fundamento: 'Causal de Continuidad Técnica o Estandarización del Reglamento Fiduciario',
    puntaje: 52.0,
    esRecomendada: false,
    resumen: 'Adjudicación directa sin competencia: requiere rigurosa justificación de compatibilidad y no-objeción explícita del banco.',
    jueces: {
      fiscal: {
        titulo: 'Cuidado Fiscal y Auditoría Fiduciaria',
        estado: 'ADVERTENCIA',
        score: 55,
        dictamen: 'Auditoría especial concurrente: si el banco objeta el informe técnico justificativo, el gasto es declarado no elegible y la entidad debe reembolsarlo.'
      },
      litigio: {
        titulo: 'Cuidado con Proponentes (Apertura y Pluralidad)',
        estado: 'ADVERTENCIA',
        score: 50,
        dictamen: 'Posibles reclamaciones de proveedores omitidos si no se prueba la singularidad de la tecnología.'
      },
      operativo: {
        titulo: 'Cuidado Operativo (En Territorio)',
        estado: 'ADVERTENCIA',
        score: 51,
        dictamen: 'Rapidez condicionada a la obtención de la no-objeción previa. Sin ella no se puede girar el anticipo.'
      }
    },
    clausulasBlindaje: [
      'Carta oficial de No-Objeción previa suscrita por el Gerente de Operaciones del Banco.',
      'Justificación formal de estandarización técnica o proveedor único preexistente.'
    ]
  }
];

export const ALTERNATIVAS_AUDITORIA = ALTERNATIVAS_LEY_80;

export const ContractFlowchartView: React.FC = () => {
  const { procesoSeleccionadoId, procesos } = useProcurementStore();
  const procesoActivo = procesos.find((p) => p.id === procesoSeleccionadoId) || procesos[0];

  // Estado del flujo
  const [paso, setPaso] = useState<number>(1);
  const [mostrarFlujogramaVisual, setMostrarFlujogramaVisual] = useState<boolean>(false);
  const [modoChecklist, setModoChecklist] = useState<boolean>(false);

  // 1. Rol
  const [tipoOperacion, setTipoOperacion] = useState<'COMPRO' | 'VENDO' | null>(null);

  // 2. Persona y firma
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');

  // 3. Organización inequívoca, Área y Régimen (Alcance Dinámico Nacional)
  const [busquedaLugar, setBusquedaLugar] = useState('');
  const [buscandoEnSecop, setBuscandoEnSecop] = useState(false);
  const [entidadesCoincidentes, setEntidadesCoincidentes] = useState<EntidadOficial[]>([]);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadOficial | null>(null);
  const [busquedaSinResultados, setBusquedaSinResultados] = useState(false);
  const [areaResponsable, setAreaResponsable] = useState('');
  const [codigoCentroCostos, setCodigoCentroCostos] = useState('');
  const [regimenSeleccionado, setRegimenSeleccionado] = useState<'LEY_80' | 'MANUAL_PROPIO' | 'MULTILATERAL'>('LEY_80');

  // 4. Objeto / Necesidad
  const [necesidad, setNecesidad] = useState('');

  // 5. Presupuesto / CDP
  const [numeroCdp, setNumeroCdp] = useState('');
  const [valorCdp, setValorCdp] = useState('');
  const [cdpPendiente, setCdpPendiente] = useState(false);

  // 6. Estudio de mercado dinámico de alcance nacional (SECOP II en vivo + Inferencia Sectorial)
  const [metodoMercado, setMetodoMercado] = useState<'SUGERIDOS' | 'HISTORICO' | 'NIT_PROPIO' | 'COSTEO_ESTAMPILLAS' | null>(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any>(null);
  const [procesoHistoricoRef, setProcesoHistoricoRef] = useState('');
  const [precioHistoricoRef, setPrecioHistoricoRef] = useState('');
  const [nitManual, setNitManual] = useState('');
  const [mercadoSoportado, setMercadoSoportado] = useState(false);
  const [fleteEstimado, setFleteEstimado] = useState('0');
  const [porcentajeEstampillas, setPorcentajeEstampillas] = useState('3.5');
  const [mostrarValidacionesSoberanas, setMostrarValidacionesSoberanas] = useState(false);
  const [proveedoresDinamicos, setProveedoresDinamicos] = useState<ProveedorDinamico[]>([]);
  const [buscandoProveedoresSecop, setBuscandoProveedoresSecop] = useState<boolean>(false);
  const [estampillasInfo, setEstampillasInfo] = useState<EstampillasTerritoriales>(
    DynamicMarketSupplierEngine.obtenerEstampillasTerritoriales('Huila')
  );

  // 7. Simulación Transaccional en SECOP II hasta la Adjudicación (Paso 10)
  const [faseSecop, setFaseSecop] = useState<'PUBLICADO' | 'OBSERVACIONES' | 'APERTURA_SOBRES' | 'EVALUACION' | 'ADJUDICACION'>('PUBLICADO');
  const [adendaPublicada, setAdendaPublicada] = useState<boolean>(false);
  const [sobresAbiertos, setSobresAbiertos] = useState<boolean>(false);
  const [evaluacionPublicada, setEvaluacionPublicada] = useState<boolean>(false);
  const [adjudicacionFinalizada, setAdjudicacionFinalizada] = useState<boolean>(false);
  const [incidenteActivo, setIncidenteActivo] = useState<TipoIncidenteSecop>('FLUJO_LIMPIO_ORDINARIO');
  const [mostrarSelectorIncidentes, setMostrarSelectorIncidentes] = useState<boolean>(false);
  const [accionIncidenteTomada, setAccionIncidenteTomada] = useState<boolean>(false);
  const [dilemaEleccion, setDilemaEleccion] = useState<'TRAMPA' | 'BLINDAJE' | null>(null);

  // 8. Etapas Contractual y Postcontractual (Pasos 11, 12 y 13)
  // Paso 11: Perfeccionamiento y Legalización
  const [rpExpedido, setRpExpedido] = useState<boolean>(true);
  const [numeroRP, setNumeroRP] = useState<string>('RP-2026-0892');
  const [polizaAprobada, setPolizaAprobada] = useState<boolean>(false);
  const [supervisorNombre, setSupervisorNombre] = useState<string>('Ing. Juan Camilo Roa (Profesional Universitario)');
  const [actaInicioSuscrita, setActaInicioSuscrita] = useState<boolean>(false);

  // Paso 12: Ejecución, Modificaciones y Sancionatorio
  const [avanceEjecucionPct, setAvanceEjecucionPct] = useState<number>(100);
  const [mostrarSimuladorAdicion, setMostrarSimuladorAdicion] = useState<boolean>(false);
  const [valorAdicionInput, setValorAdicionInput] = useState<string>('');
  const [resultadoAdicion, setResultadoAdicion] = useState<{
    esValida: boolean;
    porcentajeAdicion: number;
    limiteMaximo50COP: number;
    mensajeLegal: string;
    riesgoResponsabilidad: string;
  } | null>(null);
  const [mostrarSimuladorSancionatorio, setMostrarSimuladorSancionatorio] = useState<boolean>(false);
  const [sancionSimulada, setSancionSimulada] = useState<any>(null);

  // Paso 13: Liquidación y Cierre en SECOP II
  const [tipoLiquidacion, setTipoLiquidacion] = useState<'BILATERAL_MUTUO_ACUERDO' | 'UNILATERAL_POR_RESOLUCION'>('BILATERAL_MUTUO_ACUERDO');
  const [incluyeSalvedades, setIncluyeSalvedades] = useState<boolean>(false);
  const [textoSalvedades, setTextoSalvedades] = useState<string>('');
  const [presupuestoAnualEntidad, setPresupuestoAnualEntidad] = useState<string>('');
  const [liquidacionCompletada, setLiquidacionCompletada] = useState<boolean>(false);

  // Análisis Matemático y Jurídico Dinámico de Cuantías (SMMLV 2026: $1.750.905 — Decreto 1469 de 2025)
  const analisisCuantia = DynamicRiskAndThresholdsEngine.calcularCuantia(
    parseFloat((valorCdp || '0').replace(/\D/g, '')),
    entidadSeleccionada?.categoriaLey617 || '1ª Categoría',
    regimenSeleccionado,
    parseFloat((presupuestoAnualEntidad || '0').replace(/\D/g, ''))
  );

  // Alternativas activas según el régimen verificado y, en Ley 80, según la cuantía determinada
  const nivelCuantia: NivelCuantia = analisisCuantia.esMayorCuantia ? 'MAYOR' : analisisCuantia.esMinimaCuantia ? 'MINIMA' : 'MENOR';
  const alternativasActivas =
    regimenSeleccionado === 'MANUAL_PROPIO'
      ? ALTERNATIVAS_MANUAL_PROPIO
      : regimenSeleccionado === 'MULTILATERAL'
      ? ALTERNATIVAS_MULTILATERAL
      : construirAlternativasLey80(nivelCuantia);
  const idsAlternativas = alternativasActivas.map((x) => x.id).join('|');

  // Valores de la simulación derivados del presupuesto del usuario (no fijos)
  const presupuestoUsuario = parseFloat((valorCdp || '0').replace(/\D/g, '')) || 0;
  const valorAdjudicado = Math.round(((presupuestoUsuario || 400000000) * 0.9875) / 1000) * 1000;
  const valorSegundoOferente = Math.round((valorAdjudicado * 370) / 395 / 1000) * 1000;
  const fmtCOP = (n: number) => '$' + n.toLocaleString('es-CO');
  const pasoAdicion = Math.pow(10, Math.max(0, Math.floor(Math.log10(valorAdjudicado)) - 1));
  const adicionLegal = Math.round((valorAdjudicado * 0.3) / pasoAdicion) * pasoAdicion;
  let adicionIlegal = Math.round((valorAdjudicado * 0.56) / pasoAdicion) * pasoAdicion;
  if (adicionIlegal <= valorAdjudicado * 0.5) adicionIlegal += pasoAdicion;
  const pctAdicion = (v: number) => ((v / valorAdjudicado) * 100).toFixed(1);
  const abreviarM = (v: number) => (v >= 1e6 ? `${(v / 1e6).toLocaleString('es-CO', { maximumFractionDigits: 1 })}M` : fmtCOP(v));

  // Carga reactiva de proveedores desde SECOP II en vivo
  const handleConsultarProveedoresSugeridos = async () => {
    soundEffects.playClick();
    setMetodoMercado('SUGERIDOS');
    setBuscandoProveedoresSecop(true);
    const termino = necesidad || 'suministro';
    const depto = entidadSeleccionada?.departamento || '';
    
    // Inferencia sectorial instantánea
    const locales = DynamicMarketSupplierEngine.generarProveedoresSectorialesNacionales(termino, depto);
    setProveedoresDinamicos(locales);

    // Consulta en vivo a SECOP II
    try {
      const enVivo = await DynamicMarketSupplierEngine.consultarProveedoresEnVivo(termino, depto, 5);
      if (enVivo && enVivo.length > 0) {
        setProveedoresDinamicos(enVivo);
      }
    } catch (e) {
      // Mantiene inferidos
    } finally {
      setBuscandoProveedoresSecop(false);
    }
  };

  // Blindaje Anti-Alucinación de IA: Verificación Soberana
  const [antiAlucinacionChecks, setAntiAlucinacionChecks] = useState({
    cotizacionesReales: true,
    habilitantesProporcionales: true,
    riesgosLocalesConpes: true,
    estampillasCosteadas: true,
  });

  // Arquetipos de Precedente y Situación Inicial (CBR)
  const [situacionInicial, setSituacionInicial] = useState<TipoSituacionInicial>('NUEVO_ORDINARIO');
  const [arquetipoActivo, setArquetipoActivo] = useState<ArquetipoEstructuracion>(ARQUETIPOS_ESTRUCTURACION.NUEVO_ORDINARIO);
  const [mostrarCasosEspeciales, setMostrarCasosEspeciales] = useState<boolean>(false);

  // 5.5 La Mirada Preventiva y Elección Soberana de la Ruta Jurídica
  const [alternativaSeleccionada, setAlternativaSeleccionada] = useState<AlternativaAuditoria>(ALTERNATIVAS_LEY_80[1]);

  useEffect(() => {
    const recomendada = alternativasActivas.find((x) => x.esRecomendada) || alternativasActivas[0];
    if (recomendada) setAlternativaSeleccionada(recomendada);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsAlternativas]);

  const handleSeleccionarRegimen = (nuevoRegimen: 'LEY_80' | 'MANUAL_PROPIO' | 'MULTILATERAL') => {
    soundEffects.playClick();
    setRegimenSeleccionado(nuevoRegimen);
    if (nuevoRegimen === 'MANUAL_PROPIO') {
      setAlternativaSeleccionada(ALTERNATIVAS_MANUAL_PROPIO[0]);
    } else if (nuevoRegimen === 'MULTILATERAL') {
      setAlternativaSeleccionada(ALTERNATIVAS_MULTILATERAL[0]);
    } else {
      setAlternativaSeleccionada(ALTERNATIVAS_LEY_80[1]);
    }
  };

  // Búsqueda inteligente de entidades oficiales con normalización diacrítica y scoring
  const normalizarBusqueda = (txt: string) =>
    txt
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const handleBuscarEntidades = async () => {
    soundEffects.playSoftPop();
    const qLimpia = busquedaLugar.trim();

    if (!qLimpia) {
      setEntidadesCoincidentes([]);
      setEntidadSeleccionada(null);
      setBusquedaSinResultados(false);
      return;
    }

    // 1. Inferencia local instantánea (Alcance Nacional: 1.103 municipios y 32 departamentos)
    const entidadLocal = NationalEntityClassifierEngine.clasificarEntidad(qLimpia);
    setEntidadesCoincidentes([entidadLocal]);
    setBusquedaSinResultados(false);

    // 2. Consulta en vivo a Datos Abiertos de SECOP II
    setBuscandoEnSecop(true);
    try {
      const enVivo = await NationalEntityClassifierEngine.buscarEntidadesNacionalesEnVivo(qLimpia);
      if (enVivo && enVivo.length > 0) {
        setEntidadesCoincidentes(enVivo);
      }
    } catch (e) {
      // Mantiene la entidad inferida
    } finally {
      setBuscandoEnSecop(false);
    }
  };

  const handleDescargar = async () => {
    soundEffects.playSuccess();
    launchConfetti();
    const modalidadTxt = alternativaSeleccionada?.modalidad || '';
    const prefijoProceso = /licitaci/i.test(modalidadTxt) ? 'LP' : /menor/i.test(modalidadTxt) ? 'SAMC' : /m[ií]nima/i.test(modalidadTxt) ? 'MC' : /subasta/i.test(modalidadTxt) ? 'SASI' : /directa/i.test(modalidadTxt) ? 'CD' : 'PROC';
    const presupuestoNum = parseFloat((valorCdp || '0').replace(/\D/g, '')) || 0;
    const clausulas = (alternativaSeleccionada?.clausulasBlindaje || []).join(' | ');
    const procesoPersonalizado = {
      ...procesoActivo,
      numeroProceso: `${prefijoProceso}-001-${new Date().getFullYear()}`,
      objeto: necesidad || procesoActivo.objeto,
      modalidad: (alternativaSeleccionada?.modalidad || procesoActivo.modalidad) as any,
      justificacion: `La entidad requiere: ${necesidad || 'por definir'}. Ruta jurídica adoptada: ${alternativaSeleccionada?.titulo || 'por definir'} (${alternativaSeleccionada?.fundamento || ''}). ${alternativaSeleccionada?.resumen || ''} Cláusulas de protección: ${clausulas}`,
      entidad: {
        ...procesoActivo.entidad,
        nombre: entidadSeleccionada?.nombreCompleto || procesoActivo.entidad.nombre,
        nit: entidadSeleccionada?.nit || procesoActivo.entidad.nit,
        ordenadorGasto: nombre ? `${nombre} (${cargo})` : procesoActivo.entidad.ordenadorGasto,
      },
      lugarEjecucion: '',
      plazoMeses: 0,
      plazoDias: 0,
      cdpNumero: numeroCdp || 'PENDIENTE_DE_INCORPORACION',
      cdpFecha: '',
      items: [],
      riesgos: [],
      requisitosHabilitantes: {
        ...procesoActivo.requisitosHabilitantes,
        sumatoriaSMMLVMinima: presupuestoNum > 0 ? Math.round(presupuestoNum / SMMLV_2026) : 0,
        codigosUNSPSCExigidos: [] as string[],
      },
      presupuestoOficial: presupuestoNum || 0,
    };
    await DocumentEngine.descargarEstudiosPreviosWord(procesoPersonalizado);
  };

  return (
    <div className="flex-1 bg-white text-slate-900 overflow-y-auto animate-fadeIn select-none p-4 sm:p-8 flex flex-col items-center justify-start sm:justify-center min-h-full">
      <div className="max-w-2xl w-full mx-auto space-y-6 my-auto py-2">

        {/* Barra Superior Contextual: Emerge ÚNICAMENTE cuando ya hay contexto activo (paso > 1 o checklist), nunca al inicio */}
        {(paso > 1 || modoChecklist) && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2">
              {regimenSeleccionado && paso >= 4 && (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-slate-900 text-white shadow-xs">
                  {regimenSeleccionado === 'MANUAL_PROPIO' ? 'Manual Propio' : regimenSeleccionado === 'MULTILATERAL' ? 'Multilateral' : 'Ley 80 / 1150'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setModoChecklist(!modoChecklist);
                }}
                className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  modoChecklist
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                <span>{modoChecklist ? 'Volver al Proceso' : 'Lista de Chequeo'}</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setMostrarFlujogramaVisual(true);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                <span>Mapa</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal de Revisión del Flujograma Completo */}
        {mostrarFlujogramaVisual && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    Flujograma Maestro de Contratación
                  </h3>
                  <p className="text-xs text-slate-500">
                    Haz clic en cualquier nodo para navegar directamente a esa etapa.
                  </p>
                </div>
                <button
                  onClick={() => setMostrarFlujogramaVisual(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista visual de Nodos del Flujograma */}
              <div className="space-y-3">
                {[
                  { n: 1, titulo: '1. Rol de Operación', desc: 'Compro (Entidad Pública) o Vendo (Contratista / Mipyme).' },
                  { n: 2, titulo: '2. Autoría y Cuadro de Firmas', desc: 'Nombre y cargo del responsable del expediente.' },
                  { n: 3, titulo: '3. Identificación Oficial de la Entidad', desc: 'Búsqueda por NIT oficial, código DANE y Centro de Costos.' },
                  { n: 4, titulo: '4. Verificación del Régimen Jurídico (Hito Clave)', desc: 'Bifurcación soberana: Estatuto General (Ley 80/1150) vs Manual Propio (Derecho Privado) vs Banca Multilateral.', esClave: true },
                  { n: 5, titulo: '5. Necesidad Técnica y Objeto', desc: 'Descripción del requerimiento sin tecnicismos informáticos.' },
                  { n: 6, titulo: '6. Presupuesto Oficial y CDP', desc: 'Monto estimado y disponibilidad presupuestal (o pendiente sin bloqueo).' },
                  { n: 7, titulo: '7. La Mirada Preventiva (Ruta Jurídica y Blindaje)', desc: 'Los 3 Cuidados Preventivos (Fiscal, Proponentes y Territorio) blindan el proceso.', esClave: true },
                  { n: 8, titulo: '8. Estudio de Mercado Empático', desc: 'Proveedores calificados BIC, histórico SECOP o NIT específico.' },
                  { n: 9, titulo: '9. Consolidación y Descarga de Documento', desc: 'Generación de Estudios Previos blindados en formato Word (.docx).' },
                  { n: 10, titulo: '10. SECOP II Transaccional y Adjudicación', desc: 'Pliego, observaciones, apertura de sobres, evaluación e Inyector de Contingencias.', esClave: true },
                  { n: 11, titulo: '11. Perfeccionamiento y Legalización', desc: 'Firma en SECOP II, Registro Presupuestal (RP), Garantía Única y Supervisión.' },
                  { n: 12, titulo: '12. Ejecución, Modificaciones y Sancionatorio', desc: 'Seguimiento de bitácora, adiciones (tope del 50% Art. 40 Ley 80) y audiencia Art. 86.', esClave: true },
                  { n: 13, titulo: '13. Recibo a Satisfacción, Liquidación y Cierre', desc: 'Liquidación Bilateral vs Unilateral, balance financiero y archivo en SECOP II.' },
                ].map((nodo) => {
                  const esActual = paso === nodo.n;
                  const esPasado = paso > nodo.n;
                  return (
                    <button
                      key={nodo.n}
                      onClick={() => {
                        soundEffects.playClick();
                        setPaso(nodo.n);
                        setMostrarFlujogramaVisual(false);
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        esActual
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : esPasado
                          ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/50 text-slate-800'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className={`text-xs font-black ${esActual ? 'text-white' : 'text-slate-900'}`}>
                            {nodo.titulo}
                          </strong>
                          {nodo.esClave && (
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                              esActual ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              Bifurcación
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] leading-snug ${esActual ? 'text-slate-300' : 'text-slate-500'}`}>
                          {nodo.desc}
                        </p>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {esActual ? (
                          <span className="text-[10px] font-mono font-bold bg-white text-slate-950 px-2 py-0.5 rounded-full">
                            Activo
                          </span>
                        ) : esPasado ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">Paso {nodo.n}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setMostrarFlujogramaVisual(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recordatorio discreto en la esquina solo si quedó algo pendiente */}
        {cdpPendiente && !numeroCdp && paso > 1 && (
          <div className="fixed bottom-6 right-6 z-40 bg-white/95 backdrop-blur-xs border border-amber-200 rounded-2xl p-3.5 shadow-lg text-xs max-w-xs animate-fadeIn flex items-start gap-2.5">
            <span className="text-base shrink-0">📌</span>
            <div className="space-y-0.5">
              <span className="text-amber-800 font-mono text-[10px] font-bold block uppercase">
                Pendiente en Expediente:
              </span>
              <strong className="text-slate-900 block text-xs">
                Anexar CDP antes de radicar
              </strong>
              <p className="text-slate-500 text-[11px] leading-snug">
                Estás costeando técnicamente. Podrás incorporar el número y fecha del CDP en cualquier momento.
              </p>
              {paso !== 6 && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setPaso(6);
                  }}
                  className="text-[11px] text-emerald-700 hover:text-emerald-950 font-bold underline cursor-pointer mt-1 block"
                >
                  Incorporar CDP ahora →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* LISTA DE CHEQUEO DE ESTRUCTURACIÓN: "Vamos a estructurar un nuevo proceso" */}
        {/* ===================================================================== */}
        {modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estructuración Activa de Nuevo Proceso</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                Entonces vamos a estructurar un nuevo proceso.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Aquí tienes la lista de chequeo de la estructuración. Puedes saltar a cualquiera de los componentes, ir construyéndolos a tu propio ritmo y ver cómo se va blindando tu expediente.
              </p>
            </div>

            {/* Resumen de avance del expediente */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-bold block text-[10px] uppercase font-mono">Entidad y Régimen</span>
                <strong className="text-slate-900 block">{entidadSeleccionada?.nombreCompleto || 'Entidad en definición'}</strong>
                <span className="text-slate-500 text-[11px]">
                  Régimen: {regimenSeleccionado === 'MANUAL_PROPIO' ? 'Manual Propio (Derecho Privado)' : regimenSeleccionado === 'MULTILATERAL' ? 'Banca Multilateral' : 'Estatuto General (Ley 80 / 1150)'}
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold ${
                  numeroCdp ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}>
                  {numeroCdp ? `CDP: ${numeroCdp}` : '📌 Estructurando sin CDP'}
                </span>
              </div>
            </div>

            {/* Tarjetas Interactivas de la Lista de Chequeo (10 Requisitos Legales Dcto 1082) */}
            <div className="space-y-3">
              {[
                {
                  id: 'entidad',
                  pasoDestino: 3,
                  titulo: '1. Identificación de la Entidad y Área Responsable',
                  detalle: entidadSeleccionada ? `${entidadSeleccionada.nombreCompleto} (NIT ${entidadSeleccionada.nit}) • ${areaResponsable || 'Área por definir'}` : 'Sin entidad seleccionada',
                  completado: Boolean(entidadSeleccionada && areaResponsable),
                  accionTexto: 'Editar datos'
                },
                {
                  id: 'regimen',
                  pasoDestino: 4,
                  titulo: '2. Verificación del Régimen Jurídico y Modalidad (24 Arquetipos)',
                  detalle: `Arquetipo: ${arquetipoActivo?.tituloHumano || 'Estructuración Ordinaria'} • ${regimenSeleccionado === 'MANUAL_PROPIO' ? 'Manual Propio (Derecho Privado)' : regimenSeleccionado === 'MULTILATERAL' ? 'Banca Multilateral' : 'Estatuto General (Ley 80 / 1150)'}`,
                  completado: true,
                  accionTexto: 'Cambiar régimen / arquetipo'
                },
                {
                  id: 'necesidad',
                  pasoDestino: 5,
                  titulo: '3. Descripción de la Necesidad y Objeto Contractual',
                  detalle: necesidad ? necesidad : 'Pendiente redactar la necesidad técnica y el alcance esperado.',
                  completado: Boolean(necesidad.trim()),
                  accionTexto: necesidad ? 'Editar necesidad' : 'Redactar necesidad →'
                },
                {
                  id: 'cdp',
                  pasoDestino: 6,
                  titulo: '4. Presupuesto Estimado y Disponibilidad Presupuestal (CDP)',
                  detalle: numeroCdp ? `CDP N° ${numeroCdp} ($${valorCdp || '0'} COP)` : valorCdp ? `Valor estimado: $${valorCdp} COP (CDP pendiente de incorporación)` : 'Avanzando en estructuración técnica sin CDP previo (se incorporará antes de radicar).',
                  completado: Boolean(numeroCdp.trim() || valorCdp.trim()),
                  advertencia: !numeroCdp.trim(),
                  accionTexto: numeroCdp ? 'Modificar CDP' : 'Ingresar valor o CDP →'
                },
                {
                  id: 'mirada-preventiva',
                  pasoDestino: 7,
                  titulo: '5. La Mirada Preventiva (3 Cuidados y Blindaje)',
                  detalle: alternativaSeleccionada ? `Ruta adoptada: ${alternativaSeleccionada.titulo} (Cuidados fiscal, proponente y operativo activos)` : 'Pendiente definir la ruta legal blindada ante entes de control.',
                  completado: Boolean(alternativaSeleccionada),
                  accionTexto: alternativaSeleccionada ? 'Ver blindaje preventivo' : 'Elegir ruta jurídica →'
                },
                {
                  id: 'mercado',
                  pasoDestino: 8,
                  titulo: '6. Estudio del Sector y Análisis de Precios (Anti-Alucinación)',
                  detalle: mercadoSoportado ? (proveedorSeleccionado ? `Proveedor de referencia: ${proveedorSeleccionado.nombre} • Estampillas territoriales: ${porcentajeEstampillas}%` : `Histórico SECOP: ${procesoHistoricoRef}`) : `Precios consultados en SECOP II o cotizaciones formales. Estampillas territoriales (${porcentajeEstampillas}%) y fletes rurales.`,
                  completado: mercadoSoportado,
                  accionTexto: mercadoSoportado ? 'Editar mercado' : 'Definir estudio de mercado →'
                },
                {
                  id: 'habilitantes',
                  pasoDestino: 8,
                  titulo: '7. Requisitos Habilitantes Proporcionados RUP (Art. 5 Ley 1150)',
                  detalle: 'Capacidad jurídica, financiera y técnica verificada con RUP. Regla inviolable: la experiencia solo HABILITA (Pasa/No Pasa), nunca otorga puntaje de calificación.',
                  completado: antiAlucinacionChecks.habilitantesProporcionales,
                  accionTexto: 'Revisar habilitantes'
                },
                {
                  id: 'riesgos',
                  pasoDestino: 8,
                  titulo: '8. Matriz de Riesgos Tipificados CONPES 3714 (Territoriales y Climáticos)',
                  detalle: `Riesgos geográficos de la entidad (${entidadSeleccionada?.municipio || 'Territorio'}) tipificados: temporadas de lluvia, crecientes de cuencas, bloqueos viales y variación de insumos.`,
                  completado: antiAlucinacionChecks.riesgosLocalesConpes,
                  accionTexto: 'Verificar riesgos'
                },
                {
                  id: 'polizas',
                  pasoDestino: 7,
                  titulo: '9. Garantías y Amparos de Póliza de Cumplimiento',
                  detalle: 'Amparos reglados según Decreto 1082: Seriedad de la oferta (10%), Cumplimiento del contrato (10-20%), Pago de salarios y prestaciones (5-10%), Calidad y RCE.',
                  completado: Boolean(alternativaSeleccionada),
                  accionTexto: 'Consultar amparos'
                },
                {
                  id: 'descarga',
                  pasoDestino: 9,
                  titulo: '10. Supervisión/Interventoría y Expediente Oficial Word (.docx)',
                  detalle: 'Supervisión idónea designada por la entidad. Minuta de estudios previos y pliegos con autoría inequívoca y cláusulas de protección lista para radicación.',
                  completado: Boolean(necesidad && alternativaSeleccionada),
                  accionTexto: 'Ver expediente y descargar →'
                }
              ].map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setPaso(item.pasoDestino);
                    setModoChecklist(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    item.completado
                      ? 'border-slate-200 bg-white hover:border-slate-900 hover:shadow-xs'
                      : item.advertencia
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-white hover:border-amber-400'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.completado ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 font-bold" />
                        </div>
                      ) : item.advertencia ? (
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          ⏳
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          {idx + 1}
                        </div>
                      )}
                      <strong className="text-xs font-black text-slate-900 group-hover:text-slate-950">
                        {item.titulo}
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-7 leading-snug line-clamp-2">
                      {item.detalle}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-slate-950">
                    <span className="hidden sm:inline text-[11px] text-slate-400 group-hover:text-slate-700">{item.accionTexto}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones de la Lista de Chequeo */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(6);
                  setModoChecklist(false);
                }}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver al Presupuesto
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(7);
                  setModoChecklist(false);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>Ver Mirada Preventiva y Blindaje</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* HISTORIA VIVA DEL EXPEDIENTE (Lo que ya se ha definido, siempre visible) */}
        {/* ===================================================================== */}
        {!modoChecklist && paso > 1 && (
          <div className="space-y-2 border-b border-slate-200/80 pb-4 mb-2 animate-fadeIn">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Historia del Expediente en Construcción:
              </span>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setModoChecklist(true);
                }}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ver Lista Completa</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {/* Historia 1: Rol */}
              {tipoOperacion && paso > 1 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="text-slate-400 font-mono text-[10px]">1. Rol:</span>
                    <strong className="text-slate-900 font-bold">
                      {tipoOperacion === 'COMPRO' ? 'Compro (Entidad Pública)' : 'Vendo (Proveedor / Contratista)'}
                    </strong>
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(1); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              )}

              {/* Historia 2: Autoría */}
              {nombre && cargo && paso > 2 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="text-slate-400 font-mono text-[10px]">2. Autor:</span>
                    <strong className="text-slate-900 font-bold">{nombre}</strong>
                    <span className="text-slate-500 text-[11px]">({cargo})</span>
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(2); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              )}

              {/* Historia 3: Entidad y Área */}
              {entidadSeleccionada && paso > 3 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="text-slate-400 font-mono text-[10px]">3. Entidad:</span>
                    <strong className="text-slate-900 font-bold">{entidadSeleccionada.nombreCompleto}</strong>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1 rounded border border-emerald-200 font-bold">
                      NIT {entidadSeleccionada.nit}
                    </span>
                    {areaResponsable && (
                      <span className="text-slate-500 text-[11px]">
                        • {areaResponsable}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(3); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              )}

              {/* Historia 4: Régimen Jurídico */}
              {regimenSeleccionado && paso > 4 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="text-slate-400 font-mono text-[10px]">4. Régimen:</span>
                    <strong className="text-slate-900 font-bold">
                      {regimenSeleccionado === 'MANUAL_PROPIO'
                        ? 'Manual Propio (Régimen Especial - Derecho Privado)'
                        : regimenSeleccionado === 'MULTILATERAL'
                        ? 'Banca Multilateral / Convenio Internacional'
                        : 'Estatuto General (Ley 80 / 1150)'}
                    </strong>
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(4); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              )}

              {/* Historia 5: Necesidad */}
              {necesidad && paso > 5 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2 truncate max-w-md">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span className="text-slate-400 font-mono text-[10px] shrink-0">5. Objeto:</span>
                    <span className="text-slate-800 text-[11px] font-medium truncate">
                      {necesidad}
                    </span>
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(5); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer shrink-0"
                  >
                    Modificar
                  </button>
                </div>
              )}

              {/* Historia 6: Presupuesto y CDP */}
              {(numeroCdp || cdpPendiente || valorCdp) && paso > 6 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      numeroCdp ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {numeroCdp ? '✓' : '⏳'}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">6. Presupuesto:</span>
                    <strong className="text-slate-900 font-bold">
                      {numeroCdp ? `CDP N° ${numeroCdp} ($${valorCdp || '0'} COP)` : valorCdp ? `Valor estimado: $${valorCdp} COP (CDP pendiente)` : 'Estructurando sin CDP formal'}
                    </strong>
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(6); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              )}

              {/* Historia 7: Ruta Jurídica y Blindaje */}
              {alternativaSeleccionada && paso > 7 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="text-slate-400 font-mono text-[10px]">7. Ruta Legal:</span>
                    <strong className="text-slate-900 font-bold">{alternativaSeleccionada.titulo}</strong>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                      Blindada
                    </span>
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(7); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              )}

              {/* Historia 8: Estudio de Mercado */}
              {mercadoSoportado && paso > 8 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="text-slate-400 font-mono text-[10px]">8. Mercado:</span>
                    <strong className="text-slate-900 font-bold">
                      {proveedorSeleccionado ? proveedorSeleccionado.nombre : procesoHistoricoRef || 'Estudio de mercado sustentado'}
                    </strong>
                  </div>
                  <button
                    onClick={() => { soundEffects.playClick(); setPaso(8); }}
                    className="text-[11px] text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 1: ¿Compras o vendes?                                            */}
        {/* ===================================================================== */}
        {paso === 1 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn text-center sm:text-left">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
                Hola.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                ¿Hoy vienes a comprar o a vender?
              </p>
            </div>

            {/* Los dos botones principales: Grandes, visibles y al frente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setTipoOperacion('COMPRO');
                }}
                className={`p-5 sm:p-6 rounded-3xl border-2 transition-all text-left group cursor-pointer active:scale-[0.98] ${
                  tipoOperacion === 'COMPRO'
                    ? 'border-slate-900 bg-white shadow-xl ring-2 ring-slate-900/10'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-900 hover:shadow-xl'
                }`}
              >
                <div className="p-3 w-fit rounded-2xl bg-white border border-slate-200 text-slate-900 mb-3 group-hover:scale-110 transition-transform shadow-xs">
                  <Building2 className="w-7 h-7 text-slate-900" />
                </div>
                <h2 className="font-black text-slate-900 text-xl font-display">
                  Compro
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Represento a una entidad pública, corporación autónoma o empresa estatal.
                </p>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setTipoOperacion('VENDO');
                  setPaso(2);
                }}
                className={`p-5 sm:p-6 rounded-3xl border-2 transition-all text-left group cursor-pointer active:scale-[0.98] ${
                  tipoOperacion === 'VENDO'
                    ? 'border-slate-900 bg-white shadow-xl ring-2 ring-slate-900/10'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-900 hover:shadow-xl'
                }`}
              >
                <div className="p-3 w-fit rounded-2xl bg-white border border-slate-200 text-slate-900 mb-3 group-hover:scale-110 transition-transform shadow-xs">
                  <Briefcase className="w-7 h-7 text-slate-900" />
                </div>
                <h2 className="font-black text-slate-900 text-xl font-display">
                  Vendo
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Soy empresa proveedora, contratista, Mipyme o licitante.
                </p>
              </button>
            </div>

            {/* Brújula de Entrada: Puntos de Partida Reales (Emerge al elegir Compro) */}
            {tipoOperacion === 'COMPRO' && (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                <span className="text-xs font-bold text-slate-800 block">
                  ¿Cuál es el punto de partida de tu proceso hoy?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setSituacionInicial('NUEVO_ORDINARIO');
                      setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.NUEVO_ORDINARIO);
                      setPaso(2);
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <strong className="block text-slate-900 group-hover:text-emerald-700">✨ Proceso nuevo ordinario</strong>
                    <span className="text-[11px] text-slate-500">Tengo una necesidad desde cero y cuento con rubro</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setSituacionInicial('NUEVO_SIN_CDP');
                      setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.NUEVO_SIN_CDP);
                      setCdpPendiente(true);
                      setPaso(2);
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <strong className="block text-slate-900 group-hover:text-amber-700">⏳ Formulación técnica (Sin CDP)</strong>
                    <span className="text-[11px] text-slate-500">Apenas estamos costeando para pedir el presupuesto a Hacienda</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setSituacionInicial('RESCATE_DESIERTO');
                      setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.RESCATE_DESIERTO);
                      setNecesidad('Ajuste y rescate técnico de proceso licitatorio previo declarado desierto');
                      setPaso(2);
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <strong className="block text-slate-900 group-hover:text-sky-700">🔄 Rescatar proceso desierto</strong>
                    <span className="text-[11px] text-slate-500">La licitación se cayó o quedó sin proponentes y debo ajustarla</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setSituacionInicial('RESCATE_HUERFANO');
                      setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.RESCATE_HUERFANO);
                      setNecesidad('Adopción y subsanación de borrador de estudios previos heredado de otra área');
                      setPaso(2);
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <strong className="block text-slate-900 group-hover:text-indigo-700">📂 Adoptar borrador huérfano</strong>
                    <span className="text-[11px] text-slate-500">Heredé un archivo a medias de otro compañero y debo terminarlo</span>
                  </button>
                </div>

                {/* Acceso a Modalidades Especiales y Convenios */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setMostrarCasosEspeciales(!mostrarCasosEspeciales);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 font-bold underline cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{mostrarCasosEspeciales ? '▲ Ocultar casos especiales' : '▼ ¿Es un convenio, donación, arriendo o caso especial?'}</span>
                  </button>
                </div>

                {mostrarCasosEspeciales && (
                  <div className="space-y-3 pt-2 border-t border-slate-200/80 animate-fadeIn">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block">
                      Familias Especiales de Contratación:
                    </span>

                    {/* Familia I: Interadministrativos */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">🏛️ Relaciones Interadministrativas</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('CONVENIO_INTERADMINISTRATIVO');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.CONVENIO_INTERADMINISTRATIVO);
                            setNecesidad('Convenio interadministrativo de cooperación para aunar esfuerzos institucionales');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Convenio Interadministrativo</strong>
                          <span className="text-[10px] text-slate-500">Aunar esfuerzos bilaterales sin utilidad comercial</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('CONTRATO_INTERADMINISTRATIVO_SERVICIO');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.CONTRATO_INTERADMINISTRATIVO_SERVICIO);
                            setNecesidad('Contrato interadministrativo de prestación de servicios con entidad pública especializada');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Contrato con Universidad / EICE</strong>
                          <span className="text-[10px] text-slate-500">Servicios remunerados blindados bajo la Ley 2195</span>
                        </button>
                      </div>
                    </div>

                    {/* Familia II: Base Social y Economía Popular */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">🤝 Base Social y Economía Popular</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('CONVENIO_SOLIDARIO_COMUNAL_JAC');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.CONVENIO_SOLIDARIO_COMUNAL_JAC);
                            setNecesidad('Convenio solidario comunal para mantenimiento de vía terciaria con Junta de Acción Comunal');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Convenio Comunal (JAC)</strong>
                          <span className="text-[10px] text-slate-500">Ley 2166 / Vías terciarias y caminos comunitarios</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('CONVENIO_ASOCIACION_ESAL_30');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.CONVENIO_ASOCIACION_ESAL_30);
                            setNecesidad('Convenio de asociación con fundación sin ánimo de lucro para programa social');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Asociación con ESAL (≥ 30%)</strong>
                          <span className="text-[10px] text-slate-500">Decreto 092 con aporte de contrapartida real</span>
                        </button>
                      </div>
                    </div>

                    {/* Familia III: Gestión Patrimonial e Inmuebles */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">📦 Gestión Patrimonial e Inmuebles</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('DONACION_ACEPTACION_BIENES');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.DONACION_ACEPTACION_BIENES);
                            setNecesidad('Aceptación de donación a título gratuito de bienes con destino al municipio');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Aceptación de Donación</strong>
                          <span className="text-[10px] text-slate-500">Recepción de bienes con blindaje SARLAFT y de títulos</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('ARRENDAMIENTO_INMUEBLE_ENTIDAD');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.ARRENDAMIENTO_INMUEBLE_ENTIDAD);
                            setNecesidad('Arrendamiento de inmueble para funcionamiento de sede institucional');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Arrendamiento de Sede</strong>
                          <span className="text-[10px] text-slate-500">Alquiler directo reglado con avalúo IGAC/RAA</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('COMODATO_PRESTAMO_USO');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.COMODATO_PRESTAMO_USO);
                            setNecesidad('Contrato de comodato de bien público a título gratuito para fin comunitario');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Comodato de Bien Público</strong>
                          <span className="text-[10px] text-slate-500">Préstamo de uso gratuito sin explotación privada</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSituacionInicial('ENAJENACION_SUBASTA_BIENES_FISCALES');
                            setArquetipoActivo(ARQUETIPOS_ESTRUCTURACION.ENAJENACION_SUBASTA_BIENES_FISCALES);
                            setNecesidad('Enajenación y venta de bienes muebles dados de baja mediante subasta pública');
                            setPaso(2);
                          }}
                          className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-900 text-left cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <strong className="block text-slate-900 group-hover:text-emerald-700">Subasta de Chatarra / Bienes</strong>
                          <span className="text-[10px] text-slate-500">Remate público al alza sobre avalúo pericial</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 2: Tu nombre y cargo                                             */}
        {/* ===================================================================== */}
        {paso === 2 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                ¿Cómo te llamas y qué cargo o función tienes?
              </h2>
              <p className="text-xs text-slate-500">
                Para el cuadro oficial de firmas de los documentos que vas a generar.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                autoFocus
              />

              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Tu cargo institucional o función delegada"
                className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setPaso(1)}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(3);
                }}
                disabled={!nombre.trim() || !cargo.trim()}
                className={`px-6 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  nombre.trim() && cargo.trim()
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 3: Organización Inequívoca, Área y Manual de Contratación       */}
        {/* ===================================================================== */}
        {paso === 3 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                {tipoOperacion === 'COMPRO'
                  ? 'Identificación de tu entidad o corporación'
                  : '¿Cuál es el nombre o NIT de tu empresa?'}
              </h2>
              <p className="text-xs text-slate-500">
                Escribe el nombre, municipio o NIT. Seleccionaremos la entidad inequívoca y definiremos si contratas por Ley 80 o por Manual Propio.
              </p>
            </div>

            {/* Búsqueda de Entidad */}
            {!entidadSeleccionada && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={busquedaLugar}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBusquedaLugar(val);
                      if (val.trim().length >= 2) {
                        const entidadDinamica = NationalEntityClassifierEngine.clasificarEntidad(val);
                        setEntidadesCoincidentes([entidadDinamica]);
                        setBusquedaSinResultados(false);
                      } else if (!val.trim()) {
                        setEntidadesCoincidentes([]);
                        setBusquedaSinResultados(false);
                      }
                    }}
                    placeholder="Escribe cualquier entidad de Colombia (ej: Electrificadora del Huila, Alcaldía de Leticia, Hospital de Yopal, EPM...)"
                    className="flex-1 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscarEntidades()}
                    autoFocus
                  />
                  <button
                    onClick={handleBuscarEntidades}
                    disabled={buscandoEnSecop}
                    className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {buscandoEnSecop ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Consultando SECOP...</span>
                      </>
                    ) : (
                      <span>Buscar en SECOP</span>
                    )}
                  </button>
                </div>

                {/* Lista dinámica de coincidencias con alcance nacional */}
                {entidadesCoincidentes.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <span className="text-xs font-bold text-slate-700 block">
                      Entidades oficiales identificadas (Alcance Nacional):
                    </span>
                    {entidadesCoincidentes.map((ent, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundEffects.playClick();
                          setEntidadSeleccionada(ent);
                          setRegimenSeleccionado(ent.regimenLegalSugerido);
                          const conf = DynamicMarketSupplierEngine.obtenerEstampillasTerritoriales(ent.departamento);
                          setEstampillasInfo(conf);
                          setPorcentajeEstampillas(conf.porcentajeSugerido.toString());
                        }}
                        className="w-full p-4 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white transition-all text-left cursor-pointer group space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm font-black text-slate-900 group-hover:text-slate-950">
                            {ent.nombreCompleto}
                          </strong>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                              ent.origenDatos === 'SECOP_II_EN_VIVO'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {ent.origenDatos === 'SECOP_II_EN_VIVO' ? '🌐 SECOP II' : '⚡ Inferencia Nacional'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                              NIT {ent.nit}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 block">
                          {ent.tipoEntidad} • {ent.municipio} ({ent.departamento}) • Régimen: <strong className="text-slate-700">{ent.regimenLegalSugerido === 'MANUAL_PROPIO' ? 'Manual Propio (Derecho Privado)' : 'Ley 80 / 1150'}</strong>
                        </span>
                        {ent.analisisJuridico && (
                          <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 leading-snug">
                            💡 {ent.analisisJuridico}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {busquedaSinResultados && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <p>No tengo indexada esa entidad automáticamente. Puedes escribir el nombre y continuar directamente.</p>
                    <button
                      onClick={() => {
                        const entInferida = NationalEntityClassifierEngine.clasificarEntidad(busquedaLugar || 'Entidad Oficial');
                        setEntidadSeleccionada(entInferida);
                        setRegimenSeleccionado(entInferida.regimenLegalSugerido);
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                      Usar "{busquedaLugar}" y continuar →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Configuración detallada: Área y Manual Propio */}
            {entidadSeleccionada && (
              <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-5 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      NIT {entidadSeleccionada.nit}
                    </span>
                    <h3 className="text-base font-black text-slate-900 font-display mt-1">
                      {entidadSeleccionada.nombreCompleto}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {entidadSeleccionada.municipio} ({entidadSeleccionada.departamento}) • DANE {entidadSeleccionada.dane}
                    </span>
                  </div>
                  <button
                    onClick={() => setEntidadSeleccionada(null)}
                    className="text-xs text-slate-400 hover:text-slate-900 font-bold"
                  >
                    Cambiar
                  </button>
                </div>

                {/* Identificación del Área Responsable */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Área o dependencia que lidera la contratación:
                    </label>
                    <input
                      type="text"
                      value={areaResponsable}
                      onChange={(e) => setAreaResponsable(e.target.value)}
                      placeholder="Ej: Subdirección de Gestión Ambiental / Gerencia Técnica..."
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Código o Centro de Costos del Área (Opcional):
                    </label>
                    <input
                      type="text"
                      value={codigoCentroCostos}
                      onChange={(e) => setCodigoCentroCostos(e.target.value)}
                      placeholder="Ej: CC-2026-DIR-04 (según estructura orgánica)"
                      className="w-full text-xs font-mono text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setPaso(4);
                  }}
                  disabled={!areaResponsable.trim()}
                  className={`w-full py-3.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    areaResponsable.trim()
                      ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar entidad y área →
                </button>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => setPaso(2)}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 4: Verificación Soberana del Régimen de Contratación            */}
        {/* ===================================================================== */}
        {paso === 4 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paso 4: Verificación del Marco Normativo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                ¿Bajo qué régimen jurídico contrata tu entidad?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Para evitar sesgos procesales y auditorías erróneas, definimos las reglas de juego antes de juzgar alternativas o escribir el pliego.
              </p>
            </div>

            {/* Ficha de la Entidad y Análisis Predictivo */}
            {entidadSeleccionada && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-900">{entidadSeleccionada.nombreCompleto}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    NIT {entidadSeleccionada.nit}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p>
                    <strong>Naturaleza Jurídica:</strong> {entidadSeleccionada.tipoEntidad} • {entidadSeleccionada.municipio} ({entidadSeleccionada.departamento})
                  </p>
                  <p className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium">
                    {entidadSeleccionada.regimenLegalSugerido === 'MANUAL_PROPIO' ? (
                      <span>
                        💡 <strong>Análisis Institucional:</strong> Por su naturaleza de {entidadSeleccionada.tipoEntidad}, la normativa (Art. 13 Ley 1150/2007) le faculta a contratar bajo su <strong>Manual Interno de Contratación (Derecho Privado)</strong> con observancia de los principios del Art. 209 C.P.
                      </span>
                    ) : (
                      <span>
                        💡 <strong>Análisis Institucional:</strong> Al ser una entidad sujeta al Estatuto General, sus procesos ordinarios se rigen de manera vinculante por la <strong>Ley 80 de 1993, Ley 1150 de 2007 y Pliegos Tipo de Colombia Compra Eficiente</strong>.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Las 3 Tarjetas de Régimen Legal */}
            <div className="space-y-3">
              {/* Opción 1: Ley 80 / Estatuto General */}
              <button
                type="button"
                onClick={() => handleSeleccionarRegimen('LEY_80')}
                className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  regimenSeleccionado === 'LEY_80'
                    ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-md'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${regimenSeleccionado === 'LEY_80' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <strong className="text-sm font-black text-slate-900">
                        Estatuto General de Contratación Pública (Ley 80 / Ley 1150)
                      </strong>
                    </div>
                    <p className="text-xs text-slate-600 pl-8 leading-snug">
                      Alcaldías, Gobernaciones, Ministerios, Corporaciones Autónomas (CAR) y entidades públicas no exceptuadas.
                    </p>
                    <div className="text-[11px] text-slate-500 pl-8 pt-1 flex flex-wrap gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">SECOP II Obligatorio</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Pliegos Tipo CCE</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Subasta Inversa / Menor Cuantía</span>
                    </div>
                  </div>
                  {regimenSeleccionado === 'LEY_80' && (
                    <div className="p-1 rounded-full bg-slate-900 text-white shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>

              {/* Opción 2: Manual de Contratación Propio (Régimen Especial) */}
              <button
                type="button"
                onClick={() => handleSeleccionarRegimen('MANUAL_PROPIO')}
                className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  regimenSeleccionado === 'MANUAL_PROPIO'
                    ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-md'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${regimenSeleccionado === 'MANUAL_PROPIO' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <strong className="text-sm font-black text-slate-900">
                        Manual de Contratación Propio (Régimen Especial - Derecho Privado)
                      </strong>
                    </div>
                    <p className="text-xs text-slate-600 pl-8 leading-snug">
                      Empresas de Servicios Públicos (E.S.P. - Ley 142/94), Hospitales (E.S.E. - Ley 100/93), E.I.C.E. comerciales y Universidades (Ley 30/92).
                    </p>
                    <div className="text-[11px] text-slate-500 pl-8 pt-1 flex flex-wrap gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Art. 13 Ley 1150 / 2007</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Convocatoria Pública Interna</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Solicitud Privada (3 cotizaciones)</span>
                    </div>
                  </div>
                  {regimenSeleccionado === 'MANUAL_PROPIO' && (
                    <div className="p-1 rounded-full bg-slate-900 text-white shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>

              {/* Opción 3: Banca Multilateral y Fondos Especiales */}
              <button
                type="button"
                onClick={() => handleSeleccionarRegimen('MULTILATERAL')}
                className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  regimenSeleccionado === 'MULTILATERAL'
                    ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-md'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${regimenSeleccionado === 'MULTILATERAL' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <strong className="text-sm font-black text-slate-900">
                        Banca Multilateral / Convenios Internacionales (BID, Banco Mundial, CAF)
                      </strong>
                    </div>
                    <p className="text-xs text-slate-600 pl-8 leading-snug">
                      Proyectos financiados con crédito o donación externa regidos por el Art. 20 de la Ley 80 de 1993 y manuales fiduciarios del organismo.
                    </p>
                    <div className="text-[11px] text-slate-500 pl-8 pt-1 flex flex-wrap gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Art. 20 Ley 80</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Shopping / Comparación de Precios</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">Revisión de No-Objeción</span>
                    </div>
                  </div>
                  {regimenSeleccionado === 'MULTILATERAL' && (
                    <div className="p-1 rounded-full bg-slate-900 text-white shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Navegación */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setPaso(3)}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver a Entidad
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(5);
                }}
                className="px-6 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                <span>Confirmar Régimen y Definir Necesidad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 5: Necesidad / Proyecto                                          */}
        {/* ===================================================================== */}
        {paso === 5 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                ¿Qué necesitas contratar hoy?
              </h2>
              <p className="text-xs text-slate-500">
                Cuéntalo con tus palabras.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                value={necesidad}
                onChange={(e) => {
                  const val = e.target.value;
                  setNecesidad(val);
                  if (val.trim().length > 10) {
                    const arq = detectarArquetipo(val, {
                      tieneCdp: !cdpPendiente,
                      esManualPropio: regimenSeleccionado === 'MANUAL_PROPIO'
                    });
                    setArquetipoActivo(arq);
                  }
                }}
                placeholder="Describe qué se requiere contratar, a quiénes beneficia y cuál es el resultado esperado..."
                className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors leading-relaxed"
                autoFocus
              />

              {arquetipoActivo && arquetipoActivo.id !== 'NUEVO_ORDINARIO' && necesidad.trim().length > 10 && (
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">
                      💡 Patrón Detectado: {arquetipoActivo.tituloHumano}
                    </span>
                    <p className="text-[11px] text-emerald-950 font-medium">
                      Desatando el nudo: {arquetipoActivo.nudoGordiano}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold shrink-0">
                    Adaptado
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setPaso(4)}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver al Régimen
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  const arq = detectarArquetipo(necesidad, {
                    tieneCdp: !cdpPendiente,
                    esManualPropio: regimenSeleccionado === 'MANUAL_PROPIO'
                  });
                  setArquetipoActivo(arq);
                  if (arq.id === 'NUEVO_SIN_CDP') {
                    setCdpPendiente(true);
                  }
                  setPaso(6);
                }}
                disabled={!necesidad.trim()}
                className={`px-6 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  necesidad.trim()
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                Continuar al Presupuesto →
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 6: Presupuesto y CDP                                             */}
        {/* ===================================================================== */}
        {paso === 6 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                ¿Tienes ya el número y valor del CDP?
              </h2>
              <p className="text-xs text-slate-500">
                Si aún no tienes disponibilidad presupuestal expedida, no hay problema: estructuramos el proceso desde cero.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={numeroCdp}
                onChange={(e) => setNumeroCdp(e.target.value)}
                placeholder="Número de CDP (opcional, ej: CDP-2026-048)"
                className="w-full text-sm font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                autoFocus
              />

              <input
                type="text"
                value={valorCdp}
                onChange={(e) => setValorCdp(e.target.value)}
                placeholder="Valor estimado en COP (opcional)"
                className="w-full text-sm font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
              />
            </div>

            {/* Análisis Matemático Dinámico de Cuantías y Régimen */}
            {valorCdp.trim() && parseFloat(valorCdp.replace(/\D/g, '')) > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Análisis Matemático de Cuantía (SMMLV 2026: ${SMMLV_2026.toLocaleString('es-CO')}):</span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-black border border-emerald-200">
                    {analisisCuantia.smmlvCalculado.toLocaleString('es-CO')} SMMLV
                  </span>
                </div>
                <div className="text-slate-600 space-y-1">
                  <div><strong>Modalidad Legal Determinada:</strong> <span className="text-slate-900 font-bold">{analisisCuantia.modalidadLegalSugerida}</span></div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {analisisCuantia.explicacionJuridica}
                  </p>
                  <input
                    type="text"
                    value={presupuestoAnualEntidad}
                    onChange={(e) => setPresupuestoAnualEntidad(e.target.value)}
                    placeholder="Presupuesto anual de la entidad en COP (opcional, fija el tope exacto)"
                    className="w-full mt-1 text-[11px] font-mono text-slate-700 bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Dos opciones claras: estructurar sin CDP o guardar con CDP */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCdpPendiente(true);
                  setModoChecklist(true);
                }}
                className="w-full p-4 rounded-2xl border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-all font-black text-xs cursor-pointer shadow-md flex items-center justify-between group"
              >
                <div className="text-left">
                  <span className="block text-sm font-bold">Continuar sin CDP</span>
                  <span className="text-[11px] text-slate-300 font-normal">Entonces vamos a estructurar un nuevo proceso desde cero</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
              </button>

              {numeroCdp.trim() && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setCdpPendiente(false);
                    setModoChecklist(true);
                  }}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 transition-all font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Guardar CDP e ir a la lista de estructuración →</span>
                </button>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setPaso(5)}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver a Necesidad
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setModoChecklist(true);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ver Lista de Chequeo</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 7: La Mirada Preventiva y Elección Soberana de la Ruta Jurídica  */}
        {/* ===================================================================== */}
        {paso === 7 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  La Mirada Preventiva • {
                    regimenSeleccionado === 'MANUAL_PROPIO'
                      ? 'Régimen: Manual Propio'
                      : regimenSeleccionado === 'MULTILATERAL'
                      ? 'Régimen: Banca Multilateral'
                      : 'Régimen: Estatuto General (Ley 80 / 1150)'
                  }
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                ¿Qué ruta jurídica te da mayor tranquilidad?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analizamos las rutas legales bajo el <strong className="text-slate-900">{regimenSeleccionado === 'MANUAL_PROPIO' ? 'Manual de Contratación Propio' : regimenSeleccionado === 'MULTILATERAL' ? 'Marco Multilateral' : 'Estatuto General Ley 80'}</strong> para que tu proceso avance con serenidad y blindaje ante entes de control y proponentes:
              </p>
            </div>

            {/* Recomendación dinámica según análisis matemático de cuantía */}
            {analisisCuantia && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Scale className="w-4 h-4 text-emerald-700" />
                    <span>Ruta Determinada Matemáticamente (Ley 1150 / SMMLV 2026: ${SMMLV_2026.toLocaleString('es-CO')}):</span>
                  </div>
                  <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {analisisCuantia.smmlvCalculado.toLocaleString('es-CO')} SMMLV
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-snug">
                  <strong>Modalidad Legal Sugerida ({analisisCuantia.categoriaEntidad}):</strong> {analisisCuantia.modalidadLegalSugerida}. {analisisCuantia.explicacionJuridica}
                </p>
              </div>
            )}

            {/* Selector de Rutas con Mirada Preventiva */}
            <div className="space-y-3">
              {alternativasActivas.map((alt) => {
                const estaSeleccionada = alternativaSeleccionada.id === alt.id;
                return (
                  <div
                    key={alt.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setAlternativaSeleccionada(alt);
                    }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      estaSeleccionada
                        ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-md'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm font-black text-slate-900">
                            {alt.titulo}
                          </strong>
                          {alt.esRecomendada && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Recomendación Preventiva
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {alt.modalidad} • <span className="font-mono text-[11px] text-slate-600">{alt.fundamento}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                          alt.esRecomendada
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {alt.esRecomendada ? 'Ruta Óptima y Blindada' : 'Ruta Alternativa'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 leading-snug">
                      {alt.resumen}
                    </p>

                    {/* Si está seleccionada, desplegar los 3 Cuidados de Blindaje */}
                    {estaSeleccionada && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                          Los 3 Cuidados de Blindaje Preventivo:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Cuidado Fiscal */}
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <strong className="text-slate-900 font-black flex items-center gap-1 text-[11px]">
                              🏛️ Cuidado Fiscal (Contraloría)
                            </strong>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {alt.jueces.fiscal.dictamen}
                            </p>
                          </div>

                          {/* Cuidado con Proponentes */}
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <strong className="text-slate-900 font-black flex items-center gap-1 text-[11px]">
                              ⚖️ Cuidado con Proponentes
                            </strong>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {alt.jueces.litigio.dictamen}
                            </p>
                          </div>

                          {/* Cuidado Operativo */}
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <strong className="text-slate-900 font-black flex items-center gap-1 text-[11px]">
                              📍 Cuidado en Territorio
                            </strong>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {alt.jueces.operativo.dictamen}
                            </p>
                          </div>
                        </div>

                        {/* Cláusulas de Blindaje sugeridas */}
                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5 mt-2">
                          <strong className="text-emerald-950 font-black block">
                            Cláusulas de Protección Incorporadas al Expediente:
                          </strong>
                          <ul className="space-y-1 text-emerald-900 text-[11px]">
                            {alt.clausulasBlindaje.map((clausula, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{clausula}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaso(6)}
                  className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                >
                  ← Volver al Presupuesto
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setModoChecklist(true);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ver Lista de Chequeo</span>
                </button>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(8);
                }}
                className="px-6 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <span>Adoptar esta ruta y continuar</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 8: Estudio de Mercado Empático (Tres Caminos Legales)            */}
        {/* ===================================================================== */}
        {paso === 8 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                ¿Cómo prefieres sustentar tu estudio de mercado y precios?
              </h2>
              <p className="text-xs text-slate-500">
                La ley colombiana te permite usar cotizaciones, procesos similares o proveedores sugeridos. Elige el camino más cómodo:
              </p>
            </div>

            {/* Cuatro Opciones Empáticas y Legales */}
            {!metodoMercado && (
              <div className="grid grid-cols-1 gap-3 pt-1">
                <button
                  onClick={() => {
                    handleConsultarProveedoresSugeridos();
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <strong className="text-sm font-black text-slate-900">
                      Sugerirme proveedores calificados e inscritos en RUP
                    </strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Empresas con capacidad legal, financiera y técnica verificada para este tipo de necesidad.
                  </p>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setMetodoMercado('HISTORICO');
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <strong className="text-sm font-black text-slate-900">
                      Tengo información de contratos o procesos similares
                    </strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Procesos anteriores en SECOP I / II o contratos históricos de la entidad.
                  </p>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setMetodoMercado('NIT_PROPIO');
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-900 bg-slate-50/50 hover:bg-white text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <strong className="text-sm font-black text-slate-900">
                      Tengo el NIT o nombre de un proveedor específico
                    </strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Digitar el NIT de una empresa local o regional para consultarla en RUES.
                  </p>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setMetodoMercado('COSTEO_ESTAMPILLAS');
                  }}
                  className="p-4 rounded-2xl border border-amber-200 hover:border-amber-500 bg-amber-50/30 hover:bg-white text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-700" />
                    <strong className="text-sm font-black text-slate-900">
                      Costeo Integral: Estampillas Territoriales y Fletes Veredales
                    </strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Evita desiertos y alucinaciones de IA calculando retenciones locales (Pro-Cultura, Adulto Mayor) y acarreo de última milla.
                  </p>
                </button>
              </div>
            )}

            {/* Camino 1: Proveedores sugeridos */}
            {metodoMercado === 'SUGERIDOS' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 block">
                    Proveedores calificados con RUP vigente ({proveedoresDinamicos.length}):
                  </span>
                  {buscandoProveedoresSecop && (
                    <span className="text-[11px] font-mono text-emerald-600 animate-pulse flex items-center gap-1 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Consultando SECOP II...
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {proveedoresDinamicos.map((prov: ProveedorDinamico, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-slate-900">{prov.nombre}</strong>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                            prov.origen === 'SECOP_II_EN_VIVO'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {prov.origen === 'SECOP_II_EN_VIVO' ? '🌐 SECOP II' : '⚡ Inferencia Sectorial'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                            NIT {prov.nit}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">{prov.sector} • {prov.municipio} ({prov.departamento})</p>
                      <span className="text-[10px] font-mono text-emerald-700 block font-bold">{prov.beneficio}</span>
                      {prov.procesoSecopRef && (
                        <p className="text-[10px] font-mono text-slate-500 bg-white p-2 rounded-xl border border-slate-200">
                          📋 Proceso Ref. SECOP: {prov.procesoSecopRef} {prov.valorHistoricoReferenciaCOP ? `| $${prov.valorHistoricoReferenciaCOP.toLocaleString('es-CO')} COP` : ''}
                        </p>
                      )}

                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          setProveedorSeleccionado(prov);
                          setMercadoSoportado(true);
                          setPaso(9);
                        }}
                        className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Solicitar cotización formal a este proveedor</span>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setMetodoMercado(null)}
                  className="text-xs text-slate-400 hover:text-slate-900 font-bold"
                >
                  ← Ver otras formas de estudio de mercado
                </button>
              </div>
            )}

            {/* Camino 2: Procesos similares de SECOP */}
            {metodoMercado === 'HISTORICO' && (
              <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-4 animate-fadeIn">
                <span className="text-xs font-bold text-slate-800 block">
                  Datos del proceso o contrato similar de referencia:
                </span>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={procesoHistoricoRef}
                    onChange={(e) => setProcesoHistoricoRef(e.target.value)}
                    placeholder="Ej: Contrato N° 214-2024 / Proceso SECOP II LP-003-2024"
                    className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:border-slate-900"
                  />

                  <input
                    type="text"
                    value={precioHistoricoRef}
                    onChange={(e) => setPrecioHistoricoRef(e.target.value)}
                    placeholder="Valor o precio histórico de referencia (COP)"
                    className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setMetodoMercado(null)}
                    className="text-xs text-slate-400 hover:text-slate-900 font-bold"
                  >
                    ← Cambiar
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setMercadoSoportado(true);
                      setPaso(9);
                    }}
                    disabled={!procesoHistoricoRef.trim()}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      procesoHistoricoRef.trim()
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Guardar referencia histórica y continuar →
                  </button>
                </div>
              </div>
            )}

            {/* Camino 3: NIT de proveedor propio */}
            {metodoMercado === 'NIT_PROPIO' && (
              <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-4 animate-fadeIn">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nitManual}
                    onChange={(e) => setNitManual(e.target.value)}
                    placeholder="Digita el NIT del proveedor..."
                    className="flex-1 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:border-slate-900"
                  />
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setProveedorSeleccionado({
                        nombre: 'PROVEEDOR REGIONAL CONSULTADO',
                        nit: nitManual,
                        correo: 'contacto@proveedor.com.co',
                        beneficio: 'Inscrito en RUES'
                      });
                      setMercadoSoportado(true);
                      setPaso(9);
                    }}
                    className="px-5 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-slate-800"
                  >
                    Consultar y continuar
                  </button>
                </div>

                <button
                  onClick={() => setMetodoMercado(null)}
                  className="text-xs text-slate-400 hover:text-slate-900 font-bold"
                >
                  ← Cambiar
                </button>
              </div>
            )}

            {/* Camino 4: Costeo Integral, Estampillas Territoriales y Fletes Veredales */}
            {metodoMercado === 'COSTEO_ESTAMPILLAS' && (
              <div className="p-5 rounded-3xl border border-amber-200 bg-amber-50/50 space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <strong className="text-xs font-black text-slate-900 block">
                    Cálculo de Estampillas Territoriales y Logística Veredal
                  </strong>
                  <p className="text-[11px] text-slate-600">
                    Evita que las retenciones municipales hagan que tu proceso se declare desierto o cause controversias de cobro:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      % Estampillas Municipales / Dptales:
                    </label>
                    <input
                      type="text"
                      value={porcentajeEstampillas}
                      onChange={(e) => setPorcentajeEstampillas(e.target.value)}
                      placeholder="Ej: 3.5 (Pro-Cultura + Adulto Mayor)"
                      className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      Sugerido {estampillasInfo.departamento}: {estampillasInfo.porcentajeSugerido}% ({estampillasInfo.desglose.map(d => `${d.nombre}: ${d.tarifaPct}%`).join(' + ')}) • {estampillasInfo.baseLegal}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Flete Rural / Logística Veredal (COP):
                    </label>
                    <input
                      type="text"
                      value={fleteEstimado}
                      onChange={(e) => setFleteEstimado(e.target.value)}
                      placeholder="Ej: 5000000"
                      className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      Acarreo hasta vereda o sitio de entrega
                    </span>
                  </div>
                </div>

                {/* Resumen del Costeo */}
                <div className="p-3.5 rounded-2xl bg-white border border-amber-200 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Base Presupuestal Estimada:</span>
                    <span className="font-mono font-bold text-slate-900">${valorCdp || '420.000.000'} COP</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-800">
                    <span>Deducción estimada de estampillas ({porcentajeEstampillas}%):</span>
                    <span className="font-mono font-bold">
                      - ${Math.round((parseFloat((valorCdp || '420000000').replace(/\D/g, '')) || 420000000) * (parseFloat(porcentajeEstampillas) || 3.5) / 100).toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Flete de transporte veredal previsto:</span>
                    <span className="font-mono font-bold text-slate-900">
                      + ${parseFloat(fleteEstimado.replace(/\D/g, '') || '0').toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold text-slate-900">
                    <span>Blindaje de Mercado:</span>
                    <span className="text-[11px] text-emerald-700 font-mono">
                      ✓ Costeo realista con retenciones territoriales
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setMetodoMercado(null)}
                    className="text-xs text-slate-400 hover:text-slate-900 font-bold"
                  >
                    ← Cambiar método
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setMercadoSoportado(true);
                      setPaso(9);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                  >
                    Incorporar deducciones y fletes al estudio →
                  </button>
                </div>
              </div>
            )}

            {/* Módulo de Blindaje Anti-Alucinación de IA en Contratación */}
            <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Blindaje Soberano Anti-Alucinación de IA en Contratación
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Decreto 1082 / Ley 1150
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Las IAs genéricas comerciales suelen cometer tres errores críticos en contratación pública colombiana. Valida con tu soberanía que tu proceso esté blindado:
              </p>

              <div className="space-y-2">
                {/* Alerta 1 */}
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={antiAlucinacionChecks.cotizacionesReales}
                    onChange={(e) => setAntiAlucinacionChecks({ ...antiAlucinacionChecks, cotizacionesReales: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <strong className="text-xs text-slate-900 block">
                      1. Cotizaciones y Precios Reales (Cero alucinación de MercadoLibre/Amazon)
                    </strong>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Los precios provienen de contratos similares en SECOP II o cotizaciones formales con RUT de empresas constituidas. Nunca de páginas de venta minorista que omiten fletes e impuestos.
                    </p>
                  </div>
                </label>

                {/* Alerta 2 */}
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={antiAlucinacionChecks.habilitantesProporcionales}
                    onChange={(e) => setAntiAlucinacionChecks({ ...antiAlucinacionChecks, habilitantesProporcionales: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <strong className="text-xs text-slate-900 block">
                      2. Proporcionalidad RUP y Prohibición de Calificar Experiencia (Art. 5 Ley 1150)
                    </strong>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      La experiencia es un requisito habilitante exclusivo (Pasa / No Pasa) y no otorga puntaje de calificación. Se evitan pliegos sastre o índices financieros desproporcionados que limiten oferentes.
                    </p>
                  </div>
                </label>

                {/* Alerta 3 */}
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={antiAlucinacionChecks.riesgosLocalesConpes}
                    onChange={(e) => setAntiAlucinacionChecks({ ...antiAlucinacionChecks, riesgosLocalesConpes: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <strong className="text-xs text-slate-900 block">
                      3. Matriz CONPES 3714 con Riesgos Geográficos y Territoriales Reales
                    </strong>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Se incluyeron contingencias locales reales del municipio ({entidadSeleccionada?.municipio || 'zona de ejecución'}): temporadas de lluvia, crecientes súbitas, bloqueos de vías y variaciones de fletes.
                    </p>

                    {/* Visualización de la Matriz CONPES Dinámica */}
                    <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-100">
                      {DynamicRiskAndThresholdsEngine.generarRiesgosTerritoriales(
                        entidadSeleccionada?.departamento || '',
                        entidadSeleccionada?.municipio || '',
                        necesidad || ''
                      ).map((rsk: RiesgoConpesTerritorial, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900 font-bold">{rsk.descripcion}</strong>
                            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                              {rsk.tipo} • {rsk.asignacion}
                            </span>
                          </div>
                          <p className="text-slate-600">🛡️ Mitigación: {rsk.mitigacion}</p>
                          <span className="text-[10px] text-slate-400 block font-mono">📍 Justificación: {rsk.justificacionTerritorial}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaso(7)}
                  className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                >
                  ← Volver a la Ruta Preventiva
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setModoChecklist(true);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ver Lista de Chequeo</span>
                </button>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(9);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
              >
                Omitir por ahora y continuar →
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 9: Descarga de documento                                         */}
        {/* ===================================================================== */}
        {paso === 9 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 font-display">
                Todo listo y blindado.
              </h2>
              <p className="text-sm text-slate-600">
                Construiste la base de tu proceso con rigor legal, autoría inequívoca y la Mirada Preventiva de los 3 Blindajes.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/40 space-y-4">
              <div className="text-xs text-slate-700 space-y-2.5">
                <div><span className="text-slate-400">Autor:</span> <strong>{nombre}</strong> ({cargo})</div>
                {entidadSeleccionada && (
                  <div>
                    <span className="text-slate-400">Entidad Oficial:</span> <strong>{entidadSeleccionada.nombreCompleto}</strong> (NIT {entidadSeleccionada.nit})
                  </div>
                )}
                <div><span className="text-slate-400">Área Responsable:</span> {areaResponsable} {codigoCentroCostos && `(${codigoCentroCostos})`}</div>
                <div>
                  <span className="text-slate-400">Régimen Contractual Verificado:</span>{' '}
                  <strong className="text-slate-900 font-mono">
                    {regimenSeleccionado === 'LEY_80'
                      ? 'Estatuto General (Ley 80 de 1993 / Ley 1150 de 2007)'
                      : regimenSeleccionado === 'MANUAL_PROPIO'
                      ? 'Manual de Contratación Propio (Régimen Especial - Derecho Privado)'
                      : 'Banca Multilateral / Convenios Internacionales (BID / Banco Mundial)'}
                  </strong>
                </div>

                {/* Ruta de Estructuración Blindada */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-[11px]">Ruta Jurídica Adoptada:</span>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-black text-[11px] border border-emerald-200">
                      Ruta Óptima y Blindada
                    </span>
                  </div>
                  <strong className="text-slate-900 block text-xs">{alternativaSeleccionada.titulo}</strong>
                  <span className="text-[11px] text-slate-500 block">{alternativaSeleccionada.modalidad}</span>
                  <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-600 space-y-1">
                    <span className="font-bold text-slate-700 block">Cláusulas de blindaje incorporadas:</span>
                    {alternativaSeleccionada.clausulasBlindaje.map((cl, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{cl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div><span className="text-slate-400">Objeto:</span> {necesidad}</div>
                {numeroCdp ? (
                  <div><span className="text-slate-400">CDP:</span> N° {numeroCdp} {valorCdp && `($${valorCdp} COP)`}</div>
                ) : (
                  <div className="text-amber-800 font-medium">⚠️ Recuerda anexar el CDP antes de radicar.</div>
                )}
                {procesoHistoricoRef && (
                  <div><span className="text-slate-400">Referencia de Mercado:</span> {procesoHistoricoRef} (${precioHistoricoRef} COP)</div>
                )}
                {proveedorSeleccionado && (
                  <div><span className="text-slate-400">Proveedor Contactado:</span> {proveedorSeleccionado.nombre}</div>
                )}
              </div>

              <button
                onClick={handleDescargar}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Descargar Estudios Previos Blindados (.docx)</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(10);
                  setFaseSecop('PUBLICADO');
                }}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Publicar Proceso en SECOP II y Simular hasta la Adjudicación →</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(1);
                  setEntidadSeleccionada(null);
                  setMetodoMercado(null);
                  setProveedorSeleccionado(null);
                  setModoChecklist(false);
                }}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                Empezar otro proceso
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setModoChecklist(true);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ver Lista de Chequeo</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 10: Simulación Transaccional SECOP II hasta la Adjudicación       */}
        {/* ===================================================================== */}
        {paso === 10 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cabecera SECOP II */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SECOP II • Sistema Electrónico de Contratación Pública
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {(entidadSeleccionada?.nit || '').replace(/\D/g, '').slice(0, 4) ? `CO1.BDOS.${(entidadSeleccionada?.nit || '').replace(/\D/g, '').slice(0, 4)}` : 'CO1.BDOS.2026'}.{numeroCdp || '2026'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Presupuesto: ${valorCdp || '420.000.000'} COP
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white font-display">
                  {entidadSeleccionada?.nombreCompleto || 'Entidad Estatal Oficial'}
                </h3>
                <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                  Objeto: {necesidad || 'Suministro e instalación de equipos y servicios requeridos para el cumplimiento misional.'}
                </p>
                <span className="text-[11px] text-slate-400 font-mono block">
                  Modalidad: {alternativaSeleccionada.modalidad} • Responsable: {nombre || 'Funcionario'} ({cargo || 'Ordenador'})
                </span>
              </div>

              {/* Barra de Fases del Proceso en SECOP II */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 text-[10px] font-mono">
                <div className={`p-2 rounded-xl text-center border ${
                  faseSecop === 'PUBLICADO' || faseSecop === 'OBSERVACIONES'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700'
                }`}>
                  1. Publicación y Pliegos
                </div>
                <div className={`p-2 rounded-xl text-center border ${
                  faseSecop === 'OBSERVACIONES' || adendaPublicada
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700'
                }`}>
                  2. Observaciones y Adendas
                </div>
                <div className={`p-2 rounded-xl text-center border ${
                  faseSecop === 'APERTURA_SOBRES' || sobresAbiertos
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700'
                }`}>
                  3. Presentación de Ofertas
                </div>
                <div className={`p-2 rounded-xl text-center border ${
                  faseSecop === 'ADJUDICACION' || adjudicacionFinalizada
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700'
                }`}>
                  4. Adjudicación Oficial
                </div>
              </div>
            </div>

            {/* Inyector y Laboratorio de Contingencias y Rarezas en SECOP II */}
            <div className="p-5 rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 font-display flex items-center gap-2">
                      Inyector de Contingencias y Rarezas de SECOP II
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                        9 Escenarios Reales
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Simula eventos críticos y dilemas jurídicos reales entre la publicación de pliegos y la audiencia de adjudicación.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarSelectorIncidentes(!mostrarSelectorIncidentes)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-800 text-xs font-bold hover:bg-indigo-50 cursor-pointer flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <span>{mostrarSelectorIncidentes ? 'Ocultar Catálogo' : 'Cambiar Escenario'}</span>
                  {mostrarSelectorIncidentes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Selector de Incidentes Desplegable */}
              {mostrarSelectorIncidentes && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 animate-fadeIn">
                  {SecopIncidentsSimulatorEngine.listarIncidentes().map((inc) => {
                    const esSeleccionado = incidenteActivo === inc.id;
                    return (
                      <button
                        key={inc.id}
                        type="button"
                        onClick={() => {
                          soundEffects.playClick();
                          setIncidenteActivo(inc.id);
                          setDilemaEleccion(null);
                          setAccionIncidenteTomada(false);
                        }}
                        className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                          esSeleccionado
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-[1.01]'
                            : 'bg-white hover:bg-indigo-50/50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="text-base shrink-0 mt-0.5">{inc.icono}</span>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold leading-tight ${esSeleccionado ? 'text-white' : 'text-slate-900'}`}>
                            {inc.tituloHumano}
                          </p>
                          <span className={`text-[10px] font-mono block mt-0.5 ${esSeleccionado ? 'text-indigo-200' : 'text-slate-400'}`}>
                            Etapa: {inc.etapaOcurrencia.replace('_', ' ')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tarjeta de Trabajo del Incidente Seleccionado */}
              {(() => {
                const inc = SecopIncidentsSimulatorEngine.obtenerIncidente(incidenteActivo);
                return (
                  <div className="space-y-3 pt-1">
                    <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{inc.icono}</span>
                          <div>
                            <strong className="text-xs font-black text-slate-900 block">
                              {inc.tituloHumano}
                            </strong>
                            <span className="text-[10px] font-mono text-slate-400">
                              Ocurrencia: {inc.etapaOcurrencia.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {incidenteActivo !== 'FLUJO_LIMPIO_ORDINARIO' && (
                          <button
                            type="button"
                            onClick={() => {
                              soundEffects.playClick();
                              setIncidenteActivo('FLUJO_LIMPIO_ORDINARIO');
                              setDilemaEleccion(null);
                              setAccionIncidenteTomada(false);
                            }}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline cursor-pointer"
                          >
                            Restablecer a Flujo Ideal
                          </button>
                        )}
                      </div>

                      {/* Resumen del Hecho Real */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>El Hecho Procesal en SECOP II:</span>
                        </div>
                        <p className="leading-relaxed text-slate-600">
                          {inc.resumenHecho}
                        </p>
                      </div>

                      {/* El Dilema para el Servidor Público */}
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                        <strong>⚖️ Dilema del Servidor y Comité de Contratación:</strong>
                        <p className="text-amber-800 leading-snug">
                          {inc.dilemaServidor}
                        </p>
                      </div>

                      {/* Opciones de Toma de Decisión Soberana */}
                      {incidenteActivo !== 'FLUJO_LIMPIO_ORDINARIO' && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            ¿Qué decisión adoptas como Ordenador del Gasto o Evaluador?
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Opción Trampa Común */}
                            <button
                              type="button"
                              onClick={() => {
                                soundEffects.playClick();
                                setDilemaEleccion('TRAMPA');
                              }}
                              className={`p-3 rounded-xl text-left border transition-all cursor-pointer space-y-1 ${
                                dilemaEleccion === 'TRAMPA'
                                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
                                  : 'bg-white hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                                <span>⚠️</span>
                                <span>Opción A: Decisión Intuitiva Rápida</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug">
                                {inc.errorComunFatal.slice(0, 85)}...
                              </p>
                            </button>

                            {/* Opción Blindaje Legal */}
                            <button
                              type="button"
                              onClick={() => {
                                soundEffects.playSuccess();
                                launchConfetti();
                                setDilemaEleccion('BLINDAJE');
                                setAccionIncidenteTomada(true);
                              }}
                              className={`p-3 rounded-xl text-left border transition-all cursor-pointer space-y-1 ${
                                dilemaEleccion === 'BLINDAJE'
                                  ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
                                  : 'bg-white hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Opción B: Protocolo de Blindaje Legal</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug">
                                {inc.protocoloLegalCorrecto.slice(0, 85)}...
                              </p>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Feedback si seleccionó la Trampa */}
                      {dilemaEleccion === 'TRAMPA' && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2 animate-fadeIn">
                          <div className="flex items-center gap-2 font-black text-rose-800">
                            <span>💥 ERROR FATAL FRECUENTE DETECTADO</span>
                          </div>
                          <p className="leading-relaxed text-rose-900/90">
                            <strong>Consecuencia: </strong>{inc.errorComunFatal}
                          </p>
                          <div className="text-[11px] bg-white/70 p-2.5 rounded-lg border border-rose-200 text-rose-800 font-medium">
                            <strong>Peligro Jurídico:</strong> Esta actuación genera nulidad del acto de adjudicación, investigaciones disciplinarias en Procuraduría por violación a la selección objetiva, y condena de reparación patrimonial en el Tribunal Administrativo.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              soundEffects.playSuccess();
                              launchConfetti();
                              setDilemaEleccion('BLINDAJE');
                              setAccionIncidenteTomada(true);
                            }}
                            className="mt-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                          >
                            ← Corregir y aplicar el protocolo de blindaje legal recomendado
                          </button>
                        </div>
                      )}

                      {/* Feedback si seleccionó el Blindaje */}
                      {dilemaEleccion === 'BLINDAJE' && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2 animate-fadeIn">
                          <div className="flex items-center gap-2 font-black text-emerald-800">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>¡EXCELENTE DECISIÓN! PROCEDIMIENTO 100% BLINDADO</span>
                          </div>
                          <p className="leading-relaxed text-emerald-900">
                            <strong>Protocolo Correcto: </strong>{inc.protocoloLegalCorrecto}
                          </p>
                          <div className="p-2.5 rounded-lg bg-white/80 border border-emerald-200 space-y-1 text-[11px]">
                            <div className="text-emerald-900 font-bold">
                              Fundamento Legal y Jurisprudencial:
                            </div>
                            <div className="font-mono text-emerald-800">
                              {inc.normativaYJurisprudencia}
                            </div>
                            <div className="text-slate-600 pt-1">
                              <strong>Efecto en la Simulación:</strong> {inc.consecuenciaProcesal}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Fase 1 y 2: Observaciones de la Ciudadanía y Proponentes */}
            {(!adendaPublicada || faseSecop === 'PUBLICADO' || faseSecop === 'OBSERVACIONES') && (
              <div className="p-5 rounded-3xl border border-slate-200 bg-white space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-600" />
                    <strong className="text-sm font-black text-slate-900">
                      Observaciones Radicadas en SECOP II (2)
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                    Plazo de Observaciones Abierto
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Observación 1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">1. Proponente: CONTRATISTAS DEL VALLE & ASOCIADOS</strong>
                      <span className="text-[10px] font-mono text-slate-400">Hace 2 horas</span>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      «Solicitamos a la entidad aclarar si la experiencia en RUP puede acreditarse con contratos celebrados con empresas privadas o si es exclusiva con entidades estatales, conforme al principio de pluralidad de oferentes del Art. 5 Ley 1150.»
                    </p>
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <strong>Respuesta de la Entidad (Proyectada):</strong> Se acoge la solicitud. Conforme al Decreto 1082 de 2015, se aceptan contratos públicos y privados válidamente inscritos en el RUP.
                    </div>
                  </div>

                  {/* Observación 2 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">2. Veeduría Ciudadana Territorial</strong>
                      <span className="text-[10px] font-mono text-slate-400">Ayer</span>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      «Consultamos si se previó en el presupuesto el costo de las estampillas departamentales ({porcentajeEstampillas}%) y el flete de última milla para evitar que el contratista suspenda entregas en veredas.»
                    </p>
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <strong>Respuesta de la Entidad (Proyectada):</strong> Se ratifica que en el estudio de mercado (Paso 8) se costearon integralmente las retenciones territoriales y el flete rural.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playSuccess();
                    setAdendaPublicada(true);
                    setFaseSecop('APERTURA_SOBRES');
                  }}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Publicar Respuestas y Expedir Adenda N° 1 de Pliegos en SECOP II →</span>
                </button>
              </div>
            )}

            {/* Fase 3: Cierre de Proceso y Apertura de Sobres */}
            {adendaPublicada && !sobresAbiertos && (
              <div className="p-5 rounded-3xl border border-slate-200 bg-white space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <strong className="text-sm font-black text-slate-900">
                      Cierre de Presentación de Ofertas en SECOP II
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    3 Ofertas Recibidas en Plataforma
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Se cumplió la hora de cierre oficial en SECOP II. Tres proponentes presentaron oferta con sobres digitales encriptados:
                </p>

                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900">1. SOLUCIONES TERRITORIALES S.A.S. (BIC)</strong>
                      <span className="text-[10px] text-slate-500 block">NIT 901.458.712 • Mipyme Regional • RUP Vigente</span>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">🔒 Sobre Encriptado</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900">2. INGENIERÍA NACIONAL INTEGRADA S.A.</strong>
                      <span className="text-[10px] text-slate-500 block">NIT 800.231.902 • Gran Empresa (Bogotá)</span>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">🔒 Sobre Encriptado</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900">3. CONSORCIO ANDINO 2026</strong>
                      <span className="text-[10px] text-slate-500 block">NIT 901.883.121 • Unión Temporal Regional</span>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">🔒 Sobre Encriptado</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playSuccess();
                    setSobresAbiertos(true);
                    setFaseSecop('EVALUACION');
                  }}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>Desencriptar Sobres y Efectuar Apertura en SECOP II →</span>
                </button>
              </div>
            )}

            {/* Fase 4: Evaluación Habilitante y Económica */}
            {sobresAbiertos && !adjudicacionFinalizada && (
              <div className="p-5 rounded-3xl border border-slate-200 bg-white space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <strong className="text-sm font-black text-slate-900">
                      Informe de Evaluación y Calificación de Ofertas
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Fórmula CCE: Media Aritmética
                  </span>
                </div>

                {/* Tabla de Calificación Oficial */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="py-2">Proponente</th>
                        <th className="py-2">Valor Ofertado</th>
                        <th className="py-2">Habilitación</th>
                        <th className="py-2">Económico (60)</th>
                        <th className="py-2">Técnico / Mipyme (40)</th>
                        <th className="py-2 font-bold text-slate-900">Puntaje Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {incidenteActivo === 'PROPONENTE_UNICO_HABILITADO' ? (
                        <tr className="bg-emerald-50/60 font-medium">
                          <td className="py-3 font-bold text-slate-900">
                            1. SOLUCIONES TERRITORIALES S.A.S. (BIC)
                            <span className="text-[10px] text-emerald-700 block font-normal">Proponente Único Habilitado • Pliegos 100% Cumplidos</span>
                          </td>
                          <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                          <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                          <td className="py-3 font-mono">60.00 pts</td>
                          <td className="py-3 font-mono">40.00 pts</td>
                          <td className="py-3 font-mono font-black text-emerald-800 text-sm">100.00 pts (1° Adjudicatario)</td>
                        </tr>
                      ) : incidenteActivo === 'EMPATE_CASCADA_LEY_2069' ? (
                        <>
                          <tr className="bg-emerald-50/70 font-medium">
                            <td className="py-3 font-bold text-slate-900">
                              1. SOLUCIONES TERRITORIALES S.A.S. (BIC)
                              <span className="text-[10px] text-emerald-700 block font-normal">Empate resuelto por Cascada Ley 2069: Mipyme + Dcto 392 (Discapacidad)</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">60.00 pts</td>
                            <td className="py-3 font-mono">40.00 pts</td>
                            <td className="py-3 font-mono font-black text-emerald-800 text-sm">100.00 pts (1° Ganador Cascada)</td>
                          </tr>
                          <tr className="bg-amber-50/40">
                            <td className="py-3 font-bold text-slate-900">
                              2. INGENIERÍA NACIONAL INTEGRADA S.A.
                              <span className="text-[10px] text-amber-700 block font-normal">Empate técnico a 100 pts • Cede prelación ante Mipyme (Ley 2069 Art. 35)</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">60.00 pts</td>
                            <td className="py-3 font-mono">40.00 pts</td>
                            <td className="py-3 font-mono font-bold text-slate-700">100.00 pts (2° Lugar)</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-900">
                              3. CONSORCIO ANDINO 2026
                              <span className="text-[10px] text-slate-500 block font-normal">Unión Temporal</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">$405.000.000</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">54.20 pts</td>
                            <td className="py-3 font-mono">30.00 pts</td>
                            <td className="py-3 font-mono font-bold text-slate-700">84.20 pts (3°)</td>
                          </tr>
                        </>
                      ) : incidenteActivo === 'PRECIO_ARTIFICIALMENTE_BAJO' ? (
                        <>
                          <tr className="bg-emerald-50/60 font-medium">
                            <td className="py-3 font-bold text-slate-900">
                              1. SOLUCIONES TERRITORIALES S.A.S. (BIC)
                              <span className="text-[10px] text-emerald-700 block font-normal">Propuesta equilibrada y sustentada • Mipyme</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">58.50 pts</td>
                            <td className="py-3 font-mono">40.00 pts</td>
                            <td className="py-3 font-mono font-black text-emerald-800 text-sm">98.50 pts (1° Adjudicatario)</td>
                          </tr>
                          <tr className="bg-rose-50/50">
                            <td className="py-3 font-bold text-slate-900">
                              2. CONSTRUCTORA LOW COST S.A.S.
                              <span className="text-[10px] text-rose-700 block font-normal font-bold">
                                Alerta Precio Artificialmente Bajo (-55%) • Requerido formalmente APU (Art. 2.2.1.1.2.2.4 Dcto 1082)
                              </span>
                            </td>
                            <td className="py-3 font-mono text-rose-700 font-bold">$189.000.000</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                                NO SUBSANÓ APU
                              </span>
                            </td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono font-bold text-rose-600">RECHAZO MOTIVADO</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-900">
                              3. CONSORCIO ANDINO 2026
                              <span className="text-[10px] text-slate-500 block font-normal">Unión Temporal</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">$405.000.000</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">54.20 pts</td>
                            <td className="py-3 font-mono">30.00 pts</td>
                            <td className="py-3 font-mono font-bold text-slate-700">84.20 pts (2°)</td>
                          </tr>
                        </>
                      ) : incidenteActivo === 'POLIZA_EXTEMPORANEA_LEY_1882' ? (
                        <>
                          <tr className="bg-emerald-50/60 font-medium">
                            <td className="py-3 font-bold text-slate-900">
                              1. SOLUCIONES TERRITORIALES S.A.S. (BIC)
                              <span className="text-[10px] text-emerald-700 block font-normal">Póliza constituida antes del cierre (09:15 AM)</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">58.50 pts</td>
                            <td className="py-3 font-mono">40.00 pts</td>
                            <td className="py-3 font-mono font-black text-emerald-800 text-sm">98.50 pts (1° Adjudicatario)</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-900">
                              2. INGENIERÍA NACIONAL INTEGRADA S.A.
                              <span className="text-[10px] text-slate-500 block font-normal">Póliza válida y vigente</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorSegundoOferente)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">60.00 pts</td>
                            <td className="py-3 font-mono">25.00 pts</td>
                            <td className="py-3 font-mono font-bold text-slate-700">85.00 pts (2°)</td>
                          </tr>
                          <tr className="bg-rose-50/50">
                            <td className="py-3 font-bold text-slate-900">
                              3. CONSORCIO ANDINO 2026
                              <span className="text-[10px] text-rose-700 block font-normal font-bold">
                                Póliza expedida 11:30 AM (Cierre 10:00 AM) • Insubsanable Art. 5 Ley 1882
                              </span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">$405.000.000</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">NO CUMPLE</span></td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono font-bold text-rose-600">RECHAZO DE LEY</td>
                          </tr>
                        </>
                      ) : incidenteActivo === 'COLUSION_MISMA_IP_METADATOS' ? (
                        <>
                          <tr className="bg-emerald-50/60 font-medium">
                            <td className="py-3 font-bold text-slate-900">
                              1. SOLUCIONES TERRITORIALES S.A.S. (BIC)
                              <span className="text-[10px] text-emerald-700 block font-normal">Oferta autónoma e independiente verificada</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">58.50 pts</td>
                            <td className="py-3 font-mono">40.00 pts</td>
                            <td className="py-3 font-mono font-black text-emerald-800 text-sm">98.50 pts (1° Adjudicatario)</td>
                          </tr>
                          <tr className="bg-rose-50/60">
                            <td className="py-3 font-bold text-slate-900">
                              2. INGENIERÍA NACIONAL INTEGRADA S.A.
                              <span className="text-[10px] text-rose-700 block font-normal font-bold">
                                Alerta SIC/CCE: Misma IP pública (190.24.88.12) y metadatos que oferente 3
                              </span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorSegundoOferente)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">NO HABILITADO</span></td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono font-bold text-rose-600">RECHAZO COLUSORIO</td>
                          </tr>
                          <tr className="bg-rose-50/60">
                            <td className="py-3 font-bold text-slate-900">
                              3. CONSORCIO ANDINO 2026
                              <span className="text-[10px] text-rose-700 block font-normal font-bold">
                                Alerta SIC/CCE: Cartelización digital • Copias a SIC y Fiscalía (Art. 410A C.P.)
                              </span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">$405.000.000</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">NO HABILITADO</span></td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono text-slate-400">0.00 pts</td>
                            <td className="py-3 font-mono font-bold text-rose-600">RECHAZO COLUSORIO</td>
                          </tr>
                        </>
                      ) : incidenteActivo === 'INHABILIDAD_SOBREVINIENTE_SIBOR' ? (
                        <>
                          <tr className="bg-rose-50/60">
                            <td className="py-3 font-bold text-slate-900">
                              1. SOLUCIONES TERRITORIALES S.A.S.
                              <span className="text-[10px] text-rose-700 block font-normal font-bold">
                                Inhabilidad Sobreviniente en SIBOR de Contraloría • Descarte legal obligatorio (Art. 9 Ley 80)
                              </span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">INHABILITADO</span></td>
                            <td className="py-3 font-mono text-slate-400">58.50 pts</td>
                            <td className="py-3 font-mono text-slate-400">40.00 pts</td>
                            <td className="py-3 font-mono font-bold text-rose-600">DESCARTE SIBOR</td>
                          </tr>
                          <tr className="bg-emerald-50/70 font-medium">
                            <td className="py-3 font-bold text-slate-900">
                              2. INGENIERÍA NACIONAL INTEGRADA S.A.
                              <span className="text-[10px] text-emerald-700 block font-normal">
                                Segundo en orden de elegibilidad • Habilitado y sin inhabilidades
                              </span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorSegundoOferente)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">60.00 pts</td>
                            <td className="py-3 font-mono">25.00 pts</td>
                            <td className="py-3 font-mono font-black text-emerald-800 text-sm">85.00 pts (1° Adjudicatario)</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-900">
                              3. CONSORCIO ANDINO 2026
                              <span className="text-[10px] text-slate-500 block font-normal">Unión Temporal</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">$405.000.000</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">54.20 pts</td>
                            <td className="py-3 font-mono">30.00 pts</td>
                            <td className="py-3 font-mono font-bold text-slate-700">84.20 pts (2°)</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr className="bg-emerald-50/60 font-medium">
                            <td className="py-3 font-bold text-slate-900">
                              1. SOLUCIONES TERRITORIALES S.A.S. (BIC)
                              <span className="text-[10px] text-emerald-700 block font-normal">Prioridad Mipyme Ley 2069/2020</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorAdjudicado)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">58.50 pts</td>
                            <td className="py-3 font-mono">40.00 pts</td>
                            <td className="py-3 font-mono font-black text-emerald-800 text-sm">98.50 pts (1°)</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-900">
                              2. INGENIERÍA NACIONAL INTEGRADA S.A.
                              <span className="text-[10px] text-slate-500 block font-normal">Gran Empresa Bogotá</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">{fmtCOP(valorSegundoOferente)}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">60.00 pts</td>
                            <td className="py-3 font-mono">25.00 pts</td>
                            <td className="py-3 font-mono font-bold text-slate-700">85.00 pts (2°)</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-900">
                              3. CONSORCIO ANDINO 2026
                              <span className="text-[10px] text-slate-500 block font-normal">Unión Temporal</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700">$405.000.000</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CUMPLE</span></td>
                            <td className="py-3 font-mono">54.20 pts</td>
                            <td className="py-3 font-mono">30.00 pts</td>
                            <td className="py-3 font-mono font-bold text-slate-700">84.20 pts (3°)</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <strong>Blindaje Preventivo de la Evaluación:</strong>
                  <p>
                    ✓ Se respetó el término de traslado de 3 días hábiles sin que se presentaran observaciones de fondo.
                    ✓ La experiencia se evaluó exclusivamente como requisito habilitante (Pasa/No Pasa) conforme al Art. 5 Ley 1150 de 2007.
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playSuccess();
                    launchConfetti();
                    setAdjudicacionFinalizada(true);
                    setFaseSecop('ADJUDICACION');
                  }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
                >
                  <Award className="w-4 h-4 text-white" />
                  <span>Celebrar Audiencia y Expedir Resolución de Adjudicación en SECOP II →</span>
                </button>
              </div>
            )}

            {/* Fase 5: Resolución de Adjudicación Oficial */}
            {adjudicacionFinalizada && (
              <div className="p-6 rounded-3xl border-2 border-emerald-500/40 bg-emerald-50/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <strong className="text-base font-black text-slate-900 font-display">
                      Acto Administrativo Oficial de Adjudicación
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded bg-emerald-600 text-white shadow-xs">
                    PROCESO ADJUDICADO
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2 text-xs">
                  <div className="border-b border-slate-100 pb-2">
                    <strong className="text-slate-900 block text-sm">
                      RESOLUCIÓN N° {(entidadSeleccionada?.nit || '').replace(/\D/g, '').slice(-3) || '048'}-2026
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      «Por medio de la cual se adjudica el proceso de contratación {alternativaSeleccionada.modalidad}»
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-700 text-[11px]">
                    <div>
                      <strong>Entidad Adjudicadora:</strong> {entidadSeleccionada?.nombreCompleto || 'Entidad Estatal'} (NIT {entidadSeleccionada?.nit})
                    </div>
                    <div>
                      <strong>Ordenador del Gasto:</strong> {nombre} ({cargo})
                    </div>
                    <div>
                      <strong>Adjudicatario Ganador:</strong>{' '}
                      {incidenteActivo === 'INHABILIDAD_SOBREVINIENTE_SIBOR'
                        ? 'INGENIERÍA NACIONAL INTEGRADA S.A. • NIT 800.231.902-1 (2° en Orden de Elegibilidad por Inhabilidad de Soluciones Territoriales)'
                        : 'SOLUCIONES TERRITORIALES S.A.S. (BIC) • NIT 901.458.712-4'}
                    </div>
                    <div>
                      <strong>Valor Adjudicado:</strong>{' '}
                      {incidenteActivo === 'INHABILIDAD_SOBREVINIENTE_SIBOR' ? `${fmtCOP(valorSegundoOferente)} COP` : `${fmtCOP(valorAdjudicado)} COP`} •{' '}
                      <strong>Puntaje Final:</strong>{' '}
                      {incidenteActivo === 'INHABILIDAD_SOBREVINIENTE_SIBOR'
                        ? '85.00 puntos'
                        : incidenteActivo === 'PROPONENTE_UNICO_HABILITADO' || incidenteActivo === 'EMPATE_CASCADA_LEY_2069'
                        ? '100.00 puntos'
                        : '98.50 puntos'}
                    </div>
                    <div>
                      <strong>Plazo de Ejecución:</strong> Conforme a pliegos y cronograma oficial.
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-900 font-medium">
                    ✓ Publicado y notificado en estrado digital de SECOP II. Listo para expedición del Registro Presupuestal (RP) y firma electrónica del contrato.
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setPaso(1);
                      setEntidadSeleccionada(null);
                      setMetodoMercado(null);
                      setProveedorSeleccionado(null);
                      setAdendaPublicada(false);
                      setSobresAbiertos(false);
                      setAdjudicacionFinalizada(false);
                      setModoChecklist(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    ← Estructurar un proceso nuevo
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        soundEffects.playSuccess();
                        launchConfetti();
                        handleDescargar();
                      }}
                      className="w-full sm:w-auto px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Descargar Resolución (.docx)</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playSuccess();
                        setPaso(11);
                      }}
                      className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Continuar a Etapa Contractual (Paso 11)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 11: Perfeccionamiento, Legalización y Condiciones Previas       */}
        {/* ===================================================================== */}
        {paso === 11 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cabecera del Contrato */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ETAPA CONTRACTUAL • PASO 11
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Contrato N° {(entidadSeleccionada?.nit || '').replace(/\D/g, '').slice(-3) || '048'}-2026
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Valor Total: {fmtCOP(valorAdjudicado)} COP
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white font-display">
                  Perfeccionamiento, Legalización y Verificación de Condiciones Previas
                </h3>
                <p className="text-xs text-slate-300 leading-snug">
                  Contratista: {incidenteActivo === 'INHABILIDAD_SOBREVINIENTE_SIBOR' ? 'INGENIERÍA NACIONAL INTEGRADA S.A.' : 'SOLUCIONES TERRITORIALES S.A.S. (BIC)'} • Objeto: {necesidad || 'Suministro e instalación requeridos para el cumplimiento misional.'}
                </p>
                <span className="text-[11px] text-slate-400 font-mono block">
                  Fundamento: Artículos 39 y 41 Ley 80 de 1993 • Decreto 1082 de 2015
                </span>
              </div>
            </div>

            {/* 4 Requisitos Previos al Inicio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Perfeccionamiento: Firma Electrónica */}
              <div className="p-4 rounded-3xl border border-emerald-200 bg-emerald-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <strong className="text-xs font-black text-slate-900">
                      1. Firma Electrónica en SECOP II
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Perfeccionado
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Suscrito válidamente por el Ordenador del Gasto ({nombre || 'Carmelo'}) y el Representante Legal del Contratista con estampillado cronológico digital.
                </p>
                <div className="text-[10px] font-mono text-emerald-900 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  ✓ Cumple Art. 41 Ley 80/93: Acuerdo sobre objeto y precio elevado a escrito digital.
                </div>
              </div>

              {/* 2. Registro Presupuestal (RP) */}
              <div className="p-4 rounded-3xl border border-sky-200 bg-sky-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <strong className="text-xs font-black text-slate-900">
                      2. Registro Presupuestal (RP)
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                    {numeroRP}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Expedido por el Área de Presupuesto. Ampara la obligación contra el CDP oficial {numeroCdp || '2026-104'}, garantizando que los recursos están legalmente comprometidos.
                </p>
                <div className="text-[10px] font-mono text-sky-900 bg-white/80 p-2 rounded-xl border border-sky-200">
                  ✓ Cumple Decreto 111 de 1996 (Estatuto Orgánico de Presupuesto).
                </div>
              </div>

              {/* 3. Garantía Única de Cumplimiento */}
              <div className="p-4 rounded-3xl border border-indigo-200 bg-indigo-50/30 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <strong className="text-xs font-black text-slate-900">
                      3. Garantía Única de Cumplimiento (Póliza de Seguros)
                    </strong>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    polizaAprobada ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {polizaAprobada ? '✓ Póliza Aprobada' : 'Pendiente de Aprobación'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-mono text-[10px] block">Cumplimiento (10%)</span>
                    <strong className="text-slate-900">{fmtCOP(Math.round(valorAdjudicado * 0.1))} COP</strong>
                    <span className="text-[9px] text-slate-500 block">Plazo + 4 meses</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-mono text-[10px] block">Salarios y Prestaciones (5%)</span>
                    <strong className="text-slate-900">{fmtCOP(Math.round(valorAdjudicado * 0.05))} COP</strong>
                    <span className="text-[9px] text-slate-500 block">Plazo + 3 años</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-mono text-[10px] block">Calidad y Servicio (20%)</span>
                    <strong className="text-slate-900">{fmtCOP(Math.round(valorAdjudicado * 0.2))} COP</strong>
                    <span className="text-[9px] text-slate-500 block">1 a 5 años posentrega</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-mono text-[10px] block">Resp. Civil Extracontractual</span>
                    <strong className="text-slate-900">200 SMMLV</strong>
                    <span className="text-[9px] text-slate-500 block">${(200 * SMMLV_2026).toLocaleString('es-CO')} COP</span>
                  </div>
                </div>

                {!polizaAprobada ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSuccess();
                      setPolizaAprobada(true);
                    }}
                    className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Examinar Amparos y Aprobar Garantía Única mediante Acto Administrativo</span>
                  </button>
                ) : (
                  <div className="p-2 bg-emerald-100/70 border border-emerald-300 rounded-xl text-[11px] text-emerald-950 font-bold flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Acto formal de aprobación de póliza expedido. Cumple plenamente con el Decreto 1082 de 2015.</span>
                  </div>
                )}
              </div>

              {/* 4. Designación de Supervisión / Interventoría */}
              <div className="p-4 rounded-3xl border border-amber-200 bg-amber-50/30 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <strong className="text-xs font-black text-slate-900">
                      4. Designación Oficial de Supervisión (Ley 1474 de 2011)
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    Supervisión Interna de Planta
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Conforme a los Artículos 83 y 84 del Estatuto Anticorrupción, se designa al servidor público de planta <strong>{supervisorNombre}</strong> para ejercer el control técnico, administrativo, financiero y jurídico del contrato.
                </p>
                <div className="text-[10px] font-mono text-amber-900 bg-white/80 p-2 rounded-xl border border-amber-200">
                  ✓ Se verificó no incurrir en conflicto de interés ni en causales de inhabilidad o incompatibilidad sobreviniente.
                </div>
              </div>
            </div>

            {/* Suscripción del Acta de Inicio */}
            <div className="p-5 rounded-3xl border-2 border-slate-900 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Suscripción del Acta de Inicio Oficial
                  </h4>
                  <p className="text-xs text-slate-500">
                    El plazo de ejecución solo comienza a computarse a partir de la firma del Acta de Inicio.
                  </p>
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 rounded font-black ${
                  actaInicioSuscrita ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {actaInicioSuscrita ? 'ACTA DE INICIO EN FIRME' : 'PENDIENTE DE FIRMA'}
                </span>
              </div>

              {!actaInicioSuscrita ? (
                <button
                  type="button"
                  disabled={!polizaAprobada}
                  onClick={() => {
                    soundEffects.playSuccess();
                    launchConfetti();
                    setActaInicioSuscrita(true);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                    polizaAprobada
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer hover:scale-[1.01]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>
                    {polizaAprobada
                      ? 'Suscribir Acta de Inicio (Comenzar Cómputo del Plazo Contractual) →'
                      : '⚠️ Debe aprobar la Garantía Única antes de suscribir el Acta de Inicio'}
                  </span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <strong>✓ Acta de Inicio suscrita a satisfacción en SECOP II.</strong>
                  <p className="text-[11px] text-slate-600">
                    Se verificó la disponibilidad de sitio, licencias requeridas y afiliaciones a la ARL. El contrato se encuentra en formal ejecución.
                  </p>
                </div>
              )}
            </div>

            {/* Navegación */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(10);
                }}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver a la Adjudicación (Paso 10)
              </button>

              <button
                type="button"
                disabled={!actaInicioSuscrita}
                onClick={() => {
                  soundEffects.playSuccess();
                  setPaso(12);
                }}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-sm ${
                  actaInicioSuscrita
                    ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Continuar a la Ejecución del Contrato (Paso 12)</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 12: Ejecución, Modificaciones y Sancionatorio                   */}
        {/* ===================================================================== */}
        {paso === 12 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cabecera */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ETAPA CONTRACTUAL • PASO 12
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Contrato N° 048-2026 • En Ejecución
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Supervisor: {supervisorNombre.split('(')[0]}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white font-display">
                  Gestión de la Ejecución, Modificaciones y Régimen Sancionatorio
                </h3>
                <p className="text-xs text-slate-300 leading-snug">
                  Seguimiento de bitácora, control de adiciones presupuestales (tope del 50%) y procedimiento sancionatorio del Art. 86 Ley 1474 de 2011.
                </p>
              </div>
            </div>

            {/* Tablero de Avance Físico y Financiero */}
            <div className="p-5 rounded-3xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-black text-slate-900">
                    Tablero de Control del Supervisor
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Avance acumulado de hitos y certificación de entregables
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setAvanceEjecucionPct(pct);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        avanceEjecucionPct === pct
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Progreso de Ejecución Física y Financiera</span>
                  <span className="font-mono text-emerald-700">{avanceEjecucionPct}% Cumplido</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${avanceEjecucionPct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-mono block">Acta Parcial N° 1</span>
                  <strong className="text-slate-900 block">{fmtCOP(Math.round(valorAdjudicado / 2))} COP</strong>
                  <span className="text-[10px] text-emerald-700 font-medium">✓ Aprobada y pagada</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-mono block">Acta Parcial N° 2 (Final)</span>
                  <strong className="text-slate-900 block">{fmtCOP(Math.round(valorAdjudicado / 2))} COP</strong>
                  <span className={`text-[10px] font-medium ${
                    avanceEjecucionPct === 100 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {avanceEjecucionPct === 100 ? '✓ Verificada a satisfacción' : '⏳ En ejecución'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-mono block">Seguridad Social y Parafiscales</span>
                  <strong className="text-slate-900 block">Planillas PILA</strong>
                  <span className="text-[10px] text-emerald-700 font-medium">✓ 100% al día con ARL</span>
                </div>
              </div>
            </div>

            {/* Simulador 1: Modificaciones Contractuales (Tope del 50% Art. 40 Ley 80) */}
            <div className="p-5 rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📐</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Simulador de Modificaciones y Adiciones Contractuales
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Regla de Oro: No superar el 50% del valor inicial (Art. 40 Ley 80 de 1993)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarSimuladorAdicion(!mostrarSimuladorAdicion)}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                >
                  {mostrarSimuladorAdicion ? 'Ocultar Simulador' : 'Probar Adición'}
                </button>
              </div>

              {mostrarSimuladorAdicion && (
                <div className="space-y-3 pt-1 animate-fadeIn">
                  <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      Ingresa el valor de la adición propuesta en COP:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={valorAdicionInput}
                        onChange={(e) => setValorAdicionInput(e.target.value.replace(/\D/g, ''))}
                        placeholder={`Ej. ${adicionLegal}`}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playClick();
                          const val = parseFloat(valorAdicionInput || '0');
                          const res = ContractExecutionLifecycleEngine.validarAdicionPresupuestal(valorAdjudicado, val);
                          setResultadoAdicion(res);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                      >
                        Validar con Ley 80
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setValorAdicionInput(String(adicionLegal));
                          const res = ContractExecutionLifecycleEngine.validarAdicionPresupuestal(valorAdjudicado, adicionLegal);
                          setResultadoAdicion(res);
                        }}
                        className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
                      >
                        Probar Adición Legal ({abreviarM(adicionLegal)} - {pctAdicion(adicionLegal)}%)
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setValorAdicionInput(String(adicionIlegal));
                          const res = ContractExecutionLifecycleEngine.validarAdicionPresupuestal(valorAdjudicado, adicionIlegal);
                          setResultadoAdicion(res);
                        }}
                        className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                      >
                        Probar Adición Ilegal ({abreviarM(adicionIlegal)} - {pctAdicion(adicionIlegal)}%)
                      </button>
                    </div>
                  </div>

                  {resultadoAdicion && (
                    <div className={`p-4 rounded-2xl text-xs space-y-1.5 animate-fadeIn border ${
                      resultadoAdicion.esValida
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}>
                      <div className="flex items-center gap-2 font-black">
                        <span>{resultadoAdicion.esValida ? '✓ ADICIÓN JURÍDICAMENTE VIABLE' : '💥 ADICIÓN ILEGAL Y NULA'}</span>
                      </div>
                      <p className="leading-snug">{resultadoAdicion.mensajeLegal}</p>
                      <div className="text-[11px] pt-1 font-medium opacity-90">
                        <strong>Riesgo de Responsabilidad: </strong>{resultadoAdicion.riesgoResponsabilidad}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Simulador 2: Régimen Sancionatorio Art. 86 Ley 1474 */}
            <div className="p-5 rounded-3xl border border-amber-200 bg-amber-50/30 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚖️</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Laboratorio de Audiencias Sancionatorias y Multas (Art. 86 Ley 1474)
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Garantía del Debido Proceso ante presuntos incumplimientos del contratista
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    if (!sancionSimulada) {
                      const s = ContractExecutionLifecycleEngine.ejecutarSimulacionSancionatoria('RETRASO_CRONOGRAMA', valorAdjudicado);
                      setSancionSimulada(s);
                    }
                    setMostrarSimuladorSancionatorio(!mostrarSimuladorSancionatorio);
                  }}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                >
                  {mostrarSimuladorSancionatorio ? 'Cerrar Laboratorio' : 'Simular Audiencia Art. 86'}
                </button>
              </div>

              {mostrarSimuladorSancionatorio && sancionSimulada && (
                <div className="space-y-3 pt-1 animate-fadeIn text-xs">
                  <div className="p-3.5 bg-white rounded-2xl border border-amber-200 space-y-2">
                    <strong className="text-slate-900 block font-bold">
                      Caso: Retraso Injustificado del 30% en Entrega de Sensores
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[10px] font-mono pt-1">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                        1. Informe Supervisor con tasación de daños
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                        2. Citación formal y vinculación Aseguradora
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                        3. Descargos orales en audiencia pública
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                        4. Resolución de Multa ($7.900.000 COP)
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                        5. Recurso de Reposición resuelto
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 space-y-1">
                    <strong>Blindaje Procesal:</strong>
                    <p>{sancionSimulada.blindajeDebidoProceso}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navegación */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(11);
                }}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Volver a Legalización (Paso 11)
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSuccess();
                  setPaso(13);
                }}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Culminar Ejecución y Pasar a Liquidación Contractual (Paso 13)</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PASO 13: Recibo Final, Liquidación Contractual y Cierre en SECOP II  */}
        {/* ===================================================================== */}
        {paso === 13 && !modoChecklist && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cabecera */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ETAPA POSTCONTRACTUAL • PASO 13
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Contrato N° 048-2026 • Cierre del Proceso
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {liquidacionCompletada ? 'PROCESO CERRADO Y LIQUIDADO' : 'EN TRÁMITE DE LIQUIDACIÓN'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white font-display">
                  Recibo Final a Satisfacción, Liquidación y Cierre en SECOP II
                </h3>
                <p className="text-xs text-slate-300 leading-snug">
                  Cruce definitivo de cuentas, amortización de anticipos, liberación presupuestal y garantías poscontractuales (Art. 11 Ley 1150 de 2007).
                </p>
              </div>
            </div>

            {/* 1. Acta de Recibo Final */}
            <div className="p-4 rounded-3xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <strong className="text-xs font-black text-slate-900">
                    1. Acta de Recibo Final a Satisfacción
                  </strong>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Recibido 100%
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                El Supervisor y el Contratista certifican que el 100% de los bienes y servicios fueron entregados, instalados y probados de conformidad con la ficha técnica de los pliegos de condiciones.
              </p>
            </div>

            {/* 2. Modalidad de Liquidación */}
            <div className="p-5 rounded-3xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-black text-slate-900">
                    2. Modalidad de Liquidación del Contrato
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Conforme a los plazos perentorios del Artículo 11 de la Ley 1150 de 2007
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setTipoLiquidacion('BILATERAL_MUTUO_ACUERDO');
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer space-y-1 ${
                    tipoLiquidacion === 'BILATERAL_MUTUO_ACUERDO'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <strong className="text-xs font-black text-emerald-900 block">
                    🤝 Liquidación Bilateral (Mutuo Acuerdo)
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Suscrita conjuntamente por las partes dentro del término legal de cuatro (4) meses posteriores a la terminación.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setTipoLiquidacion('UNILATERAL_POR_RESOLUCION');
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer space-y-1 ${
                    tipoLiquidacion === 'UNILATERAL_POR_RESOLUCION'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <strong className="text-xs font-black text-amber-900 block">
                    ⚖️ Liquidación Unilateral (Por Resolución)
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Facultad reglada de la entidad cuando el contratista no se presenta o no hay acuerdo (dentro de los 2 meses siguientes).
                  </p>
                </button>
              </div>

              {/* Salvedades */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800 font-bold">
                  <input
                    type="checkbox"
                    checked={incluyeSalvedades}
                    onChange={(e) => setIncluyeSalvedades(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>¿El contratista deja salvedades expresas en el acta?</span>
                </label>
                {incluyeSalvedades && (
                  <input
                    type="text"
                    value={textoSalvedades}
                    onChange={(e) => setTextoSalvedades(e.target.value)}
                    placeholder="Ej. El contratista se reserva reclamaciones por mayores costos de transporte."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none font-mono"
                  />
                )}
              </div>

              {/* Balance Financiero Consolidado */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <strong className="text-xs font-bold text-slate-200">
                    Balance Financiero y Presupuestal Definitivo
                  </strong>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Art. 11 Ley 1150/07
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor Convenido</span>
                    <strong>{fmtCOP(valorAdjudicado)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor Ejecutado</span>
                    <strong className="text-emerald-400">{fmtCOP(valorAdjudicado)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Saldo a Liberar RP</span>
                    <strong className="text-sky-300">$0 COP</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Estado Contable</span>
                    <strong className="text-emerald-400">Paz y Salvo Total</strong>
                  </div>
                </div>
              </div>

              {!liquidacionCompletada ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSuccess();
                    launchConfetti();
                    setLiquidacionCompletada(true);
                  }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
                >
                  <Award className="w-4 h-4 text-white" />
                  <span>
                    Suscribir y Publicar {tipoLiquidacion === 'BILATERAL_MUTUO_ACUERDO' ? 'Acta Bilateral de Liquidación' : 'Resolución de Liquidación Unilateral'} en SECOP II →
                  </span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2 text-xs animate-fadeIn">
                  <div className="flex items-center gap-2 font-black text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>¡PROCESO CONTRACTUAL 100% FINALIZADO Y CERRADO EN SECOP II!</span>
                  </div>
                  <p className="text-emerald-950/90 leading-snug">
                    Se publicó el documento de liquidación en SECOP II, se remitieron copias a Contabilidad y Tesorería, se activaron los amparos de estabilidad y calidad poscontractuales, y el expediente electrónico quedó formalmente archivado sin hallazgos preventivos.
                  </p>
                </div>
              )}
            </div>

            {/* Acciones Finales */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setPaso(1);
                  setEntidadSeleccionada(null);
                  setMetodoMercado(null);
                  setProveedorSeleccionado(null);
                  setAdendaPublicada(false);
                  setSobresAbiertos(false);
                  setAdjudicacionFinalizada(false);
                  setActaInicioSuscrita(false);
                  setPolizaAprobada(false);
                  setLiquidacionCompletada(false);
                  setModoChecklist(false);
                }}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Estructurar un proceso nuevo desde cero
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSuccess();
                  launchConfetti();
                  handleDescargar();
                }}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Descargar Expediente Integral Completo (.docx)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
