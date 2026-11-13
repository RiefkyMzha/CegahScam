import { Router } from "express";
import { reportData, reportFinancial } from "../controllers/emergency.controller";
import { upload } from "../upload";

const router = Router();

// Route for report data
router.post("/data", upload.single("fileBukti"), reportData);

// Route for report financial
router.post("/financial", upload.single("file"), reportFinancial);

export default router;