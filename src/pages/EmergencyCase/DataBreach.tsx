import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import EmergencyHook from "../../components/EmergencyHook";
import PageShell from "../../components/ui/PageShell";
import Stepper from "../../components/ui/Stepper";
import FormSection from "../../components/ui/FormSection";
import {
  TextInput,
  TextArea,
  CheckboxGroup,
  RadioGroup,
  FieldError,
} from "../../components/ui/Field";
import UploadField from "../../components/ui/UploadField";
import Button from "../../components/ui/Button";
import { apiUrl } from "../../lib/api";
import LoadingOverlay from "../../components/LoadingOverlay";

const STEPS = [
  { label: "Pilih Kasus", state: "done" as const },
  { label: "Isi Data", state: "active" as const },
  { label: "Hasil Laporan", state: "todo" as const },
];

const DATA_TYPES = [
  { value: "data-pribadi", label: "Data pribadi (nama, email, nomor telepon, dll)" },
  { value: "media-sosial", label: "Akun media sosial" },
  { value: "perbankan", label: "Akun perbankan / finansial" },
  { value: "kartu", label: "Data kartu kredit / debit" },
  { value: "email", label: "Akun email" },
];

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
];

const ACTIONS = [
  { value: "link", label: "Mengirim link mencurigakan" },
  { value: "data-pribadi", label: "Meminta data pribadi" },
  { value: "otp", label: "Meminta OTP / PIN / Password" },
  { value: "menyamar", label: "Mengaku sebagai pihak tertentu" },
  { value: "lainnya", label: "Lainnya" },
];

const ACCESS_OPTIONS = [
  { value: "bisaAkses", label: "Masih bisa diakses" },
  { value: "tidakBisaAkses", label: "Tidak bisa diakses" },
  { value: "diketahuiLain", label: "Diketahui pihak lain" },
  { value: "tidakTahu", label: "Tidak tahu" },
];

type Errors = {
  jenisData?: string;
  tanggal?: string;
  kanal?: string;
  tindakan?: string;
  kronologi?: string;
  statusAkses?: string;
  file?: string;
  form?: string;
};

const today = new Date().toISOString().slice(0, 10);

