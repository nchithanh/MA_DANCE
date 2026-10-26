import path from "node:path";
import type { NextConfig } from "next";

/** Apex custom domain https://madancestudio.vn/ — no project prefix.
 *  Opt-in old project URL: GITHUB_PAGES_BASE_PATH=/MA_DANCE
 */
const basePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
