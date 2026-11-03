// Sugiere la plataforma transaccional según la entidad, el régimen y el objeto. Es una sugerencia: el usuario la confirma o la cambia.
import type { IdPlataforma } from '../domain/plataformas';

export interface DatosPlataforma {
  nombreEntidad?: string;
  tipoEntidad?: string;
  regimen: 'LEY_80' | 'MANUAL_PROPIO' | 'MULTILATERAL';
  modalidad?: string;
}

const sin = (t = '') => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export interface Sugerencia { id: IdPlataforma; motivo: string }

export function sugerirPlataforma(d: DatosPlataforma): Sugerencia {
  const nombre = sin(d.nombreEntidad);
  const tipo = sin(d.tipoEntidad);
  const modalidad = sin(d.modalidad);

  if (modalidad.includes('acuerdo marco')) return { id: 'TVEC', motivo: 'La modalidad es Acuerdo Marco de Precios.' };
  if (d.regimen === 'MULTILATERAL') return { id: 'MULTILATERAL', motivo: 'Recursos de un organismo multilateral.' };
  // Ecopetrol publica sus compras en SAP Ariba (portal de proveedores de Ecopetrol); Cenit es su filial (inferido).
  if (/ecopetrol|cenit/.test(nombre)) return { id: 'SAP_ARIBA', motivo: 'Ecopetrol y su grupo gestionan compras en SAP Ariba.' };
  if (/concesion|autopista|\b4g\b|\b5g\b/.test(nombre)) return { id: 'SAP_ARIBA', motivo: 'Concesionario o contratante corporativo.' };
  if (tipo.includes('servicios publicos') || /\b(isa|epm|geb)\b|grupo energia|triple a|acueducto/.test(nombre)) {
    return { id: 'SUPLOS', motivo: 'Empresa de servicios públicos (Ley 142). Sugerencia sin confirmar: verifica la plataforma real.' };
  }
  if (tipo.includes('e.s.e') || tipo.includes('universitari')) return { id: 'PORTAL_PROPIO', motivo: 'Manual propio (salud o educación superior).' };
  if (d.regimen === 'MANUAL_PROPIO') return { id: 'PORTAL_PROPIO', motivo: 'Régimen de manual propio.' };
  return { id: 'SECOP_II', motivo: 'Entidad del Estatuto General.' };
}
