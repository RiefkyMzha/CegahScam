import PageShell from "../components/ui/PageShell";

const SECTIONS = [
  {
    title: "Data yang diproses",
    body: "CegahScam hanya memproses informasi yang kamu masukkan sendiri, seperti nomor telepon, pesan, tangkapan layar, atau detail laporan darurat. Data tersebut dipakai untuk menyusun hasil analisis dan laporan.",
  },
  {
    title: "Penyimpanan data",
    body: "Isian teks formulir yang belum dikirim disimpan sementara di penyimpanan sesi browser pada tab ini agar bisa dipulihkan setelah halaman dimuat ulang. Draf dihapus setelah pengiriman berhasil atau saat sesi tab berakhir; file bukti tidak disimpan dan harus dipilih ulang. Konten analisis tidak disimpan di database atau Redis.",
  },
  {
    title: "Berbagi data",
    body: "CegahScam tidak menjual data pengguna. Laporan yang kamu unduh atau salin adalah dokumen milikmu, dan kamu sendiri yang memutuskan ke mana dokumen itu dikirim.",
  },
  {
    title: "Keamanan",
    body: "Jangan pernah mengirim kode OTP, PIN, atau kata sandi kepada siapa pun, termasuk pihak yang mengaku dari CegahScam. Jika kamu merasa data sudah bocor, segera gunakan menu Darurat untuk mendapatkan langkah penanganan.",
  },
];

export default function Privacy() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-3xl">
        <header className="reveal text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#52789A]">
            Kebijakan Privasi
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-4xl">
            Bagaimana CegahScam menjaga datamu
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
            Ringkasan sederhana tentang data yang diproses saat kamu memakai
            layanan CegahScam.
          </p>
        </header>

        <div className="reveal mt-8 flex flex-col gap-4">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl bg-white p-5 shadow-card sm:p-7"
            >
              <h2 className="text-lg font-bold text-ink-700">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
          Terakhir diperbarui: November 2026
        </p>
      </div>
    </PageShell>
  );
}
