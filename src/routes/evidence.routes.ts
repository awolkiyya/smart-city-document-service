import express from "express";
import upload from "../middleware/upload.middleware";
import { EvidenceController } from "../modules/evidance/controller";

const router = express.Router();

/**
 * =====================================================
 * UPLOAD REPORT EVIDENCE
 * =====================================================
 */
router.post(
  "/reports/:reportId/upload",
  upload.single("file"),
  EvidenceController.upload
);

/**
 * =====================================================
 * DOWNLOAD REPORT EVIDENCE
 * =====================================================
 */
router.get(
  "/reports/:reportId/evidence/:filename/download",
  EvidenceController.download
);

/**
 * =====================================================
 * DELETE REPORT EVIDENCE
 * =====================================================
 */
router.delete(
  "/reports/:reportId/evidence/:filename",
  EvidenceController.remove
);

export default router;