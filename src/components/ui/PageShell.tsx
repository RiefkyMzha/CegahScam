import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Container halaman standar.
 * Padding & max-width disamakan untuk semua halaman agar tepi konten sejajar.
 */
export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main className="w-full">
      <div
        className={`mx-auto w-full max-w-[1160px] px-4 pb-20 pt-[var(--page-top)] sm:px-6 lg:px-8 ${className}`}
      >
        {children}
      </div>
    </main>
  );
}
