import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IconLoader } from "../icons";

type Variant = "default" | "primary" | "ghost" | "danger";

const variantClass: Record<Variant, string> = {
  default: "btn--default",
  primary: "btn--primary",
  ghost: "btn--ghost",
  danger: "btn--danger",
};

export function Button({
  children,
  variant = "default",
  loading,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      className={`btn ${variantClass[variant]} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <IconLoader className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
