// Casos Demo de Controversias Contractuales y Procesos Sancionatorios
import type { ControversiaContractual } from '../core/domain/types';
import { DisputesEngine } from '../core/engines/DisputesEngine';

export const CONTROVERSIAS_DEMO: ControversiaContractual[] = [
  {
    id: 'CONT-01',
    procesoId: 'PROC-SECOP2-01',
    numeroExpediente: 'EXP-SANC-2025-004',
    tipo: 'SANCIONATORIO_MULTA_INCUMPLIMIENTO',
    titulo: 'Procedimiento Administrativo Sancionatorio por Presunto Retraso en Entrega de Equipos (Art. 86 Ley 1474)',
    radicador: 'Supervisión Técnica de la Secretaría de Educación',
    rolRadicador: 'ENTIDAD_ESTATAL',
    fechaRadicacion: '2025-02-18',
    pretensionEconomicaCOP: 43250000, // 10% del contrato como cláusula penal/multa
    sintesisHechos: 'El supervisor de contrato informa un retraso del 22% frente a la curva de entrega programada en el cronograma oficial de dotación de computadores para las escuelas rurales.',
    fundamentoJuridico: 'Artículo 86 de la Ley 1474 de 2011 y Cláusula Décima Cuarta (Multas y Sanciones) del Contrato Estatal.',
    estado: 'AUDIENCIA_PROGRAMADA',
    diasParaVencerTermino: 4,
    alertaVencimiento: 'AMARILLA',
    lineaTiempo: DisputesEngine.generarLineaTiempo('SANCIONATORIO_MULTA_INCUMPLIMIENTO', '2025-02-18'),
    respuestasEmitidas: [
      {
        id: 'RSP-01',
        fecha: '2025-02-20',
        tipoActo: 'AUTO_APERTURA',
        titulo: 'Auto No. 018 de Citación a Audiencia Sancionatoria',
        contenidoRedactado: 'Se convoca al contratista y a Seguros del Estado S.A. a audiencia para debatir descargos.',
        autor: 'Ordenador del Gasto'
      }
    ]
  },
  {
    id: 'CONT-02',
    procesoId: 'PROC-SECOP2-01',
    numeroExpediente: 'EXP-REP-2025-012',
    tipo: 'RECURSO_REPOSICION_ADJUDICACION',
    titulo: 'Recurso de Reposición contra el Acto de Evaluación y Asignación de Puntaje por Industria Nacional',
    radicador: 'INVERSIONES & SUMINISTROS NACIONALES S.A.S.',
    rolRadicador: 'PROPONENTE_NO_FAVORECIDO',
    fechaRadicacion: '2025-02-26',
    sintesisHechos: 'El recurrente alega que la entidad no otorgó los 10 puntos de estímulo a la industria nacional consagrados en la Ley 816 de 2002 a pesar de haber adjuntado el certificado de origen en tiempo.',
    fundamentoJuridico: 'Artículo 77 Ley 80 de 1993, Ley 816 de 2002 y Art. 76 del CPACA.',
    estado: 'EN_TRASLADO',
    diasParaVencerTermino: 8,
    alertaVencimiento: 'VERDE',
    lineaTiempo: DisputesEngine.generarLineaTiempo('RECURSO_REPOSICION_ADJUDICACION', '2025-02-26'),
    respuestasEmitidas: []
  },
  {
    id: 'CONT-03',
    procesoId: 'PROC-SUPLOS-01',
    numeroExpediente: 'EXP-DESEQ-2025-001',
    tipo: 'DESEQUILIBRIO_ECONOMICO',
    titulo: 'Reclamación de Restablecimiento de la Ecuación Financiera por Aumento Imprevisible en Costos de Fletes Marítimos',
    radicador: 'SUMINISTROS INDUSTRIALES PETROLEROS S.A.S.',
    rolRadicador: 'CONTRATISTA',
    fechaRadicacion: '2025-01-30',
    pretensionEconomicaCOP: 89000000,
    sintesisHechos: 'Sobrecosto extraordinario generado por el cierre temporal de pasos marítimos y variación abrupta de tarifas portuarias que rompieron el equilibrio económico del suministro.',
    fundamentoJuridico: 'Artículo 4 Numeral 3 y Numeral 8 de la Ley 80 de 1993 (Teoría de la Imprevisión).',
    estado: 'RADICADA',
    diasParaVencerTermino: 18,
    alertaVencimiento: 'VERDE',
    lineaTiempo: DisputesEngine.generarLineaTiempo('DESEQUILIBRIO_ECONOMICO', '2025-01-30'),
    respuestasEmitidas: []
  }
];
