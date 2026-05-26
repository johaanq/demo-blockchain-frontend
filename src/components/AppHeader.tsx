interface AppHeaderProps {
  connected: boolean;
  difficulty?: number;
  blockCount?: number;
}

export function AppHeader({ connected, difficulty, blockCount }: AppHeaderProps) {
  return (
    <header className="relative z-10 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="mb-1 font-mono text-[11px] text-[var(--muted)]">
            Software Emergentes · 2025
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-[1.65rem]">
            Ledger Demo
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-[var(--muted)]">
            Simulador de blockchain: bloques encadenados, SHA-256 y minería PoW.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              connected
                ? "border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--text)]"
                : "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--link)]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-[var(--text)]" : "bg-[var(--accent)]"}`}
            />
            {connected ? "API conectada" : "Sin conexión"}
          </div>
          {connected && difficulty !== undefined && (
            <>
              <span className="hidden h-4 w-px bg-[var(--border)] sm:block" />
              <span className="font-mono text-xs text-[var(--muted)]">
                PoW: <span className="text-[var(--accent)]">{difficulty}</span> ceros
              </span>
              {blockCount !== undefined && (
                <span className="font-mono text-xs text-[var(--muted)]">
                  · {blockCount} bloque{blockCount !== 1 ? "s" : ""}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
