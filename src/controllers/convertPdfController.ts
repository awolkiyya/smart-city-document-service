import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

import { PathService } from "../services/path.service";
import { convertDocxToPdf } from "../services/pdf.service";
import { LoggerService } from "../services/logger.service";

type DocumentType = "plan" | "report";

interface ConvertPdfBody {
  fileName: string;
  type: DocumentType;
}

export const convertPdfController = async (
  req: Request<{}, {}, ConvertPdfBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName, type } = req.body;

    /**
     * =====================================================
     * VALIDATION
     * =====================================================
     */
    if (!fileName || !type) {
      return res.status(400).json({
        success: false,
        message: "fileName and type are required",
      });
    }

    if (!["plan", "report"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be either 'plan' or 'report'",
      });
    }

    /**
     * =====================================================
     * RESOLVE DOCX PATH (CRITICAL FIX)
     * =====================================================
     */
    const rawPath = PathService.docxFile(type, fileName);
    const docxPath = path.resolve(rawPath);

    LoggerService.info("DOCX resolve path", { docxPath });

    /**
     * =====================================================
     * FILE EXISTENCE CHECK (VERY IMPORTANT)
     * =====================================================
     */
    if (!fs.existsSync(docxPath)) {
      LoggerService.error("DOCX not found on disk", { docxPath });

      return res.status(404).json({
        success: false,
        message: "DOCX file not found on server",
        path: docxPath,
      });
    }

    /**
     * =====================================================
     * CONVERT DOCX → PDF
     * =====================================================
     */
    let pdfResultPath: string;

    try {
      pdfResultPath = await convertDocxToPdf(docxPath,req.body.type);
    } catch (conversionError: any) {
      LoggerService.error("LibreOffice conversion failed", {
        error: conversionError?.message,
        stack: conversionError?.stack,
        docxPath,
      });

      return res.status(500).json({
        success: false,
        message: "PDF conversion failed",
        error: conversionError?.message,
      });
    }

    /**
     * =====================================================
     * VALIDATE OUTPUT
     * =====================================================
     */
    if (!pdfResultPath || !fs.existsSync(pdfResultPath)) {
      LoggerService.error("PDF file not generated", {
        pdfResultPath,
        docxPath,
      });

      return res.status(500).json({
        success: false,
        message: "PDF not generated",
      });
    }

    const file = path.basename(pdfResultPath);

    /**
     * =====================================================
     * SUCCESS RESPONSE
     * =====================================================
     */
    return res.status(200).json({
      success: true,
      data: {
        pdfFile: file,
        pdfUrl: `/generated/${type}/pdf/${file}`,
      },
    });

  } catch (error: any) {
    /**
     * =====================================================
     * GLOBAL ERROR HANDLING
     * =====================================================
     */
    LoggerService.error("Unexpected PDF controller error", {
      error: error?.message,
      stack: error?.stack,
      body: req.body,
    });

    return next(error);
  }
};