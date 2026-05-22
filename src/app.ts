import express from "express";
import cors from "cors";

import documentRoutes from "./routes/document.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import path from "path";


const app = express();

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

app.use(
  "/generated",
  express.static(
    path.join(__dirname, "../generated")
  )
);

/**
 * =====================================================
 * GLOBAL ERROR HANDLER (MUST BE LAST)
 * =====================================================
 */
app.use(errorMiddleware);

export default app;