"use client";

import { useEffect } from "react";

export function SuccessRedirect({ to = "/", afterMs = 2500 }: { to?: string; afterMs?: number }) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      window.location.assign(to);
    }, afterMs);
    return () => window.clearTimeout(t);
  }, [to, afterMs]);

  return null;
}

