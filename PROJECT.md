# PROJECT — Sitio personal de Ramón Zamora

Guía de trabajo. Para la estructura técnica, ver [README.md](README.md).

## Reglas

1. **Los dos idiomas dicen lo mismo.** El contenido vive en `src/data/*.json` con
   campos `es` y `en`. Si se añade un campo a uno, se añade al otro en el mismo
   commit. El CV tiene dos archivos: `cv.es.json` es la fuente, `cv.en.json` es
   su traducción.
2. **Nada personal y sensible entra al repositorio.** Ni teléfono, ni direcciones,
   ni fecha de nacimiento, ni documentos migratorios, ni los datos de contacto de
   las referencias profesionales. El contacto público son los dos correos,
   LinkedIn y GitHub, y están en `src/data/perfil.json`.
3. **La fecha de #ZamoraLibre es 2022**, no 2025. `CV_Ramon_Zamora.md` dice 2025,
   pero zamoralibre.com fecha la detención el 29 de julio de 2022 y otras
   versiones del CV dicen «2022–presente». Si se regenera el JSON desde el
   Markdown, hay que volver a corregirlo.
4. **Ninguna cifra sin respaldo.** Los únicos números duros del sitio son los que
   están documentados: 11 medios en CAIMA (con la meta de llegar a 20 a
   finales de 2026, dicha como meta y no como logro) y el crecimiento de suscripciones de elPeriódico, que se cita
   con la misma cautela del CV («un registro profesional reporta…»). No se
   redondean hacia arriba ni se inventan porcentajes.
5. **Solo se muestra trabajo publicable.** Queda fuera lo que está protegido con
   contraseña o cifrado, y los análisis de redes sobre personas identificables.
