import multer from "multer";

export class UnsupportedImageTypeError extends Error {
  constructor() {
    super("Format file tidak didukung. Hanya JPG, PNG, dan WEBP yang diperbolehkan.");
    this.name = "UnsupportedImageTypeError";
  }
}

const allowedTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (allowedTypes.has(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new UnsupportedImageTypeError());
    }
  },
});
