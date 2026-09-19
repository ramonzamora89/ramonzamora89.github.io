# CLAUDE.md

Sitio personal de Ramón Zamora (CV + portafolio), Astro estático bilingüe,
publicado en GitHub Pages.

Antes de tocar nada, lee [PROJECT.md](PROJECT.md): tiene las reglas de contenido
y privacidad, que pesan más que cualquier mejora técnica.

## Lo esencial

- **El contenido está en `src/data/*.json`, no en las plantillas.** Para cambiar
  un texto del CV o una pieza del portafolio se edita el JSON.
- **Los textos de interfaz están en `src/i18n.ts`**, en `UI.en` y `UI.es`. Las
  dos tablas tienen las mismas claves.
- **Las páginas de `src/pages/` son de tres líneas.** La lógica vive en
  `src/components/paginas/`, compartida por los dos idiomas. No dupliques una
  página para traducirla.
- **Ningún hex fuera de `src/styles/tokens.css`.** Si un color nuevo va a llevar
  texto encima, calcula el contraste antes: hay tokens distintos para texto sobre
  claro (`--acento-texto`) y sobre oscuro (`--acento-claro`) justamente porque el
  acento de marca no alcanza AA por sí solo.
- **Nada de datos personales sensibles en el repositorio.** Ver la regla 2 de
  PROJECT.md.
- **No hagas commit ni push sin que Moncho lo confirme.**

## Comprobaciones antes de dar algo por bueno

```bash
npm run build                      # tiene que pasar sin errores
npm run preview                    # y revisarlo en el navegador, no solo compilar
```

- Mira la página con JavaScript desactivado: todo el contenido debe leerse.
- Revisa a 390 px y a 1440 px. La línea de tiempo de la portada cambia de
  orientación a 768 px.
- Si tocas el filtro de `/work/`, comprueba que la tarjeta ancha también se
  oculta: su `display: grid` compite con `[hidden]` y por eso lleva `:not([hidden])`.
