// Proveedores y Proponentes Ficticios con Datos RUP y Financieros Realistas
import { ProponenteDatos } from '../core/domain/types';

export const PROVEEDORES_DEMO: ProponenteDatos[] = [
  {
    id: 'PROV-01',
    tipoProponente: 'INDIVIDUAL_PERSONA_JURIDICA',
    razonSocial: 'TECNOLOGÍA & SERVICIOS DE COLOMBIA S.A.S.',
    nit: '900.829.412-3',
    representanteLegal: 'Carlos Eduardo Ramírez Peña',
    cedulaRepresentante: '79.845.120',
    direccion: 'Calle 93B No. 13-45, Of. 602',
    ciudad: 'Bogotá D.C.',
    email: 'licitaciones@tecnoservicios.com.co',
    telefono: '(601) 621-4500',
    esMiPyme: false,
    aplicaIndustriaNacional: true,
    empleadosConDiscapacidad: true,
    activoCorriente: 1450000000,
    pasivoCorriente: 620000000,
    activoTotal: 3800000000,
    pasivoTotal: 1520000000,
    patrimonio: 2280000000,
    utilidadOperacional: 420000000,
    gastosIntereses: 65000000,
    utilidadNeta: 280000000,
    experienciaRegistrada: [
      {
        consecutivoRUP: 1,
        contratante: 'Secretaría de Educación Distrital',
        objeto: 'Adquisición de equipos de cómputo y servidores para sedes educativas',
        codigosUNSPSC: ['43211500', '43211507', '43211508'],
        valorSMMLV: 850,
        fechaInicio: '2023-02-15',
        fechaFin: '2023-08-30'
      },
      {
        consecutivoRUP: 2,
        contratante: 'Gobernación de Cundinamarca',
        objeto: 'Dotación de computadores portátiles y periféricos tecnológicos',
        codigosUNSPSC: ['43211500', '43211503'],
        valorSMMLV: 620,
        fechaInicio: '2024-03-01',
        fechaFin: '2024-09-15'
      }
    ]
  },
  {
    id: 'PROV-02',
    tipoProponente: 'INDIVIDUAL_PERSONA_JURIDICA',
    razonSocial: 'INVERSIONES & SUMINISTROS NACIONALES S.A.S.',
    nit: '830.551.902-6',
    representanteLegal: 'Diana Marcela Castro Méndez',
    cedulaRepresentante: '52.489.301',
    direccion: 'Carrera 50 No. 25-18',
    ciudad: 'Medellín',
    email: 'contacto@suministrosnacionales.co',
    telefono: '(604) 380-1122',
    esMiPyme: true,
    aplicaIndustriaNacional: true,
    empleadosConDiscapacidad: false,
    activoCorriente: 680000000,
    pasivoCorriente: 340000000,
    activoTotal: 1200000000,
    pasivoTotal: 580000000,
    patrimonio: 620000000,
    utilidadOperacional: 110000000,
    gastosIntereses: 22000000,
    utilidadNeta: 68000000,
    experienciaRegistrada: [
      {
        consecutivoRUP: 1,
        contratante: 'Empresas Públicas de Medellín',
        objeto: 'Suministro de consumibles de cómputo y papelería corporativa',
        codigosUNSPSC: ['14111500', '44122000', '43211500'],
        valorSMMLV: 310,
        fechaInicio: '2023-05-10',
        fechaFin: '2023-11-20'
      }
    ]
  },
  {
    id: 'PROV-03',
    tipoProponente: 'CONSORCIO',
    razonSocial: 'CONSORCIO TECNOLÓGICO ANDINO 2025',
    nit: '901.999.888-1',
    representanteLegal: 'Ing. Fernando Tobón Morales',
    cedulaRepresentante: '98.541.220',
    direccion: 'Avenida El Dorado No. 68C-61',
    ciudad: 'Bogotá D.C.',
    email: 'consorcio.andino@gmail.com',
    telefono: '(601) 480-9900',
    esMiPyme: false,
    aplicaIndustriaNacional: true,
    empleadosConDiscapacidad: false,
    miembrosPlurales: [
      {
        nombre: 'ANDES HARDWARE SYSTEMS S.A.S.',
        nit: '900.123.456-7',
        porcentajeParticipacion: 60,
        compromisoEspecifico: 'Suministro de equipos de cómputo y soporte técnico'
      },
      {
        nombre: 'REDES & TELEMÁTICA DE OCCIDENTE LTDA.',
        nit: '890.987.654-3',
        porcentajeParticipacion: 40,
        compromisoEspecifico: 'Instalación física, configuración de red y puesta en marcha'
      }
    ],
    activoCorriente: 2100000000,
    pasivoCorriente: 890000000,
    activoTotal: 4900000000,
    pasivoTotal: 1800000000,
    patrimonio: 3100000000,
    utilidadOperacional: 580000000,
    gastosIntereses: 80000000,
    utilidadNeta: 390000000,
    experienciaRegistrada: [
      {
        consecutivoRUP: 1,
        contratante: 'Universidad Nacional de Colombia',
        objeto: 'Adquisición e instalación de centros de cómputo y laboratorios',
        codigosUNSPSC: ['43211500', '43222600'],
        valorSMMLV: 1200,
        fechaInicio: '2022-08-01',
        fechaFin: '2023-04-15'
      }
    ]
  },
  {
    id: 'PROV-04',
    tipoProponente: 'INDIVIDUAL_PERSONA_JURIDICA',
    razonSocial: 'SANJUANES SOLUCIONES S.A.S.',
    nit: '901.458.712-4',
    representanteLegal: 'Ing. Mauricio Sanjuanes Gómez',
    cedulaRepresentante: '12.145.890',
    direccion: 'Calle 46 No. 16-24, Of. 1001 (Torre Empresarial Sanjuan Plaza)',
    ciudad: 'Neiva, Huila',
    email: 'licitaciones@sanjuanessoluciones.com.co',
    telefono: '+57 315 257 6258',
    esMiPyme: true,
    aplicaIndustriaNacional: true,
    empleadosConDiscapacidad: true,
    logoUrl: '/sanjuanes/logo_sanjuanes.png',
    activoCorriente: 2350000000,
    pasivoCorriente: 880000000,
    activoTotal: 5200000000,
    pasivoTotal: 1850000000,
    patrimonio: 3350000000,
    utilidadOperacional: 520000000,
    gastosIntereses: 45000000,
    utilidadNeta: 360000000,
    experienciaRegistrada: [
      {
        consecutivoRUP: 1,
        contratante: 'Gobernación del Huila / Secretaría de Vías e Infraestructura',
        objeto: 'Consultoría técnica, estudios, diseños e interventoría integral de obras civiles',
        codigosUNSPSC: ['81101500', '81101516', '72101500', '43211500'],
        valorSMMLV: 1100,
        fechaInicio: '2022-04-10',
        fechaFin: '2023-02-28'
      },
      {
        consecutivoRUP: 2,
        contratante: 'Alcaldía de Neiva',
        objeto: 'Supervisión técnica, ingeniería de detalle y suministro de soluciones tecnológicas',
        codigosUNSPSC: ['81101500', '43211500', '43222600'],
        valorSMMLV: 750,
        fechaInicio: '2023-06-01',
        fechaFin: '2024-05-30'
      }
    ]
  },
  {
    id: 'PROV-05',
    tipoProponente: 'INDIVIDUAL_PERSONA_JURIDICA',
    razonSocial: 'INGELECGROUP S.A.S. BIC',
    nit: '901.624.819-5',
    representanteLegal: 'Ing. Luis Carlos García Martínez',
    cedulaRepresentante: '80.145.290',
    direccion: 'Carrera 15 No. 85-30, Edificio Tempo, Of. 504',
    ciudad: 'Bogotá D.C.',
    email: 'licitaciones@ingelecgroup.com.co',
    telefono: '+57 (601) 745-8920',
    esMiPyme: true,
    esSociedadBIC: true,
    aplicaIndustriaNacional: true,
    empleadosConDiscapacidad: true,
    activoCorriente: 1850000000,
    pasivoCorriente: 860000000,
    activoTotal: 3950000000,
    pasivoTotal: 1500000000,
    patrimonio: 2450000000,
    utilidadOperacional: 410000000,
    gastosIntereses: 52000000,
    utilidadNeta: 295000000,
    experienciaRegistrada: [
      {
        consecutivoRUP: 1,
        contratante: 'MINISTERIO DE MINAS Y ENERGÍA / FENOGE',
        objeto: 'Diseño, suministro, montaje e ingeniería de detalle para soluciones energéticas sostenibles y solares fotovoltaicas',
        codigosUNSPSC: ['26111600', '39121000', '81101500', '72101500'],
        valorSMMLV: 920,
        fechaInicio: '2023-01-15',
        fechaFin: '2023-11-30'
      },
      {
        consecutivoRUP: 2,
        contratante: 'EMPRESA DE TELECOMUNICACIONES DE BOGOTÁ (ETB)',
        objeto: 'Consultoría técnica, auditoría energética e infraestructura eléctrica de respaldo y telecomunicaciones',
        codigosUNSPSC: ['81101500', '81111800', '72101500'],
        valorSMMLV: 780,
        fechaInicio: '2023-08-01',
        fechaFin: '2024-06-30'
      },
      {
        consecutivoRUP: 3,
        contratante: 'ALCALDÍA MAYOR DE CARTAGENA',
        objeto: 'Adecuación de redes de distribución, eficiencia de recursos y obras de modernización con criterios de sostenibilidad BIC',
        codigosUNSPSC: ['72141100', '26111600', '81101500'],
        valorSMMLV: 550,
        fechaInicio: '2024-02-10',
        fechaFin: '2024-10-15'
      }
    ]
  }
];
