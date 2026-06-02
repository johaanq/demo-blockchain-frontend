"use client";

import { useCallback, useState } from "react";
import { CANDIDATES, parseVoteRecord } from "@/lib/demo-defaults";
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
  const voteRecord = parseVoteRecord(block.data);

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
    <div className="card block-detail">
      <div className="card__head block-detail__head">
        <div className="block-detail__intro">
          <h3 className="card__title block-detail__title">
            {isGenesis ? "Acta de apertura" : `Detalle del registro ${block.index}`}
          </h3>
          {voteRecord && (
            <p className="card__desc">
              Voto · {CANDIDATES[voteRecord.option].name} ({CANDIDATES[voteRecord.option].party})
            </p>
          )}
        </div>
        <button type="button" className="btn btn--ghost block-detail__close" onClick={onClose}>
          Cerrar
        </button>
      </div>
      <div className="card__body block-detail__body">
        {voteRecord && (
          <div className="block-detail__vote">
            <p className="block-detail__vote-label">Electora / Elector</p>
            <dl className="review-grid block-detail__vote-grid">
              <div className="review-grid__full">
                <dt>Nombres y apellidos</dt>
                <dd>{voteRecord.electorName ?? "No registrado en este bloque"}</dd>
              </div>
              <div>
                <dt>DNI (enmascarado)</dt>
                <dd className="font-data">{voteRecord.dniMasked}</dd>
              </div>
              <div>
                <dt>Mesa de sufragio</dt>
                <dd className="font-data">{voteRecord.mesa}</dd>
              </div>
              <div>
                <dt>Preferencia</dt>
                <dd>
                  {CANDIDATES[voteRecord.option].party} — {CANDIDATES[voteRecord.option].name}
                </dd>
              </div>
              {voteRecord.receiptCode && (
                <div className="review-grid__full">
                  <dt>Comprobante</dt>
                  <dd className="font-data">{voteRecord.receiptCode}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
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
            className={`block-detail__pow ${pow.startsWith("Cumple") ? "notice notice--ok" : "notice notice--error"}`}
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
    <div className="block-detail__row">
      <div className="block-detail__row-head">
        <span className="label block-detail__label">{label}</span>
        {copy && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => copy(value, key)}>
            {copied === key ? "Copiado" : "Copiar"}
          </button>
        )}
      </div>
      <p className={`block-detail__value ${data ? "font-data" : ""}`}>{value}</p>
    </div>
  );
}
