import { describe, expect, it } from 'vitest';
import {
  enlaceSeguro,
  leerJsonImportado,
  limpiarTermino,
  listaDeRegistros,
  literalSoql,
  patronLikeSoql,
  sanearJson,
  urlConsultaSocrata,
  MAX_TERMINO_BUSQUEDA,
} from '../src/core/seguridad/entradaSegura';
import { borrarDatosDeEsteEquipo, clavesDeProcureSim } from '../src/core/seguridad/datosLocales';
import { politicaPortatil, politicaWeb } from '../config/politica-de-seguridad.mjs';

describe('consultas SoQL', () => {
  it('duplica las comillas para que el valor no cierre el literal', () => {
    expect(literalSoql("O'Higgins")).toBe("'O''Higgins'");
    expect(literalSoql("x') OR 1=1 OR ('a'='a")).toBe("'x'') OR 1=1 OR (''a''=''a'");
  });

  it('el patrón LIKE queda encerrado en un solo literal', () => {
    const p = patronLikeSoql("obra' or 'a'='a");
    expect(p.startsWith("'%")).toBe(true);
    expect(p.endsWith("%'")).toBe(true);
    // Toda comilla interna está duplicada: no hay comillas sueltas.
    expect(p.slice(1, -1).replace(/''/g, '')).not.toContain("'");
  });

  it('quita caracteres de control y recorta el largo', () => {
    expect(limpiarTermino('a\u0000b\nc\t d')).toBe('a b c d');
    expect(limpiarTermino('x'.repeat(500)).length).toBe(MAX_TERMINO_BUSQUEDA);
    expect(limpiarTermino(42)).toBe('');
  });

  it('codifica cada parámetro para que & o # no agreguen parámetros', () => {
    const url = urlConsultaSocrata('https://www.datos.gov.co/resource/x.json', { $where: "a like '%b&$limit=99999#%'", $limit: 8 });
    expect(url).toBe("https://www.datos.gov.co/resource/x.json?%24where=a%20like%20'%25b%26%24limit%3D99999%23%25'&%24limit=8");
    expect(new URL(url).searchParams.get('$limit')).toBe('8');
  });
});

describe('enlaces externos', () => {
  it('acepta https de sitios oficiales y sus subdominios', () => {
    expect(enlaceSeguro('https://community.secop.gov.co/Public/Tendering?x=1')).toBe('https://community.secop.gov.co/Public/Tendering?x=1');
    expect(enlaceSeguro('https://www.colombiacompra.gov.co/')).toBeDefined();
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'http://community.secop.gov.co/',
    'https://secop.gov.co.atacante.com/',
    'https://atacantesecop.gov.co/',
    'https://usuario:clave@community.secop.gov.co/',
    '//community.secop.gov.co/',
    'no es una url',
    '',
  ])('rechaza %s', (url) => {
    expect(enlaceSeguro(url)).toBeUndefined();
  });

  it('rechaza valores que no son texto', () => {
    expect(enlaceSeguro({ url: 'https://community.secop.gov.co' })).toBeUndefined();
    expect(enlaceSeguro(undefined)).toBeUndefined();
  });
});

describe('archivos importados', () => {
  it('elimina claves que contaminan prototipos', () => {
    const limpio = sanearJson<Record<string, unknown>>(JSON.parse('{"a":1,"__proto__":{"admin":true},"b":{"constructor":{"prototype":{"x":1}},"c":2}}'));
    expect(Object.keys(limpio)).toEqual(['a', 'b']);
    expect((limpio.b as Record<string, unknown>).c).toBe(2);
    expect(({} as Record<string, unknown>).admin).toBeUndefined();
  });

  it('rechaza archivos muy grandes, vacíos o mal formados', () => {
    expect(leerJsonImportado('{"a":1}', 4)).toBeNull();
    expect(leerJsonImportado('')).toBeNull();
    expect(leerJsonImportado('{no es json')).toBeNull();
    expect(leerJsonImportado(123)).toBeNull();
  });

  it('rechaza anidamiento excesivo', () => {
    const profundo = '['.repeat(100) + ']'.repeat(100);
    expect(leerJsonImportado(profundo)).toBeNull();
  });

  it('solo deja registros con id de texto', () => {
    const lista = listaDeRegistros([{ id: 'P-1' }, { id: 5 }, null, 'x', { nombre: 'sin id' }, { id: '' }]);
    expect(lista).toEqual([{ id: 'P-1' }]);
    expect(listaDeRegistros('no es lista')).toBeNull();
  });
});

describe('borrado de datos de este equipo', () => {
  const almacen = (inicial: Record<string, string>) => {
    const datos = new Map(Object.entries(inicial));
    return {
      get length() {
        return datos.size;
      },
      key: (i: number) => Array.from(datos.keys())[i] ?? null,
      removeItem: (k: string) => void datos.delete(k),
      datos,
    };
  };

  it('borra todas las claves de ProcureSim y deja las ajenas', () => {
    const a = almacen({
      'procuresim-storage-v3': '{}',
      'procuresim-alarmas-v1': '{}',
      'procuresim-oportunidades-v1': '{}',
      procuresim_sound_enabled: 'true',
      'otra-app': 'x',
    });
    expect(clavesDeProcureSim(a)).toHaveLength(4);
    expect(borrarDatosDeEsteEquipo([a])).toBe(4);
    expect(Array.from(a.datos.keys())).toEqual(['otra-app']);
  });
});

describe('política de seguridad de contenido', () => {
  it('la versión web no permite scripts de terceros ni en línea', () => {
    const p = politicaWeb();
    expect(p).toContain("script-src 'self'");
    expect(p).not.toMatch(/script-src[^;]*(unsafe-inline|unsafe-eval|https:)/);
    expect(p).toContain("object-src 'none'");
    expect(p).toContain("base-uri 'self'");
    expect(p).toContain('connect-src \'self\' https://www.datos.gov.co');
    expect(p).not.toContain('googleapis');
  });

  it('la versión portátil solo autoriza el script por su huella', () => {
    const p = politicaPortatil(['sha256-abc=']);
    expect(p).toContain("script-src 'sha256-abc='");
    expect(p).toContain("default-src 'none'");
    expect(p).not.toContain('unsafe-eval');
  });
});
