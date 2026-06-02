"use client";

import { CANDIDATES, parseVoteRecord } from "@/lib/demo-defaults";
import type {
  BlockDto,
  EmissionComparison,
  TamperResult,
  ValidationIssueDetail,
  ValidationResult,
} from "@/lib/types";

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

function EmissionCompareRow({ row }: { row: EmissionComparison }) {
  const officialVote = parseVoteRecord(row.officialData);
  const chainVote = parseVoteRecord(row.chainData);

  return (
    <tr className="audit-compare-row audit-compare-row--mismatch">
      <td className="audit-compare-row__index">#{row.blockIndex}</td>
      <td className="audit-compare-row__cell">
        <p className="audit-compare-row__source">Acta de emisión (inmutable)</p>
        <code className="font-data audit-compare-row__data">{row.officialData}</code>
        {officialVote?.electorName && (
          <p className="audit-compare-row__meta">{officialVote.electorName}</p>
        )}
        <p className="audit-compare-row__hash-label">Hash oficial</p>
        <code className="font-data audit-compare-row__hash">{row.officialHash}</code>
      </td>
      <td className="audit-compare-row__cell">
        <p className="audit-compare-row__source">Cadena blockchain (actual)</p>
        <code className="font-data audit-compare-row__data">{row.chainData}</code>
        {chainVote?.electorName && (
          <p className="audit-compare-row__meta">{chainVote.electorName}</p>
        )}
        <p className="audit-compare-row__hash-label">Hash en cadena</p>
        <code className="font-data audit-compare-row__hash">{row.chainHash}</code>
      </td>
    </tr>
  );
}

function EmissionComparisonTable({ comparisons }: { comparisons: EmissionComparison[] }) {
  const mismatches = comparisons.filter((c) => !c.matches);
  if (mismatches.length === 0) return null;

  return (
    <div className="audit-compare">
      <p className="audit-compare__title">
        Comparación real acta de emisión vs cadena blockchain
        <span className="audit-compare__count">
          {" "}
          — {mismatches.length} registro(s) alterado(s)
        </span>
      </p>
      <div className="audit-compare__scroll">
        <table className="audit-compare-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Acta de emisión (original)</th>
              <th scope="col">Cadena blockchain (actual)</th>
            </tr>
          </thead>
          <tbody>
            {mismatches.map((row) => (
              <EmissionCompareRow key={row.blockIndex} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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
        {" "}Pulse «Validar integridad» para ver la comparación contra el acta de emisión.
      </p>
      <dl className="audit-diff audit-diff--spaced">
        <div>
          <dt>Acta de emisión (original)</dt>
          <dd className="font-data">{result.previousData}</dd>
        </div>
        <div>
          <dt>Cadena blockchain (alterada)</dt>
          <dd className="font-data">{result.data}</dd>
        </div>
        <div>
          <dt>Hash acta → hash cadena</dt>
          <dd className="font-data">
            {result.previousHash} → {result.hash} (nonce {result.nonce.toLocaleString("es")})
          </dd>
        </div>
      </dl>
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
  const comparisons = validation.emissionComparisons ?? [];
  const mismatches = comparisons.filter((c) => !c.matches);
  const structuralIssues = validation.issueDetails.filter((d) => d.kind !== "emission_mismatch");

  if (validation.valid) {
    return (
      <div className="notice notice--ok audit-notice audit-result--bottom">
        <p className="font-semibold">Registros íntegros</p>
        <p className="mt-1">Todos los sufragios coinciden con el acta de emisión.</p>
      </div>
    );
  }

  return (
    <div className="audit-result audit-result--bottom">
      {structuralIssues.length > 0 && (
        <div className="notice notice--error audit-notice">
          <ul className="audit-issues">
            {structuralIssues.map((issue) => {
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
                  {issue.storedHash && issue.expectedHash && (
                    <dl className="audit-hash-compare">
                      <div>
                        <dt>Hash almacenado</dt>
                        <dd className="font-data">{issue.storedHash}</dd>
                      </div>
                      <div>
                        <dt>Hash recalculado</dt>
                        <dd className="font-data">{issue.expectedHash}</dd>
                      </div>
                    </dl>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {mismatches.length > 0 && <EmissionComparisonTable comparisons={comparisons} />}

      {mismatches.length === 0 && structuralIssues.length === 0 && validation.issues.length > 0 && (
        <div className="notice notice--error audit-notice">
          <ul className="audit-issues">
            {validation.issues.map((issue) => (
              <li key={issue} className="audit-issue">
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
