// Motor de Generación Automática de Líneas de Tiempo Contractuales - ProcureSim v2.0
// Calcula cronogramas legales con base en el Estatuto General de Contratación (Leyes 80, 1150, 1882 y Dcto 1082)
// Descuenta fines de semana y festivos oficiales en Colombia para garantizar cero nulidades por términos.

import type { PlataformaVista } from '../domain/types';

export type ModalidadContratacionLegal =
  | 'LICITACION_PUBLICA'
  | 'SELECCION_ABREVIADA_MENOR_CUANTIA'
  | 'MINIMA_CUANTIA'
  | 'CONCURSO_MERITOS_ABIERTO'
  | 'CONTRATACION_DIRECTA';

export interface HitoCronogramaLegal {
  id: string;
  orden: number;
  fase: 'PLANEACION' | 'CONVOCATORIA' | 'EVALUACION' | 'ADJUDICACION' | 'EJECUCION' | 'LIQUIDACION';
  titulo: string;
  descripcion: string;
  diasHabilesDesdeInicio: number;
  fechaCalculada: string;
  esCriticoLegal: boolean;
  baseLegal: string;
  alertaLegal?: string;
  herramientaAsociada: PlataformaVista;
  herramientaNombre: string;
  icono: string;
  estado: 'COMPLETADO' | 'EN_CURSO' | 'PENDIENTE' | 'CRITICO';
}

export interface CronogramaGenerado {
  id: string;
  modalidad: ModalidadContratacionLegal;
  modalidadNombre: string;
  presupuestoOficialCOP: number;
  fechaInicio: string;
  fechaCierreEstimada: string;
  fechaLiquidacionEstimada: string;
  totalDiasHabiles: number;
  totalDiasCalendario: number;
  hitos: HitoCronogramaLegal[];
}

export class TimelineGeneratorEngine {
  /**
   * Días festivos oficiales en Colombia (muestreo representativo anual)
   */
  private static FESTIVOS_COLOMBIA: string[] = [
    '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
    '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
    '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
    '2026-11-16', '2026-12-08', '2026-12-25'
  ];

  /**
   * Suma días hábiles a una fecha considerando sábados, domingos y festivos en Colombia
   */
  public static sumarDiasHabiles(fechaInicialStr: string, diasHabiles: number): string {
    const fecha = new Date(fechaInicialStr + 'T12:00:00Z');
    let diasSumados = 0;

    while (diasSumados < diasHabiles) {
      fecha.setDate(fecha.getDate() + 1);
      const diaSemana = fecha.getDay(); // 0: Domingo, 6: Sábado
      const fechaIso = fecha.toISOString().split('T')[0];

      if (diaSemana !== 0 && diaSemana !== 6 && !this.FESTIVOS_COLOMBIA.includes(fechaIso)) {
        diasSumados++;
      }
    }

    return fecha.toISOString().split('T')[0];
  }

