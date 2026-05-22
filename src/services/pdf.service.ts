import fs from "fs";
import path from "path";

import { exec } from "child_process";

import { env } from "../config/env";

export const convertDocxToPdf = (
  docxPath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(docxPath);

    const command = `"${env.LIBREOFFICE_PATH}" --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`;

    exec(command, (error) => {
      if (error) {
        return reject(error);
      }

      const pdfPath = docxPath.replace(
        ".docx",
        ".pdf"
      );

      if (!fs.existsSync(pdfPath)) {
        return reject(
          new Error("PDF not generated")
        );
      }

      resolve(pdfPath);
    });
  });
};