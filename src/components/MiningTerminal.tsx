"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { MineStreamEvent } from "@/lib/mining-stream";

export interface MiningLine {
  attempt: number;
  nonce: number;
  hash: string;
  valid: boolean;
}

export interface MiningTerminalState {
  status: "mining" | "success" | "error";
  difficulty: number;
  targetPrefix: string;
  attempts: number;
  lines: MiningLine[];
  finalHash?: string;
  errorMessage?: string;
}

export function MiningTerminal({
  state,
  onClose,
}: {
  state: MiningTerminalState | null;
  onClose?: () => void;
}) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [state?.lines.length, state?.status]);

  if (!state) return null;

  const { status, difficulty, targetPrefix, attempts, lines, finalHash, errorMessage } =
    state;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Minería en progreso"
    >
      <div className="flex max-h-[min(520px,90vh)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[#0a0a0a] shadow-[0_0_60px_rgba(225,29,72,0.15)]">
        <div className="flex items-center gap-2 border-b border-[#2a2a2a] bg-[#111] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#444]" />
          <span className="ml-2 font-mono text-[11px] text-[var(--muted)]">
            pow-miner.exe — dificultad {difficulty} ({targetPrefix}…)
          </span>
        </div>

        <div className="border-b border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3">
          <p className="font-mono text-[10px] text-[var(--muted)]">
            Intentos reales (muestreados desde el servidor)
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--text)]">
            {attempts.toLocaleString("es")}
          </p>
          {status === "mining" && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#222]">
              <div className="mining-bar h-full w-1/4 rounded-full bg-[var(--accent)]" />
            </div>
          )}
        </div>

        <div
          ref={logRef}
          className="min-h-[200px] flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed"
        >
          <p className="text-[var(--accent)]">
            &gt; Iniciando PoW SHA-256 · objetivo hash con prefijo &quot;{targetPrefix}&quot;
          </p>
          {lines.map((line, i) => (
            <p
              key={`${i}-${line.attempt}-${line.nonce}`}
              className={line.valid ? "text-[#86efac]" : "text-[#737373]"}
            >
              [{line.attempt.toLocaleString("es")}] nonce={line.nonce}{" "}
              hash={line.hash.slice(0, 20)}… {line.valid ? "✓" : "·"}
            </p>
          ))}
          {status === "success" && finalHash && (
            <p className="mt-2 text-[var(--accent)]">
              &gt; Bloque minado · hash={finalHash}
            </p>
          )}
          {status === "error" && (
            <p className="mt-2 text-[var(--link)]">&gt; Error: {errorMessage}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#2a2a2a] px-4 py-2 font-mono text-[10px] text-[var(--muted)]">
          <span>
            {status === "mining"
              ? "Calculando en el servidor NestJS…"
              : status === "success"
                ? "Completado. Revisa el log y cierra cuando quieras."
                : "Falló. Cierra para volver al panel."}
          </span>
          {status !== "mining" && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded border border-[var(--border)] px-2.5 py-1 text-[10px] text-[var(--text)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function miningEventToLine(
  ev: Extract<MineStreamEvent, { type: "tick" }>,
  targetPrefix: string,
): MiningLine {
  return {
    attempt: ev.attempt,
    nonce: ev.nonce,
    hash: ev.hash,
    valid: ev.hash.startsWith(targetPrefix),
  };
}
