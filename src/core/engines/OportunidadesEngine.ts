// Buscador de oportunidades: arma la consulta a los datos abiertos de SECOP II y puntúa cada resultado contra el perfil y tus datos.
import type { PerfilBusqueda, Oportunidad, Puntuada } from '../domain/oportunidades';
import { MODALIDADES_BUSQUEDA } from '../domain/oportunidades';
import { num } from './VendoEngine';

export const DATASET_SECOP2 = 'https://www.datos.gov.co/resource/p6dx-8zbt.json';
const q = (t: string) => `'${t.replace(/'/g, "''")}'`;
const lista = (t: string) => t.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean);
const digitos = (t: string) => t.replace(/\D/g, '');
const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

export const codigosDe = (t: string) => lista(t).map(digitos).filter((x) => x.length >= 2);

export function hoyISO(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function restarDias(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const f = new Date(y, m - 1, d - n);
  return hoyISO(f);
}

export function construirConsulta(p: PerfilBusqueda, hoy = hoyISO()): string {
  const w: string[] = ["estado_de_apertura_del_proceso='Abierto'", "estado_del_procedimiento in('Publicado','Abierto')"];
  w.push(`fecha_de_publicacion_del>='${restarDias(hoy, p.dias)}T00:00:00'`);
  const mods = MODALIDADES_BUSQUEDA.filter((m) => p.modalidades.includes(m.id)).flatMap((m) => m.valores);
  if (mods.length) w.push(`modalidad_de_contratacion in(${mods.map(q).join(',')})`);
  if (p.departamentos.length) w.push(`departamento_entidad in(${p.departamentos.map(q).join(',')})`);
  const min = num(p.presupuestoMin), max = num(p.presupuestoMax);
  if (Number.isFinite(min) && min > 0) w.push(`precio_base>=${Math.round(min)}`);
  if (Number.isFinite(max) && max > 0) w.push(`precio_base<=${Math.round(max)}`);
  const cods = codigosDe(p.codigos).map((c) => `starts_with(codigo_principal_de_categoria,${q('V1.' + c)})`);
  const pals = lista(p.palabras).map((k) => sinTildes(k)).filter(Boolean).map((k) => `(upper(nombre_del_procedimiento) like ${q('%' + k + '%')} OR upper(descripci_n_del_procedimiento) like ${q('%' + k + '%')})`);
  const amplio = [...cods, ...pals];
  if (amplio.length) w.push(`(${amplio.join(' OR ')})`);
  for (const x of lista(p.excluir).map(sinTildes)) w.push(`NOT upper(nombre_del_procedimiento) like ${q('%' + x + '%')}`);
  const params = new URLSearchParams({
    $select: 'id_del_proceso,referencia_del_proceso,entidad,nombre_del_procedimiento,descripci_n_del_procedimiento,fase,codigo_principal_de_categoria,precio_base,modalidad_de_contratacion,departamento_entidad,fecha_de_publicacion_del,urlproceso',
    $where: w.join(' AND '),
    $order: 'fecha_de_publicacion_del DESC',
    $limit: '150'
  });
  return `${DATASET_SECOP2}?${params.toString()}`;
}

type Crudo = Record<string, unknown>;
export function normalizarRegistro(r: Crudo): Oportunidad {
  const url = (r.urlproceso as { url?: string } | undefined)?.url || '';
  const s = (k: string) => (typeof r[k] === 'string' ? (r[k] as string) : '');
  return {
    id: s('id_del_proceso') || s('referencia_del_proceso') || url,
    plataforma: 'SECOP II', entidad: s('entidad'), objeto: s('nombre_del_procedimiento'), referencia: s('referencia_del_proceso'),
    codigo: s('codigo_principal_de_categoria'), valor: Number(s('precio_base')) || 0, modalidad: s('modalidad_de_contratacion'), departamento: s('departamento_entidad'),
    publicada: s('fecha_de_publicacion_del').slice(0, 10), fase: s('fase'), enlace: url, origen: 'SECOP2_ABIERTO'
  };
}

export interface ContextoPuntaje { capacidadCOP?: number; textoExtra?: string }

export function puntuar(o: Oportunidad, p: PerfilBusqueda, ctx: ContextoPuntaje = {}, hoy = hoyISO()): Puntuada {
  const razones: string[] = [], alertas: string[] = [];
  let ganado = 0, maximo = 0;
  const peso = (w: number, f: number) => { maximo += w; ganado += w * f; };

  const cods = codigosDe(p.codigos);
  if (cods.length) {
    const oc = digitos(o.codigo.replace(/^V\d+\./i, ''));
    let f = 0;
    for (const c of cods) {
      if (oc.startsWith(c)) f = Math.max(f, 1);
      else if (c.length >= 4 && oc.slice(0, 4) === c.slice(0, 4)) f = Math.max(f, 0.4);
      else if (oc.slice(0, 2) === c.slice(0, 2)) f = Math.max(f, 0.1);
    }
    peso(35, f);
    if (f === 1) razones.push(`Código UNSPSC coincide (${o.codigo.replace('V1.', '')})`); else if (f >= 0.4) razones.push('Código de la misma familia');
  }
  const pals = lista(p.palabras).map(sinTildes);
  if (pals.length) {
    const t = sinTildes(`${o.objeto} ${ctx.textoExtra || ''}`);
    const hits = pals.filter((k) => t.includes(k));
    peso(25, hits.length === 0 ? 0 : hits.length === 1 ? 0.6 : 1);
    if (hits.length) razones.push(`Menciona: ${hits.join(', ').toLowerCase()}`);
  }
  if (p.departamentos.length) {
    const ok = p.departamentos.includes(o.departamento);
    peso(10, ok ? 1 : 0);
    if (ok) razones.push(`En ${o.departamento}`);
  }
  const min = num(p.presupuestoMin), max = num(p.presupuestoMax);
  const topeCap = ctx.capacidadCOP && ctx.capacidadCOP > 0 ? ctx.capacidadCOP : NaN;
  if (o.valor <= 0) {
    alertas.push('Presupuesto no definido en el aviso: ábrelo para verlo');
    peso(15, 0.3);
  } else {
    const dentro = (!Number.isFinite(min) || o.valor >= min) && (!Number.isFinite(max) || o.valor <= max);
    if (Number.isFinite(topeCap) && o.valor > topeCap) { alertas.push(`Supera tu capacidad (≈ $ ${Math.round(topeCap).toLocaleString('es-CO')})`); peso(15, 0.2); }
    else { peso(15, dentro ? 1 : 0.3); if (dentro && (Number.isFinite(min) || Number.isFinite(max) || Number.isFinite(topeCap))) razones.push('Valor dentro de tu rango'); }
  }
  const edad = Math.max(0, Math.round((Date.parse(hoy) - Date.parse(o.publicada)) / 86_400_000));
  peso(10, edad <= 7 ? 1 : edad <= 21 ? 0.7 : edad <= 45 ? 0.4 : 0.2);
  if (edad <= 7) razones.push('Publicada esta semana');
  if (/directa|régimen especial/i.test(o.modalidad)) alertas.push('Modalidad no competitiva en general: confirma si recibe ofertas');
  if (o.origen === 'SECOP2_ABIERTO') alertas.push('La fecha de cierre no viene en los datos abiertos: confírmala en el proceso');

  const puntaje = maximo === 0 ? 0 : Math.round((ganado / maximo) * 100);
  return { ...o, puntaje, razones, alertas, nueva: !p.vistas.includes(o.id) };
}

export const etiquetaPuntaje = (n: number) => (n >= 70 ? 'Alta' : n >= 45 ? 'Media' : 'Baja');
