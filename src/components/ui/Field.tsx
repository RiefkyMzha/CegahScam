import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

const base =
  "w-full rounded-xl border bg-white/70 px-3 py-3 text-base text-[#26384A] outline-none transition placeholder:text-[#94A3B8] focus:bg-white focus:ring-2 sm:text-sm";
const normal =
  "border-[#B9C8DA] focus:border-[#52789A] focus:ring-[#A5C6FF]/50";
const invalid =
  "border-danger-600/60 focus:border-danger-600 focus:ring-danger-600/20";

export function FieldError({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 text-xs font-medium leading-relaxed text-danger-600"
    >
      {children}
    </p>
  );
}

export function FieldHint({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <p id={id} className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
      {children}
    </p>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  prefix?: string;
  variant?: "default" | "search";
  containerClassName?: string;
};

export function TextInput({
  label,
  hint,
  error,
  prefix,
  variant = "default",
  id,
  className = "",
  containerClassName = "",
  ...props
}: TextInputProps) {
  const reactId = useId();
  const inputId = id ?? `field-${reactId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className={prefix ? "relative" : undefined}>
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-semibold text-[#94A3B8]"
          >
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`${
            variant === "search"
              ? "w-full rounded-xl border border-[#446685]/20 bg-white/80 px-3 py-3 text-base text-[#111827] outline-none transition placeholder:text-[#52789A]/70 focus:border-[#3385FF] focus:bg-white focus:ring-2 focus:ring-[#3385FF]/20 sm:text-sm"
              : `${base} ${error ? invalid : normal}`
          } ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export function TextArea({
  label,
  hint,
  error,
  id,
  className = "",
  containerClassName = "",
  ...props
}: TextAreaProps) {
  const reactId = useId();
  const inputId = id ?? `field-${reactId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`${base} min-h-[120px] resize-y ${error ? invalid : normal} ${className}`}
        {...props}
      />
      {hint && !error && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export type Choice = {
  value: string;
  label: string;
};

type ChoiceGroupProps = {
  name: string;
  label: string;
  options: Choice[];
  hint?: string;
  error?: string;
  className?: string;
};

type RadioGroupProps = ChoiceGroupProps & {
  value: string;
  onChange: (value: string) => void;
};

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  hint,
  error,
  className = "",
}: RadioGroupProps) {
  const reactId = useId();
  const errorId = `${name}-${reactId}-error`;
  const hintId = `${name}-${reactId}-hint`;

  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className="flex flex-col gap-1"
      >
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          return (
            <label key={option.value} htmlFor={optionId} className="form-choice">
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="accent-[#52789A]"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {hint && !error && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

type CheckboxGroupProps = ChoiceGroupProps & {
  values: string[];
  onToggle: (value: string) => void;
  children?: ReactNode;
};

export function CheckboxGroup({
  name,
  label,
  options,
  values,
  onToggle,
  hint,
  error,
  className = "",
  children,
}: CheckboxGroupProps) {
  const reactId = useId();
  const errorId = `${name}-${reactId}-error`;
  const hintId = `${name}-${reactId}-hint`;

  return (
    <div className={className}>
      <div
        role="group"
        aria-label={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className="flex flex-col gap-1"
      >
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          return (
            <label key={option.value} htmlFor={optionId} className="form-choice">
              <input
                id={optionId}
                type="checkbox"
                name={name}
                value={option.value}
                checked={values.includes(option.value)}
                onChange={() => onToggle(option.value)}
                className="accent-[#52789A]"
              />
              {option.label}
            </label>
          );
        })}
        {children}
      </div>
      {hint && !error && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
