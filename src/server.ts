import app from "./app";
import { env } from "./config/env";

import {
  TEMPLATE_DIR,
  GENERATED_DIR,
  ASSETS_DIR,
} from "./config/paths";

import { ensureDirectories } from "./utils/file";

/**
 * =====================================================
 * BOOTSTRAP DIRECTORIES
 * =====================================================
 */
try {
  ensureDirectories([
    TEMPLATE_DIR,
    GENERATED_DIR,
    ASSETS_DIR,
  ]);
} catch (error) {
  console.error("Failed to initialize directories:", error);
  process.exit(1);
}

/**
 * =====================================================
 * VALIDATE ENV (RAILWAY SAFE)
 * =====================================================
 */
const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : env.PORT;

/**
 * =====================================================
 * START SERVER (CRITICAL FOR RAILWAY)
 * =====================================================
 */
const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// const server = app.listen(PORT, "10.41.238.73", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


/**
 * =====================================================
 * HANDLE UNHANDLED ERRORS
 * =====================================================
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});





















// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const PizZip = require("pizzip");
// const Docxtemplater = require("docxtemplater");

// const ImageModule = require("docxtemplater-image-module-free");
// const { imageSize } = require("image-size");
// const { exec } = require("child_process");


// const app = express();

// // =====================================================
// // CONFIG
// // =====================================================
// const PORT = process.env.PORT || 3000;

// const TEMPLATE_DIR = path.join(__dirname, "templates");
// const GENERATED_DIR = path.join(__dirname, "generated");
// const ASSETS_DIR = path.join(__dirname, "assets");

// const TEMPLATE_PATH = path.join(
//   TEMPLATE_DIR,
//   "city8.docx"
// );

// const DEFAULT_LOGO = path.join(
//   ASSETS_DIR,
//   "logo.png"
// );

// // =====================================================
// // MIDDLEWARE
// // =====================================================
// app.use(
//   express.json({
//     limit: "20mb",
//   })
// );

// // =====================================================
// // ENSURE DIRECTORIES EXIST
// // =====================================================
// [
//   TEMPLATE_DIR,
//   GENERATED_DIR,
//   ASSETS_DIR,
// ].forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// const libreOfficePath =
//   "/Applications/LibreOffice.app/Contents/MacOS/soffice";


// /**
//  * Convert DOCX → PDF using LibreOffice
//  */
// const convertDocxToPdf = (docxPath) => {
//   return new Promise((resolve, reject) => {
//     const outputDir = path.dirname(docxPath);

//     const command = `"${libreOfficePath}" --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`;
//     exec(command, (error) => {
//       if (error) {
//         return reject(error);
//       }

//       const pdfPath = docxPath.replace(".docx", ".pdf");

//       if (!fs.existsSync(pdfPath)) {
//         return reject(new Error("PDF not generated"));
//       }

//       resolve(pdfPath);
//     });
//   });
// };

// // =====================================================
// // IMAGE MODULE CONFIG
// // =====================================================
// const imageOptions = {
//   centered: true,

//   getImage(tagValue) {
//     if (!tagValue) return null;

//     if (!fs.existsSync(tagValue)) {
//       console.warn("Missing image:", tagValue);
//       return null;
//     }

//     return fs.readFileSync(tagValue);
//   },

//   getSize(imgBuffer) {
//     try {
//       const dim = imageSize(imgBuffer);
//       const maxWidth = 120;

//       return [
//         maxWidth,
//         Math.round((dim.height / dim.width) * maxWidth),
//       ];
//     } catch {
//       return [120, 120];
//     }
//   },
// };

// // =====================================================
// // VALIDATION
// // =====================================================
// const validatePayload = (body) => {
//   const requiredFields = [
//     "cityName",
//     "sectorName",
//     "year",
//     "month",
//     "seensa",
//     "kaayyoo",
//   ];

//   const errors = [];

//   requiredFields.forEach((field) => {
//     const value = body[field];

//     if (
//       value === undefined ||
//       value === null ||
//       value === ""
//     ) {
//       errors.push({
//         field,
//         message: `${field} is required`,
//       });
//     }
//   });

//   return errors;
// };



// // =====================================================
// // SAFE ARRAY
// // =====================================================
// const safeArray = (value) => {
//   return Array.isArray(value) ? value : [];
// };

