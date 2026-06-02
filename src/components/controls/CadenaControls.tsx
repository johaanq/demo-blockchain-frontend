"use client";

import { Button, Card } from "@/components/ui";
import { PageHeader } from "@/components/ui/PageHeader";

interface CadenaControlsProps {
  tamperIndex: string;
  tamperData: string;
  loading: boolean;
  initialized: boolean;
  onTamperIndexChange: (v: string) => void;
  onTamperDataChange: (v: string) => void;
  onTamper: () => void;
  onValidate: () => void;
}

export function CadenaControls({
  tamperIndex,
  tamperData,
  loading,
  initialized,
  onTamperIndexChange,
  onTamperDataChange,
  onTamper,
  onValidate,
}: CadenaControlsProps) {
  return (
    <Card
      title="Auditoría del escrutinio"
      subtitle="Simula fraude y valida integridad de la cadena"
      accent="blue"
      className="mb-6"
    >
      <p className="mb-4 text-sm text-[var(--ink-secondary)]">
        Cambia el contenido de un bloque sin recalcular hashes enlazados. La validación debe fallar.
      </p>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="w-full sm:w-24">
          <label htmlFor="tamper-idx" className="field-label">
            Índice
          </label>
          <input
            id="tamper-idx"
            type="number"
            min={0}
            className="input"
            value={tamperIndex}
            onChange={(e) => onTamperIndexChange(e.target.value)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="tamper-data" className="field-label">
            Payload falsificado
          </label>
          <input
            id="tamper-data"
            className="input"
            value={tamperData}
            onChange={(e) => onTamperDataChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="danger" onClick={onTamper} disabled={loading || !initialized} loading={loading}>
          Simular fraude
        </Button>
        <Button onClick={onValidate} disabled={loading || !initialized} loading={loading}>
          Validar escrutinio
        </Button>
      </div>
    </Card>
  );
}

export function CadenaPageHeader() {
  return (
    <PageHeader
      badge="Blockchain"
      title="Cadena de escrutinio"
      description="Registro horizontal de bloques. Selecciona uno para ver hash, nonce y contenido del voto."
    />
  );
}
