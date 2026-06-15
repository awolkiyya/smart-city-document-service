import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { LoggerService } from "../../services/logger.service";

/**
 * =====================================================
 * NORMALIZE PARAM (SAFE FOR EXPRESS)
 * =====================================================
 */
const normalizeParam = (param: string | string[]) =>
  Array.isArray(param) ? param[0] : param;

export class EvidenceController {

/**
 * =====================================================
 * UPLOAD EVIDENCE
 * =====================================================
 */
static async upload(req: Request, res: Response) {
  try {
    const reportId = normalizeParam(req.params.reportId);
    const file = req.file as Express.Multer.File | undefined;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "reportId is required",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const absolutePath = file.path;

    const uploadedFile = {
      fileName: file.filename,
      originalName: file.originalname,

      /**
       * FIXED: correct public URL based on your static route
       */
      url: `/uploads/${file.filename}`,

      /**
       * optional grouping
       */
      folder: "uploads",

      /**
       * backend only (do NOT use in frontend)
       */
      path: absolutePath,

      size: file.size,
      mimetype: file.mimetype,
    };

    LoggerService.info("Evidence upload successful", {
      reportId,
      fileName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully",
      data: uploadedFile,
    });

  } catch (error: any) {
    LoggerService.error("Evidence upload failed", {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
      data: null,
    });
  }
}
  
  /**
   * =====================================================
   * DOWNLOAD EVIDENCE (SAFE + FOLDER BASED)
   * =====================================================
   */
  static async download(req: Request, res: Response) {
    try {
      const planId = normalizeParam(req.params.planId);
      const filename = normalizeParam(req.params.filename);

      if (!planId || !filename) {
        return res.status(400).json({
          success: false,
          message: "planId and filename are required",
        });
      }

      if (filename.includes("..")) {
        return res.status(400).json({
          success: false,
          message: "Invalid filename",
        });
      }

      /**
       * =====================================================
       * FILE PATH STRUCTURE:
       * uploads/plans/{planId}/evidence/{filename}
       * =====================================================
       */
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "plans",
        planId,
        "evidence",
        filename
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      return res.download(filePath, filename);

    } catch (error: any) {
      LoggerService.error("Evidence download failed", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * =====================================================
   * DELETE EVIDENCE (SAFE)
   * =====================================================
   */
  static async remove(req: Request, res: Response) {
    try {
      const planId = normalizeParam(req.params.planId);
      const filename = normalizeParam(req.params.filename);

      if (!planId || !filename) {
        return res.status(400).json({
          success: false,
          message: "planId and filename are required",
        });
      }

      if (filename.includes("..")) {
        return res.status(400).json({
          success: false,
          message: "Invalid filename",
        });
      }

      const filePath = path.join(
        process.cwd(),
        "uploads",
        "plans",
        planId,
        "evidence",
        filename
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      LoggerService.info("Evidence deleted", {
        planId,
        filename,
      });

      return res.status(200).json({
        success: true,
        message: "File deleted",
      });

    } catch (error: any) {
      LoggerService.error("Evidence delete failed", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}