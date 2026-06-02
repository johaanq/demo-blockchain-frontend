import { ELECTION } from "@/lib/demo-defaults";
import { DEBATE_2026 } from "@/lib/debate-2026";

export function ElectionFooter() {
  return (
    <footer className="site-footer">
      <div className="container-main flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="font-semibold text-[var(--ink)]">Software Emergentes · Acta Digital</p>
          <p className="mt-1 text-[var(--muted)]">{ELECTION.disclaimer}</p>
        </div>
        <ul className="space-y-1">
          {[...ELECTION.sources, ...DEBATE_2026.sources.slice(0, 2)].map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[var(--pe-red)] hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
