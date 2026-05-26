import type { ValidationResult } from "@/lib/types";
import { IconCheck, IconX } from "./icons";

export function ValidationBanner({ result }: { result: ValidationResult | null }) {
  if (!result) return null;

  const valid = result.valid;

  return (
    <div
      role="status"
      className={`flex gap-3 rounded-lg border p-4 ${
        valid
          ? "border-[var(--border)] bg-[var(--surface)]"
          : "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          valid
            ? "border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
            : "bg-[var(--accent)] text-white"
        }`}
      >
        {valid ? <IconCheck /> : <IconX />}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${valid ? "text-[var(--text)]" : "text-[var(--accent)]"}`}>
          {valid ? "Cadena válida" : "Cadena inválida"}
        </p>
        <p className="mt-0.5 text-sm text-[var(--muted)]">{result.message}</p>
        {result.issues.length > 0 && (
          <ul className="mt-2 space-y-1 font-mono text-[11px] text-[var(--link)]">
            {result.issues.map((issue) => (
              <li key={issue} className="flex gap-2">
                <span className="text-[var(--accent)]">—</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
