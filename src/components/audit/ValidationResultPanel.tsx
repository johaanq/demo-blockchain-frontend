"use client";

import { CANDIDATES, parseVoteRecord } from "@/lib/demo-defaults";
import type { BlockDto, TamperResult, ValidationIssueDetail, ValidationResult } from "@/lib/types";

function shortHash(hash?: string): string {
  if (!hash) return "—";
  return hash.length <= 20 ? hash : `${hash.slice(0, 16)}…${hash.slice(-4)}`;
}

function issueKindLabel(kind: ValidationIssueDetail["kind"]): string {
  switch (kind) {
    case "hash_mismatch":
      return "Huella inconsistente";
    case "broken_link":
      return "Cadena rota";
    case "pow_pending":
      return "Sin sellar";
    case "pow_invalid":
      return "PoW inválido";
    case "emission_mismatch":
      return "Fraude detectado";
  }
}

export function TamperResultNotice({ result }: { result: TamperResult }) {
  return (
    <div className="notice notice--warn audit-notice">
      <p className="font-semibold">Registro #{result.index} alterado con re-minado (fraude real)</p>
      <p className="mt-1">
        Se cambió el sufragio, se <strong>recalculó el hash</strong> y se re-selló con PoW
        {result.rechainedCount > 0
          ? `; además se re-sellaron ${result.rechainedCount} registro(s) posteriores para mantener la cadena coherente.`
          : "."}
        {" "}La cadena puede seguir viéndose válida; el fraude se detecta al contrastar con el{" "}
        <strong>acta de emisión</strong>.
      </p>
      <dl className="audit-diff audit-diff--spaced">
        <div>
          <dt>Sufragio original (acta)</dt>
          <dd className="font-data">{result.previousData}</dd>
        </div>
        <div>
          <dt>Sufragio alterado (cadena actual)</dt>
          <dd className="font-data">{result.data}</dd>
        </div>
        <div>
          <dt>Hash anterior → hash nuevo</dt>
          <dd className="font-data">
            {shortHash(result.previousHash)} → {shortHash(result.hash)} (nonce {result.nonce.toLocaleString("es")})
          </dd>
        </div>
        <div>
          <dt>Intentos de minería</dt>
          <dd>
            {result.tamperAttempts.toLocaleString("es")} en el registro alterado
            {result.rechainedCount > 0 &&
              ` · ${result.tailAttempts.toLocaleString("es")} en la cola re-sellada`}
          </dd>
        </div>
      </dl>
      <p className="audit-notice__hint audit-notice__hint--spaced">{result.explanation}</p>
    </div>
  );
}

export function ValidationResultPanel({
  validation,
  blocks,
}: {
  validation: ValidationResult;
  blocks: BlockDto[];
}) {
  return (
    <div className={`notice ${validation.valid ? "notice--ok" : "notice--error"} audit-notice`}>
      <p className="font-semibold">
        {validation.valid ? "Registros íntegros" : "Alteración detectada"}
      </p>
      <p className="mt-1">{validation.message}</p>

      {!validation.valid && validation.howItWorks && (
        <div className="audit-how audit-how--spaced">
          <p className="audit-how__title">¿Cómo nos damos cuenta?</p>
          <p className="audit-how__text">{validation.howItWorks}</p>
        </div>
      )}

      {validation.issueDetails.length > 0 ? (
        <ul className="audit-issues audit-issues--spaced">
          {validation.issueDetails.map((issue) => {
            const block = blocks.find((b) => b.index === issue.blockIndex);
            const vote = block ? parseVoteRecord(block.data) : null;
            const officialVote = issue.officialDataSnippet
              ? parseVoteRecord(issue.officialDataSnippet)
              : null;
            return (
              <li key={`${issue.kind}-${issue.blockIndex}`} className="audit-issue">
                <div className="audit-issue__head">
                  <span className="gov-badge gov-badge--info">{issueKindLabel(issue.kind)}</span>
                  <strong>{issue.title}</strong>
                </div>
                <p className="audit-issue__detail">{issue.detail}</p>
                {issue.kind === "emission_mismatch" && issue.officialDataSnippet && (
                  <>
                    <p className="audit-issue__snippet">
                      <span className="audit-issue__label">Acta de emisión (original):</span>{" "}
                      <code className="font-data">{issue.officialDataSnippet}</code>
                    </p>
                    {officialVote?.electorName && (
                      <p className="audit-issue__snippet">
                        <span className="audit-issue__label">Electora / Elector (original):</span>{" "}
                        {officialVote.electorName}
                      </p>
                    )}
                    <p className="audit-issue__snippet">
                      <span className="audit-issue__label">Cadena actual (alterada):</span>{" "}
                      <code className="font-data">{issue.dataSnippet}</code>
                    </p>
                  </>
                )}
                {vote?.electorName && issue.kind !== "emission_mismatch" && (
                  <p className="audit-issue__snippet">
                    <span className="audit-issue__label">Electora / Elector afectado:</span>{" "}
                    {vote.electorName}
                    {" · "}
                    {CANDIDATES[vote.option].party} — {CANDIDATES[vote.option].name}
                  </p>
                )}
                {issue.dataSnippet && issue.kind !== "emission_mismatch" && (
                  <p className="audit-issue__snippet">
                    <span className="audit-issue__label">Contenido auditado:</span>{" "}
                    <code className="font-data">{issue.dataSnippet}</code>
                  </p>
                )}
                {issue.storedHash && issue.expectedHash && issue.kind === "hash_mismatch" && (
                  <dl className="audit-hash-compare">
                    <div>
                      <dt>Hash almacenado</dt>
                      <dd className="font-data">{shortHash(issue.storedHash)}</dd>
                    </div>
                    <div>
                      <dt>Hash recalculado</dt>
                      <dd className="font-data">{shortHash(issue.expectedHash)}</dd>
                    </div>
                  </dl>
                )}
                {issue.officialHash && issue.storedHash && issue.kind === "emission_mismatch" && (
                  <dl className="audit-hash-compare">
                    <div>
                      <dt>Hash en acta de emisión</dt>
                      <dd className="font-data">{shortHash(issue.officialHash)}</dd>
                    </div>
                    <div>
                      <dt>Hash en cadena actual</dt>
                      <dd className="font-data">{shortHash(issue.storedHash)}</dd>
                    </div>
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        validation.issues.length > 0 && (
          <ul className="audit-issues audit-issues--spaced">
            {validation.issues.map((issue) => (
              <li key={issue} className="audit-issue">
                {issue}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
