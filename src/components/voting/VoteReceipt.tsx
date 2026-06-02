import { CANDIDATES, ELECTION, type VoteOption } from "@/lib/demo-defaults";

export function VoteReceipt({
  receiptCode,
  option,
  mesa,
  timestamp,
  alreadyRegistered = false,
  onEscrutinio,
  onNewVote,
}: {
  receiptCode: string;
  option: VoteOption;
  mesa: string;
  timestamp: Date;
  alreadyRegistered?: boolean;
  onEscrutinio: () => void;
  onNewVote: () => void;
}) {
  const c = CANDIDATES[option];

  return (
    <div className="onpe-panel onpe-panel--receipt">
      <div className="onpe-panel__head">
        <h2 className="onpe-panel__title">
          {alreadyRegistered ? "Sufragio ya registrado" : "Comprobante de sufragio digital"}
        </h2>
        <p className="onpe-panel__desc">
          {alreadyRegistered
            ? "Este DNI ya emitió su voto en la jornada electoral. A continuación se muestra su comprobante registrado en la cadena."
            : "Conserve este código para verificar que su voto fue registrado."}
        </p>
      </div>
      <div className="onpe-panel__body">
        <div className="receipt-card">
          <p className="receipt-card__org">{ELECTION.platformOrg} · {ELECTION.name}</p>
          <p className="receipt-card__code font-data">{receiptCode}</p>
          <dl className="receipt-grid">
            <div>
              <dt>Fecha y hora</dt>
              <dd>
                {timestamp.toLocaleString("es-PE", {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </dd>
            </div>
            <div>
              <dt>Mesa (padrón)</dt>
              <dd className="font-data">{mesa}</dd>
            </div>
            <div>
              <dt>Preferencia registrada</dt>
              <dd>
                {c.party} — {c.name}
              </dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <span className="gov-badge gov-badge--ok">
                  {alreadyRegistered ? "Sufragio confirmado" : "Sufragio emitido"}
                </span>
              </dd>
            </div>
          </dl>
        </div>
        <div className="btn-row mt-5">
          <button type="button" className="btn btn--secondary" onClick={onEscrutinio}>
            Consultar trazabilidad
          </button>
          <button type="button" className="btn btn--ghost" onClick={onNewVote}>
            {alreadyRegistered ? "Salir" : "Cerrar sesión de voto"}
          </button>
        </div>
      </div>
    </div>
  );
}
