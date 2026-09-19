// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sitio de usuario de GitHub Pages: se sirve en la raíz del dominio.
export default defineConfig({
  site: 'https://ramonzamora89.github.io',
  trailingSlash: 'always',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      // El inglés vive en `/`, el español en `/es/`. Sin redirección
      // automática: confunde a los buscadores y falla con VPN.
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-GT' } },
    }),
  ],
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
