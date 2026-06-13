import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { env } from "../config/env";
import { LoggerService } from "./logger.service";

const execAsync = promisify(exec);

export type DocumentType = "plan" | "report";

/**
 * =====================================================
 * DOCX → PDF CONVERTER (PRODUCTION GRADE)
 * =====================================================
 */
export const convertDocxToPdf = async (
  docxPath: string,
  type: DocumentType
): Promise<string> => {
  try {
    /**
     * =====================================================
     * VALIDATION
     * =====================================================
     */
    if (!docxPath) {
      throw new Error("docxPath is required");
    }

    if (!fs.existsSync(docxPath)) {
      throw new Error(`DOCX file not found: ${docxPath}`);
    }

    /**
     * =====================================================
     * FILE INFO
     * =====================================================
     */
    const fileName = path.basename(docxPath, ".docx");

    /**
     * =====================================================
     * STRUCTURED OUTPUT DIR
     * =====================================================
     */
    const baseDir = path.dirname(path.dirname(docxPath)); 
    // e.g. generated/plan/docx → generated/plan

    const outputDir = path.join(baseDir, "pdf");

    fs.mkdirSync(outputDir, { recursive: true });

    /**
     * =====================================================
     * LIBREOFFICE COMMAND (SAFE EXECUTION)
     * =====================================================
     */
    const libreOfficePath = env.LIBREOFFICE_PATH;

    if (!libreOfficePath) {
      throw new Error("LibreOffice path not configured");
    }

    const command = `"${libreOfficePath}" --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`;

    LoggerService.info("Starting PDF conversion", {
      docxPath,
      outputDir,
      type,
    });

    await execAsync(command);

    /**
     * =====================================================
     * RESULT PATH
     * =====================================================
     */
    const pdfPath = path.join(outputDir, `${fileName}.pdf`);

    if (!fs.existsSync(pdfPath)) {
      LoggerService.error("PDF generation failed", {
        docxPath,
        pdfPath,
      });

      throw new Error("PDF not generated");
    }

    /**
     * =====================================================
     * SUCCESS LOG
     * =====================================================
     */
    LoggerService.info("PDF generated successfully", {
      pdfPath,
      type,
    });

    return pdfPath;

  } catch (error) {
    LoggerService.error("convertDocxToPdf failed", error);
    throw error;
  }
};