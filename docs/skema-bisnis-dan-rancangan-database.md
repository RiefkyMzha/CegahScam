# Skema Bisnis dan Rancangan Database CegahScam

Dokumen ini adalah rancangan awal model bisnis dan penyimpanan data CegahScam. Harga, kredit, masa berlaku kuota anonim, dan masa retensi operasional perlu diuji serta ditetapkan sebelum rilis. Prinsip utamanya: **konten laporan pengguna tidak disimpan; data akun dan transaksi minimum disimpan untuk menjalankan layanan berbayar.**

## 1. Tujuan model bisnis

1. Menjaga edukasi dan bantuan dasar tetap mudah diakses masyarakat.
2. Menutup biaya variabel AI Service, LLM, dan GetContact melalui kredit prabayar.
3. Memberi penggunaan awal gratis tanpa mewajibkan pengguna membuat akun.
4. Mencegah penyalahgunaan dan lonjakan biaya tanpa menjadikan alamat IP sebagai identitas pengguna.
5. Tidak menyimpan isi chat, gambar, nomor telepon yang diperiksa, kronologi, prompt, atau respons AI.

## 2. Produk dan tarif yang direncanakan

### Akses gratis

- Halaman edukasi dan panduan tindakan darurat dasar selalu gratis.
- Pengguna anonim memperoleh **5 kredit awal per browser** untuk layanan AI.
- Kredit gratis anonim digunakan untuk analisis chat, foto/screenshot, dan nomor telepon. Laporan darurat berbantuan AI gratis dan tidak memakai kredit, termasuk untuk pengguna anonim.
- Kuota anonim bukan identitas per orang. Pengguna yang menghapus cookie atau memakai browser lain mungkin mendapat kuota baru; pencegahan sempurna memerlukan login atau pengumpulan identitas tambahan.
- Rekomendasi operasional awal: cookie/entitlement anonim kedaluwarsa setelah 90 hari tidak aktif. Setelah kedaluwarsa, pengguna dapat menerima entitlement baru. Jelaskan kebijakan ini kepada pengguna dan sesuaikan masa berlakunya dengan anggaran.

### Top-up

Usulan paket bertingkat: semakin besar paket, semakin rendah harga rata-rata per kredit.

| Paket | Kredit | Harga paket | Harga per kredit | Diskon efektif |
|---|---:|---:|---:|---:|
| Mini | 5 | Rp12.000 | Rp2.400 | — |
| Hemat | 12 | Rp25.000 | ±Rp2.083 | ±13% |
| Plus | 30 | Rp55.000 | ±Rp1.833 | ±24% |
| Maksimal | 60 | Rp100.000 | ±Rp1.667 | ±31% |

Harga dan diskon di atas adalah **hipotesis untuk pilot**, bukan harga final atau jaminan margin. Diskon dihitung dibanding harga dasar Rp2.400/kredit pada paket Mini, sebelum biaya payment gateway, pajak, refund, dan biaya operasional. Sebelum paket besar dijual, pastikan pendapatan bersihnya tetap menutup biaya pada kombinasi penggunaan termahal yang diizinkan. Paket dengan kredit lebih banyak juga menambah kewajiban saldo yang belum digunakan.

Mulai dengan satu atau dua tingkat paket pada pilot jika biaya riil belum diketahui. Tambahkan paket lebih besar setelah pengukuran biaya menunjukkan harganya layak. Harga/kredit yang dibeli harus disimpan sebagai snapshot pada order supaya perubahan katalog tidak mengubah pembelian lama.

### Biaya kredit per fitur

| Fitur | Kredit per permintaan berhasil |
|---|---:|
| Analisis chat | 2 |
| Analisis foto/screenshot | 2 |
| Analisis nomor telepon | 3 |
| Laporan darurat berbantuan AI | 0 |
| Panduan tindakan darurat dasar | 0 |

Laporan darurat berbantuan AI gratis dan tidak memotong kredit; biaya operasionalnya ditutup dari pendapatan analisis, sponsor/kemitraan, atau anggaran layanan. Catat biaya dan volume laporan darurat secara agregat untuk memantau keberlanjutan layanan.

