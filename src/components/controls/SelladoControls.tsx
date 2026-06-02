"use client";

import { Button, Card, PageHeader } from "@/components/ui";
import { DIFFICULTY_MAX, DIFFICULTY_MIN } from "@/lib/demo-defaults";

interface SelladoControlsProps {
  txData: string;
  difficulty: number;
  loading: boolean;
  initialized: boolean;
  onDifficultyChange: (v: number) => void;
  onMine: () => void;
}

export function SelladoControls({
  txData,
  difficulty,
  loading,
  initialized,
  onDifficultyChange,
  onMine,
}: SelladoControlsProps) {
  const prefix = "0".repeat(difficulty);

  return (
    <div className="view-section space-y-6">
      <PageHeader
        badge="Proof of Work"
        title="Sellado del voto"
        description="El servidor busca un nonce hasta que el hash SHA-256 comience con N ceros. Verás el progreso en tiempo real."
      />

      <Card title="Dificultad del sellado" subtitle="Configurable en caliente vía API" accent="gold">
        <label htmlFor="difficulty" className="field-label">
          Ceros iniciales requeridos ({DIFFICULTY_MIN}–{DIFFICULTY_MAX})
        </label>
        <div className="mb-3 flex items-center gap-4">
          <input
            id="difficulty"
            type="range"
            min={DIFFICULTY_MIN}
            max={DIFFICULTY_MAX}
            step={1}
            value={difficulty}
            disabled={loading}
            onChange={(e) => onDifficultyChange(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-[var(--pe-red)]"
          />
          <span className="font-mono text-2xl font-bold text-[var(--pe-red)]">{difficulty}</span>
        </div>
        <p className="rounded-[var(--radius-sm)] bg-[var(--bg)] px-3 py-2 font-mono text-xs text-[var(--muted)]">
          Objetivo: hash debe empezar con &quot;{prefix}&quot;
        </p>
      </Card>

      <Card title="Voto a sellar" subtitle="Usa el mismo payload registrado en Jornada" accent="red">
        <pre className="mb-4 overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-[11px] leading-relaxed text-[var(--ink-secondary)]">
          {txData}
        </pre>
        <p className="mb-4 text-sm text-[var(--muted)]">
          El sellado añade un bloque nuevo con PoW o re-sella según la lógica del backend NestJS.
        </p>
        <Button
          variant="primary"
          onClick={onMine}
          disabled={loading || !initialized}
          loading={loading}
        >
          Iniciar sellado (SSE en vivo)
        </Button>
      </Card>
    </div>
  );
}
