export function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <header className="page-hero-compact">
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-[var(--pe-red)] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
          {badge}
        </span>
      )}
      <h1 className="page-hero-compact__title font-display">{title}</h1>
      {description && <p className="page-hero-compact__desc">{description}</p>}
    </header>
  );
}
