/**
 * Propuesta académica inspirada en ONPE/JNE — EG Perú 2026, 2.ª vuelta.
 * Flujo referenciado en modelos de Estonia, Brasil (e-Título) y plataformas estatales de EE.UU.
 */
export const ELECTION = {
  name: "Elecciones Generales del Perú 2026",
  round: "Segunda vuelta presidencial",
  runoffDate: "7 de junio de 2026",
  firstRoundDate: "12 de abril de 2026",
  platformName: "Voto Digital",
  platformOrg: "ONPE",
  platformTagline: "Plataforma de sufragio en línea — EG 2026 · 2.ª vuelta",
  subtitle:
    "Identificación con DNI, consulta al padrón electoral y emisión de sufragio con comprobante verificable.",
  disclaimer:
    "Prototipo académico para Software Emergentes. No es el sistema oficial de la ONPE ni del JNE. El voto electrónico remoto aún no está implementado en el Perú.",
  sources: [
    {
      label: "JNE — proclamación segunda vuelta",
      url: "https://elperuano.pe/noticia/295886--es-oficial-keiko-fujimori-y-roberto-sanchez-disputaran-la-segunda-vuelta-el-7-de-junio",
    },
  ],
};

export const CANDIDATES = {
  KEIKO: {
    code: "KEIKO",
    short: "FP",
    name: "Keiko Fujimori",
    party: "Fuerza Popular",
    partyLogo: "/parties/fuerza-popular.png",
    partyLogoAlt: "Logo de Fuerza Popular",
    color: "#e65100",
    bgSoft: "#fff8f0",
    border: "#f28000",
  },
  SANCHEZ: {
    code: "SANCHEZ",
    short: "JxP",
    name: "Roberto Sánchez",
    party: "Juntos por el Perú",
    partyLogo: "/parties/juntos-por-el-peru.png",
    partyLogoAlt: "Logo de Juntos por el Perú",
    color: "#c62828",
    bgSoft: "#f9fff9",
    border: "#2e7d32",
  },
} as const;

export type VoteOption = keyof typeof CANDIDATES;

export function buildVotePayload(
  mesa: string,
  dniMasked: string,
  option: VoteOption,
  receipt?: string,
): string {
  const base = `VOTO | mesa=${mesa} | DNI=${dniMasked} | opcion=${option} | EG2026-2V`;
  return receipt ? `${base} | comprobante=${receipt}` : base;
}

export const DEFAULT_VOTE_PAYLOAD = buildVotePayload("034521", "***8912", "KEIKO", "ONPE-DEMO0001");

export const DEFAULT_TAMPER_PAYLOAD = buildVotePayload("034521", "***8912", "SANCHEZ");

export const PRESET_VOTES = {
  keikoMesa12: buildVotePayload("001245", "***4567", "KEIKO"),
  sanchezMesa12: buildVotePayload("001245", "***5633", "SANCHEZ"),
  keikoMesa34: buildVotePayload("078902", "***1234", "KEIKO"),
  cierreMesa: "CIERRE | mesa=034521 | acta=ONPE | estado=CERRADA | EG2026",
} as const;

export const DIFFICULTY_MIN = 1;
export const DIFFICULTY_MAX = 6;
export const DIFFICULTY_DEFAULT = 4;

export const DEFAULT_BLOCK_PAYLOAD = DEFAULT_VOTE_PAYLOAD;

export function parseVoteOption(data: string): VoteOption | null {
  const m = data.match(/opcion=(KEIKO|SANCHEZ)/i);
  if (!m) return null;
  return m[1].toUpperCase() as VoteOption;
}

export function getCandidateStyle(data: string) {
  const opt = parseVoteOption(data);
  if (opt) return CANDIDATES[opt];
  if (data.startsWith("GENESIS")) return { color: "var(--pe-red)", bgSoft: "var(--pe-red-soft)" };
  if (data.startsWith("CIERRE")) return { color: "var(--muted)", bgSoft: "var(--surface)" };
  return null;
}
