import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatosAbiertosSocrataEngine } from '../src/core/engines/DatosAbiertosSocrataEngine';
import { DynamicMarketSupplierEngine, departamentoSecop2 } from '../src/core/engines/DynamicMarketSupplierEngine';
import { NationalEntityClassifierEngine } from '../src/core/engines/NationalEntityClassifierEngine';
import { Secop2LiveConnectorEngine } from '../src/core/engines/Secop2LiveConnectorEngine';

// Columnas reales de los conjuntos de datos.gov.co (consultadas el 06/11/2026).
const COLUMNAS_PROCESOS = new Set([
  'entidad', 'nit_entidad', 'departamento_entidad', 'ciudad_entidad', 'referencia_del_proceso',
  'nombre_del_procedimiento', 'descripci_n_del_procedimiento', 'fase', 'fecha_de_publicacion_del',
  'precio_base', 'modalidad_de_contratacion', 'estado_del_procedimiento', 'tipo_de_contrato',
  'codigo_principal_de_categoria', 'urlproceso',
]);
const COLUMNAS_CONTRATOS = new Set([
  'nombre_entidad', 'nit_entidad', 'departamento', 'ciudad', 'descripcion_del_proceso', 'tipodocproveedor',
  'documento_proveedor', 'proveedor_adjudicado', 'referencia_del_contrato', 'estado_contrato',
  'tipo_de_contrato', 'valor_del_contrato', 'fecha_de_firma',
]);
const PALABRAS_SOQL = new Set(['upper', 'like', 'and', 'or', 'not', 'desc', 'asc', 'distinct']);

/** Identificadores de columna usados en los parámetros de una consulta SoQL. */
function columnasUsadas(url: string): string[] {
  const p = new URL(url).searchParams;
  const texto = ['$where', '$select', '$order'].map((k) => p.get(k) ?? '').join(' ');
  return (texto.replace(/'(?:[^']|'')*'/g, ' ').match(/[a-z_][a-z0-9_]*/gi) ?? []).filter(
    (w) => !PALABRAS_SOQL.has(w.toLowerCase())
  );
}

function simularRespuesta(filas: unknown[]) {
  const llamadas: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      llamadas.push(url);
      return { ok: true, status: 200, json: async () => filas } as Response;
    })
  );
  return llamadas;
}

afterEach(() => vi.unstubAllGlobals());

