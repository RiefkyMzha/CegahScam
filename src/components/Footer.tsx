import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/analysis", label: "Analisis" },
  { to: "/emergency", label: "Darurat" },
  { to: "/education", label: "Edukasi" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-linear-to-r from-[#E5EAF3] to-[#C8D4E7] text-[#26384A]">
      <div className="bg-[#66738A] px-4 py-2.5 text-center text-xs font-medium leading-relaxed text-white">
        INFORMASI : Data yang anda masukkan akan otomatis terhapus demi keamanan
        privasi bersama
      </div>

      <div className="mx-auto w-full max-w-[1160px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <Link
              to="/"
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            >
              <img
                src="/logo2.png"
                alt="Logo CegahScam"
                className="h-6 w-auto shrink-0 lg:h-8"
              />
              <p className="text-[15px] font-bold lg:text-base">
                Cegah<span className="text-[#1E40AF]">Scam</span>
              </p>
            </Link>

            <p className="text-xs font-semibold italic">
              "Kenali. Pahami. Hadapi."
            </p>
          </div>

          <nav
            aria-label="Navigasi footer"
            className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs font-semibold text-[#3F4652] sm:justify-end sm:text-sm"
          >
            {links.map((link, index) => (
              <span key={link.to} className="flex items-center gap-x-1.5">
                {index > 0 && <span aria-hidden="true">·</span>}
                <Link
                  to={link.to}
                  className="inline-block rounded-sm py-1 transition-colors duration-200 hover:text-[#1E40AF]"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <hr className="my-4 border-[#AAB5C5]" />

        <p className="flex flex-col items-center gap-1 text-center text-xs leading-relaxed text-[#343B48] sm:flex-row sm:justify-between sm:text-left">
          <span>© 2026 CegahScam. Hak cipta dilindungi.</span>
          <Link
            to="/privasi"
            className="inline-block rounded-sm py-1 font-semibold transition-colors hover:text-[#1E40AF]"
          >
            Kebijakan Privasi
          </Link>
        </p>
      </div>
    </footer>
  );
}
