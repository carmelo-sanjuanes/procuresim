// Motor de Exportación de Expedientes en Estándar Internacional OCDS (Open Contracting Data Standard)
// Conforme a los lineamientos de la Open Contracting Partnership y Colombia Compra Eficiente
import type { ProcesoContratacion } from '../domain/types';

export interface OcdsReleasePackage {
  uri: string;
  version: string;
  publishedDate: string;
  publisher: {
    name: string;
    scheme: string;
    uid: string;
    uri: string;
  };
  license: string;
  publicationPolicy: string;
  releases: {
    ocid: string;
    id: string;
    date: string;
    tag: string[];
    initiationType: string;
    buyer: {
      id: string;
      name: string;
    };
    planning: {
      budget: {
        id: string;
        description: string;
        amount: {
          amount: number;
          currency: string;
        };
      };
      rationale: string;
    };
    tender: {
      id: string;
      title: string;
      description: string;
      status: string;
      procurementMethod: string;
      procurementMethodDetails: string;
      value: {
        amount: number;
        currency: string;
      };
      items: {
        id: string;
        classification: {
          scheme: string;
          id: string;
          description: string;
        };
        quantity: number;
        unit: {
          name: string;
        };
      }[];
    };
    awards: {
      id: string;
      title: string;
      status: string;
      date: string;
      value: {
        amount: number;
        currency: string;
      };
      suppliers: {
        id: string;
        name: string;
      }[];
    }[];
  }[];
}

export class OcdsExportEngine {
  /**
   * Genera el Release Package oficial en JSON según el estándar OCDS 1.1
   */
  public static generarReleasePackageOCDS(proceso: ProcesoContratacion): OcdsReleasePackage {
    const ocid = `ocds-b5fd17-${proceso.numeroProceso.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const fechaIso = new Date().toISOString();

    const awards = proceso.ofertasPresentadas
      .filter((o) => o.esGanador)
      .map((o) => ({
        id: `AWD-${o.id}`,
        title: `Adjudicación del proceso ${proceso.numeroProceso}`,
        status: 'active',
        date: fechaIso,
        value: {
          amount: o.valorEconomicoTotal,
          currency: 'COP'
        },
        suppliers: [
          {
            id: o.proponente?.nit || 'NIT-00',
            name: o.proponente?.razonSocial || 'Adjudicatario'
          }
        ]
      }));

    return {
      uri: `https://datos.gov.co/ocds/package/${ocid}`,
      version: '1.1',
      publishedDate: fechaIso,
      publisher: {
        name: 'Agencia Nacional de Contratación Pública - Colombia Compra Eficiente (CCE)',
        scheme: 'CO-NIT',
        uid: '900547053-1',
        uri: 'https://www.colombiacompra.gov.co'
      },
      license: 'https://creativecommons.org/licenses/by/4.0/',
      publicationPolicy: 'https://www.colombiacompra.gov.co/transparencia/politica-datos-abiertos',
      releases: [
        {
          ocid,
          id: `REL-${proceso.id}-${Date.now().toString().slice(-4)}`,
          date: fechaIso,
          tag: ['tender', 'award', 'contract'],
          initiationType: 'tender',
          buyer: {
            id: proceso.entidad?.nit || '899999061-9',
            name: proceso.entidad?.nombre || 'Entidad Contratante'
          },
          planning: {
            budget: {
              id: proceso.cdpNumero || 'CDP-2025-01',
              description: 'Presupuesto oficial asignado para el objeto contractual',
              amount: {
                amount: proceso.presupuestoOficial,
                currency: 'COP'
              }
            },
            rationale: proceso.justificacion || proceso.objeto
          },
          tender: {
            id: proceso.id,
            title: proceso.numeroProceso,
            description: proceso.objeto,
            status: proceso.estado.toLowerCase(),
            procurementMethod: proceso.modalidad.toLowerCase(),
            procurementMethodDetails: proceso.modalidad.replace(/_/g, ' '),
            value: {
              amount: proceso.presupuestoOficial,
              currency: 'COP'
            },
            items: proceso.items.map((it) => ({
              id: it.id,
              classification: {
                scheme: 'UNSPSC',
                id: it.codigoUNSPSC,
                description: it.descripcionUNSPSC
              },
              quantity: it.cantidad,
              unit: {
                name: it.unidadMedida
              }
            }))
          },
          awards
        }
      ]
    };
  }

  /**
   * Descarga el archivo JSON estructurado del expediente OCDS
   */
  public static descargarArchivoJSON(proceso: ProcesoContratacion): void {
    const pkg = this.generarReleasePackageOCDS(proceso);
    const jsonStr = JSON.stringify(pkg, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OCDS_Release_${proceso.numeroProceso.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Genera y descarga un CSV tabular compatible con PowerBI y Excel
   */
  public static descargarCSVTabular(proceso: ProcesoContratacion): void {
    const headers = [
      'OCID',
      'Numero_Proceso',
      'Entidad',
      'NIT_Entidad',
      'Modalidad',
      'Presupuesto_COP',
      'Estado',
      'Item_UNSPSC',
      'Item_Cantidad',
      'Ofertas_Recibidas'
    ];

    const fila = [
      `ocds-b5fd17-${proceso.numeroProceso}`,
      `"${proceso.numeroProceso}"`,
      `"${proceso.entidad?.nombre || ''}"`,
      `"${proceso.entidad?.nit || ''}"`,
      `"${proceso.modalidad}"`,
      proceso.presupuestoOficial,
      `"${proceso.estado}"`,
      `"${proceso.items[0]?.codigoUNSPSC || ''}"`,
      proceso.items[0]?.cantidad || 1,
      proceso.ofertasPresentadas.length
    ];

    const csvContent = `${headers.join(',')}\n${fila.join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dataset_SECOP_OCDS_${proceso.numeroProceso.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
