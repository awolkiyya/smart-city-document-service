import { Router } from "express";

import { healthCheckController } from "../controllers/healthCheckController";
import { convertPdfController } from "../controllers/convertPdfController";
import evidenceRoutes from "../routes/evidence.routes";


/**
 * REPORT MODULE
 */
import reportRoutes from "../modules/report/route";

/**
 * PLAN MODULE
 */
import planRoutes from "../modules/plan/route";

/**
 * TEMPLATE MODULE (NEW - IMPORTANT)
 */
import templateRoutes from "../modules/template/routes";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/
router.get("/health", healthCheckController);

/*
|--------------------------------------------------------------------------
| TEMPLATE ENGINE (CORE ADDITION)
|--------------------------------------------------------------------------
| This is the missing piece if Express becomes your document system
*/
router.use("/templates",authMiddleware, templateRoutes);

/*
|--------------------------------------------------------------------------
| BUSINESS DOCUMENTS
|--------------------------------------------------------------------------
*/
router.use("/reports",authMiddleware, reportRoutes);
router.use("/plans",authMiddleware, planRoutes);

/*
|--------------------------------------------------------------------------
| DOCX → PDF CONVERSION SERVICE
|--------------------------------------------------------------------------
*/
router.post("/convert-pdf",authMiddleware, convertPdfController);

router.use("/evidence", evidenceRoutes);


export default router;