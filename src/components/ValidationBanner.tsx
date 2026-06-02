import type { ValidationResult } from "@/lib/types";
import { IconCheck, IconX } from "./icons";

export function ValidationBanner({ result }: { result: ValidationResult | null }) {
  if (!result) return null;

  return (
    <div
      role="status"
      className={`flex gap-3 border p-3 ${
        result.valid ? "border-[var(--ok)] bg-[var(--ok-soft)]" : "border-[var(--pe-red)] bg-[var(--pe-red-soft)]"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
          result.valid ? "border-[var(--ok)] bg-white text-[var(--ok)]" : "bg-[var(--pe-red)] text-white border-[var(--pe-red)]"
        }`}
      >
        {result.valid ? <IconCheck /> : <IconX />}
      </span>
      <div>
        <p className="font-bold text-sm">
          {result.valid ? "Escrutinio íntegro" : "Escrutinio comprometido"}
        </p>
        <p className="text-sm text-[var(--ink-2)]">{result.message}</p>
        {result.issues.length > 0 && (
          <ul className="mt-2 font-mono text-[11px] text-[var(--pe-red-dark)]">
            {result.issues.map((issue) => (
              <li key={issue}>— {issue}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
