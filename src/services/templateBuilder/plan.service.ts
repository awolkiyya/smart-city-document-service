import fs from "fs";
import { Activity, KPI, MainObjective, PlanData } from "../../types/plan.types";
import { cleanValue, safeArray, safeString } from "../../utils/safe";
import { DEFAULT_LOGO } from "../../config/paths";
import { LoggerService } from "../logger.service";


export interface TemplateData {
  [key: string]: unknown;
}

/**
 * =====================================================
 * BUILD TEMPLATE DATA (PLAN)
 * =====================================================
 * - Flattens dynamic sections into root level
 * - Safe transformations
 * - Template-friendly structure (no nesting)
 * =====================================================
 */
export const buildPlanTemplateData = (body: PlanData): TemplateData => {
  try {
    /**
     * =====================================================
     * LOCATION STRING
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
     * SAFE KPI ARRAY
     * =====================================================
     */
    const kpis = safeArray<KPI>(body.kpis);


    /**
     * =====================================================
     * SAFE GALMOTA TARSIMAWAA
     * =====================================================
     */

    const galmoota_tarsimawa = safeArray<MainObjective>(body.galmoota_tarsimawa).map(
      (item) => ({
        title: safeString(item.title),
      })
    );

    /**
     * =====================================================
     * SAFE KAYYOOLEE
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
     * FLATTEN DYNAMIC SECTIONS (IMPORTANT CHANGE)
     * =====================================================
     * Instead of:
     *   sections.seensa
     * We produce:
     *   seensa
     *   kaayyoo
     *   galma
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
     * TEMPLATE DATA OBJECT
     * =====================================================
     */
    const templateData: TemplateData = {
      /**
       * CORE INFO
       */
      locationText,
      logo: logoExists ? DEFAULT_LOGO : null,
    
      cityName: safeString(body.cityName),
      sectorName: safeString(body.sectorName),
      year: safeString(body.year),
      month: safeString(body.month),
    
      subcity: safeString(body.subcity),
      wereda: safeString(body.wereda),
    
      planName: safeString(body.planName),
      rawwi: safeString(body.rawwi),
      galma: safeString(body.galma),
      name: safeString(body.name),
    
      /**
       * STATIC STRUCTURES
       */
      galmoota_tarsimawa,
      kayyoolee,
    
      /**
       * WORKFLOW (NEW - FLATTENED FOR DOCX)
       */
      prepared: safeString(workflow.prepared),
      approved: safeString(workflow.approved),
      verified: safeString(workflow.verified),
    
      p_date: safeString(workflow.p_date),
      a_date: safeString(workflow.a_date),
      v_date: safeString(workflow.v_date),
    
      /**
       * DYNAMIC SECTIONS
       */
      ...dynamicSections,
    
      /**
       * KPI DATA
       */
      kpis: kpis.map((kpi: KPI) => {
        const q1 = Number(kpi.q1) || 0;
        const q2 = Number(kpi.q2) || 0;
        const q3 = Number(kpi.q3) || 0;
        const q4 = Number(kpi.q4) || 0;
    
        const target = Number(kpi.target) || 0;
    
        const totalExecution = q1 + q2 + q3 + q4;
    
        const achievement =
          target > 0
            ? Number(((totalExecution / target) * 100).toFixed(2))
            : 0;
    
        return {
          id: safeString(kpi.id),
          indicator: safeString(kpi.indicator),
          weight: Number(kpi.weight) || 0,
          unit: safeString(kpi.unit),
    
          baseline: Number(kpi.baseline) || 0,
          target,
    
          q1,
          q2,
          q3,
          q4,
    
          totalExecution,
          achievement,
          yeero: safeString(kpi.yeero),
        };
      }),
    };

    /**
     * =====================================================
     * LOGGING
     * =====================================================
     */
    LoggerService.info("Template data built successfully", {
      kpis: kpis.length,
      dynamicFields: Object.keys(dynamicSections).length,
    });

    return templateData;

  } catch (error) {
    LoggerService.error("Failed to build template data", error);
    throw new Error("Template data mapping failed");
  }
};