import { Link } from "react-router-dom";

import PageShell from "../components/ui/PageShell";
import Stepper from "../components/ui/Stepper";
import robot1 from "../assets/Emergency/robot1.webp";
import robot2 from "../assets/Emergency/robot2.webp";
import Robot from "../components/Robot";
import EmergencyHook from "../components/EmergencyHook";

const STEPS = [
  { label: "Pilih Kasus", state: "active" as const },
  { label: "Isi Data", state: "todo" as const },
  { label: "Hasil Laporan", state: "todo" as const },
];

const CASES = [
  {
    to: "/emergency/data",
    robot: robot1,
    alt: "Maskot data bocor",
    motion: "float" as const,
    text: "Apakah data pribadi atau akun kamu bocor ke orang lain?",
  },
  {
    to: "/emergency/financial",
    robot: robot2,
    alt: "Maskot kehilangan uang",
    motion: "sway" as const,
    text: "Apakah kamu kehilangan uang karena penipuan?",
  },
];

export default function Emergency() {
  return (
    <PageShell>
      <EmergencyHook />
      <Stepper steps={STEPS} />

      <section
        id="body-section"
        className="reveal mx-auto mt-4 flex w-full flex-col items-center rounded-[30px] bg-white/50 px-4 py-8 shadow-xl sm:mt-6 sm:px-6 lg:rounded-[50px]"
      >
        <div id="title" className="mb-6 mt-2 text-center sm:mb-8 sm:mt-4">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
            Apa yang sedang terjadi?
          </h2>
          <p className="mt-1 text-sm text-[#3F4E5E] sm:text-base">
            Pilih kondisi sesuai yang kamu alami.
          </p>
        </div>

        <div className="grid w-full gap-8 md:grid-cols-2 md:gap-6 lg:gap-10">
          {CASES.map((item) => (
            <div
              key={item.to}
              className="relative mx-auto flex w-full max-w-[320px] flex-col items-center pt-[7.5rem] sm:pt-[8.75rem] md:max-w-none"
            >
              <Robot
                src={item.robot}
                alt={item.alt}
                motion={item.motion}
                interactive
                className="absolute top-0 z-10 h-44 w-44 object-contain sm:h-48 sm:w-48"
              />
              <div className="relative flex h-auto min-h-60 w-full flex-col items-center justify-between gap-5 rounded-[15px] bg-[#47a8e4] px-6 pb-6 pt-20 shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                <p className="text-center text-sm font-bold text-white sm:text-base">
                  {item.text}
                </p>
                <Link
                  to={item.to}
                  className="rounded-full bg-white px-5 py-2 text-[#1A56DB] transition hover:bg-[#5E83A5] hover:text-white"
                >
                  Selanjutnya
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
