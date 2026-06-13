import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { PathService, DocumentType } from "../../services/path.service";

type UploadFile = Express.Multer.File;

export class TemplateService {
  async upload(file: UploadFile, type: DocumentType) {
    if (!file) {
      throw new Error("Template file is required");
    }

    const id = uuid();
    const extension = path.extname(file.originalname);
    const fileName = `${id}${extension}`;

    const filePath = PathService.template(type, fileName);
    const dir = path.dirname(filePath);

    // ensure directory exists
    await fs.promises.mkdir(dir, { recursive: true });

    /**
     * ✅ FIX: use rename (NOT file.buffer)
     * because we use diskStorage
     */
    await fs.promises.rename(file.path, filePath);

    return {
      template_id: id,
      type,
      file_name: fileName,
      path: `/templates/${type}/${fileName}`,
    };
  }

  async get(type: DocumentType, id: string) {
    const dir = path.join(process.cwd(), "templates", type);

    const files = await fs.promises.readdir(dir);
    const file = files.find((f) => f.startsWith(id));

    if (!file) {
      throw new Error("Template not found");
    }

    return {
      template_id: id,
      type,
      file_name: file,
      path: `/templates/${type}/${file}`,
    };
  }

  async delete(type: DocumentType, id: string) {
    const dir = path.join(process.cwd(), "templates", type);

    const files = await fs.promises.readdir(dir);
    const file = files.find((f) => f.startsWith(id));

    if (!file) {
      throw new Error("Template not found");
    }

    await fs.promises.unlink(path.join(dir, file));

    return {
      success: true,
      template_id: id,
      type,
    };
  }
}