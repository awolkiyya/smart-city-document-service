import { PlanPayload } from "../types/plan.types";

export interface ValidationError {
  field: string;
  message: string;
}

export const validatePayload = (
  body: Partial<PlanPayload>
): ValidationError[] => {
  const requiredFields: (keyof PlanPayload)[] = [
    "cityName",
    "sectorName",
    "year",
    "month",
    // "seensa",
    // "kaayyoo",
  ];

  const errors: ValidationError[] = [];

  requiredFields.forEach((field) => {
    const value = body[field];

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      errors.push({
        field,
        message: `${field} is required`,
      });
    }
  });

  // ✅ REQUIRED RETURN (this fixes TS2355)
  return errors;
};