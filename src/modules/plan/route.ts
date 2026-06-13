import { Router } from "express";
import { generatePlanDocumentController } from "./controller";

const router = Router();

router.post("/generate", generatePlanDocumentController);
// router.post("/templates", storePlanTemplateController);

export default router;