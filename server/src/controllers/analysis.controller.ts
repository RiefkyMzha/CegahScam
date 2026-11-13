import type { Request, Response } from "express";
import { requestAiService } from "../aiClient";
import { validateTextFields } from "../validation";

export const analyzePhoneNumber = async (req: Request, res: Response) => {
  const { nomorTelepon } = req.body ?? { };

  if(typeof nomorTelepon !== "string" || !nomorTelepon.trim()) {
    return res.status(400).json({ message: "Nomor telepon tidak boleh kosong." });
  }

  const phoneNumber = nomorTelepon.trim().replace(/[^\d+]/g, "");

  if(!/^(?:\+62|62|0)\d{7,13}$/.test(phoneNumber)) {
    return res.status(400).json({ message: "Gunakan format nomor Indonesia yang valid." });
  }

 try {
    const aiResult = await requestAiService(
      `${process.env.AI_SERVICE_URL}/api/v1/analyze/phone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Token": process.env.AI_API_TOKEN ?? "",
        },
        body: JSON.stringify({ phone_number : phoneNumber }),
        signal: AbortSignal.timeout(90_000),
      },
      "Terjadi kesalahan saat menganalisis nomor telepon.",
    );

    if (!aiResult.ok) {
      return res.status(aiResult.status).json({ message: aiResult.message });
    }

    return res.status(200).json(aiResult.data);
  } catch (error) {
    console.error("Error analyzing phone number:", error);
    return res.status(500).json({ message: "Terjadi kesalahan internal server saat menganalisis nomor telepon." });
  } 
}

export const analyzeChat = async (req: Request, res: Response) => {
  if(!req.file) {
    return res.status(400).json({ message: "File bukti pesan harus diunggah." });
  }

  const { pesan } = req.body ?? { };

  const validationError = validateTextFields([
    { value: pesan, label: "Pesan", maxLength: 10_000 },
  ]);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const fd = new FormData();
  fd.append("text_content", String(pesan));
  fd.append(
    "image",
    new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }),
    req.file.originalname
  );  

  try {
    const aiResult = await requestAiService(
      `${process.env.AI_SERVICE_URL}/api/v1/analyze/text`,
      {
        method: "POST",
        headers: {
          "X-API-Token": process.env.AI_API_TOKEN ?? "",
        },
        body: fd,
        signal: AbortSignal.timeout(90_000),
      },
      "Terjadi kesalahan saat menganalisis pesan chat.",
    );

    if (!aiResult.ok) {
      return res.status(aiResult.status).json({ message: aiResult.message });
    }
    return res.status(200).json(aiResult.data);
  
  } catch (error) {
    console.error("Error analyzing chat message:", error);
    return res.status(500).json({ message: "Terjadi kesalahan internal server saat menganalisis pesan chat." });
  }

}

export const analyzeScreenshot = async (req: Request, res: Response) => {
  if(!req.file) {
    return res.status(400).json({ message: "File bukti screenshot harus diunggah." });
  }

  const { platform } = req.body ?? { };

  const validationError = validateTextFields([
    { value: platform, label: "Platform", maxLength: 50 },
  ]);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const fd = new FormData();
  fd.append("platform", String(platform));
  fd.append(
    "image",
    new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }),
    req.file.originalname
  );  

  try {
    const aiResult = await requestAiService(
      `${process.env.AI_SERVICE_URL}/api/v1/analyze/image`,
      {
        method: "POST",
        headers: {
          "X-API-Token": process.env.AI_API_TOKEN ?? "",
        },
        body: fd,
        signal: AbortSignal.timeout(90_000),
      },
      "Terjadi kesalahan saat menganalisis tangkapan layar chat.",
    );

    if (!aiResult.ok) {
      return res.status(aiResult.status).json({ message: aiResult.message });
    }
    return res.status(200).json(aiResult.data);
  
  } catch (error) {
    console.error("Error analyzing chat message:", error);
    return res.status(500).json({ message: "Terjadi kesalahan internal server saat menganalisis tangkapan layar chat." });
  }

}