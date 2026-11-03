// Motor de Cascada Secuencial de Desempates Multicriterio
// Conforme al Artículo 35 de la Ley 2069 de 2020 (Ley de Emprendimiento) y Decreto 1860 de 2021
import type { ProponenteDatos } from '../domain/types';

export interface OferenteEmpatado {
  id: string;
  nombre: string;
  nit: string;
  puntajeTotal: number;
  esMipymeNacional: boolean;
  esSociedadBIC?: boolean;
  domicilioEnMunicipioEjecucion: boolean;
  vinculaMujeresVictimasViolencia: boolean;
  mujeresLiderazgoOAccionistasPct: number;
  empleadosConDiscapacidadPct: number; // Dcto 392/2018 (mínimo 10%)
  empleaPoblacionReincorporada: boolean;
  primerVezContratandoEstado: boolean;
  antiguedadRUPMeses: number;
  numeroAleatorioBalota?: number;
}

export interface CriterioDesempateEvaluado {
  orden: number;
  nombreCriterio: string;
  fundamentoLegal: string;
  aplicaDesempate: boolean;
  ganadorCriterioId?: string;
  ganadorNombre?: string;
  detalleEvaluacion: string;
}

export interface ResultadoDesempate {
  proponentesEvaluados: OferenteEmpatado[];
  ganadorDefinitivo: OferenteEmpatado;
  criterioResolutivo: CriterioDesempateEvaluado;
  trazabilidadCascada: CriterioDesempateEvaluado[];
  dictamenJuridico: string;
}

