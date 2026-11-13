import { NextResponse } from "next/server";
import { validateImageFile } from "@/features/image-upload/image-upload.schema";
import { uploadFlashcardImage } from "@/features/image-upload/image-storage.service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file was sent." }, { status: 400 });
  }

  const validation = validateImageFile(file);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const uploadedImage = await uploadFlashcardImage(file);
    return NextResponse.json(uploadedImage, { status: 201 });
  } catch (error) {
    console.error("Image upload to R2 failed", error);
    return NextResponse.json({ error: "Image upload failed. Please try again." }, { status: 500 });
  }
}
