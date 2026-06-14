import path from "path";

const BASE_UPLOAD_DIR = process.env.STORAGE_PATH || "/app/storage";

export const UPLOAD_PATHS = {
  IMAGES: path.join(BASE_UPLOAD_DIR, "images"),
  DOCUMENTS: path.join(BASE_UPLOAD_DIR, "documents"),
};
  
  export const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB