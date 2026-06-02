export const APP_ROUTES = [
  { id: "voto", path: "/voto", label: "Votar en línea" },
  { id: "consulta", path: "/consulta", label: "Consulta y auditoría" },
] as const;

export type AppRouteId = (typeof APP_ROUTES)[number]["id"];

export const VOTE_WIZARD_STEPS = [
  { id: "identidad", label: "Identificación" },
  { id: "padron", label: "Padrón electoral" },
  { id: "sufragio", label: "Sufragio" },
  { id: "revision", label: "Revisión" },
  { id: "comprobante", label: "Comprobante" },
] as const;

export type VoteWizardStep = (typeof VOTE_WIZARD_STEPS)[number]["id"];

export function routeFromPath(pathname: string): AppRouteId | null {
  const match = APP_ROUTES.find((r) => r.path === pathname);
  return match?.id ?? null;
}
