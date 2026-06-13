import { Request, Response } from "express";
import { TemplateService } from "./service";
import { TemplateType } from "../../types/commens";

const service = new TemplateService();

/**
 * =====================================================
 * UPLOAD TEMPLATE
 * =====================================================
 */

type UploadRequest = Request<
  {},
  any,
  { type: TemplateType }
> & {
  file?: Express.Multer.File;
};

/**
 * =====================================================
 * UPLOAD TEMPLATE
 * =====================================================
 */

export const uploadTemplateController = async (
  req: UploadRequest,
  res: Response
) => {
  try {
    const file = req.file;
    const type = req.body.type;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Template file is required",
      });
    }

    if (type !== "plan" && type !== "report") {
      return res.status(400).json({
        success: false,
        message: "Invalid template type",
      });
    }

    const result = await service.upload(file, type);

    return res.status(201).json({
      success: true,
      message: "Template uploaded successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * =====================================================
 * GET TEMPLATE
 * =====================================================
 */

type GetRequest = Request<{
  type: TemplateType;
  id: string;
}>;

export const getTemplateController = async (
  req: GetRequest,
  res: Response
) => {
  const { type, id } = req.params;

  const result = await service.get(type, id);

  return res.json(result);
};

/**
 * =====================================================
 * DELETE TEMPLATE
 * =====================================================
 */

type DeleteRequest = Request<{
  type: TemplateType;
  id: string;
}>;

export const deleteTemplateController = async (
  req: DeleteRequest,
  res: Response
) => {
  const { type, id } = req.params;

  const result = await service.delete(type, id);

  return res.json(result);
};