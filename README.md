# ramonzamora89.github.io

Sitio personal de Ramón Zamora: CV y portafolio, bilingüe inglés/español.
Sitio estático construido con [Astro](https://astro.build) y publicado en GitHub Pages.

## Poner en marcha

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm run preview    # sirve dist/ para revisar lo que se va a publicar
npm run sync-notas # trae notas desde Obsidian (ver abajo)
```

Requiere Node 22.19 o superior.

## Rutas

El inglés vive en la raíz y el español bajo `/es/`.

| Inglés | Español | Archivo |
|---|---|---|
| `/` | `/es/` | `src/components/paginas/Inicio.astro` |
| `/cv/` | `/es/cv/` | `src/components/paginas/Cv.astro` |
| `/work/` | `/es/trabajo/` | `src/components/paginas/Trabajo.astro` |
| `/work/<slug>/` | `/es/trabajo/<slug>/` | `src/components/paginas/Pieza.astro` |
| `/about/` | `/es/sobre/` | `src/components/paginas/Sobre.astro` |
| `/notes/` | `/es/notas/` | `src/components/paginas/Notas.astro` |

Los archivos dentro de `src/pages/` son de tres líneas: solo eligen el idioma y
llaman al componente compartido. Así las dos versiones no se pueden desincronizar.

## Dónde está cada cosa

```
src/
  data/
    cv.es.json  cv.en.json    Trayectoria, educación, publicaciones
    proyectos.json            Las 8 piezas del portafolio, con campos es/en
    perfil.json               Contacto, enlaces, titular
  content/notas/{es,en}/      Notas traídas desde Obsidian
  i18n.ts                     Mapa de rutas y todos los textos de interfaz
  styles/
    tokens.css                Colores y medidas. Ningún hex vive fuera de aquí
    base.css                  Base, componentes compartidos, impresión
    fonts.css                 Archivo y Newsreader, autoalojadas
  components/                 Cabecera, Pie, Trayectoria, TarjetaPieza
  layouts/Base.astro          <head>, hreflang, Open Graph, revelado al scroll
public/
  fonts/                      6 archivos .woff2 (variables, licencia OFL)
  img/piezas/                 Capturas de los proyectos, 1200×675 WebP
  cv/                         PDF del CV en los dos idiomas
scripts/sync-notas.mjs        Obsidian → src/content/notas
```

## Publicación

Cada `push` a `main` dispara `.github/workflows/deploy.yml`, que construye el
sitio y lo publica en GitHub Pages. No hay que subir `dist/`.

Para que funcione, en **Settings → Pages** del repositorio la fuente tiene que
estar en **GitHub Actions**.

## Notas desde Obsidian

`npm run sync-notas` recorre el vault y copia **solo** las notas que tengan
`publicar: true` en el frontmatter:

```yaml
---
publicar: true
titulo: Título de la nota
fecha: 2026-09-19
idioma: es          # es | en
resumen: Una línea que aparece en el listado.
---
```

El script convierte los `[[wikilinks]]` y copia los adjuntos `![[imagen.png]]`.
Si el destino de un wikilink no está publicado, lo deja como texto plano.

`npm run sync-notas -- --seco` dice qué haría sin escribir nada.

Si el vault no está en `~/Documents/Obsidian Vault`, se indica con
`OBSIDIAN_VAULT=/ruta node scripts/sync-notas.mjs`.

La sección «Notas» solo aparece en el menú cuando hay al menos una nota
publicada en ese idioma.

## Mantenimiento

Las reglas de trabajo están en [PROJECT.md](PROJECT.md).
