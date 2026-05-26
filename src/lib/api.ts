import type { BlockDto, ChainResponse, MineResult, ValidationResult } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: string }).error ?? `Error ${res.status}`);
  }
  return body as T;
}

export const api = {
  health: () =>
    request<{
      status: string;
      difficulty: number;
      difficultyRange?: { min: number; max: number };
      initialized: boolean;
    }>("/health"),

  setDifficulty: (difficulty: number) =>
    request<{ difficulty: number; message: string }>("/config/difficulty", {
      method: "PATCH",
      body: JSON.stringify({ difficulty }),
    }),

  initChain: () =>
    request<{ message: string; blocks: BlockDto[] }>("/chain/init", { method: "POST" }),

  getChain: () => request<ChainResponse>("/chain"),

  addBlock: (data: string) =>
    request<BlockDto>("/chain/blocks", {
      method: "POST",
      body: JSON.stringify({ data }),
    }),

  mineBlock: (data: string) =>
    request<MineResult>("/chain/mine", {
      method: "POST",
      body: JSON.stringify({ data }),
    }),

  validate: () => request<ValidationResult>("/chain/validate"),

  tamper: (index: number, data: string) =>
    request<{ index: number; data: string; hash: string; warning: string }>("/chain/tamper", {
      method: "POST",
      body: JSON.stringify({ index, data }),
    }),
};
