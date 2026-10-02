import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 for thumbnails, 85 for large product photos.
    qualities: [75, 85],
  },
};

export default nextConfig;
