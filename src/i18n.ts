export const IDIOMAS = ['en', 'es'] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const IDIOMA_POR_DEFECTO: Idioma = 'en';

/** Mapa de rutas. La clave es la misma en los dos idiomas: así el selector
 *  lleva a la página equivalente y no a la portada. */
export const RUTAS = {
  inicio:  { en: '/',       es: '/es/' },
  cv:      { en: '/cv/',    es: '/es/cv/' },
  trabajo: { en: '/work/',  es: '/es/trabajo/' },
  sobre:   { en: '/about/', es: '/es/sobre/' },
  notas:   { en: '/notes/', es: '/es/notas/' },
} as const;

export type ClaveRuta = keyof typeof RUTAS;

export const ruta = (clave: ClaveRuta, idioma: Idioma) => RUTAS[clave][idioma];

/** Dada la URL actual, devuelve su equivalente en el otro idioma. */
export function rutaAlterna(pathname: string, destino: Idioma): string {
  const actual = pathname.endsWith('/') ? pathname : `${pathname}/`;
  for (const clave of Object.keys(RUTAS) as ClaveRuta[]) {
    for (const idioma of IDIOMAS) {
      if (RUTAS[clave][idioma] === actual) return RUTAS[clave][destino];
    }
  }
  // Fichas de proyecto y notas: se resuelven en la propia página, que conoce
  // su par. Si llegamos aquí, el destino seguro es la portada.
  return RUTAS.inicio[destino];
}

export const NOMBRE_IDIOMA: Record<Idioma, string> = { en: 'English', es: 'Español' };

export const UI = {
  en: {
    navInicio: 'Home',
    navCv: 'CV',
    navTrabajo: 'Work',
    navSobre: 'About',
    navNotas: 'Notes',
    menu: 'Menu',
    cerrar: 'Close',
    saltar: 'Skip to content',
    cambiarIdioma: 'Ver en español',
    verCv: 'Read the CV',
    verTrabajo: 'See the work',
    descargarCv: 'Download as PDF',
    imprimirCv: 'Print / save as PDF',
    trayectoria: 'Trajectory',
    trayectoriaPie: 'Overlapping roles, 2010 to today. Each bar links to its entry in the CV.',
    seleccion: 'Selected work',
    seleccionPie: 'Eight pieces. The full list of repositories lives on GitHub.',
    experiencia: 'Experience',
    educacion: 'Education',
    formacionAdicional: 'Further training',
    publicaciones: 'Publications',
    audiovisual: 'Film',
    especializacion: 'Areas of focus',
    herramientas: 'Tools',
    idiomas: 'Languages',
    intereses: 'Interests',
    contacto: 'Contact',
    contactoTexto: 'Open to roles in product, research and media. The fastest way to reach me is email.',
    elProblema: 'The problem',
    loQueHice: 'What I did',
    elResultado: 'The result',
    rol: 'Role',
    periodo: 'Period',
    organizaciones: 'With',
    volverTrabajo: 'All work',
    siguientePieza: 'Next',
    notasVacio: 'Nothing published here yet.',
    presente: 'present',
    leerMas: 'Read more',
    verPieza: 'See the project',
    todo: 'Everything',
    meInteresa: "I'm interested in…",
    noEncontrado: 'This page does not exist',
    noEncontradoTexto: 'The link may be out of date. These are the ways back in:',
  },
  es: {
    navInicio: 'Inicio',
    navCv: 'CV',
    navTrabajo: 'Trabajo',
    navSobre: 'Sobre mí',
    navNotas: 'Notas',
    menu: 'Menú',
    cerrar: 'Cerrar',
    saltar: 'Ir al contenido',
    cambiarIdioma: 'Read in English',
    verCv: 'Ver el CV',
    verTrabajo: 'Ver el trabajo',
    descargarCv: 'Descargar en PDF',
    imprimirCv: 'Imprimir / guardar en PDF',
    trayectoria: 'Trayectoria',
    trayectoriaPie: 'Puestos solapados, de 2010 a hoy. Cada barra lleva a su entrada en el CV.',
    seleccion: 'Trabajo seleccionado',
    seleccionPie: 'Ocho piezas. La lista completa de repositorios está en GitHub.',
    experiencia: 'Experiencia',
    educacion: 'Educación',
    formacionAdicional: 'Formación adicional',
    publicaciones: 'Publicaciones',
    audiovisual: 'Audiovisual',
    especializacion: 'Áreas de especialización',
    herramientas: 'Herramientas',
    idiomas: 'Idiomas',
    intereses: 'Intereses',
    contacto: 'Contacto',
    contactoTexto: 'Disponible para trabajo en producto, investigación y medios. La vía más rápida es el correo.',
    elProblema: 'El problema',
    loQueHice: 'Lo que hice',
    elResultado: 'El resultado',
    rol: 'Rol',
    periodo: 'Periodo',
    organizaciones: 'Con',
    volverTrabajo: 'Todo el trabajo',
    siguientePieza: 'Siguiente',
    notasVacio: 'Todavía no hay nada publicado aquí.',
    presente: 'presente',
    leerMas: 'Leer más',
    verPieza: 'Ver el proyecto',
    todo: 'Todo',
    meInteresa: 'Me interesa…',
    noEncontrado: 'Esta página no existe',
    noEncontradoTexto: 'Puede que el enlace esté desactualizado. Estas son las vías de vuelta:',
  },
} as const;

export const t = (idioma: Idioma) => UI[idioma];
