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

const BANKS = [
  { value: "bca", label: "BCA" },
  { value: "bri", label: "BRI" },
  { value: "bni", label: "BNI" },
  { value: "mandiri", label: "Mandiri" },
  { value: "dana", label: "DANA" },
  { value: "ovo", label: "OVO" },
  { value: "gopay", label: "GOPAY" },
  { value: "lainnya", label: "Bank / dompet digital lain" },
];

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
];

const PURPOSES = [
  { value: "link", label: "Pembelian barang/jasa" },
  { value: "data-pribadi", label: "Biaya administrasi" },
  { value: "otp", label: "Hadiah/promo" },
  { value: "menyamar", label: "Pinjaman" },
  { value: "lainnya", label: "Lainnya" },
];

type Errors = {
  bank?: string;
  kanal?: string;
  tanggal?: string;
  tujuan?: string;
  tujuanLainnya?: string;
  institusi?: string;
  rekening?: string;
  nominal?: string;
  kronologi?: string;
  file?: string;
  form?: string;
};

const today = new Date().toISOString().slice(0, 10);

function formatRupiah(digits: string) {
  if (!digits) return "";
  return new Intl.NumberFormat("id-ID").format(Number(digits));
}

export default function Financial() {
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [jenisBank, setJenisBank] = useState("");
  const [jenisBankLain, setJenisBankLain] = useState("");
  const [kanalMedia, setKanalMedia] = useState("");
  const [tanggalKejadian, setTanggalKejadian] = useState("");
  const [tujuanTransaksi, setTujuanTransaksi] = useState<string[]>([]);
  const [tujuanTransaksiLain, setTujuanTransaksiLain] = useState("");
  const [namaInstitusi, setNamaInstitusi] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [namaPemilikRekening, setNamaPemilikRekening] = useState("");
  const [nominalKerugian, setNominalKerugian] = useState("");
  const [detailKronologi, setDetailKronologi] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function toggleTujuan(value: string) {
    setTujuanTransaksi((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  }

  function scrollToSection(key: string) {
    const map: Record<string, string> = {
      bank: "section-bank",
      kanal: "section-kanal",
      tanggal: "section-tanggal",
      tujuan: "section-tujuan",
      tujuanLainnya: "section-tujuan",
      institusi: "section-institusi",
      rekening: "section-institusi",
      nominal: "section-nominal",
      kronologi: "section-kronologi",
      file: "section-bukti",
    };
    document
      .getElementById(map[key] ?? "")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const nextErrors: Errors = {};
    const tujuanTransaksiPayload = tujuanTransaksi
      .map((value) =>
        value === "lainnya"
          ? tujuanTransaksiLain.trim()
            ? `lainnya: ${tujuanTransaksiLain.trim()}`
            : "lainnya"
          : value,
      )
      .join(",");
    if (!jenisBank) {
      nextErrors.bank = "Bank / dompet digital korban harus dipilih.";
    } else if (jenisBank === "lainnya" && !jenisBankLain.trim()) {
      nextErrors.bank = "Nama bank / dompet digital harus diisi.";
    }
    if (!kanalMedia) nextErrors.kanal = "Kanal media kejadian harus dipilih.";
    if (!tanggalKejadian) nextErrors.tanggal = "Tanggal kejadian harus diisi.";
    if (tujuanTransaksi.length === 0) {
      nextErrors.tujuan = "Tujuan transaksi harus dipilih.";
    } else if (
      tujuanTransaksi.includes("lainnya") &&
      !tujuanTransaksiLain.trim()
    ) {
      nextErrors.tujuanLainnya = "Jelaskan tujuan transaksi lainnya.";
    } else if (tujuanTransaksiPayload.length > 1_000) {
      nextErrors.tujuan = "Tujuan transaksi maksimal 1.000 karakter.";
    }
    if (!namaInstitusi.trim()) {
      nextErrors.institusi = "Nama institusi harus diisi.";
    }
    if (!nomorRekening.trim()) {
      nextErrors.rekening = "Nomor rekening harus diisi.";
    }
    if (!nominalKerugian) {
      nextErrors.nominal = "Nominal kerugian harus diisi.";
    }
    if (!detailKronologi.trim()) {
      nextErrors.kronologi = "Detail kronologi harus diisi.";
    }
    if (!fileBukti) nextErrors.file = "File bukti harus diunggah.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => scrollToSection(first));
      return;
    }

    setLoading(true);

    const bankName = jenisBank === "lainnya" ? jenisBankLain.trim() : jenisBank;

    const fd = new FormData();
    if (fileBukti) fd.append("file", fileBukti);
    fd.append("jenisBank", bankName);
    fd.append("kanalMedia", kanalMedia);
    fd.append("tanggalKejadian", tanggalKejadian);
    fd.append("tujuanTransaksi", tujuanTransaksiPayload);
    fd.append("namaInstitusi", namaInstitusi);
    fd.append("nomorRekening", nomorRekening);
    fd.append("namaPemilikRekening", namaPemilikRekening);
    fd.append("nominalKerugian", nominalKerugian);
    fd.append("detailKronologi", detailKronologi);

    try {
      const response = await fetch(apiUrl("/api/emergency/financial"), {
        method: "POST",
        body: fd,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat mengirim laporan.",
        );
      }
      navigate("/report/financial", { state: { result: data } });
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
            <h2>Laporkan kerugian finansial kamu</h2>
          </div>

          <form className="form-body" onSubmit={handleSubmit} noValidate>
            <FormSection
              id="section-bank"
              index={1}
              title="Bank/Dompet Digital Korban"
              description="Pilih yang sesuai."
              required
            >
              <RadioGroup
                name="bankKorban"
                label="Bank atau dompet digital korban"
                options={BANKS}
                value={jenisBank}
                onChange={(value) => {
                  setJenisBank(value);
                  if (errors.bank) {
                    setErrors((prev) => ({ ...prev, bank: undefined }));
                  }
                }}
                error={errors.bank}
              />
              {jenisBank === "lainnya" && (
                <TextInput
                  label="Nama bank atau dompet digital"
                  type="text"
                  name="jenisBankLain"
                  maxLength={100}
                  placeholder="Contoh: Bank Jago"
                  value={jenisBankLain}
                  onChange={(e) => setJenisBankLain(e.target.value)}
                  containerClassName="mt-2"
                />
              )}
            </FormSection>

            <FormSection
              id="section-kanal"
              index={2}
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
              id="section-tanggal"
              index={3}
              title="Tanggal Kejadian"
              required
            >
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
              id="section-tujuan"
              index={4}
              title="Tujuan Transaksi"
              description="Pilih yang sesuai."
              required
            >
              <CheckboxGroup
                name="tujuanTransaksi"
                label="Tujuan transaksi"
                options={PURPOSES}
                values={tujuanTransaksi}
                onToggle={(value) => {
                  toggleTujuan(value);
                  if (errors.tujuan) {
                    setErrors((prev) => ({ ...prev, tujuan: undefined }));
                  }
                  if (errors.tujuanLainnya) {
                    setErrors((prev) => ({
                      ...prev,
                      tujuanLainnya: undefined,
                    }));
                  }
                }}
                error={errors.tujuan}
              >
                {tujuanTransaksi.includes("lainnya") && (
                  <TextInput
                    label="Tujuan transaksi lainnya"
                    type="text"
                    name="tujuanTransaksiLain"
                    maxLength={1_000}
                    placeholder="Jelaskan tujuan transaksi"
                    value={tujuanTransaksiLain}
                    onChange={(e) => {
                      setTujuanTransaksiLain(e.target.value);
                      if (errors.tujuanLainnya) {
                        setErrors((prev) => ({
                          ...prev,
                          tujuanLainnya: undefined,
                        }));
                      }
                    }}
                    error={errors.tujuanLainnya}
                    containerClassName="mt-2"
                  />
                )}
              </CheckboxGroup>
            </FormSection>

            <FormSection
              id="section-institusi"
              index={5}
              title="Informasi Penipu"
              required
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-ink-700">
                    a. Nama institusi
                  </span>
                  <TextInput
                    label="Nama institusi"
                    type="text"
                    name="namaInstitusi"
                    maxLength={200}
                    placeholder="Contoh: PT.xxx, Bank xxx"
                    value={namaInstitusi}
                    onChange={(e) => {
                      setNamaInstitusi(e.target.value);
                      if (errors.institusi) {
                        setErrors((prev) => ({ ...prev, institusi: undefined }));
                      }
                    }}
                    error={errors.institusi}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-ink-700">
                    b. Nomor rekening tujuan
                  </span>
                  <TextInput
                    label="Nomor rekening tujuan"
                    type="text"
                    inputMode="numeric"
                    name="nomorRekening"
                    maxLength={50}
                    placeholder="Contoh: 1234567890123"
                    value={nomorRekening}
                    onChange={(e) => {
                      setNomorRekening(e.target.value);
                      if (errors.rekening) {
                        setErrors((prev) => ({ ...prev, rekening: undefined }));
                      }
                    }}
                    error={errors.rekening}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-ink-700">
                    c. Nama pemilik rekening penipu{" "}
                    <span className="font-normal text-ink-400">
                      (opsional jika ada bukti transfer)
                    </span>
                  </span>
                  <TextInput
                    label="Nama pemilik rekening penipu"
                    type="text"
                    name="namaPemilikRekening"
                    maxLength={200}
                    placeholder="Contoh: Fachri Nanda"
                    value={namaPemilikRekening}
                    onChange={(e) => setNamaPemilikRekening(e.target.value)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              id="section-nominal"
              index={6}
              title="Nominal Kerugian"
              required
            >
              <div>
                <TextInput
                  label="Nominal kerugian"
                  type="text"
                  inputMode="numeric"
                  name="nominalKerugian"
                  placeholder="50.000.000"
                  prefix="Rp"
                  className="pl-10"
                  value={formatRupiah(nominalKerugian)}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 15);
                    setNominalKerugian(digits);
                    if (errors.nominal) {
                      setErrors((prev) => ({ ...prev, nominal: undefined }));
                    }
                  }}
                  error={errors.nominal}
                  hint="Masukkan nominal rupiah tanpa titik; pemisah ribuan otomatis."
                />
              </div>
            </FormSection>

            <FormSection
              id="section-kronologi"
              index={7}
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

            <FormSection id="section-bukti" index={8} title="Bukti Transfer" required>
              <UploadField
                id="bukti-file-financial"
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
