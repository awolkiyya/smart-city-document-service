export interface ValidationError {
  field: string;
  message: string;
}

/**
 * =====================================================
 * GENERIC PAYLOAD VALIDATOR
 * (Reusable for Plan, Report, etc.)
 * =====================================================
 */
export const validatePayload = <T extends object>(
  body: Partial<T>,
  requiredFields: (keyof T)[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    const value = body[field];

    if (value === undefined || value === null || value === "") {
      errors.push({
        field: String(field),
        message: `${String(field)} is required`,
      });
    }
  }

  return errors;
};