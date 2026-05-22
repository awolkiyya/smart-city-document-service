import fs from "fs";

import { PlanPayload, Objective, Activity, KPI } from "../types/plan.types";

import { DEFAULT_LOGO } from "../config/paths";

import {
  cleanValue,
  safeArray,
  safeString,
} from "../utils/safe";
import { LoggerService } from "./logger.service";


export interface TemplateData {
  [key: string]: unknown;
}

export const buildTemplateData = (
  body: PlanPayload
): TemplateData => {
  try {
    // =====================================================
    // LOCATION
    // =====================================================
    const locationText = [
      cleanValue(body.cityName),
      cleanValue(body.subcity),
      cleanValue(body.wereda),
    ]
      .filter(Boolean)
      .join("/");

    // =====================================================
    // LOGO
    // =====================================================
    const logoExists = fs.existsSync(DEFAULT_LOGO);

    // =====================================================
    // SAFE STRUCTURES (IMPORTANT FIX)
    // =====================================================
    const objectives = safeArray<Objective>(body.objectives);

    // =====================================================
    // TEMPLATE DATA
    // =====================================================
    const templateData: TemplateData = {
      locationText,
      logo: logoExists ? DEFAULT_LOGO : null,

      // BASIC INFO
      cityName: safeString(body.cityName),
      sectorName: safeString(body.sectorName),
      year: safeString(body.year),
      month: safeString(body.month),

      subcity: safeString(body.subcity),
      wereda: safeString(body.wereda),

      planName: safeString(body.planName),
      yeero: safeString(body.yeero),
      rawwi: safeString(body.rawwi),
      galma: safeString(body.galma),

      // CONTENT
      seensa: safeString(body.seensa),
      kaayyoo: safeString(body.kaayyoo),
      galmoota: safeString(body.galmoota),

      xiinxala_raawwii_waggota_darbanii: safeString(
        body.xiinxala_raawwii_waggota_darbanii
      ),

      toora_xiyyeeffannoo: safeString(body.toora_xiyyeeffannoo),

      tooftaa_raawwii: safeString(body.tooftaa_raawwii),

      rakkowwan: safeString(body.rakkowwan),

      mulata_ergama_duudhaalee: safeString(body.mulata_ergama_duudhaalee),

      xumura: safeString(body.xumura),

      // =====================================================
      // OBJECTIVES → ACTIVITIES → KPI (FULL TYPE SAFE)
      // =====================================================
      objectives: objectives.map((objective: Objective) => {
        const activities = safeArray<Activity>(objective.activities);

        return {
          id: safeString(objective.id),
          title: safeString(objective.title),
          weight: Number(objective.weight) || 0,

          activities: activities.map((activity: Activity) => {
            const kpis = safeArray<KPI>(activity.kpis);

            return {
              id: safeString(activity.id),
              title: safeString(activity.title),
              weight: Number(activity.weight) || 0,

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
                };
              }),
            };
          }),
        };
      }),
    };

    // =====================================================
    // LOG
    // =====================================================
    LoggerService.info("Template data built successfully", {
      objectives: objectives.length,
    });

    return templateData;
  } catch (error) {
    LoggerService.error("Failed to build template data", error);

    throw new Error("Template data mapping failed");
  }
};