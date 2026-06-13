import { DocumentType } from "../services/path.service";
import { Activity, MainObjective, Workflow } from "./plan.types";

/**
 * =====================================================
 * REPORT PAYLOAD
 * =====================================================
 */
export interface ReportPayload {
  data: ReportData;

  file_path: string;

  type: DocumentType;

  template_version?: string;
}

/**
 * =====================================================
 * REPORT DATA
 * =====================================================
 */
export interface ReportData {
  reportTitle: string;

  sectorName: string;

  cityName: string;

  subcity?: string;

  wereda?: string;

  year: number;

  previous_year?: number;

  name:string;

  /**
   * =====================================================
   * PERIOD
   * =====================================================
   */
  period: ReportPeriod;

  /**
   * =====================================================
   * DYNAMIC REPORT SECTIONS
   * =====================================================
   */
  sections: Record<string, string>;

  /**
   * =====================================================
   * KPI SUMMARY
   * =====================================================
   */
  kpis: KPI[];

  /**
   * =====================================================
   * PLANNING STRUCTURE
   * =====================================================
   */
  galmoota_tarsimaawa?: MainObjective[];

  kayyoolee?: Activity[];
   /**
     * =====================================================
     * WORKFLOW (NEW)
     * =====================================================
     */
   workflow?: Workflow;

}

/**
 * =====================================================
 * PERIOD
 * =====================================================
 */
export interface ReportPeriod {
  /**
   * Period Type
   */
  type:
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "QUARTERLY"
    | "SEMI_ANNUAL"
    | "CUSTOM"
    | "YEARLY";

  /**
   * Human readable label
   * Example:
   *  - Caamsaa 2018
   *  - Kurmaana 1ffaa
   */
  label: string;

  /**
   * Short summary
   * Example:
   *  - Ji'a 1
   *  - Kurmaana
   */
  summary: string;

  /**
   * Quarterly Metadata
   */
  kurmaana?: KurmaanaInfo | null;

  /**
   * Date Range
   */
  range: PeriodRange;

  /**
   * Business Metadata
   */
  meta: PeriodMeta;
}

export interface KurmaanaInfo {
  value?: number;
  code?: string;
  label?: string;
  months?: string[];
}

export interface PeriodRange {
  start: PeriodDate;
  end: PeriodDate;
}

export interface PeriodMeta {
  frequency: string;
  duration_days: number;
}

/**
 * =====================================================
 * PERIOD DATE
 * =====================================================
 */
export interface PeriodDate {
  date: string;

  dayName: string;

  dayNumber: number;

  monthName: string;

  year: number;
}

/**
 * =====================================================
 * KPI
 * =====================================================
 */
export interface KPI {
  id: string;

  indicator: string;

  weight: number;

  unit: string;

  baseline: number;

  annual_target: number;

  period_target: number;

  achieved: number;

  progress: number;
}
