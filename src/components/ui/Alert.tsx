import type { ReactNode } from "react";

type Tone = "error" | "success" | "warn";

export function Alert({
  title,
  children,
  tone = "error",
}: {
  title?: string;
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className={`alert alert--${tone}`} role="alert">
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? "mt-0.5 text-sm opacity-90" : ""}>{children}</div>
    </div>
  );
}
