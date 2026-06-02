export function ActaDigitalLogo({ compact }: { compact?: boolean }) {
  return (
    <div className="acta-logo" aria-label="Acta Digital">
      <div className="acta-logo__mark">
        <span className="acta-logo__eg">EG</span>
        <span className="acta-logo__year">26</span>
      </div>
      {!compact && (
        <div className="acta-logo__text">
          <span className="acta-logo__title">Acta Digital</span>
          <span className="acta-logo__sub">2.ª vuelta · demo blockchain</span>
        </div>
      )}
    </div>
  );
}
