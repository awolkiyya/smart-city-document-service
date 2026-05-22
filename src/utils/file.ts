import fs from "fs";

export const ensureDirectories = (
  directories: string[]
): void => {
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
  });
};