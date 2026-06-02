import type { VoteOption } from "./demo-defaults";
import { parseVoteOption } from "./demo-defaults";
import type { BlockDto } from "./types";
import { api } from "./api";

export type VoterRecord = {
  dni: string;
  birthDate: string | null;
  fullName: string;
  mesa: string;
  localVotacion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  identitySource?: string;
  birthDateVerified?: boolean;
};

export function maskDni(dni: string): string {
  if (dni.length < 4) return "***";
  return `***${dni.slice(-4)}`;
}

export function normalizeDni(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function isValidDniFormat(dni: string): boolean {
  return /^\d{8}$/.test(dni);
}

export type VerifyResult =
  | { ok: true; voter: VoterRecord }
  | { ok: false; code: "INVALID_DNI" | "INVALID_DATE" | "NOT_FOUND" | "MISMATCH" | "API"; message: string };

export async function verifyVoter(dni: string, birthDate: string): Promise<VerifyResult> {
  if (!isValidDniFormat(dni)) {
    return {
      ok: false,
      code: "INVALID_DNI",
      message: "Ingrese un DNI válido de 8 dígitos.",
    };
  }

  try {
    const res = await api.verifyVoter(
      dni,
      birthDate.length === 10 ? birthDate : undefined,
    );

    return {
      ok: true,
      voter: {
        dni: res.dni,
        birthDate: res.birthDate,
        fullName: res.fullName,
        mesa: res.mesa,
        localVotacion: res.localVotacion,
        distrito: res.distrito,
        provincia: res.provincia,
        departamento: res.departamento,
        identitySource: res.identitySource,
        birthDateVerified: res.birthDateVerified,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "No se pudo verificar el DNI.";
    if (message.includes("fecha de nacimiento")) {
      return { ok: false, code: "MISMATCH", message };
    }
    return { ok: false, code: "API", message };
  }
}

export function hasAlreadyVoted(dni: string, chainPayloads: string[]): boolean {
  return findExistingVote(dni, chainPayloads) !== null;
}

export type ExistingVote = {
  option: VoteOption;
  receiptCode: string;
  mesa: string;
  timestamp: Date;
  blockIndex: number;
};

function matchVotePayload(dni: string, payload: string): boolean {
  if (!payload.startsWith("VOTO")) return false;
  const masked = maskDni(dni);
  return payload.includes(`DNI=${masked}`) || payload.includes(`DNI=${dni}`);
}

export function findExistingVote(
  dni: string,
  payloadsOrBlocks: string[] | BlockDto[],
): ExistingVote | null {
  const blocks: BlockDto[] =
    payloadsOrBlocks.length > 0 && typeof payloadsOrBlocks[0] === "object"
      ? (payloadsOrBlocks as BlockDto[])
      : (payloadsOrBlocks as string[]).map((data, index) => ({
          index,
          timestamp: Date.now(),
          data,
          previousHash: "",
          nonce: 0,
          hash: "",
        }));

  const block = blocks.find((b) => matchVotePayload(dni, b.data));
  if (!block) return null;

  const option = parseVoteOption(block.data);
  if (!option) return null;

  const comprobante = block.data.match(/comprobante=(ONPE-[A-F0-9]+)/i)?.[1];
  const mesa = block.data.match(/mesa=(\d+)/)?.[1] ?? "—";

  return {
    option,
    receiptCode: comprobante ?? buildReceiptCode(dni, option),
    mesa,
    timestamp: new Date(block.timestamp),
    blockIndex: block.index,
  };
}

export function buildReceiptCode(dni: string, option: VoteOption): string {
  const base = `${dni}-${option}-EG2026`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  return `ONPE-${hash.toString(16).toUpperCase().padStart(8, "0")}`;
}
