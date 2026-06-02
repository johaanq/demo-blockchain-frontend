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

  const { status, difficulty, targetPrefix, attempts, lines, finalHash, errorMessage } = state;

  return createPortal(
    <div className="overlay" role="dialog" aria-modal aria-label="Sellado en progreso">
      <div className="modal">
        <div className="modal__head">Sellado del registro · dificultad {difficulty}</div>
        <div className="modal__stats">
          <p className="modal__stats-label">Intentos realizados</p>
          <p className="modal__stats-value">{attempts.toLocaleString("es")}</p>
          <p className="modal__stats-prefix font-data">Prefijo «{targetPrefix}»</p>
        </div>
        <div ref={logRef} className="modal__log">
          {lines.map((line, i) => (
            <p key={`${i}-${line.attempt}`} className={line.valid ? "modal__log-line--ok" : ""}>
              [{line.attempt.toLocaleString("es")}] nonce={line.nonce} · {line.hash.slice(0, 24)}…
            </p>
          ))}
          {status === "success" && finalHash && (
            <p className="modal__log-success">Sellado: {finalHash}</p>
          )}
          {status === "error" && <p className="modal__log-error">{errorMessage}</p>}
        </div>
        {status !== "mining" && onClose && (
          <div className="modal__foot">
            <button type="button" className="btn btn--primary btn-block" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
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
