/**
 * Einwilligungs-Präferenzen (Browser: localStorage).
 * Rechtlicher Rahmen: DSGVO + TTDSG (DE) — nicht-essenzielle Cookies/Storage nur nach Einwilligung.
 * Konkrete Tools (GA4, Meta, …) bitte mit Datenschutzrecht abstimmen und hier nur nach Zustimmung laden.
 */

export const CONSENT_STORAGE_KEY = "bavaria-peptides-cookie-consent-v2";
/** Früherer Binär-Schlüssel — wird beim Lesen entfernt, Nutzer wählt erneut granular. */
export const LEGACY_CONSENT_KEY = "bavaria-peptides-cookie-consent-v1";

export const CONSENT_UPDATE_EVENT = "bavaria-consent-update";
export const OPEN_COOKIE_PREFERENCES_EVENT = "bavaria-open-cookie-preferences";

export type StoredConsent = {
  v: 2;
  updatedAt: string;
  /** Reichweitenmessung (z. B. Matomo/GA4), nur nach Einwilligung laden. */
  analytics: boolean;
  /** Personalisierte Werbung / Remarketing — nur nach Einwilligung. */
  marketing: boolean;
};

export function parseConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<StoredConsent>;
    if (o.v !== 2) return null;
    return {
      v: 2,
      updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString(),
      analytics: Boolean(o.analytics),
      marketing: Boolean(o.marketing),
    };
  } catch {
    return null;
  }
}

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const v2 = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
    if (v2) return v2;
    if (localStorage.getItem(LEGACY_CONSENT_KEY) != null) {
      localStorage.removeItem(LEGACY_CONSENT_KEY);
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeConsent(partial: Pick<StoredConsent, "analytics" | "marketing">): StoredConsent {
  const next: StoredConsent = {
    v: 2,
    updatedAt: new Date().toISOString(),
    analytics: partial.analytics,
    marketing: partial.marketing,
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Speicher voll / private mode */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<StoredConsent>(CONSENT_UPDATE_EVENT, { detail: next }));
  }
  return next;
}

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  return readConsent()?.marketing === true;
}
