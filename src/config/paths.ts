import path from "path";

/**
 * =========================
 * DYNAMIC STORAGE (VOLUME)
 * =========================
 */
const STORAGE_DIR = process.env.STORAGE_PATH || "/app/storage";

export const ROOT_DIR = STORAGE_DIR;

export const TEMPLATE_DIR = path.join(STORAGE_DIR, "templates");
export const GENERATED_DIR = path.join(STORAGE_DIR, "generated");
export const UPLOAD_DIR = path.join(STORAGE_DIR, "uploads");


/**
 * =========================
 * STATIC ASSETS (DO NOT MOVE)
 * =========================
 */
const APP_DIR = process.cwd(); // or "/app" (both OK in Docker)

export const ASSETS_DIR = path.join(APP_DIR, "assets");

export const DEFAULT_LOGO = path.join(ASSETS_DIR, "logo.png");