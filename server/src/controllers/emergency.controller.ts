import type { Request, Response } from "express";
import { validateTextFields } from "../validation";

export const reportFinancial = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "File bukti transfer harus diunggah." });
    }

    const {
        jenisBank,
        kanalMedia,
        tanggalKejadian,
        tujuanTransaksi,
        namaInstitusi,
        nomorRekening,
        namaPemilikRekening,
        nominalKerugian,
        detailKronologi,
    } = req.body ?? {};
    const kronologi =
        typeof detailKronologi === "string" ? detailKronologi.trim() : "";

    const validationError = validateTextFields([
        { value: jenisBank, label: "Bank/dompet digital korban", maxLength: 100 },
        { value: kanalMedia, label: "Kanal media kejadian", maxLength: 100 },
        { value: tanggalKejadian, label: "Tanggal kejadian", maxLength: 10 },
        { value: tujuanTransaksi, label: "Tujuan transaksi", maxLength: 1_000 },
        { value: nomorRekening, label: "Nomor rekening penipu", maxLength: 50 },
        { value: namaInstitusi, label: "Nama institusi", maxLength: 200, optional: true },
        { value: namaPemilikRekening, label: "Nama pemilik rekening", maxLength: 200, optional: true },
        { value: kronologi, label: "Detail kronologi", maxLength: 10_000 },
    ]);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    if (nominalKerugian === undefined || nominalKerugian === "" || !Number.isFinite(Number(nominalKerugian))) {
        return res.status(400).json({ message: "Nominal kerugian harus berupa angka." });
    }

    const fd = new FormData();
    fd.append("bank_korban", String(jenisBank));
    fd.append("platform_kejadian", String(kanalMedia));
    fd.append("tanggal_kejadian", String(tanggalKejadian));
    fd.append("tujuan_transaksi", String(tujuanTransaksi));
    fd.append("nomor_rekening_penipu", String(nomorRekening));
    fd.append("nominal_kerugian", String(Number(nominalKerugian)));
    if (namaInstitusi) fd.append("nama_institusi_penipu", String(namaInstitusi));
    if (namaPemilikRekening) fd.append("nama_pemilik_penipu", String(namaPemilikRekening));
    fd.append("kronologi_user", kronologi);
    fd.append(
        "bukti_transfer",
        new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }),
        req.file.originalname
    );

    try {
        const aiRes = await fetch(
            `${process.env.AI_SERVICE_URL}/api/v1/emergency/financial`,
            {
                method: "POST",
                headers: {
                    "X-API-Token": process.env.AI_API_TOKEN ?? "",
                },
                body: fd,
                signal: AbortSignal.timeout(90_000),
            }
        );

        const data = await aiRes.json();

        if (!aiRes.ok) {
            return res.status(aiRes.status).json({ message: data.detail || "Terjadi kesalahan saat mengirim laporan." });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error reporting financial:", error);
        return res.status(500).json({ message: "Terjadi kesalahan internal server saat mengirim laporan." });
    }
}

export const reportData = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "File bukti screenshot harus diunggah." });
    }

    const {
        jenisData,
        tanggalKejadian,
        kanalMedia,
        tindakanPelaku,
        detailKronologi,
        statusAkses,
    } = req.body ?? {};
    const kronologi =
        typeof detailKronologi === "string" ? detailKronologi.trim() : "";

    const validationError = validateTextFields([
        { value: jenisData, label: "Jenis data", maxLength: 1_000 },
        { value: tanggalKejadian, label: "Tanggal kejadian", maxLength: 10 },
        { value: kanalMedia, label: "Kanal media kejadian", maxLength: 100 },
        { value: tindakanPelaku, label: "Tindakan pelaku", maxLength: 1_000 },
        { value: kronologi, label: "Detail kronologi", maxLength: 10_000 },
        { value: statusAkses, label: "Status akses", maxLength: 100 },
    ]);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const fd = new FormData();
    fd.append("jenis_data", String(jenisData));
    fd.append("tanggal_kejadian", String(tanggalKejadian));
    fd.append("platform_kejadian", String(kanalMedia));
    fd.append("tindakan_pelaku", String(tindakanPelaku));
    fd.append("kronologi_user", kronologi);
    fd.append("status_akses", String(statusAkses));
    fd.append(
        "bukti_percakapan",
        new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }),
        req.file.originalname
    );

    try {
        const aiRes = await fetch(
            `${process.env.AI_SERVICE_URL}/api/v1/emergency/data-breach`,
            {
                method: "POST",
                headers: {
                    "X-API-Token": process.env.AI_API_TOKEN ?? "",
                },
                body: fd,
                signal: AbortSignal.timeout(90_000),
            }
        );

        const data = await aiRes.json();

        if (!aiRes.ok) {
            return res.status(aiRes.status).json({ message: data.detail || "Terjadi kesalahan saat mengirim laporan." });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error reporting data:", error);
        return res.status(500).json({ message: "Terjadi kesalahan internal server saat mengirim laporan." });
    }



}