import { NextResponse } from "next/server";
import { IMAGE_BUCKETS, ensureVariant, isVariantSource } from "../../../../lib/imageVariants";

// Photos du site en tailles fixes : /media/960/univers/defiles/01-photo.jpg. Voir lib/imageLoader.js.
// Le réseau de Vercel garde la réponse un an (l'adresse d'une photo ne change jamais : chaque envoi a un nom neuf).
export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { width, path } = await params;
  const size = Number(width);
  const storagePath = (path || []).join("/");

  if (!IMAGE_BUCKETS.includes(size) || !isVariantSource(storagePath)) {
    return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
  }

  try {
    const variant = await ensureVariant(storagePath, size);
    if (!variant) {
      return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
    }
    return new NextResponse(variant.buffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Image indisponible", { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
