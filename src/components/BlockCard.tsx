import type { BlockDto } from "@/lib/types";

export function BlockCard({
  block,
  isGenesis,
  index,
  total,
  selected,
  onSelect,
}: {
  block: BlockDto;
  isGenesis?: boolean;
  index?: number;
  total?: number;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const shortHash = (h: string) => `${h.slice(0, 8)}…${h.slice(-6)}`;

  return (
    <article className="group relative w-[300px] shrink-0 sm:w-[292px]">
      <button
        type="button"
        onClick={onSelect}
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-[var(--surface-raised)] text-left transition-all hover:border-[var(--accent)]/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
          selected
            ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
            : isGenesis
              ? "border-[var(--accent)]/60"
              : "border-[var(--border)]"
        }`}
        aria-pressed={selected}
        aria-label={`${isGenesis ? "Bloque génesis" : `Bloque ${block.index}`}. Clic para ver detalle`}
      >
        <div
          className={`h-1 w-full shrink-0 ${isGenesis || selected ? "bg-[var(--accent)]" : "bg-[var(--border)] group-hover:bg-[var(--accent)]/70"}`}
        />

        <div className="flex flex-1 flex-col p-4">
          <header className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded font-mono text-xs font-semibold ${
                  isGenesis
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                }`}
              >
                {isGenesis ? "G" : block.index}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text)]">
                  {isGenesis ? "Bloque génesis" : `Bloque ${block.index}`}
                </p>
                <time className="font-mono text-[10px] text-[var(--muted)]">
                  {new Date(block.timestamp).toLocaleString("es", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
                </time>
              </div>
            </div>
            {total !== undefined && index !== undefined && (
              <span className="shrink-0 font-mono text-[10px] text-[var(--muted)]">
                {index + 1}/{total}
              </span>
            )}
          </header>

          <p className="mb-4 flex-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2.5 text-sm leading-snug text-[var(--text)]">
            {block.data}
          </p>

          <dl className="space-y-2 border-t border-[var(--border-subtle)] pt-3 font-mono text-[10px] leading-relaxed">
            <div className="grid grid-cols-[68px_1fr] gap-x-2 gap-y-1.5">
              <dt className="text-[var(--muted)]">prev_hash</dt>
              <dd className="truncate text-[var(--link)]" title={block.previousHash}>
                {shortHash(block.previousHash)}
              </dd>
              <dt className="text-[var(--muted)]">nonce</dt>
              <dd className="text-[var(--text)]">{block.nonce.toLocaleString("es")}</dd>
              <dt className="text-[var(--muted)]">hash</dt>
              <dd className="truncate text-[var(--accent)]" title={block.hash}>
                {shortHash(block.hash)}
              </dd>
            </div>
          </dl>

          <p className="mt-3 text-center font-mono text-[9px] text-[var(--muted)] group-hover:text-[var(--accent)]">
            Clic para detalle completo ↓
          </p>
        </div>
      </button>
    </article>
  );
}
