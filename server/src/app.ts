import express from "express";
import cors from "cors";
import type { ErrorRequestHandler } from "express";
import analysisRouter from "./routes/analysis.routes";
import emergencyRouter from "./routes/emergency.router";
import multer from "multer";
import { UnsupportedImageTypeError } from "./upload";

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/analysis", analysisRouter);
app.use ("/api/emergency", emergencyRouter);

app.get("/", (_, res) => {
  res.send("CegahScam API is running.");
});

app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "Ukuran file maksimal 15 MB." });
    }

    return res.status(400).json({ message: "File upload tidak valid." });
  }

  if (error instanceof UnsupportedImageTypeError) {
    return res.status(400).json({ message: error.message });
  }

  console.error("Unhandled Express error:", error);
  return res
    .status(500)
    .json({ message: "Terjadi kesalahan internal server." });
};

app.use(errorHandler);

export default app;