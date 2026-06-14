import app from "./app";
import { env } from "./config/env";

import {
  TEMPLATE_DIR,
  GENERATED_DIR,
  ASSETS_DIR,
} from "./config/paths";

import { ensureDirectories } from "./utils/file";

/**
 * =====================================================
 * BOOTSTRAP DIRECTORIES
 * =====================================================
 */
try {
  ensureDirectories([
    TEMPLATE_DIR,
    GENERATED_DIR,
    ASSETS_DIR,
  ]);
} catch (error) {
  console.error("Failed to initialize directories:", error);
  process.exit(1);
}

/**
 * =====================================================
 * VALIDATE ENV (RAILWAY SAFE)
 * =====================================================
 */
const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : env.PORT;

/**
 * =====================================================
 * START SERVER (CRITICAL FOR RAILWAY)
 * =====================================================
 */
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// const server = app.listen(PORT, "10.41.238.73", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


/**
 * =====================================================
 * HANDLE UNHANDLED ERRORS
 * =====================================================
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

