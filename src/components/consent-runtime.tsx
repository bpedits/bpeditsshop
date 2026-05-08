"use client";

import { useEffect } from "react";
import { CONSENT_UPDATE_EVENT, readConsent, type StoredConsent } from "@/lib/cookie-consent";

/** Nach Einwilligung: hier optional Analytics/Marketing-Skripte nachladen (z. B. gtag, Pixel). */
export function ConsentRuntime() {
  useEffect(() => {
    const apply = (detail?: StoredConsent) => {
      const c = detail ?? readConsent();
      if (!c) return;
      if (c.analytics) {
        /* z. B. GA4 / Matomo initialisieren */
      }
      if (c.marketing) {
        /* z. B. Remarketing-Pixel */
      }
    };

    apply();
    const onUpdate = (e: Event) => {
      const ce = e as CustomEvent<StoredConsent>;
      apply(ce.detail);
    };
    window.addEventListener(CONSENT_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(CONSENT_UPDATE_EVENT, onUpdate);
  }, []);

  return null;
}
