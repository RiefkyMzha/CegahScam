import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AnalysisHook from "../../components/AnalysisHook";
import PageShell from "../../components/ui/PageShell";
import Stepper from "../../components/ui/Stepper";
import FormSection from "../../components/ui/FormSection";
import { TextInput, FieldError } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { apiUrl } from "../../lib/api";
import LoadingOverlay from "../../components/LoadingOverlay";

const STEPS = [
  { label: "Pilih Kasus", state: "done" as const },
  { label: "Isi Data", state: "active" as const },
  { label: "Hasil Analisis", state: "todo" as const },
];

export default function Phone() {
  const [nomorTelp, setNomorTelp] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldError("");

    const phoneNumber = nomorTelp.trim().replace(/[^\d+]/g, "");
    if (!phoneNumber) {
      setFieldError("Nomor telepon wajib diisi.");
      return;
    }
    if (!/^(?:\+62|62|0)\d{7,13}$/.test(phoneNumber)) {
      setFieldError(
        "Gunakan format nomor Indonesia, contoh 081234567890 atau +6281234567890.",
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/analysis/phone"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomorTelepon: phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat mengirim laporan.",
        );
      }
      navigate("/analysis/resultphone", { state: { result: data } });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim laporan.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <LoadingOverlay message="Sedang menganalisis nomor..." />}

      <PageShell>
        <AnalysisHook />
        <Stepper steps={STEPS} />

        <section id="body-input" className="reveal form-card">
          <div id="title" className="form-title">
            <h2>Masukkan nomor telepon yang ingin diperiksa</h2>
          </div>

          <form className="form-body" onSubmit={submitForm} noValidate>
            <FormSection index={1} title="Nomor Telepon" required>
              <TextInput
                label="Nomor Telepon"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                name="nomorTelepon"
                placeholder="Contoh: 0812 3456 7890"
                value={nomorTelp}
                onChange={(e) => {
                  setNomorTelp(e.target.value);
                  if (fieldError) setFieldError("");
                }}
                error={fieldError}
                hint="Gunakan nomor Indonesia, misalnya 081234567890 atau +6281234567890."
              />
            </FormSection>

            {error && <FieldError>{error}</FieldError>}

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="light"
                loading={loading}
                loadingText="Menganalisis..."
                className="w-full max-w-[300px]"
              >
                Analisis Telepon
              </Button>
            </div>
          </form>
        </section>
      </PageShell>
    </>
  );
}
