"use client";

import { ActaDigitalLogo } from "@/components/brand/ActaDigitalLogo";
import { APP_VIEWS, type AppView } from "@/lib/navigation";

export function Navbar({
  active,
  onNavigate,
}: {
  active: AppView;
  onNavigate: (view: AppView) => void;
}) {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="container-main navbar__inner">
        <button type="button" onClick={() => onNavigate("votar")} className="border-0 bg-transparent p-0">
          <ActaDigitalLogo />
        </button>
        <div className="navbar__links" role="tablist">
          {APP_VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={active === v.id}
              className={`nav-link ${active === v.id ? "nav-link--active" : ""}`}
              onClick={() => onNavigate(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
