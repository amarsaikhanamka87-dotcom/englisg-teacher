import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** The Cloudflare R2 bucket that stores flashcard images. */
export function getImagesBucket(): R2Bucket {
  return getCloudflareContext().env.IMAGES_BUCKET;
}
