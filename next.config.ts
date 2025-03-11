import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   typescript: {
      ignoreBuildErrors: true,
   },
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "**",
         },
         {
            protocol: "http",
            hostname: "**",
         },
      ],
      unoptimized: true, // Add this for static exports if needed
   },
   eslint: {
      ignoreDuringBuilds: true, // This will ignore all ESLint errors during build
   },
};

export default nextConfig;