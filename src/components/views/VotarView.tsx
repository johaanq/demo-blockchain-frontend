"use client";

import { useState } from "react";
import { BallotSheet } from "@/components/ballot/BallotSheet";
import { OnpeLogo } from "@/components/brand/OnpeLogo";
import { BlockchainGuide } from "@/components/BlockchainGuide";
import { VotePowSettings } from "@/components/voting/VotePowSettings";
import { VoteReceipt } from "@/components/voting/VoteReceipt";
import { VoteReviewPanel } from "@/components/voting/VoteReviewPanel";
import { VoteWizardProgress } from "@/components/voting/VoteWizardProgress";
import { VoterPadronCard } from "@/components/voting/VoterPadronCard";
import { VoterVerificationForm } from "@/components/voting/VoterVerificationForm";
import { buildVotePayload, ELECTION, type VoteOption } from "@/lib/demo-defaults";
import type { VoteWizardStep } from "@/lib/navigation";
import type { BlockDto } from "@/lib/types";
import {
  buildReceiptCode,
  findExistingVote,
  maskDni,
  verifyVoter,
  type VoterRecord,
} from "@/lib/voter-registry";

export function VotarView({
  busy,
  chainReady,
  chainBlocks,
  difficulty,
  onDifficultyChange,
  onVote,
  onEscrutinio,
}: {
  busy: boolean;
  chainReady: boolean;
  chainBlocks: BlockDto[];
  difficulty: number;
  onDifficultyChange: (value: number) => void;
  onVote: (payload: string) => void | Promise<void>;
  onEscrutinio: () => void;
}) {
  const [step, setStep] = useState<VoteWizardStep>("identidad");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [voter, setVoter] = useState<VoterRecord | null>(null);
  const [selected, setSelected] = useState<VoteOption | null>(null);
  const [receipt, setReceipt] = useState<{
    code: string;
    at: Date;
    option: VoteOption;
    alreadyRegistered?: boolean;
  } | null>(null);

  function showExistingVote(v: VoterRecord) {
    const existing = findExistingVote(v.dni, chainBlocks);
    if (!existing) return false;

    setVoter(v);
    setReceipt({
      code: existing.receiptCode,
      at: existing.timestamp,
      option: existing.option,
      alreadyRegistered: true,
    });
    setStep("comprobante");
    return true;
  }

  async function handleVerify() {
    setVerifyError(null);
    setVerifying(true);
    try {
      const result = await verifyVoter(dni, birthDate);
      if (!result.ok) {
        setVerifyError(result.message);
        return;
      }
      if (showExistingVote(result.voter)) return;

      setVoter(result.voter);
      setStep("padron");
    } finally {
      setVerifying(false);
    }
  }

  async function handleCastVote() {
    if (!voter || !selected || !chainReady) return;
    const code = buildReceiptCode(voter.dni, selected);
    const payload = buildVotePayload(voter.mesa, maskDni(voter.dni), selected, code);
    try {
      await onVote(payload);
      setReceipt({ code, at: new Date(), option: selected });
      setStep("comprobante");
    } catch {
      /* error mostrado en BlockchainDemo */
    }
  }

  function resetSession() {
    setStep("identidad");
    setDni("");
    setBirthDate("");
    setVerifyError(null);
    setVoter(null);
    setSelected(null);
    setReceipt(null);
  }

  const working = busy || verifying;

  return (
    <div className="page vote-page">
      <header className="onpe-hero" id="contenido">
        <div className="onpe-hero__logos">
          <OnpeLogo height={56} />
        </div>
        <div className="onpe-hero__text">
          <p className="gov-kicker">{ELECTION.name} · {ELECTION.round}</p>
          <h1 className="gov-page-title">{ELECTION.platformName} — {ELECTION.platformOrg}</h1>
          <p className="gov-lead">
            La ONPE es el organismo que organiza y ejecuta las elecciones en el Perú. Jornada del{" "}
            {ELECTION.runoffDate}. Identifíquese con su DNI para emitir su sufragio presidencial en
            línea.
          </p>
        </div>
      </header>

      <VoteWizardProgress current={step} />

      {!chainReady && (
        <div className="notice notice--warn">
          Conectando con el registro de sufragios…
        </div>
      )}

      <div className="page-columns page-columns--vote">
        <div className="page-columns__main stack">
          {step === "identidad" && (
            <VoterVerificationForm
              dni={dni}
              birthDate={birthDate}
              error={verifyError}
              busy={verifying}
              onDniChange={setDni}
              onBirthDateChange={setBirthDate}
              onSubmit={handleVerify}
            />
          )}

          {step === "padron" && voter && (
            <VoterPadronCard voter={voter} onContinue={() => setStep("sufragio")} />
          )}

          {step === "sufragio" && voter && (
            <section className="onpe-panel">
              <div className="onpe-panel__head">
                <h2 className="onpe-panel__title">Cédula presidencial virtual</h2>
                <p className="onpe-panel__desc">
                  Marque una sola organización política. Mesa {voter.mesa} · {voter.distrito}
                </p>
              </div>
              <div className="onpe-panel__body onpe-panel__body--ballot">
                <BallotSheet selected={selected} onSelect={setSelected} />
                <div className="btn-row mt-5">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setStep("padron")}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={!selected}
                    onClick={() => setStep("revision")}
                  >
                    Revisar sufragio
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === "revision" && voter && selected && (
            <VoteReviewPanel
              option={selected}
              voterName={voter.fullName}
              mesa={voter.mesa}
              onBack={() => setStep("sufragio")}
              onConfirm={handleCastVote}
              busy={working}
              disabled={!chainReady}
            />
          )}

          {step === "comprobante" && receipt && voter && (
            <VoteReceipt
              receiptCode={receipt.code}
              option={receipt.option}
              mesa={voter.mesa}
              timestamp={receipt.at}
              alreadyRegistered={receipt.alreadyRegistered}
              onEscrutinio={onEscrutinio}
              onNewVote={resetSession}
            />
          )}
        </div>

        <aside className="page-columns__aside stack">
          <VotePowSettings
            difficulty={difficulty}
            disabled={busy}
            onDifficultyChange={onDifficultyChange}
          />
          <BlockchainGuide onEscrutinio={onEscrutinio} />
        </aside>
      </div>
    </div>
  );
}
