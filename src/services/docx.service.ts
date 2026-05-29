import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { v4 as uuidv4 } from "uuid";

import { GENERATED_DIR, TEMPLATE_PATH } from "../config/paths";
import { createImageModule } from "./image.service";
import { LoggerService } from "./logger.service";

/**
 * =====================================================
 * TEMPLATE CACHE (FAST OPTIMIZATION)
 * =====================================================
 */
let cachedTemplate: Buffer | null = null;

/**
 * =====================================================
 * ENSURE OUTPUT DIRECTORY EXISTS
 * =====================================================
 */
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

export interface GenerateDocxResult {
  readonly fileName: string;
  readonly outputPath: string;
  readonly buffer: Buffer;
  readonly downloadUrl: string;
}

export const generateDocx = async (
  templateData: Record<string, unknown>
): Promise<GenerateDocxResult> => {
  try {
    // =====================================================
    // LOAD TEMPLATE (CACHED)
    // =====================================================
    if (!cachedTemplate) {
      if (!fs.existsSync(TEMPLATE_PATH)) {
        throw new Error(`DOCX template not found: ${TEMPLATE_PATH}`);
      }

      cachedTemplate = fs.readFileSync(TEMPLATE_PATH);
    }

    // =====================================================
    // INIT ZIP
    // =====================================================
    let zip: PizZip;

    try {
      zip = new PizZip(cachedTemplate);
    } catch (error) {
      LoggerService.error("Failed to initialize PizZip", error);
      throw new Error("Invalid DOCX template format");
    }

    // =====================================================
    // INIT DOCXTEMPLATER
    // =====================================================
    let doc: Docxtemplater;

    try {
      doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [createImageModule()], // ✅ safe per request
      });
    } catch (error) {
      LoggerService.error("Failed to initialize Docxtemplater", error);
      throw new Error("Failed to initialize DOCX engine");
    }

    // =====================================================
    // RENDER DOCUMENT
    // =====================================================
    try {
      doc.render(templateData);
    } catch (error: any) {
      LoggerService.error("DOCX render error", error);

      const details =
        error?.properties?.errors
          ?.map((e: any) => `${e.name}: ${e.properties?.explanation}`)
          .join("\n") || error.message;

      throw new Error(`DOCX render failed:\n${details}`);
    }

    // =====================================================
    // GENERATE BUFFER
    // =====================================================
    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // =====================================================
    // FILE NAME + PATH
    // =====================================================
    const fileName = `plan-${uuidv4()}.docx`;
    const outputPath = path.join(GENERATED_DIR, fileName);

    // =====================================================
    // SAVE FILE (ASYNC SAFE)
    // =====================================================
    fs.writeFileSync(outputPath, buffer);

    LoggerService.info("DOCX generated successfully", {
      fileName,
      outputPath,
    });

    // =====================================================
    // RETURN RESULT
    // =====================================================
    return {
      fileName,
      outputPath,
      buffer,
      downloadUrl: `/generated/${fileName}`,
    };
  } catch (error) {
    LoggerService.error("generateDocx service failed", error);
    throw error;
  }
};