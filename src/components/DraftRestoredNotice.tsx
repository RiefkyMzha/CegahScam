import { useState } from "react";
import { formatSessionDraftTime } from "../lib/sessionDraft";

type DraftRestoredNoticeProps = {
  savedAt: number | null;
  onDiscard: () => boolean;
  storageError?: boolean;
};

export default function DraftRestoredNotice({
  savedAt,
  onDiscard,
  storageError = false,
}: DraftRestoredNoticeProps) {
  const [restoredVisible, setRestoredVisible] = useState(Boolean(savedAt));

  function discard() {
    if (onDiscard()) setRestoredVisible(false);
  }

  if ((!restoredVisible || !savedAt) && !storageError) return null;

  return (
    <div
      role="status"
      className="mb-4 flex flex-col gap-2.5 rounded-xl border border-[#D9E6F2] bg-[#F4F8FC] px-4 py-3 text-[12.5px] text-[#4A6076] sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        {restoredVisible && savedAt ? (
          <p className="leading-relaxed">
            <span className="font-semibold text-[#22384E]">
              Isian dipulihkan dari sesi tab ini.
            </span>{" "}
            Tersimpan {formatSessionDraftTime(savedAt)}. File bukti perlu
            diunggah ulang; draf dihapus setelah berhasil dikirim atau tab
            ditutup.
          </p>
        ) : null}
        {storageError ? (
          <p className="leading-relaxed text-[#9A3412]">
            Draf sementara tidak dapat disimpan di browser ini. Jangan tutup
            tab sebelum mengirim laporan.
          </p>
        ) : null}
      </div>

      {savedAt ? (
        <button
          type="button"
          onClick={discard}
          className="shrink-0 self-start rounded-lg border border-[#CFDDEA] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#44617B] transition hover:bg-[#EEF4FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]/40 sm:self-auto"
        >
          Mulai kosong
        </button>
      ) : null}
    </div>
  );
}
