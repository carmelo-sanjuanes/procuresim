// Motor de la Tienda Virtual del Estado Colombiano (TVEC) & Acuerdos Marco de Precios (AMP)
// Conforme al Decreto 1082 de 2015 (Art. 2.2.1.2.1.2.7) y Guías de Colombia Compra Eficiente
export interface ItemCatalogoAMP {
  id: string;
  acuerdoMarcoId: string;
  nombreAcuerdoMarco: string;
  codigoUNSPSC: string;
  categoria: 'TECNOLOGIA_NUBE' | 'COMPUTO_PERIFERICOS' | 'VEHICULOS' | 'DOTACION' | 'COMBUSTIBLE' | 'ASEO_CAFETERIA';
  descripcionProducto: string;
  especificacionesTecnicas: string;
  unidadMedida: string;
  precioTechoUnitarioCOP: number;
  proveedoresAdjudicatarios: {
    proveedorId: string;
    nombreProveedor: string;
    nit: string;
    precioCotizadoUnitarioCOP: number;
    tiempoEntregaDias: number;
    coberturaNacional: boolean;
  }[];
}

export interface OrdenCompraTVEC {
  numeroOrden: string;
  acuerdoMarco: string;
  entidadCompradora: string;
  nitEntidad: string;
  proveedorSeleccionado: string;
  nitProveedor: string;
  fechaEmision: string;
  fechaEntregaMaxima: string;
  itemsAdquiridos: {
    producto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
  subtotal: number;
  ivaCOP: number;
  totalCOP: number;
  estado: 'GENERADA' | 'EN_REVISION' | 'APROBADA_CCE' | 'DESPACHADA';
}

export class TvecCatalogEngine {
  public static readonly ACUERDOS_MARCO_VIGENTES: ItemCatalogoAMP[] = [
    {
      id: 'AMP-COMPUTO-01',
      acuerdoMarcoId: 'CCEN-AMP-2025-01',
      nombreAcuerdoMarco: 'Acuerdo Marco de Computadores y Dispositivos Periféricos IV',
      codigoUNSPSC: '43211500',
      categoria: 'COMPUTO_PERIFERICOS',
      descripcionProducto: 'Computador Portátil Corporativo Gama Media-Alta para Docentes y Servidores',
      especificacionesTecnicas: 'Pantalla 14" FHD IPS, Intel Core i5 13va gen, 16GB RAM DDR5, SSD 512GB NVMe, Batería 54Wh, Garantía 36 meses CCE.',
      unidadMedida: 'UNIDAD',
      precioTechoUnitarioCOP: 4250000,
      proveedoresAdjudicatarios: [
        {
          proveedorId: 'PROV-04',
          nombreProveedor: 'SANJUANÉS SOLUCIONES S.A.S.',
          nit: '901.458.789-1',
          precioCotizadoUnitarioCOP: 3820000,
          tiempoEntregaDias: 12,
          coberturaNacional: true
        },
        {
          proveedorId: 'PROV-AMP-01',
          nombreProveedor: 'TECNOLOGÍA & SERVICIOS DE COLOMBIA S.A.S.',
          nit: '830.124.567-3',
          precioCotizadoUnitarioCOP: 3950000,
          tiempoEntregaDias: 15,
          coberturaNacional: true
        },
        {
          proveedorId: 'PROV-AMP-02',
          nombreProveedor: 'HARDWARE & SOLUCIONES INTEGRALES S.A.',
          nit: '860.541.238-9',
          precioCotizadoUnitarioCOP: 4100000,
          tiempoEntregaDias: 18,
          coberturaNacional: true
        }
      ]
    },
    {
      id: 'AMP-NUBE-02',
      acuerdoMarcoId: 'CCEN-AMP-2025-02',
      nombreAcuerdoMarco: 'Acuerdo Marco de Servicios de Nube Pública III',
      codigoUNSPSC: '81111811',
      categoria: 'TECNOLOGIA_NUBE',
      descripcionProducto: 'Máquina Virtual Computacional Nube (4 vCPU, 16GB RAM, 200GB SSD)',
      especificacionesTecnicas: 'Instancia virtual Linux/Windows en región con alta disponibilidad 99.95%, backup diario y ancho de banda incluido.',
      unidadMedida: 'MES',
      precioTechoUnitarioCOP: 1800000,
      proveedoresAdjudicatarios: [
        {
          proveedorId: 'PROV-04',
          nombreProveedor: 'SANJUANÉS SOLUCIONES S.A.S.',
          nit: '901.458.789-1',
          precioCotizadoUnitarioCOP: 1540000,
          tiempoEntregaDias: 2,
          coberturaNacional: true
        },
        {
          proveedorId: 'PROV-AMP-03',
          nombreProveedor: 'CLOUD NATIVE COLOMBIA LTDA.',
          nit: '900.871.234-5',
          precioCotizadoUnitarioCOP: 1620000,
          tiempoEntregaDias: 3,
          coberturaNacional: true
        }
      ]
    },
    {
      id: 'AMP-VEHICULOS-03',
      acuerdoMarcoId: 'CCEN-AMP-2025-03',
      nombreAcuerdoMarco: 'Acuerdo Marco de Vehículos y Transporte Institucional',
      codigoUNSPSC: '25101503',
      categoria: 'VEHICULOS',
      descripcionProducto: 'Camioneta Doble Cabina 4x4 Diésel para Supervisión Técnica de Obras',
      especificacionesTecnicas: 'Motor turbo diésel 2.8L, tracción 4x4 con bajo, platón recubierto, barra antivuelco certificada y póliza Todo Riesgo 1 año.',
      unidadMedida: 'UNIDAD',
      precioTechoUnitarioCOP: 195000000,
      proveedoresAdjudicatarios: [
        {
          proveedorId: 'PROV-AMP-04',
          nombreProveedor: 'DISTRIBUIDORA AUTOMOTRIZ ESTATAL S.A.',
          nit: '860.012.345-6',
          precioCotizadoUnitarioCOP: 182000000,
          tiempoEntregaDias: 30,
          coberturaNacional: true
        },
        {
          proveedorId: 'PROV-AMP-05',
          nombreProveedor: 'AUTOMOTORES DEL CARIBE S.A.S.',
          nit: '890.345.678-1',
          precioCotizadoUnitarioCOP: 186500000,
          tiempoEntregaDias: 25,
          coberturaNacional: true
        }
      ]
    }
  ];

