# Perbedaan Workspace dengan Repo Tim Web

Acuan pembanding: [`njhbil/CegahScam`](https://github.com/njhbil/CegahScam), branch `main`, diperiksa 13 November 2026. Dokumen ini mencatat apa saja yang dimodifikasi di workspace dan saran untuk dipertimbangkan saat integrasi ke repo tim web.

## Modifikasi yang sudah ada di workspace

### Fondasi UI dan form

- Menambahkan komponen bersama `PageShell`, `Stepper`, `FormSection`, `Field`, `UploadField`, dan `Button` di `src/components/ui/`.
- Menambahkan token tema dan style form di `src/App.css`. Palette dan tema visual asli tetap dipertahankan.
- Menggunakan pola field, validasi inline, ukuran kontrol, dan tombol yang lebih konsisten pada form analisis serta form darurat.
- Mengatur ulang jarak legend–isi form agar judul dan input tidak terlalu rapat.

### Upload file

- `UploadField` kini menampilkan preview, nama dan ukuran file, serta tombol hapus.
- Validasi tipe dan ukuran file tersedia di UI; susunan tombol dan preview dibuat responsif agar tidak keluar dari container pada layar kecil.
- Input file tetap dapat diakses melalui keyboard.

### Form darurat dan validasi kronologi

- `DataBreach.tsx` sekarang mewajibkan detail kronologi, menampilkan error inline untuk nilai kosong/spasi, dan mengarahkan pengguna ke field tersebut.
- Status akses perangkat pada laporan kebocoran data juga wajib dipilih, sesuai kontrak AI Service.
- `emergency.controller.ts` memvalidasi field wajib serta batas panjang payload finansial dan kebocoran data sebelum request ke AI Service. Kronologi kosong/spasi ditolak dengan HTTP 400 dan nilai yang diteruskan sudah di-trim.
- Batas panjang field teks (termasuk kronologi maksimal 10.000 karakter) diterapkan pada form dan backend agar input yang melampaui skema tidak berakhir sebagai HTTP 422 dari AI Service.
- `tujuan_transaksi`, `jenis_data`, dan `tindakan_pelaku` dibatasi maksimal 1.000 karakter pada payload form dan backend, mengikuti batas AI Service.

### Penyelarasan kontrak AI Service

- Validasi nomor telepon di frontend dan backend kini hanya menerima format nomor Indonesia yang diterima AI Service (`08…`, `62…`, atau `+62…`); spasi/tanda pemisah dibersihkan sebelum dikirim.
- Pesan chat dibatasi maksimal 10.000 karakter dan platform screenshot 50 karakter, dengan pemeriksaan backend sebelum meneruskan request.
- Tipe hasil analisis mencakup `official_contacts`. Halaman hasil analisis dan laporan menampilkan kontak jamak bila tersedia, dengan fallback ke `official_contact` untuk respons lama.
- Tautan WhatsApp pada kontak laporan hanya digunakan untuk nomor yang setelah dinormalisasi diawali `62`; nomor lainnya membuka aplikasi telepon.

### Hasil analisis dan kontak

- Menggabungkan tiga tampilan hasil analisis ke `ResultView` dan memusatkan kategori risiko/skor di `src/lib/risk.ts`.
- Hasil yang dibuka tanpa state menampilkan empty state dan tombol untuk mengulang analisis, bukan skor risiko default.
- Kontak bank memakai WhatsApp bila nomor diawali `62`, dan tautan telepon untuk nomor lainnya. Call center CegahScam ditampilkan terpisah.
- Mengatur ulang kolom robot dan bubble “Tetap Waspada, Yo!” agar tidak meluber atau berhimpitan dengan kartu checklist.

### Navbar dan halaman konten

- Menu mobile dapat ditutup dengan Escape atau klik di luar, mengunci scroll saat terbuka, dan tautannya tetap dapat ditekan karena dropdown termasuk dalam area menu.
- Menambahkan halaman privasi dan route `/privasi`.
- Merapikan jarak di Home dan Education; jarak heading ke konten pada section Home ditambah, sedangkan ruang kosong berlebih pada Education dikurangi.
- Menyesuaikan hover kartu dan tombol: tombol utama menggelap, tombol sekunder menggelap dengan teks terang, serta border biru saat hover dihilangkan atau dinetralkan. Warna khusus WhatsApp tetap hijau.
- Merapikan layout laporan darurat dan menggunakan pola layout/stepper yang sama.

## Saran untuk repo tim web

- Integrasikan komponen bersama per area, pertahankan palette asli, lalu uji tampilan di mobile dan desktop.
- Pertahankan validasi field wajib, format nomor, dan batas panjang UI/backend agar tetap selaras dengan schema AI Service saat kontrak berubah.
- Uji upload, state kosong hasil analisis, respons yang berisi satu atau beberapa kontak, tautan kontak, dan semua interaksi menu mobile.
- Pastikan nomor kontak dan isi halaman privasi sesuai layanan yang benar sebelum dirilis.

## File workspace terkait

- UI bersama dan upload: `src/components/ui/`, `src/App.css`
- Form serta validasi payload: `src/pages/EmergencyCase/DataBreach.tsx`, `src/pages/EmergencyCase/Financial.tsx`, `server/src/controllers/emergency.controller.ts`, `server/src/validation.ts`
- Penyelarasan endpoint analisis: `src/pages/Analysis/Phone.tsx`, `src/pages/Analysis/Chat.tsx`, `server/src/controllers/analysis.controller.ts`
- Hasil analisis dan kontak: `src/pages/ResultAnalysis/ResultView.tsx`, `src/pages/Report/EmergencyReportView.tsx`, `src/lib/risk.ts`
- Home dan Education: `src/pages/Home.tsx`, `src/pages/Education.tsx`
- Navbar, privasi, laporan: `src/components/Navbar.tsx`, `src/pages/Privacy.tsx`, `src/pages/Report/EmergencyReportView.tsx`
