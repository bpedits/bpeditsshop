import type { NextConfig } from "next";

/**
 * Kein `output: "export"`: API-Routen (Kontakt, Bank-Bestellung, …) benötigen einen Node-Server.
 * Deployment: `next build` + `next start`, Vercel, Node-Hosting — nicht als reines
 * statisches `out/`-Hosting ohne Server.
 */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
