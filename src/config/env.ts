import dotenv from "dotenv";

dotenv.config();

/**
 * =====================================================
 * SAFE NUMBER PARSER
 * =====================================================
 */
const toNumber = (value: unknown, fallback: number): number => {
  const n = Number(value);

  if (Number.isFinite(n)) {
    return n;
  }

  return fallback;
};

/**
 * =====================================================
 * ENV CONFIG
 * =====================================================
 */
export const env = {
  /**
   * Server Port
   * Railway always injects PORT as string
   */
  PORT: toNumber(process.env.PORT, 3000),

  /**
   * LibreOffice path (Docker / Railway Linux)
   * NEVER use macOS path in production
   */
  LIBREOFFICE_PATH:
    process.env.LIBREOFFICE_PATH ||
    "/usr/bin/soffice",
};