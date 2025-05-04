import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This disables ESLint during `next build`
  },
  /* other config options here */
};

export default nextConfig;
