import type { NextConfig } from "next";

/**
 * Build performance:
 * - `experimental.optimizePackageImports` — SWC resolves only used exports from
 *   barrel packages (lucide-react, recharts, date-fns), cutting module graph size.
 * - `eslint.ignoreDuringBuilds` — ESLint runs via `npm run lint` / `npm run verify`
 *   instead of blocking every `next build` (large win on medium+ apps).
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3333",
        pathname: "/uploads/**",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
    // Only lint app code (faster `npm run lint` than scanning the whole tree).
    dirs: ["src"],
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
    ],
  },
};

export default nextConfig;
