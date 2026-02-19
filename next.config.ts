import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    mcpServer: true,
  },
};

export default nextConfig;
