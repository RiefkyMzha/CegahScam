import { Link } from "react-router-dom";

import AnalysisHook from "../components/AnalysisHook";
import PageShell from "../components/ui/PageShell";
import Stepper from "../components/ui/Stepper";
import Phone from "../assets/Analysis/phone.png";
import Chat from "../assets/Analysis/chat.png";
import Screenshot from "../assets/Analysis/screenshot.png";

const STEPS = [
  { label: "Pilih Kasus", state: "active" as const },
  { label: "Isi Data", state: "todo" as const },
  { label: "Hasil Analisis", state: "todo" as const },
];

const cases = [
  {
    to: "/analysis/phone",
    image: Phone,
    alt: "Ikon telepon",
    text: "Periksa riwayat dan indikasi penipuan dari nomor telepon tidak dikenal",
  },
  {
    to: "/analysis/chat",
    image: Chat,
    alt: "Ikon chat",
    text: "Periksa riwayat dan indikasi penipuan dari pesan chat yang mencurigakan",
  },
  {
    to: "/analysis/screenshot",
    image: Screenshot,
    alt: "Ikon tangkapan layar",
    text: "Periksa riwayat dan indikasi penipuan dari tangkapan layar yang kamu kirim",
  },
];

export default function Analysis() {
  return (
    <PageShell>
      <AnalysisHook />
      <Stepper steps={STEPS} />

      <section
        id="body-section"
        className="reveal mt-2 flex w-full flex-col items-center rounded-[28px] bg-white/50 px-4 py-8 shadow-xl sm:mt-4 sm:rounded-[40px] sm:px-6 sm:py-10 lg:rounded-[50px] lg:px-10"
      >
        <div id="title" className="mb-6 mt-2 text-center sm:mb-8 sm:mt-4">
          <h2 className="text-xl font-bold text-black sm:text-2xl">
            Apa yang sedang kamu alami?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-400 sm:text-base">
            Pilih kondisi yang ingin kamu analisis sesuai dengan apa yang kamu
            alami.
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cases.map((item) => (
            <article
              key={item.to}
              className="relative flex h-full w-full flex-col items-center transition duration-300 hover:-translate-y-1"
            >
              <div className="relative z-10 -mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#a6d7f5] shadow-lg lg:-mb-10 lg:h-20 lg:w-20">
                <img
                  src={item.image}
                  alt={item.alt}
                  width={40}
                  height={40}
                  className="h-8 w-8 object-contain brightness-0 invert lg:h-10 lg:w-10"
                />
              </div>

              <div className="relative flex w-full flex-1 flex-col items-center justify-between gap-6 rounded-[24px] bg-[#47a8e4] px-6 pb-6 pt-16 sm:px-8 lg:gap-8 lg:px-8 lg:pt-20">
                <p className="text-center text-sm font-bold text-white sm:text-base">
                  {item.text}
                </p>
                <Link
                  to={item.to}
                  className="inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full bg-[#eff5fa] px-5 py-3 text-sm text-[#2e4a5c] transition hover:bg-[#5E83A5] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:w-auto sm:text-base"
                >
                  Selanjutnya
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
