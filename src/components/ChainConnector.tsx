export function ChainConnector() {
  return (
    <div
      className="flex w-10 shrink-0 flex-col items-center justify-center sm:w-12"
      aria-hidden
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />
      <div className="my-2 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)]">
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-[var(--accent)]">
          <path
            d="M1 5h6M5 2.5l2.5 2.5L5 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />
    </div>
  );
}
