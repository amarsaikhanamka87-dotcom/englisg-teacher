import { validateImageFile, type UploadedImage } from "./image-upload.schema";

export async function uploadImageFromBrowser(file: File): Promise<UploadedImage> {
  const validation = validateImageFile(file);
  if (!validation.ok) throw new Error(validation.error);

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/images", { method: "POST", body: formData });
  const body = (await response.json()) as UploadedImage & { error?: string };

  if (!response.ok) throw new Error(body.error ?? "Image upload failed.");
  return body as UploadedImage;
}
