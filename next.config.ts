import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'images.alphafi.xyz',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
