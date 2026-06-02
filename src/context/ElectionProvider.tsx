"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MiningTerminal, miningEventToLine, type MiningTerminalState } from "@/components/MiningTerminal";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader, StatusStrip } from "@/components/layout/AppHeader";
import { api } from "@/lib/api";
import { DEFAULT_TAMPER_PAYLOAD, DIFFICULTY_DEFAULT, type VoteOption } from "@/lib/demo-defaults";
import type { VoteWizardStep } from "@/lib/navigation";
import { MiningPlayback } from "@/lib/mining-playback";
import { addBlockStream, type MineStreamEvent } from "@/lib/mining-stream";
import type { BlockDto, TamperResult, ValidationResult } from "@/lib/types";
import type { VoterRecord } from "@/lib/voter-registry";

const VOTE_SESSION_KEY = "voto-digital-vote-session";

type StoredReceipt = {
  code: string;
  at: string;
  option: VoteOption;
  alreadyRegistered?: boolean;
};

type VoteSessionState = {
  step: VoteWizardStep;
  dni: string;
  birthDate: string;
  verifyError: string | null;
  voter: VoterRecord | null;
  selected: VoteOption | null;
  receipt: {
    code: string;
    at: Date;
    option: VoteOption;
    alreadyRegistered?: boolean;
  } | null;
};

type ElectionContextValue = {
  blocks: BlockDto[];
  validation: ValidationResult | null;
  tamperIndex: string;
  tamperData: string;
  difficulty: number;
  busy: boolean;
  error: string | null;
  chainReady: boolean;
  initialized: boolean;
  selectedIndex: number | null;
  lastTamper: TamperResult | null;
  voteSession: VoteSessionState;
  setTamperIndex: (v: string) => void;
  setTamperData: (v: string) => void;
  setDifficulty: (v: number) => Promise<void>;
  setSelectedIndex: (index: number | null) => void;
  setVoteStep: (step: VoteWizardStep) => void;
  setDni: (dni: string) => void;
  setBirthDate: (birthDate: string) => void;
  setVerifyError: (error: string | null) => void;
  setVoter: (voter: VoterRecord | null) => void;
  setSelected: (option: VoteOption | null) => void;
  setReceipt: (receipt: VoteSessionState["receipt"]) => void;
  resetVoteSession: () => void;
  registerVote: (payload: string) => Promise<void>;
  tamper: () => Promise<void>;
  validate: () => Promise<void>;
  clearError: () => void;
};

const defaultVoteSession: VoteSessionState = {
  step: "identidad",
  dni: "",
  birthDate: "",
  verifyError: null,
  voter: null,
  selected: null,
  receipt: null,
};

const ElectionContext = createContext<ElectionContextValue | null>(null);

function loadVoteSession(): VoteSessionState {
  if (typeof window === "undefined") return defaultVoteSession;
  try {
    const raw = sessionStorage.getItem(VOTE_SESSION_KEY);
    if (!raw) return defaultVoteSession;
    const parsed = JSON.parse(raw) as {
      step?: VoteWizardStep;
      dni?: string;
      birthDate?: string;
      verifyError?: string | null;
      voter?: VoterRecord | null;
      selected?: VoteOption | null;
      receipt?: StoredReceipt | null;
    };
    return {
      step: parsed.step ?? "identidad",
      dni: parsed.dni ?? "",
      birthDate: parsed.birthDate ?? "",
      verifyError: parsed.verifyError ?? null,
      voter: parsed.voter ?? null,
      selected: parsed.selected ?? null,
      receipt: parsed.receipt
        ? {
            code: parsed.receipt.code,
            at: new Date(parsed.receipt.at),
            option: parsed.receipt.option,
            alreadyRegistered: parsed.receipt.alreadyRegistered,
          }
        : null,
    };
  } catch {
    return defaultVoteSession;
  }
}

function saveVoteSession(session: VoteSessionState) {
  if (typeof window === "undefined") return;
  const payload = {
    step: session.step,
    dni: session.dni,
    birthDate: session.birthDate,
    verifyError: session.verifyError,
    voter: session.voter,
    selected: session.selected,
    receipt: session.receipt
      ? {
          code: session.receipt.code,
          at: session.receipt.at.toISOString(),
          option: session.receipt.option,
          alreadyRegistered: session.receipt.alreadyRegistered,
        }
      : null,
  };
  sessionStorage.setItem(VOTE_SESSION_KEY, JSON.stringify(payload));
}

