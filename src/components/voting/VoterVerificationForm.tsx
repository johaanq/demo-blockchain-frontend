"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function VoterVerificationForm({
  dni,
  birthDate,
  error,
  busy,
  onDniChange,
  onBirthDateChange,
  onSubmit,
}: {
  dni: string;
  birthDate: string;
  error: string | null;
  busy: boolean;
  onDniChange: (v: string) => void;
  onBirthDateChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const [apiReady, setApiReady] = useState<boolean | null>(null);
  const [provider, setProvider] = useState("apiperu");

  useEffect(() => {
    api
      .voterConfig()
      .then((c) => {
        setApiReady(c.configured);
        setProvider(c.provider);
      })
      .catch(() => setApiReady(false));
  }, []);

  const needsBirthDate = provider === "apidni";

  return (
    <div className="onpe-panel">
      <div className="onpe-panel__head">
        <h2 className="onpe-panel__title">Verificación de identidad</h2>
        <p className="onpe-panel__desc">
          Ingrese su DNI para validar su identidad en el padrón electoral. El sistema asigna su mesa
          de sufragio automáticamente.
        </p>
      </div>
      <div className="onpe-panel__body">
        {apiReady === false && (
          <div className="notice notice--warn mb-4">
            El backend no tiene <code className="font-data">DNI_API_TOKEN</code>. Regístrese en{" "}
            <a href="https://apiperu.dev" target="_blank" rel="noreferrer" className="link-btn">
              apiperu.dev
            </a>{" "}
            (gratis), copie el token en <code className="font-data">demo-blockchain-backend/.env</code>{" "}
            y reinicie el servidor.
          </div>
        )}

        <div className="form-grid">
          <div>
            <label className="label" htmlFor="dni">
              Documento Nacional de Identidad (DNI)
            </label>
            <input
              id="dni"
              className="input input--mono input--lg"
              inputMode="numeric"
              placeholder="8 dígitos"
              maxLength={8}
              value={dni}
              disabled={busy}
              onChange={(e) => onDniChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
            />
          </div>
          <div>
            <label className="label" htmlFor="birth">
              Fecha de nacimiento
            </label>
            <input
              id="birth"
              className="input input--mono input--lg"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              maxLength={10}
              value={birthDate}
              disabled={busy}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "").slice(0, 8);
                let fmt = d;
                if (d.length > 2) fmt = `${d.slice(0, 2)}/${d.slice(2)}`;
                if (d.length > 4) fmt = `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
                onBirthDateChange(fmt);
              }}
            />
          </div>
        </div>

        {error && (
          <div className="notice notice--error mt-4" role="alert">
            {error}
          </div>
        )}

        <button
          type="button"
          className="btn btn--primary btn-block mt-5"
          disabled={
            busy ||
            dni.length !== 8 ||
            apiReady === false ||
            (needsBirthDate && birthDate.length !== 10)
          }
          onClick={onSubmit}
        >
          {busy ? "Consultando identidad…" : "Validar con padrón"}
        </button>
      </div>
    </div>
  );
}
