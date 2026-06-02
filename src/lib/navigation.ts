export const APP_VIEWS = [
  { id: "votar", label: "Votar en línea" },
  { id: "escrutinio", label: "Consulta y auditoría" },
] as const;

export type AppView = (typeof APP_VIEWS)[number]["id"];

export const VOTE_WIZARD_STEPS = [
  { id: "identidad", label: "Identificación" },
  { id: "padron", label: "Padrón electoral" },
  { id: "sufragio", label: "Sufragio" },
  { id: "revision", label: "Revisión" },
  { id: "comprobante", label: "Comprobante" },
] as const;

export type VoteWizardStep = (typeof VOTE_WIZARD_STEPS)[number]["id"];
