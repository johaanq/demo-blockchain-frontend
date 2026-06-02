import { CANDIDATES, parseVoteOption } from "@/lib/demo-defaults";
import type { BlockDto } from "@/lib/types";

export function BlockCard({
  block,
  isGenesis,
  selected,
  onSelect,
}: {
  block: BlockDto;
  isGenesis?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const vote = parseVoteOption(block.data);
  const barColor = isGenesis
    ? "var(--brand)"
    : vote
      ? CANDIDATES[vote].color
      : "var(--line)";

  return (
    <button
      type="button"
      className={`block ${selected ? "block--on" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="block__bar" style={{ background: barColor }} />
      <div className="block__inner">
        <p className="font-semibold text-[var(--ink)]">
          {isGenesis ? "Apertura de jornada" : `Registro ${block.index}`}
        </p>
        <p className="block__meta">
          {new Date(block.timestamp).toLocaleString("es", {
            dateStyle: "short",
            timeStyle: "short",
          })}
          {vote && ` · ${CANDIDATES[vote].party}`}
        </p>
        <p className="block__payload">{block.data}</p>
        <p className="font-data mt-2 text-[var(--muted)]">
          nonce {block.nonce.toLocaleString("es")}
        </p>
      </div>
    </button>
  );
}
