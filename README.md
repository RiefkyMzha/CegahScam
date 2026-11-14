# Menjalankan CegahScam dan AI Service di Lokal

## 1. Prasyarat

- Git
- Node.js `20.19+` atau `22.12+` dan npm
- Python `3.10+`

## 2. Clone kedua repository ke folder terpisah

Jalankan dari folder induk tempat kedua project akan disimpan:

```powershell
git clone https://github.com/RiefkyMzha/CegahScam.git .\CegahScam
git clone https://github.com/RiefkyMzha/ai-service.git .\ai-service
```

Struktur folder:

```text
CegahScamLocal\
├── CegahScam\
└── ai-service\
```

## 3. Install dependency dan siapkan environment

### Website dan backend

```powershell
cd CegahScam
npm install
Copy-Item .env.example .env

cd CegahScam\server
npm install

Copy-Item .env.example .env
```

```powershell
cd CegahScam\server
npm install
Copy-Item .\server\.env.example .\server\.env
```

Biarkan `VITE_API_URL` kosong di `CegahScam/.env`. Atur `CegahScam/server/.env`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
AI_SERVICE_URL=http://127.0.0.1:8000
AI_API_TOKEN=local-dev-token-ganti-ini
```

### AI Service

Buka PowerShell baru dari folder `CegahScamLocal`, lalu jalankan:

```powershell
cd ai-service
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Pilih **satu** mode berikut di `ai-service/.env`. Nilai `CEGAHSCAM_API_TOKEN` harus sama persis dengan `AI_API_TOKEN` di `CegahScam/server/.env`.

#### Mode mock

```env
OPENROUTER_API_KEY=
CEGAHSCAM_API_TOKEN=local-dev-token-ganti-ini
MOCK_MODE=true
```

#### Mode live

```env
OPENROUTER_API_KEY=isi-api-key-openrouter
CEGAHSCAM_API_TOKEN=isi-token-rahasia-yang-sama-dengan-backend
MOCK_MODE=false
```

Analisis nomor telepon pada mode live juga memerlukan kredensial GetContact di `ai-service/app/data/gtc_credentials.json`. File kredensial dan semua file `.env` bersifat rahasia; jangan commit ke Git.

## 4. Jalankan ketiga server

Buka tiga PowerShell dari folder `CegahScamLocal`.

**Terminal 1 — AI Service:**

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

**Terminal 2 — backend web:**

```powershell
\CegahScam\server
npm run dev
```

**Terminal 3 — website:**

```powershell
\CegahScam
npm run dev
```

Buka website di `http://localhost:5173`. AI Service tersedia di `http://127.0.0.1:8000`; status mode dapat diperiksa di `http://127.0.0.1:8000/health`.