// // =====================================================
// // CLEAN STRING
// // =====================================================
// const safeString = (value) => {
//   if (
//     value === undefined ||
//     value === null
//   ) {
//     return "";
//   }

//   return String(value);
// };

// // =====================================================
// // HEALTH CHECK
// // =====================================================
// app.get("/", (req, res) => {
//   return res.status(200).json({
//     success: true,
//     message:
//       "DOCX document generation service running",
//   });
// });

// // =====================================================
// // GENERATE DOCUMENT
// // =====================================================
// app.post("/generate", async (req, res) => {
//   let outputPath = null;


//   const cleanValue = (value) => {
//     if (value === undefined || value === null) {
//       return null;
//     }
  
//     const cleaned = String(value).trim();
  
//     if (
//       cleaned === "" ||
//       cleaned.toLowerCase() === "null" ||
//       cleaned.toLowerCase() === "undefined"
//     ) {
//       return null;
//     }
  
//     return cleaned;
//   };
  
//   const locationText = [
//     cleanValue(req.body.cityName),
//     cleanValue(req.body.subcity),
//     cleanValue(req.body.wereda),
//   ].filter(Boolean).join("/");

//   try {
//     // =================================================
//     // VALIDATE REQUEST
//     // =================================================
//     const validationErrors = validatePayload(
//       req.body
//     );

//     if (validationErrors.length > 0) {
//       return res.status(422).json({
//         success: false,
//         message: "Validation failed",
//         errors: validationErrors,
//       });
//     }

//     // =================================================
//     // TEMPLATE EXISTS
//     // =================================================
//     if (!fs.existsSync(TEMPLATE_PATH)) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "DOCX template file not found",
//       });
//     }

//     // =================================================
//     // LOAD TEMPLATE
//     // =================================================
//     let templateContent;

//     try {
//       templateContent = fs.readFileSync(
//         TEMPLATE_PATH,
//         "binary"
//       );
//     } catch (error) {
//       console.error(
//         "TEMPLATE READ ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Failed to read template file",
//       });
//     }

//     // =================================================
//     // INITIALIZE ZIP
//     // =================================================
//     let zip;

//     try {
//       zip = new PizZip(templateContent);
//     } catch (error) {
//       console.error(
//         "ZIP INITIALIZATION ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Invalid DOCX template format",
//       });
//     }

//     // =================================================
//     // IMAGE MODULE
//     // =================================================
//     const imageModule = new ImageModule(
//       imageOptions
//     );

//     // =================================================
//     // DOCXTEMPLATER
//     // =================================================
//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true,
//       modules: [imageModule],
//     });

//     // =================================================
//     // LOGO
//     // =================================================
//     const logoExists = fs.existsSync(DEFAULT_LOGO);


//     // =================================================
//     // TEMPLATE DATA
//     // =================================================
//     const templateData = {
//       locationText,
//       // ===============================================
//       // LOGO
//       // ===============================================
//       logo: logoExists ? DEFAULT_LOGO : null,

//       // ===============================================
//       // BASIC INFO
//       // ===============================================
//       cityName: safeString(
//         req.body.cityName
//       ),

//       sectorName: safeString(
//         req.body.sectorName
//       ),

//       year: safeString(req.body.year),

//       month: safeString(req.body.month),

//       subcity:safeString(
//         req.body.subcity
//       ),
//       wereda:safeString(
//         req.body.wereda
//       ),
//       planName:safeString(
//         req.body.planName
//       ),
//       yeero:safeString(
//         req.body.yeero
//       ),
//       rawwi:safeString(
//         req.body.rawwi
//       ),
//       galma:safeString(
//         req.body.galma
//       ),

//       // ===============================================
//       // CONTENT
//       // ===============================================
//       seensa: safeString(
//         req.body.seensa
//       ),

//       kaayyoo: safeString(
//         req.body.kaayyoo
//       ),

//       galmoota: safeString(
//         req.body.galmoota
//       ),

//       xiinxala_raawwii_waggota_darbanii:
//         safeString(
//           req.body
//             .xiinxala_raawwii_waggota_darbanii
//         ),

//       toora_xiyyeeffannoo:
//         safeString(
//           req.body
//             .toora_xiyyeeffannoo
//         ),

