import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageShell from "../../components/ui/PageShell";
import Stepper from "../../components/ui/Stepper";
import Button from "../../components/ui/Button";
import Robot from "../../components/Robot";
import OfficialContacts from "../../components/OfficialContacts";
import type { OfficialContact } from "../../lib/risk";
import robotChat from "../../assets/Emergency/robot1.webp";
import robotMagnifier from "../../assets/Emergency/robot2.webp";

type ActionStep = {
  title: string;
  description: string;
};

type BankContact = OfficialContact;

type EmergencyResult = {
  ai_kronologi?: string;
  langkah_penanganan?: ActionStep[];
  official_contact?: OfficialContact | null;
  official_contacts?: OfficialContact[];
  bank?: BankContact | string | null;
  bank_analysis?: BankContact | null;
  bank_contact?: BankContact | null;
  nama_bank?: string;
  bank_korban?: string;
  bank_name?: string;
  bank_phone?: string;
  bank_whatsapp?: string | null;
  emergencyResponse?: string;
  result?: EmergencyResult;
  data?: EmergencyResult;
};

type ReportKind = "data" | "financial";

type ReportCopy = {
  label: string;
  intro: string;
  summary: string;
  steps: ActionStep[];
  contact: OfficialContact;
  contactNote: string;
  formPath: string;
  mascot: string;
  speech: string;
};

const REPORT_COPY: Record<ReportKind, ReportCopy> = {
  data: {
    label: "Kebocoran Data",
    intro:
      "Ringkasan, langkah penanganan, dan kontak rujukan telah disusun berdasarkan bukti yang disampaikan pelapor. Dokumen ini dapat disalin, disimpan, atau diteruskan kepada pihak terkait.",
    summary:
      "Pelapor menyampaikan dugaan kebocoran data pribadi. Kronologi dirangkum berdasarkan bukti percakapan yang diunggah tanpa mengubah urutan kejadian. Pelapor disarankan segera mengamankan akun yang terdampak dan menghubungi kanal resmi terkait.",
    steps: [
      {
        title: "Keluar dari Semua Perangkat",
        description:
          'Buka pengaturan keamanan di aplikasi yang terdampak (WhatsApp/Instagram/Email), lalu pilih opsi "Keluar dari semua perangkat" atau "Logout dari semua sesi".',
      },
      {
        title: "Ganti Password Utama & Aktifkan 2FA",
        description:
          "Ubah password email utama, lalu aktifkan autentikasi dua faktor (2FA) memakai aplikasi authenticator, bukan hanya SMS.",
      },
      {
        title: "Beri Peringatan ke Kerabat & Laporkan Akun",
        description:
          "Informasikan ke keluarga dan kontak terdekat bahwa akunmu diretas, supaya tidak ada yang tertipu pinjaman atau permintaan uang atas namamu.",
      },
    ],
    contact: {
      name: "Kementerian Komunikasi dan Digital (Komdigi)",
      phone: "159",
    },
    contactNote:
      "Pastikan hanya menghubungi kanal resmi. Jangan pernah mengirimkan OTP atau kata sandi kepada pihak mana pun.",
    formPath: "/emergency/data",
    mascot: robotMagnifier,
    speech: "Aku sudah periksa laporanmu!",
  },
  financial: {
    label: "Penipuan Finansial",
    intro:
      "Ringkasan, langkah penanganan, dan kontak rujukan telah disusun berdasarkan bukti yang disampaikan pelapor. Dokumen ini dapat disalin, disimpan, atau diteruskan kepada pihak terkait.",
    summary:
      "Pelapor menyampaikan dugaan penipuan finansial. Kronologi dirangkum berdasarkan bukti transaksi dan percakapan yang diunggah tanpa mengubah urutan kejadian. Pelapor disarankan segera mengamankan rekening dan menghubungi bank atau kanal resmi terkait.",
    steps: [
      {
        title: "Hubungi Call Center Bank Pengirim",
        description:
          "Telepon customer service resmi bank kamu sekarang untuk meminta penguncian sementara rekening penipu dan mengamankan akun pribadimu.",
      },
      {
        title: "Amankan Akses M-Banking & PIN",
        description:
          "Ganti PIN M-Banking, password internet banking, dan PIN ATM dari perangkat yang aman. Jangan memakai password yang sama dengan akun lain.",
      },
      {
        title: "Bawa Draf Laporan ke Kepolisian & Portal Resmi",
        description:
          "Simpan laporan ini sebagai PDF, lalu lampirkan saat membuat Laporan Polisi (STPL) di Polsek/Polres atau saat melapor ke CekRekening.id.",
      },
    ],
    contact: {
      name: "Kontak bank belum tersedia dari hasil analisis",
    },
    contactNote:
      "Gunakan kanal resmi bank yang dianalisis. Jangan pernah mengirimkan OTP atau PIN kepada pihak mana pun.",
    formPath: "/emergency/financial",
    mascot: robotChat,
    speech: "Tenang, aku bantu rapikan!",
  },
};

