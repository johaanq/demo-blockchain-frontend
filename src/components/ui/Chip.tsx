import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Chip({
  children,
  accentColor,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  accentColor?: string;
}) {
  return (
    <button
      type="button"
      className={`chip ${className}`}
      style={
        accentColor
          ? { borderColor: `${accentColor}55`, color: accentColor }
          : { color: "var(--muted)" }
      }
      {...props}
    >
      {children}
    </button>
  );
}