  /**
   * Ejecuta una simulación de Operación Secundaria (Evento de Cotización de Catálogo)
   */
  public static simularOperacionSecundaria(
    itemCatalogo: ItemCatalogoAMP,
    cantidad: number,
    departamentoEntrega: string = 'Bogotá D.C.'
  ): {
    mejorOferta: ItemCatalogoAMP['proveedoresAdjudicatarios'][0];
    rankingProveedores: {
      proveedor: ItemCatalogoAMP['proveedoresAdjudicatarios'][0];
      costoUnitario: number;
      fleteEstimadoCOP: number;
      costoTotalCOP: number;
      ahorroFrenteATechoCOP: number;
    }[];
    ahorroTotalEventoCOP: number;
    ahorroTotalPct: number;
  } {
    const techoTotal = itemCatalogo.precioTechoUnitarioCOP * cantidad;

    const ranking = itemCatalogo.proveedoresAdjudicatarios.map((prov) => {
      // Flete estimado según departamento
      const factorFlete = departamentoEntrega.includes('Bogotá') ? 0 : 0.02; // 2% si es fuera de Bogotá
      const flete = Math.round(prov.precioCotizadoUnitarioCOP * factorFlete);
      const costoUnitarioConFlete = prov.precioCotizadoUnitarioCOP + flete;
      const costoTotal = costoUnitarioConFlete * cantidad;
      const ahorro = techoTotal - costoTotal;

      return {
        proveedor: prov,
        costoUnitario: costoUnitarioConFlete,
        fleteEstimadoCOP: flete,
        costoTotalCOP: costoTotal,
        ahorroFrenteATechoCOP: ahorro
      };
    });

    ranking.sort((a, b) => a.costoTotalCOP - b.costoTotalCOP);

    const mejor = ranking[0];
    const ahorroTotal = techoTotal - mejor.costoTotalCOP;
    const ahorroPct = Number(((ahorroTotal / techoTotal) * 100).toFixed(2));

    return {
      mejorOferta: mejor.proveedor,
      rankingProveedores: ranking,
      ahorroTotalEventoCOP: ahorroTotal,
      ahorroTotalPct: ahorroPct
    };
  }

  /**
   * Genera el modelo formal de una Orden de Compra de la TVEC
   */
  public static generarOrdenCompra(
    itemCatalogo: ItemCatalogoAMP,
    proveedorGanador: ItemCatalogoAMP['proveedoresAdjudicatarios'][0],
    cantidad: number,
    entidadNombre: string,
    entidadNit: string
  ): OrdenCompraTVEC {
    const subtotal = proveedorGanador.precioCotizadoUnitarioCOP * cantidad;
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    return {
      numeroOrden: `OC-TVEC-${Date.now().toString().slice(-6)}`,
      acuerdoMarco: itemCatalogo.nombreAcuerdoMarco,
      entidadCompradora: entidadNombre,
      nitEntidad: entidadNit,
      proveedorSeleccionado: proveedorGanador.nombreProveedor,
      nitProveedor: proveedorGanador.nit,
      fechaEmision: new Date().toISOString().slice(0, 10),
      fechaEntregaMaxima: new Date(Date.now() + proveedorGanador.tiempoEntregaDias * 86400000)
        .toISOString()
        .slice(0, 10),
      itemsAdquiridos: [
        {
          producto: itemCatalogo.descripcionProducto,
          cantidad,
          precioUnitario: proveedorGanador.precioCotizadoUnitarioCOP,
          subtotal
        }
      ],
      subtotal,
      ivaCOP: iva,
      totalCOP: total,
      estado: 'GENERADA'
    };
  }
}
