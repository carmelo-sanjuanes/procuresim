// Casos Demo de Uniones Temporales, Consorcios y Alianzas Estratégicas
import type { AsociacionPlural } from '../core/domain/types';
import { ConsortiumEngine } from '../core/engines/ConsortiumEngine';

const miembrosUT = [
  {
    id: 'MB-01',
    razonSocial: 'TECNOLOGÍA & SERVICIOS DE COLOMBIA S.A.S.',
    nit: '900.829.412-3',
    representanteLegal: 'Carlos Eduardo Ramírez Peña',
    cedulaRepresentante: '79.845.120',
    porcentajeParticipacion: 60,
    compromisoObligaciones: 'Suministro de equipos de cómputo, servidores e integración lógica de software.',
    aportesFinancierosCOP: 270000000,
    experienciaAportadaSMMLV: 1470,
    esLider: true,
    activoCorriente: 1450000000,
    pasivoCorriente: 620000000,
    activoTotal: 3800000000,
    pasivoTotal: 1520000000,
    patrimonio: 2280000000
  },
  {
    id: 'MB-02',
    razonSocial: 'REDES & TELEMÁTICA DE OCCIDENTE LTDA.',
    nit: '890.987.654-3',
    representanteLegal: 'Ing. Fernando Tobón Morales',
    cedulaRepresentante: '98.541.220',
    porcentajeParticipacion: 40,
    compromisoObligaciones: 'Cableado estructurado, configuración de antenas WiFi y soporte presencial.',
    aportesFinancierosCOP: 180000000,
    experienciaAportadaSMMLV: 650,
    esLider: false,
    activoCorriente: 680000000,
    pasivoCorriente: 290000000,
    activoTotal: 1600000000,
    pasivoTotal: 580000000,
    patrimonio: 1020000000
  }
];

const consolidacionUT = ConsortiumEngine.calcularConsolidacion(miembrosUT);

export const ASOCIACIONES_DEMO: AsociacionPlural[] = [
  {
    id: 'ASOC-01',
    nombreAsociacion: 'UNIÓN TEMPORAL TECNOLOGÍA EDUCATIVA 2025',
    tipo: 'UNION_TEMPORAL',
    procesoVinculadoId: 'PROC-SECOP2-01',
    objetoLicitacion: 'Adquisición, dotación y puesta en marcha de equipos de cómputo y conectividad para las instituciones educativas',
    representanteDesignado: 'Carlos Eduardo Ramírez Peña',
    cedulaRepresentante: '79.845.120',
    direccionSede: 'Calle 93B No. 13-45, Of. 602',
    ciudad: 'Bogotá D.C.',
    emailNotificacion: 'notificaciones@uttecnologia.com.co',
    telefono: '(601) 621-4500',
    miembros: miembrosUT,
    porcentajeTotal: consolidacionUT.porcentajeTotal,
    esValido100Pct: consolidacionUT.esValido100Pct,
    indicadoresPonderados: consolidacionUT.indicadoresPonderados,
    documentosGenerados: []
  },
  {
    id: 'ASOC-02',
    nombreAsociacion: 'CONSORCIO INFRAESTRUCTURA Y TUBERÍAS DEL CARIBE',
    tipo: 'CONSORCIO',
    procesoVinculadoId: 'PROC-SUPLOS-01',
    objetoLicitacion: 'Suministro e instalación de tubería petrolera y válvulas de alta presión para complejo industrial',
    representanteDesignado: 'Ing. Julián David Morales',
    cedulaRepresentante: '80.123.456',
    direccionSede: 'Zona Industrial Mamonal Km 7',
    ciudad: 'Cartagena',
    emailNotificacion: 'consorcio.caribe@gmail.com',
    telefono: '(605) 668-9000',
    miembros: [
      {
        id: 'MB-03',
        razonSocial: 'INGENIERÍA & VÁLVULAS DEL VALLE S.A.S.',
        nit: '901.348.910-4',
        representanteLegal: 'Julián David Morales',
        cedulaRepresentante: '80.123.456',
        porcentajeParticipacion: 50,
        compromisoObligaciones: 'Suministro de válvulas y bridas importadas.',
        aportesFinancierosCOP: 425000000,
        experienciaAportadaSMMLV: 900,
        esLider: true,
        activoCorriente: 1800000000,
        pasivoCorriente: 750000000,
        activoTotal: 3200000000,
        pasivoTotal: 1200000000,
        patrimonio: 2000000000
      },
      {
        id: 'MB-04',
        razonSocial: 'MONTAJES INDUSTRIALES DEL CARIBE LTDA.',
        nit: '800.765.312-9',
        representanteLegal: 'Patricia Helena Vargas',
        cedulaRepresentante: '32.456.789',
        porcentajeParticipacion: 50,
        compromisoObligaciones: 'Transporte marítimo y montaje electromecánico en sitio.',
        aportesFinancierosCOP: 425000000,
        experienciaAportadaSMMLV: 850,
        esLider: false,
        activoCorriente: 1200000000,
        pasivoCorriente: 500000000,
        activoTotal: 2500000000,
        pasivoTotal: 900000000,
        patrimonio: 1600000000
      }
    ],
    porcentajeTotal: 100,
    esValido100Pct: true,
    indicadoresPonderados: {
      indiceLiquidez: 2.4,
      nivelEndeudamientoPct: 36.8,
      capitalTrabajoTotalCOP: 1750000000,
      patrimonioTotalCOP: 3600000000,
      experienciaTotalSMMLV: 1750
    },
    documentosGenerados: []
  }
];
