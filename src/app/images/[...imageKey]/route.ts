import { getImage } from "@/features/image-upload/image-storage.service";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function GET(_request: Request, { params }: { params: Promise<{ imageKey: string[] }> }) {
  const { imageKey } = await params;
  const image = await getImage(imageKey.join("/"));

  if (!image) return new Response("Image not found", { status: 404 });

  return new Response(image.body, {
    headers: {
      "Content-Type": image.httpMetadata?.contentType ?? "application/octet-stream",
      // Keys are random UUIDs and never overwritten, so they can be cached forever.
      "Cache-Control": `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`,
    },
  });
}
