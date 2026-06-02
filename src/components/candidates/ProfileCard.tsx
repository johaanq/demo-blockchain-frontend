"use client";

import Image from "next/image";
import { useState } from "react";
import type { VoteOption } from "@/lib/demo-defaults";
import { CANDIDATES } from "@/lib/demo-defaults";

export function ProfileCard({ candidate }: { candidate: VoteOption }) {
  const c = CANDIDATES[candidate];
  const [failed, setFailed] = useState(false);

  return (
    <article className="profile-card">
      <div className="profile-card__photo-wrap relative flex items-center justify-center bg-white">
        {!failed ? (
          <Image
            src={c.partyLogo}
            alt={c.partyLogoAlt}
            width={120}
            height={120}
            className="profile-card__photo object-contain"
            priority={candidate === "KEIKO"}
            onError={() => setFailed(true)}
            unoptimized
          />
        ) : (
          <div
            className="flex h-28 w-28 items-center justify-center text-2xl font-bold"
            style={{ background: c.bgSoft, color: c.color, border: `2px solid ${c.border}` }}
          >
            {c.short}
          </div>
        )}
      </div>
      <div className="profile-card__body">
        <p className="profile-card__party" style={{ color: c.color }}>
          {c.party}
        </p>
        <p className="font-semibold text-[var(--ink)]">{c.name}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Candidato a la Presidencia · balotaje 7 jun 2026
        </p>
      </div>
    </article>
  );
}
