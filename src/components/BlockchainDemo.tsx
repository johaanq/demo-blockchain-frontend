"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  DEFAULT_BLOCK_PAYLOAD,
  DEFAULT_TAMPER_PAYLOAD,
  DIFFICULTY_DEFAULT,
} from "@/lib/demo-defaults";
import type { BlockDto, ValidationResult } from "@/lib/types";
import { AppHeader } from "./AppHeader";
import { BlockDetailPanel } from "./BlockDetailPanel";
import { BlockRegistry } from "./BlockRegistry";
import { DemoControls } from "./DemoControls";
import { MiningPlayback } from "@/lib/mining-playback";
import { mineBlockStream } from "@/lib/mining-stream";
import { MiningTerminal, miningEventToLine, type MiningTerminalState } from "./MiningTerminal";
import { ValidationBanner } from "./ValidationBanner";

export function BlockchainDemo() {
  const [blocks, setBlocks] = useState<BlockDto[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [txData, setTxData] = useState(DEFAULT_BLOCK_PAYLOAD);
  const [tamperIndex, setTamperIndex] = useState("1");
  const [tamperData, setTamperData] = useState(DEFAULT_TAMPER_PAYLOAD);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ difficulty: number; initialized: boolean } | null>(null);
  const [mineNote, setMineNote] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [miningUi, setMiningUi] = useState<MiningTerminalState | null>(null);
  const [isMining, setIsMining] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const health = await api.health();
      setMeta({ difficulty: health.difficulty, initialized: health.initialized });
      setDifficulty(health.difficulty);
      if (health.initialized) {
        const chain = await api.getChain();
        setBlocks(chain.blocks);
        setSelectedIndex((prev) => {
          if (prev === null) return prev;
          return chain.blocks.some((b) => b.index === prev) ? prev : null;
        });
      } else {
        setBlocks([]);
        setSelectedIndex(null);
      }
      return true;
    } catch {
      setMeta(null);
      setBlocks([]);
      return false;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function run<T>(fn: () => Promise<T>) {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  const connected = meta !== null;

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <MiningTerminal
        state={miningUi}
        onClose={() => {
          setMiningUi(null);
          setIsMining(false);
        }}
      />
      <AppHeader
        connected={connected}
        difficulty={meta?.difficulty}
        blockCount={blocks.length}
      />

      <div className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-6 sm:px-8 sm:py-8">
        {error && (
          <div
            className="mb-6 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--link)]"
            role="alert"
          >
            <p className="font-medium">Error</p>
            <p className="mt-0.5 text-[var(--muted)]">{error}</p>
            {(error.includes("fetch") || error.includes("Failed")) && (
              <p className="mt-2 font-mono text-xs text-[var(--muted)]">
                Verifica el backend: docker compose up en demo-blockchain-backend
              </p>
            )}
          </div>
        )}

        {mineNote && (
          <p className="mb-4 font-mono text-xs text-[var(--accent)]">{mineNote}</p>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-10">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <DemoControls
              txData={txData}
              tamperIndex={tamperIndex}
              tamperData={tamperData}
              difficulty={difficulty}
              loading={loading || isMining}
              onTxChange={setTxData}
              onTamperIndexChange={setTamperIndex}
              onTamperDataChange={setTamperData}
              onDifficultyChange={(value) =>
                run(async () => {
                  const res = await api.setDifficulty(value);
                  setDifficulty(res.difficulty);
                  setMeta((m) => (m ? { ...m, difficulty: res.difficulty } : m));
                })
              }
              onInit={() =>
                run(async () => {
                  const res = await api.initChain();
                  setBlocks(res.blocks);
                  setValidation(null);
                  setMineNote(null);
                  setSelectedIndex(0);
                  await refresh();
                })
              }
              onAdd={() =>
                run(async () => {
                  await api.addBlock(txData);
                  setValidation(null);
                  await refresh();
                })
              }
              onMine={async () => {
                setError(null);
                setValidation(null);
                setMineNote(null);
                setIsMining(true);

                let targetPrefix = "0".repeat(difficulty);
                setMiningUi({
                  status: "mining",
                  difficulty,
                  targetPrefix,
                  attempts: 0,
                  lines: [],
                });

                const playback = new MiningPlayback(({ attempts, lines }) => {
                  setMiningUi((u) => (u ? { ...u, attempts, lines } : u));
                });

                try {
                  const res = await mineBlockStream(txData, (ev) => {
                    if (ev.type === "start") {
                      targetPrefix = ev.targetPrefix;
                      setMiningUi((u) =>
                        u
                          ? {
                              ...u,
                              difficulty: ev.difficulty,
                              targetPrefix: ev.targetPrefix,
                            }
                          : u,
                      );
                    }
                    if (ev.type === "tick") {
                      playback.enqueue(miningEventToLine(ev, targetPrefix));
                    }
                  });

                  const winLine = miningEventToLine(
                    {
                      type: "tick",
                      attempt: res.attempts,
                      nonce: res.block.nonce,
                      hash: res.block.hash,
                    },
                    targetPrefix,
                  );
                  playback.enqueue(winLine);
                  await playback.drain();

                  const finalLines = [...playback.getLines()];
                  if (finalLines[finalLines.length - 1]?.hash !== res.block.hash) {
                    finalLines.push(winLine);
                  }

                  setMiningUi((u) =>
                    u
                      ? {
                          ...u,
                          status: "success",
                          attempts: res.attempts,
                          finalHash: res.block.hash,
                          lines: finalLines.slice(-30),
                        }
                      : u,
                  );

                  setMineNote(
                    `Minado tras ${res.attempts.toLocaleString("es")} intentos · dificultad ${res.difficulty}`,
                  );
                  await refresh();
                } catch (e) {
                  playback.stop();
                  setError(e instanceof Error ? e.message : "Error al minar");
                  setMiningUi((u) =>
                    u
                      ? {
                          ...u,
                          status: "error",
                          errorMessage: e instanceof Error ? e.message : "Error",
                        }
                      : u,
                  );
                } finally {
                  playback.stop();
                  setIsMining(false);
                }
              }}
              onValidate={() =>
                run(async () => {
                  const res = await api.validate();
                  setValidation(res);
                })
              }
              onTamper={() =>
                run(async () => {
                  const idx = parseInt(tamperIndex, 10);
                  await api.tamper(idx, tamperData);
                  setValidation(null);
                  await refresh();
                })
              }
            />
          </aside>

          <div className="min-w-0 space-y-6">
            <ValidationBanner result={validation} />

            <BlockRegistry
              blocks={blocks}
              selectedIndex={selectedIndex}
              onSelectBlock={(index) =>
                setSelectedIndex((prev) => (prev === index ? null : index))
              }
            />

            {selectedIndex !== null && blocks.length > 0 && (() => {
              const block = blocks.find((b) => b.index === selectedIndex);
              if (!block) return null;
              const genesis = block.index === 0;
              return (
                <div className="border-t border-[var(--border-subtle)] pt-6">
                  <BlockDetailPanel
                    block={block}
                    isGenesis={genesis}
                    difficulty={difficulty}
                    onClose={() => setSelectedIndex(null)}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
