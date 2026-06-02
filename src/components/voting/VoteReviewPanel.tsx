import { CANDIDATES, type VoteOption } from "@/lib/demo-defaults";

export function VoteReviewPanel({
  option,
  voterName,
  mesa,
  onBack,
  onConfirm,
  busy,
  disabled,
}: {
  option: VoteOption;
  voterName: string;
  mesa: string;
  onBack: () => void;
  onConfirm: () => void;
  busy: boolean;
  disabled: boolean;
}) {
  const c = CANDIDATES[option];

  return (
    <div className="onpe-panel">
      <div className="onpe-panel__head">
        <h2 className="onpe-panel__title">Revise su sufragio antes de emitir</h2>
        <p className="onpe-panel__desc">
          Confirme que la organización política seleccionada es correcta. Una vez emitido, el
          sufragio no puede modificarse (principio usado en votación digital de Estonia y EE.UU.).
        </p>
      </div>
      <div className="onpe-panel__body">
        <div className="review-card">
          <dl className="review-grid">
            <div>
              <dt>Electora / Elector</dt>
              <dd>{voterName}</dd>
            </div>
            <div>
              <dt>Mesa asignada (padrón)</dt>
              <dd className="font-data">{mesa}</dd>
            </div>
            <div className="review-grid__full">
              <dt>Su preferencia presidencial</dt>
              <dd className="review-choice">
                <strong>{c.party}</strong>
                <span>{c.name}</span>
              </dd>
            </div>
          </dl>
        </div>
        <div className="notice notice--warn mt-4">
          Al confirmar, su voto se registrará en la cadena de trazabilidad y recibirá un comprobante
          digital.
        </div>
        <div className="btn-row mt-5">
          <button type="button" className="btn btn--secondary" onClick={onBack} disabled={busy}>
            Volver a la cédula
          </button>
          <button
            type="button"
            className="btn btn--accent"
            onClick={onConfirm}
            disabled={busy || disabled}
          >
            {busy ? "Registrando y sellando sufragio…" : "Emitir sufragio definitivo"}
          </button>
        </div>
      </div>
    </div>
  );
}
