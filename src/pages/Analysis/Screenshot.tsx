import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AnalysisHook from "../../components/AnalysisHook";
import PageShell from "../../components/ui/PageShell";
import Stepper from "../../components/ui/Stepper";
import FormSection from "../../components/ui/FormSection";
import { RadioGroup, FieldError } from "../../components/ui/Field";
import UploadField from "../../components/ui/UploadField";
import Button from "../../components/ui/Button";
import { apiUrl } from "../../lib/api";
import LoadingOverlay from "../../components/LoadingOverlay";

const STEPS = [
  { label: "Pilih Kasus", state: "done" as const },
  { label: "Isi Data", state: "active" as const },
  { label: "Hasil Analisis", state: "todo" as const },
];

const PLATFORMS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
];

export default function Screenshot() {
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [platform, setPlatform] = useState("");
  const [errors, setErrors] = useState<{
    platform?: string;
    file?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const nextErrors: typeof errors = {};
    if (!platform) {
      nextErrors.platform = "Pilih platform yang digunakan.";
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
    fd.append("platform", platform);
    if (fileBukti) fd.append("fileBukti", fileBukti);

    try {
      const res = await fetch(apiUrl("/api/analysis/screenshot"), {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat mengirim laporan.",
        );
      }
      navigate("/analysis/resultscreenshot", { state: { result: data } });
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
      {loading && <LoadingOverlay message="Sedang membaca screenshot..." />}

      <PageShell>
        <AnalysisHook />
        <Stepper steps={STEPS} />

        <section id="body-input" className="reveal form-card">
          <div id="title" className="form-title">
            <h2>Silakan isi data berikut</h2>
          </div>

          <form className="form-body" onSubmit={submitForm} noValidate>
            <FormSection
              index={1}
              title="Platform / Aplikasi"
              description="Pilih platform yang digunakan untuk percakapan."
              required
            >
              <RadioGroup
                name="platform"
                label="Platform / Aplikasi"
                options={PLATFORMS}
                value={platform}
                onChange={(value) => {
                  setPlatform(value);
                  if (errors.platform) {
                    setErrors((prev) => ({ ...prev, platform: undefined }));
                  }
                }}
                error={errors.platform}
              />
            </FormSection>

            <FormSection index={2} title="Bukti Percakapan" required>
              <UploadField
                id="bukti-file-screenshot"
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
                Analisis Screenshot
              </Button>
            </div>
          </form>
        </section>
      </PageShell>
    </>
  );
}
