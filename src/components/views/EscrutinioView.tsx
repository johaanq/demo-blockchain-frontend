"use client";

import { OnpeLogo } from "@/components/brand/OnpeLogo";
import { BlockDetailPanel } from "@/components/BlockDetailPanel";
import { BlockRegistry } from "@/components/BlockRegistry";
import type { BlockDto, ValidationResult } from "@/lib/types";

function Btn({
  children,
  variant = "secondary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  return (
    <button type="button" className={`btn btn--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function EscrutinioView({
  blocks,
  difficulty,
  tamperIndex,
  tamperData,
  busy,
  initialized,
  selectedIndex,
  validation,
  onTamperIndexChange,
  onTamperDataChange,
  onTamper,
  onValidate,
  onSelectBlock,
  onCloseDetail,
}: {
  blocks: BlockDto[];
  difficulty: number;
  tamperIndex: string;
  tamperData: string;
  busy: boolean;
  initialized: boolean;
  selectedIndex: number | null;
  validation: ValidationResult | null;
  onTamperIndexChange: (v: string) => void;
  onTamperDataChange: (v: string) => void;
  onTamper: () => void;
  onValidate: () => void;
  onSelectBlock: (index: number) => void;
  onCloseDetail: () => void;
}) {
  const selected = blocks.find((b) => b.index === selectedIndex);

  return (
    <div className="page escrutinio-page">
      <header className="onpe-hero">
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

      {validation && (
        <div className={`notice ${validation.valid ? "notice--ok" : "notice--error"}`}>
          <p className="font-semibold">
            {validation.valid ? "Registros íntegros" : "Alteración detectada"}
          </p>
          <p className="mt-1">{validation.message}</p>
          {validation.issues.length > 0 && (
            <ul className="font-data mt-2 space-y-1 text-sm">
              {validation.issues.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          )}
        </div>
      )}

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
            onSelectBlock={onSelectBlock}
          />
        </div>
      </section>

      <div className="audit-grid">
        <div className="audit-grid__tools stack">
          <div className="card">
            <div className="card__head">
              <h2 className="card__title">Prueba de alteración</h2>
              <p className="card__desc">Simule un fraude y valide que la cadena lo detecta.</p>
            </div>
            <div className="card__body">
              <div className="form-row">
                <div className="form-row__field form-row__field--narrow">
                  <label className="label" htmlFor="tamper-i">
                    Registro #
                  </label>
                  <input
                    id="tamper-i"
                    type="number"
                    min={0}
                    className="input"
                    value={tamperIndex}
                    onChange={(e) => onTamperIndexChange(e.target.value)}
                  />
                </div>
                <div className="form-row__field">
                  <label className="label" htmlFor="tamper-d">
                    Nuevo contenido
                  </label>
                  <input
                    id="tamper-d"
                    className="input font-data text-xs"
                    value={tamperData}
                    onChange={(e) => onTamperDataChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="btn-row">
                <Btn variant="danger" disabled={busy || !initialized} onClick={onTamper}>
                  Simular alteración
                </Btn>
                <Btn disabled={busy || !initialized} onClick={onValidate}>
                  Validar integridad
                </Btn>
              </div>
            </div>
          </div>
        </div>

        <div className="audit-grid__detail">
          {selected ? (
            <BlockDetailPanel
              block={selected}
              isGenesis={selected.index === 0}
              difficulty={difficulty}
              onClose={onCloseDetail}
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
