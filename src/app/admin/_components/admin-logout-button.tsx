"use client";

import { useState } from "react";

export function AdminLogoutButton() {
  const [busy, setBusy] = useState(false);

  async function onLogout() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/admin/login";
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={busy}
      className="rounded-full border border-black/[0.12] bg-white px-3 py-1.5 text-[12px] font-medium text-foreground transition hover:bg-black/[0.04] disabled:opacity-50"
    >
      {busy ? "..." : "Abmelden"}
    </button>
  );
}