export function ElectionProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<BlockDto[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [tamperIndex, setTamperIndex] = useState("1");
  const [tamperData, setTamperData] = useState(DEFAULT_TAMPER_PAYLOAD);
  const [difficulty, setDifficultyState] = useState(DIFFICULTY_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ difficulty: number; initialized: boolean } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lastTamper, setLastTamper] = useState<TamperResult | null>(null);
  const [miningUi, setMiningUi] = useState<MiningTerminalState | null>(null);
  const [isMining, setIsMining] = useState(false);
  const [voteSession, setVoteSession] = useState<VoteSessionState>(defaultVoteSession);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setVoteSession(loadVoteSession());
    setSessionReady(true);
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    saveVoteSession(voteSession);
  }, [voteSession, sessionReady]);

  const refresh = useCallback(async () => {
    try {
      let health = await api.health();
      if (!health.initialized) {
        await api.initChain();
        health = await api.health();
      }
      setMeta({ difficulty: health.difficulty, initialized: health.initialized });
      setDifficultyState(health.difficulty);
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

  const patchVoteSession = useCallback((patch: Partial<VoteSessionState>) => {
    setVoteSession((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetVoteSession = useCallback(() => {
    setVoteSession(defaultVoteSession);
  }, []);

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

  const registerVote = useCallback(
    async (payload: string) => {
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
    },
    [difficulty, refresh],
  );

  const setDifficulty = useCallback(async (value: number) => {
    await run(async () => {
      const res = await api.setDifficulty(value);
      setDifficultyState(res.difficulty);
      setMeta((m) => (m ? { ...m, difficulty: res.difficulty } : m));
    });
  }, []);

  const tamper = useCallback(async () => {
    await run(async () => {
      const index = parseInt(tamperIndex, 10);
      const result = await api.tamper(index, tamperData);
      setLastTamper(result);
      setValidation(null);
      setSelectedIndex(index);
      await refresh();
    });
  }, [tamperData, tamperIndex, refresh]);

  const validate = useCallback(async () => {
    await run(async () => {
      const result = await api.validate();
      setValidation({
        ...result,
        issueDetails: result.issueDetails ?? [],
      });
    });
  }, []);

  const busy = loading || isMining;
  const initialized = meta?.initialized ?? false;
  const chainReady = initialized && meta !== null;

  const value = useMemo<ElectionContextValue>(
    () => ({
      blocks,
      validation,
      tamperIndex,
      tamperData,
      difficulty,
      busy,
      error,
      chainReady,
      initialized,
      selectedIndex,
      lastTamper,
      voteSession,
      setTamperIndex,
      setTamperData,
      setDifficulty,
      setSelectedIndex,
      setVoteStep: (step) => patchVoteSession({ step }),
      setDni: (dni) => patchVoteSession({ dni }),
      setBirthDate: (birthDate) => patchVoteSession({ birthDate }),
      setVerifyError: (verifyError) => patchVoteSession({ verifyError }),
      setVoter: (voter) => patchVoteSession({ voter }),
      setSelected: (selected) => patchVoteSession({ selected }),
      setReceipt: (receipt) => patchVoteSession({ receipt }),
      resetVoteSession,
      registerVote,
      tamper,
      validate,
      clearError: () => setError(null),
    }),
    [
      blocks,
      validation,
      tamperIndex,
      tamperData,
      difficulty,
      busy,
      error,
      chainReady,
      initialized,
      selectedIndex,
      lastTamper,
      voteSession,
      patchVoteSession,
      resetVoteSession,
      registerVote,
      setDifficulty,
      tamper,
      validate,
    ],
  );

  return (
    <ElectionContext.Provider value={value}>
      <div className="shell">
        <AppHeader />
        <StatusStrip connected={meta !== null} blockCount={blocks.length} />
        <MiningTerminal
          state={miningUi}
          onClose={() => {
            setMiningUi(null);
            setIsMining(false);
          }}
        />
        <main className="main">
          <div className="wrap">
            {error && (
              <div className="notice notice--error notice--page" role="alert">
                <p className="font-semibold">No se pudo completar la operación</p>
                <p className="mt-1">{error}</p>
              </div>
            )}
            {children}
          </div>
        </main>
        <AppFooter />
      </div>
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const ctx = useContext(ElectionContext);
  if (!ctx) throw new Error("useElection debe usarse dentro de ElectionProvider");
  return ctx;
}
