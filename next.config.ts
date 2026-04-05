import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://skrill-bridge-backend.vercel.app/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;