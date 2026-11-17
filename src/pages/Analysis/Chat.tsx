import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AnalysisHook from "../../components/AnalysisHook";
import BackLink from "../../components/BackLink";
import DraftRestoredNotice from "../../components/DraftRestoredNotice";
import PageShell from "../../components/ui/PageShell";
import Stepper from "../../components/ui/Stepper";
import FormSection from "../../components/ui/FormSection";
import { TextArea, FieldError } from "../../components/ui/Field";
import UploadField from "../../components/ui/UploadField";
import Button from "../../components/ui/Button";
import { apiUrl } from "../../lib/api";
import LoadingOverlay from "../../components/LoadingOverlay";
import {
  clearSessionDraft,
  getSessionDraftLeaveWarning,
  hasSessionDraftContent,
  readSessionDraft,
  useBeforeUnloadWarning,
  useSessionDraftWriter,
} from "../../lib/sessionDraft";

type ChatDraft = {
  pesan: string;
};

const DRAFT_KEY = "analysis-chat";

const STEPS = [
  { label: "Pilih Kasus", state: "done" as const },
  { label: "Isi Data", state: "active" as const },
  { label: "Hasil Analisis", state: "todo" as const },
];

export default function Chat() {
  const [draftState] = useState(() => readSessionDraft<ChatDraft>(DRAFT_KEY));
  const draft = draftState.value;
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [pesan, setPesan] = useState(
    typeof draft?.pesan === "string" ? draft.pesan : "",
  );
  const [errors, setErrors] = useState<{
    pesan?: string;
    file?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isDirty = Boolean(pesan || fileBukti);
  const writeError = useSessionDraftWriter(DRAFT_KEY, { pesan });
  const storageError = draftState.error || writeError;
  const restoredDraft = hasSessionDraftContent(draft);

  useBeforeUnloadWarning(isDirty);

  function discardDraft() {
    if (!clearSessionDraft(DRAFT_KEY)) return false;
    setPesan("");
    setFileBukti(null);
    setErrors({});
    return true;
  }

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const nextErrors: typeof errors = {};
    if (!pesan.trim()) {
      nextErrors.pesan = "Isi pesan yang ingin dianalisis.";
    }
    if (!fileBukti) {
      nextErrors.file = "File bukti pesan harus diunggah.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("pesan", pesan);
    if (fileBukti) fd.append("fileBukti", fileBukti);

    try {
      const res = await fetch(apiUrl("/api/analysis/chat"), {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat mengirim laporan.",
        );
      }
      const draftCleanupError = !clearSessionDraft(DRAFT_KEY);
      navigate("/analysis/resultchat", {
        state: { result: data, subject: pesan, draftCleanupError },
      });
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengirim laporan.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <LoadingOverlay message="Sedang menganalisis pesan..." />}

      <PageShell>
        <AnalysisHook />
        <Stepper steps={STEPS} />
        <div className="mb-3 flex items-center justify-between gap-4">
          <BackLink
            to="/analysis"
            label="Analisis"
            compact
            confirmMessage={
              isDirty ? getSessionDraftLeaveWarning(storageError, true) : undefined
            }
          />
        </div>

        <section id="body-input" className="reveal form-card">
          <div id="title" className="form-title">
            <h2>Silakan isi data berikut</h2>
          </div>

          <form className="form-body" onSubmit={submitForm} noValidate>
            {(restoredDraft || storageError) && (
              <DraftRestoredNotice
                savedAt={restoredDraft ? draftState.savedAt : null}
                onDiscard={discardDraft}
                storageError={storageError}
              />
            )}
            <FormSection
              index={1}
              title="Pesan"
              description="Tempel pesan atau chat yang kamu terima."
              required
            >
              <TextArea
                label="Pesan yang diterima"
                name="pesan"
                rows={4}
                maxLength={10_000}
                placeholder="Masukkan pesan di sini"
                value={pesan}
                onChange={(e) => {
                  setPesan(e.target.value);
                  if (errors.pesan) {
                    setErrors((prev) => ({ ...prev, pesan: undefined }));
                  }
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
                  el.style.overflowY =
                    el.scrollHeight > 320 ? "auto" : "hidden";
                }}
                error={errors.pesan}
              />
            </FormSection>

            <FormSection index={2} title="Bukti Pesan" required>
              <UploadField
                id="bukti-file-chat"
                hint="Format JPG, PNG, atau WEBP, maksimal 15 MB."
                error={errors.file}
                value={fileBukti}
                onChange={(file) => {
                  setFileBukti(file);
                  if (errors.file) {
                    setErrors((prev) => ({ ...prev, file: undefined }));
                  }
                }}
              />
            </FormSection>

            {errors.form && <FieldError>{errors.form}</FieldError>}

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="light"
                loading={loading}
                loadingText="Menganalisis..."
                className="w-full max-w-[300px]"
              >
                Analisis Pesan
              </Button>
            </div>
          </form>
        </section>
      </PageShell>
    </>
  );
}
