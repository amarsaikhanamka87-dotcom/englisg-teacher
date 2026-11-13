import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;

// Gives `next dev` local D1 + R2 bindings from wrangler.jsonc
initOpenNextCloudflareForDev();
