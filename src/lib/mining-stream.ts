import type { BlockDto, MineResult } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export type MineStreamEvent =
  | { type: "start"; difficulty: number; targetPrefix: string }
  | { type: "tick"; attempt: number; nonce: number; hash: string }
  | { type: "done"; attempts: number; difficulty: number; block: BlockDto }
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

/** Minado con eventos SSE reales desde el servidor (cada tick es un intento real, muestreado). */
export async function mineBlockStream(
  data: string,
  onEvent: (event: MineStreamEvent) => void,
  signal?: AbortSignal,
): Promise<MineResult> {
  const res = await fetch(`${BASE}/chain/mine/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
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
  let result: MineResult | null = null;

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
        };
      }
      if (ev.type === "error") {
        throw new Error(ev.message);
      }
    }
  }

  if (!result) {
    throw new Error("Minado finalizado sin evento done");
  }

  return result;
}
