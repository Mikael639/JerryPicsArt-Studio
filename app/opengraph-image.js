import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { siteConfig } from "../lib/siteConfig";
import { getPublicPhotos } from "../lib/photoRepository";

export const alt = `${siteConfig.name} : photographe éditorial à Paris, Fashion Week, mariage et événements`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

// Triptyque : Fashion Week, mariage, événement. Photos repérées par un morceau de leur nom de fichier.
const TRIPTYCH = [
  { match: "pfw-011025-jpa-102", position: "50% 30%" },
  { match: "silhouette-au-flash", position: "50% 35%" },
  { match: "gala-fc-1ere-edition-jpa-442", position: "50% 25%" },
];

// Le fichier est lu au moment de la construction (l'image est générée une fois, puis servie telle quelle).
const font = (name) => readFile(path.join(process.cwd(), "app", "fonts", name));

async function loadPhotos() {
  try {
    const photos = await getPublicPhotos({ limit: 500 });
    return TRIPTYCH.map(({ match, position }) => {
      const photo = photos.find((item) => item.src?.toLowerCase().includes(match));
      return { src: photo?.src || null, position };
    });
  } catch {
    return TRIPTYCH.map(({ position }) => ({ src: null, position }));
  }
}

export default async function OpengraphImage() {
  const [photos, serif, sans] = await Promise.all([
    loadPhotos(),
    font("og-CormorantGaramond-500.ttf"),
    font("og-PlusJakartaSans-700.ttf"),
  ]);

  const image = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0c0a08" }}>
        {photos.map((photo, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              width: index === 1 ? 398 : 399,
              height: "100%",
              marginLeft: index === 0 ? 0 : 3,
              background: "#17120e",
            }}
          >
            {photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.src}
                alt=""
                width={399}
                height={630}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: photo.position }}
              />
            ) : null}
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: 44,
            backgroundImage: "linear-gradient(to bottom, rgba(12,10,8,0), rgba(12,10,8,0.9) 55%, rgba(12,10,8,0.96))",
            color: "#f5efe6",
          }}
        >
          <div style={{ display: "flex", fontFamily: "Jakarta", fontSize: 20, letterSpacing: 9, color: "#b07f5a" }}>
            PARIS
          </div>
          <div style={{ display: "flex", fontFamily: "Cormorant", fontSize: 112, lineHeight: 1, marginTop: 6 }}>
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Jakarta",
              fontSize: 21,
              letterSpacing: 5,
              marginTop: 16,
              color: "rgba(245,239,230,0.9)",
            }}
          >
            FASHION WEEK  ·  MARIAGE  ·  ÉVÉNEMENTS
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: serif, weight: 500, style: "normal" },
        { name: "Jakarta", data: sans, weight: 700, style: "normal" },
      ],
    }
  );

  // WhatsApp n'affiche pas de miniature au-delà d'environ 300 Ko : le PNG (plus d'1 Mo) devient un JPEG léger.
  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
