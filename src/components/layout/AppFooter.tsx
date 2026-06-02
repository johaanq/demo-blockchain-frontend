import { OnpeLogo } from "@/components/brand/OnpeLogo";
import { ELECTION } from "@/lib/demo-defaults";

export function AppFooter() {
  return (
    <footer className="gov-footer">
      <div className="wrap gov-footer__grid">
        <div>
          <OnpeLogo height={40} className="gov-footer__logo" />
          <p className="gov-footer__title">
            {ELECTION.platformOrg} · {ELECTION.platformName}
          </p>
          <p className="gov-footer__text">{ELECTION.disclaimer}</p>
        </div>
        <div className="gov-footer__refs">
          <p>
            <strong>JNE</strong> — autoridad electoral; fiscaliza, resuelve impugnaciones y
            proclama resultados (no opera la votación).
          </p>
          <p>
            <strong>RENIEC</strong> — identidad del elector (validación simulada en esta demo).
          </p>
          <p>Padrón electoral administrado por la ONPE · EG 2026</p>
        </div>
      </div>
    </footer>
  );
}
