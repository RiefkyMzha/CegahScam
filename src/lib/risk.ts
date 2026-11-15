export type RiskLevel = "low" | "medium" | "high";

export type RiskInfo = {
  label: string;
  summary: string;
  reasons: string[];
  gaugeColors: [string, string];
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
};

export type AnalysisResult = {
  risk_score?: number;
  risk_category?: string;
  summary?: string;
  scam_type?: string | null;
  reasons?: string[];
  recommendations?: string[];
  official_contact?: OfficialContact | null;
  official_contacts?: OfficialContact[];
  bank?: string | null;
  bank_name?: string | null;
};

export type OfficialContact = {
  name: string;
  phone?: string;
  whatsapp?: string | null;
  email?: string | null;
  instagram?: string | null;
  twitter?: string | null;
};

export const RISK_LEVELS: Record<RiskLevel, RiskInfo> = {
  low: {
    label: "Risiko Rendah",
    summary:
      "Informasi yang kamu masukkan memiliki sedikit indikasi mencurigakan, tetapi belum menunjukkan tanda-tanda yang kuat.",
    reasons: [
      "Tidak ditemukan pola kata seperti “menang undian”, “OTP”, atau permintaan data pribadi.",
      "Nomor bukan merupakan kontak kantor resmi yang sering dipakai penipu.",
      "Tidak terdapat indikasi link aneh, atau nomor yang mengarah ke situs mencurigakan atau modus penipuan.",
    ],
    gaugeColors: ["#A5C6FF", "#3385FF"],
    iconBg: "bg-[#FFF7E8]",
    iconColor: "text-[#F0A63A]",
    badgeBg: "bg-[#FFF7E8]",
    badgeText: "text-[#F0A63A]",
  },
  medium: {
    label: "Risiko Sedang",
    summary:
      "Informasi yang kamu masukkan menunjukkan beberapa ciri khas penipuan. Verifikasi dulu ke pihak resmi sebelum membalas atau mengklik apa pun.",
    reasons: [
      "Ada permintaan data pribadi, kode OTP, atau informasi rekening.",
      "Pesan terasa mendesak dan meminta kamu segera bertindak.",
      "Terdapat tautan yang perlu diperiksa keasliannya sebelum dibuka.",
    ],
    gaugeColors: ["#FBD38D", "#F59E0B"],
    iconBg: "bg-[#FFF3E0]",
    iconColor: "text-[#F08C00]",
    badgeBg: "bg-[#FFF7E8]",
    badgeText: "text-[#F0A63A]",
  },
  high: {
    label: "Risiko Tinggi",
    summary:
      "Informasi ini sangat mirip dengan modus penipuan. Jangan membalas, jangan klik tautan, dan jangan kirim data atau uang.",
    reasons: [
      "Terdapat permintaan OTP, PIN, password, atau data pribadi yang sensitif.",
      "Pelaku memakai tautan atau nomor tidak resmi untuk mengambil data kamu.",
      "Pesan menggunakan tekanan, ancaman, atau iming-iming hadiah.",
    ],
    gaugeColors: ["#FCA5A5", "#EF4444"],
    iconBg: "bg-[#FEF2F2]",
    iconColor: "text-[#EF4444]",
    badgeBg: "bg-[#FFF7E8]",
    badgeText: "text-[#F0A63A]",
  },
};

const LEVEL_BY_CATEGORY: Record<string, RiskLevel> = {
  "Tidak Ada Indikasi": "low",
  Rendah: "low",
  Sedang: "medium",
  Tinggi: "high",
  "Sangat Tinggi": "high",
};

/** Kategori tidak dikenal sengaja jatuh ke "medium" agar tidak pernah menampilkan "aman" palsu. */
export function getRisk(category?: string | null): RiskInfo {
  const level = LEVEL_BY_CATEGORY[category ?? ""] ?? "medium";
  return RISK_LEVELS[level];
}

const SCORE_BY_LEVEL: Record<RiskLevel, number> = {
  low: 20,
  medium: 55,
  high: 85,
};

/** Skor dari API dipakai apa adanya; kalau tidak ada, pakai skor wakil level risiko. */
export function getRiskScore(
  category?: string | null,
  score?: number | null,
): number {
  if (typeof score === "number" && Number.isFinite(score)) {
    return Math.min(100, Math.max(0, score));
  }

  const level = LEVEL_BY_CATEGORY[category ?? ""] ?? "medium";
  return SCORE_BY_LEVEL[level];
}
