/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/portal",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.peakstate.shop" },
      { protocol: "https", hostname: "peakstate.shop" },
    ],
  },
};

export default nextConfig;
