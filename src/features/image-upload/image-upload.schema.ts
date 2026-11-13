export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateImageFile(file: { type: string; size: number }): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { ok: false, error: "Only JPG, PNG, WEBP or GIF images are allowed." };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { ok: false, error: "Image must be 5 MB or smaller." };
  }
  return { ok: true };
}

export type UploadedImage = {
  imageKey: string;
  imageUrl: string;
};
