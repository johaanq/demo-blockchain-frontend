"use client";

import { OnpeLogo } from "@/components/brand/OnpeLogo";
import { APP_VIEWS, type AppView } from "@/lib/navigation";
import { ELECTION } from "@/lib/demo-defaults";

export function AppHeader({
  view,
  onViewChange,
}: {
  view: AppView;
  onViewChange: (v: AppView) => void;
}) {
  return (
    <header className="gov-header">
      <div className="gov-header__peru">
        <div className="wrap gov-header__peru-inner">
          <span>República del Perú</span>
          <span className="gov-header__peru-note">Plataforma digital — prototipo académico</span>
        </div>
      </div>
      <div className="gov-header__band">
        <div className="wrap gov-header__band-inner">
          <span>
            {ELECTION.name} · {ELECTION.round} · {ELECTION.runoffDate}
          </span>
          <a href="#contenido" className="gov-header__band-link">
            Ir al contenido
          </a>
        </div>
      </div>
      <div className="wrap gov-header__main">
        <button type="button" className="gov-brand" onClick={() => onViewChange("votar")}>
          <OnpeLogo height={48} />
          <span className="gov-brand__text">
            <span className="gov-brand__title">{ELECTION.platformName}</span>
            <span className="gov-brand__sub">{ELECTION.platformTagline}</span>
          </span>
        </button>
        <nav className="gov-nav" aria-label="Secciones">
          {APP_VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`gov-nav__link ${view === v.id ? "gov-nav__link--on" : ""}`}
              onClick={() => onViewChange(v.id)}
            >
              {v.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function StatusStrip({
  connected,
  blockCount,
}: {
  connected: boolean;
  blockCount?: number;
}) {
  return (
    <div className="gov-status">
      <div className="wrap gov-status__row gov-status__row--badges">
        <span className="gov-status__badges">
          <span className={connected ? "gov-badge gov-badge--ok" : "gov-badge"}>
            {connected ? "Servidor conectado" : "Sin conexión"}
          </span>
          {connected && blockCount !== undefined && (
            <span className="gov-badge gov-badge--info">
              {blockCount} sufragios registrados
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
