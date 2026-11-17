import type { OfficialContact } from "./risk";
import { printDocument } from "./printDocument";

export type AnalysisReportKind = "chat" | "phone" | "screenshot";

export type AnalysisReportInput = {
  kind: AnalysisReportKind;
  label: string;
  score: number;
  levelLabel: string;
  scamType?: string | null;
  summary: string;
  reasons: string[];
  recommendations: string[];
  subject?: string;
  contacts: OfficialContact[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraph(value: string) {
  return `<p>${escapeHtml(value).replace(/\r?\n/g, "<br>")}</p>`;
}

function list(items: string[]) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function contactList(contacts: OfficialContact[]) {
  const rows = contacts.flatMap((contact) =>
    [
      ["Telepon", contact.phone],
      ["WhatsApp", contact.whatsapp],
      ["Email", contact.email],
      ["Instagram", contact.instagram],
      ["X / Twitter", contact.twitter],
    ]
      .filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()))
      .map(
        ([label, value]) =>
          `<li><strong>${escapeHtml(contact.name)} · ${label}:</strong> ${escapeHtml(value)}</li>`,
      ),
  );

  return rows.length
    ? `<section><h2>Kontak rujukan resmi</h2><ul>${rows.join("")}</ul></section>`
    : "";
}

export function downloadAnalysisReport(input: AnalysisReportInput): boolean {
  const generatedAt = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  const subject = input.subject?.trim();
  const sections = [
    subject
      ? `<section><h2>Konteks yang dianalisis</h2>${paragraph(subject.slice(0, 4000))}</section>`
      : "",
    `<section><h2>Ringkasan penilaian</h2>${paragraph(input.summary)}</section>`,
    input.reasons.length
      ? `<section><h2>Alasan penilaian</h2>${list(input.reasons)}</section>`
      : "",
    input.recommendations.length
      ? `<section><h2>Rekomendasi tindakan</h2>${list(input.recommendations)}</section>`
      : "",
    contactList(input.contacts),
  ].join("");

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hasil Analisis ${escapeHtml(input.label)} - CegahScam</title>
  <style>
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #26384a; font: 14px/1.65 Arial, sans-serif; }
    header { border-bottom: 2px solid #446685; padding-bottom: 16px; }
    .brand { margin: 0; color: #26384a; font-size: 20px; font-weight: 700; }
    .eyebrow { margin: 2px 0 0; color: #52789a; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
    .date { color: #667085; font-size: 11px; }
    h1 { margin: 26px 0 12px; font-size: 25px; line-height: 1.25; }
    h2 { margin: 0 0 8px; color: #446685; font-size: 15px; }
    section { margin-top: 20px; break-inside: avoid; }
    p { margin: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
    ol, ul { margin: 0; padding-left: 22px; }
    li { margin: 0 0 7px; overflow-wrap: anywhere; }
    .score { margin: 16px 0 22px; padding: 18px; border-left: 5px solid #446685; border-radius: 8px; background: #f3f7fb; }
    .score strong { display: block; font-size: 25px; }
    .score span { color: #52789a; font-weight: 700; }
    .notice { margin-top: 28px; padding: 12px; border-radius: 8px; background: #fff8e7; color: #795e18; font-size: 11px; }
    footer { margin-top: 36px; border-top: 1px solid #c8d6e3; padding-top: 10px; color: #667085; font-size: 10px; }
  </style>
</head>
<body>
  <header>
    <p class="brand">CegahScam</p>
    <p class="eyebrow">Platform Perlindungan Digital</p>
    <p class="date">Dibuat ${escapeHtml(generatedAt)}</p>
  </header>
  <main>
    <h1>Hasil Analisis ${escapeHtml(input.label)}</h1>
    <div class="score">
      <span>Skor risiko</span>
      <strong>${Math.round(input.score)} / 100</strong>
      <p>Kategori: ${escapeHtml(input.levelLabel)} · Jenis: ${escapeHtml(input.scamType?.trim() || "Tidak teridentifikasi")}</p>
    </div>
    ${sections}
    <p class="notice"><strong>Catatan:</strong> Hasil analisis bersifat indikatif dan bukan keputusan hukum. Jangan pernah membagikan OTP, PIN, atau kata sandi kepada siapa pun.</p>
  </main>
  <footer>CegahScam · Kenali. Pahami. Hadapi. · Dokumen dibuat di perangkat Anda dan tidak disimpan oleh server.</footer>
</body>
</html>`;

  return printDocument(html);
}
