"use client";

import { useState } from "react";

export function VerifyForm({ nextHref }: { nextHref: string }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error || "Code ist falsch.");
        setBusy(false);
        return;
      }
      window.location.href = nextHref || "/admin";
    } catch (err) {
      console.error(err);
      setError("Verbindung fehlgeschlagen. Bitte erneut versuchen.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-xl border border-black/[0.08] bg-white p-5 shadow-sm">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Einmal-Code</span>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          required
          autoFocus
          className="mt-1.5 h-14 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-center text-[24px] tracking-[0.4em] tabular-nums outline-none ring-tint focus:ring-2"
          placeholder="••••••"
        />
      </label>
      {error ? (
        <p className="rounded-lg border border-[#b00020]/20 bg-[#b00020]/[0.06] px-3 py-2 text-[13px] text-[#7a0000]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy || code.length !== 6}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-tint px-5 text-[14px] font-semibold text-white transition hover:opacity-92 disabled:opacity-50"
      >
        {busy ? "Wird geprüft..." : "Login bestätigen"}
      </button>
      <p className="text-center text-[12px] text-muted">
        Kein Code erhalten? <a href="/admin/login" className="font-medium text-tint hover:underline">Neu einloggen</a>
      </p>
    </form>
  );
}
