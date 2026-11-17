import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

type BackLinkProps = {
  to: string;
  label: string;
  confirmMessage?: string;
  compact?: boolean;
};

export default function BackLink({
  to,
  label,
  confirmMessage,
  compact = false,
}: BackLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      !confirmMessage ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      aria-label={`Kembali ke ${label}`}
      title={`Kembali ke ${label}`}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-4xl border border-[#DCE6EF] bg-white text-sm font-semibold text-[#5E83A5] shadow-sm shadow-[#8FA9C4]/10 transition hover:border-[#C3D3E2] hover:bg-[#F7FAFD] hover:text-[#1A56DB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]/40 ${
        compact
          ? "h-12 min-h-12 w-12 px-0 sm:h-auto sm:w-auto sm:px-4 sm:py-2"
          : "min-h-11 px-5 py-2"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>Kembali</span>
    </Link>
  );
}
