"use client";

import { ElectionProvider } from "@/context/ElectionProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ElectionProvider>{children}</ElectionProvider>;
}
