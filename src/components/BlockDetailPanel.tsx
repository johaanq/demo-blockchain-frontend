"use client";

import { useCallback, useState } from "react";
import type { BlockDto } from "@/lib/types";

function CopyBtn({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--text)]"
      title={`Copiar ${label}`}
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function Row({
  label,
  value,
  mono = true,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="grid gap-2 border-b border-[var(--border-subtle)] py-3 last:border-0 sm:grid-cols-[140px_1fr_auto] sm:items-start sm:gap-4">
      <dt className="text-xs font-medium text-[var(--muted)]">{label}</dt>
      <dd
        className={`min-w-0 break-all text-sm leading-relaxed ${
          mono ? "font-mono text-[11px] sm:text-xs" : ""
        } ${accent ? "text-[var(--accent)]" : "text-[var(--text)]"}`}
      >
        {value}
      </dd>
      <div className="sm:pt-0.5">
        <CopyBtn value={value} label={label} />
      </div>
    </div>
  );
}

export function BlockDetailPanel({
  block,
  isGenesis,
  difficulty,
  onClose,
}: {
  block: BlockDto;
  isGenesis?: boolean;
  difficulty?: number;
  onClose: () => void;
}) {
  const ts = new Date(block.timestamp);
  const powPrefix =
    difficulty !== undefined && block.nonce > 0
      ? block.hash.startsWith("0".repeat(difficulty))
        ? `Cumple PoW (${difficulty} ceros iniciales)`
        : `No cumple PoW (se esperaban ${difficulty} ceros)`
      : block.nonce === 0
        ? "Sin minar (nonce = 0)"
        : null;

  return (
    <div
      className="mt-5 rounded-lg border border-[var(--accent)]/35 bg-[var(--surface-raised)]"
      role="region"
      aria-label={`Detalle del bloque ${block.index}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-[var(--accent)] font-mono text-sm font-semibold text-white">
            {isGenesis ? "G" : block.index}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              {isGenesis ? "Bloque génesis" : `Bloque #${block.index}`}
            </h3>
            <p className="text-xs text-[var(--muted)]">Vista detallada · clic en otro bloque para cambiar</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--text)]"
        >
          Cerrar
        </button>
      </div>

      <dl className="px-4 py-1 sm:px-5">
        <Row label="Índice" value={String(block.index)} />
        <Row
          label="Marca de tiempo"
          value={`${ts.toLocaleString("es", { dateStyle: "full", timeStyle: "long" })} (${block.timestamp})`}
          mono={false}
        />
        <Row label="Datos (payload)" value={block.data} mono={false} />
        <Row label="previousHash" value={block.previousHash} accent />
        <Row label="nonce" value={block.nonce.toLocaleString("es")} />
        <Row label="hash (SHA-256)" value={block.hash} accent />
      </dl>

      {powPrefix && (
        <p
          className={`mx-4 mb-4 rounded-md border px-3 py-2 font-mono text-[11px] sm:mx-5 ${
            powPrefix.startsWith("Cumple")
              ? "border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              : "border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--link)]"
          }`}
        >
          {powPrefix}
        </p>
      )}
    </div>
  );
}
