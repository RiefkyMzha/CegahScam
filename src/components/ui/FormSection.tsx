import type { ReactNode } from "react";

type FormSectionProps = {
  id?: string;
  index: number;
  title: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Satu bagian form: badge angka + judul + deskripsi + isi.
 * Semua legend rata atas agar badge selalu sejajar baris pertama.
 */
export default function FormSection({
  id,
  index,
  title,
  description,
  required = false,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <fieldset id={id} className={`flex flex-col gap-3 sm:gap-4 ${className}`}>
      <legend className="mb-1.5 flex items-start gap-2.5 font-semibold text-[#26384A] sm:mb-2">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#52789A] text-xs font-semibold text-white">
          {index}
        </span>
        <span className="flex flex-col gap-1.5">
          <span>
            {title}
            {required && (
              <span className="ml-0.5 text-danger-600" aria-hidden="true">
                *
              </span>
            )}
          </span>
          {description && (
            <span className="text-xs font-normal text-[#94A3B8]">
              {description}
            </span>
          )}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}
