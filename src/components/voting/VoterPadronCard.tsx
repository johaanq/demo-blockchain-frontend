import type { VoterRecord } from "@/lib/voter-registry";
import { maskDni } from "@/lib/voter-registry";

export function VoterPadronCard({
  voter,
  onContinue,
}: {
  voter: VoterRecord;
  onContinue: () => void;
}) {
  return (
    <div className="onpe-panel">
      <div className="onpe-panel__head">
        <h2 className="onpe-panel__title">Consulta al padrón electoral</h2>
        <p className="onpe-panel__desc">
          Elector habilitado para la segunda vuelta. Su mesa de sufragio se asigna automáticamente
          según el padrón ONPE — no debe ingresarla manualmente.
        </p>
      </div>
      <div className="onpe-panel__body">
        <div className="padron-card">
          <div className="padron-card__status">
            <span className="gov-badge gov-badge--ok">Habilitado para votar</span>
          </div>
          <dl className="padron-grid">
            <div>
              <dt>Electora / Elector</dt>
              <dd>{voter.fullName}</dd>
            </div>
            <div>
              <dt>DNI</dt>
              <dd className="font-data">{maskDni(voter.dni)}</dd>
            </div>
            <div>
              <dt>Mesa de sufragio asignada</dt>
              <dd className="font-data">{voter.mesa}</dd>
            </div>
            <div>
              <dt>Local de votación</dt>
              <dd>{voter.localVotacion}</dd>
            </div>
            <div>
              <dt>Distrito / Provincia / Departamento</dt>
              <dd>
                {voter.distrito}, {voter.provincia}, {voter.departamento}
              </dd>
            </div>
            {voter.identitySource && (
              <div className="padron-grid__full">
                <dt>Verificación de identidad</dt>
                <dd className="text-sm font-normal text-[var(--ink-soft)]">
                  {voter.identitySource}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <button type="button" className="btn btn--primary btn-block mt-5" onClick={onContinue}>
          Continuar al sufragio presidencial
        </button>
      </div>
    </div>
  );
}
