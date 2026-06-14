import multer, { FileFilterCallback, MulterError } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_PATHS,
} from "../config/upload.config";
import { generateSafeFileName } from "../utils/fileName";

/**
 * =====================================
 * ENSURE DIRECTORY EXISTS
 * =====================================
 */
const ensureDir = (dir: string) => {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err: any) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
};

/**
 * =====================================
 * DESTINATION
 * =====================================
 */
const getDestination = (file: Express.Multer.File) => {
  if (file.mimetype.startsWith("image/")) {
    return UPLOAD_PATHS.IMAGES;
  }
  return UPLOAD_PATHS.DOCUMENTS;
};

/**
 * =====================================
 * STORAGE (DISK STORAGE - CORRECT)
 * =====================================
 */
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const dir = getDestination(file);
    ensureDir(dir);
    cb(null, dir);
  },

  filename: (req: Request, file, cb) => {
    const safeName = generateSafeFileName(file);
    cb(null, safeName);
  },
});

/**
 * =====================================
 * FILE FILTER
 * =====================================
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedExt = ["jpg", "jpeg", "png", "webp", "pdf", "docx"];

  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");

  const mimeValid = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extValid = allowedExt.includes(ext);

  if (!mimeValid || !extValid) {
    return cb(new Error("Unsupported file type"));
  }

  cb(null, true);
};

/**
 * =====================================
 * MULTER INSTANCE
 * =====================================
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * =====================================
 * ERROR HANDLER
 * =====================================
 */
export const multerErrorHandler = (err: any, req: Request, res: any, next: any) => {
  if (err instanceof MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

export default upload;