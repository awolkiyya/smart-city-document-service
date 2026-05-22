// src/services/logger.service.ts

export class LoggerService {
    static info(message: string, data?: unknown) {
      console.log("[INFO]", message, data || "");
    }
  
    static error(message: string, error?: unknown) {
      console.error("[ERROR]", message, error || "");
    }
  
    static warn(message: string, data?: unknown) {
      console.warn("[WARN]", message, data || "");
    }
  }