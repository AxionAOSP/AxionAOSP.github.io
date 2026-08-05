import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // basePath no longer needed for root domain deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
