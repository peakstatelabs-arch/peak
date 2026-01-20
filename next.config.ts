import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Next from inferring an incorrect workspace root locally.
    root: __dirname,
  },
};

export default nextConfig;
