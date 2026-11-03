// Entidades Ficticias Realistas de Contratación Pública y Privada
import { EntidadContratante } from '../core/domain/types';

export const ENTIDADES_DEMO: EntidadContratante[] = [
  {
    id: 'ENT-01',
    nombre: 'Alcaldía Municipal de San Pedro del Valle',
    nit: '891.900.450-1',
    orden: 'TERRITORIAL_MUNICIPAL',
    municipio: 'San Pedro',
    departamento: 'Valle del Cauca',
    direccion: 'Carrera 4 No. 5-20, Plaza Principal',
    representanteLegal: 'Dra. María Jimena Hurtado Cárdenas',
    cargoRepresentante: 'Alcaldesa Municipal',
    ordenadorGasto: 'Dra. María Jimena Hurtado Cárdenas',
    telefono: '(602) 256-8800',
    email: 'contratacion@sanpedro-valle.gov.co'
  },
  {
    id: 'ENT-02',
    nombre: 'Hospital Regional San Rafael E.S.E.',
    nit: '890.399.123-5',
    orden: 'TERRITORIAL_DEPARTAMENTAL',
    municipio: 'Tunja',
    departamento: 'Boyacá',
    direccion: 'Avenida Universitaria No. 18-45',
    representanteLegal: 'Dr. Germán Alonso Becerra Silva',
    cargoRepresentante: 'Gerente General',
    ordenadorGasto: 'Dr. Germán Alonso Becerra Silva',
    telefono: '(608) 742-3000',
    email: 'juridica@hospitalsanrafael.gov.co'
  },
  {
    id: 'ENT-03',
    nombre: 'Ministerio de Innovación y Tecnología (Ficticio)',
    nit: '800.189.920-9',
    orden: 'NACIONAL',
    municipio: 'Bogotá D.C.',
    departamento: 'Cundinamarca',
    direccion: 'Edificio Murillo Toro, Carrera 8 entre Calles 12 y 13',
    representanteLegal: 'Dr. Andrés Felipe Quintana Rosas',
    cargoRepresentante: 'Secretario General',
    ordenadorGasto: 'Dr. Andrés Felipe Quintana Rosas',
    telefono: '(601) 344-3460',
    email: 'procesos@mininnovacion.gov.co'
  },
  {
    id: 'ENT-04',
    nombre: 'Grupo Empresarial Andino S.A. (Corporativo Privado)',
    nit: '860.002.508-4',
    orden: 'PRIVADO',
    municipio: 'Medellín',
    departamento: 'Antioquia',
    direccion: 'Carrera 43A No. 1A Sur - 143, Edificio Santillana',
    representanteLegal: 'Ing. Roberto Gómez Londoño',
    cargoRepresentante: 'Director de Abastecimiento & Compras',
    ordenadorGasto: 'Ing. Roberto Gómez Londoño',
    telefono: '(604) 319-8000',
    email: 'procurement@grupoandino.com'
  }
];
