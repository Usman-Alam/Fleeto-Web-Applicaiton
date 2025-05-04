import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This disables ESLint during `next build`
  },
  typescript: {
    // Skip type checking during builds
    ignoreBuildErrors: true,
  },
  /* other config options here */
};

export default nextConfig;
