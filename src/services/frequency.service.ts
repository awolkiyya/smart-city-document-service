import { ReportFrequency } from "../types/frequency.types";
import { FREQUENCY_RULES } from "../config/frequency.rules";

export const getFrequencyConfig = (frequency: ReportFrequency) => {
  const config = FREQUENCY_RULES[frequency];

  if (!config) {
    throw new Error(`Invalid frequency: ${frequency}`);
  }

  return config;
};