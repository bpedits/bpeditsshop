/**
 * Gleiches Banner wie Open Graph — konsistente Link-Vorschau (X, Slack, …).
 * `runtime` muss in dieser Datei stehen (kein Re-Export), siehe Next.js Segment-Config.
 */
export const runtime = "nodejs";

export { default, alt, size, contentType } from "./opengraph-image";
