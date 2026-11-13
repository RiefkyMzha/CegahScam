import { Link, useLocation, useNavigate } from "react-router-dom";
import RiskGauge from "../../components/RiskGauge";
import Robot from "../../components/Robot";
import PageShell from "../../components/ui/PageShell";
import Stepper from "../../components/ui/Stepper";
import Button from "../../components/ui/Button";
import robot from "../../assets/Emergency/robot1.webp";
import { getRisk, getRiskScore, type AnalysisResult } from "../../lib/risk";

export type ResultKind = "chat" | "phone" | "screenshot";

const STEPS = [
  { label: "Pilih Kasus", state: "done" as const },
  { label: "Isi Data", state: "done" as const },
  { label: "Hasil Analisis", state: "active" as const },
];

const CHECKLIST = [
  { text: "Pelajari cara melindungi data pribadi", icon: "shield" },
  { text: "Gunakan kanal resmi saat menghubungi bank", icon: "bank" },
  { text: "Ikuti panduan keamanan dari sumber terpercaya", icon: "book" },
] as const;

const FALLBACK_CONTACT = {
  name: "CegahScam Care",
  number: "0851 2345 6789",
  hours: "Senin – Jumat, 09.00 – 17.00",
};

type ResultViewProps = {
  kind: ResultKind;
};

