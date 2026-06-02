import type { ReactNode } from "react";

export function Panel({
  title,
  step,
  children,
  className = "",
}: {
  title: string;
  step: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel__head">
        <span className="panel__step">{step}</span>
        <h2 className="panel__title">{title}</h2>
      </div>
      <div className="panel__body">{children}</div>
    </section>
  );
}