describe('buscadores en vivo de Datos Abiertos', () => {
  it('procesos: consulta p6dx-8zbt con columnas existentes y traduce la fila', async () => {
    const llamadas = simularRespuesta([
      { entidad: 'MUNICIPIO DE NEIVA', descripci_n_del_procedimiento: 'Obra vial', fecha_de_publicacion_del: '2026-10-01', estado_del_procedimiento: 'Publicado', precio_base: '1000' },
    ]);
    const r = await DatosAbiertosSocrataEngine.consultarProcesosEnVivo({ query: "vía O'Higgins", departamento: 'Huila', modalidad: 'Mínima' });
    expect(llamadas[0]).toContain('/resource/p6dx-8zbt.json');
    for (const c of columnasUsadas(llamadas[0])) expect(COLUMNAS_PROCESOS, c).toContain(c);
    expect(r.origen).toBe('API_EN_VIVO');
    expect(r.procesos[0]).toMatchObject({
      nombre_entidad: 'MUNICIPIO DE NEIVA',
      descripcion_del_procedimiento: 'Obra vial',
      fecha_de_publicacion_del_proceso: '2026-10-01',
      estado_del_proceso: 'Publicado',
    });
  });

  it('proveedores: consulta jbjy-vk9h, solo empresas con NIT y sin ordenar', async () => {
    const llamadas = simularRespuesta([
      { proveedor_adjudicado: 'ACS COLOMBIA', documento_proveedor: '900114373', valor_del_contrato: '16000000', departamento: 'Huila', ciudad: 'Neiva', descripcion_del_proceso: 'Compra de computadores' },
    ]);
    const r = await DynamicMarketSupplierEngine.consultarProveedoresEnVivo('suministro de computadores', 'Huila', 5);
    const url = new URL(llamadas[0]);
    expect(llamadas[0]).toContain('/resource/jbjy-vk9h.json');
    expect(url.searchParams.get('$where')).toContain("tipodocproveedor='NIT'");
    expect(url.searchParams.get('$where')).toContain("departamento='Huila'");
    expect(url.searchParams.has('$order')).toBe(false);
    for (const c of columnasUsadas(llamadas[0])) expect(COLUMNAS_CONTRATOS, c).toContain(c);
    expect(r[0]).toMatchObject({ nombre: 'ACS COLOMBIA', nit: '900114373', municipio: 'Neiva', valorHistoricoReferenciaCOP: 16000000, origen: 'SECOP_II_EN_VIVO' });
  });

  it('departamento: se traduce al nombre exacto del portal o se omite', () => {
    expect(departamentoSecop2('HUILA')).toBe('Huila');
    expect(departamentoSecop2('atlantico')).toBe('Atlántico');
    expect(departamentoSecop2('Bogotá D.C.')).toBe('Distrito Capital de Bogotá');
    expect(departamentoSecop2('San Andrés')).toBe('San Andrés, Providencia y Santa Catalina');
    expect(departamentoSecop2('Colombia')).toBeUndefined();
    expect(departamentoSecop2('Territorio Nacional')).toBeUndefined();
    expect(departamentoSecop2("Huila' or '1'='1")).toBeUndefined();
  });

  it('entidades: consulta jbjy-vk9h sin distinct y quita los repetidos', async () => {
    const fila = { nombre_entidad: 'PERSONERIA MUNICIPAL DE NEIVA', nit_entidad: '800251264', departamento: 'Huila', ciudad: 'No Definido' };
    const llamadas = simularRespuesta([fila, fila, { ...fila, nombre_entidad: 'CONCEJO MUNICIPAL DE NEIVA' }]);
    const r = await NationalEntityClassifierEngine.buscarEntidadesNacionalesEnVivo('neiva');
    expect(llamadas[0]).toContain('/resource/jbjy-vk9h.json');
    expect(new URL(llamadas[0]).searchParams.get('$select')).not.toMatch(/distinct/i);
    for (const c of columnasUsadas(llamadas[0])) expect(COLUMNAS_CONTRATOS, c).toContain(c);
    const enVivo = r.filter((e) => e.origenDatos === 'SECOP_II_EN_VIVO');
    expect(enVivo.map((e) => e.nombreCompleto)).toEqual(['PERSONERIA MUNICIPAL DE NEIVA', 'CONCEJO MUNICIPAL DE NEIVA']);
  });

  it('conector SECOP II: consulta p6dx-8zbt con columnas existentes y lee la entidad', async () => {
    const llamadas = simularRespuesta([
      { entidad: 'HOSPITAL UNIVERSITARIO', nit_entidad: '891180268', nombre_del_procedimiento: 'Dotación', referencia_del_proceso: 'HU-001', urlproceso: { url: 'https://community.secop.gov.co/Public/Tendering/x' } },
    ]);
    const r = await Secop2LiveConnectorEngine.consultarSecop2EnVivo('hospital');
    expect(llamadas[0]).toContain('/resource/p6dx-8zbt.json');
    for (const c of columnasUsadas(llamadas[0])) expect(COLUMNAS_PROCESOS, c).toContain(c);
    expect(r[0]).toMatchObject({ entidadCompradora: 'HOSPITAL UNIVERSITARIO', nitEntidad: '891180268', objetoContrato: 'Dotación', numeroProceso: 'HU-001' });
    expect(r[0].urlSecop2).toBe('https://community.secop.gov.co/Public/Tendering/x');
  });
});
