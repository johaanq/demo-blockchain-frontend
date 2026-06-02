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
      return "Contenido alterado";
    case "broken_link":
      return "Cadena rota";
    case "pow_pending":
      return "Sin sellar";
    case "pow_invalid":
      return "PoW inválido";
  }
}

export function TamperResultNotice({ result }: { result: TamperResult }) {
  return (
    <div className="notice notice--warn audit-notice">
      <p className="font-semibold">Registro #{result.index} modificado en la cadena (demostración)</p>
      <p className="mt-1">
        Esta acción <strong>sí altera de verdad</strong> el sufragio guardado: no es solo visual. Se cambió el
        contenido del bloque sin recalcular su hash SHA-256.
      </p>
      <dl className="audit-diff audit-diff--spaced">
        <div>
          <dt>Contenido anterior</dt>
          <dd className="font-data">{result.previousData}</dd>
        </div>
        <div>
          <dt>Contenido actual (alterado)</dt>
          <dd className="font-data">{result.data}</dd>
        </div>
        <div>
          <dt>Hash guardado (sin cambios)</dt>
          <dd className="font-data">{result.hash}</dd>
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
            return (
            <li key={`${issue.kind}-${issue.blockIndex}`} className="audit-issue">
              <div className="audit-issue__head">
                <span className="gov-badge gov-badge--info">{issueKindLabel(issue.kind)}</span>
                <strong>{issue.title}</strong>
              </div>
              <p className="audit-issue__detail">{issue.detail}</p>
              {vote?.electorName && (
                <p className="audit-issue__snippet">
                  <span className="audit-issue__label">Electora / Elector afectado:</span>{" "}
                  {vote.electorName}
                  {" · "}
                  {CANDIDATES[vote.option].party} — {CANDIDATES[vote.option].name}
                </p>
              )}
              {issue.dataSnippet && (
                <p className="audit-issue__snippet">
                  <span className="audit-issue__label">Contenido auditado:</span>{" "}
                  <code className="font-data">{issue.dataSnippet}</code>
                </p>
              )}
              {issue.storedHash && issue.expectedHash && issue.kind === "hash_mismatch" && (
                <dl className="audit-hash-compare">
                  <div>
                    <dt>Hash almacenado (al emitir)</dt>
                    <dd className="font-data">{shortHash(issue.storedHash)}</dd>
                  </div>
                  <div>
                    <dt>Hash recalculado (auditoría)</dt>
                    <dd className="font-data">{shortHash(issue.expectedHash)}</dd>
                  </div>
                </dl>
              )}
              {issue.storedHash && issue.expectedHash && issue.kind === "broken_link" && (
                <dl className="audit-hash-compare">
                  <div>
                    <dt>Hash anterior esperado</dt>
                    <dd className="font-data">{shortHash(issue.expectedHash)}</dd>
                  </div>
                  <div>
                    <dt>Hash anterior en este bloque</dt>
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
