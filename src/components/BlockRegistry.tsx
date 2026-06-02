"use client";

import type { BlockDto } from "@/lib/types";
import { BlockCard } from "./BlockCard";
import { ChainConnector } from "./ChainConnector";

export function BlockRegistry({
  blocks,
  selectedIndex,
  onSelectBlock,
}: {
  blocks: BlockDto[];
  selectedIndex: number | null;
  onSelectBlock: (index: number) => void;
}) {
  if (blocks.length === 0) {
    return (
      <p className="chain-empty">
        No hay registros. Los electores deben completar el flujo en Votar en línea.
      </p>
    );
  }

  return (
    <div className="chain-wrap">
      <div className="chain-row">
        {blocks.map((block, i) => (
          <div key={block.index} className="chain-row__segment">
            <BlockCard
              block={block}
              isGenesis={i === 0}
              selected={selectedIndex === block.index}
              onSelect={() => onSelectBlock(block.index)}
            />
            {i < blocks.length - 1 && <ChainConnector />}
          </div>
        ))}
      </div>
    </div>
  );
}
