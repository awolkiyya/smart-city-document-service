import path from "path";
import fs from "fs";
import { GENERATED_DIR } from "../config/paths";

export type DocumentType = "plan" | "report";

export class PathService {
  /**
   * =====================================================
   * DOCX OUTPUT PATH
   * =====================================================
   */
  static docxFile(type: DocumentType, fileName: string): string {
    const dir = path.resolve(GENERATED_DIR, type, "docx");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return path.join(dir, fileName);
  }

  /**
   * =====================================================
   * PDF OUTPUT PATH
   * =====================================================
   */
  static pdfFile(type: DocumentType, fileName: string): string {
    const dir = path.resolve(GENERATED_DIR, type, "pdf");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return path.join(dir, fileName);
  }

  /**
   * =====================================================
   * TEMPLATE PATH (optional but important)
   * =====================================================
   */
  static template(type: DocumentType, file: string): string {
    return path.resolve("templates", type, file);
  }
}