"use client";

import type { BlockDto } from "@/lib/types";
import { BlockCard } from "./BlockCard";
import { ChainConnector } from "./ChainConnector";

interface BlockRegistryProps {
  blocks: BlockDto[];
  selectedIndex: number | null;
  onSelectBlock: (index: number) => void;
}

export function BlockRegistry({ blocks, selectedIndex, onSelectBlock }: BlockRegistryProps) {
  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-medium text-[var(--text)]">Registro de bloques</h2>
        {blocks.length > 0 && (
          <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--accent)]">
            {blocks.length} {blocks.length === 1 ? "bloque" : "bloques"}
          </span>
        )}
      </div>
      {blocks.length > 0 && (
        <p className="font-mono text-[10px] text-[var(--muted)]">
          Índice 0 → {blocks.length - 1}
        </p>
      )}
    </div>
  );

  if (blocks.length === 0) {
    return (
      <div className="chain-panel">
        {header}
        <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)]">
            <span className="font-mono text-xs text-[var(--accent)]">0</span>
          </div>
          <p className="text-sm text-[var(--text)]">Sin bloques en la cadena</p>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[var(--muted)]">
            Inicia la cadena desde el panel izquierdo para crear el bloque génesis y ver el
            registro aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chain-panel">
      {header}

      <div className="chain-scroll">
        <div className="chain-track">
          {blocks.map((block, i) => (
            <div key={block.index} className="relative z-[1] flex items-stretch">
              <BlockCard
                block={block}
                isGenesis={i === 0}
                index={i}
                total={blocks.length}
                selected={selectedIndex === block.index}
                onSelect={() => onSelectBlock(block.index)}
              />
              {i < blocks.length - 1 && <ChainConnector />}
            </div>
          ))}
        </div>
      </div>

      <div className="chain-scroll-hint">
        <span>Desplaza para ver toda la cadena · clic en un bloque para el detalle</span>
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-[var(--accent)]">
          <path
            d="M2 7h8M8 4l3 3-3 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
