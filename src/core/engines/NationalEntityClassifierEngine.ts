// Motor Dinámico Nacional de Clasificación y Detección de Régimen Institucional de Colombia
// Conectividad en vivo con SECOP II (Datos Abiertos Colombia) + Inferencia Heurística Soberana (Alcance 1.103 municipios y 32 departamentos)
import { patronLikeSoql, urlConsultaSocrata } from '../seguridad/entradaSegura';

export interface EntidadOficialDinamica {
  nombreCompleto: string;
  nit: string;
  tipoEntidad: string;
  municipio: string;
  departamento: string;
  dane: string;
  categoriaLey617: string;
  regimenLegalSugerido: 'LEY_80' | 'MANUAL_PROPIO';
  topesContratacion: string;
  estampillas: string;
  analisisJuridico: string;
  origenDatos: 'SECOP_II_EN_VIVO' | 'INFERENCIA_NACIONAL';
}

export class NationalEntityClassifierEngine {
  private static readonly SOCRATA_ENDPOINT = 'https://www.datos.gov.co/resource/jbjy-vk9h.json';

  // Directorio representativo de los 32 departamentos de Colombia para parsing territorial
  private static readonly DEPARTAMENTOS_COLOMBIA = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
    'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
    'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
    'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

  /**
   * Normaliza textos removiendo tildes y caracteres diacríticos
   */
  public static normalizar(txt: string): string {
    return (txt || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Clasifica e infiere soberanamente el régimen jurídico de CUALQUIER entidad de Colombia
   */
  public static clasificarEntidad(nombre: string, deptoSugerido = '', ciudadSugerida = '', nitSugerido = ''): EntidadOficialDinamica {
    const nNorm = this.normalizar(nombre);

    // 1. Detección territorial
    let depto = deptoSugerido || 'Colombia';
    let muni = ciudadSugerida || 'Territorio Nacional';

    if (depto === 'Colombia') {
      for (const d of this.DEPARTAMENTOS_COLOMBIA) {
        if (nNorm.includes(this.normalizar(d))) {
          depto = d;
          break;
        }
      }
    }

    // 2. Clasificación jurídica universal según normativa colombiana
    // CASO A: Empresas de Servicios Públicos Domiciliarios (E.S.P.)
    const esEsp =
      nNorm.includes('electrificadora') ||
      nNorm.includes('electro') ||
      nNorm.includes('energia') ||
      nNorm.includes('servicios publicos') ||
      nNorm.includes('e.s.p') ||
      nNorm.includes('esp') ||
      nNorm.includes('acueducto') ||
      nNorm.includes('alcantarillado') ||
      nNorm.includes('aseo') ||
      nNorm.includes('gas') ||
      nNorm.includes('telecomunicaciones') ||
      nNorm.includes('epm') ||
      nNorm.includes('ceibas');

    if (esEsp) {
      return {
        nombreCompleto: nombre.trim(),
        nit: nitSugerido || 'Oficial en verificación',
        tipoEntidad: 'Empresa de Servicios Públicos Domiciliarios (E.S.P.)',
        municipio: muni,
        departamento: depto,
        dane: 'Territorial',
        categoriaLey617: 'Sector Servicios Públicos Domiciliarios (Ley 142 de 1994)',
        regimenLegalSugerido: 'MANUAL_PROPIO',
        topesContratacion: 'Según Manual Interno de Contratación de la E.S.P. (Derecho Privado)',
        estampillas: 'Régimen tributario propio E.S.P. (Art. 31 Ley 142/94)',
        analisisJuridico:
          'Por disposición taxativa del Artículo 31 de la Ley 142 de 1994 y la Ley 143 de 1994, las Empresas de Servicios Públicos contratan bajo las reglas del Derecho Privado y su propio Manual Interno de Contratación, garantizando agilidad y cumplimiento de los principios de la función administrativa (Art. 209 C.P.).',
        origenDatos: 'INFERENCIA_NACIONAL'
      };
    }

    // CASO B: Empresas Sociales del Estado (E.S.E. - Sector Salud)
    const esEse =
      nNorm.includes('e.s.e') ||
      nNorm.includes('ese') ||
      nNorm.includes('hospital') ||
      nNorm.includes('centro de salud') ||
      nNorm.includes('clinica');

    if (esEse) {
      return {
        nombreCompleto: nombre.trim(),
        nit: nitSugerido || 'Oficial en verificación',
        tipoEntidad: 'Empresa Social del Estado (E.S.E. - Salud)',
        municipio: muni,
        departamento: depto,
        dane: 'Salud',
        categoriaLey617: 'Sector Salud y Seguridad Social (Ley 100 de 1993)',
        regimenLegalSugerido: 'MANUAL_PROPIO',
        topesContratacion: 'Manual Interno de Contratación E.S.E. (Acuerdo de Junta Directiva)',
        estampillas: 'Estampilla Pro-Hospitales y Pro-Salud',
        analisisJuridico:
          'En virtud del Artículo 195 de la Ley 100 de 1993, las Empresas Sociales del Estado se rigen por el Derecho Privado en materia de contratación, aplicando su Manual Interno de Contratación.',
        origenDatos: 'INFERENCIA_NACIONAL'
      };
    }

    // CASO C: Universidades Públicas (Ley 30 de 1992)
    const esUniversidad =
      nNorm.includes('universidad') ||
      nNorm.includes('colegio mayor') ||
      nNorm.includes('instituto tecnologico');

    if (esUniversidad) {
      return {
        nombreCompleto: nombre.trim(),
        nit: nitSugerido || 'Oficial en verificación',
        tipoEntidad: 'Ente Universitario Autónomo (Educación Superior)',
        municipio: muni,
        departamento: depto,
        dane: 'Educación',
        categoriaLey617: 'Educación Superior Pública (Ley 30 de 1992)',
        regimenLegalSugerido: 'MANUAL_PROPIO',
        topesContratacion: 'Estatuto General de Contratación expedido por el Consejo Superior',
        estampillas: 'Estampilla Pro-Universidad',
        analisisJuridico:
          'Bajo el principio constitucional de autonomía universitaria y el Artículo 57 de la Ley 30 de 1992, las universidades públicas contratan mediante su propio Estatuto de Contratación.',
        origenDatos: 'INFERENCIA_NACIONAL'
      };
    }

    // CASO D: Corporaciones Autónomas Regionales (CAR)
    const esCar =
      nNorm.includes('corporacion autonoma') ||
      nNorm.includes('car') ||
      nNorm.includes('cam') ||
      nNorm.includes('cvc') ||
      nNorm.includes('cdmb') ||
      nNorm.includes('corpo');

    if (esCar) {
      return {
        nombreCompleto: nombre.trim(),
        nit: nitSugerido || 'Oficial en verificación',
        tipoEntidad: 'Corporación Autónoma Regional (CAR)',
        municipio: muni,
        departamento: depto,
        dane: 'Ambiental',
        categoriaLey617: 'Ente Corporativo Autónomo Regional (Ley 99 de 1993)',
        regimenLegalSugerido: 'LEY_80',
        topesContratacion: 'Menor cuantía: según presupuesto anual aprobado por Consejo Directivo',
        estampillas: 'Estampillas Departamentales aplicables',
        analisisJuridico:
          'Al ser una Corporación Autónoma Regional (Ley 99 de 1993), sus compras se rigen vinculantemente por el Estatuto General de Contratación (Ley 80 de 1993 y Ley 1150 de 2007).',
        origenDatos: 'INFERENCIA_NACIONAL'
      };
    }

    // CASO E: Alcaldías y Entidades Territoriales Municipales / Distritales
    const esMunicipio =
      nNorm.includes('alcaldia') ||
      nNorm.includes('municipio') ||
      nNorm.includes('distrito');

    if (esMunicipio) {
      return {
        nombreCompleto: nombre.trim(),
        nit: nitSugerido || 'Oficial en verificación',
        tipoEntidad: 'Entidad Territorial Municipal / Distrital',
        municipio: muni,
        departamento: depto,
        dane: 'Municipal',
        categoriaLey617: 'Categorización municipal según Ley 617 de 2000',
        regimenLegalSugerido: 'LEY_80',
        topesContratacion: 'Menor y Mínima cuantía calculada según presupuesto anual (Ley 1150 Art. 2)',
        estampillas: 'Pro-Cultura (1.5% - 2%) • Pro-Adulto Mayor (2% - 4%) • Estampillas Municipales',
        analisisJuridico:
          'Como entidad territorial del orden municipal, sus procesos contractuales se rigen de manera obligatoria por la Ley 80 de 1993, la Ley 1150 de 2007 y el Decreto 1082 de 2015.',
        origenDatos: 'INFERENCIA_NACIONAL'
      };
    }

    // CASO F: Gobernaciones y Departamentos
    const esDepto =
      nNorm.includes('gobernacion') ||
      nNorm.includes('departamento de');

    if (esDepto) {
      return {
        nombreCompleto: nombre.trim(),
        nit: nitSugerido || 'Oficial en verificación',
        tipoEntidad: 'Entidad Territorial Departamental',
        municipio: muni,
        departamento: depto,
        dane: 'Departamental',
        categoriaLey617: 'Categorización Departamental (Ley 617 de 2000)',
        regimenLegalSugerido: 'LEY_80',
        topesContratacion: 'Menor y Mínima cuantía según presupuesto departamental',
        estampillas: 'Estatuto de Rentas Departamental (Pro-Desarrollo, Pro-Electrificación, Pro-Cultura)',
        analisisJuridico:
          'Como entidad territorial de nivel intermedio, sus procesos se rigen por el Estatuto General de Contratación de la Administración Pública (Ley 80 / 1150).',
        origenDatos: 'INFERENCIA_NACIONAL'
      };
    }

    // CASO G: Entidades Nacionales / Ministerios / Agencias
    return {
      nombreCompleto: nombre.trim(),
      nit: nitSugerido || 'Oficial en verificación',
      tipoEntidad: 'Entidad Pública del Orden Nacional o Territorial',
      municipio: muni,
      departamento: depto,
      dane: 'Nacional',
      categoriaLey617: 'Nivel Central / Descentralizado',
      regimenLegalSugerido: 'LEY_80',
      topesContratacion: 'Según presupuesto oficial asignado en Ley Anual de Presupuesto',
      estampillas: 'Deducciones tributarias nacionales y distritales aplicables',
      analisisJuridico:
        'Aplica el Estatuto General de Contratación de la Administración Pública (Leyes 80 de 1993, 1150 de 2007 y Decreto 1082 de 2015).',
      origenDatos: 'INFERENCIA_NACIONAL'
    };
  }

  /**
   * Búsqueda en vivo en Datos Abiertos Colombia (SECOP II) con fallback heurístico nacional
   */
  public static async buscarEntidadesNacionalesEnVivo(termino: string): Promise<EntidadOficialDinamica[]> {
    const qLimpia = termino.trim();
    if (!qLimpia) return [];

    const resultados: EntidadOficialDinamica[] = [];

    // 1. Siempre creamos la entidad inferida a partir del término exacto del usuario
    const entidadInferida = this.clasificarEntidad(qLimpia);
    resultados.push(entidadInferida);

    // 2. Consulta en vivo a la API Socrata de Datos Abiertos de SECOP II
    try {
      // Sin `distinct`: obliga al portal a recorrer todo el conjunto y la consulta se vence.
      // Se piden más filas y los repetidos se quitan aquí (máximo 8 entidades).
      const url = urlConsultaSocrata(this.SOCRATA_ENDPOINT, {
        $select: 'nombre_entidad, nit_entidad, departamento, ciudad',
        $where: `upper(nombre_entidad) like upper(${patronLikeSoql(qLimpia)})`,
        $limit: 60,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // el portal a veces tarda varios segundos

      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const vistas = new Set<string>();
          const unicas = data
            .filter((row: any) => {
              if (typeof row?.nombre_entidad !== 'string') return false;
              const clave = `${this.normalizar(row.nombre_entidad)}|${row.nit_entidad ?? ''}`;
              if (vistas.has(clave)) return false;
              vistas.add(clave);
              return true;
            })
            .slice(0, 8)
            .map((row: any) => ({
              ...row,
              departamento: row.departamento === 'No Definido' ? undefined : row.departamento,
              ciudad: row.ciudad === 'No Definido' ? undefined : row.ciudad,
            }));
          unicas.forEach((row: any) => {
            if (row.nombre_entidad) {
              const clasificada = this.clasificarEntidad(
                row.nombre_entidad,
                row.departamento,
                row.ciudad,
                row.nit_entidad
              );
              clasificada.origenDatos = 'SECOP_II_EN_VIVO';
              // Evitar duplicado con la inferida si tienen nombre muy similar
              if (this.normalizar(clasificada.nombreCompleto) !== this.normalizar(entidadInferida.nombreCompleto)) {
                resultados.push(clasificada);
              } else {
                // Enriquecer la inferida con los datos reales de SECOP II
                entidadInferida.nombreCompleto = row.nombre_entidad;
                entidadInferida.nit = row.nit_entidad || entidadInferida.nit;
                entidadInferida.departamento = row.departamento || entidadInferida.departamento;
                entidadInferida.municipio = row.ciudad || entidadInferida.municipio;
                entidadInferida.origenDatos = 'SECOP_II_EN_VIVO';
              }
            }
          });
        }
      }
    } catch (e) {
      // Si la red falla o está offline, la inferencia heurística nacional ya garantiza respuesta instantánea
    }

    return resultados;
  }
}
