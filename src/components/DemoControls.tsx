"use client";

import type { ReactNode } from "react";
import { DIFFICULTY_MAX, DIFFICULTY_MIN } from "@/lib/demo-defaults";
import { IconLoader } from "./icons";

interface DemoControlsProps {
  txData: string;
  tamperIndex: string;
  tamperData: string;
  difficulty: number;
  loading: boolean;
  onTxChange: (v: string) => void;
  onTamperIndexChange: (v: string) => void;
  onTamperDataChange: (v: string) => void;
  onDifficultyChange: (v: number) => void;
  onInit: () => void;
  onAdd: () => void;
  onMine: () => void;
  onValidate: () => void;
  onTamper: () => void;
}

function Btn({
  children,
  onClick,
  disabled,
  variant = "default",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "ghost" | "danger";
}) {
  const styles = {
    default:
      "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--border-subtle)]",
    primary:
      "bg-[var(--accent)] border-[var(--accent-dim)] text-white hover:bg-[#f43f5e] font-medium",
    ghost:
      "bg-transparent border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--muted)]",
    danger:
      "bg-transparent border-[var(--accent)]/50 text-[var(--link)] hover:bg-[var(--accent-soft)]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]}`}
    >
      {disabled && <IconLoader className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

function Panel({
  title,
  step,
  children,
}: {
  title: string;
  step: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-[var(--bg)] font-mono text-[11px] font-medium text-[var(--accent)]">
          {step}
        </span>
        <h2 className="text-sm font-medium text-[var(--text)]">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function DemoControls({
  txData,
  tamperIndex,
  tamperData,
  difficulty,
  loading,
  onTxChange,
  onTamperIndexChange,
  onTamperDataChange,
  onDifficultyChange,
  onInit,
  onAdd,
  onMine,
  onValidate,
  onTamper,
}: DemoControlsProps) {
  return (
    <div className="space-y-4">
      <Panel title="Configuración PoW" step="0">
        <label htmlFor="difficulty" className="mb-1.5 block text-xs text-[var(--muted)]">
          Dificultad (ceros iniciales en el hash SHA-256)
        </label>
        <div className="mb-2 flex items-center gap-3">
          <input
            id="difficulty"
            type="range"
            min={DIFFICULTY_MIN}
            max={DIFFICULTY_MAX}
            step={1}
            value={difficulty}
            disabled={loading}
            onChange={(e) => onDifficultyChange(Number(e.target.value))}
            className="h-1.5 flex-1 accent-[var(--accent)]"
          />
          <span className="w-8 shrink-0 text-center font-mono text-sm font-medium text-[var(--accent)]">
            {difficulty}
          </span>
        </div>
        <p className="text-[10px] leading-relaxed text-[var(--muted)]">
          Rango {DIFFICULTY_MIN}–{DIFFICULTY_MAX}. Valores altos aumentan el tiempo de minería.
          Afecta a bloques minados y a la validación PoW.
        </p>
      </Panel>

      <Panel title="Operaciones de la cadena" step="1">
        <label htmlFor="tx-data" className="mb-1.5 block text-xs text-[var(--muted)]">
          Payload del bloque
        </label>
        <textarea
          id="tx-data"
          rows={2}
          className="mb-4 w-full resize-none rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[11px] leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)]/50"
          placeholder="TX A1042→B7781 · $1,250 · ref-00482"
          value={txData}
          onChange={(e) => onTxChange(e.target.value)}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Btn onClick={onInit} disabled={loading} variant="ghost">
            Iniciar cadena
          </Btn>
          <Btn onClick={onAdd} disabled={loading}>
            Añadir bloque
          </Btn>
          <Btn onClick={onMine} disabled={loading} variant="primary">
            Minar (PoW)
          </Btn>
        </div>
      </Panel>

      <Panel title="Prueba de integridad" step="2">
        <p className="mb-3 text-xs leading-relaxed text-[var(--muted)]">
          Sustituye el payload de un bloque sin recalcular el hash. Al validar, la cadena debe
          reportarse como inválida.
        </p>
        <div className="mb-4 flex gap-2">
          <div className="w-20 shrink-0">
            <label htmlFor="tamper-idx" className="mb-1 block text-[10px] text-[var(--muted)]">
              Índice
            </label>
            <input
              id="tamper-idx"
              type="number"
              min={0}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-2 font-mono text-sm outline-none focus:border-[var(--accent)]/50"
              value={tamperIndex}
              onChange={(e) => onTamperIndexChange(e.target.value)}
            />
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor="tamper-data" className="mb-1 block text-[10px] text-[var(--muted)]">
              Payload alterado
            </label>
            <input
              id="tamper-data"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[11px] outline-none focus:border-[var(--accent)]/50"
              value={tamperData}
              onChange={(e) => onTamperDataChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Btn onClick={onTamper} disabled={loading} variant="danger">
            Inyectar alteración
          </Btn>
          <Btn onClick={onValidate} disabled={loading}>
            Validar cadena
          </Btn>
        </div>
      </Panel>
    </div>
  );
}
