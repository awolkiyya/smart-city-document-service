import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,

  LIBREOFFICE_PATH:
    process.env.LIBREOFFICE_PATH ||
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
};