export interface BlockDto {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
}

export interface ChainResponse {
  length: number;
  blocks: BlockDto[];
}

export interface ValidationIssueDetail {
  blockIndex: number;
  kind: "hash_mismatch" | "broken_link" | "pow_pending" | "pow_invalid";
  title: string;
  detail: string;
  storedHash?: string;
  expectedHash?: string;
  dataSnippet?: string;
}

export interface ValidationResult {
  valid: boolean;
  length: number;
  issues: string[];
  issueDetails: ValidationIssueDetail[];
  message: string;
  howItWorks?: string;
}

export interface TamperResult {
  index: number;
  previousData: string;
  data: string;
  hash: string;
  warning: string;
  explanation: string;
}

export interface MineResult {
  block: BlockDto;
  attempts: number;
  difficulty: number;
}
