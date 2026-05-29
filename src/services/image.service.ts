import fs from "fs";
import ImageModule from "docxtemplater-image-module-free";
import { imageSize } from "image-size";
import { LoggerService } from "./logger.service";

/**
 * =====================================================
 * IMAGE CACHE (SAFE GLOBAL MEMORY CACHE)
 * =====================================================
 */
const imageCache = new Map<string, Buffer>();
const MAX_CACHE_SIZE = 200;

/**
 * Evict oldest entry when cache is full (simple FIFO)
 */
function setCache(key: string, value: Buffer) {
  if (imageCache.has(key)) return;

  if (imageCache.size >= MAX_CACHE_SIZE) {
    const firstKey = imageCache.keys().next().value;
    if (firstKey) imageCache.delete(firstKey);
  }

  imageCache.set(key, value);
}

/**
 * =====================================================
 * IMAGE MODULE FACTORY (MUST BE PER REQUEST)
 * =====================================================
 */
export const createImageModule = () => {
  const imageOptions = {
    centered: true,

    /**
     * =====================================================
     * LOAD IMAGE (WITH CACHE)
     * =====================================================
     */
    getImage(tagValue: string): Buffer | null {
      try {
        if (!tagValue) {
          LoggerService.warn("Image tag value is empty");
          return null;
        }

        /**
         * =====================================================
         * CACHE HIT
         * =====================================================
         */
        const cached = imageCache.get(tagValue);
        if (cached) {
          LoggerService.info("Image cache hit", { path: tagValue });
          return cached;
        }

        /**
         * =====================================================
         * VALIDATE FILE
         * =====================================================
         */
        if (!fs.existsSync(tagValue)) {
          LoggerService.warn(`Image file not found: ${tagValue}`);
          return null;
        }

        /**
         * =====================================================
         * READ FILE
         * =====================================================
         */
        const imageBuffer = fs.readFileSync(tagValue);

        /**
         * =====================================================
         * STORE IN CACHE
         * =====================================================
         */
        setCache(tagValue, imageBuffer);

        LoggerService.info("Image cached successfully", {
          path: tagValue,
        });

        return imageBuffer;
      } catch (error) {
        LoggerService.error("Failed to load image", error);
        return null;
      }
    },

    /**
     * =====================================================
     * CALCULATE IMAGE SIZE
     * =====================================================
     */
    getSize(imgBuffer: Buffer): [number, number] {
      try {
        const dimensions = imageSize(imgBuffer);

        const width = dimensions.width || 120;
        const height = dimensions.height || 120;

        const maxWidth = 120;
        const calculatedHeight = Math.round(
          (height / width) * maxWidth
        );

        return [maxWidth, calculatedHeight];
      } catch (error) {
        LoggerService.error(
          "Failed to calculate image dimensions",
          error
        );

        return [120, 120];
      }
    },
  };

  /**
   * IMPORTANT:
   * New instance per DOCX generation (NO reuse)
   */
  return new ImageModule(imageOptions);
};