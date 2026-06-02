import type { BlockDto, MineResult } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export type MineStreamEvent =
  | { type: "start"; difficulty: number; targetPrefix: string }
  | { type: "tick"; attempt: number; nonce: number; hash: string }
  | { type: "done"; attempts: number; difficulty: number; block: BlockDto; sealedCount?: number }
  | { type: "error"; message: string };

function parseSseChunk(buffer: string): { events: MineStreamEvent[]; rest: string } {
  const events: MineStreamEvent[] = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";

  for (const part of parts) {
    const dataLine = part.split("\n").find((l) => l.startsWith("data: "));
    if (!dataLine) continue;
    try {
      events.push(JSON.parse(dataLine.slice(6)) as MineStreamEvent);
    } catch {
      /* ignore malformed */
    }
  }

  return { events, rest };
}

async function consumeMineStream(
  path: string,
  init: RequestInit | undefined,
  onEvent: (event: MineStreamEvent) => void,
  signal?: AbortSignal,
): Promise<MineResult & { sealedCount?: number }> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Error ${res.status}`);
  }

  if (!res.body) {
    throw new Error("El servidor no envió stream de minería");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: (MineResult & { sealedCount?: number }) | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, rest } = parseSseChunk(buffer);
    buffer = rest;

    for (const ev of events) {
      onEvent(ev);
      if (ev.type === "done") {
        result = {
          block: ev.block,
          attempts: ev.attempts,
          difficulty: ev.difficulty,
          sealedCount: ev.sealedCount,
        };
      }
      if (ev.type === "error") {
        throw new Error(ev.message);
      }
    }
  }

  if (!result) {
    throw new Error("Operación finalizada sin evento done");
  }

  return result;
}

/** Registra un sufragio y lo sella con PoW (stream SSE). */
export async function addBlockStream(
  data: string,
  onEvent: (event: MineStreamEvent) => void,
  signal?: AbortSignal,
): Promise<MineResult> {
  return consumeMineStream(
    "/chain/blocks/stream",
    { method: "POST", body: JSON.stringify({ data }) },
    onEvent,
    signal,
  );
}

/** Sella en la cadena los sufragios antiguos que quedaron sin PoW. */
export async function sealPendingStream(
  onEvent: (event: MineStreamEvent) => void,
  signal?: AbortSignal,
): Promise<MineResult & { sealedCount?: number }> {
  return consumeMineStream("/chain/seal-pending/stream", { method: "POST" }, onEvent, signal);
}

/** @deprecated Usar addBlockStream o sealPendingStream */
export async function mineBlockStream(
  data: string,
  onEvent: (event: MineStreamEvent) => void,
  signal?: AbortSignal,
): Promise<MineResult> {
  return addBlockStream(data, onEvent, signal);
}
