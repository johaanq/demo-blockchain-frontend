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

export interface ValidationResult {
  valid: boolean;
  length: number;
  issues: string[];
  message: string;
}

export interface MineResult {
  block: BlockDto;
  attempts: number;
  difficulty: number;
}