export class TieBreakEngine {
  /**
   * Ejecuta la cascada secuencial estricta de desempate según la Ley 2069 de 2020
   */
  public static resolverEmpate(
    oferentes: OferenteEmpatado[],
    opciones: { preferenciaSociedadesBicActiva?: boolean } = {}
  ): ResultadoDesempate {
    if (oferentes.length < 2) {
      throw new Error('Se requieren al menos dos proponentes empatados para aplicar el desempate.');
    }

    const trazabilidad: CriterioDesempateEvaluado[] = [];
    let candidatos = [...oferentes];

    // Criterio 1: Mipyme Nacional
    const c1Candidatos = candidatos.filter((c) => c.esMipymeNacional);
    const c1Aplica = c1Candidatos.length > 0 && c1Candidatos.length < candidatos.length;
    const crit1: CriterioDesempateEvaluado = {
      orden: 1,
      nombreCriterio: 'Preferencia Mipyme Nacional',
      fundamentoLegal: 'Art. 35 num. 1 Ley 2069 de 2020 y Dcto. 1860 de 2021',
      aplicaDesempate: c1Aplica,
      ganadorCriterioId: c1Candidatos.length === 1 ? c1Candidatos[0].id : undefined,
      ganadorNombre: c1Candidatos.length === 1 ? c1Candidatos[0].nombre : undefined,
      detalleEvaluacion: c1Aplica
        ? `Se filtran oferentes con condición Mipyme Nacional verificada (${c1Candidatos.length} proponente(s)).`
        : `Empate persiste: ${c1Candidatos.length === 0 ? 'Ningún' : 'Todos los'} oferentes son Mipyme.`
    };
    trazabilidad.push(crit1);
    if (c1Candidatos.length === 1) {
      return this.construirResultado(oferentes, c1Candidatos[0], crit1, trazabilidad);
    }
    if (c1Candidatos.length > 1) {
      candidatos = c1Candidatos;
    }

    // Criterio 2: Mipyme Local (domicilio en municipio/departamento de ejecución)
    const c2Candidatos = candidatos.filter((c) => c.domicilioEnMunicipioEjecucion);
    const c2Aplica = c2Candidatos.length > 0 && c2Candidatos.length < candidatos.length;
    const crit2: CriterioDesempateEvaluado = {
      orden: 2,
      nombreCriterio: 'Domicilio en el Territorio de Ejecución',
      fundamentoLegal: 'Art. 35 num. 2 Ley 2069 de 2020',
      aplicaDesempate: c2Aplica,
      ganadorCriterioId: c2Candidatos.length === 1 ? c2Candidatos[0].id : undefined,
      ganadorNombre: c2Candidatos.length === 1 ? c2Candidatos[0].nombre : undefined,
      detalleEvaluacion: c2Aplica
        ? `Se prefiere al proponente con domicilio registrado en el municipio/departamento de ejecución del contrato.`
        : `Ningún proponente o todos acreditan domicilio territorial.`
    };
    trazabilidad.push(crit2);
    if (c2Candidatos.length === 1) {
      return this.construirResultado(oferentes, c2Candidatos[0], crit2, trazabilidad);
    }
    if (c2Candidatos.length > 1) {
      candidatos = c2Candidatos;
    }

    // Criterio 3: Sociedades BIC (Decreto 1860 de 2021) - Calibrable vía Radar Normativo
    const bicActivo = opciones.preferenciaSociedadesBicActiva !== false;
    if (bicActivo) {
      const cBicCandidatos = candidatos.filter((c) => c.esSociedadBIC);
      const cBicAplica = cBicCandidatos.length > 0 && cBicCandidatos.length < candidatos.length;
      const critBic: CriterioDesempateEvaluado = {
        orden: trazabilidad.length + 1,
        nombreCriterio: 'Sociedades BIC (Ley 2069 / Dcto 1860 de 2021)',
        fundamentoLegal: 'Art. 35 Ley 2069 de 2020, Dcto. 1860 de 2021 y Ley 1901 de 2018',
        aplicaDesempate: cBicAplica,
        ganadorCriterioId: cBicCandidatos.length === 1 ? cBicCandidatos[0].id : undefined,
        ganadorNombre: cBicCandidatos.length === 1 ? cBicCandidatos[0].nombre : undefined,
        detalleEvaluacion: cBicAplica
          ? `Preferencia afirmativa por acreditación de Sociedad de Beneficio e Interés Colectivo (BIC) en RUES (${cBicCandidatos.length} proponente(s)).`
          : `Ningún proponente o todos acreditan condición de Sociedad BIC.`
      };
      trazabilidad.push(critBic);
      if (cBicCandidatos.length === 1) {
        return this.construirResultado(oferentes, cBicCandidatos[0], critBic, trazabilidad);
      }
      if (cBicCandidatos.length > 1) {
        candidatos = cBicCandidatos;
      }
    }

    // Criterio Siguiente: Vinculación laboral de mujeres víctimas de violencia o liderazgo de mujeres
    const c3Candidatos = candidatos.filter(
      (c) => c.vinculaMujeresVictimasViolencia || c.mujeresLiderazgoOAccionistasPct >= 50
    );
    const c3Aplica = c3Candidatos.length > 0 && c3Candidatos.length < candidatos.length;
    const critMujeres: CriterioDesempateEvaluado = {
      orden: trazabilidad.length + 1,
      nombreCriterio: 'Emprendimientos de Mujeres / Víctimas de Violencia',
      fundamentoLegal: 'Art. 35 num. 3 Ley 2069 de 2020 y Dcto. 1860 de 2021',
      aplicaDesempate: c3Aplica,
      ganadorCriterioId: c3Candidatos.length === 1 ? c3Candidatos[0].id : undefined,
      ganadorNombre: c3Candidatos.length === 1 ? c3Candidatos[0].nombre : undefined,
      detalleEvaluacion: c3Aplica
        ? `Acreditación fehaciente de mujeres en dirección (>50%) o contratación certificada de mujeres víctimas.`
        : `Empate persiste en enfoque de género.`
    };
    trazabilidad.push(critMujeres);
    if (c3Candidatos.length === 1) {
      return this.construirResultado(oferentes, c3Candidatos[0], critMujeres, trazabilidad);
    }
    if (c3Candidatos.length > 1) {
      candidatos = c3Candidatos;
    }

    // Criterio Siguiente: Vinculación laboral de personas con discapacidad (Decreto 392 de 2018)
    const c4Candidatos = candidatos.filter((c) => c.empleadosConDiscapacidadPct >= 10);
    const c4Aplica = c4Candidatos.length > 0 && c4Candidatos.length < candidatos.length;
    const critDiscapacidad: CriterioDesempateEvaluado = {
      orden: trazabilidad.length + 1,
      nombreCriterio: 'Personal con Discapacidad (>= 10%)',
      fundamentoLegal: 'Decreto 392 de 2018 y Art. 35 num. 4 Ley 2069 de 2020',
      aplicaDesempate: c4Aplica,
      ganadorCriterioId: c4Candidatos.length === 1 ? c4Candidatos[0].id : undefined,
      ganadorNombre: c4Candidatos.length === 1 ? c4Candidatos[0].nombre : undefined,
      detalleEvaluacion: c4Aplica
        ? `Certificación de vinculación de personas con discapacidad igual o superior al 10% de la planta laboral.`
        : `Ningún proponente o todos acreditan cuota laboral de discapacidad.`
    };
    trazabilidad.push(critDiscapacidad);
    if (c4Candidatos.length === 1) {
      return this.construirResultado(oferentes, c4Candidatos[0], critDiscapacidad, trazabilidad);
    }
    if (c4Candidatos.length > 1) {
      candidatos = c4Candidatos;
    }

    // Criterio Final: Sorteo de balota como última ratio
    const ganadorSorteo = [...candidatos].sort((a, b) => (b.numeroAleatorioBalota || 0) - (a.numeroAleatorioBalota || 0))[0];
    const critSorteo: CriterioDesempateEvaluado = {
      orden: trazabilidad.length + 1,
      nombreCriterio: 'Sorteo Público por Balotas (Última Instancia)',
      fundamentoLegal: 'Manual de Procedimientos de Selección de CCE / Ley 80 de 1993',
      aplicaDesempate: true,
      ganadorCriterioId: ganadorSorteo.id,
      ganadorNombre: ganadorSorteo.nombre,
      detalleEvaluacion: `Habiéndose agotado los criterios preferenciales legales sin romper el empate, se realizó sorteo de balotas en audiencia pública resultando favorecido ${ganadorSorteo.nombre}.`
    };
    trazabilidad.push(critSorteo);

    return this.construirResultado(oferentes, ganadorSorteo, critSorteo, trazabilidad);
  }

  private static construirResultado(
    todos: OferenteEmpatado[],
    ganador: OferenteEmpatado,
    criterioResolutivo: CriterioDesempateEvaluado,
    trazabilidad: CriterioDesempateEvaluado[]
  ): ResultadoDesempate {
    return {
      proponentesEvaluados: todos,
      ganadorDefinitivo: ganador,
      criterioResolutivo,
      trazabilidadCascada: trazabilidad,
      dictamenJuridico: `De conformidad con el Artículo 35 de la Ley 2069 de 2020 y el Decreto 1860 de 2021, la adjudicación se realiza en favor de ${ganador.nombre} (NIT ${ganador.nit}), habiéndose acreditado el criterio resolutivo #${criterioResolutivo.orden}: "${criterioResolutivo.nombreCriterio}".`
    };
  }
}
