"use client";

import { OnpeLogo } from "@/components/brand/OnpeLogo";
import { TamperResultNotice, ValidationResultPanel } from "@/components/audit/ValidationResultPanel";
import { BlockDetailPanel } from "@/components/BlockDetailPanel";
import { BlockRegistry } from "@/components/BlockRegistry";
import { useElection } from "@/context/ElectionProvider";

export function EscrutinioView() {
  const {
    blocks,
    difficulty,
    tamperIndex,
    tamperData,
    busy,
    initialized,
    selectedIndex,
    validation,
    lastTamper,
    setTamperIndex,
    setTamperData,
    tamper,
    validate,
    setSelectedIndex,
  } = useElection();

  const selected = blocks.find((b) => b.index === selectedIndex);

  return (
    <div className="page escrutinio-page">
      <header className="onpe-hero" id="contenido">
        <div className="onpe-hero__logos">
          <OnpeLogo height={56} />
        </div>
        <div className="onpe-hero__text">
          <p className="gov-kicker">Consulta y auditoría ciudadana</p>
          <h1 className="gov-page-title">Trazabilidad del sufragio digital</h1>
          <p className="gov-lead">
            Revise la cadena de sufragios emitidos, valide la integridad de los registros y
            compruebe que ningún voto fue alterado después de la emisión.
          </p>
        </div>
      </header>

      <ol className="stepper stepper--audit" aria-label="Proceso de auditoría">
        <li className="stepper__item stepper__item--on">
          <span className="stepper__num">1</span>
          Cadena de sufragios
        </li>
        <li className="stepper__item">
          <span className="stepper__num">2</span>
          Validación pública
        </li>
      </ol>

      {lastTamper && !validation && <TamperResultNotice result={lastTamper} />}

      {validation && <ValidationResultPanel validation={validation} blocks={blocks} />}

      <section className="chain-panel" aria-labelledby="chain-title">
        <div className="chain-panel__head">
          <div>
            <h2 id="chain-title" className="chain-panel__title">
              Cadena de sufragios
            </h2>
            <p className="chain-panel__desc">
              {blocks.length === 0
                ? "Sin registros — los electores deben completar el flujo en Votar en línea"
                : `${blocks.length} registros enlazados · seleccione uno para ver detalle`}
            </p>
          </div>
        </div>
        <div className="chain-panel__body">
          <BlockRegistry
            blocks={blocks}
            selectedIndex={selectedIndex}
            onSelectBlock={(index) => {
              setSelectedIndex(selectedIndex === index ? null : index);
            }}
          />
        </div>
      </section>

      <div className="audit-grid">
        <div className="audit-grid__tools stack">
          <div className="card">
            <div className="card__head">
              <h2 className="card__title">Demostración de alteración (solo auditoría)</h2>
              <p className="card__desc">
                Esta herramienta <strong>modifica de verdad</strong> el registro en la cadena — como
                lo haría un atacante: cambia el contenido del sufragio <em>sin</em> recalcular el
                hash SHA-256. Después pulse «Validar integridad» para ver cómo el sistema detecta el
                fraude.
              </p>
            </div>
            <div className="card__body">
              <div className="form-row">
                <div className="form-row__field form-row__field--narrow">
                  <label className="label" htmlFor="tamper-i">
                    Registro # a alterar
                  </label>
                  <input
                    id="tamper-i"
                    type="number"
                    min={0}
                    className="input"
                    value={tamperIndex}
                    onChange={(e) => setTamperIndex(e.target.value)}
                  />
                </div>
                <div className="form-row__field">
                  <label className="label" htmlFor="tamper-d">
                    Nuevo contenido fraudulento
                  </label>
                  <input
                    id="tamper-d"
                    className="input font-data text-xs"
                    value={tamperData}
                    onChange={(e) => setTamperData(e.target.value)}
                  />
                </div>
              </div>
              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn--danger"
                  disabled={busy || !initialized}
                  onClick={() => void tamper()}
                >
                  Alterar registro en la cadena
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  disabled={busy || !initialized}
                  onClick={() => void validate()}
                >
                  Validar integridad
                </button>
              </div>
              <p className="audit-panel-note">
                Paso 1: altere un registro · Paso 2: valide · El sistema comparará el hash guardado
                con el hash recalculado a partir del contenido actual.
              </p>
            </div>
          </div>
        </div>

        <div className="audit-grid__detail">
          {selected ? (
            <BlockDetailPanel
              block={selected}
              isGenesis={selected.index === 0}
              difficulty={difficulty}
              onClose={() => setSelectedIndex(null)}
            />
          ) : (
            <div className="empty-panel">
              <p className="empty-panel__title">Detalle del registro</p>
              <p className="empty-panel__text">
                Seleccione un bloque en la cadena para ver timestamp, hashes y estado del registro.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
