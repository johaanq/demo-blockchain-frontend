export function BallotIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="8" y="4" width="32" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 14h20M14 20h14M14 26h18" stroke="currentColor" strokeWidth="1.2" />
      <rect x="18" y="32" width="12" height="6" rx="1" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function UrnaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 20h40v32H12V20z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 52h48" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 20V12c0-2 3-4 8-4s8 2 8 4v8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="22" y="8" width="20" height="4" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
