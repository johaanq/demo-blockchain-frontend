"use client";

import type { VoteOption } from "@/lib/demo-defaults";
import { CANDIDATES, ELECTION } from "@/lib/demo-defaults";

function PartyOption({
  option,
  selected,
  onSelect,
}: {
  option: VoteOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const c = CANDIDATES[option];
  const isKeiko = option === "KEIKO";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`ballot__option ${selected ? "ballot__option--selected" : ""}`}
      aria-pressed={selected}
      aria-label={`Votar por ${c.party}`}
    >
      <div className="ballot__check" aria-hidden>
        {selected ? "✓" : ""}
      </div>
      <div className={`ballot__logo-wrap ballot__logo-wrap--${isKeiko ? "fp" : "jxp"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.partyLogo}
          alt={c.partyLogoAlt}
          width={96}
          height={96}
          className="ballot__logo-img"
        />
      </div>
      <p className="ballot__party">{c.party}</p>
      <p className="ballot__candidate">{c.name}</p>
    </button>
  );
}

export function BallotSheet({
  selected,
  onSelect,
}: {
  selected: VoteOption | null;
  onSelect: (opt: VoteOption) => void;
}) {
  return (
    <div className="ballot" role="group" aria-label="Cédula presidencial virtual">
      <header className="ballot__header">
        <div className="ballot__header-row">
          <span className="ballot__header-org">ONPE — Oficina Nacional de Procesos Electorales</span>
          <span className="ballot__header-type">Cédula presidencial · {ELECTION.round}</span>
        </div>
        <p className="ballot__header-title">ELECCIONES GENERALES 2026 — SEGUNDA VUELTA</p>
        <p className="ballot__header-date">{ELECTION.runoffDate.toUpperCase()}</p>
      </header>
      <p className="ballot__instruction">
        Marque la organización política de su preferencia. Solo una opción.
      </p>
      <div className="ballot__grid">
        <PartyOption
          option="KEIKO"
          selected={selected === "KEIKO"}
          onSelect={() => onSelect("KEIKO")}
        />
        <PartyOption
          option="SANCHEZ"
          selected={selected === "SANCHEZ"}
          onSelect={() => onSelect("SANCHEZ")}
        />
      </div>
      <footer className="ballot__footer">
        Propuesta académica de sufragio digital — no reemplaza la cédula física oficial.
      </footer>
    </div>
  );
}
