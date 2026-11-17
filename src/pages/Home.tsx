import { Link } from "react-router-dom";
import { useState } from "react";

import body1 from "../assets/Home/body-1.webp";
import body2 from "../assets/Home/body-2.webp";
import heroIcon from "../assets/Home/heroicon.webp";
import whyRobot from "../assets/Education/edu-robot.webp";
import cursor from "../assets/Icon/Cursor.svg";
import files from "../assets/Icon/Files.svg";
import handHeart from "../assets/Icon/HandHeart.svg";
import Robot from "../components/Robot";
import PageShell from "../components/ui/PageShell";

const steps = [
  { title: "Pilih Kasus", icon: cursor },
  { title: "Penanganan", icon: handHeart },
  { title: "Hasil Laporan", icon: files },
];

const faqs = [
  {
    id: "FAQ1",
    question: "Apa itu CegahScam?",
    answer:
      "CegahScam adalah platform yang membantu kamu mengenali, menganalisis, dan menangani risiko penipuan digital.",
  },
  {
    id: "FAQ2",
    question: "Apakah CegahScam langsung melaporkan kasus saya?",
    answer:
      "Tidak. CegahScam membantumu menyusun kronologi dan langkah penanganan, lalu kamu sendiri yang melapor ke instansi resmi yang disarankan.",
  },
  {
    id: "FAQ3",
    question: "CegahScam bisa digunakan untuk kasus apa saja?",
    answer:
      "Penipuan jual beli online, investasi bodong, pinjaman ilegal, pembocoran data pribadi, pembajakan akun, sampai penipuan lewat telepon dan chat.",
  },
  {
    id: "FAQ4",
    question: "Apa saja yang bisa dianalisis?",
    answer:
      "Nomor telepon, pesan chat, tautan mencurigakan, serta tangkapan layar percakapan atau bukti transfer.",
  },
  {
    id: "FAQ5",
    question: "Kapan saya harus menggunakan Darurat?",
    answer:
      "Gunakan menu Darurat jika kamu sudah mengalami kerugian atau data pribadimu bocor, supaya langkah penanganan bisa segera dilakukan.",
  },
];

const primaryCta =
  "flex min-h-11 items-center justify-center rounded-2xl bg-[#47a8e4] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[#3B93CC] hover:shadow-xl sm:text-base";
const secondaryCta =
  "flex min-h-11 items-center justify-center rounded-2xl bg-[#47a8e4] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[#3B93CC] hover:shadow-xl sm:text-base";

