import express from "express";
import cors from "cors";
import morgan from "morgan";


import documentRoutes from "./routes/document.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { GENERATED_DIR, UPLOAD_DIR } from "./config/paths";



const app = express();

app.use(morgan("combined")); // ← HERE
app.use(cors());

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use("/api/documents", documentRoutes);

/**
 * =====================================================
 * HEALTH CHECK
 * =====================================================
 */
app.get("/", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Plan document service running",
  });
});



app.use("/generated", express.static(GENERATED_DIR));
app.use("/uploads", express.static(UPLOAD_DIR));

/**
 * =====================================================
 * GLOBAL ERROR HANDLER (MUST BE LAST)
 * =====================================================
 */
app.use(errorMiddleware);

export default app;