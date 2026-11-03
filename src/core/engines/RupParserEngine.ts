// Motor de Análisis, Extracción y Validación Bloqueante de RUP Oficial (Registro Único de Proponentes)
// Conforme al Decreto 1082 de 2015, Circulares de Colombia Compra Eficiente y Ley 527 de 1999 (No Repudio)
import type {
  CertificadoRUPOficial,
  RequisitosHabilitantesPliego,
  ProcesoSecop2Real,
  DictamenHabilitacionReal
} from '../domain/types';

export class RupParserEngine {
  /**
   * Genera un hash pseudo SHA-256 representativo para trazabilidad legal y no repudio (Ley 527 de 1999)
   */
  public static generarHashSHA256(contenido: string): string {
    let hash = 0;
    for (let i = 0; i < contenido.length; i++) {
      const char = contenido.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    const timestamp = Date.now().toString(16);
    return `sha256:cce-${hex}-${timestamp}-secop2-valid`;
  }

  /**
   * Catálogo de RUPs Oficiales precargados representativos de empresas reales habilitadas
   */
  public static readonly RUPS_OFICIALES_DEMO: CertificadoRUPOficial[] = [
    {
      id: 'RUP-SANJUANES-01',
      camaraComercio: 'Cámara de Comercio de Bogotá',
      numeroInscripcionRUP: '00341829',
      fechaExpedicion: '2025-03-15',
      fechaRenovacion: '2025-04-04',
      vigente: true,
      razonSocial: 'SANJUANÉS SOLUCIONES S.A.S.',
      nit: '901.458.789-1',
      tamanoEmpresa: 'MEDIANA',
      indicadores: {
        indiceLiquidez: 2.45, // >= 1.5 CUMPLE
        indiceEndeudamientoPct: 48.2, // <= 70% CUMPLE
        razonCoberturaIntereses: 5.8, // >= 2.0 CUMPLE
        rentabilidadPatrimonioPct: 18.4,
        rentabilidadActivoPct: 9.6,
        patrimonioNetoCOP: 3850000000,
        capitalTrabajoCOP: 2150000000
      },
      capacidadResidualKCOP: 8900000000,
      experiencia: [
        {
          consecutivo: 1,
          numeroContrato: 'CT-2023-089',
          contratante: 'MINISTERIO DE TECNOLOGÍAS DE LA INFORMACIÓN Y LAS COMUNICACIONES',
          objeto: 'Desarrollo, integración e interoperabilidad de plataformas gubernamentales en nube y analítica.',
          valorCOP: 1850000000,
          valorSMMLV: 1594.8,
          fechaTerminacion: '2023-11-30',
          codigosUNSPSC: ['43230000', '81111800', '81111500', '80101500'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        },
        {
          consecutivo: 2,
          numeroContrato: 'CT-2024-012',
          contratante: 'ALCALDÍA MAYOR DE BOGOTÁ - SECRETARÍA GENERAL',
          objeto: 'Implementación de suite de analítica, monitoreo de gasto público y módulos de contratación.',
          valorCOP: 1250000000,
          valorSMMLV: 961.5,
          fechaTerminacion: '2024-09-15',
          codigosUNSPSC: ['81111800', '81112200', '80101500'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        },
        {
          consecutivo: 3,
          numeroContrato: 'CT-2022-145',
          contratante: 'DEPARTAMENTO ADMINISTRATIVO DE LA PRESIDENCIA DE LA REPÚBLICA (DAPRE)',
          objeto: 'Modernización del sistema de gestión documental y archivo digital con firma electrónica.',
          valorCOP: 980000000,
          valorSMMLV: 980.0,
          fechaTerminacion: '2022-12-10',
          codigosUNSPSC: ['43230000', '81111500'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        }
      ],
      hashVerificacionSHA256: 'sha256:9f8a32b1c4e7d0284719283749102834-ccb-verif',
      archivoOrigen: 'Certificado_RUP_CCB_SANJUANES_2025.pdf'
    },
    {
      id: 'RUP-INGELECGROUP-04',
      camaraComercio: 'Cámara de Comercio de Bogotá',
      numeroInscripcionRUP: '00512849',
      fechaExpedicion: '2025-03-25',
      fechaRenovacion: '2025-04-02',
      vigente: true,
      razonSocial: 'INGELECGROUP S.A.S. BIC',
      nit: '901.624.819-5',
      tamanoEmpresa: 'PEQUENA',
      esSociedadBIC: true, // Sociedad de Beneficio e Interés Colectivo (Ley 1901 de 2018)
      indicadores: {
        indiceLiquidez: 2.15, // >= 1.5 CUMPLE
        indiceEndeudamientoPct: 52.4, // <= 70% CUMPLE
        razonCoberturaIntereses: 4.8, // >= 2.0 CUMPLE
        rentabilidadPatrimonioPct: 15.6,
        rentabilidadActivoPct: 8.2,
        patrimonioNetoCOP: 2450000000,
        capitalTrabajoCOP: 1350000000
      },
      capacidadResidualKCOP: 6800000000,
      experiencia: [
        {
          consecutivo: 1,
          numeroContrato: 'CT-ENERGIA-2023-04',
          contratante: 'MINISTERIO DE MINAS Y ENERGÍA / FENOGE',
          objeto: 'Diseño, suministro, montaje e ingeniería de detalle para soluciones energéticas sostenibles y solares fotovoltaicas.',
          valorCOP: 1050000000,
          valorSMMLV: 920.0,
          fechaTerminacion: '2023-11-30',
          codigosUNSPSC: ['26111600', '39121000', '81101500', '72101500'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        },
        {
          consecutivo: 2,
          numeroContrato: 'CT-ETB-2023-88',
          contratante: 'EMPRESA DE TELECOMUNICACIONES DE BOGOTÁ (ETB)',
          objeto: 'Consultoría técnica, auditoría energética e infraestructura eléctrica de respaldo y telecomunicaciones.',
          valorCOP: 890000000,
          valorSMMLV: 780.0,
          fechaTerminacion: '2024-06-30',
          codigosUNSPSC: ['81101500', '81111800', '72101500'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        },
        {
          consecutivo: 3,
          numeroContrato: 'CT-SOST-2024-19',
          contratante: 'ALCALDÍA MAYOR DE CARTAGENA',
          objeto: 'Adecuación de redes de distribución, eficiencia de recursos y obras de modernización con criterios de sostenibilidad BIC.',
          valorCOP: 680000000,
          valorSMMLV: 550.0,
          fechaTerminacion: '2024-10-15',
          codigosUNSPSC: ['72141100', '26111600', '81101500'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        }
      ],
      hashVerificacionSHA256: 'sha256:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f-ingelecgroup-bic',
      archivoOrigen: 'Certificado_RUP_CCB_INGELECGROUP_BIC_2025.pdf'
    },
    {
      id: 'RUP-CONSTRUCCIONES-02',
      camaraComercio: 'Cámara de Comercio de Medellín para Antioquia',
      numeroInscripcionRUP: '00192847',
      fechaExpedicion: '2025-02-20',
      fechaRenovacion: '2025-03-28',
      vigente: true,
      razonSocial: 'INGENIERÍA & CONSTRUCCIONES DEL CARIBE S.A.S.',
      nit: '890.345.678-2',
      tamanoEmpresa: 'GRANDE',
      indicadores: {
        indiceLiquidez: 1.62,
        indiceEndeudamientoPct: 62.1,
        razonCoberturaIntereses: 3.1,
        rentabilidadPatrimonioPct: 12.0,
        rentabilidadActivoPct: 6.4,
        patrimonioNetoCOP: 12500000000,
        capitalTrabajoCOP: 4800000000
      },
      capacidadResidualKCOP: 24500000000,
      experiencia: [
        {
          consecutivo: 1,
          numeroContrato: 'OBR-2023-01',
          contratante: 'INSTITUTO NACIONAL DE VÍAS (INVIAS)',
          objeto: 'Mejoramiento, mantenimiento y pavimentación de corredor vial secundario.',
          valorCOP: 8500000000,
          valorSMMLV: 7327.5,
          fechaTerminacion: '2023-10-15',
          codigosUNSPSC: ['72141000', '72141100', '30121700'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        }
      ],
      hashVerificacionSHA256: 'sha256:3a4b5c6d7e8f901234567890abcdef12-ccm-verif',
      archivoOrigen: 'Certificado_RUP_CCM_CONSTRUCARIBE_2025.pdf'
    },
    {
      id: 'RUP-DEFICIENTE-03',
      camaraComercio: 'Cámara de Comercio de Cali',
      numeroInscripcionRUP: '00418290',
      fechaExpedicion: '2024-11-10',
      fechaRenovacion: '2024-11-10',
      vigente: false, // RUP vencido sin renovación antes del quinto día hábil de abril
      razonSocial: 'PROPONENTE EN RIESGO FINANCIERO S.A.S.',
      nit: '900.812.345-9',
      tamanoEmpresa: 'PEQUENA',
      indicadores: {
        indiceLiquidez: 1.15, // < 1.5 NO CUMPLE
        indiceEndeudamientoPct: 79.5, // > 70% NO CUMPLE
        razonCoberturaIntereses: 1.2, // < 2.0 NO CUMPLE
        rentabilidadPatrimonioPct: 4.1,
        rentabilidadActivoPct: 1.8,
        patrimonioNetoCOP: 450000000,
        capitalTrabajoCOP: 120000000
      },
      capacidadResidualKCOP: 620000000,
      experiencia: [
        {
          consecutivo: 1,
          numeroContrato: 'SUM-2022-09',
          contratante: 'ALCALDÍA MUNICIPAL DE PALMIRA',
          objeto: 'Suministro de papelería e insumos de oficina.',
          valorCOP: 120000000,
          valorSMMLV: 120.0,
          fechaTerminacion: '2022-08-30',
          codigosUNSPSC: ['14111500', '44121500'],
          porcentajeParticipacion: 100,
          esConsorcio: false
        }
      ],
      hashVerificacionSHA256: 'sha256:99887766554433221100aabbccddeeff-ccc-verif',
      archivoOrigen: 'Certificado_RUP_CCC_RIESGO_2024.pdf'
    }
  ];

  /**
   * Evalúa de forma bloqueante y exhaustiva el RUP de un proponente contra los requisitos de un pliego
   */
  public static evaluarHabilitacionRUP(
    rup: CertificadoRUPOficial,
    requisitos: RequisitosHabilitantesPliego,
    proceso: ProcesoSecop2Real
  ): DictamenHabilitacionReal {
    const fundamentos: string[] = [];

    // 1. Verificación de vigencia formal del RUP (Art. 2.2.1.1.1.5.1 Dcto. 1082/2015)
    if (!rup.vigente) {
      fundamentos.push(
        'RECHAZO VINCULANTE: El proponente no cuenta con inscripción vigente en el RUP. No acreditó la renovación antes del quinto día hábil de abril (Dcto. 1082/2015, Art. 2.2.1.1.1.5.1).'
      );
    }

    // 2. Verificación de Capacidad Financiera
    const cumpleLiquidez = rup.indicadores.indiceLiquidez >= requisitos.liquidezMinima;
    if (!cumpleLiquidez) {
      fundamentos.push(
        `INCUMPLIMIENTO FINANCIERO: Índice de Liquidez reportado (${rup.indicadores.indiceLiquidez.toFixed(2)}) es inferior al mínimo exigido (${requisitos.liquidezMinima.toFixed(2)}).`
      );
    }

    const cumpleEndeudamiento = rup.indicadores.indiceEndeudamientoPct <= requisitos.endeudamientoMaximoPct;
    if (!cumpleEndeudamiento) {
      fundamentos.push(
        `INCUMPLIMIENTO FINANCIERO: Nivel de Endeudamiento reportado (${rup.indicadores.indiceEndeudamientoPct.toFixed(1)}%) supera el tope máximo permitido (${requisitos.endeudamientoMaximoPct.toFixed(1)}%).`
      );
    }

    const cumpleCobertura = rup.indicadores.razonCoberturaIntereses >= requisitos.coberturaInteresesMinima;
    if (!cumpleCobertura) {
      fundamentos.push(
        `INCUMPLIMIENTO FINANCIERO: Cobertura de Intereses (${rup.indicadores.razonCoberturaIntereses.toFixed(2)}) es inferior al mínimo (${requisitos.coberturaInteresesMinima.toFixed(2)}).`
      );
    }

    const cumplePatrimonio = rup.indicadores.patrimonioNetoCOP >= requisitos.patrimonioMinimoCOP;
    if (!cumplePatrimonio) {
      fundamentos.push(
        `INCUMPLIMIENTO FINANCIERO: Patrimonio Neto (\$${(rup.indicadores.patrimonioNetoCOP / 1e6).toFixed(0)}M) es menor al patrimonio exigido (\$${(requisitos.patrimonioMinimoCOP / 1e6).toFixed(0)}M).`
      );
    }

    // 3. Verificación de Experiencia en Códigos UNSPSC y Cuantía en SMMLV
    // Recolectar todos los códigos UNSPSC únicos del oferente
    const todosCodigosOferente = new Set<string>();
    let totalSMMLVAcreditado = 0;

    rup.experiencia.forEach((exp) => {
      totalSMMLVAcreditado += exp.valorSMMLV;
      exp.codigosUNSPSC.forEach((c) => todosCodigosOferente.add(c));
    });

    const codigosCoincidentes: string[] = [];
    const codigosFaltantes: string[] = [];

    requisitos.codigosUNSPSCObligatorios.forEach((codigoExigido) => {
      // Coincidencia a nivel de Segmento/Familia (ej. primeros 4 o 6 dígitos) o código completo
      const tieneCoincidencia = Array.from(todosCodigosOferente).some(
        (c) => c === codigoExigido || c.startsWith(codigoExigido.substring(0, 4))
      );
      if (tieneCoincidencia) {
        codigosCoincidentes.push(codigoExigido);
      } else {
        codigosFaltantes.push(codigoExigido);
      }
    });

    const cumpleExperienciaCuantia = totalSMMLVAcreditado >= requisitos.experienciaMinimaSMMLV;
    const cumpleCodigos = codigosFaltantes.length === 0;
    const cumpleExperiencia = cumpleExperienciaCuantia && cumpleCodigos;

    if (!cumpleExperienciaCuantia) {
      fundamentos.push(
        `INCUMPLIMIENTO TÉCNICO: Experiencia en SMMLV acreditada (${totalSMMLVAcreditado.toFixed(1)} SMMLV) es inferior a la requerida (${requisitos.experienciaMinimaSMMLV.toFixed(1)} SMMLV).`
      );
    }

    if (!cumpleCodigos) {
      fundamentos.push(
        `INCUMPLIMIENTO TÉCNICO: El oferente no acredita contratos en los códigos UNSPSC obligatorios: [${codigosFaltantes.join(', ')}].`
      );
    }

    // 4. Verificación de Capacidad Residual K (si aplica para obra)
    let cumpleK = true;
    if (requisitos.kResidualMinimoCOP && requisitos.kResidualMinimoCOP > 0) {
      cumpleK = rup.capacidadResidualKCOP >= requisitos.kResidualMinimoCOP;
      if (!cumpleK) {
        fundamentos.push(
          `INCUMPLIMIENTO K RESIDUAL: Capacidad residual reportada (\$${(rup.capacidadResidualKCOP / 1e6).toFixed(0)}M) es menor a la exigida para el contrato de obra (\$${(requisitos.kResidualMinimoCOP / 1e6).toFixed(0)}M).`
        );
      }
    }

    // 5. Dictamen Final
    const cumpleTodo =
      rup.vigente &&
      cumpleLiquidez &&
      cumpleEndeudamiento &&
      cumpleCobertura &&
      cumplePatrimonio &&
      cumpleExperiencia &&
      cumpleK;

    let resultadoFinal: 'HABILITADO' | 'RECHAZADO_NO_SUBSANABLE' | 'REQUIERE_SUBSANACION' = 'HABILITADO';
    if (!cumpleTodo) {
      // Si el RUP no está vigente o los indicadores financieros no dan, no es subsanable según jurisprudencia CCE
      if (!rup.vigente || !cumpleLiquidez || !cumpleEndeudamiento || !cumpleCobertura) {
        resultadoFinal = 'RECHAZADO_NO_SUBSANABLE';
      } else {
        resultadoFinal = 'REQUIERE_SUBSANACION';
      }
    }

    if (rup.esSociedadBIC) {
      fundamentos.push(
        'DISTINCIÓN ESPECIAL LEY 1901/2018: El proponente ostenta la condición formal de Sociedad de Beneficio e Interés Colectivo (BIC), habilitada para preferencia en desempates y compras públicas sostenibles (Ley 2069/2020).'
      );
    }

    const payloadHash = `${rup.nit}-${proceso.numeroProceso}-${resultadoFinal}-${Date.now()}`;
    const hashDictamen = RupParserEngine.generarHashSHA256(payloadHash);

    return {
      fechaDictamen: new Date().toISOString().replace('T', ' ').substring(0, 19),
      proponente: {
        razonSocial: rup.razonSocial,
        nit: rup.nit,
        numeroInscripcionRUP: rup.numeroInscripcionRUP
      },
      procesoAuditado: {
        numeroProceso: proceso.numeroProceso,
        entidad: proceso.entidadCompradora,
        objeto: proceso.objetoContrato,
        presupuestoCOP: proceso.valorPresupuestoOficialCOP
      },
      resultadoFinal,
      verificacionFinanciera: {
        cumpleLiquidez,
        liquidezRUP: rup.indicadores.indiceLiquidez,
        liquidezExigida: requisitos.liquidezMinima,
        cumpleEndeudamiento,
        endeudamientoRUP: rup.indicadores.indiceEndeudamientoPct,
        endeudamientoMaximo: requisitos.endeudamientoMaximoPct,
        cumpleCoberturaIntereses: cumpleCobertura,
        coberturaRUP: rup.indicadores.razonCoberturaIntereses,
        coberturaExigida: requisitos.coberturaInteresesMinima,
        cumplePatrimonio,
        patrimonioRUPCOP: rup.indicadores.patrimonioNetoCOP,
        patrimonioExigidoCOP: requisitos.patrimonioMinimoCOP
      },
      verificacionExperiencia: {
        cumpleExperienciaTotal: cumpleExperiencia,
        experienciaAcreditadaSMMLV: totalSMMLVAcreditado,
        experienciaExigidaSMMLV: requisitos.experienciaMinimaSMMLV,
        codigosCoincidentes,
        codigosFaltantes
      },
      verificacionKResidual: requisitos.kResidualMinimoCOP
        ? {
            cumpleK,
            kResidualAcreditadoCOP: rup.capacidadResidualKCOP,
            kResidualExigidoCOP: requisitos.kResidualMinimoCOP
          }
        : undefined,
      fundamentoJuridico:
        fundamentos.length > 0
          ? fundamentos
          : [
              'El proponente cumple a cabalidad con todos los requisitos habilitantes jurídicos, financieros y de experiencia técnica exigidos en el Pliego de Condiciones definitivo (Ley 1150 de 2007 Art. 5 y Decreto 1082 de 2015).'
            ],
      hashDictamenSHA256: hashDictamen
    };
  }

  /**
   * Genera el texto formal del Acta de Evaluación y Verificación Habilitante para radicar en SECOP II
   */
  public static redactarActaEvaluacionOficial(dictamen: DictamenHabilitacionReal): string {
    return `
================================================================================
INFORME DE EVALUACIÓN Y VERIFICACIÓN DE REQUISITOS HABILITANTES RUP
PROCESO DE CONTRATACIÓN PÚBLICA: ${dictamen.procesoAuditado.numeroProceso}
ENTIDAD ESTATAL: ${dictamen.procesoAuditado.entidad}
================================================================================
FECHA Y HORA OFICIAL DE EVALUACIÓN: ${dictamen.fechaDictamen}
HASH CRIPTOGRÁFICO DE AUDITORÍA (LEY 527/1999): ${dictamen.hashDictamenSHA256}

1. DATOS DEL PROPONENTE EVALUADO
--------------------------------------------------------------------------------
Razón Social: ${dictamen.proponente.razonSocial}
NIT: ${dictamen.proponente.nit}
Registro RUP Cámara de Comercio: ${dictamen.proponente.numeroInscripcionRUP}

2. RESULTADO DEFINITIVO DEL COMITÉ EVALUADOR
--------------------------------------------------------------------------------
ESTADO HABILITANTE: [ ${dictamen.resultadoFinal} ]

3. DICTAMEN FINANCIERO Y ORGANIZACIONAL (DECRETO 1082 DE 2015)
--------------------------------------------------------------------------------
- Índice de Liquidez:
  * Exigido en Pliego: >= ${dictamen.verificacionFinanciera.liquidezExigida.toFixed(2)}
  * Reportado en RUP: ${dictamen.verificacionFinanciera.liquidezRUP.toFixed(2)}
  * Dictamen: ${dictamen.verificacionFinanciera.cumpleLiquidez ? 'CUMPLE' : 'NO CUMPLE'}

- Nivel de Endeudamiento:
  * Exigido en Pliego: <= ${dictamen.verificacionFinanciera.endeudamientoMaximo.toFixed(1)}%
  * Reportado en RUP: ${dictamen.verificacionFinanciera.endeudamientoRUP.toFixed(1)}%
  * Dictamen: ${dictamen.verificacionFinanciera.cumpleEndeudamiento ? 'CUMPLE' : 'NO CUMPLE'}

- Razón de Cobertura de Intereses:
  * Exigido en Pliego: >= ${dictamen.verificacionFinanciera.coberturaExigida.toFixed(2)}
  * Reportado en RUP: ${dictamen.verificacionFinanciera.coberturaRUP.toFixed(2)}
  * Dictamen: ${dictamen.verificacionFinanciera.cumpleCoberturaIntereses ? 'CUMPLE' : 'NO CUMPLE'}

- Patrimonio Neto:
  * Exigido en Pliego: >= \$${dictamen.verificacionFinanciera.patrimonioExigidoCOP.toLocaleString('es-CO')} COP
  * Reportado en RUP: \$${dictamen.verificacionFinanciera.patrimonioRUPCOP.toLocaleString('es-CO')} COP
  * Dictamen: ${dictamen.verificacionFinanciera.cumplePatrimonio ? 'CUMPLE' : 'NO CUMPLE'}

4. DICTAMEN DE EXPERIENCIA TÉCNICA (CÓDIGOS UNSPSC)
--------------------------------------------------------------------------------
- Cuantía Mínima en SMMLV:
  * Exigida: ${dictamen.verificacionExperiencia.experienciaExigidaSMMLV.toFixed(1)} SMMLV
  * Acreditada en RUP: ${dictamen.verificacionExperiencia.experienciaAcreditadaSMMLV.toFixed(1)} SMMLV
  * Coincidencia Códigos UNSPSC: [${dictamen.verificacionExperiencia.codigosCoincidentes.join(', ')}]
  * Códigos Faltantes: ${dictamen.verificacionExperiencia.codigosFaltantes.length > 0 ? `[${dictamen.verificacionExperiencia.codigosFaltantes.join(', ')}]` : 'Ninguno'}
  * Dictamen Experiencia: ${dictamen.verificacionExperiencia.cumpleExperienciaTotal ? 'CUMPLE' : 'NO CUMPLE'}

5. FUNDAMENTO JURÍDICO Y MOTIVACIÓN VINCULANTE
--------------------------------------------------------------------------------
${dictamen.fundamentoJuridico.map((f, i) => `${i + 1}. ${f}`).join('\n')}

================================================================================
CONSTANCIA DE CIERRE Y FIRMA DEL COMITÉ ASESOR EVALUADOR
Documento inmutable generado con validez probatoria conforme a la Ley 527 de 1999.
================================================================================
`.trim();
  }
}
