import { Router } from "express";

import {
  generateDocumentController,
  convertPdfController,
  healthCheckController,
} from "../controllers/document.controller";

const router = Router();

/**
 * =====================================================
 * HEALTH CHECK
 * =====================================================
 */
router.get("/health", healthCheckController);

/**
 * =====================================================
 * GENERATE DOCX
 * =====================================================
 * POST /api/documents/generate
 */
router.post("/generate", generateDocumentController);
// generate plan
// generate report

/**
 * =====================================================
 * CONVERT DOCX → PDF
 * =====================================================
 * POST /api/documents/convert-pdf
 */
router.post("/convert-pdf", convertPdfController);

export default router;