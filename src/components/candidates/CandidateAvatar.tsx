"use client";

import Image from "next/image";
import { useState } from "react";
import type { VoteOption } from "@/lib/demo-defaults";
import { CANDIDATES } from "@/lib/demo-defaults";

export function CandidateAvatar({
  candidate,
  size = 48,
  className = "",
}: {
  candidate: VoteOption;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const c = CANDIDATES[candidate];

  if (failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center font-bold ${className}`}
        style={{
          width: size,
          height: size,
          background: c.bgSoft,
          border: `2px solid ${c.border}`,
          fontSize: size * 0.28,
          color: c.color,
        }}
        aria-hidden
      >
        {c.short}
      </span>
    );
  }

  return (
    <Image
      src={c.partyLogo}
      alt={c.partyLogoAlt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
