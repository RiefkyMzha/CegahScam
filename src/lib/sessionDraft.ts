import { useEffect, useSyncExternalStore } from "react";

const PREFIX = "cegahscam:session-draft:";
const writeFailures = new Set<string>();
const writeStatusListeners = new Set<() => void>();

export type SessionDraftRead<T> = {
  value: T | null;
  savedAt: number | null;
  error: boolean;
};

function storageKey(key: string) {
  return `${PREFIX}${key}`;
}

export function readSessionDraft<T>(key: string): SessionDraftRead<T> {
  if (typeof window === "undefined") {
    return { value: null, savedAt: null, error: false };
  }

  try {
    const raw = window.sessionStorage.getItem(storageKey(key));
    if (!raw) return { value: null, savedAt: null, error: false };

    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("value" in parsed) ||
      !parsed.value ||
      typeof parsed.value !== "object" ||
      Array.isArray(parsed.value) ||
      !("savedAt" in parsed) ||
      typeof parsed.savedAt !== "number" ||
      !Number.isFinite(parsed.savedAt)
    ) {
      window.sessionStorage.removeItem(storageKey(key));
      return { value: null, savedAt: null, error: true };
    }

    return {
      value: parsed.value as T,
      savedAt: parsed.savedAt,
      error: false,
    };
  } catch {
    try {
      window.sessionStorage.removeItem(storageKey(key));
    } catch {
      // The storage backend is unavailable; the caller receives the error state.
    }
    return { value: null, savedAt: null, error: true };
  }
}

export function hasSessionDraftContent(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  return Object.values(value as Record<string, unknown>).some((item) => {
    if (Array.isArray(item)) return item.length > 0;
    if (typeof item === "string") return item.trim().length > 0;
    if (typeof item === "boolean") return item;
    return item != null;
  });
}

export function clearSessionDraft(key: string): boolean {
  if (typeof window === "undefined") {
    setWriteFailure(key, false);
    return true;
  }

  try {
    window.sessionStorage.removeItem(storageKey(key));
    setWriteFailure(key, false);
    return true;
  } catch {
    setWriteFailure(key, true);
    return false;
  }
}

export function writeSessionDraft<T>(key: string, value: T): boolean {
  if (!hasSessionDraftContent(value)) return clearSessionDraft(key);
  if (typeof window === "undefined") return false;

  try {
    window.sessionStorage.setItem(
      storageKey(key),
      JSON.stringify({ value, savedAt: Date.now() }),
    );
    return true;
  } catch {
    return false;
  }
}

function subscribeToWriteStatus(listener: () => void) {
  writeStatusListeners.add(listener);
  return () => writeStatusListeners.delete(listener);
}

function setWriteFailure(key: string, failed: boolean) {
  const alreadyFailed = writeFailures.has(key);
  if (alreadyFailed === failed) return;

  if (failed) {
    writeFailures.add(key);
  } else {
    writeFailures.delete(key);
  }
  writeStatusListeners.forEach((listener) => listener());
}

export function useSessionDraftWriter<T>(key: string, value: T): boolean {
  const writeError = useSyncExternalStore(
    subscribeToWriteStatus,
    () => writeFailures.has(key),
    () => false,
  );
  const serializedValue = JSON.stringify(value) ?? "null";

  useEffect(() => {
    const writeSucceeded = (() => {
      try {
        return writeSessionDraft(key, JSON.parse(serializedValue) as T);
      } catch {
        return false;
      }
    })();
    setWriteFailure(key, !writeSucceeded);
  }, [key, serializedValue]);

  return writeError;
}

export function useBeforeUnloadWarning(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [enabled]);
}

export function formatSessionDraftTime(savedAt: number | null): string {
  if (!savedAt) return "baru saja";

  const diff = Date.now() - savedAt;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "baru saja";
  if (diff < hour) return `${Math.floor(diff / minute)} menit lalu`;
  if (diff < day) return `${Math.floor(diff / hour)} jam lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(savedAt));
}

export function getSessionDraftLeaveWarning(
  storageError: boolean,
  hasUpload: boolean,
): string {
  const uploadNote = hasUpload
    ? " File bukti tidak tersimpan dan harus dipilih ulang."
    : "";

  return storageError
    ? `Draf tidak dapat disimpan di browser ini. Isian akan hilang jika kamu meninggalkan halaman.${uploadNote}`
    : `Isian teks tersimpan sementara di tab ini dan dibersihkan setelah berhasil dikirim atau sesi tab berakhir.${uploadNote}`;
}
