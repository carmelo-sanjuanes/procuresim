import { SMMLV_2026 } from '../domain/constants';
// Motor Dinámico de Cuantías (SMMLV / Ley 617) y Riesgos Territoriales CONPES 3714
// Alcance Nacional para los 1.103 municipios y 32 departamentos de Colombia

export interface AnalisisCuantia {
  presupuestoCOP: number;
  smmlvCalculado: number;
  categoriaEntidad: string;
  modalidadLegalSugerida: string;
  esMinimaCuantia: boolean;
  esMenorCuantia: boolean;
  esMayorCuantia: boolean;
  plazoEstimadoDiasHabiles: number;
  explicacionJuridica: string;
}

export interface RiesgoConpesTerritorial {
  id: string;
  tipo: 'CLIMATICO_GEOGRAFICO' | 'OPERATIVO_LOGISTICO' | 'ECONOMICO_MERCADO' | 'REGULATORIO_JURIDICO';
  descripcion: string;
  probabilidad: 'BAJA' | 'MEDIA' | 'ALTA';
  impacto: 'BAJO' | 'MEDIO' | 'ALTO';
  asignacion: 'ENTIDAD' | 'CONTRATISTA' | 'COMPARTIDO';
  mitigacion: string;
  justificacionTerritorial: string;
}

export class DynamicRiskAndThresholdsEngine {
  // Salario Mínimo Mensual Legal Vigente 2026 (Decreto 1469 de 2025) — ver core/domain/constants.ts
  public static readonly SMMLV_2026 = SMMLV_2026;

  /**
   * Calcula con rigor matemático y legal la cuantía y modalidad según la Ley 1150 y la categoría de la entidad
   */
  public static calcularCuantia(
    presupuestoCOP: number,
    categoriaEntidad = '1ª Categoría',
    regimenLegal: 'LEY_80' | 'MANUAL_PROPIO' | 'MULTILATERAL' = 'LEY_80',
    presupuestoAnualEntidadCOP = 0
  ): AnalisisCuantia {
    const valor = Math.max(0, presupuestoCOP || 0);
    const smmlv = Math.round((valor / this.SMMLV_2026) * 10) / 10;
    const catNorm = categoriaEntidad.toLowerCase();

    // Si es Manual Propio (E.S.P., E.S.E., Universidad)
    if (regimenLegal === 'MANUAL_PROPIO') {
      const esMenor = smmlv <= 500;
      return {
        presupuestoCOP: valor,
        smmlvCalculado: smmlv,
        categoriaEntidad: 'Régimen Especial - Derecho Privado',
        modalidadLegalSugerida: esMenor ? 'Solicitud Privada de Ofertas (Manual Interno)' : 'Convocatoria Pública por Manual Interno',
        esMinimaCuantia: smmlv <= 50,
        esMenorCuantia: esMenor,
        esMayorCuantia: !esMenor,
        plazoEstimadoDiasHabiles: esMenor ? 15 : 25,
        explicacionJuridica: `Bajo Manual de Contratación Propio, ${smmlv} SMMLV se tramitan según los rangos internos de la entidad con principios del Art. 209 C.P.`
      };
    }

    // Tope de Menor Cuantía — Ley 1150 de 2007 Art. 2 num. 2 literal b:
    // se define por el PRESUPUESTO ANUAL de la entidad expresado en SMMLV (no por su categoría territorial).
    //   >= 1.200.000 SMMLV -> 1.000 | >= 850.000 -> 850 | >= 400.000 -> 650 | >= 120.000 -> 450 | < 120.000 -> 280
    let topeMenorCuantiaSMMLV: number;
    let origenTope: string;
    const presupuestoAnualSMMLV = presupuestoAnualEntidadCOP > 0 ? presupuestoAnualEntidadCOP / this.SMMLV_2026 : 0;
    if (presupuestoAnualSMMLV > 0) {
      if (presupuestoAnualSMMLV >= 1200000) topeMenorCuantiaSMMLV = 1000;
      else if (presupuestoAnualSMMLV >= 850000) topeMenorCuantiaSMMLV = 850;
      else if (presupuestoAnualSMMLV >= 400000) topeMenorCuantiaSMMLV = 650;
      else if (presupuestoAnualSMMLV >= 120000) topeMenorCuantiaSMMLV = 450;
      else topeMenorCuantiaSMMLV = 280;
      origenTope = `presupuesto anual de la entidad de ${Math.round(presupuestoAnualSMMLV).toLocaleString('es-CO')} SMMLV, Art. 2 Ley 1150`;
    } else {
      // Estimación por categoría cuando aún no se conoce el presupuesto anual (referencia, no norma)
      const dig = catNorm.match(/(?:^|\s)([1-6])\s*[ªº°]/) || catNorm.match(/categor[ií]a\s*([1-6])\b/);
      const esEspecial = catNorm.includes('especial');
      const cat = esEspecial ? 0 : dig ? parseInt(dig[1], 10) : 1;
      topeMenorCuantiaSMMLV = cat === 0 ? 1000 : cat === 1 ? 650 : cat === 2 ? 450 : 280;
      origenTope = esEspecial || dig
        ? 'estimado por la categoría de la entidad; confirma su presupuesto anual para fijar el tope exacto (Art. 2 Ley 1150)'
        : 'valor de referencia: aún no se conoce la categoría ni el presupuesto anual de la entidad; ingrésalo para fijar el tope exacto (Art. 2 Ley 1150)';
    }

    const topeMinimaCuantiaSMMLV = topeMenorCuantiaSMMLV * 0.1;

    const esMinima = smmlv <= topeMinimaCuantiaSMMLV;
    const esMenor = smmlv > topeMinimaCuantiaSMMLV && smmlv <= topeMenorCuantiaSMMLV;
    const esMayor = smmlv > topeMenorCuantiaSMMLV;

    let modalidad = 'Selección Abreviada de Menor Cuantía';
    let plazo = 25;
    let explicacion = `El valor de ${smmlv} SMMLV se clasifica en Menor Cuantía (tope: ${topeMenorCuantiaSMMLV} SMMLV, ${origenTope}). Permite convocatoria limitada a Mipymes.`;

    if (esMinima) {
      modalidad = 'Mínima Cuantía (Art. 2 num. 5 Ley 1150)';
      plazo = 5;
      explicacion = `El valor (${smmlv} SMMLV) es inferior al 10% de la menor cuantía (${topeMinimaCuantiaSMMLV} SMMLV). Trámite ágil y simplificado: no exige RUP obligatorio y adjudica al menor precio.`;
    } else if (esMayor) {
      modalidad = 'Licitación Pública (Art. 2 num. 1 Ley 1150)';
      plazo = 45;
      explicacion = `El valor (${smmlv} SMMLV) supera el tope de menor cuantía (${topeMenorCuantiaSMMLV} SMMLV). Es obligatorio adelantar Licitación Pública con pliegos tipo CCE.`;
    }

    return {
      presupuestoCOP: valor,
      smmlvCalculado: smmlv,
      categoriaEntidad,
      modalidadLegalSugerida: modalidad,
      esMinimaCuantia: esMinima,
      esMenorCuantia: esMenor,
      esMayorCuantia: esMayor,
      plazoEstimadoDiasHabiles: plazo,
      explicacionJuridica: explicacion
    };
  }

