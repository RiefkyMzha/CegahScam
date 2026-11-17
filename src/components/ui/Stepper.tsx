import { Fragment } from "react";

export type StepState = "done" | "active" | "todo";

export type Step = {
  label: string;
  state: StepState;
};

type StepperProps = {
  steps: Step[];
  className?: string;
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

/**
 * Stepper bersama untuk semua alur (Analisis, Darurat, Laporan).
 * Lebar 720px agar sejajar dengan isi form.
 */
export default function Stepper({
  steps,
  className = "",
}: StepperProps) {
  return (
    <ol
      className={`mx-auto my-4 flex w-full max-w-[720px] items-start justify-between gap-1.5 rounded-[18px] bg-white/40 px-3 py-3 shadow-lg sm:my-6 sm:gap-4 sm:rounded-full sm:px-8 sm:py-4 ${className}`}
    >
      {steps.map((step, index) => (
        <Fragment key={step.label}>
          {index > 0 && (
            <li
              aria-hidden="true"
              className="mt-3 h-px flex-1 list-none bg-[#667085]/50"
            />
          )}
          <li
            aria-current={step.state === "active" ? "step" : undefined}
            className="flex w-[72px] shrink-0 list-none flex-col items-center gap-1.5 text-center sm:w-auto sm:min-w-24"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white ${
                step.state === "todo" ? "bg-[#667085]" : "bg-[#5E83A5]"
              }`}
            >
              {step.state === "done" ? <CheckIcon /> : index + 1}
            </span>
            <span
              className={`text-xs leading-tight sm:text-sm ${
                step.state === "active"
                  ? "font-bold text-[#5E83A5]"
                  : "text-[#667085]"
              }`}
            >
              {step.label}
            </span>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
