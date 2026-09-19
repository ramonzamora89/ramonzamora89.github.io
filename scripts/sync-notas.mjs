#!/usr/bin/env node
/**
 * Obsidian → src/content/notas
 *
 * Copia al sitio SOLO las notas marcadas con `publicar: true` en el frontmatter.
 * Es una lista blanca a propósito: el vault tiene reuniones, material de
 * clientes y borradores, y una lista negra fallaría en silencio el día que se
 * cree una carpeta nueva.
 *
 * Corre en local, no en GitHub Actions: el vault no está en el repositorio.
 * Por eso el Markdown resultante se versiona dentro del proyecto.
 *
 *   npm run sync-notas             # copia
 *   npm run sync-notas -- --seco   # solo dice qué haría
 */

import { readdir, readFile, writeFile, mkdir, rm, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, extname, basename, dirname } from 'node:path';
import { homedir } from 'node:os';

const VAULT = process.env.OBSIDIAN_VAULT ?? join(homedir(), 'Documents', 'Obsidian Vault');
const DESTINO = new URL('../src/content/notas/', import.meta.url).pathname;
const ADJUNTOS = new URL('../public/img/notas/', import.meta.url).pathname;
const SECO = process.argv.includes('--seco');
const IGNORAR = new Set(['.obsidian', '.trash', '.git', 'node_modules', '.DS_Store']);

/** Frontmatter YAML mínimo: clave: valor, y listas con guion. Sin dependencias. */
function leerFrontmatter(texto) {
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { datos: {}, cuerpo: texto };
  const datos = {};
  let claveLista = null;
  for (const linea of m[1].split(/\r?\n/)) {
    const enLista = linea.match(/^\s*-\s+(.*)$/);
    if (enLista && claveLista) { datos[claveLista].push(limpiar(enLista[1])); continue; }
    const par = linea.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!par) continue;
    const [, clave, bruto] = par;
    if (bruto === '') { claveLista = clave; datos[clave] = []; continue; }
    claveLista = null;
    datos[clave] = limpiar(bruto);
  }
  return { datos, cuerpo: m[2] };
}

const limpiar = (v) => {
  const s = v.trim().replace(/^["']|["']$/g, '');
  if (s === 'true') return true;
  if (s === 'false') return false;
  return s;
};

const aSlug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function* recorrer(dir) {
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) yield* recorrer(ruta);
    else if (extname(entrada.name) === '.md') yield ruta;
  }
}

async function indexarAdjuntos(dir, cache) {
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) await indexarAdjuntos(ruta, cache);
    else if (/\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(entrada.name)) cache.set(entrada.name, ruta);
  }
}

async function main() {
  if (!existsSync(VAULT)) {
    console.error(`No encuentro el vault en ${VAULT}.`);
    console.error('Define OBSIDIAN_VAULT=/ruta/al/vault si está en otro lugar.');
    process.exit(1);
  }

  // 1. Recoger las notas marcadas para publicar.
  const publicables = [];
  for await (const ruta of recorrer(VAULT)) {
    const texto = await readFile(ruta, 'utf8');
    const { datos, cuerpo } = leerFrontmatter(texto);
    if (datos.publicar !== true) continue;
    const slug = aSlug(datos.slug || datos.titulo || basename(ruta, '.md'));
    publicables.push({ ruta, datos, cuerpo, slug, idioma: datos.idioma === 'en' ? 'en' : 'es' });
  }

  if (publicables.length === 0) {
    console.log('Ninguna nota tiene `publicar: true`. No hay nada que copiar.');
    console.log('Para publicar una, añade esto al frontmatter de la nota en Obsidian:\n');
    console.log('  ---\n  publicar: true\n  titulo: Título de la nota\n  fecha: 2026-09-19\n  idioma: es\n  ---\n');
    return;
  }

  const slugsPublicados = new Set(publicables.map((n) => n.slug));
  const indiceAdjuntos = new Map();
  await indexarAdjuntos(VAULT, indiceAdjuntos);

  // 2. Escribir. Se vacía el destino primero: lo que ya no lleva `publicar: true`
  //    tiene que desaparecer del sitio, no quedarse colgado.
  if (!SECO) {
    await rm(DESTINO, { recursive: true, force: true });
    await mkdir(join(DESTINO, 'es'), { recursive: true });
    await mkdir(join(DESTINO, 'en'), { recursive: true });
    await mkdir(ADJUNTOS, { recursive: true });
  }

  for (const nota of publicables) {
    let cuerpo = nota.cuerpo;

    // Adjuntos ![[imagen.png]] → /img/notas/imagen.png
    const adjuntos = [...cuerpo.matchAll(/!\[\[([^\]|]+?)(\|[^\]]*)?\]\]/g)];
    for (const [entero, nombre] of adjuntos) {
      const origen = indiceAdjuntos.get(nombre.trim());
      const destinoRel = `/img/notas/${aSlug(basename(nombre, extname(nombre)))}${extname(nombre)}`;
      if (origen && !SECO) await copyFile(origen, join(ADJUNTOS, basename(destinoRel)));
      cuerpo = cuerpo.replace(entero, origen ? `![](${destinoRel})` : '');
      if (!origen) console.warn(`  ⚠ adjunto no encontrado: ${nombre}`);
    }

    // Wikilinks [[nota]] o [[nota|texto]]. Si el destino no está publicado,
    // se queda como texto plano: un enlace a 404 es peor que no tener enlace.
    cuerpo = cuerpo.replace(/\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, destino, alias) => {
      const slug = aSlug(destino);
      const texto = alias ?? destino;
      return slugsPublicados.has(slug) ? `[${texto}](/notes/${slug}/)` : texto;
    });

    const frontmatter = [
      '---',
      `titulo: ${JSON.stringify(nota.datos.titulo ?? basename(nota.ruta, '.md'))}`,
      `fecha: ${nota.datos.fecha ?? (await stat(nota.ruta)).mtime.toISOString().slice(0, 10)}`,
      `idioma: ${nota.idioma}`,
      nota.datos.resumen ? `resumen: ${JSON.stringify(nota.datos.resumen)}` : null,
      `origen: ${JSON.stringify(relative(VAULT, nota.ruta))}`,
      '---',
      '',
    ].filter(Boolean).join('\n');

    const salida = join(DESTINO, nota.idioma, `${nota.slug}.md`);
    if (!SECO) {
      await mkdir(dirname(salida), { recursive: true });
      await writeFile(salida, frontmatter + cuerpo.trimStart() + '\n');
    }
    console.log(`${SECO ? '[seco] ' : ''}${nota.idioma}/${nota.slug}.md  ←  ${relative(VAULT, nota.ruta)}`);
  }

  console.log(`\n${publicables.length} nota(s)${SECO ? ' se copiarían' : ' copiadas'}.`);
  if (!SECO) console.log('Revisa el resultado con `npm run dev` antes de hacer commit.');
}

main().catch((e) => { console.error(e); process.exit(1); });
