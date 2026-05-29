import { ReportFrequency } from "../types/frequency.types";

export const FREQUENCY_RULES: Record<
  ReportFrequency,
  {
    label: string;
    allowedGrouping: "day" | "week" | "month" | "quarter" | "year";
    requiresDateRange: boolean;
  }
> = {
  DAILY: {
    label: "Daily Report",
    allowedGrouping: "day",
    requiresDateRange: true,
  },

  WEEKLY: {
    label: "Weekly Report",
    allowedGrouping: "week",
    requiresDateRange: true,
  },

  MONTHLY: {
    label: "Monthly Report",
    allowedGrouping: "month",
    requiresDateRange: true,
  },

  QUARTERLY: {
    label: "Quarterly Report",
    allowedGrouping: "quarter",
    requiresDateRange: true,
  },

  YEARLY: {
    label: "Yearly Report",
    allowedGrouping: "year",
    requiresDateRange: false,
  },
  CUSTOME: {
    label: "",
    allowedGrouping: "day",
    requiresDateRange: false
  }
};