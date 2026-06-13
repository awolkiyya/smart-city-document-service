import { Router } from "express";
import {
  uploadTemplateController,
  getTemplateController,
  deleteTemplateController,
} from "./controller";
import upload from "../../middleware/upload.middleware";


const router = Router();

router.post(
  "/upload",
  upload.single("file"),
  uploadTemplateController
);

router.get("/:type/:id", getTemplateController);

router.delete("/:type/:id", deleteTemplateController);

export default router;