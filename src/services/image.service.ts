import fs from "fs";

import ImageModule from "docxtemplater-image-module-free";

import { imageSize } from "image-size";
import { LoggerService } from "./logger.service";


export interface ImageDimension {
  width: number;
  height: number;
}

const DEFAULT_IMAGE_SIZE: ImageDimension = {
  width: 120,
  height: 120,
};

const MAX_IMAGE_WIDTH = 120;

export const imageOptions = {
  centered: true,

  /**
   * =====================================================
   * LOAD IMAGE
   * =====================================================
   */
  getImage(tagValue: string): Buffer | null {
    try {
      // ===============================================
      // VALIDATE INPUT
      // ===============================================
      if (!tagValue) {
        LoggerService .warn(
          "Image tag value is empty"
        );

        return null;
      }

      // ===============================================
      // FILE EXISTS
      // ===============================================
      if (!fs.existsSync(tagValue)) {
        LoggerService.warn(
          `Image file not found: ${tagValue}`
        );

        return null;
      }

      // ===============================================
      // READ IMAGE
      // ===============================================
      const imageBuffer =
        fs.readFileSync(tagValue);

      LoggerService.info(
        "Image loaded successfully",
        {
          path: tagValue,
        }
      );

      return imageBuffer;
    } catch (error) {
      LoggerService.error(
        "Failed to load image",
        error
      );

      return null;
    }
  },

  /**
   * =====================================================
   * CALCULATE IMAGE SIZE
   * =====================================================
   */
  getSize(imgBuffer: Buffer): [
    number,
    number
  ] {
    try {
      // ===============================================
      // READ IMAGE DIMENSIONS
      // ===============================================
      const dimensions =
        imageSize(imgBuffer);

      const width =
        dimensions.width ||
        DEFAULT_IMAGE_SIZE.width;

      const height =
        dimensions.height ||
        DEFAULT_IMAGE_SIZE.height;

      // ===============================================
      // MAINTAIN ASPECT RATIO
      // ===============================================
      const calculatedHeight = Math.round(
        (height / width) * MAX_IMAGE_WIDTH
      );

      return [
        MAX_IMAGE_WIDTH,
        calculatedHeight,
      ];
    } catch (error) {
      LoggerService.error(
        "Failed to calculate image dimensions",
        error
      );

      return [
        DEFAULT_IMAGE_SIZE.width,
        DEFAULT_IMAGE_SIZE.height,
      ];
    }
  },
};

/**
 * =====================================================
 * DOCXTEMPLATER IMAGE MODULE
 * =====================================================
 */
export const imageModule = new ImageModule(
  imageOptions
);