//       tooftaa_raawwii:
//         safeString(
//           req.body.tooftaa_raawwii
//         ),

//       toora_xiyyeffannoo:
//         safeString(
//           req.body
//             .toora_xiyyeffannoo
//         ),

//       rakkowwan: safeString(
//         req.body.rakkowwan
//       ),

//       mulata_ergama_duudhaalee:
//         safeString(
//           req.body
//             .mulata_ergama_duudhaalee
//         ),

//       xumura: safeString(
//         req.body.xumura
//       ),

//       // ===============================================
//       // LOOPS
//       // ===============================================
//       hojii_gurguddoo: safeArray(
//         req.body.hojii_gurguddoo
//       ),

//       // ===============================================
//       // HIERARCHICAL PLANNING STRUCTURE
//       // Objective → Activity → KPI
//       // ===============================================
//       objectives: safeArray(req.body.objectives).map((obj) => ({
//         id: safeString(obj.id),
//         title: safeString(obj.title),
//         weight: obj.weight ?? 0,

//         activities: safeArray(obj.activities).map((act) => ({
//           id: safeString(act.id),
//           title: safeString(act.title),
//           weight: act.weight ?? 0,

//           kpis: safeArray(act.kpis).map((kpi) => ({
//             id: safeString(kpi.id),
//             indicator: safeString(kpi.indicator),
//             weight: kpi.weight ?? 0,
//             unit: safeString(kpi.unit),

//             baseline: kpi.baseline ?? 0,
//             target: kpi.target ?? 0,

//             q1: kpi.q1 ?? 0,
//             q2: kpi.q2 ?? 0,
//             q3: kpi.q3 ?? 0,
//             q4: kpi.q4 ?? 0,
//           })),
//         })),
//       })),
//     };

//     // =================================================
//     // RENDER DOCUMENT
//     // =================================================
//     try {
//       doc.render(templateData);
//     } catch (error) {
//       console.error(
//         "DOCX RENDER ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Failed to render DOCX template",
//         error: error.message,
//       });
//     }

//     // =================================================
//     // GENERATE BUFFER
//     // =================================================
//     let buffer;

//     try {
//       buffer = doc.getZip().generate({
//         type: "nodebuffer",
//         compression: "DEFLATE",
//       });
//     } catch (error) {
//       console.error(
//         "BUFFER GENERATION ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Failed to generate document buffer",
//       });
//     }

//     // =================================================
//     // FILE NAME
//     // =================================================
//     const timestamp = Date.now();

//     const fileName = `plan-${timestamp}.docx`;

//     outputPath = path.join(
//       GENERATED_DIR,
//       fileName
//     );

//     // =================================================
//     // SAVE FILE
//     // =================================================
//     try {
//       fs.writeFileSync(outputPath, buffer);
//     } catch (error) {
//       console.error(
//         "FILE WRITE ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Failed to save generated document",
//       });
//     }

//     return res.json({
//       success: true,
//       fileName: fileName,
//       fileUrl: `/generated/${fileName}`,
//     });

//   } catch (error) {
//     console.error(
//       "UNEXPECTED SERVER ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Unexpected internal server error",
//       error: error.message,
//     });
//   }
// });


// app.post("/convert-pdf", async (req, res) => {
//   try {
//     const { fileName } = req.body;

//     if (!fileName) {
//       return res.status(400).json({
//         success: false,
//         message: "fileName is required",
//       });
//     }

//     const docxPath = path.join(GENERATED_DIR, fileName);

//     if (!fs.existsSync(docxPath)) {
//       return res.status(404).json({
//         success: false,
//         message: "DOCX file not found",
//       });
//     }

//     const pdfPath = await convertDocxToPdf(docxPath);

//     return res.json({
//       success: true,
//       pdfFile: path.basename(pdfPath),
//       pdfUrl: `/generated/${path.basename(pdfPath)}`,
//     });
//   } catch (error) {
//     console.error("PDF CONVERT ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to convert DOCX to PDF",
//       error: error.message,
//     });
//   }
// });

// // =====================================================
// // START SERVER
// // =====================================================
// app.listen(PORT, () => {
//   console.log(
//     `Server running on http://localhost:${PORT}`
//   );
// });