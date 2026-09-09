/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 65, 70, 75, 80, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wsrbnmovzebjxvsacgvb.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        pathname: "/**",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Permanent redirects for corrupted GSC product URLs + blog page noise
  async redirects() {
    return [
      {
        source: "/product/-idnight-eart-endant-ecklace-51eb751f",
        destination: "/necklaces",
        permanent: true,
      },
      {
        source: "/product/-odern-bstract-ave-oop-arrings-448bfb2e",
        destination: "/earrings",
        permanent: true,
      },
      {
        source: "/product/-olden-amboo-exagon-uggie-oops-271377b3",
        destination: "/earrings",
        permanent: true,
      },
      {
        source: "/product/-olden-eart-loom-uggie-oop-arrings-257ff4b5",
        destination: "/earrings",
        permanent: true,
      },
      {
        source: "/product/-tellar-rescent-old-uggie-oops-09826d2c",
        destination: "/earrings",
        permanent: true,
      },
      {
        source: "/product/-wisted-ope-olden-val-oops-5a25c8ea",
        destination: "/earrings",
        permanent: true,
      },
      {
        source: "/blog",
        has: [{ type: "query", key: "page", value: "0" }],
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog",
        has: [{ type: "query", key: "page", value: "1" }],
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
