import { Router } from "express";
import { generateReportDocumentController } from "./controller";


const router = Router();

router.post("/generate", generateReportDocumentController);
// router.post("/templates", storeReportTemplateController);

export default router;