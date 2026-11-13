import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "light" | "outline" | "sky";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#5E83A5] text-white shadow-lg hover:bg-[#4D7090] disabled:hover:bg-[#5E83A5]",
  light:
    "bg-white text-[#5E83A5] shadow-lg hover:bg-[#5E83A5] hover:text-white disabled:hover:bg-white disabled:hover:text-[#5E83A5]",
  outline:
    "border border-[#C8D6E3] bg-white text-[#52789A] hover:bg-[#5E83A5] hover:text-white disabled:hover:bg-white disabled:hover:text-[#52789A]",
  sky:
    "bg-[#ADCEFF] text-white shadow-lg hover:bg-[#85B6FF] disabled:hover:bg-[#ADCEFF]",
};

export default function Button({
  variant = "primary",
  loading = false,
  loadingText,
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${
        variants[variant]
      } ${fullWidth ? "w-full sm:w-auto" : ""} ${className}`}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {loading ? loadingText ?? children : children}
    </button>
  );
}
