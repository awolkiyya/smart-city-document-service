import { Request, Response, NextFunction } from "express";

import { PlanPayload } from "../types/plan.types";

import { validatePayload } from "../validators/document.validator";



import { convertDocxToPdf } from "../services/pdf.service";


import { LoggerService } from "../services/logger.service";
import { buildTemplateData } from "../services/template.service";
import { PathService } from "../services/path.service";
import { generateDocx } from "../services/docx.service";
import { ReportPayload } from "../types/report.types";
import path from "path";

/**
 * =====================================================
 * HEALTH CHECK
 * =====================================================
 */
export const healthCheckController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    message: "Document service is running",
  });
};

/**
 * =====================================================
 * GENERATE DOCX
 * =====================================================
 */
export const generatePlanDocumentController = async (
  req: Request<{}, {}, PlanPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    // =================================================
    // VALIDATION
    // =================================================
    const errors = validatePayload(req.body);

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // =================================================
    // BUILD TEMPLATE DATA
    // =================================================
    const templateData = buildTemplateData(req.body);

    // =================================================
    // GENERATE DOCX
    // =================================================
    const result = await generateDocx(templateData);
    

    // =================================================
    // RESPONSE
    // =================================================
    return res.status(201).json({
      success: true,
      fileName: result.fileName,
      docxUrl: `/generated/${result.fileName}`,
    });
  } catch (error) {
    LoggerService.error(
      "Generate document failed",
      error
    );

    next(error);
  }
};



/**
 * =====================================================
 * GENERATE DOCX
 * =====================================================
 */
// export const generateReportDocumentController = async (
//   req: Request<{}, {}, ReportPayload>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // =================================================
//     // VALIDATION
//     // =================================================
//     const errors = validatePayload(req.body);

//     if (errors.length > 0) {
//       return res.status(422).json({
//         success: false,
//         message: "Validation failed",
//         errors,
//       });
//     }

//     // =================================================
//     // BUILD TEMPLATE DATA
//     // =================================================
//     const templateData = buildTemplateData(req.body);

//     // =================================================
//     // GENERATE DOCX
//     // =================================================
//     const result = await generateDocx(templateData);

//     // =================================================
//     // RESPONSE
//     // =================================================
//     return res.status(201).json({
//       success: true,
//       fileName: result.fileName,
//       fileUrl: `/generated/${result.fileName}`,
//     });
//   } catch (error) {
//     LoggerService.error(
//       "Generate document failed",
//       error
//     );

//     next(error);
//   }
// };


// generate report

/**
 * =====================================================
 * CONVERT DOCX → PDF this is commen for both plan and report
 * =====================================================
 */
export const convertPdfController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "fileName is required",
      });
    }

    // =================================================
    // GET FILE PATH
    // =================================================
    const docxPath =
      PathService.generatedFile(fileName);

    // =================================================
    // CONVERT TO PDF
    // =================================================
    const pdfResult = await convertDocxToPdf(docxPath);

    const file = path.basename(pdfResult);
    
    return res.status(200).json({
      success: true,
      pdfFile: file,
      pdfUrl: `/generated/${file}`,
    });
  } catch (error) {
    LoggerService.error(
      "PDF conversion failed",
      error
    );

    next(error);
  }
};