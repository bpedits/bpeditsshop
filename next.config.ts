import type { NextConfig } from "next";

/**
 * Kein `output: "export"`: Stripe-Checkout benötigt die API-Route `/api/checkout`.
 * Deployment: `next build` + `next start`, Vercel, Node-Hosting — nicht als reines
 * statisches `out/`-Hosting ohne Server.
 */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
