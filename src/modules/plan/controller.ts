import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

import { PlanData, PlanPayload } from "../../types/plan.types";
import { validatePayload } from "../../validators/document.validator";
import { generateDocx } from "../../services/docx.service";
import { LoggerService } from "../../services/logger.service";
import { PathService } from "../../services/path.service";
import { buildPlanTemplateData } from "../../services/templateBuilder/plan.service";


/**
 * =====================================================
 * GENERATE DOCX (PLAN)
 * =====================================================
 */
export const generatePlanDocumentController = async (
  req: Request<{}, {}, PlanPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * =================================================
     * SAFE GUARD
     * =================================================
     */
    if (!req.body?.data) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: data is required",
      });
    }

    const planData = req.body.data;
    console.log(planData);

    /**
     * =================================================
     * VALIDATION
     * =================================================
     */
    const errors = validatePayload<PlanData>(planData, [
      "cityName",
      "sectorName",
      "year",
      "kpis",
      "galmoota_tarsimawa",
      "kayyoolee",
      "galma",
      "rawwi",
      "sections",
      "name"
    ]);

    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    console.log(planData);

    /**
     * =================================================
     * BUILD TEMPLATE DATA
     * =================================================
     */
    const templateData = buildPlanTemplateData(planData);

    /**
     * =================================================
     * RESOLVE TEMPLATE PATH (FROM CLIENT file_path)
     * =================================================
     */
    const type = req.body.type;
    const templatePath = PathService.template(type,req.body.file_path);

    LoggerService.info("Template resolved", {
      templatePath,
    });

    /**
     * =================================================
     * GENERATE DOCX
     * =================================================
     */
    const result = await generateDocx(
      templateData,
      templatePath,
      type
    );

    /**
     * =================================================
     * RESPONSE
     * =================================================
     */
    return res.status(201).json({
      success: true,
      data: {
        fileName: result.fileName,
        docxUrl: `/generated/${type}/docx/${result.fileName}`
      }
    });

  } catch (error: any) {
    LoggerService.error("Generate document failed", {
      error: error?.message,
      stack: error?.stack,
      body: req.body,
    });

    next(error);
  }
};