import { VOTE_WIZARD_STEPS, type VoteWizardStep } from "@/lib/navigation";

export function VoteWizardProgress({ current }: { current: VoteWizardStep }) {
  const idx = VOTE_WIZARD_STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="wizard-progress" aria-label="Pasos del sufragio digital">
      {VOTE_WIZARD_STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li
            key={step.id}
            className={`wizard-progress__item ${done ? "wizard-progress__item--done" : ""} ${active ? "wizard-progress__item--on" : ""}`}
            aria-current={active ? "step" : undefined}
          >
            <span className="wizard-progress__num">{done ? "✓" : i + 1}</span>
            <span className="wizard-progress__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
