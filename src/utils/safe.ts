export const safeString = (value: unknown): string => {
    if (value === undefined || value === null) {
      return "";
    }
  
    return String(value);
  };
  
 // utils/safe.ts
    export const safeArray = <T>(value: unknown): T[] => {
        return Array.isArray(value) ? (value as T[]) : [];
    };
  
  export const cleanValue = (
    value: unknown
  ): string | null => {
    if (value === undefined || value === null) {
      return null;
    }
  
    const cleaned = String(value).trim();
  
    if (
      cleaned === "" ||
      cleaned.toLowerCase() === "null" ||
      cleaned.toLowerCase() === "undefined"
    ) {
      return null;
    }
  
    return cleaned;
  };

  