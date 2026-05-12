/**
 * Browser- und Server-sicher: keine Node-only-Imports.
 * Wird sowohl in API-Routes (Mail-HTML) als auch in Client-/Shared-Utilities verwendet.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
