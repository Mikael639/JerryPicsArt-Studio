function getSupabaseHostname() {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) return null;

  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
}

function getR2PublicHostname() {
  const r2PublicUrl = process.env.R2_PUBLIC_URL;
  if (!r2PublicUrl) return null;

  try {
    return new URL(r2PublicUrl).hostname;
  } catch {
    return null;
  }
}

const supabaseHostname = getSupabaseHostname();
const r2PublicHostname = getR2PublicHostname();

// Protections de navigateur appliquées à toutes les pages. Pas de Content-Security-Policy complète : elle risquerait de
// bloquer les scripts de Next.js ou de Vercel Analytics ; seule la partie « qui peut afficher le site dans un cadre » est posée.
const securityHeaders = [
  // Le site ne peut être affiché dans un cadre (iframe) que par lui-même : protège l'admin du « clickjacking ».
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // Le navigateur ne doit pas deviner le type d'un fichier (empêche de faire passer une image pour un script).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // L'adresse complète des pages n'est pas transmise aux autres sites quand on clique sur un lien sortant.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Le site n'utilise ni caméra, ni micro, ni position, ni paiement : on les interdit.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ne pas annoncer « X-Powered-By: Next.js » à chaque réponse.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // L'administration ne doit jamais apparaître dans un moteur de recherche (en plus de robots.txt).
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/gallery", destination: "/signature", permanent: true },
      { source: "/about", destination: "/a-propos", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https",
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      ...(r2PublicHostname
        ? [
            {
              protocol: "https",
              hostname: r2PublicHostname,
              pathname: "/**",
            },
          ]
        : []),
    ],
    // Les photos de R2 passent par lib/imageLoader.js (tailles fixes 480 / 960 / 1600 / 2400 px fabriquées une fois) :
    // plus de transformations d'images facturées par Vercel.
    loader: "custom",
    loaderFile: "./lib/imageLoader.js",
    deviceSizes: [480, 960, 1600, 2400],
    imageSizes: [48, 96, 256],
  },
};

export default nextConfig;