  /**
   * Genera dinámicamente la matriz de riesgos CONPES 3714 según la geografía y objeto de cualquier rincón del país
   */
  public static generarRiesgosTerritoriales(
    departamento: string,
    municipio: string,
    objeto: string
  ): RiesgoConpesTerritorial[] {
    const depNorm = (departamento || '').toLowerCase();
    const objNorm = (objeto || '').toLowerCase();
    const muni = municipio || 'zona de ejecución';
    const riesgos: RiesgoConpesTerritorial[] = [];

    // 1. Riesgo Geográfico / Climático Territorial
    if (depNorm.includes('huila') || depNorm.includes('tolima') || depNorm.includes('cauca') || depNorm.includes('nariño') || depNorm.includes('santander') || depNorm.includes('antioquia')) {
      riesgos.push({
        id: 'RSK-CLIMA-MONTAÑA',
        tipo: 'CLIMATICO_GEOGRAFICO',
        descripcion: `Temporadas de lluvia intensa, crecientes súbitas y deslizamientos en la red vial cordillerana que conecta a ${muni}.`,
        probabilidad: 'MEDIA',
        impacto: 'ALTO',
        asignacion: 'COMPARTIDO',
        mitigacion: 'Suspensión concertada por fuerza mayor o ajuste en cronograma reglado de entregas.',
        justificacionTerritorial: `Topografía de ladera y cordillera andina en el departamento de ${departamento}.`
      });
    } else if (depNorm.includes('amazonas') || depNorm.includes('choco') || depNorm.includes('guainia') || depNorm.includes('vaupes') || depNorm.includes('putumayo')) {
      riesgos.push({
        id: 'RSK-CLIMA-FLUVIAL',
        tipo: 'CLIMATICO_GEOGRAFICO',
        descripcion: `Variación de niveles de navegación fluvial y lluvias torrenciales en el corredor de acceso a ${muni}.`,
        probabilidad: 'ALTA',
        impacto: 'ALTO',
        asignacion: 'ENTIDAD',
        mitigacion: 'Programación de fletes fluviales con conmutación anticipada según calendario hidrográfico.',
        justificacionTerritorial: `Acceso logístico primordialmente fluvial y selvático en ${departamento}.`
      });
    } else if (depNorm.includes('atlantico') || depNorm.includes('bolivar') || depNorm.includes('magdalena') || depNorm.includes('guajira') || depNorm.includes('cesar')) {
      riesgos.push({
        id: 'RSK-CLIMA-CARIBE',
        tipo: 'CLIMATICO_GEOGRAFICO',
        descripcion: `Temperaturas extremas, salinidad y periodos estacionales secos en la región de ${muni}.`,
        probabilidad: 'MEDIA',
        impacto: 'MEDIO',
        asignacion: 'CONTRATISTA',
        mitigacion: 'Exigencia de embalajes especiales anticorrosivos y cadena de protección térmica.',
        justificacionTerritorial: `Condiciones de humedad y temperatura del litoral y sabana caribeña.`
      });
    } else {
      riesgos.push({
        id: 'RSK-CLIMA-INTERIOR',
        tipo: 'CLIMATICO_GEOGRAFICO',
        descripcion: `Contingencias por temporadas de lluvias e inundaciones locales en áreas de descargue de ${muni}.`,
        probabilidad: 'MEDIA',
        impacto: 'MEDIO',
        asignacion: 'COMPARTIDO',
        mitigacion: 'Puntos de acopio intermedio y cronogramas con holgura climática.',
        justificacionTerritorial: `Monitoreo del IDEAM para la cuenca geográfica de ${departamento}.`
      });
    }

    // 2. Riesgo Operativo y Logístico (Fletes de última milla)
    riesgos.push({
      id: 'RSK-LOGISTICA-FLETE',
      tipo: 'OPERATIVO_LOGISTICO',
      descripcion: `Sobrecostos o demoras en el acarreo hasta veredas y centros poblados de ${muni} por cierres viales o bloqueos locales.`,
      probabilidad: 'MEDIA',
      impacto: 'MEDIO',
      asignacion: 'CONTRATISTA',
      mitigacion: 'Costeo integral del flete rural dentro del presupuesto oficial (Paso 8) para evitar desequilibrio.',
      justificacionTerritorial: `Logística veredal y dispersión geográfica en ${departamento}.`
    });

    // 3. Riesgo de Mercado y Económico según el objeto
    if (objNorm.includes('software') || objNorm.includes('sensor') || objNorm.includes('computador') || objNorm.includes('tecnolog') || objNorm.includes('equipo')) {
      riesgos.push({
        id: 'RSK-MERCADO-TRM',
        tipo: 'ECONOMICO_MERCADO',
        descripcion: 'Fluctuación de la Tasa Representativa del Mercado (TRM / USD) en insumos y componentes electrónicos importados.',
        probabilidad: 'MEDIA',
        impacto: 'ALTO',
        asignacion: 'CONTRATISTA',
        mitigacion: 'Fijación de precios en pesos colombianos con fórmula de ajuste si la TRM varía más del 15%.',
        justificacionTerritorial: 'Componentes de alta tecnología dependientes de importación.'
      });
    } else if (objNorm.includes('obra') || objNorm.includes('cemento') || objNorm.includes('asfalto') || objNorm.includes('vial')) {
      riesgos.push({
        id: 'RSK-MERCADO-INSUMOS',
        tipo: 'ECONOMICO_MERCADO',
        descripcion: 'Incremento en el precio del combustible (ACPM), acero, agregados pétreos y cemento en la región.',
        probabilidad: 'ALTA',
        impacto: 'ALTO',
        asignacion: 'COMPARTIDO',
        mitigacion: 'Acta de precios unitarios con índice de reajuste DANE (ICCO - Índice de Costos de Construcción).',
        justificacionTerritorial: 'Evolución de costos del sector infraestructura en Colombia.'
      });
    } else {
      riesgos.push({
        id: 'RSK-MERCADO-INFLACION',
        tipo: 'ECONOMICO_MERCADO',
        descripcion: 'Variación imprevista del IPC nacional sobre el costo de producción de los bienes o servicios.',
        probabilidad: 'BAJA',
        impacto: 'MEDIO',
        asignacion: 'CONTRATISTA',
        mitigacion: 'Estudio de mercado con vigencia no mayor a 3 meses para asegurar precios actualizados.',
        justificacionTerritorial: 'Índice de Precios al Consumidor (DANE Colombia).'
      });
    }

    return riesgos;
  }
}
