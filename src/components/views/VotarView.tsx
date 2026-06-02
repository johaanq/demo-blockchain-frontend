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
import { useElection } from "@/context/ElectionProvider";
import { buildVotePayload, ELECTION } from "@/lib/demo-defaults";
import {
  buildReceiptCode,
  findExistingVote,
  maskDni,
  verifyVoter,
  type VoterRecord,
} from "@/lib/voter-registry";

export function VotarView() {
  const {
    blocks: chainBlocks,
    busy,
    chainReady,
    difficulty,
    setDifficulty,
    voteSession,
    setVoteStep,
    setDni,
    setBirthDate,
    setVerifyError,
    setVoter,
    setSelected,
    setReceipt,
    resetVoteSession,
    registerVote,
  } = useElection();

  const { step, dni, birthDate, verifyError, voter, selected, receipt } = voteSession;
  const [verifying, setVerifying] = useState(false);

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
    setVoteStep("comprobante");
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
      setVoteStep("padron");
    } finally {
      setVerifying(false);
    }
  }

  async function handleCastVote() {
    if (!voter || !selected || !chainReady) return;
    const code = buildReceiptCode(voter.dni, selected);
    const payload = buildVotePayload(
      voter.mesa,
      maskDni(voter.dni),
      selected,
      code,
      voter.fullName,
    );
    try {
      await registerVote(payload);
      setReceipt({ code, at: new Date(), option: selected });
      setVoteStep("comprobante");
    } catch {
      /* error mostrado en ElectionProvider */
    }
  }

  const working = busy || verifying;

  return (
    <div className="page vote-page">
      <header className="onpe-hero" id="contenido">
        <div className="onpe-hero__logos">
          <OnpeLogo height={56} />
        </div>
        <div className="onpe-hero__text">
          <p className="gov-kicker">
            {ELECTION.name} · {ELECTION.round}
          </p>
          <h1 className="gov-page-title">
            {ELECTION.platformName} — {ELECTION.platformOrg}
          </h1>
          <p className="gov-lead">
            La ONPE es el organismo que organiza y ejecuta las elecciones en el Perú. Jornada del{" "}
            {ELECTION.runoffDate}. Identifíquese con su DNI para emitir su sufragio presidencial en
            línea.
          </p>
        </div>
      </header>

      <VoteWizardProgress current={step} />

      {!chainReady && (
        <div className="notice notice--warn">Conectando con el registro de sufragios…</div>
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
            <VoterPadronCard voter={voter} onContinue={() => setVoteStep("sufragio")} />
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
                    onClick={() => setVoteStep("padron")}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={!selected}
                    onClick={() => setVoteStep("revision")}
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
              onBack={() => setVoteStep("sufragio")}
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
              voterName={voter.fullName}
              timestamp={receipt.at}
              alreadyRegistered={receipt.alreadyRegistered}
              onNewVote={resetVoteSession}
            />
          )}
        </div>

        <aside className="page-columns__aside stack">
          <VotePowSettings
            difficulty={difficulty}
            disabled={busy}
            onDifficultyChange={(v) => void setDifficulty(v)}
          />
          <BlockchainGuide />
        </aside>
      </div>
    </div>
  );
}
