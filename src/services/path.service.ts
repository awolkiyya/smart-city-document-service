import path from "path";

import { GENERATED_DIR } from "../config/paths";

export class PathService {
  static generatedFile(fileName: string): string {
    return path.join(GENERATED_DIR, fileName);
  }
}