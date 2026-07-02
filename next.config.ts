import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["assets.aceternity.com", "pbs.twimg.com"],
  },
};

export default nextConfig;
