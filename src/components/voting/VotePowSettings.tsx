import { DIFFICULTY_MAX, DIFFICULTY_MIN } from "@/lib/demo-defaults";

export function VotePowSettings({
  difficulty,
  disabled,
  onDifficultyChange,
}: {
  difficulty: number;
  disabled?: boolean;
  onDifficultyChange: (value: number) => void;
}) {
  const prefix = "0".repeat(difficulty);

  return (
    <section className="vote-pow-panel" aria-labelledby="vote-pow-title">
      <h2 id="vote-pow-title" className="vote-pow-panel__title">
        Prueba de trabajo (PoW)
      </h2>
      <p className="vote-pow-panel__desc">
        Ajuste cuántos ceros iniciales debe tener el hash al <strong>emitir</strong> un sufragio. Se
        aplica al confirmar el voto, no en auditoría.
      </p>
      <div className="pow-control">
        <input
          type="range"
          min={DIFFICULTY_MIN}
          max={DIFFICULTY_MAX}
          value={difficulty}
          disabled={disabled}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
          className="pow-control__range"
          aria-valuemin={DIFFICULTY_MIN}
          aria-valuemax={DIFFICULTY_MAX}
          aria-valuenow={difficulty}
          aria-label="Dificultad PoW: ceros iniciales del hash"
        />
        <span className="pow-control__value">{difficulty}</span>
      </div>
      <p className="vote-pow-panel__hint font-data">
        Hash objetivo: «{prefix}…»
      </p>
      <p className="vote-pow-panel__note">
        Más ceros = más intentos y más tiempo al registrar el voto.
      </p>
    </section>
  );
}
