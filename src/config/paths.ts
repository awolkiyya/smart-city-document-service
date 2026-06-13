import path from "path";

export const ROOT_DIR = process.cwd();

export const TEMPLATE_DIR = path.join(ROOT_DIR, "templates");
export const GENERATED_DIR = path.join(ROOT_DIR, "generated"); // ✅ FIXED
export const ASSETS_DIR = path.join(ROOT_DIR, "assets");

// export const TEMPLATE_PATH = path.join(TEMPLATE_DIR, "plan_template.docx");

export const DEFAULT_LOGO = path.join(ASSETS_DIR, "logo.png");