export const UPLOAD_PATHS = {
    IMAGES: "uploads/images",
    DOCUMENTS: "uploads/documents",
  };
  
  export const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB