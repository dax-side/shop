import type { NextConfig } from "next";

// The app (and the app running in a browser via Expo web) calls these routes. Auth is a Bearer
// token, never a cookie, so a wildcard origin without credentials is safe.
const corsHeaders = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, PATCH, PUT, DELETE, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
  { key: "Access-Control-Max-Age", value: "86400" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 for thumbnails, 85 for large product photos.
    qualities: [75, 85],
  },
  async headers() {
    return [{ source: "/api/:group(products|cart|me|mobile|saved|orders)/:path*", headers: corsHeaders }];
  },
};

export default nextConfig;
