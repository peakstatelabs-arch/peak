import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Next from inferring an incorrect workspace root locally.
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/guide",
        destination:
          "https://docs.google.com/forms/d/e/1FAIpQLSeDy-v4rubnQpTZifL1A1Lx6Ieh68G8cejMyJYybscI-yNUvg/viewform?usp=dialog",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