export default function DataBreach() {
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [jenisData, setJenisData] = useState<string[]>([]);
  const [tanggalKejadian, setTanggalKejadian] = useState("");
  const [kanalMedia, setKanalMedia] = useState("");
  const [tindakanPelaku, setTindakanPelaku] = useState<string[]>([]);
  const [tindakanLainnya, setTindakanLainnya] = useState("");
  const [detailKronologi, setDetailKronologi] = useState("");
  const [statusAkses, setStatusAkses] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function toggleJenisData(value: string) {
    setJenisData((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  }

  function toggleTindakan(value: string) {
    setTindakanPelaku((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  }

  function scrollToSection(key: string) {
    const map: Record<string, string> = {
      jenisData: "section-jenis-data",
      tanggal: "section-tanggal",
      kanal: "section-kanal",
      tindakan: "section-tindakan",
      kronologi: "section-kronologi",
      statusAkses: "section-status-akses",
      file: "section-bukti",
    };
    const target = document.getElementById(map[key] ?? "");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const nextErrors: Errors = {};
    const jenisDataPayload = JSON.stringify(jenisData);
    const actions = tindakanPelaku.map((value) =>
      value === "lainnya" ? tindakanLainnya.trim() || "lainnya" : value,
    );
    const tindakanPelakuPayload = JSON.stringify(actions);
    if (jenisData.length === 0) {
      nextErrors.jenisData = "Jenis data/akun yang bocor harus dipilih.";
    } else if (jenisDataPayload.length > 1_000) {
      nextErrors.jenisData = "Jenis data maksimal 1.000 karakter.";
    }
    if (!tanggalKejadian) {
      nextErrors.tanggal = "Tanggal kejadian harus diisi.";
    }
    if (!kanalMedia) {
      nextErrors.kanal = "Kanal media kejadian harus dipilih.";
    }
    if (tindakanPelaku.length === 0) {
      nextErrors.tindakan = "Tindakan pelaku harus dipilih.";
    } else if (tindakanPelakuPayload.length > 1_000) {
      nextErrors.tindakan = "Tindakan pelaku maksimal 1.000 karakter.";
    }
    if (!detailKronologi.trim()) {
      nextErrors.kronologi = "Detail kronologi harus diisi.";
    }
    if (!statusAkses) {
      nextErrors.statusAkses = "Status akses perangkat harus dipilih.";
    }
    if (!fileBukti) {
      nextErrors.file = "File bukti percakapan harus diunggah.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => scrollToSection(first));
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("jenisData", jenisDataPayload);
    fd.append("tanggalKejadian", tanggalKejadian);
    fd.append("kanalMedia", kanalMedia);
    fd.append("tindakanPelaku", tindakanPelakuPayload);
    fd.append("detailKronologi", detailKronologi);
    fd.append("statusAkses", statusAkses);
    if (fileBukti) fd.append("fileBukti", fileBukti);

    try {
      const res = await fetch(apiUrl("/api/emergency/data"), {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat mengirim laporan.",
        );
      }
      navigate("/report/data", { state: { result: data } });
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
      {loading && <LoadingOverlay message="Sedang memproses laporan darurat..." />}

      <PageShell>
        <EmergencyHook />
        <Stepper steps={STEPS} />

        <section id="body-input" className="reveal form-card">
          <div id="title" className="form-title">
            <h2>Laporkan kebocoran data kamu</h2>
          </div>

          <form className="form-body" onSubmit={submitForm} noValidate>
            <FormSection
              id="section-jenis-data"
              index={1}
              title="Jenis data/akun yang bocor"
              description="Pilih yang sesuai."
              required
            >
              <CheckboxGroup
                name="jenisData"
                label="Jenis data/akun yang bocor"
                options={DATA_TYPES}
                values={jenisData}
                onToggle={(value) => {
                  toggleJenisData(value);
                  if (errors.jenisData) {
                    setErrors((prev) => ({ ...prev, jenisData: undefined }));
                  }
                }}
                error={errors.jenisData}
              />
            </FormSection>

            <FormSection id="section-tanggal" index={2} title="Tanggal Kejadian" required>
              <TextInput
                label="Tanggal kejadian"
                type="date"
                name="tanggalKejadian"
                max={today}
                className="max-w-full sm:max-w-[240px]"
                value={tanggalKejadian}
                onChange={(e) => {
                  setTanggalKejadian(e.target.value);
                  if (errors.tanggal) {
                    setErrors((prev) => ({ ...prev, tanggal: undefined }));
                  }
                }}
                error={errors.tanggal}
              />
            </FormSection>

            <FormSection
              id="section-kanal"
              index={3}
              title="Kanal media kejadian"
              description="Pilih yang sesuai."
              required
            >
              <RadioGroup
                name="kanalMedia"
                label="Kanal media kejadian"
                options={CHANNELS}
                value={kanalMedia}
                onChange={(value) => {
                  setKanalMedia(value);
                  if (errors.kanal) {
                    setErrors((prev) => ({ ...prev, kanal: undefined }));
                  }
                }}
                error={errors.kanal}
              />
            </FormSection>

            <FormSection
              id="section-tindakan"
              index={4}
              title="Apa yang dilakukan pelaku?"
              description="Pilih yang sesuai."
              required
            >
              <CheckboxGroup
                name="tindakanPelaku"
                label="Tindakan pelaku"
                options={ACTIONS}
                values={tindakanPelaku}
                onToggle={(value) => {
                  toggleTindakan(value);
                  if (errors.tindakan) {
                    setErrors((prev) => ({ ...prev, tindakan: undefined }));
                  }
                }}
                error={errors.tindakan}
              >
                {tindakanPelaku.includes("lainnya") && (
                  <TextInput
                    label="Tindakan pelaku lainnya"
                    type="text"
                    name="tindakanLainnya"
                    maxLength={1_000}
                    placeholder="Tulis tindakan pelaku"
                    value={tindakanLainnya}
                    onChange={(e) => setTindakanLainnya(e.target.value)}
                    containerClassName="mt-2"
                  />
                )}
              </CheckboxGroup>
            </FormSection>

            <FormSection
              id="section-bukti"
              index={5}
              title="Bukti percakapan"
              required
            >
              <UploadField
                id="bukti-file-data"
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

            <FormSection
              id="section-kronologi"
              index={6}
              title="Detail Kronologi"
              required
            >
              <TextArea
                label="Detail kronologi"
                name="detailKronologi"
                rows={4}
                maxLength={10_000}
                placeholder="Contoh: waktu itu ketika saya menerima pesan..."
                value={detailKronologi}
                onChange={(e) => {
                  setDetailKronologi(e.target.value);
                  if (errors.kronologi) {
                    setErrors((prev) => ({ ...prev, kronologi: undefined }));
                  }
                }}
                error={errors.kronologi}
              />
            </FormSection>

            <FormSection
              id="section-status-akses"
              index={7}
              title="Status Akses Perangkat"
              required
            >
              <RadioGroup
                name="statusAkses"
                label="Status akses perangkat"
                options={ACCESS_OPTIONS}
                value={statusAkses}
                onChange={(value) => {
                  setStatusAkses(value);
                  if (errors.statusAkses) {
                    setErrors((prev) => ({
                      ...prev,
                      statusAkses: undefined,
                    }));
                  }
                }}
                error={errors.statusAkses}
              />
            </FormSection>

            {errors.form && <FieldError>{errors.form}</FieldError>}

            <div className="flex justify-center">
              <Button
                type="submit"
                loading={loading}
                loadingText="Memproses laporan..."
                className="w-full max-w-[300px]"
              >
                Susun Laporan
              </Button>
            </div>
          </form>
        </section>
      </PageShell>
    </>
  );
}
