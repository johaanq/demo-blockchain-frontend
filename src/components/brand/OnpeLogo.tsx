/* eslint-disable @next/next/no-img-element */

export function OnpeLogo({
  className = "",
  height = 52,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <img
      src="/brand/onpe-logo.png"
      alt="ONPE — Oficina Nacional de Procesos Electorales"
      className={`onpe-logo ${className}`.trim()}
      height={height}
      style={{ height, width: "auto" }}
    />
  );
}