function FaqItem({
  id,
  question,
  answer,
  open,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="flex min-h-11 w-full items-start gap-3 rounded-2xl px-5 py-3 text-left"
      >
        <span
          aria-hidden="true"
          className="text-lg font-bold leading-snug text-[#1A56DB]"
        >
          {open ? "−" : "+"}
        </span>
        <span className="text-sm font-bold leading-snug text-[#1A56DB] sm:text-base">
          {question}
        </span>
      </button>

      {open && (
        <div
          id={`${id}-panel`}
          role="region"
          aria-label={question}
          className="animate-fade-in px-5 pb-4 pl-11 text-sm leading-relaxed text-[#3F4E5E]"
        >
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<string | null>("FAQ1");

  return (
    <PageShell>
      <div className="flex w-full flex-col gap-16 lg:gap-24">
        <section
          id="Hero-section"
          className="reveal relative flex w-full items-center justify-center"
        >
          <div className="grid w-full gap-6 rounded-[32px] bg-white/50 px-5 py-8 shadow-md sm:gap-8 sm:rounded-[44px] sm:px-8 lg:grid-cols-[1fr_auto] lg:content-center lg:items-center lg:gap-x-0 lg:gap-y-14 lg:px-5 lg:py-12 lg:ps-16 lg:pr-10 xl:ps-28">
            <div className="order-1 text-center lg:col-start-1 lg:row-start-1 lg:text-left">
              <h1 className="text-[26px] font-bold leading-tight text-[#446685] sm:text-[32px] lg:text-[40px]">
                <span className="block">Mau Mencegah?</span>
                <span className="block">Lagi Curiga?</span>
                <span className="block">Atau Sudah Kena?</span>
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-[#3F4E5E] sm:text-sm lg:text-[15px]">
                Dari rasa ragu sampai tahu harus berbuat apa
              </p>
            </div>

            <Robot
              src={heroIcon}
              alt="Ilustrasi CegahScam"
              motion="float"
              interactive
              className="order-2 mx-auto w-45 object-contain sm:w-52 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[clamp(300px,55vh,500px)] lg:w-auto lg:justify-self-end"
            />

            <div className="order-3 grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-row sm:justify-center lg:col-start-1 lg:row-start-2 lg:justify-start">
              <Link to="/analysis" className={primaryCta}>
                Analisis
              </Link>
              <Link to="/education" className={secondaryCta}>
                Edukasi
              </Link>
              <Link to="/emergency" className={`${secondaryCta} col-span-2 sm:col-span-1`}>
                Darurat
              </Link>
            </div>
          </div>
        </section>

        <section id="body1-section" className="reveal w-full">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-16">
            <div className="contents lg:flex lg:flex-col lg:items-start lg:gap-10">
              <div className="order-1 text-center lg:order-none lg:text-left">
                <h2 className="text-[24px] font-bold leading-tight text-[#446685] sm:text-[32px] lg:text-[40px]">
                  <span className="block">Apakah kamu</span>
                  <span className="block">terkena penipuan?</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#3F4E5E] sm:text-[15px]">
                  <span className="block">Kamu bisa langsung laporkan</span>
                  <span className="block">ke pihak berwajib</span>
                </p>
              </div>
              <Link
                to="/emergency"
                className={`${primaryCta} order-3 w-45 lg:order-none lg:w-auto`}
              >
                Laporkan
              </Link>
            </div>
            <Robot
              src={body1}
              alt="Ilustrasi penipuan"
              motion="sway"
              interactive
              className="order-2 w-45 object-contain sm:w-[340px] lg:order-first"
            />
          </div>
        </section>

        <section id="body2-section" className="reveal w-full">
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12">
            <h2 className="text-center text-[24px] font-bold text-[#446685] sm:text-[32px] lg:text-[40px]">
              Langkah Pelaporan
            </h2>
            <div className="grid w-full gap-4 sm:grid-cols-3 lg:gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex h-full w-full flex-col items-center gap-3 rounded-[25px] bg-[#446685] px-4 py-5 shadow-sm"
                >
                  <p className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#446685]">
                    {index + 1}
                  </p>
                  <img src={step.icon} alt="" className="h-10 w-10" />
                  <p className="text-center font-bold text-white">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="body3-section" className="reveal w-full">
          <div className="flex flex-col gap-12 lg:gap-16">
            <h2 className="text-center text-[24px] font-bold text-[#446685] sm:text-[32px] lg:text-[40px]">
              Ingin periksa atau Belajar dulu?
            </h2>

            <div className="relative mx-auto w-full max-w-[900px]">
              <svg
                aria-hidden="true"
                viewBox="0 0 430 430"
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 block w-full max-w-[430px] -translate-x-1/2 -translate-y-1/2 md:w-[430px]"
              >
                <circle
                  cx="215"
                  cy="215"
                  r="214"
                  fill="#ADCEFF"
                  fillOpacity="0.1"
                  stroke="#ADCEFF"
                  strokeOpacity="0.6"
                />
                <circle
                  cx="215"
                  cy="215"
                  r="189"
                  fill="#ADCEFF"
                  fillOpacity="0.1"
                  stroke="#ADCEFF"
                  strokeOpacity="0.5"
                />
                <circle
                  cx="215"
                  cy="215"
                  r="149"
                  fill="#ADCEFF"
                  fillOpacity="0.1"
                  stroke="#ADCEFF"
                  strokeOpacity="0.4"
                />
              </svg>

              <div className="relative z-10 grid gap-8 md:grid-cols-[240px_minmax(0,1fr)_240px] md:items-center md:gap-6">
                <div className="mx-auto flex w-full max-w-[280px] flex-col gap-3">
                  <p className="flex h-16 items-center justify-center rounded-[25px] bg-white text-[22px] font-bold text-[#5E83A5] shadow-sm sm:h-20 sm:text-[25px]">
                    PERIKSA
                  </p>

                  <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-[25px] bg-white px-6 py-5 shadow-sm">
                    <p className="text-center text-sm font-bold leading-relaxed">
                      Cek pesan, link, nomor, atau gambar untuk mengetahui apakah
                      terlihat mencurigakan.
                    </p>

                    <Link
                      to="/analysis"
                      className="w-35 rounded-[40px] bg-[#47a8e4] py-2 text-center font-bold text-white transition duration-200 hover:bg-[#3B93CC]"
                    >
                      Analisis
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Robot
                    src={body2}
                    alt="Maskot CegahScam"
                    motion="bob"
                    interactive
                    className="h-45 w-45 object-contain sm:h-72 sm:w-72 md:h-[220px] md:w-[220px] lg:h-[300px] lg:w-[300px]"
                  />
                </div>

                <div className="mx-auto flex w-full max-w-[280px] flex-col gap-3">
                  <p className="flex h-16 items-center justify-center rounded-[25px] bg-white text-[22px] font-bold text-[#5E83A5] shadow-sm sm:h-20 sm:text-[25px]">
                    BELAJAR
                  </p>

                  <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-[25px] bg-white px-6 py-5 shadow-sm">
                    <p className="text-center text-sm font-bold leading-relaxed">
                      Pelajari berbagai modus penipuan yang sering terjadi dan
                      tips untuk melindungi diri.
                    </p>

                    <Link
                      to="/education"
                      className="w-35 rounded-[40px] bg-[#47a8e4] py-2 text-center font-bold text-white transition duration-200 hover:bg-[#3B93CC]"
                    >
                      Edukasi
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="why-section"
          className="reveal w-full overflow-hidden rounded-[32px] bg-white/50 px-5 py-10 shadow-md sm:rounded-[44px] sm:px-8 sm:py-12 lg:px-12"
        >
          <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-center lg:gap-12 lg:text-left">
            <div className="relative flex shrink-0 flex-col items-center">
              <Robot
                src={whyRobot}
                alt="Maskot CegahScam mendampingi pengguna"
                motion="bob"
                interactive
                className="h-36 w-auto object-contain drop-shadow-[0_16px_24px_rgba(82,120,154,0.22)] sm:h-44 lg:h-48"
              />
              <div className="relative -mt-2 rounded-2xl bg-white px-3 py-1.5 text-center text-[11px] font-semibold text-[#52789A] shadow-md shadow-[#8FA9C4]/30 sm:text-xs">
                Aku temani sampai lapor!
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 lg:items-start">
              <h2 className="text-[24px] font-bold text-[#446685] sm:text-[32px] lg:text-[40px]">
                Kenapa CegahScam?
              </h2>
              <p className="mx-auto max-w-xl text-[13px] leading-relaxed text-[#3F4E5E] sm:text-base lg:mx-0">
                Kami tidak berhenti di peringatan. Kami bantu sampai laporanmu
                siap dikirim.
              </p>
            </div>
          </div>

          <div className="relative mt-8 grid w-full gap-4 sm:grid-cols-2 sm:gap-5">
            <article className="flex flex-col gap-3 rounded-[25px] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <WhyIcon kind="shield" />
              <h3 className="text-[15px] font-bold text-[#26384A] sm:text-base">
                Satu alur, dari curiga sampai lapor
              </h3>
              <p className="text-[13px] leading-relaxed text-[#3F4E5E] sm:text-sm">
                Periksa bukti, pahami risikonya, lalu ikuti langkah penanganan
                yang sudah disusun sesuai kasusmu.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-[25px] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <WhyIcon kind="report" />
              <h3 className="text-[15px] font-bold text-[#26384A] sm:text-base">
                Laporan siap, tinggal salin
              </h3>
              <p className="text-[13px] leading-relaxed text-[#3F4E5E] sm:text-sm">
                Kronologi dan draf laporan tersusun rapi. Salin, unduh PDF,
                atau teruskan langsung ke pihak berwenang.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-[25px] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <WhyIcon kind="steps" />
              <h3 className="text-[15px] font-bold text-[#26384A] sm:text-base">
                Bukan sekadar peringatan
              </h3>
              <p className="text-[13px] leading-relaxed text-[#3F4E5E] sm:text-sm">
                Hasil analisis dilengkapi langkah penanganan dan kontak resmi,
                bukan cuma label bahaya.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-[25px] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
              <WhyIcon kind="privacy" />
              <h3 className="text-[15px] font-bold text-[#26384A] sm:text-base">
                Privasi jadi prioritas
              </h3>
              <p className="text-[13px] leading-relaxed text-[#3F4E5E] sm:text-sm">
                Konten analisis tidak disimpan permanen. Draf formulir hanya
                tersimpan sementara di sesi tab browser.
              </p>
            </article>
          </div>

          <p className="relative mt-6 rounded-2xl bg-[#446685] px-5 py-4 text-center text-[13px] font-semibold leading-relaxed text-white sm:text-sm">
            Ujungnya bukan sekadar skor risiko, tapi draf laporan yang siap
            disalin dan diteruskan ke bank, kepolisian, atau kanal resmi.
          </p>
        </section>

        <section id="body4-section" className="reveal w-full">
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-10">
            <h2 className="text-center text-[24px] font-bold text-[#446685] sm:text-[32px] lg:text-[40px]">
              Pertanyaan yang sering diajukan
            </h2>

            <div className="grid w-full max-w-[760px] gap-4 lg:grid-cols-2 lg:items-start lg:gap-5">
              {[faqs.slice(0, 2), faqs.slice(2)].map((column, index) => (
                <div key={index} className="flex flex-col gap-4">
                  {column.map((faq) => (
                    <FaqItem
                      key={faq.id}
                      id={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      open={openFAQ === faq.id}
                      onToggle={() =>
                        setOpenFAQ((current) =>
                          current === faq.id ? null : faq.id,
                        )
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function WhyIcon({ kind }: { kind: "shield" | "report" | "steps" | "privacy" }) {
  const paths = {
    shield: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    report: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </>
    ),
    steps: (
      <>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17" />
      </>
    ),
    privacy: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
      </>
    ),
  }[kind];

  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2FA] text-[#1A56DB]">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths}
      </svg>
    </span>
  );
}
