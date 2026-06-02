import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "live";

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`badge badge--${tone} ${className}`}>{children}</span>
  );
}
