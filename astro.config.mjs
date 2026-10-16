// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sitio de usuario de GitHub Pages con dominio propio. ramonzamora89.github.io
// y ramonzamora.co (sin www) redirigen aquí desde GitHub.
export default defineConfig({
  site: 'https://www.ramonzamora.co',
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
  // ramonzamora.co fue un Substack. Sus URLs /p/<slug> siguen circulando,
  // así que los escritos traídos de ahí conservan su dirección vieja.
  redirects: {
    '/p/un-torbellino-de-emociones': '/es/escritos/un-torbellino-de-emociones/',
    '/p/es-una-maraton': '/es/escritos/es-una-maraton/',
    '/p/privacy-self-management-in-a-click': '/writings/privacy-self-management-in-a-click-happy-society/',
  },
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
