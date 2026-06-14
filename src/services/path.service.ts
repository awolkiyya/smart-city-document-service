import path from "path";
import fs from "fs";
import { GENERATED_DIR, TEMPLATE_DIR } from "../config/paths";

export type DocumentType = "plan" | "report";

export class PathService {
  /**
   * Ensure directory exists (safe + reusable)
   */
  private static ensureDir(dir: string) {
    fs.mkdirSync(dir, { recursive: true });
  }

  /**
   * =====================================================
   * DOCX OUTPUT PATH
   * =====================================================
   */
  static docxFile(type: DocumentType, fileName: string): string {
    const dir = path.join(GENERATED_DIR, type, "docx");
    this.ensureDir(dir);
    return path.join(dir, fileName);
  }

  /**
   * =====================================================
   * PDF OUTPUT PATH
   * =====================================================
   */
  static pdfFile(type: DocumentType, fileName: string): string {
    const dir = path.join(GENERATED_DIR, type, "pdf");
    this.ensureDir(dir);
    return path.join(dir, fileName);
  }

  /**
   * =====================================================
   * TEMPLATE PATH (DOCKER SAFE)
   * =====================================================
   */
  static template(type: DocumentType, file: string): string {
    return path.join(TEMPLATE_DIR, type, file);
  }
}