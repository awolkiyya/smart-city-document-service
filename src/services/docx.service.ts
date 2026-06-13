import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";

import { GENERATED_DIR } from "../config/paths";
import { createImageModule } from "./image.service";
import { LoggerService } from "./logger.service";

/**
 * =====================================================
 * TYPES
 * =====================================================
 */
export type DocumentType = "plan" | "report";

export interface GenerateDocxResult {
  readonly fileName: string;
  readonly outputPath: string;
  readonly buffer: Buffer;
  readonly downloadUrl: string;
}

/**
 * =====================================================
 * FS PROMISES
 * =====================================================
 */
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);

/**
 * =====================================================
 * TEMPLATE CACHE (PER PATH)
 * =====================================================
 */
let cachedTemplate: Buffer | null = null;
let cachedTemplatePath: string | null = null;

/**
 * =====================================================
 * ENSURE DIRECTORY
 * =====================================================
 */
const ensureDir = async (dir: string) => {
  try {
    await accessAsync(dir, fs.constants.F_OK);
  } catch {
    await mkdirAsync(dir, { recursive: true });
  }
};

/**
 * =====================================================
 * DOCX ENGINE
 * =====================================================
 */
export const generateDocx = async (
  templateData: Record<string, unknown>,
  templatePath: string,
  type: DocumentType
): Promise<GenerateDocxResult> => {
  try {
    /**
     * =====================================================
     * VALIDATE TEMPLATE PATH
     * =====================================================
     */
    if (!templatePath) {
      throw new Error("Template path is required");
    }

    /**
     * =====================================================
     * LOAD TEMPLATE (SMART CACHE)
     * =====================================================
     */
    if (!cachedTemplate || cachedTemplatePath !== templatePath) {
      if (!fs.existsSync(templatePath)) {
        throw new Error(`DOCX template not found: ${templatePath}`);
      }

      cachedTemplate = await readFileAsync(templatePath);
      cachedTemplatePath = templatePath;
    }

    /**
     * =====================================================
     * INIT ZIP
     * =====================================================
     */
    const zip = new PizZip(cachedTemplate);

    /**
     * =====================================================
     * INIT DOCXTEMPLATER
     * =====================================================
     */
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [createImageModule()],
    });

    LoggerService.info("DOCX Render Data", {
      period: templateData.period,
    });
    
    console.log(
      JSON.stringify(templateData, null, 2)
    );

    /**
     * =====================================================
     * RENDER
     * =====================================================
     */
    doc.render(templateData);

    /**
     * =====================================================
     * GENERATE BUFFER
     * =====================================================
     */
    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    /**
     * =====================================================
     * ORGANIZED OUTPUT STRUCTURE
     * =====================================================
     */
    const fileName = `doc-${uuidv4()}.docx`;

    const outputDir = path.join(
      GENERATED_DIR,
      type,
      "docx"
    );

    await ensureDir(outputDir);

    const outputPath = path.join(outputDir, fileName);

    /**
     * =====================================================
     * SAVE FILE
     * =====================================================
     */
    await writeFileAsync(outputPath, buffer);

    /**
     * =====================================================
     * LOG
     * =====================================================
     */
    LoggerService.info("DOCX generated successfully", {
      fileName,
      outputPath,
      templatePath,
      type,
    });

    /**
     * =====================================================
     * RETURN
     * =====================================================
     */
    return {
      fileName,
      outputPath,
      buffer,
      downloadUrl: `/generated/${type}/docx/${fileName}`,
    };

  } catch (error) {
    LoggerService.error("generateDocx failed", error);
    throw error;
  }
};