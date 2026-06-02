"use client";

import { Button, Card, Chip, PageHeader } from "@/components/ui";
import { CANDIDATES, ELECTION, PRESET_VOTES } from "@/lib/demo-defaults";

interface JornadaControlsProps {
  txData: string;
  loading: boolean;
  initialized: boolean;
  blockCount: number;
  onTxChange: (v: string) => void;
  onInit: () => void;
  onAdd: () => void;
}

export function JornadaControls({
  txData,
  loading,
  initialized,
  blockCount,
  onTxChange,
  onInit,
  onAdd,
}: JornadaControlsProps) {
  return (
    <div className="view-section space-y-6">
      <PageHeader
        badge="Mesa de sufragio"
        title="Jornada electoral"
        description={`Registra votos y actas en el ledger sin sellar aún. ${ELECTION.round} · ${ELECTION.runoffDate}.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <p className="stat-card__value">{initialized ? "Abierta" : "—"}</p>
          <p className="stat-card__label">Estado jornada</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__value">{blockCount}</p>
          <p className="stat-card__label">Registros en cadena</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__value">SHA-256</p>
          <p className="stat-card__label">Hash por bloque</p>
        </div>
      </div>

      <Card
        title="Acta de apertura"
        subtitle="Crea el bloque génesis (Keiko vs Sánchez · 07-jun-2026)"
        accent="red"
      >
        <p className="mb-4 text-sm text-[var(--ink-secondary)]">
          Solo se puede iniciar una vez por sesión del servidor. Equivale al acta de apertura de mesa
          en la cadena.
        </p>
        <Button variant="primary" onClick={onInit} disabled={loading} loading={loading}>
          Abrir jornada (génesis)
        </Button>
      </Card>

      <Card title="Registrar voto o acta" subtitle="Sin proof-of-work — nonce en 0">
        <label htmlFor="tx-data" className="field-label">
          Payload del registro
        </label>
        <div className="mb-3 flex flex-wrap gap-2">
          <Chip
            disabled={loading}
            accentColor={CANDIDATES.KEIKO.color}
            onClick={() => onTxChange(PRESET_VOTES.keikoMesa12)}
          >
            Voto Keiko
          </Chip>
          <Chip
            disabled={loading}
            accentColor={CANDIDATES.SANCHEZ.color}
            onClick={() => onTxChange(PRESET_VOTES.sanchezMesa12)}
          >
            Voto Sánchez
          </Chip>
          <Chip disabled={loading} onClick={() => onTxChange(PRESET_VOTES.keikoMesa34)}>
            Otro Keiko
          </Chip>
          <Chip disabled={loading} onClick={() => onTxChange(PRESET_VOTES.cierreMesa)}>
            Cierre mesa
          </Chip>
        </div>
        <textarea
          id="tx-data"
          rows={3}
          className="textarea mb-4"
          value={txData}
          onChange={(e) => onTxChange(e.target.value)}
        />
        <Button onClick={onAdd} disabled={loading || !initialized} loading={loading}>
          Añadir a la cadena (sin sellar)
        </Button>
        {!initialized && (
          <p className="mt-3 text-xs text-[var(--muted)]">Primero abre la jornada.</p>
        )}
      </Card>
    </div>
  );
}
