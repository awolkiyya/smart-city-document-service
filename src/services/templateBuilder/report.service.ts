import fs from "fs";
import { KPI, ReportData } from "../../types/report.types";
import { cleanValue, safeArray, safeString } from "../../utils/safe";
import { DEFAULT_LOGO } from "../../config/paths";
import { LoggerService } from "../logger.service";
import { Activity, MainObjective } from "../../types/plan.types";

export interface TemplateData {
  [key: string]: unknown;
}

/**
 * =====================================================
 * FLATTEN HELPER
 * =====================================================
 */
const flatten = (
  obj: Record<string, unknown>,
  prefix = "",
  result: Record<string, unknown> = {}
): Record<string, unknown> => {
  for (const [key, value] of Object.entries(obj)) {
    const flatKey = prefix ? `${prefix}.${key}` : key;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      flatten(value as Record<string, unknown>, flatKey, result);
    } else {
      result[flatKey] = value;
    }
  }
  return result;
};

/**
 * =====================================================
 * BUILD TEMPLATE DATA (REPORT)
 * =====================================================
 */
export const buildReportTemplateData = (
  body: ReportData
): TemplateData => {
  try {
    /**
     * =====================================================
     * LOCATION
     * =====================================================
     */
    const locationText = [
      cleanValue(body.cityName),
      cleanValue(body.subcity),
      cleanValue(body.wereda),
    ]
      .filter(Boolean)
      .join("/");

    /**
     * =====================================================
     * LOGO CHECK
     * =====================================================
     */
    const logoExists = fs.existsSync(DEFAULT_LOGO);

    /**
     * =====================================================
     * PERIOD — BUILD THEN FLATTEN
     * =====================================================
     */
    const periodNested = {
      type: safeString(body.period?.type),
      label: safeString(body.period?.label),
      summary: safeString(body.period?.summary),
      frequency: safeString(body.period?.meta?.frequency),
      duration_days: Number(body.period?.meta?.duration_days) || 0,
    
      kurmaana: {
        value: Number(body.period?.kurmaana?.value) || 0,
        code: safeString(body.period?.kurmaana?.code),
        label: safeString(body.period?.kurmaana?.label),
    
        months: Array.isArray(body.period?.kurmaana?.months)
          ? body.period.kurmaana.months.map((m: any) => safeString(m))
          : [],
      },
    
      start: {
        date: safeString(body.period?.range?.start?.date),
        dayName: safeString(body.period?.range?.start?.dayName),
        dayNumber: Number(body.period?.range?.start?.dayNumber) || 0,
        monthName: safeString(body.period?.range?.start?.monthName),
        year: Number(body.period?.range?.start?.year) || 0,
      },
    
      end: {
        date: safeString(body.period?.range?.end?.date),
        dayName: safeString(body.period?.range?.end?.dayName),
        dayNumber: Number(body.period?.range?.end?.dayNumber) || 0,
        monthName: safeString(body.period?.range?.end?.monthName),
        year: Number(body.period?.range?.end?.year) || 0,
      },
    };

    // Produces: { "period.type": "DAILY", "period.start.date": "...", ... }
    const flatPeriod = flatten(
      periodNested as Record<string, unknown>,
      "period"
    );

    /**
     * =====================================================
     * KPI TRANSFORMATION
     * =====================================================
     */
    const kpis = safeArray<KPI>(body.kpis).map((kpi) => {
      const achieved = Number(kpi.achieved) || 0;
      const target = Number(kpi.annual_target) || 0;
      const progress = Number(kpi.progress) || 0;

      return {
        id: safeString(kpi.id),
        indicator: safeString(kpi.indicator),
        weight: Number(kpi.weight) || 0,
        unit: safeString(kpi.unit),
        baseline: Number(kpi.baseline) || 0,
        annual_target: target,
        period_target: Number(kpi.period_target) || 0,
        achieved,
        progress,
      };
    });

    /**
     * =====================================================
     * OBJECTIVES
     * =====================================================
     */
    const galmoota_tarsimaawa = safeArray<MainObjective>(
      body.galmoota_tarsimaawa
    ).map((item) => ({
      title: safeString(item.title),
    }));

    /**
     * =====================================================
     * ACTIVITIES
     * =====================================================
     */
    const kayyoolee = safeArray<Activity>(body.kayyoolee).map(
      (item) => ({
        title: safeString(item.title),
      })
    );


    const workflow = body.workflow || {};


    /**
     * =====================================================
     * DYNAMIC SECTIONS
     * =====================================================
     */
    const dynamicSections = Object.entries(body.sections || {}).reduce(
      (acc, [key, value]) => {
        acc[key] = safeString(value);
        return acc;
      },
      {} as Record<string, string>
    );

    /**
     * =====================================================
     * FINAL TEMPLATE OBJECT (FULLY FLAT)
     * =====================================================
     */
    const templateData: TemplateData = {

      // CORE INFO
      locationText,
      logo: logoExists ? DEFAULT_LOGO : null,
      cityName: safeString(body.cityName),
      sectorName: safeString(body.sectorName),
      subcity: safeString(body.subcity),
      wereda: safeString(body.wereda),
      reportTitle: safeString(body.reportTitle),
      year: Number(body.year),
      previous_year: body.previous_year ?? null,
      name: safeString(body.name),

      // PERIOD (flat keys: period.type, period.start.date, etc.)
      ...flatPeriod,

      // STRUCTURES (arrays — Docxtemplater loops handle these)
      galmoota_tarsimaawa,
      kayyoolee,
      kpis,

      /**
       * WORKFLOW (NEW - FLATTENED FOR DOCX)
       */
      prepared: safeString(workflow.prepared),
      approved: safeString(workflow.approved),
      verified: safeString(workflow.verified),
    
      p_date: safeString(workflow.p_date),
      a_date: safeString(workflow.a_date),
      v_date: safeString(workflow.v_date),

      // DYNAMIC SECTIONS
      ...dynamicSections,
    };

    /**
     * =====================================================
     * LOGGING
     * =====================================================
     */
    LoggerService.info("Report template built successfully", {
      kpis: kpis.length,
      dynamicFields: Object.keys(dynamicSections).length,
      flatPeriodKeys: Object.keys(flatPeriod),
    });

    return templateData;
  } catch (error) {
    LoggerService.error("Failed to build report template", error);
    throw new Error("Report template mapping failed");
  }
};