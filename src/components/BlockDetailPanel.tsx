"use client";

import { useCallback, useState } from "react";
import { parseVoteOption, CANDIDATES } from "@/lib/demo-defaults";
import type { BlockDto } from "@/lib/types";

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
  const [copied, setCopied] = useState<string | null>(null);
  const vote = parseVoteOption(block.data);

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  const pow =
    difficulty !== undefined && block.nonce > 0
      ? block.hash.startsWith("0".repeat(difficulty))
        ? `Cumple sellado (${difficulty} ceros)`
        : `No cumple sellado (esperados ${difficulty} ceros)`
      : block.nonce === 0
        ? "Sin sellar"
        : null;

  return (
    <div className="card">
      <div className="card__head flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="card__title text-lg">
            {isGenesis ? "Acta de apertura" : `Detalle del registro ${block.index}`}
          </h3>
          {vote && (
            <p className="card__desc">
              Voto · {CANDIDATES[vote].name} ({CANDIDATES[vote].party})
            </p>
          )}
        </div>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Cerrar
        </button>
      </div>
      <div className="card__body space-y-4 text-sm">
        <Row label="Contenido" value={block.data} data />
        <Row
          label="Marca de tiempo"
          value={new Date(block.timestamp).toLocaleString("es", {
            dateStyle: "full",
            timeStyle: "long",
          })}
        />
        <Row label="Nonce" value={block.nonce.toLocaleString("es")} data />
        <Row label="Hash anterior" value={block.previousHash} data copy={copy} copied={copied} />
        <Row label="Hash SHA-256" value={block.hash} data copy={copy} copied={copied} />
        {pow && (
          <p
            className={`rounded-lg px-3 py-2 text-sm ${
              pow.startsWith("Cumple") ? "notice notice--ok" : "notice notice--error"
            }`}
          >
            {pow}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  data,
  copy,
  copied,
}: {
  label: string;
  value: string;
  data?: boolean;
  copy?: (t: string, k: string) => void;
  copied?: string | null;
}) {
  const key = label;
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="label mb-0">{label}</span>
        {copy && (
          <button type="button" className="btn btn--ghost text-xs" onClick={() => copy(value, key)}>
            {copied === key ? "Copiado" : "Copiar"}
          </button>
        )}
      </div>
      <p className={`mt-1 break-all ${data ? "font-data text-xs" : ""}`}>{value}</p>
    </div>
  );
}