Untuk fitur berbayar, kredit ditagihkan hanya jika hasil berhasil diberikan. Request gagal, timeout, atau respons AI yang tidak dapat digunakan tidak mengurangi saldo. Jika biaya nyata per endpoint berubah, tarif kredit dapat ditinjau ulang; perubahan harga paket hanya berlaku untuk pembelian baru.

Kredit top-up disarankan tidak kedaluwarsa pada MVP. Konsekuensinya, saldo kredit yang belum digunakan menjadi kewajiban layanan. Pastikan perlakuan saldo dan pengembalian dana ditinjau oleh pihak keuangan/legal sebelum peluncuran.

Contoh penggunaan paket 5 kredit: satu analisis nomor telepon ditambah satu analisis chat/foto (3 + 2 kredit), atau dua analisis chat/foto (2 + 2 kredit, dengan 1 kredit tersisa). Laporan darurat berbantuan AI tidak mengurangi saldo.

### Perlindungan pengguna dalam keadaan darurat

Penyusunan laporan darurat berbantuan AI gratis untuk semua pengguna dan tidak memerlukan login atau kredit.

## 3. Alur pengguna dan transaksi

### Pengguna anonim

1. Browser pertama kali meminta layanan AI; backend membuat ID acak berentropi tinggi.
2. ID dikirim melalui cookie first-party `HttpOnly`, `SameSite=Lax`, dan `Secure` di production.
3. Backend menghitung HMAC ID tersebut dan menyimpan hanya saldo/masa berlaku di Redis.
4. Untuk request analisis berbayar, backend mencadangkan kredit secara atomik; laporan darurat AI gratis tidak memakai saldo.
5. Setelah hasil berhasil, kredit dicatat sebagai terpakai; jika gagal, saldo dikembalikan.
6. Setelah kredit analisis anonim habis, pengguna dapat login untuk top-up. Saldo anonim tidak digabung ke saldo akun pada rancangan MVP; pengguna dapat memakai sisa kredit anonim di browser yang sama.

Redis menyimpan pengenal pseudonim sementara, bukan payload. Cookie dapat dihapus pengguna, sehingga kuota harus disebut berlaku **per browser**, bukan per orang. IP hanya dipakai untuk rate limit burst/anti-bot dengan masa simpan singkat, bukan sebagai batas harian keras.

### Pengguna terdaftar

1. Pengguna mendaftar dengan email terverifikasi atau penyedia autentikasi.
2. Backend membuat wallet berisi 0 kredit.
3. Pengguna memilih paket dan backend membuat pesanan dengan snapshot harga serta jumlah kredit.
4. Payment gateway memproses transaksi.
5. Backend memverifikasi webhook gateway. Proses pembayaran, penambahan saldo, dan penulisan ledger dilakukan dalam satu transaksi database.
6. ID webhook dan idempotency key mencegah event yang dikirim ulang menggandakan kredit.
7. Kredit hanya dicadangkan untuk analisis berbayar; kredit ditetapkan setelah sukses atau dikembalikan jika gagal. Laporan darurat berbantuan AI gratis tidak membuat reservasi kredit.

## 4. Pengendalian biaya dan penetapan harga

Sebelum menetapkan harga final, ukur biaya rata-rata dan variasi biaya untuk setiap jenis layanan:

- biaya input/output LLM menurut model dan panjang request;
- biaya atau kuota GetContact;
- biaya request gagal dan retry;
- biaya payment gateway, pajak, refund, dan dukungan operasional.

Uji paket terhadap beberapa pola pemakaian, bukan hanya pemakaian rata-rata. Untuk paket 5 kredit, pola yang mungkin antara lain satu analisis nomor (3 kredit) ditambah satu analisis chat/foto (2 kredit), atau dua analisis chat/foto (4 kredit). Pada paket 12/30/60, pengguna dapat menggunakan seluruh kredit untuk masing-masing 4/10/20 analisis nomor. Pastikan pendapatan bersih paket cukup untuk pola termahal yang masih diizinkan, atau tetapkan subsidi pemasaran dan batas anggarannya dengan sadar. Laporan darurat AI gratis harus dihitung sebagai biaya layanan yang disubsidi, bukan sebagai konsumsi kredit.

