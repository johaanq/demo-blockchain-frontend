import { BLOCKCHAIN_GUIDE } from "@/lib/blockchain-guide";
import { ELECTION } from "@/lib/demo-defaults";

export function BlockchainGuide({ onEscrutinio }: { onEscrutinio?: () => void }) {
  return (
    <aside className="guide-panel">
      <div className="guide-panel__head">
        <h2 className="guide-panel__title">{BLOCKCHAIN_GUIDE.title}</h2>
        <p className="guide-panel__intro">{BLOCKCHAIN_GUIDE.intro}</p>
      </div>
      <ol className="guide-steps">
        {BLOCKCHAIN_GUIDE.steps.map((step, i) => (
          <li key={step.title} className="guide-step">
            <span className="guide-step__num">{i + 1}</span>
            <div>
              <p className="guide-step__title">{step.title}</p>
              <p className="guide-step__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="guide-glossary">
        <p className="guide-glossary__label">Conceptos</p>
        {BLOCKCHAIN_GUIDE.fields.map((f) => (
          <p key={f.term} className="guide-glossary__row">
            <strong>{f.term}</strong> — {f.def}
          </p>
        ))}
      </div>
      {onEscrutinio && (
        <button type="button" className="btn btn--secondary btn-block mt-4" onClick={onEscrutinio}>
          Ver trazabilidad del sufragio →
        </button>
      )}
      <p className="guide-disclaimer">{ELECTION.disclaimer}</p>
    </aside>
  );
}
