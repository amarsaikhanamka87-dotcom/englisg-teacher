import "server-only";
import { getImagesBucket } from "@/lib/images-bucket";
import type { UploadedImage } from "./image-upload.schema";

const FLASHCARD_IMAGE_FOLDER = "flashcards";

/** Images are served by our own route (src/app/images/[...imageKey]) straight from R2. */
const IMAGE_ROUTE_PREFIX = "/images";

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function getImagePublicUrl(imageKey: string): string {
  return `${IMAGE_ROUTE_PREFIX}/${imageKey}`;
}

export async function uploadFlashcardImage(file: File): Promise<UploadedImage> {
  const extension = EXTENSION_BY_TYPE[file.type] ?? "bin";
  const imageKey = `${FLASHCARD_IMAGE_FOLDER}/${crypto.randomUUID()}.${extension}`;

  await getImagesBucket().put(imageKey, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return { imageKey, imageUrl: getImagePublicUrl(imageKey) };
}

export function getImage(imageKey: string) {
  return getImagesBucket().get(imageKey);
}

export async function deleteImages(imageKeys: string[]): Promise<void> {
  if (imageKeys.length === 0) return;
  await getImagesBucket().delete(imageKeys);
}
