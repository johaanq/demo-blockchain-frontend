/** Líneas simuladas mientras el servidor ejecuta PoW real. */

export function randomHex(bytes = 32): string {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < bytes * 2; i++) {
    out += chars[Math.floor(Math.random() * 16)];
  }
  return out;
}

export function meetsDifficulty(hash: string, difficulty: number): boolean {
  return hash.startsWith("0".repeat(difficulty));
}

export function formatMiningLine(nonce: number, hash: string, difficulty: number): string {
  const ok = meetsDifficulty(hash, difficulty);
  const preview = `${hash.slice(0, Math.max(difficulty + 4, 12))}…`;
  return ok
    ? `nonce=${String(nonce).padStart(7, " ")}  hash=${preview}  ✓ PoW válido`
    : `nonce=${String(nonce).padStart(7, " ")}  hash=${preview}  · rechazado`;
}

export function bumpAttempts(current: number, difficulty: number): number {
  const step = Math.floor(800 + difficulty * 1200 + Math.random() * 4000);
  return current + step;
}
