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
        source: "/api/:path*",
         destination: "https://skrill-bridge-backend.vercel.app/api/:path*",
        // destination: "http://localhost:5000/api/:path*",  // local backend
      },
    ];
  },
};

export default nextConfig;