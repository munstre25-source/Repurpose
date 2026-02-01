import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable experimental features if needed
  },
  async redirects() {
    return [
      {
        source: "/content-repurposing-for-:persona/:useCase",
        destination: "/content-repurposing/for/:persona/:useCase",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
