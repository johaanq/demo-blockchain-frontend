"use client";

import { useCallback, useEffect, useState } from "react";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader, StatusStrip } from "@/components/layout/AppHeader";
import { EscrutinioView } from "@/components/views/EscrutinioView";
import { VotarView } from "@/components/views/VotarView";
import { api } from "@/lib/api";
import { DEFAULT_TAMPER_PAYLOAD, DIFFICULTY_DEFAULT } from "@/lib/demo-defaults";
import type { AppView } from "@/lib/navigation";
import type { BlockDto, ValidationResult } from "@/lib/types";
import { MiningPlayback } from "@/lib/mining-playback";
import { addBlockStream, type MineStreamEvent } from "@/lib/mining-stream";
import { MiningTerminal, miningEventToLine, type MiningTerminalState } from "./MiningTerminal";

export function BlockchainDemo() {
  const [view, setView] = useState<AppView>("votar");
  const [blocks, setBlocks] = useState<BlockDto[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [tamperIndex, setTamperIndex] = useState("1");
  const [tamperData, setTamperData] = useState(DEFAULT_TAMPER_PAYLOAD);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ difficulty: number; initialized: boolean } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [miningUi, setMiningUi] = useState<MiningTerminalState | null>(null);
  const [isMining, setIsMining] = useState(false);

  const refresh = useCallback(async () => {
    try {
      let health = await api.health();
      if (!health.initialized) {
        await api.initChain();
        health = await api.health();
      }
      setMeta({ difficulty: health.difficulty, initialized: health.initialized });
      setDifficulty(health.difficulty);
      const chain = await api.getChain();
      setBlocks(chain.blocks);
      setSelectedIndex((prev) =>
        prev !== null && chain.blocks.some((b) => b.index === prev) ? prev : null,
      );
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

  async function handleRegisterVote(payload: string) {
    setError(null);
    setValidation(null);
    setIsMining(true);
    let targetPrefix = "0".repeat(difficulty);
    setMiningUi({ status: "mining", difficulty, targetPrefix, attempts: 0, lines: [] });

    const playback = new MiningPlayback(({ attempts, lines }) => {
      setMiningUi((u) => (u ? { ...u, attempts, lines } : u));
    });

    try {
      const result = await addBlockStream(payload, (ev: MineStreamEvent) => {
        if (ev.type === "start") {
          targetPrefix = ev.targetPrefix;
          setMiningUi((u) =>
            u ? { ...u, difficulty: ev.difficulty, targetPrefix: ev.targetPrefix } : u,
          );
        }
        if (ev.type === "tick") playback.enqueue(miningEventToLine(ev, targetPrefix));
      });

      const winLine = miningEventToLine(
        {
          type: "tick",
          attempt: result.attempts,
          nonce: result.block.nonce,
          hash: result.block.hash,
        },
        targetPrefix,
      );
      playback.enqueue(winLine);
      await playback.drain();

      setMiningUi((u) =>
        u
          ? {
              ...u,
              status: "success",
              attempts: result.attempts,
              finalHash: result.block.hash,
              lines: playback.getLines().slice(-30),
            }
          : u,
      );
      await refresh();
    } catch (e) {
      playback.stop();
      setError(e instanceof Error ? e.message : "Error al registrar sufragio");
      setMiningUi((u) =>
        u ? { ...u, status: "error", errorMessage: e instanceof Error ? e.message : "Error" } : u,
      );
      throw e;
    } finally {
      playback.stop();
      setIsMining(false);
    }
  }

  const busy = loading || isMining;
  const initialized = meta?.initialized ?? false;

  return (
    <div className="shell">
      <AppHeader view={view} onViewChange={setView} />
      <StatusStrip connected={meta !== null} blockCount={blocks.length} />

      <MiningTerminal state={miningUi} onClose={() => { setMiningUi(null); setIsMining(false); }} />

      <main className="main">
        <div className="wrap">
          {error && (
            <div className="notice notice--error notice--page" role="alert">
              <p className="font-semibold">No se pudo completar la operación</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {view === "votar" && (
            <VotarView
              busy={busy}
              chainReady={initialized && meta !== null}
              chainBlocks={blocks}
              difficulty={difficulty}
              onDifficultyChange={(v) =>
                run(async () => {
                  const res = await api.setDifficulty(v);
                  setDifficulty(res.difficulty);
                  setMeta((m) => (m ? { ...m, difficulty: res.difficulty } : m));
                })
              }
              onEscrutinio={() => setView("escrutinio")}
              onVote={async (payload) => {
                setLoading(true);
                try {
                  await handleRegisterVote(payload);
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}
          {view === "escrutinio" && (
            <EscrutinioView
              blocks={blocks}
              difficulty={difficulty}
              tamperIndex={tamperIndex}
              tamperData={tamperData}
              busy={busy}
              initialized={initialized}
              selectedIndex={selectedIndex}
              validation={validation}
              onTamperIndexChange={setTamperIndex}
              onTamperDataChange={setTamperData}
              onTamper={() =>
                run(async () => {
                  await api.tamper(parseInt(tamperIndex, 10), tamperData);
                  setValidation(null);
                  await refresh();
                })
              }
              onValidate={() => run(async () => setValidation(await api.validate()))}
              onSelectBlock={(index) => {
                setSelectedIndex((prev) => (prev === index ? null : index));
              }}
              onCloseDetail={() => setSelectedIndex(null)}
            />
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
