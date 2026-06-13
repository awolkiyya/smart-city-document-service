import { Request, Response, NextFunction } from "express";

import { ReportData, ReportPayload } from "../../types/report.types";
import { validatePayload } from "../../validators/document.validator";

import { LoggerService } from "../../services/logger.service";
import { buildReportTemplateData } from "../../services/templateBuilder/report.service";
import { PathService } from "../../services/path.service";
import { generateDocx } from "../../services/docx.service";

/**
 * =====================================================
 * GENERATE REPORT DOCUMENT
 * =====================================================
 */
export const generateReportDocumentController = async (
  req: Request<{}, {}, ReportPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * =================================================
     * REQUEST VALIDATION
     * =================================================
     */
    if (!req.body?.data) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: data is required",
      });
    }

    const reportData = req.body.data;

    /**
     * =================================================
     * FIELD VALIDATION
     * =================================================
     */
    const errors = validatePayload<ReportData>(reportData, [
      "cityName",
      "sectorName",
      "year",
      "kpis",
      "sections",
      "period",
      "name",
      "galmoota_tarsimaawa",
      "kayyoolee",
    ]);

    if (errors.length > 0) {
      LoggerService.warn("Report validation failed", {
        errors,
      });

      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    /**
     * =================================================
     * DEBUG INPUT DATA
     * =================================================
     */
    LoggerService.info("Incoming report payload", {
      reportTitle: reportData.reportTitle,
      sectorName: reportData.sectorName,
      cityName: reportData.cityName,
      periodType: reportData.period?.type,
      kpis: reportData.kpis?.length ?? 0,
    });

    console.log(
      "\n================ REPORT DATA ================\n"
    );
    console.log(
      JSON.stringify(reportData, null, 2)
    );

    /**
     * =================================================
     * BUILD TEMPLATE DATA
     * =================================================
     */
    const templateData =
      buildReportTemplateData(reportData);

    /**
     * =================================================
     * DEBUG TEMPLATE DATA
     * =================================================
     */
    console.log(
      "\n================ TEMPLATE DATA ================\n"
    );
    console.log(
      JSON.stringify(templateData, null, 2)
    );

    console.log(
      "\n================ PERIOD DATA ================\n"
    );
    console.log(
      JSON.stringify(
        (templateData as any).period,
        null,
        2
      )
    );

    // LoggerService.info("Template data built", {
    //   periodType: reportData.period.type,
    //   kpis: reportData.kpis.length,
    //   sections: Object.keys(
    //     reportData.sections || {}
    //   ).length,
    // });

    /**
     * =================================================
     * TEMPLATE PATH
     * =================================================
     */
    const type = req.body.type;

    const templatePath = PathService.template(
      type,
      req.body.file_path
    );

    // LoggerService.info("Template resolved", {
    //   templatePath,
    //   type,
    // });

    /**
     * =================================================
     * GENERATE DOCUMENT
     * =================================================
     */
    const result = await generateDocx(
      templateData,
      templatePath,
      type
    );

    LoggerService.info(
      "Report document generated successfully",
      {
        fileName: result.fileName,
      }
    );

    return res.status(201).json({
      success: true,
      data: {
        fileName: result.fileName,
        docxUrl: `/generated/${type}/docx/${result.fileName}`,
      }
    });
  } catch (error) {
    LoggerService.error(
      "Generate report document failed",
      error
    );

    next(error);
  }
};