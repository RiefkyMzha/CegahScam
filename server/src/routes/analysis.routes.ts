import { Router } from "express";
import { analyzeChat, analyzeScreenshot } from "../controllers/analysis.controller";
import { analyzePhoneNumber } from "../controllers/analysis.controller";
import { upload } from "../upload";

const router = Router();

// Route for analyzing phone numbers
router.post("/phone", analyzePhoneNumber);

// Route for analyzing chat messages
router.post("/chat", upload.single("fileBukti"), analyzeChat);

// Route for analyzing screenshots
router.post("/screenshot", upload.single("fileBukti"), analyzeScreenshot);

export default router;