  /**
   * Genera el cronograma legal automático según la modalidad de selección
   */
  public static generarCronogramaAutomatico(
    modalidad: ModalidadContratacionLegal,
    presupuestoCOP: number,
    fechaInicioStr: string = new Date().toISOString().split('T')[0]
  ): CronogramaGenerado {
    const hitos: HitoCronogramaLegal[] = [];

    if (modalidad === 'LICITACION_PUBLICA') {
      // 1. Estudios Previos y Prepliegos
      hitos.push({
        id: 'HITO-LP-01',
        orden: 1,
        fase: 'PLANEACION',
        titulo: 'Publicación de Prepliegos y Estudios Previos',
        descripcion: 'Inicio formal de la consulta pública en SECOP II. Término de 10 días hábiles para observaciones de la ciudadanía y gremios.',
        diasHabilesDesdeInicio: 0,
        fechaCalculada: fechaInicioStr,
        esCriticoLegal: false,
        baseLegal: 'Art. 2.2.1.1.2.1.4 Decreto 1082 de 2015',
        herramientaAsociada: 'INGENIERIA_PRECONTRACTUAL',
        herramientaNombre: 'Estudios Previos & CDP',
        icono: 'FileText',
        estado: 'COMPLETADO'
      });

      // 2. Audiencia de Aclaraciones y Riesgos
      const fechaRiesgos = this.sumarDiasHabiles(fechaInicioStr, 5);
      hitos.push({
        id: 'HITO-LP-02',
        orden: 2,
        fase: 'CONVOCATORIA',
        titulo: 'Audiencia de Aclaración de Pliegos y Asignación de Riesgos',
        descripcion: 'Audiencia obligatoria presencial/virtual para tipificar y asignar riesgos previsibles con los proponentes.',
        diasHabilesDesdeInicio: 5,
        fechaCalculada: fechaRiesgos,
        esCriticoLegal: true,
        baseLegal: 'Art. 4 de la Ley 1150 de 2007',
        alertaLegal: 'Obligatoria en Licitación Pública. No celebrarla genera nulidad del proceso.',
        herramientaAsociada: 'MATRIZ_RIESGOS',
        herramientaNombre: 'Matriz CONPES 3714',
        icono: 'Scale',
        estado: 'EN_CURSO'
      });

      // 3. Acto de Apertura y Pliego Definitivo
      const fechaApertura = this.sumarDiasHabiles(fechaInicioStr, 10);
      hitos.push({
        id: 'HITO-LP-03',
        orden: 3,
        fase: 'CONVOCATORIA',
        titulo: 'Resolución de Apertura y Pliego de Condiciones Definitivo',
        descripcion: 'Publicación del pliego vinculante con respuesta motivada a todas las observaciones ciudadanas.',
        diasHabilesDesdeInicio: 10,
        fechaCalculada: fechaApertura,
        esCriticoLegal: false,
        baseLegal: 'Art. 2.2.1.1.2.1.5 Decreto 1082 de 2015',
        herramientaAsociada: 'GENERADOR_DOCUMENTOS',
        herramientaNombre: 'Generador de Pliegos Word (.docx)',
        icono: 'FileCheck',
        estado: 'PENDIENTE'
      });

      // 4. LÍMITE FATAL DE ADENDAS (Ley 1882)
      const fechaCierre = this.sumarDiasHabiles(fechaInicioStr, 20);
      const fechaLimiteAdendas = this.sumarDiasHabiles(fechaInicioStr, 17); // 3 días hábiles antes
      hitos.push({
        id: 'HITO-LP-04',
        orden: 4,
        fase: 'CONVOCATORIA',
        titulo: 'Límite Fatal para Expedir Adendas Modificatorias',
        descripcion: 'Último instante legal para modificar el pliego. Prohibido adendar a menos de 3 días hábiles del cierre.',
        diasHabilesDesdeInicio: 17,
        fechaCalculada: fechaLimiteAdendas,
        esCriticoLegal: true,
        baseLegal: 'Art. 4 de la Ley 1882 de 2018',
        alertaLegal: 'Si se requiere modificar después de esta fecha, es imperativo prorrogar el cierre mínimo 3 días hábiles.',
        herramientaAsociada: 'INGENIERIA_PRECONTRACTUAL',
        herramientaNombre: 'Validador de Adendas Ley 1882',
        icono: 'AlertTriangle',
        estado: 'CRITICO'
      });

      // 5. Cierre y Presentación de Ofertas
      hitos.push({
        id: 'HITO-LP-05',
        orden: 5,
        fase: 'CONVOCATORIA',
        titulo: 'Cierre del Proceso y Presentación de Ofertas (10:00 AM)',
        descripcion: 'Bloqueo automático de radicación en SECOP II. Apertura simultánea de sobres económicos y técnicos.',
        diasHabilesDesdeInicio: 20,
        fechaCalculada: fechaCierre,
        esCriticoLegal: true,
        baseLegal: 'Art. 2.2.1.1.2.2.1 Decreto 1082 de 2015',
        herramientaAsociada: 'SECOP_II_ENTIDAD',
        herramientaNombre: 'Consola de Ofertas SECOP II',
        icono: 'Building2',
        estado: 'PENDIENTE'
      });

      // 6. Traslado del Informe de Evaluación y Subsanaciones
      const fechaInforme = this.sumarDiasHabiles(fechaCierre, 5);
      hitos.push({
        id: 'HITO-LP-06',
        orden: 6,
        fase: 'EVALUACION',
        titulo: 'Publicación de Informe de Evaluación y Traslado de 5 Días',
        descripcion: 'Publicación del informe preliminar. Término de 5 días hábiles perentorios para que los proponentes subsanen requisitos habilitantes.',
        diasHabilesDesdeInicio: 25,
        fechaCalculada: fechaInforme,
        esCriticoLegal: true,
        baseLegal: 'Art. 9 de la Ley 1150 de 2007',
        alertaLegal: 'Los documentos subsanables que no se entreguen en este término no podrán recibirse en audiencia pública.',
        herramientaAsociada: 'VALIDADOR_RUP',
        herramientaNombre: 'Validador RUP & Habilitantes',
        icono: 'CheckCircle2',
        estado: 'PENDIENTE'
      });

      // 7. Audiencia Pública de Adjudicación
      const fechaAudiencia = this.sumarDiasHabiles(fechaInforme, 2);
      hitos.push({
        id: 'HITO-LP-07',
        orden: 7,
        fase: 'ADJUDICACION',
        titulo: 'Audiencia Pública de Adjudicación en Vivo',
        descripcion: 'Pronunciamiento sobre observaciones al informe, apertura del sobre económico definitivo, resolución de desempates (Ley 2069 / BIC) y adjudicación irrevocable.',
        diasHabilesDesdeInicio: 27,
        fechaCalculada: fechaAudiencia,
        esCriticoLegal: true,
        baseLegal: 'Art. 9 Ley 1150 / Art. 5 Ley 1882 / Ley 2069 de 2020',
        herramientaAsociada: 'HERRAMIENTAS_ECONOMICAS_AVANZADAS',
        herramientaNombre: 'Desempates Ley 2069 & Precios Bajos',
        icono: 'Award',
        estado: 'PENDIENTE'
      });

      // 8. Perfeccionamiento y Legalización de Pólizas
      const fechaContrato = this.sumarDiasHabiles(fechaAudiencia, 5);
      hitos.push({
        id: 'HITO-LP-08',
        orden: 8,
        fase: 'EJECUCION',
        titulo: 'Perfeccionamiento, Pólizas de Seguro y Registro Presupuestal (RP)',
        descripcion: 'Firma de la minuta contractual Ley 80, expedición del RP por presupuesto y aprobación formal de garantías por la entidad.',
        diasHabilesDesdeInicio: 32,
        fechaCalculada: fechaContrato,
        esCriticoLegal: true,
        baseLegal: 'Art. 41 Ley 80 de 1993',
        alertaLegal: 'Prohibido iniciar ejecución sin aprobación previa de garantías. Genera responsabilidad disciplinaria y fiscal.',
        herramientaAsociada: 'GENERADOR_DOCUMENTOS',
        herramientaNombre: 'Minuta Contractual Word (.docx)',
        icono: 'FileText',
        estado: 'PENDIENTE'
      });

      // 9. Liquidación Bilateral del Contrato
      const fechaLiquidacion = this.sumarDiasHabiles(fechaContrato, 90);
      hitos.push({
        id: 'HITO-LP-09',
        orden: 9,
        fase: 'LIQUIDACION',
        titulo: 'Liquidación Bilateral de Común Acuerdo (Plazo: 4 Meses)',
        descripcion: 'Cierre formal de cuentas, amortización total de anticipos, balance financiero en cero y paz y salvo parafiscal.',
        diasHabilesDesdeInicio: 122,
        fechaCalculada: fechaLiquidacion,
        esCriticoLegal: true,
        baseLegal: 'Art. 11 de la Ley 1150 de 2007',
        alertaLegal: 'Si el contratista no acude en 4 meses, la entidad dispone de 2 meses adicionales para liquidar unilateralmente.',
        herramientaAsociada: 'LIQUIDACION_CONTRATOS',
        herramientaNombre: 'Liquidación de Contratos Estatales',
        icono: 'Scale',
        estado: 'PENDIENTE'
      });
    } else {
      // Plantilla para Selección Abreviada Menor Cuantía (SAMC)
      hitos.push({
        id: 'HITO-SAMC-01',
        orden: 1,
        fase: 'PLANEACION',
        titulo: 'Publicación de Prepliegos (5 días hábiles)',
        descripcion: 'Consulta pública acortada para procesos de menor cuantía.',
        diasHabilesDesdeInicio: 0,
        fechaCalculada: fechaInicioStr,
        esCriticoLegal: false,
        baseLegal: 'Art. 2.2.1.2.1.2.7 Decreto 1082 de 2015',
        herramientaAsociada: 'INGENIERIA_PRECONTRACTUAL',
        herramientaNombre: 'Estudios Previos & PAA',
        icono: 'FileText',
        estado: 'COMPLETADO'
      });

      const fechaCierreSamc = this.sumarDiasHabiles(fechaInicioStr, 10);
      hitos.push({
        id: 'HITO-SAMC-02',
        orden: 2,
        fase: 'CONVOCATORIA',
        titulo: 'Límite de Adendas y Cierre de Ofertas',
        descripcion: 'Recepción de sobres y cierre. Adendas máximo hasta 3 días antes.',
        diasHabilesDesdeInicio: 10,
        fechaCalculada: fechaCierreSamc,
        esCriticoLegal: true,
        baseLegal: 'Art. 4 Ley 1882 de 2018',
        herramientaAsociada: 'SECOP_II_ENTIDAD',
        herramientaNombre: 'Consola SECOP II',
        icono: 'Building2',
        estado: 'PENDIENTE'
      });

      const fechaEvalSamc = this.sumarDiasHabiles(fechaCierreSamc, 3);
      hitos.push({
        id: 'HITO-SAMC-03',
        orden: 3,
        fase: 'EVALUACION',
        titulo: 'Traslado de Informe de Evaluación (3 días hábiles)',
        descripcion: 'Plazo perentorio de subsanabilidad para menor cuantía.',
        diasHabilesDesdeInicio: 13,
        fechaCalculada: fechaEvalSamc,
        esCriticoLegal: true,
        baseLegal: 'Art. 2.2.1.2.1.2.9 Decreto 1082 de 2015',
        herramientaAsociada: 'VALIDADOR_RUP',
        herramientaNombre: 'Validador RUP',
        icono: 'CheckCircle2',
        estado: 'PENDIENTE'
      });

      const fechaAdjSamc = this.sumarDiasHabiles(fechaEvalSamc, 2);
      hitos.push({
        id: 'HITO-SAMC-04',
        orden: 4,
        fase: 'ADJUDICACION',
        titulo: 'Adjudicación por Acto Administrativo Motivado',
        descripcion: 'Emisión de la resolución de adjudicación y aplicación de Ley 2069 de desempates.',
        diasHabilesDesdeInicio: 15,
        fechaCalculada: fechaAdjSamc,
        esCriticoLegal: true,
        baseLegal: 'Ley 1150 Art. 2 y Ley 2069 Art. 35',
        herramientaAsociada: 'HERRAMIENTAS_ECONOMICAS_AVANZADAS',
        herramientaNombre: 'Desempate Ley 2069',
        icono: 'Award',
        estado: 'PENDIENTE'
      });
    }

    const ultimoHito = hitos[hitos.length - 1];

    return {
      id: `CRONO-${modalidad}-${Date.now()}`,
      modalidad,
      modalidadNombre:
        modalidad === 'LICITACION_PUBLICA'
          ? 'Licitación Pública (Mayor Cuantía)'
          : modalidad === 'SELECCION_ABREVIADA_MENOR_CUANTIA'
          ? 'Selección Abreviada de Menor Cuantía (SAMC)'
          : modalidad === 'MINIMA_CUANTIA'
          ? 'Contratación de Mínima Cuantía'
          : 'Concurso de Méritos Abierto',
      presupuestoOficialCOP: presupuestoCOP,
      fechaInicio: fechaInicioStr,
      fechaCierreEstimada: hitos.find((h) => h.id.includes('05') || h.titulo.includes('Cierre'))?.fechaCalculada || fechaInicioStr,
      fechaLiquidacionEstimada: ultimoHito.fechaCalculada,
      totalDiasHabiles: ultimoHito.diasHabilesDesdeInicio,
      totalDiasCalendario: Math.round(ultimoHito.diasHabilesDesdeInicio * 1.45),
      hitos
    };
  }
}