const STEPS = [
  { label: "Pilih Kasus", state: "done" as const },
  { label: "Isi Data", state: "done" as const },
  { label: "Hasil Laporan", state: "active" as const },
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formalizeReportText(value: string) {
  return value
    .replace(/\bpelapor\b/gi, "saya")
    .replace(/\bkamu\b/gi, "saya")
    .replace(/\bAnda\b/g, "saya");
}

function getReportSummary(value: string | undefined, fallback: string) {
  if (!value || /\[mock mode\]/i.test(value)) {
    return formalizeReportText(fallback);
  }

  return formalizeReportText(value);
}

async function writeToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function printDocument(html: string) {
  const printWindow = window.open("", "_blank", "width=900,height=1000");

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 300);
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    window.setTimeout(() => iframe.remove(), 1000);
  };
}

type EmergencyReportViewProps = {
  kind: ReportKind;
};

export default function EmergencyReportView({ kind }: EmergencyReportViewProps) {
  const copy = REPORT_COPY[kind];
  const location = useLocation();
  const response = location.state?.result as EmergencyResult | undefined;
  const data = response?.result ?? response?.data ?? response;

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    document.title = `Laporan ${copy.label} - CegahScam`;
  }, [copy.label]);

  const summary = getReportSummary(
    data?.ai_kronologi || data?.emergencyResponse,
    copy.summary,
  );
  const steps = data?.langkah_penanganan?.length
    ? data.langkah_penanganan
    : copy.steps;
  const legacyBankContact =
    data?.bank_analysis ??
    data?.bank_contact ??
    (typeof data?.bank === "object" ? data.bank : null) ??
    (data?.bank_name
      ? {
          name: data.bank_name,
          phone: data.bank_phone,
          whatsapp: data.bank_whatsapp,
        }
      : data?.nama_bank || data?.bank_korban
        ? { name: data.nama_bank ?? data.bank_korban! }
        : typeof data?.bank === "string"
          ? { name: data.bank }
          : null);
  const officialContacts = data?.official_contacts?.length
    ? data.official_contacts
    : data?.official_contact
      ? [data.official_contact]
      : [];
  const contactCandidates =
    officialContacts.length > 0
      ? officialContacts
      : kind === "financial" && legacyBankContact
        ? [legacyBankContact]
        : [copy.contact];

  const message = [
    `*LAPORAN ${copy.label.toUpperCase()}*`,
    "",
    "Yth. Pihak yang Berwenang,",
    "",
    "Dengan hormat,",
    `melalui pesan ini saya menyampaikan laporan terkait dugaan ${copy.label.toLowerCase()}. Laporan ini saya susun berdasarkan informasi dan bukti yang saya sampaikan melalui CegahScam.`,
    "",
    "Berikut detail laporan:",
    summary,
    "",
    "Demikian laporan ini saya sampaikan. Saya memohon agar laporan ini dapat ditindaklanjuti sesuai prosedur yang berlaku. Atas perhatian dan tindak lanjutnya, saya mengucapkan terima kasih.",
  ].join("\n");

  const shareLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

  async function handleCopy() {
    setCopyError("");
    try {
      await writeToClipboard(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError("Teks gagal disalin. Blok teks di bawah lalu salin manual.");
    }
  }

  function handleDownloadPdf() {
    const generatedAt = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date());
    const reportCode = `CS-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${kind.toUpperCase()}`;
    const reportContacts = contactCandidates
      .map((contact) => {
        const details = [
          contact.phone && `Telepon: ${contact.phone}`,
          contact.whatsapp && `WhatsApp: ${contact.whatsapp}`,
          contact.email && `Email: ${contact.email}`,
          contact.instagram && `Instagram: ${contact.instagram}`,
          contact.twitter && `X/Twitter: ${contact.twitter}`,
        ]
          .filter(Boolean)
          .map((detail) => `<li>${escapeHtml(String(detail))}</li>`)
          .join("");

        return `<li><strong>${escapeHtml(contact.name)}</strong>${details ? `<ul>${details}</ul>` : ""}</li>`;
      })
      .join("");

    const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Laporan Darurat ${escapeHtml(copy.label)} - CegahScam</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #26384A; margin: 0; line-height: 1.6; background: #EAF2FA; }
  .page { position: relative; max-width: 760px; margin: 0 auto; padding: 38px 46px 32px; background: #FFFFFF; min-height: 100vh; overflow: hidden; }
  .page:after { content: "CEGAHSCAM"; position: absolute; top: 46%; left: 18%; color: #52789A; opacity: .035; font-size: 72px; font-weight: 800; letter-spacing: 5px; transform: rotate(-28deg); }
  .topline { height: 7px; margin: -38px -46px 30px; background: linear-gradient(90deg, #26384A 0%, #5E83A5 55%, #ADCEFF 100%); }
  .header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding-bottom: 18px; border-bottom: 1px solid #C8D6E3; }
  .identity { display: flex; align-items: center; gap: 14px; }
  .logo { width: 62px; height: 62px; object-fit: contain; }
  .brand { margin: 0; color: #26384A; font-size: 21px; font-weight: 700; }
  .eyebrow { margin: 3px 0 0; color: #52789A; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
  .document-label { color: #667085; font-size: 10px; text-align: right; line-height: 1.5; }
  .document-label strong { display: block; color: #26384A; font-size: 11px; }
  h1 { margin: 34px 0 6px; color: #26384A; font-size: 26px; line-height: 1.25; }
  .muted { color: #667085; font-size: 12px; margin: 0 0 26px; }
  .meta { display: flex; gap: 10px; margin-bottom: 28px; }
  .badge { border-radius: 999px; padding: 5px 10px; background: #EAF2FA; color: #52789A; font-size: 10px; font-weight: 700; }
  h2 { color: #52789A; font-size: 15px; margin: 0 0 10px; }
  .opening { margin: 0 0 24px; color: #3F4E5E; font-size: 13px; }
  .summary { position: relative; z-index: 1; border: 1px solid #D7E1EA; border-left: 5px solid #5E83A5; border-radius: 10px; padding: 20px 22px; background: #F7FAFD; }
  .summary p { margin: 0; font-size: 14px; white-space: pre-line; }
  .contacts { margin-top: 24px; border: 1px solid #D7E1EA; border-radius: 10px; padding: 16px 20px; background: #F7FAFD; font-size: 12px; }
  .contacts ul { margin: 8px 0 0; padding-left: 20px; }
  .contacts li + li { margin-top: 8px; }
  .notice { margin-top: 22px; padding: 12px 14px; border-radius: 8px; background: #FFF8E7; color: #795E18; font-size: 11px; }
  .footer { position: relative; z-index: 1; display: flex; justify-content: space-between; gap: 20px; margin-top: 70px; padding-top: 14px; border-top: 1px solid #C8D6E3; color: #98A2B3; font-size: 10px; }
  .footer strong { color: #52789A; }
</style>
</head>
<body>
  <main class="page">
    <div class="topline"></div>
    <header class="header">
      <div class="identity">
        <img class="logo" src="${escapeHtml(`${window.location.origin}/logo2.png`)}" alt="Logo CegahScam" />
        <div>
          <p class="brand">Cegah<span style="color:#1E40AF">Scam</span></p>
          <p class="eyebrow">Platform Perlindungan Digital</p>
        </div>
      </div>
      <div class="document-label">
        <strong>LAPORAN DARURAT</strong>
        ${escapeHtml(reportCode)}
      </div>
    </header>

    <h1>${escapeHtml(copy.label)}</h1>
    <p class="muted">Dokumen laporan disusun berdasarkan informasi yang disampaikan oleh pelapor melalui CegahScam</p>
    <div class="meta">
      <span class="badge">DOKUMEN DIGITAL</span>
      <span class="badge">${escapeHtml(generatedAt)}</span>
    </div>

    <p class="opening"><strong>Yth. Pihak yang Berwenang,</strong><br /><br />
      Dengan hormat,<br />
      melalui dokumen ini saya menyampaikan laporan terkait dugaan ${escapeHtml(copy.label.toLowerCase())}. Laporan ini saya susun berdasarkan informasi dan bukti yang saya sampaikan melalui CegahScam.
    </p>

    <section class="summary">
      <h2>Berikut Detail Laporan</h2>
      <p>${escapeHtml(summary)}</p>
    </section>

    <section class="contacts">
      <h2>Kontak Rujukan</h2>
      <ul>${reportContacts}</ul>
    </section>

    <div class="notice">Demikian laporan ini saya sampaikan. Saya memohon agar laporan ini dapat ditindaklanjuti sesuai prosedur yang berlaku. Atas perhatian dan tindak lanjutnya, saya mengucapkan terima kasih.</div>
    <div class="footer">
      <span><strong>CegahScam</strong> · Kenali. Pahami. Hadapi.</span>
      <span>Dokumen dibuat otomatis · ${escapeHtml(reportCode)}</span>
    </div>
  </main>
</body>
</html>`;

    printDocument(html);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl animate-fade-up text-center">
        <h1 className="text-2xl font-bold leading-tight text-ink-400 sm:text-3xl lg:text-4xl">
          Laporan
          <span className="block text-black">{copy.label}</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#3F4E5E] sm:text-base">
          Ringkasan, langkah penanganan, dan kontak rujukan sudah disusun.
        </p>
      </div>

      <Stepper steps={STEPS} />

      <div className="reveal mx-auto mt-2 flex w-full max-w-[960px] flex-col gap-5">
        <section className="relative overflow-hidden rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#EAF2FA]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-10 left-52 h-2.5 w-2.5 rounded-full bg-[#F7C873]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-44 top-12 h-2 w-2 rounded-full bg-[#85B6FF] robot-float"
          />

          <div className="relative grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
            <div className="relative mx-auto flex w-full max-w-[260px] flex-col items-center">
              <div
                aria-hidden="true"
                className="absolute bottom-12 h-44 w-44 rounded-full bg-linear-to-br from-[#DCEAF8] to-[#F7FAFD] sm:h-52 sm:w-52"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-8 h-48 w-48 rounded-full border border-dashed border-[#BBD4E9] sm:h-56 sm:w-56"
              />

              <Robot
                src={copy.mascot}
                alt="Maskot CegahScam"
                motion="bob"
                interactive
                className="relative h-44 w-auto object-contain drop-shadow-[0_18px_25px_rgba(82,120,154,0.25)] sm:h-56 lg:h-60"
              />

              <div className="relative -mt-3 rounded-2xl bg-white px-4 py-2 text-center text-xs font-semibold text-[#52789A] shadow-lg shadow-[#8FA9C4]/30">
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white"
                />
                {copy.speech}
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52789A]">
                {copy.label}
              </p>
              <h2 className="mt-1 text-[22px] font-bold leading-tight text-ink-700 sm:text-[26px]">
                Laporan {copy.label} sudah siap
              </h2>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-500 sm:text-sm">
                {copy.intro}
              </p>

              <div className="mt-5 rounded-2xl border border-[#E1EAF2] bg-[#F7FAFD] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52789A]">
                    Ringkasan Laporan
                  </p>
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1FB855]"
                  >
                    WhatsApp
                  </a>
                </div>
                <p
                  className={`mt-2 whitespace-pre-line pr-2 text-[13px] leading-relaxed text-ink-500 sm:text-sm ${
                    expanded ? "" : "line-clamp-5"
                  }`}
                >
                  {summary}
                </p>
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  aria-expanded={expanded}
                  className="mt-2 text-xs font-bold text-[#52789A] hover:text-[#446685]"
                >
                  {expanded ? "Ringkas" : "Selengkapnya"}
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button type="button" variant="sky" onClick={handleDownloadPdf}>
                  Unduh PDF
                </Button>
                <Button type="button" variant="outline" onClick={handleCopy}>
                  {copied ? "Tersalin!" : "Salin Laporan"}
                </Button>
              </div>

              {copyError && (
                <p className="mt-3 text-sm text-danger-600">{copyError}</p>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="flex flex-col rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-ink-700 sm:text-xl">
                Template Pesan
              </h2>
            </div>
            <pre className="mt-3 max-h-[320px] overflow-y-auto whitespace-pre-wrap rounded-2xl bg-[#F3F7FB] p-4 font-sans text-xs leading-relaxed text-[#3F4E5E]">
              {message}
            </pre>
          </section>

          <section className="flex flex-col rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
            <h2 className="text-lg font-bold text-ink-700 sm:text-xl">
              Kontak Rujukan
            </h2>

            <div className="mt-4 flex flex-1 flex-col gap-4 rounded-2xl border border-[#D7E1EA] p-4">
              <OfficialContacts contacts={contactCandidates} />
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              {copy.contactNote}
            </p>
          </section>
        </div>

        <section className="rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
          <h2 className="text-lg font-bold text-ink-700 sm:text-xl">
            Langkah Penanganan
          </h2>

          <ol className="mt-4 flex flex-col gap-5">
            {steps.map((step, index) => (
              <li key={`${step.title}-${index}`} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#52789A] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-ink-700">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="flex flex-col items-start justify-between gap-3 rounded-4xl bg-white/60 p-5 text-sm text-ink-500 sm:flex-row sm:items-center">
          <p>Data laporan tidak cocok? Kamu bisa memperbaiki isian dari awal.</p>
          <Link
            to={copy.formPath}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-2 font-bold text-[#5E83A5] shadow-md transition hover:-translate-y-0.5 hover:bg-[#5E83A5] hover:text-white"
          >
            Perbaiki Laporan
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