Rumus dasar:

`margin kontribusi = (pendapatan bersih - biaya variabel layanan) / pendapatan bersih`

Terapkan juga batas biaya AI harian/bulanan di sisi backend. Saat batas tercapai, antrekan atau nonaktifkan sementara layanan AI berbiaya.

## 5. Rancangan arsitektur penyimpanan

- **PostgreSQL:** akun, paket, pesanan, saldo, ledger kredit, dan metadata penggunaan minimum.
- **Redis:** entitlement kredit anonim, reservasi anonim, serta rate limit sementara. Aktifkan TTL dan jangan simpan payload analisis. Pastikan konfigurasi persistence/backup Redis sesuai masa retensi yang diumumkan.
- **AI Service:** tetap menangani cache nomor maksimal 100 entri/24 jam sesuai kebijakan AI Service. Cache tersebut terpisah dari wallet website dan harus diperlakukan sebagai data pseudonim/terbatas, bukan anonim mutlak.
- **Payment gateway:** menangani detail instrumen pembayaran; website hanya menyimpan ID referensi transaksi dan status, bukan nomor kartu/CVV.
- Laporan darurat berbantuan AI tidak menggunakan wallet; metadata biaya/volume dapat dicatat secara agregat untuk anggaran tanpa mengaitkan konten laporan ke pengguna.

## 6. Skema tabel PostgreSQL

Contoh DDL inti berikut menggunakan UUID yang dapat dibuat aplikasi. Enum sengaja berupa `CHECK` agar perubahan status tidak memerlukan migrasi tipe enum khusus.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email_normalized TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  auth_provider TEXT,
  auth_provider_subject TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'deletion_pending', 'deleted')),
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CHECK (
    (auth_provider IS NULL AND auth_provider_subject IS NULL)
    OR (auth_provider IS NOT NULL AND auth_provider_subject IS NOT NULL)
  )
);

CREATE UNIQUE INDEX users_provider_subject_unique
  ON users (auth_provider, auth_provider_subject)
  WHERE auth_provider IS NOT NULL;

