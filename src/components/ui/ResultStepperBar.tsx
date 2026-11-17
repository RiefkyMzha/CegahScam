import type { ReactNode } from "react";
import BackLink from "../BackLink";
import Stepper from "./Stepper";
import type { Step } from "./Stepper";

type ResultStepperBarProps = {
  steps: Step[];
  backTo: string;
  backLabel: string;
  action: ReactNode;
  confirmMessage?: string;
  className?: string;
  controlsClassName?: string;
};

export default function ResultStepperBar({
  steps,
  backTo,
  backLabel,
  action,
  confirmMessage,
  className = "",
  controlsClassName = "",
}: ResultStepperBarProps) {
  return (
    <div className={`mx-auto w-full ${className}`}>
      <Stepper steps={steps} className="!my-0" />
      <div
        className={`mx-auto mt-3 flex w-full items-center justify-between gap-3 sm:mt-4 ${controlsClassName}`}
      >
        <BackLink
          to={backTo}
          label={backLabel}
          confirmMessage={confirmMessage}
          compact
        />
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  );
}
