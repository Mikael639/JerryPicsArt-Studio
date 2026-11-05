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

/** @type {import('next').NextConfig} */
const nextConfig = {
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
