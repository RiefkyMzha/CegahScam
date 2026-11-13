import { useEffect, useMemo, useState, type DragEvent } from "react";
import { FieldError, FieldHint } from "./Field";

const DEFAULT_ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

type UploadFieldProps = {
  id: string;
  hint?: string;
  error?: string;
  accept?: string;
  maxSizeMB?: number;
  value: File | null;
  onChange: (file: File | null) => void;
};

/**
 * Dropzone unggah bukti.
 * Input memakai sr-only agar tetap bisa difokus dengan keyboard.
 */
export default function UploadField({
  id,
  hint,
  error,
  accept = DEFAULT_ACCEPT,
  maxSizeMB = 15,
  value,
  onChange,
}: UploadFieldProps) {
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  const preview = useMemo(() => {
    if (!value) return null;
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function validate(file: File) {
    const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const typeValid =
      ALLOWED_TYPES.includes(file.type) || ALLOWED_EXT.includes(ext);

    if (!typeValid) {
      setLocalError("Format file harus JPG, PNG, atau WEBP.");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`Ukuran file maksimal ${maxSizeMB} MB.`);
      return false;
    }

    setLocalError("");
    return true;
  }

  function pick(file?: File | null) {
    if (!file) return;
    if (!validate(file)) return;
    onChange(file);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    pick(event.dataTransfer.files?.[0]);
  }

  const message = error || localError;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <input
        id={id}
        type="file"
        accept={accept}
        className="peer sr-only"
        onChange={(event) => pick(event.target.files?.[0])}
      />

      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`form-upload min-w-0 cursor-pointer px-4 sm:px-5 ${
          dragging
            ? "border-[#52789A] bg-[#D9E7F2]"
            : message
              ? "border-[#B91C1C]/60 bg-[#C9D7E3]/60 hover:border-[#B91C1C]"
              : "border-[#B9C8DA] bg-[#C9D7E3]/60"
        } focus-within:ring-2 focus-within:ring-[#52789A]/30`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 shrink-0 text-[#52789A]"
          aria-hidden="true"
        >
          <path d="M5 20h14v-2H5v2zm7-18-5.5 5.5 1.42 1.42L11 6.83V16h2V6.83l3.08 3.09 1.42-1.42L12 2z" />
        </svg>

        <span className="max-w-full text-sm font-semibold text-[#52789A] break-words">
          Tarik dan lepas file di sini
        </span>

        <span className="w-full max-w-[180px] rounded-full bg-[#A5C6FF] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#8DB5F7] sm:w-auto sm:px-6">
          Pilih File
        </span>

        {value && (
          <span className="max-w-full truncate text-xs text-[#52789A]">
            File dipilih: {value.name}
          </span>
        )}
      </label>

      {hint && !message && <FieldHint>{hint}</FieldHint>}
      {message && <FieldError>{message}</FieldError>}

      {value && (
        <div className="flex flex-col gap-3 rounded-xl border border-[#B9C8DA] bg-white/70 p-3 sm:flex-row sm:items-center">
          {preview && (
            <img
              src={preview}
              alt={`Pratinjau ${value.name}`}
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#26384A]">
              {value.name}
            </p>
            <p className="text-xs text-[#667085]">
              {(value.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLocalError("");
              onChange(null);
            }}
            className="shrink-0 rounded-full border border-[#B9C8DA] px-3 py-1.5 text-xs font-semibold text-[#52789A] transition hover:bg-[#5E83A5] hover:text-white"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}
