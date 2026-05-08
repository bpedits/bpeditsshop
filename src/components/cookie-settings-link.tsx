"use client";

import type { ReactNode } from "react";
import { openCookiePreferences } from "@/lib/cookie-consent";

type Props = { className?: string; children?: ReactNode };

/** Öffnet das Cookie-Panel (Banner) erneut — z. B. aus dem Footer. */
export function CookieSettingsLink({ className, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => openCookiePreferences()}
      className={className ?? "text-left text-[13px] text-muted transition hover:text-foreground"}
    >
      {children ?? "Cookie-Einstellungen"}
    </button>
  );
}
