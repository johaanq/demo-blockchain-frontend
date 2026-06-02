import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
  className = "",
  accent,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  accent?: "red" | "gold" | "blue";
}) {
  const border =
    accent === "gold"
      ? "border-l-[3px] border-l-[var(--warn)]"
      : accent === "blue"
        ? "border-l-[3px] border-l-[var(--sanchez)]"
        : accent === "red"
          ? "border-l-[3px] border-l-[var(--pe-red)]"
          : "";

  return (
    <section className={`ui-card ${border} ${className}`}>
      {(title || subtitle) && (
        <div className="ui-card__head">
          {title && <h2 className="ui-card__title">{title}</h2>}
          {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className={title || subtitle ? "ui-card__body" : "p-4"}>{children}</div>
    </section>
  );
}