export default function ResultView({ kind }: ResultViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.result as AnalysisResult | undefined;

  if (!data) {
    return (
      <PageShell>
        <section className="reveal mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-4xl bg-white p-8 text-center shadow-xl shadow-[#8FA9C4]/20 sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[#3385FF]">
            <InfoIcon className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold text-ink-700">
            Hasil analisis tidak ditemukan
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-ink-500">
            Halaman ini menampilkan hasil dari analisis yang baru saja kamu
            kirim. Karena data tidak tersimpan, silakan ulangi analisis dengan
            mengisi form kembali.
          </p>
          <Button type="button" onClick={() => navigate("/analysis")}>
            Mulai analisis lagi
          </Button>
        </section>
      </PageShell>
    );
  }

  const skor = getRiskScore(data.risk_category, data.risk_score);
  const risk = getRisk(data.risk_category);
  const levelName = risk.label.replace("Risiko ", "");
  const summary = data.summary?.trim() || risk.summary;
  const reasons = data.reasons?.length ? data.reasons : risk.reasons;
  const recommendations = data.recommendations ?? [];

  const officialContacts = data.official_contacts?.length
    ? data.official_contacts
    : data.official_contact
      ? [data.official_contact]
      : [];
  const primaryContact = officialContacts[0];
  const bankName =
    primaryContact?.name ?? data.bank_name ?? data.bank ?? null;

  const callCenterDigits = FALLBACK_CONTACT.number.replace(/\D/g, "");

  const RiskIcon = kind === "chat" ? WarningIcon : InfoIcon;

  return (
    <PageShell>
      <div className="mb-2 flex items-center justify-between gap-3">
        <Link
          to="/analysis"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#446685] transition hover:text-[#1E40AF]"
        >
          <span aria-hidden="true">←</span> Analisis lagi
        </Link>
      </div>

      <Stepper steps={STEPS} className="mt-0" />

      <div className="reveal grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="flex items-center justify-center py-3">
            <RiskGauge value={skor} size={290} colors={risk.gaugeColors} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex h-full flex-col gap-3 rounded-3xl bg-white p-5 shadow-lg shadow-[#8FA9C4]/20">
              <p className="text-[13px] font-semibold text-[#446685]">
                Hubungi Kami
              </p>

              <a
                href={`tel:${callCenterDigits}`}
                className="flex items-center gap-2 text-[13px] font-semibold text-[#26384A] hover:text-[#1E40AF]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#E5484D]">
                  <PhoneIcon className="h-3.5 w-3.5" />
                </span>
                <span className="break-words">{FALLBACK_CONTACT.number}</span>
              </a>

              <p className="text-xs leading-tight text-[#98A2B3]">
                Call center CegahScam · {FALLBACK_CONTACT.hours}
              </p>
            </div>

            <div className="flex h-full flex-col gap-3 rounded-3xl bg-[#5A87B8] p-5 text-white shadow-lg shadow-[#5A87B8]/30">
              <p className="text-[13px] font-semibold">Rekomendasi Bank</p>

              {bankName ? (
                <div className="flex flex-1 flex-col justify-center gap-2.5 text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#52789A]">
                      <BankIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 break-words">
                      {officialContacts.length > 1
                        ? "Kanal Resmi Bank Terkait"
                        : bankName}
                    </span>
                  </div>

                  {officialContacts.map((contact, index) => {
                    const number =
                      contact.whatsapp?.trim() || contact.phone?.trim() || "";
                    const digits = number.replace(/\D/g, "");
                    const isWhatsApp = digits.startsWith("62");
                    const href = digits
                      ? isWhatsApp
                        ? `https://wa.me/${digits}`
                        : `tel:${digits}`
                      : undefined;

                    if (!number) return null;

                    return (
                      <a
                        key={`${contact.name}-${index}`}
                        href={href}
                        target={isWhatsApp ? "_blank" : undefined}
                        rel={isWhatsApp ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 font-semibold text-white transition hover:text-[#EAF3FF]"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                          {isWhatsApp ? (
                            <WhatsAppIcon className="h-3.5 w-3.5" />
                          ) : (
                            <PhoneIcon className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <span className="min-w-0 break-words">
                          {officialContacts.length > 1
                            ? `${contact.name}: ${number}`
                            : number}
                        </span>
                        <span className="sr-only">
                          {isWhatsApp
                            ? "Hubungi lewat WhatsApp"
                            : "Hubungi lewat telepon"}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-white/90">
                  Belum ada rekomendasi bank dari hasil analisis.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <section className="rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
            <div className="flex items-start gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${risk.iconBg} ${risk.iconColor}`}
              >
                <RiskIcon className="h-6 w-6" />
              </span>

              <div className="flex min-w-0 flex-col gap-2">
                <h1 className="text-[22px] font-bold leading-tight text-ink-700">
                  {risk.label}
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-ink-500">
                  {summary}
                </p>
              </div>
            </div>
          </section>

          <section className="flex-1 rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
            <h2 className="text-[22px] font-bold leading-tight text-ink-700">
              Kenapa Risikonya {levelName}?
            </h2>

            <ul className="mt-5 flex flex-col gap-4">
              {reasons.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold ${risk.badgeBg} ${risk.badgeText}`}
                  >
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-500">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex-1 rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
            <h2 className="text-[22px] font-bold leading-tight text-ink-700">
              Rekomendasi
            </h2>

            {recommendations.length > 0 ? (
              <ul className="mt-5 flex flex-col gap-4">
                {recommendations.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold ${risk.badgeBg} ${risk.badgeText}`}
                    >
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink-500">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                Belum ada rekomendasi tambahan dari hasil analisis. Ikuti
                langkah pencegahan di bawah ini.
              </p>
            )}
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-4xl bg-white p-5 shadow-xl shadow-[#8FA9C4]/20 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold leading-tight text-ink-700 sm:text-[22px]">
              Apakah kamu sudah menjadi korban?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">
              Jangan panik. Laporkan sekarang agar bisa segera ditangani.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={() => navigate("/emergency/data")}>
              Data saya bocor
            </Button>
            <Button
              type="button"
              variant="light"
              onClick={() => navigate("/emergency/financial")}
            >
              Saya kehilangan uang
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-center gap-8 rounded-4xl px-4 py-6 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-10">
        <div className="relative flex flex-col items-center sm:flex-row sm:items-start sm:justify-center sm:gap-4">
          <Robot
            src={robot}
            alt="Maskot CegahScam"
            motion="sway"
            interactive
            className="order-2 w-45 object-contain drop-shadow-xl sm:order-1 sm:w-52"
          />

          <div className="relative order-1 mb-1 rounded-[26px] bg-linear-to-br from-[#5BA7F2] to-[#3D8FE0] px-5 py-2.5 text-center shadow-lg shadow-[#5BA7F2]/30 sm:order-2 sm:mb-0 sm:mt-6 sm:text-left">
            <p className="whitespace-nowrap text-[17px] font-bold text-white">
              Tetap Waspada, Yo!
            </p>
            <span className="absolute -bottom-1 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-xs bg-[#4B9BE8] sm:-left-1.5 sm:bottom-3 sm:translate-x-0" />
          </div>
        </div>

        <div className="relative rounded-4xl bg-white p-6 shadow-xl shadow-[#8FA9C4]/20">
          <Link
            to="/education"
            aria-label="Pelajari lebih lanjut"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3385FF] transition hover:bg-[#5E83A5] hover:text-white"
          >
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>

          <ul className="flex flex-col gap-3 pr-10">
            {CHECKLIST.map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3385FF]">
                  {item.icon === "shield" && <ShieldIcon className="h-4 w-4" />}
                  {item.icon === "bank" && <BankIcon className="h-4 w-4" />}
                  {item.icon === "book" && <BookIcon className="h-4 w-4" />}
                </span>
                <p className="text-sm leading-snug text-[#344054]">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}

function WarningIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BankIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V10M9.5 21V10M14.5 21V10M19 21V10" />
      <path d="m12 2 9 5H3l9-5Z" />
    </svg>
  );
}

function BookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
      <path d="M8 7h8M8 11h5" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}
