import { Badge } from "@/components/ui";

interface StatusBarProps {
  connected: boolean;
  difficulty?: number;
  blockCount?: number;
}

export function StatusBar({ connected, difficulty, blockCount }: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="container-main status-bar__inner">
        <p className="status-bar__label">Consola de mesa · auditoría del ledger</p>
        <div className="flex flex-wrap items-center gap-2">
          {connected ? (
            <Badge tone="live">API conectado</Badge>
          ) : (
            <Badge tone="neutral">Sin conexión al backend</Badge>
          )}
          {connected && difficulty !== undefined && (
            <Badge tone="accent">
              PoW · {difficulty} ceros
              {blockCount !== undefined ? ` · ${blockCount} reg.` : ""}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
