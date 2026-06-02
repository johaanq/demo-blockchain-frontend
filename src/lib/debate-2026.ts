/**
 * Resumen del último debate presidencial (2.ª vuelta EG2026).
 * Domingo 31 de mayo de 2026 · Centro de Convenciones de Lima · JNE.
 * Fuentes: La República, RTVE, Diario de Arequipa, El Búho (demo académica).
 */
export const DEBATE_2026 = {
  date: "Domingo 31 de mayo de 2026",
  time: "20:00 (hora peruana)",
  venue: "Centro de Convenciones de Lima, San Borja",
  duration: "1 h 40 min (aprox.)",
  organizer: "Jurado Nacional de Elecciones (JNE)",
  moderatorNote:
    "Formato aprobado por el JNE: Sánchez abrió la jornada; Fujimori cerró con el mensaje final tras sorteo público del 21 de mayo.",
  headline:
    "Keiko y Sánchez cerraron campaña con duelo de propuestas a una semana del balotaje",
  lede:
    "El único debate de segunda vuelta reunió a los dos finalistas del 7 de junio ante cuatro ejes: seguridad, democracia y DD. HH., educación y salud, y economía con empleo y lucha contra la pobreza. El encuentro se transmitió en horario central desde el Centro de Convenciones.",
  themes: [
    {
      title: "Seguridad ciudadana",
      order: "Keiko Fujimori abrió · Roberto Sánchez respondió",
      summary:
        "Fujimori insistió en mano firme y reconstrucción del orden; Sánchez vinculó la violencia con desigualdad y propuso políticas integrales con participación ciudadana.",
    },
    {
      title: "Estado democrático y derechos humanos",
      order: "Sánchez abrió · Keiko Fujimori respondió",
      summary:
        "Sánchez planteó referéndum, fin de vacancias presidenciales abusivas y rendición de cuentas; Fujimori defendió estabilidad institucional y rechazó lo que calificó de «experimentos».",
    },
    {
      title: "Educación y salud",
      order: "Keiko Fujimori abrió · Roberto Sánchez respondió",
      summary:
        "Debate sobre inversión en hospitales y colegios, meritocracia docente y cobertura en zonas rurales; ambos prometieron aumentar presupuesto sectorial en sus primeros 100 días.",
    },
    {
      title: "Economía, empleo y reducción de la pobreza",
      order: "Roberto Sánchez abrió · Keiko Fujimori respondió",
      summary:
        "Bloque más tenso: reactivación productiva, formalización laboral y programas sociales. Fujimori habló de «orden o caos»; Sánchez respondió que la democracia debía salvarse de «golpistas».",
    },
  ],
  moments: [
    {
      tag: "Economía",
      quote:
        "Perú enfrenta un momento crítico: orden o caos. Hace falta construir, no destruir.",
      speaker: "Keiko Fujimori",
    },
    {
      tag: "Democracia",
      quote:
        "Vamos a salvar la democracia de quienes la secuestraron… el caos se escribe con «c», no con «k».",
      speaker: "Roberto Sánchez",
    },
    {
      tag: "Cierre Sánchez",
      quote:
        "El Perú le cerró las filas a su legado de horror. Nos jugamos el futuro del Perú y la democracia.",
      speaker: "Roberto Sánchez",
    },
    {
      tag: "Cierre Keiko",
      quote:
        "Este es un proyecto que va más allá de Fuerza Popular. Pido la posibilidad de ser presidenta.",
      speaker: "Keiko Fujimori",
    },
  ],
  timeline: [
    { time: "20:00", event: "Apertura · presentación (1 min c/u) · Sánchez primero" },
    { time: "20:12", event: "Pregunta moderador: ¿Por qué debe ser presidente?" },
    { time: "20:25", event: "Bloque 1 — Seguridad ciudadana" },
    { time: "20:48", event: "Bloque 2 — Estado democrático y DD. HH." },
    { time: "21:10", event: "Bloque 3 — Educación y salud" },
    { time: "21:32", event: "Bloque 4 — Economía, empleo y pobreza" },
    { time: "21:50", event: "Mensajes finales · cierre de Keiko Fujimori" },
  ],
  sources: [
    {
      label: "La República — formato y ejes",
      url: "https://larepublica.pe/politica/2026/05/30/debate-presidencial-2026-entre-keiko-fujimori-y-roberto-sanchez-cuales-son-los-temas-y-cuanto-durara-cada-bloque-2059230",
    },
    {
      label: "RTVE — crónica del debate",
      url: "https://www.rtve.es/noticias/20260601/debate-presidencial-peru-fujimori-sanchez/17094109.shtml",
    },
    {
      label: "El Búho — cobertura en vivo",
      url: "https://elbuho.pe/2026/05/ultimo-debate-presidencial-entre-keiko-fujimori-y-roberto-sanchez-cuales-son-sus-propuestas-para-el-peru/",
    },
  ],
};