6. **Colores y medidas solo como variables** en `src/styles/tokens.css`. Ningún
   hex fuera de ese archivo. `--acento` (#d1452a) es gráfico: para texto chico
   sobre fondo claro se usa `--acento-texto`, y sobre fondo oscuro
   `--acento-claro`, porque el acento por sí solo no alcanza el contraste AA.
   Para una banda roja de fondo se usa `--acento-fondo`, no `--acento`.
7. **Todo se lee sin JavaScript.** Las animaciones son un extra que se añade
   encima; `prefers-reduced-motion` se respeta siempre.
8. **Git:** commits en español que explican el porqué. Solo se hace commit o push
   cuando Moncho lo confirma.

## Tareas frecuentes

### Añadir o cambiar un puesto en el CV

En `src/data/cv.es.json` y `cv.en.json`, dentro de `experiencia`:

```json
{
  "id": "identificador-sin-espacios",
  "organizacion": "Nombre completo",
  "corto": "Nombre corto para la línea de tiempo",
  "cargo": "Cargo",
  "periodo": "2024–presente",
  "tramos": [[2024, 2026]],
  "pieza": "id-de-proyectos.json",
  "enlace": "https://…",
  "puntos": ["…"]
}
```

- `tramos` son los años que dibuja la línea de tiempo de la portada. Un puesto
  con dos etapas lleva dos: `[[2018, 2019], [2025, 2026]]`.
- `corto` es lo que se ve dentro de la barra. Si el nombre completo no cabe en
  su rango de años, queda cortado: por eso existe este campo.
- `id` es el ancla a la que enlaza la barra (`/cv/#id`). No se cambia una vez
  publicado, porque rompe enlaces.
- El rango de la línea de tiempo se calcula solo a partir de `tramos`. Un puesto
  nuevo más antiguo o más reciente ensancha la retícula sin tocar nada más.

### Añadir una pieza al portafolio

En `src/data/proyectos.json`. Los campos `titulo`, `tipo`, `etiqueta`, `resumen`,
`problema`, `resultado` y `slug` llevan `es` y `en`; `trabajo` lleva una lista en
cada idioma, y las dos deben tener el mismo número de puntos.

- `destacado: true` la saca también en la portada.
- La primera pieza de `/work/` se dibuja ancha, a dos columnas.
- `captura: true` significa que existe `public/img/piezas/<id>.webp`. Con
  `capturaPorIdioma: true` son dos: `<id>-es.webp` y `<id>-en.webp`, para piezas
  cuya imagen tiene texto, como la carátula de una charla dada en los dos idiomas. Si
  `captura` es `false`, la tarjeta dibuja un panel oscuro con el periodo en grande, que es
  mejor que una imagen prestada o una caja vacía.
- `etiqueta` alimenta el desplegable de `/work/`. Una etiqueta nueva aparece sola
  en el filtro.

### Actualizar la captura de un proyecto

1. Abre el sitio en una ventana de navegador ancha (1500 px o más).
2. Captura la pantalla completa.
3. Recorta a 16:9 desde la esquina superior izquierda y guarda a 1200×675 en
   WebP con calidad 84, en `public/img/piezas/<id>.webp`.

El recorte se ancla arriba a la izquierda (`object-position: left top`), así que
lo importante tiene que estar en esa zona.

### Regenerar el PDF del CV

El PDF sale de la misma página, con los estilos de `@media print`:

```bash
npm run build && npm run preview &
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --no-pdf-header-footer \
  --print-to-pdf="public/cv/ramon-zamora-cv-en.pdf" http://localhost:4321/cv/
"$CHROME" --headless=new --no-pdf-header-footer \
  --print-to-pdf="public/cv/ramon-zamora-cv-es.pdf" http://localhost:4321/es/cv/
```

Chrome headless a veces no termina solo: si se queda colgado tras escribir el
archivo, se corta con Ctrl-C. También sirve imprimir `/cv/` desde el navegador
(Ctrl+P → Guardar como PDF): la página ya no tiene botón para eso, por decisión
de Moncho, pero los estilos de impresión siguen ahí.

### Cambiar la tipografía de los títulos

Todos los titulares salen de `--display`, en `src/styles/tokens.css`. Cambiarla
es una línea, más las caras `@font-face` en `src/styles/fonts.css` y la
precarga en `src/layouts/Base.astro`.

Hoy es **Poppins** (600 y 700, estáticas, autoalojadas): geométrica de bowls
circulares, lo más cercano a Bauhaus 93 que existe con licencia libre. No es un
clon: Bauhaus 93 tiene ascendentes mucho más cortas. Las otras candidatas que
probé fueron Comfortaa (más redonda, terminaciones suaves), Unbounded (más
display y ancha) y Jost (revival de Futura, más sobrio).

Si se cambia, hay que revisar la escala: la escala de `--h0`/`--h1`/`--h2` está
calibrada para una geométrica en peso 700, que pesa bastante más que una serif
ligera al mismo cuerpo. Con otra fuente casi seguro habrá que reajustarla.

El serif (Newsreader) se quedó donde es texto editorial —resúmenes de las
piezas, el resultado de cada ficha, el valor del filtro de `/work/`— y Archivo
en interfaz, versalitas y cuerpo.

### Añadir un idioma o una página

Las rutas viven en `RUTAS`, dentro de `src/i18n.ts`, y los textos de interfaz en
`UI`. Las dos tablas tienen que tener exactamente las mismas claves: si falta
una, el sitio compila y el texto sale vacío, que es peor que un error.

## Pendientes conocidos

- **Revisar a ojo los PDF del CV.** Se regeneraron el 16 de octubre de 2026
  (cambió CAIMA) con Chrome headless en Windows, pero nadie los abrió. Ver que
  la tipografía, los saltos de página y la entrada de CAIMA salgan bien.
- **Revisar el sitio en el navegador a 390 px y a 1440 px**, con y sin
  JavaScript. Los cambios de octubre de 2026 (Escritos, Tomo la Palabra,
  carátulas por idioma, botón del CV) solo se verificaron en el HTML generado.

- **La foto de perfil es de 400×400** (`public/img/ramon-zamora.jpg`). Se ve
  suave en pantallas retina. Hay una de 1744×1736 en
  `~/Documents/UNFPA/CVs/Ramón Zamora.jpg`.
- **La línea de tiempo ya no muestra por separado** la coordinación del
  Laboratorio de Innovación Social (2020–2023): está unificada dentro del puesto
  de UVG, que va de 2017 a hoy, por decisión de Moncho.
- **Kronika no tiene ficha propia**, por decisión de Moncho: es el paraguas
  institucional de CAIMA y él no es cofundador. Aparece dentro de la ficha y la
  entrada del CV de CAIMA, donde su rol es fundador y curador de la colección.
