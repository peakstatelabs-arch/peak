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
  async redirects() {
    return [
      { source: "/", destination: "/portal/dashboard", basePath: false, permanent: false },
    ];
  },
};

export default nextConfig;
