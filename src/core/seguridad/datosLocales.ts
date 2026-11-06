// Datos guardados en este navegador: inventario y borrado total (derecho de supresión).
// ProcureSim no tiene servidor propio: todo lo que la persona escribe queda solo en este equipo.

/** Prefijos de las claves que la aplicación guarda en el almacenamiento del navegador. */
export const PREFIJOS_CLAVES_LOCALES = ['procuresim'];

interface AlmacenamientoMinimo {
  readonly length: number;
  key(indice: number): string | null;
  removeItem(clave: string): void;
}

/** Lista las claves de ProcureSim presentes en un almacenamiento. */
export function clavesDeProcureSim(almacen: AlmacenamientoMinimo): string[] {
  const claves: string[] = [];
  for (let i = 0; i < almacen.length; i++) {
    const k = almacen.key(i);
    if (k && PREFIJOS_CLAVES_LOCALES.some((p) => k.toLowerCase().startsWith(p))) claves.push(k);
  }
  return claves;
}

/**
 * Borra de este navegador todo lo que guardó ProcureSim (procesos, expedientes,
 * bitácora, alarmas, búsquedas y preferencias). Devuelve cuántas claves borró.
 */
export function borrarDatosDeEsteEquipo(
  almacenes: AlmacenamientoMinimo[] = typeof window === 'undefined' ? [] : [window.localStorage, window.sessionStorage]
): number {
  let borradas = 0;
  for (const almacen of almacenes) {
    try {
      for (const k of clavesDeProcureSim(almacen)) {
        almacen.removeItem(k);
        borradas++;
      }
    } catch {
      /* almacenamiento bloqueado por el navegador */
    }
  }
  return borradas;
}
