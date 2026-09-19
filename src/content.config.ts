import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Notas traídas desde Obsidian por scripts/sync-notas.mjs.
 *  La colección puede estar vacía: el sitio se construye igual. */
const notas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notas' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    idioma: z.enum(['es', 'en']),
    resumen: z.string().optional(),
    origen: z.string().optional(),
  }),
});

export const collections = { notas };
