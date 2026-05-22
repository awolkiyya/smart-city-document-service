import fs from "fs";
import path from "path";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

import { v4 as uuidv4 } from "uuid";

import {
  GENERATED_DIR,
  TEMPLATE_PATH,
} from "../config/paths";

import { imageModule } from "./image.service";
import { LoggerService } from "./logger.service";

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
    // VALIDATE TEMPLATE EXISTS
    // =====================================================
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(
        `DOCX template not found: ${TEMPLATE_PATH}`
      );
    }

    // =====================================================
    // READ TEMPLATE
    // =====================================================
    let templateContent: string;

    try {
      templateContent = fs.readFileSync(
        TEMPLATE_PATH,
        "binary"
      );
    } catch (error) {
      LoggerService.error("Failed to read DOCX template", error);
      throw new Error("Failed to read DOCX template");
    }

    // =====================================================
    // INIT ZIP
    // =====================================================
    let zip: PizZip;

    try {
      zip = new PizZip(templateContent);
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
        modules: [imageModule],
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
          ?.map(
            (e: any) =>
              `${e.name}: ${e.properties?.explanation}`
          )
          .join("\n") || error.message;

      throw new Error(`DOCX render failed:\n${details}`);
    }

    // =====================================================
    // GENERATE BUFFER
    // =====================================================
    let buffer: Buffer;

    try {
      buffer = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      });
    } catch (error) {
      LoggerService.error("Failed to generate DOCX buffer", error);
      throw new Error("Failed to generate document buffer");
    }

    // =====================================================
    // FILE NAME + PATH
    // =====================================================
    const fileName = `plan-${uuidv4()}.docx`;
    const outputPath = path.join(GENERATED_DIR, fileName);

    // =====================================================
    // SAVE FILE
    // =====================================================
    try {
      fs.writeFileSync(outputPath, buffer);
    } catch (error) {
      LoggerService.error("Failed to save DOCX file", error);
      throw new Error("Failed to save generated document");
    }

    // =====================================================
    // LOG SUCCESS
    // =====================================================
    LoggerService.info("DOCX generated successfully", {
      fileName,
      outputPath,
    });

    // =====================================================
    // RETURN CONTRACT (STABLE API)
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