CREATE TABLE credit_packages (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price_idr BIGINT NOT NULL CHECK (price_idr > 0),
  credits INTEGER NOT NULL CHECK (credits > 0),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO credit_packages (id, code, name, price_idr, credits)
VALUES
  ('00000000-0000-4000-8000-000000000005', 'mini-5', 'Mini', 12000, 5),
  ('00000000-0000-4000-8000-000000000012', 'hemat-12', 'Hemat', 25000, 12),
  ('00000000-0000-4000-8000-000000000030', 'plus-30', 'Plus', 55000, 30),
  ('00000000-0000-4000-8000-000000000060', 'maksimal-60', 'Maksimal', 100000, 60);

CREATE TABLE wallets (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  available_credits INTEGER NOT NULL DEFAULT 0
    CHECK (available_credits >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  package_id UUID REFERENCES credit_packages(id),
  provider TEXT NOT NULL,
  provider_reference TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  amount_idr BIGINT NOT NULL CHECK (amount_idr > 0),
  credits_snapshot INTEGER NOT NULL CHECK (credits_snapshot > 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  UNIQUE (provider, provider_reference)
);

CREATE TABLE analysis_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  request_id TEXT NOT NULL UNIQUE,
  feature TEXT NOT NULL
    CHECK (feature IN ('chat', 'image', 'phone', 'emergency_report')),
  status TEXT NOT NULL
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  credits_charged INTEGER NOT NULL DEFAULT 0 CHECK (credits_charged >= 0),
  provider TEXT NOT NULL DEFAULT 'unknown',
  model TEXT NOT NULL DEFAULT 'unknown',
  input_tokens INTEGER CHECK (input_tokens IS NULL OR input_tokens >= 0),
  output_tokens INTEGER CHECK (output_tokens IS NULL OR output_tokens >= 0),
  estimated_cost_idr BIGINT
    CHECK (estimated_cost_idr IS NULL OR estimated_cost_idr >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX analysis_usage_created_at_idx ON analysis_usage (created_at);
CREATE INDEX analysis_usage_user_created_idx
  ON analysis_usage (user_id, created_at);

CREATE TABLE credit_reservations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  usage_id UUID NOT NULL UNIQUE REFERENCES analysis_usage(id),
  credits INTEGER NOT NULL CHECK (credits > 0),
  status TEXT NOT NULL DEFAULT 'reserved'
    CHECK (status IN ('reserved', 'captured', 'released')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE credit_ledger (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  amount_delta INTEGER NOT NULL CHECK (amount_delta <> 0),
  entry_type TEXT NOT NULL
    CHECK (entry_type IN (
      'purchase', 'reserve', 'release', 'signup_grant', 'refund', 'adjustment'
    )),
  reference_type TEXT NOT NULL,
  reference_id UUID NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX credit_ledger_user_created_idx
  ON credit_ledger (user_id, created_at);

CREATE TABLE payment_webhook_events (
  id UUID PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  payment_order_id UUID REFERENCES payment_orders(id),
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

CREATE TABLE usage_daily_aggregates (
  usage_date DATE NOT NULL,
  feature TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'unknown',
  model TEXT NOT NULL DEFAULT 'unknown',
  request_count BIGINT NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  success_count BIGINT NOT NULL DEFAULT 0 CHECK (success_count >= 0),
  failure_count BIGINT NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
  credits_charged BIGINT NOT NULL DEFAULT 0 CHECK (credits_charged >= 0),
  input_tokens BIGINT NOT NULL DEFAULT 0 CHECK (input_tokens >= 0),
  output_tokens BIGINT NOT NULL DEFAULT 0 CHECK (output_tokens >= 0),
  estimated_cost_idr BIGINT NOT NULL DEFAULT 0
    CHECK (estimated_cost_idr >= 0),
  PRIMARY KEY (usage_date, feature, provider, model)
);
```

### Peran dan aturan tabel

- `users`: informasi akun minimum. Jika memakai penyedia autentikasi, website tidak perlu menyimpan password.
- `credit_packages`: katalog paket. Harga/jumlah kredit pada order tetap disimpan sebagai snapshot agar perubahan katalog tidak mengubah transaksi lama.
- `wallets`: saldo terkini untuk pemeriksaan cepat; setiap perubahan harus memiliki catatan di ledger.
- `payment_orders` dan `payment_webhook_events`: rekonsiliasi pembayaran tanpa menyimpan payload pembayaran lengkap.
- `analysis_usage`: metadata untuk operasional dan estimasi biaya. Laporan darurat gratis boleh dicatat dengan `credits_charged = 0`; jangan tambahkan kolom untuk isi pesan, gambar, nomor target, kronologi, prompt, atau respons AI.
- `credit_reservations`: mencegah pemakaian saldo ganda pada request paralel. Reservasi yang kedaluwarsa harus dilepas melalui job terjadwal.
- `credit_ledger`: jejak perubahan saldo yang append-only. Hindari mengubah atau menghapus baris ledger untuk memperbaiki kesalahan; buat entri koreksi.
- `usage_daily_aggregates`: statistik bisnis agregat tanpa identitas pengguna; dapat disimpan lebih lama daripada data request individual.

`payment_orders` dan `credit_ledger` tetap memiliki nilai transaksi dan identitas akun, sehingga bukan data anonim. Beri akses terbatas dan retensi sesuai kewajiban pembayaran/akuntansi yang telah ditinjau.

## 7. Data anonim di Redis

Cookie berisi ID acak; backend menghitung HMAC dengan secret server sebelum membentuk key Redis. Jangan gunakan nomor telepon, email, atau IP sebagai ID kuota anonim.

```text
anon:wallet:<HMAC(cookie_id)> -> balance, created_at, last_seen_at
anon:reservation:<request_id> -> credits, status, expires_at
ratelimit:<HMAC(IP)> -> counter dengan TTL singkat (opsional)
```

Operasi pencadangan/pengembalian kredit anonim harus atomik (misalnya Redis Lua script atau transaksi WATCH/MULTI). Rate limit IP bersifat sementara dan proporsional; jangan menyimpan IP mentah di log aplikasi.

## 8. Retensi dan zero data retention

Zero retention dalam rancangan ini berlaku untuk **konten pengguna yang dikirim untuk dianalisis**, bukan seluruh data sistem:

- Tidak menyimpan body request, file bukti, nomor telepon, kronologi, prompt, atau hasil AI di PostgreSQL, Redis, log, atau error tracker.
- Cache nomor di AI Service maksimal 100 entri/24 jam merupakan retensi sementara tersendiri dan perlu disebutkan secara jelas.
- ID anonim HMAC/Redis memiliki TTL yang diumumkan; data IP rate limit berumur jauh lebih singkat dan tidak dipakai sebagai identitas akun.
- Metadata penggunaan yang terkait akun dipertahankan hanya selama diperlukan untuk dukungan, rekonsiliasi kredit, dan analisis biaya; setelah itu hapus atau agregasikan.
- Data pembayaran/akun mengikuti retensi minimum yang diwajibkan payment gateway dan ketentuan hukum.
- Validasi penghapusan akun harus menghapus/menganonimkan data akun yang boleh dihapus tanpa merusak catatan transaksi yang wajib dipertahankan.

Karena website memiliki akun dan transaksi, hindari klaim “tidak menyimpan data apa pun”. Rumusan yang lebih akurat: **“Konten dan bukti yang dikirim untuk analisis tidak disimpan setelah pemrosesan; data akun dan transaksi minimum disimpan untuk layanan dan pembayaran.”**

## 9. Pengamanan implementasi

- Jangan pernah menaruh API token AI, payment secret, atau HMAC secret di frontend.
- Verifikasi signature webhook payment gateway dan gunakan idempotency key.
- Perubahan wallet, ledger, order, dan reservasi kredit harus transaksional.
- Jangan mencatat request/response body, file, nomor target, atau kronologi pada log.
- Lindungi endpoint login, top-up, dan analisis dengan rate limit bertahap; gunakan challenge saat aktivitas mencurigakan.
- Batasi saldo wallet agar tidak negatif dan cegah pengembalian kredit ganda.
- Tangani timeout AI dengan status yang dapat direkonsiliasi; jangan membebankan kredit sampai hasil berhasil.
- Terapkan batas biaya global dan alert sebelum layanan mencapai kuota/anggaran.

## 10. Tahapan peluncuran

1. **Ukur biaya:** aktifkan pencatatan agregat token/provider dan biaya per fitur tanpa payload.
2. **Pilot gratis:** uji 5 kredit anonim per browser untuk analisis, laporan darurat AI gratis, TTL yang dipilih, serta batas anggaran harian AI.
3. **Implementasikan wallet:** akun, saldo, ledger, reservasi, dan refund internal; uji request paralel dan retry.
4. **Integrasikan pembayaran:** sandbox gateway, verifikasi webhook, idempotensi, refund, dan rekonsiliasi.
5. **Pilot paket Rp12.000/5 kredit:** evaluasi margin untuk pola analisis termahal, biaya laporan darurat gratis, dan konversi top-up.
6. **Tinjau dan sesuaikan:** harga, biaya kredit per fitur, batas global, retensi, dan jalur dukungan darurat.

### Metrik bisnis minimum

- Biaya rata-rata dan biaya persentil tinggi per fitur.
- Tingkat sukses/gagal/timeout dan jumlah kredit yang dikembalikan.
- Jumlah kredit gratis dipakai dan biaya total kuota anonim.
- Rasio pengguna gratis yang membeli top-up.
- Margin kontribusi per paket dan per jenis analisis.
- Jumlah kegagalan dan percobaan ulang laporan darurat AI.

Metrik dilaporkan secara agregat dan tidak memerlukan penyimpanan konten analisis.
