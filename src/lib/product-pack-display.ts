/**
 * Listenstrings können Herstellergebinde enthalten („× n vials“). Für die Anzeige
 * werden rein darstellungsbezogene Mengenhinweise entfernt.
 */
export function displayPackForShop(pack: string): string {
  let s = pack.trim();
  s = s.replace(/\s*[×x]\s*\d+\s*vials?\b/gi, "");
  s = s.replace(/\b\d+\s*vials?\b/gi, "");
  s = s.replace(/\s*[×x]\s*\d+\s*$/i, "");
  s = s.replace(/\s+/g, " ").replace(/^[·•,;]+\s*|\s*[·•,;]+$/g, "").trim();
  if (!s) return "je Vial";
  return s;
}
